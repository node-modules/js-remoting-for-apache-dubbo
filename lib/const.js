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

exports.PROVIDER = 'provider';
exports.CONSUMER = 'consumer';
exports.REGISTER = 'register';
exports.UNREGISTER = 'unregister';
exports.SUBSCRIBE = 'subscribe';
exports.UNSUBSCRIBE = 'unsubscribe';
exports.CATEGORY_KEY = 'category';
exports.PROVIDERS_CATEGORY = 'providers';
exports.CONSUMERS_CATEGORY = 'consumers';
exports.ROUTERS_CATEGORY = 'routers';
exports.CONFIGURATORS_CATEGORY = 'configurators';
exports.DEFAULT_CATEGORY = exports.PROVIDERS_CATEGORY;
exports.ENABLED_KEY = 'enabled';
exports.DISABLED_KEY = 'disabled';
exports.VALIDATION_KEY = 'validation';
exports.CACHE_KEY = 'cache';
exports.DYNAMIC_KEY = 'dynamic';
exports.DUBBO_PROPERTIES_KEY = 'dubbo.properties.file';
exports.DEFAULT_DUBBO_PROPERTIES = 'dubbo.properties';
exports.SENT_KEY = 'sent';
exports.DEFAULT_SENT = false;
exports.REGISTRY_PROTOCOL = 'registry';
exports.$INVOKE = '$invoke';
exports.$ECHO = '$echo';
exports.DEFAULT_PROXY = 'javassist';
exports.DEFAULT_PAYLOAD = 8 * 1024 * 1024; // 8M
exports.DEFAULT_CLUSTER = 'failover';
exports.DEFAULT_DIRECTORY = 'dubbo';
exports.DEFAULT_LOADBALANCE = 'random';
exports.DEFAULT_PROTOCOL = 'dubbo';
exports.DEFAULT_EXCHANGER = 'header';
exports.DEFAULT_TRANSPORTER = 'netty';
exports.DEFAULT_REMOTING_SERVER = 'netty';
exports.DEFAULT_REMOTING_CLIENT = 'netty';
exports.DEFAULT_REMOTING_CODEC = 'dubbo';
exports.DEFAULT_REMOTING_SERIALIZATION = 'hessian2';
exports.DEFAULT_HTTP_SERVER = 'servlet';
exports.DEFAULT_HTTP_CLIENT = 'jdk';
exports.DEFAULT_HTTP_SERIALIZATION = 'json';
exports.DEFAULT_CHARSET = 'UTF-8';
exports.DEFAULT_WEIGHT = 100;
exports.DEFAULT_FORKS = 2;
exports.DEFAULT_THREAD_NAME = 'Dubbo';
exports.DEFAULT_CORE_THREADS = 0;
exports.DEFAULT_THREADS = 200;
exports.DEFAULT_QUEUES = 0;
exports.DEFAULT_ALIVE = 60 * 1000;
exports.DEFAULT_CONNECTIONS = 0;
exports.DEFAULT_ACCEPTS = 0;
exports.DEFAULT_IDLE_TIMEOUT = 600 * 1000;
exports.DEFAULT_HEARTBEAT = 60 * 1000;
exports.DEFAULT_TIMEOUT = 1000;
exports.DEFAULT_CONNECT_TIMEOUT = 3000;
exports.DEFAULT_RETRIES = 2;
// default buffer size is 8k.
exports.DEFAULT_BUFFER_SIZE = 8 * 1024;
exports.MAX_BUFFER_SIZE = 16 * 1024;
exports.MIN_BUFFER_SIZE = 1 * 1024;
exports.REMOVE_VALUE_PREFIX = '-';
exports.HIDE_KEY_PREFIX = '.';
exports.DEFAULT_KEY_PREFIX = 'default.';
exports.DEFAULT_KEY = 'default';
exports.LOADBALANCE_KEY = 'loadbalance';
// key for router type, for e.g., 'script'/'file',  corresponding to ScriptRouterFactory.NAME, FileRouterFactory.NAME
exports.ROUTER_KEY = 'router';
exports.CLUSTER_KEY = 'cluster';
exports.REGISTRY_KEY = 'registry';
exports.MONITOR_KEY = 'monitor';
exports.SIDE_KEY = 'side';
exports.PROVIDER_SIDE = 'provider';
exports.CONSUMER_SIDE = 'consumer';
exports.DEFAULT_REGISTRY = 'dubbo';
exports.BACKUP_KEY = 'backup';
exports.DIRECTORY_KEY = 'directory';
exports.DEPRECATED_KEY = 'deprecated';
exports.ANYHOST_KEY = 'anyhost';
exports.ANYHOST_VALUE = '0.0.0.0';
exports.LOCALHOST_KEY = 'localhost';
exports.LOCALHOST_VALUE = '127.0.0.1';
exports.APPLICATION_KEY = 'application';
exports.LOCAL_KEY = 'local';
exports.STUB_KEY = 'stub';
exports.MOCK_KEY = 'mock';
exports.PROTOCOL_KEY = 'protocol';
exports.PROXY_KEY = 'proxy';
exports.WEIGHT_KEY = 'weight';
exports.FORKS_KEY = 'forks';
exports.DEFAULT_THREADPOOL = 'limited';
exports.DEFAULT_CLIENT_THREADPOOL = 'cached';
exports.THREADPOOL_KEY = 'threadpool';
exports.THREAD_NAME_KEY = 'threadname';
exports.IO_THREADS_KEY = 'iothreads';
exports.CORE_THREADS_KEY = 'corethreads';
exports.THREADS_KEY = 'threads';
exports.QUEUES_KEY = 'queues';
exports.ALIVE_KEY = 'alive';
exports.EXECUTES_KEY = 'executes';
exports.BUFFER_KEY = 'buffer';
exports.PAYLOAD_KEY = 'payload';
exports.REFERENCE_FILTER_KEY = 'reference.filter';
exports.INVOKER_LISTENER_KEY = 'invoker.listener';
exports.SERVICE_FILTER_KEY = 'service.filter';
exports.EXPORTER_LISTENER_KEY = 'exporter.listener';
exports.ACCESS_LOG_KEY = 'accesslog';
exports.ACTIVES_KEY = 'actives';
exports.CONNECTIONS_KEY = 'connections';
exports.ACCEPTS_KEY = 'accepts';
exports.IDLE_TIMEOUT_KEY = 'idle.timeout';
exports.HEARTBEAT_KEY = 'heartbeat';
exports.HEARTBEAT_TIMEOUT_KEY = 'heartbeat.timeout';
exports.CONNECT_TIMEOUT_KEY = 'connect.timeout';
exports.TIMEOUT_KEY = 'timeout';
exports.RETRIES_KEY = 'retries';
exports.PROMPT_KEY = 'prompt';
exports.DEFAULT_PROMPT = 'dubbo>';
exports.CODEC_KEY = 'codec';
exports.SERIALIZATION_KEY = 'serialization';
exports.EXCHANGER_KEY = 'exchanger';
exports.TRANSPORTER_KEY = 'transporter';
exports.SERVER_KEY = 'server';
exports.CLIENT_KEY = 'client';
exports.ID_KEY = 'id';
exports.ASYNC_KEY = 'async';
exports.RETURN_KEY = 'return';
exports.TOKEN_KEY = 'token';
exports.METHOD_KEY = 'method';
exports.METHODS_KEY = 'methods';
exports.CHARSET_KEY = 'charset';
exports.RECONNECT_KEY = 'reconnect';
exports.SEND_RECONNECT_KEY = 'send.reconnect';
exports.DEFAULT_RECONNECT_PERIOD = 2000;
exports.SHUTDOWN_TIMEOUT_KEY = 'shutdown.timeout';
exports.DEFAULT_SHUTDOWN_TIMEOUT = 1000 * 60 * 15;
exports.PID_KEY = 'pid';
exports.TIMESTAMP_KEY = 'timestamp';
exports.WARMUP_KEY = 'warmup';
exports.DEFAULT_WARMUP = 10 * 60 * 1000;
exports.CHECK_KEY = 'check';
exports.REGISTER_KEY = 'register';
exports.SUBSCRIBE_KEY = 'subscribe';
exports.GROUP_KEY = 'group';
exports.PATH_KEY = 'path';
exports.INTERFACE_KEY = 'interface';
exports.GENERIC_KEY = 'generic';
exports.FILE_KEY = 'file';
exports.WAIT_KEY = 'wait';
exports.CLASSIFIER_KEY = 'classifier';
exports.VERSION_KEY = 'version';
exports.REVISION_KEY = 'revision';
exports.DUBBO_VERSION_KEY = 'dubbo';
exports.HESSIAN_VERSION_KEY = 'hessian.version';
exports.DISPATCHER_KEY = 'dispatcher';
exports.CHANNEL_HANDLER_KEY = 'channel.handler';
exports.DEFAULT_CHANNEL_HANDLER = 'default';
exports.ANY_VALUE = '*';
exports.COMMA_SEPARATOR = ',';
exports.PATH_SEPARATOR = '/';
exports.REGISTRY_SEPARATOR = '|';
exports.SEMICOLON_SEPARATOR = ';';
exports.CONNECT_QUEUE_CAPACITY = 'connect.queue.capacity';
exports.CONNECT_QUEUE_WARNING_SIZE = 'connect.queue.warning.size';
exports.DEFAULT_CONNECT_QUEUE_WARNING_SIZE = 1000;
exports.CHANNEL_ATTRIBUTE_READONLY_KEY = 'channel.readonly';
exports.CHANNEL_READONLYEVENT_SENT_KEY = 'channel.readonly.sent';
exports.CHANNEL_SEND_READONLYEVENT_KEY = 'channel.readonly.send';
exports.COUNT_PROTOCOL = 'count';
exports.TRACE_PROTOCOL = 'trace';
exports.EMPTY_PROTOCOL = 'empty';
exports.ADMIN_PROTOCOL = 'admin';
exports.PROVIDER_PROTOCOL = 'provider';
exports.CONSUMER_PROTOCOL = 'consumer';
exports.ROUTE_PROTOCOL = 'route';
exports.SCRIPT_PROTOCOL = 'script';
exports.CONDITION_PROTOCOL = 'condition';
exports.MOCK_PROTOCOL = 'mock';
exports.RETURN_PREFIX = 'return ';
exports.THROW_PREFIX = 'throw';
exports.FAIL_PREFIX = 'fail:';
exports.FORCE_PREFIX = 'force:';
exports.FORCE_KEY = 'force';
exports.MERGER_KEY = 'merger';
/**
 * 集群时是否排除非available的invoker
 */
exports.CLUSTER_AVAILABLE_CHECK_KEY = 'cluster.availablecheck';
/**
 */
exports.DEFAULT_CLUSTER_AVAILABLE_CHECK = true;
/**
 * 集群时是否启用sticky策略
 */
exports.CLUSTER_STICKY_KEY = 'sticky';
/**
 * sticky默认值.
 */
exports.DEFAULT_CLUSTER_STICKY = false;
/**
 * 创建client时，是否先要建立连接。
 */
exports.LAZY_CONNECT_KEY = 'lazy';
/**
 * lazy连接的初始状态是连接状态还是非连接状态？
 */
exports.LAZY_CONNECT_INITIAL_STATE_KEY = 'connect.lazy.initial.state';
/**
 * lazy连接的初始状态默认是连接状态.
 */
exports.DEFAULT_LAZY_CONNECT_INITIAL_STATE = true;
/**
 * 注册中心是否同步存储文件，默认异步
 */
exports.REGISTRY_FILESAVE_SYNC_KEY = 'save.file';
/**
 * 注册中心失败事件重试事件
 */
exports.REGISTRY_RETRY_PERIOD_KEY = 'retry.period';
/**
 * 重试周期
 */
exports.DEFAULT_REGISTRY_RETRY_PERIOD = 5 * 1000;
/**
 * 注册中心自动重连时间
 */
exports.REGISTRY_RECONNECT_PERIOD_KEY = 'reconnect.period';
exports.DEFAULT_REGISTRY_RECONNECT_PERIOD = 3 * 1000;
exports.SESSION_TIMEOUT_KEY = 'session';
exports.DEFAULT_SESSION_TIMEOUT = 60 * 1000;
/**
 * 注册中心导出URL参数的KEY
 */
exports.EXPORT_KEY = 'export';
/**
 * 注册中心引用URL参数的KEY
 */
exports.REFER_KEY = 'refer';
/**
 * callback inst id
 */
exports.CALLBACK_SERVICE_KEY = 'callback.service.instid';
/**
 * 每个客户端同一个接口 callback服务实例的限制
 */
exports.CALLBACK_INSTANCES_LIMIT_KEY = 'callbacks';
/**
 * 每个客户端同一个接口 callback服务实例的限制
 */
exports.DEFAULT_CALLBACK_INSTANCES = 1;
exports.CALLBACK_SERVICE_PROXY_KEY = 'callback.service.proxy';
exports.IS_CALLBACK_SERVICE = 'is_callback_service';
/**
 * channel中callback的invokers
 */
exports.CHANNEL_CALLBACK_KEY = 'channel.callback.invokers.key';
exports.SHUTDOWN_WAIT_KEY = 'dubbo.service.shutdown.wait';
exports.IS_SERVER_KEY = 'isserver';
/**
 * 默认值毫秒，避免重新计算.
 */
exports.DEFAULT_SERVER_SHUTDOWN_TIMEOUT = 10000;
exports.ON_CONNECT_KEY = 'onconnect';
exports.ON_DISCONNECT_KEY = 'ondisconnect';
exports.ON_INVOKE_METHOD_KEY = 'oninvoke.method';
exports.ON_RETURN_METHOD_KEY = 'onreturn.method';
exports.ON_THROW_METHOD_KEY = 'onthrow.method';
exports.ON_INVOKE_INSTANCE_KEY = 'oninvoke.instance';
exports.ON_RETURN_INSTANCE_KEY = 'onreturn.instance';
exports.ON_THROW_INSTANCE_KEY = 'onthrow.instance';
exports.OVERRIDE_PROTOCOL = 'override';
exports.PRIORITY_KEY = 'priority';
exports.RULE_KEY = 'rule';
exports.TYPE_KEY = 'type';
exports.RUNTIME_KEY = 'runtime';
// when ROUTER_KEY's value is set to ROUTER_TYPE_CLEAR, RegistryDirectory will clean all current routers
exports.ROUTER_TYPE_CLEAR = 'clean';
exports.DEFAULT_SCRIPT_TYPE_KEY = 'javascript';
exports.STUB_EVENT_KEY = 'dubbo.stub.event';
exports.DEFAULT_STUB_EVENT = false;
exports.STUB_EVENT_METHODS_KEY = 'dubbo.stub.event.methods';
// invocation attachment属性中如果有此值，则选择mock invoker
exports.INVOCATION_NEED_MOCK = 'invocation.need.mock';
exports.LOCAL_PROTOCOL = 'injvm';
exports.AUTO_ATTACH_INVOCATIONID_KEY = 'invocationid.autoattach';
exports.SCOPE_KEY = 'scope';
exports.SCOPE_LOCAL = 'local';
exports.SCOPE_REMOTE = 'remote';
exports.SCOPE_NONE = 'none';
exports.RELIABLE_PROTOCOL = 'napoli';
exports.TPS_LIMIT_RATE_KEY = 'tps';
exports.TPS_LIMIT_INTERVAL_KEY = 'tps.interval';
exports.DEFAULT_TPS_LIMIT_INTERVAL = 60 * 1000;
exports.DECODE_IN_IO_THREAD_KEY = 'decode.in.io';
exports.DEFAULT_DECODE_IN_IO_THREAD = true;
exports.INPUT_KEY = 'input';
exports.OUTPUT_KEY = 'output';
exports.GENERIC_SERIALIZATION_NATIVE_JAVA = 'nativejava';
exports.GENERIC_SERIALIZATION_DEFAULT = 'true';
