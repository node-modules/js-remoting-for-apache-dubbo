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

[Dubbo](http://dubbo.apache.org/en-us/) Protocol Nodejs Implement

- Common Exchange Packet

```
 0      1      2             4             6             8            10            12
 +------+------+------+------+------+------+------+------+------+------+------+------+
 |    MAGIC    | flag |status|                        packet id                      |
 +-------------+-------------+-------------+-------------+-------------+-------------+
 |        body length        |                          body                         |
 +---------------------------+                                                       +
 |                                     ... ...                                       |
 +-----------------------------------------------------------------------------------+
```

- Dubbo Request Packet

```
 0      1      2             4             6             8            10            12
 +------+------+------+------+------+------+------+------+------+------+------+------+
 |    MAGIC    | flag |      |                        packet id                      |
 +-------------+-------------+-----------------+-------------------+-----------------+
 |        body length        |  dubbo version  |   service path    | service version |
 +---------------+-----------+-----------+-----+-------------------+-----------------+
 |  method name  | arguments description |                                           |
 +---------------+-----------------------+                arguments                  +
 |                                        ...  ...                                   |
 +-----------------------------------------------------------------------------------+
 |                                   attachments                                     |
 +-----------------------------------------------------------------------------------+
```

- Dubbo Response Packet

packet status ok
```
 0      1      2             4             6             8            10            12
 +------+------+------+------+------+------+------+------+------+------+------+------+
 |    MAGIC    | flag |status|                        packet id                      |
 +-------------+-------------+---------------------------+---------------------------+
 |        body length        |        result flag        |                           |
 +---------------------------+---------------------------+                           +
 |                             result or exception ...                               |
 +-----------------------------------------------------------------------------------+
```

packet status not ok
```
 0      1      2             4             6             8            10            12
 +------+------+------+------+------+------+------+------+------+------+------+------+
 |    MAGIC    | flag |status|                        packet id                      |
 +-------------+-------------+---------------------------+---------------------------+
 |        body length        |                   error message                       |
 +---------------------------+-------------------------------------------------------+
```

## Install

```bash
$ npm install dubbo-remoting --save
```

## Usage

You can use this dubbo protocol implementation with the [sofa-rpc-node](https://github.com/alipay/sofa-rpc-node)

### 1. Install & Launch zk

```bash
$ brew install zookeeper

$ zkServer start
ZooKeeper JMX enabled by default
Using config: /usr/local/etc/zookeeper/zoo.cfg
Starting zookeeper ... STARTED
```

### 2. Expose a dubbo service

```js
'use strict';

const { RpcServer } = require('sofa-rpc-node').server;
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;
const protocol = require('dubbo-remoting');

const logger = console;

// 1. create zk registry client
const registry = new ZookeeperRegistry({
  logger,
  address: '127.0.0.1:2181',
});

// 2. create rpc server
const server = new RpcServer({
  logger,
  registry,
  port: 12200,
  protocol,
});

// 3. add service
server.addService({
  interfaceName: 'com.nodejs.test.TestService',
}, {
  async plus(a, b) {
    return a + b;
  },
});

// 4. launch the server
server.start()
  .then(() => {
    server.publish();
  });
```

### 3. Call the dubbo service

```js
'use strict';

const { RpcClient } = require('sofa-rpc-node').client;
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;
const protocol = require('dubbo-remoting');
const logger = console;

// 1. create zk registry client
const registry = new ZookeeperRegistry({
  logger,
  address: '127.0.0.1:2181',
});

async function invoke() {
  // 2. create rpc client with dubbo protocol
  const client = new RpcClient({
    logger,
    registry,
    protocol,
  });
  // 3. create rpc service consumer
  const consumer = client.createConsumer({
    interfaceName: 'com.nodejs.test.TestService',
  });
  // 4. wait consumer ready
  await consumer.ready();

  // 5. call the service
  const result = await consumer.invoke('plus', [1, 2], { responseTimeout: 3000 });
  console.log('1 + 2 = ' + result);
}

invoke().catch(console.error);
```
