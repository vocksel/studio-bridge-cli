# Studio Bridge CLI

[main-repo]: https://github.com/vocksel/studio-bridge

Synchronize Lua code from your computer to Roblox Studio.

This is the CLI for Studio Bridge, a two-part project made up of a Roblox plugin and an HTTP server (managed by the CLI). See the [main repository][main-repo] for full documentation.

```shell
# This is a CLI and should be installed globally.
$ npm install -g studio-bridge
# Once installed, you'll have `studio-bridge` accessible on the command-line.
# Pass in the `help` flag for possible arguments and flags.
$ studio-bridge --help
```

## Usage

With the plugin and CLI installed, you can run the `studio-bridge` command with the directory you want to serve up.

```shell
$ studio-bridge src/
Server started on http://localhost:8080
Using: /path/to/src/
```

The server hosting the contents of your project are served up as JSON at the above URL. With `HttpService.HttpEnabled` set to `true` in your game, you can now use the plugin to sync the files to Studio.

The [main repository][main-repo] has a much more comprehensive example, along with full details on how to structure your projects so everything shows up in the right places.
