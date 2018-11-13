# HTTP backend with RuntimeJS

A Hacker News clone backend, written for running in a [runtime.js](http://runtimejs.org/) unikernel.
The backend send a static `index.html` with the CSS, JS within and provide an CURL endpoint at `/api/posts` and return in a `JSON`:

```json
[
   {
        title: String,
        points: int,
        author: string,
        timeToRead: int,
        comments: int,
    },
	...
]
```

NOTE: At the moment KVM is the only supported hypervisor

## Requirements

### Packages

If you want to run `runtime-cli` from any directory, install command line tool runtime-cli globally, it will add runtime command to the shell:

`npm install runtime-cli -g`

Otherwise, `runtime-cli` is imported by the current project so you can invoke it with `./node_modules/.bin/runtime start` from the project root directory.

Make sure QEMU is installed, it enables running applications locally:

```bash
brew install qemu           # OSX
sudo apt-get install qemu   # Ubuntu
sudo pacman -S              # Arch
```

### Fix eshttp

`eshttp` is a portable pure JavaScript ES6 HTTP library. Includes fast streaming regex-free parser for HTTP/1.0 and HTTP/1.1.
We use this library because it's compatible with runtimeJs due to his target build and usage module of runtimeJs.
But the library seem's to have a bug in the parsing of a HTTP response. You can fix that by applying this patch in your `node_modules` or your local cloned `eshttp`:


```
diff --git i/lib/http-parser.js w/lib/http-parser.js
index 518354b..c26c636 100644
--- i/lib/http-parser.js
+++ w/lib/http-parser.js
@@ -320,7 +320,7 @@ class HttpParser {
             this._state = PARSER_STATE_DONE;
           }

-          return;
+          continue;
         }

         // multiline header value
```

## Build

Setup the project using npm:

`npm install`

## Run

The backend listen on port `9000` and make a HTTP connection to the database with the port `8080`.
You can modify this behavior by editing `index.js`.
*WARN*: There is a lack of configuration for now so you have to modify the ip address of the database in `new HttpClient('192.168.1.102', 8080);`.

Run project locally in QEMU:

`runtime start`

NOTE: Take a look at the options of `start` command (e.g.: --net, --netdump, --port, --list-files, --ignore)

## For development

This repository provide a fake database which deliver static hacker news posts in a `JSON`.

`node tests/fakedb.js` (the server listen on port `8080`)

To watch current directory and automatically restart runtime.js VM

`runtime watch`

You can mount the disk image use by runtime.js with `qemu-nbd`
