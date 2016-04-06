# Scaley

This is just a quick little test of Electron and its native usb integrations with a scale.

_Note: the scale needs to be the PB usb scale with vendorId 3471 and productId 512. You also need to be connected to the internet to use it, since some dependencies are loaded via cdn._

## Setup development environment

```
$ npm install
```

### Run using electron

```
$ npm start
```

### Build packaged versions

#### Mac

```
$ npm run build
```

#### Windows

```
$ npm run build-win
```

#### All

```
$ npm run build-all
```

Builds the app for OS X, Linux, and Windows, using [electron-packager](https://github.com/maxogden/electron-packager).

_Note: you will need to build the windows version on a Windows machine because of node-hid. See [node-hid](https://github.com/node-hid/node-hid#compiling-from-source)._
