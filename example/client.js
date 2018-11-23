/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const { RpcClient } = require('sofa-rpc-node').client;
const { ZookeeperRegistry } = require('sofa-rpc-node').registry;
const protocol = require('..');
const logger = console;

// 1. 创建 zk 注册中心客户端
const registry = new ZookeeperRegistry({
  logger,
  address: '127.0.0.1:2181',
});

async function invoke() {
  // 2. 创建 RPC Client 实例
  const client = new RpcClient({
    logger,
    registry,
    protocol,
  });
  // 3. 创建服务的 consumer
  const consumer = client.createConsumer({
    interfaceName: 'com.nodejs.test.TestService',
  });
  // 4. 等待 consumer ready（从注册中心订阅服务列表...）
  await consumer.ready();

  // 5. 执行泛化调用
  const result = await consumer.invoke('plus', [1, 2], { responseTimeout: 3000 });
  console.log('1 + 2 = ' + result);
}

invoke().catch(console.error);
