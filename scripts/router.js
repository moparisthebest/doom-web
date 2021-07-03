#!/usr/bin/env node

/*
 * websocket server for chocolate-doom fork
 * Copyright (C) 2021  Travis Burtrum (moparisthebest)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 * for local testing run `./router.js 8001 8000` which puts HTTP at 8000, WebSockets at 8001
 * for production, just run `./router.js 8001` which only listens WebSockets at 8001 (set nginx to forward)
 */

let websocketPort = process.argv[2] || 8001;
let webserverPort = process.argv[3];

console.log(`websocket listening on port ${websocketPort}`);
const WebSocket = require('ws')
const wss = new WebSocket.Server({
  port: websocketPort,
  noServer: true,
  perMessageDeflate: false,
  clientTracking: false,
  verifyClient: false,
})

const games = new Map();
let gamesCount = 0;
let clientCount = 0;

wss.on('connection', function npm(ws, req) {
    console.log('new ws connection');
    ++clientCount;
    const game = req.url.substring(req.url.lastIndexOf('/') + 1, req.url.length);
    console.log(`game: ${game}`);
    let clients = games.get(game);
    if (clients === undefined) {
        clients = [];
        games.set(game, clients);
        ++gamesCount;
    }
    clients.push(ws);

  ws.on('message', function incoming(data) {
    if (ws.from === undefined) {
        ws.from = data.slice(4, 8).readUInt32LE();
    }
    let to = data.slice(0, 4).readUInt32LE()
    // console.log(`< ${data.toString('hex')} (from: ${ws.from}, to ${to})`)
    // send this packet to the corresponding client
      clients.forEach(function each(client) {
        if (
          client.from === to &&
          client.readyState === WebSocket.OPEN
        ) {
          //console.log(`> ${data.slice(4).toString('hex')} (to: ${to})`)
          client.send(data.slice(4))
        }
      });
  });

  ws.on('close', function close() {
    let i = clients.map(e => e.from).indexOf(ws.from);
    if (i != -1) {
      clients.splice(i, 1)
      --clientCount;
    }
    if (clients.length === 0) {
      games.delete(game);
      --gamesCount;
    }
    console.log(`client ${ws.from} disconnected from game ${game}`)
  });
});

wss.on('error', err => {
  console.log('we got an error:\n')
  console.log(err)
})

setInterval(() => {
  console.log(`# games: ${gamesCount} clients: ${clientCount}`)
}, 5000);

if (webserverPort === undefined) {
    console.log("not listening on webserverPort, this is what you want for production");
} else {
    console.log(`webserver listening on port ${websocketPort}, DO NOT DO THIS IN PRODUCTION, use nginx instead!`);

const fs = require('fs')
const url = require('url')
const http = require('http')
const path = require('path')

const server = http.createServer()
const root = __dirname + '/../assets'

mimes = {
  html: 'text/html',
  css: 'text/css',
  wad: 'application/binary',
  cfg: 'text/plain',
  ico: 'text/plain',
  js: 'text/javascript',
  wasm: 'application/wasm',
  map: 'text/plain',
  png: 'image/png',
  woff2: 'font/woff2',
}

server.on('request', (request, response) => {
  const { method, url } = request;
        console.log(`GET ${url}`);

  if (method === 'GET') {
        // no directories under assets for now
        const safe_url = url.substring(url.lastIndexOf('/'), url.length);
        console.log(`GET ${safe_url}`);
        
        var name = safe_url == '/' ? 'index.html' : safe_url;
        file = path.join(root, '/', name)
        if (!fs.existsSync(file)) file = path.join(root, '/index.html')
        var ext = file.split('.').slice(-1)[0]
        //console.log(`200 ${file} (${mimes[ext]})`)
        response.statusCode = 200
        response.setHeader('Content-Type', mimes[ext])
        response.write(fs.readFileSync(file, null))
        response.end()
  }
})

console.log(`Point your browser to http://0.0.0.0:${webserverPort}`);
server.listen(webserverPort)

}
