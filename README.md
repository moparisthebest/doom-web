# Doom Multiplayer WebSockets

Try it in your browser at <https://doom.moparisthe.best>

This repo contains:

- HTML+JavaScript front-end to play the [doom-wasm][3] port of [chocolate-doom][5] single player and multiplayer
- WebSockets relay server to support multiplayer play

## Website

Assets are in [./assets][1]

You need the following files in ```./assets``` (not included in this repo):

 * [doom1.wad][2] (md5sum: f0cefca49926d00903cf57551d901abe)
 * [websockets-doom.js][3] - get it from doom-wasm src directory after compilation
 * [websockets-doom.wasm][3] - get it from doom-wasm src directory after compilation
 * [websockets-doom.wasm.map][3] - get it from doom-wasm src directory after compilation

### To publish:

 1. Copy files in ./assets/ to a webserver capable of serving static files. If you don't want multiplayer skip the rest of the steps, you are done.
 2. Install [NodeJS and npm][4]
 2. Run `cd scripts && npm ci && ./router.js 8001` to run the WebSocket router on port 8001
 3. Configure your webserver to proxy websocket requests from `/ws/` to the above router

## Running Multiplayer Doom locally

You can run the Website, Wasm Doom and Multiplayer locally.

 1. Install [NodeJS and npm][4]
 2. Run `cd scripts && npm ci && ./router.js 8001 8000` to run the WebSocket router on port 8001 and the static webserver on port 8000
 3. Point your browser to http://0.0.0.0:8000

## Credits

Most of the credit goes to the [chocolate-doom][5] community, who maintains the best doom source port.  [Cloudflare](https://blog.cloudflare.com/doom-multiplayer-workers/) wrote the initial version of this multiplayer webasm port, but relying on proprietary cloudflare technology, and not in a way that could possibly be upstreamed, this project aims to remedy those two failures.

## Todo:

 * Support user-supplied wads
 * Custom keymap support
 * Game Save support
 * Music support
 * Clean up [doom-wasm][3] code and upstream it to [chocolate-doom][5] (either out of incompetence, malice, or laziness, cloudflare didn't fork this, and ran a source code formatter before applying their changes, so it's a total rewrite effort to get this done)

[1]: assets
[2]: http://distro.ibiblio.org/pub/linux/distributions/slitaz/sources/packages/d/doom1.wad
[3]: https://github.com/cloudflare/doom-wasm
[4]: https://github.com/Schniz/fnm
[5]: https://github.com/chocolate-doom/chocolate-doom
