# dubbo-remoting
dubbo remoting

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/dubbo-remoting.svg?style=flat-square
[npm-url]: https://npmjs.org/package/dubbo-remoting
[travis-image]: https://img.shields.io/travis/node-modules/dubbo-remoting.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/dubbo-remoting
[codecov-image]: https://codecov.io/gh/node-modules/dubbo-remoting/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/node-modules/dubbo-remoting
[david-image]: https://img.shields.io/david/node-modules/dubbo-remoting.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/dubbo-remoting
[snyk-image]: https://snyk.io/test/npm/dubbo-remoting/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/dubbo-remoting
[download-image]: https://img.shields.io/npm/dm/dubbo-remoting.svg?style=flat-square
[download-url]: https://npmjs.org/package/dubbo-remoting

## Introduction

dubbo protocol nodejs implement

```
 0     1     2           4           6           8          10           12
 +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 |   MAGIC   |flag |     |                     id                        |
 +-----------+-----------+-----------+-----------+-----------+-----------+
 |     body length       |                      body                     |
 +-----------------------+                                               +
 |                               ... ...                                 |
 +-----------------------------------------------------------------------+
```

## Install

```bash
$ npm install dubbo-remoting --save
```

## API

- `decode(url)`
  - @param {String} connection url
  - @return {DubboDecoder}

  ```js
  const net = require('net');
  const protocol = require('dubbo-remoting');
  const url = 'dubbo://127.0.0.0:12200/com.xxx.DemoService?_TIMEOUT=2000&_p=4&application=xx&default.service.filter=dragoon&dubbo=2.6.1&interface=com.xxx.DemoService&methods=sayHello&pid=25381&revision=2.6.1&side=provider&threads=300&timeout=2000&timestamp=1487081081346&v=2.0&version=1.0.0';
  const decoder = protocol.decode()
  
  const socket = net.connect(12200, '127.0.0.1');
  socket.pipe(decoder);
  
  decoder.on('packet', p => {
    console.log('packet', p);
  });
  socket.on('connect', () => {
    console.log('connected');
  });
  socket.on('error', err => {
    console.error('err', err);
  });

  const Request = protocol.Request;
  const Invocation = protocol.Invocation;
  const req = new Request();
  req.data = new Invocation({
    methodName: 'sayHello',
    args: ['zongyu'],
    attachments: {
      path: 'com.xxx.DemoService',
      interface: 'com.xxx.DemoService',
      version: '1.0.0',
      timeout: 2000,
    },
  });
  socket.write(req.encode());
  ```

- `DubboDecoder` an writable stream, your can pipe socket to it
- `Request` the Dubbo request
- `Invocation` the abstraction of the Dubbo service invocation
- `Response` the Dubbo response
- `Result` the abstraction of the Dubbo service result
