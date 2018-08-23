'use strict';

const { RpcServer } = require('sofa-rpc-node').server;
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;
const protocol = require('..');

const logger = console;

// 1. 创建 zk 注册中心客户端
const registry = new ZookeeperRegistry({
  logger,
  address: '127.0.0.1:2181', // 需要本地启动一个 zkServer
});

// 2. 创建 RPC Server 实例
const server = new RpcServer({
  logger,
  registry, // 传入注册中心客户端
  port: 12200,
  protocol,
});

// 3. 添加服务
server.addService({
  interfaceName: 'com.nodejs.test.TestService',
}, {
  async plus(a, b) {
    return a + b;
  },
});

// 4. 启动 Server 并发布服务
server.start()
  .then(() => {
    server.publish();
  });
