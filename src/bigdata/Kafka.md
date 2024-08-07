---
title: Kafka
icon: fa-solid fa-message
category:
  - 大数据
tag:
  - kafka
---

# Kafka

:loudspeaker: `Kafka` 是一个**分布式的基于发布/订阅模式的消息队列**（Message Queue），主要应用于大数据实时处理领域。

<!-- more -->

## 1 消息队列

### 1.1 传统消息队列的应用场景

![](./images/image-20210729203008205.png)

**使用消息队列的好处**

1）解耦

允许你独立的扩展或修改两边的处理过程，只要确保它们遵守同样的接口约束。

2）可恢复性

系统的一部分组件失效时，不会影响到整个系统。消息队列降低了进程间的耦合度，所 以即使一个处理消息的进程挂掉，加入队列中的消息仍然可以在系统恢复后被处理。

3）缓冲

有助于控制和优化数据流经过系统的速度，解决生产消息和消费消息的处理速度不一致 的情况。

4）灵活性 & 峰值处理能力

在访问量剧增的情况下，应用仍然需要继续发挥作用，但是这样的突发流量并不常见。 如果为以能处理这类峰值访问为标准来投入资源随时待命无疑是巨大的浪费。使用消息队列 能够使关键组件顶住突发的访问压力，而不会因为突发的超负荷的请求而完全崩溃。

5）异步通信

很多时候，用户不想也不需要立即处理消息。消息队列提供了异步处理机制，允许用户 把一个消息放入队列，但并不立即处理它。想向队列中放入多少消息就放多少，然后在需要 的时候再去处理它们。

### 1.2 消息队列的两种模式

（1）点对点模式（一对一，消费者主动拉取数据，消息收到后消息清除）

消息生产者生产消息发送到 Queue 中，然后消息消费者从 Queue 中取出并且消费消息。 消息被消费以后，queue 中不再有存储，所以消息消费者不可能消费到已经被消费的消息。 Queue 支持存在多个消费者，但是对一个消息而言，只会有一个消费者可以消费。

![](./images/image-20210729203116535.png)

（2）发布/订阅模式（一对多，消费者消费数据之后不会清除消息）

消息生产者（发布）将消息发布到 topic 中，同时有多个消息消费者（订阅）消费该消 息。和点对点方式不同，发布到 topic 的消息会被所有订阅者消费。

![](./images/image-20210729203132765.png)

### 1.3 Kafka 基础架构

![](./images/image-20210729203145337.png)

1）Producer ：消息生产者，就是向 kafka broker 发消息的客户端；

2）Consumer ：消息消费者，向 kafka broker 取消息的客户端；

3）Consumer Group （CG）：消费者组，由多个 consumer 组成。**消费者组内每个消费者负责消费不同分区的数据，一个分区只能由一个组内消费者消费；消费者组之间互不影响**。所有的消费者都属于某个消费者组，**即消费者组是逻辑上的一个订阅者**。

4）Broker ：一台 kafka 服务器就是一个 broker。一个集群由多个 broker 组成。一个 broker 可以容纳多个 topic。

5）Topic ：可以理解为一个队列，**生产者和消费者面向的都是一个 topic**；

6）Partition：为了实现扩展性，一个非常大的 topic 可以分布到多个 broker（即服务器）上， **一个 topic 可以分为多个 partition**，每个 partition 是一个有序的队列；

7）Replica：副本，为保证集群中的某个节点发生故障时，**该节点上的 partition 数据不丢失，且 kafka 仍然能够继续工作**，kafka 提供了副本机制，一个 topic 的每个分区都有若干个副本， **一个 leader 和若干个 follower**。

8）leader：每个分区多个副本的“主”，生产者发送数据的对象，以及消费者消费数据的对 象都是 leader。

9）follower：每个分区多个副本中的“从”，实时从 leader 中同步数据，保持和 leader 数据 的同步。leader 发生故障时，某个 follower 会成为新的 follower。

## 2 Kafka 快速入门

### 2.1 安装部署

#### 2.1.1 集群规划

| hadoop141 | hadoop142 | hadoop143 |
| --------- | --------- | --------- |
| zk        | zk        | zk        |
| kafka     | kafka     | kafka     |

#### 2.1.2 jar 包下载

版本: kafka_2.11-0.11.0.0.tgz (前面的是 scala 版本,后面的才是 kafka 版本)

[官网下载地址]: http://kafka.apache.org/downloads.html

#### 2.1.3 集群部署

```shell
#1. 解压
tar -zxvf kafka_2.11-0.11.0.0.tgz -C /opt/
#2. 改名(个人习惯有个版本号)
mv kafka_2.11-0.11.0.0/ kafk-0.11
#进入配置文件目录
cd /opt/kafk-0.11/config/
#3. 修改配置文件内容
#=================================#
#broker 的全局唯一编号，不能重复
broker.id=0
#删除 topic 功能使能
delete.topic.enable=true
#kafka 运行日志存放的路径
log.dirs=/opt/kafk-0.11/data
#配置连接 Zookeeper 集群地址
zookeeper.connect=hadoop141:2181,hadoop142:2181,hadoop143:2181
#=================================#
#4. 配置环境变量
#=================================#
#KAFKA_HOME
export KAFKA_HOME=/opt/kafk-0.11
export PATH=$PATH:$KAFKA_HOME/bin
#=================================#
#5. 分发kafka和环境变量,记得source
xsync /opt/kafk-0.11
#6. 分别修改hadoop142和hadoop143的kafka配置文件
broker.id=1	#hadoop142的server.properties内修改,和zk的myid很像
broker.id=2	#hadoop143的server.properties内修改,和zk的myid很像
#7. 依次在 hadoop141、hadoop142、hadoop143 节点上启动 kafka
bin/kafka-server-start.sh -daemon config/server.properties
#8. 关闭集群
bin/kafka-server-stop.sh stop
```

#### 2.1.4 编写群起脚本

```shell
#!/bin/bash
if [ $# -lt 1 ]
then
 	echo "No Args Input..."
 	exit ;
fi
case $1 in
"start")
	for i in hadoop141 hadoop142 hadoop143
	do
		echo " =================== start $i kafka ==================="
		ssh $i "/opt/kafk-0.11/bin/kafka-server-start.sh -daemon /opt/kafk-0.11/config/server.properties"
	done
;;
"stop")
	for i in hadoop141 hadoop142 hadoop143
	do
		echo " =================== stop $i kafka ==================="
		ssh $i "/opt/kafk-0.11/bin/kafka-server-stop.sh"
	done
;;
*)
 	echo "Input Args Error..."
;;
esac
```

### 2.2 Kafka 命令行操作

```shell
#1）查看当前服务器中的所有 topic
bin/kafka-topics.sh --list --zookeeper hadoop141:2181
#2）创建 topic(指定2个分区,2个副本)
bin/kafka-topics.sh --create --zookeeper hadoop141:2181 --topic first --partitions 2 --replication-factor 2
#3）删除 topic,删了之后重新创建
bin/kafka-topics.sh --delete --zookeeper hadoop141:2181 --topic first
#4）查看某个 Topic 的详情
bin/kafka-topics.sh --describe --topic first --zookeeper hadoop141:2181
#5）发送消息(会进入一个 > 开头的会话模式)
bin/kafka-console-producer.sh --topic first --broker-list hadoop141:9092
#6）消费消息(会进入一个等待消息的状态)
bin/kafka-console-consumer.sh --topic first --zookeeper hadoop141:2181
#7）发布订阅模式,即使消费者不在线也要能接收消息,这个时候要多加一个参数,--from-beginning,不加参数读不到
bin/kafka-console-consumer.sh --topic first --zookeeper hadoop141:2181 --from-beginning
#8）0.9之前offset存在zk,0.9之后存在本地,所以用zookeeper起consumer会提示过时(这样就不会过时了)
bin/kafka-console-consumer.sh --topic first --bootsap-server hadoop141:9092
#9）修改分区数(只能增加,减少会报错;分区数可以大于broker数量,replication数则不能)
bin/kafka-topics.sh --zookeeper hadoop141:2181 --alter --topic first --partitions 6
```

![](./images/image-20210731153737135.png)

## 3 Kafka 架构深入

### 3.1 Kafka 工作流程及文件存储机制

**Kafka 工作流程**

![](./images/image-20210731083627925.png)

Kafka 中消息是以 topic 进行分类的，生产者生产消息，消费者消费消息，都是面向 topic 的。

topic 是逻辑上的概念，而 partition 是物理上的概念，每个 partition 对应于一个 log 文 件，该 log 文件中存储的就是 producer 生产的数据。Producer 生产的数据会被不断追加到该 log 文件末端，且每条数据都有自己的 offset。消费者组中的每个消费者，都会实时记录自己 消费到了哪个 offset，以便出错恢复时，从上次的位置继续消费。

**Kafka 文件存储机制**

![](./images/image-20210731083715857.png)

由于生产者生产的消息会不断追加到 log 文件末尾，为防止 log 文件过大导致数据定位 效率低下，Kafka 采取了分片和索引机制，将每个 partition 分为多个 segment。每个 segment 对应两个文件——“.index”文件和“.log”文件。这些文件位于一个文件夹下，该文件夹的命名 规则为：topic 名称+分区序号。例如，first 这个 topic 有三个分区，则其对应的文件夹为 first0,first-1,first-2。

index 和 log 文件以当前 segment 的第一条消息的 offset 命名。下图为 index 文件和 log 文件的结构示意图。

![](./images/image-20210731083831529.png)

“.index”文件存储大量的索引信息，“.log”文件存储大量的数据，索引文件中的元 数据指向对应数据文件中 message 的物理偏移地址。

### 3.2 Kafka 生产者

#### 3.2.1 分区策略

1）分区的原因

（1）方便在集群中扩展，每个 Partition 可以通过调整以适应它所在的机器，而一个 topic 又可以有多个 Partition 组成，因此整个集群就可以适应任意大小的数据了；

（2）可以提高并发，因为可以以 Partition 为单位读写了。

2）分区的原则

我们需要将 producer 发送的数据封装成一个 ProducerRecord 对象

（1）指明 partition 的情况下，直接将指明的值直接作为 partiton 值；

（2）没有指明 partition 值但有 key 的情况下，将 key 的 hash 值与 topic 的 partition 数进行取余得到 partition 值；

（3）既没有 partition 值又没有 key 值的情况下，第一次调用时随机生成一个整数（后 面每次调用在这个整数上自增），将这个值与 topic 可用的 partition 总数取余得到 partition 值，也就是常说的 round-robin 算法。

#### 3.2.2 数据可靠性保证

为保证 producer 发送的数据，能可靠的发送到指定的 topic，topic 的每个 partition 收到 producer 发送的数据后，都需要向 producer 发送 ack（acknowledgement 确认收到），如果 producer 收到 ack，就会进行下一轮的发送，否则重新发送数据。

![](./images/image-20210731084145638.png)

1）副本数据同步策略

| 方案                         | 优点                                                     | 缺点                                                      |
| ---------------------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| 半数以上完成同步，就发送 ack | 延迟低                                                   | 选举新的 leader 时，容忍 n 台节点的故障，需要 2n+1 个副本 |
| 全部完成同步，才发送 ack     | 选举新的 leader 时，容忍 n 台节点的故障，需要 n+1 个副本 | 延迟高                                                    |

Kafka 选择了第二种方案，原因如下：

1.同样为了容忍 n 台节点的故障，第一种方案需要 2n+1 个副本，而第二种方案只需要 n+1 个副本，而 Kafka 的每个分区都有大量的数据，第一种方案会造成大量数据的冗余。

2.虽然第二种方案的网络延迟会比较高，但网络延迟对 Kafka 的影响较小。

2）ISR

采用第二种方案之后，设想以下情景：leader 收到数据，所有 follower 都开始同步数据， 但有一个 follower，因为某种故障，迟迟不能与 leader 进行同步，那 leader 就要一直等下去， 直到它完成同步，才能发送 ack。这个问题怎么解决呢？

Leader 维护了一个动态的 in-sync replica set (ISR)，意为和 leader 保持同步的 follower 集 合。当 ISR 中的 follower 完成数据的同步之后，leader 就会给 follower 发送 ack。如果 follower 长时间 未 向 leader 同 步 数 据 ， 则 该 follower 将 被 踢 出 ISR ， 该 时 间 阈 值 由 replica.lag.time.max.ms 参数设定。Leader 发生故障之后，就会从 ISR 中选举新的 leader。

3）ack 应答机制

对于某些不太重要的数据，对数据的可靠性要求不是很高，能够容忍数据的少量丢失， 所以没必要等 ISR 中的 follower 全部接收成功。

所以 Kafka 为用户提供了三种可靠性级别，用户根据对可靠性和延迟的要求进行权衡， 选择以下的配置。

**acks 参数配置：**

acks：

0：producer 不等待 broker 的 ack，这一操作提供了一个最低的延迟，broker 一接收到还 没有写入磁盘就已经返回，当 broker 故障时有可能丢失数据；

1：producer 等待 broker 的 ack，partition 的 leader 落盘成功后返回 ack，如果在 follower 同步成功之前 leader 故障，那么将会丢失数据；

![](./images/image-20210731093728772.png)

-1（all）：producer 等待 broker 的 ack，partition 的 leader 和 follower 全部落盘成功后才 返回 ack(**这里所有的 follower 是指 ISR 中所有的 follower**)。但是如果在 follower 同步完成后，broker 发送 ack 之前，leader 发生故障，那么会 造成数据重复。

![](./images/image-20210731093759260.png)

4）故障处理细节

![](./images/image-20210731094650535.png)

LEO：指的是每个副本最大的 offset；

HW：指的是消费者能见到的最大的 offset，ISR 队列中最小的 LEO。

（1）follower 故障

follower 发生故障后会被临时踢出 ISR，待该 follower 恢复后，follower 会读取本地磁盘 记录的上次的 HW，并将 log 文件高于 HW 的部分截取掉，从 HW 开始向 leader 进行同步。 等该 **follower 的 LEO 大于等于该 Partition 的 HW**，即 follower 追上 leader 之后，就可以重 新加入 ISR 了。

（2）leader 故障

leader 发生故障之后，会从 ISR 中选出一个新的 leader，之后，为保证多个副本之间的数据一致性，其余的 follower 会先将各自的 log 文件**高于 HW 的部分截掉**，然后从新的 leader 同步数据。

注意：这只能保证副本之间的数据一致性，并不能保证数据不丢失或者不重复。

#### 3.2.3 Exactly Once 语义

将服务器的 ACK 级别设置为-1，可以保证 Producer 到 Server 之间不会丢失数据，即 **At Least Once 语义**。相对的，将服务器 ACK 级别设置为 0，可以保证生产者每条消息只会被 发送一次，即 **At Most Once 语义**。

At Least Once 可以保证数据不丢失，但是不能保证数据不重复；相对的，At Most Once 可以保证数据不重复，但是不能保证数据不丢失。**但是，对于一些非常重要的信息，比如说 交易数据，下游数据消费者要求数据既不重复也不丢失，即 Exactly Once 语义**。在 0.11 版 本以前的 Kafka，对此是无能为力的，只能保证数据不丢失，再在下游消费者对数据做全局 去重。对于多个下游应用的情况，每个都需要单独做全局去重，这就对性能造成了很大影响。 0.11 版本的 Kafka，引入了一项重大特性：幂等性。所谓的幂等性就是指 Producer 不论 向 Server 发送多少次重复数据，Server 端都只会持久化一条。幂等性结合 At Least Once 语 义，就构成了 Kafka 的 Exactly Once 语义。即：

0.11 版本的 Kafka，引入了一项重大特性：幂等性。所谓的幂等性就是指 Producer 不论 向 Server 发送多少次重复数据，Server 端都只会持久化一条。幂等性结合 At Least Once 语 义，就构成了 Kafka 的 Exactly Once 语义。即：

`At Least Once + 幂等性 = Exactly Once`

要启用幂等性，只需要将 Producer 的参数中 enable.idempotency 设置为 true 即可(此时 ack 自动=-1)。Kafka 的幂等性实现其实就是将原来下游需要做的去重放在了数据上游。开启幂等性的 Producer 在 初始化的时候会被分配一个 PID，发往同一 Partition 的消息会附带 Sequence Number。而 Broker 端会对做缓存，当具有相同主键的消息提交时，Broker 只 会持久化一条。

但是 PID 重启就会变化，同时不同的 Partition 也具有不同主键，所以幂等性无法保证跨 分区跨会话的 Exactly Once。

### 3.3 Kafka 消费者

#### 3.3.1 消费方式

**consumer 采用 pull（拉）模式从 broker 中读取数据。**

**push（推）模式很难适应消费速率不同的消费者，因为消息发送速率是由 broker 决定的。** 它的目标是尽可能以最快速度传递消息，但是这样很容易造成 consumer 来不及处理消息，典型的表现就是拒绝服务以及网络拥塞。而 pull 模式则可以根据 consumer 的消费能力以适 当的速率消费消息。

**pull 模式不足之处是，如果 kafka 没有数据，消费者可能会陷入循环中，一直返回空数 据。**针对这一点，Kafka 的消费者在消费数据时会传入一个时长参数 timeout，如果当前没有 数据可供消费，consumer 会等待一段时间之后再返回，这段时长即为 timeout。

#### 3.3.2 分区分配策略

默认值: Range

当以下事件发生时，Kafka 将会进行一次分区分配

1. 同一个 Consumer Group 内新增消费者

2. 消费者离开当前所属的 Consumer Group，包括关闭或崩溃

3. 订阅的主题新增分区

1）RoundRobin

按照消费者组划分,即将所有的订阅的 topic 当成一个整体(topicandpartition,hash 排序后),轮询分配

缺点: 消费者组的每个消费者只能订阅相同的 topic

2）Range

按照每个 topic 划分

缺点: 可能造成消费者组内消费者消费次数不对等

如果消费者组内的消费者单独订阅的 topic,那么则由该消费者独自消费,RoundRobin 则不适用这种场景

#### 3.3.3 offset 的维护

由于 consumer 在消费过程中可能会出现断电宕机等故障，consumer 恢复后，需要从故 障前的位置的继续消费，所以 consumer 需要实时记录自己消费到了哪个 offset，以便故障恢 复后继续消费。

![](./images/image-20210731152400800.png)

Kafka 0.9 版本之前，consumer 默认将 offset 保存在 Zookeeper 中，从 0.9 版本开始， consumer 默认将 offset 保存在 Kafka 一个内置的 topic 中，该 topic 为\_\_consumer_offsets。

1）修改配置文件 consumer.properties(目的是为了读取\_\_consumer_offsets 内部 topic 的数据,实际生产并不会这样配置)

```shell
exclude.internal.topics=false
```

2）读取 offset

0.11.0.0 之前版本:

```shell
bin/kafka-console-consumer.sh --topic __consumer_offsets --zookeeper hadoop141:2181 --formatter "kafka.coordinator.GroupMetadataManager\$OffsetsMessageFormatter" --consumer.config config/consumer.properties --from-beginning
```

0.11.0.0 之后版本(\_\_consumer_offsets 是用来记录消费者的 offset 的,那么对于 consumer_offsets 来说,消费者则是生产者,所以这里用的 zookeeper):

```shell
bin/kafka-console-consumer.sh --topic __consumer_offsets --zookeeper hadoop141:2181 --formatter "kafka.coordinator.group.GroupMetadataManager\$OffsetsMessageFormatter" --consumer.config config/consumer.properties --frombeginning
```

#### 3.3.4 消费者组案例

1）需求：测试同一个消费者组中的消费者，同一时刻只能有一个消费者消费。

2）案例实操

（1）在 hadoop141 上修改/opt/kafk-0.11/config/consumer.properties 配置 文件中的 group.id 属性为任意组名。

```shell
vim consumer.properties
#修改配置文件内容
group.id=atguigu
```

（2）先在 hadoop141 上开一个生产者,再开两个 hadoop141 窗口作为 consumer(因为只改了 141 的配置文件)

```shell
#开启生产者
bin/kafka-console-producer.sh --topic first --broker-list hadoop141:9092
#开启第一个消费者
bin/kafka-console-consumer.sh --topic first --zookeeper hadoop141:2181 --consumer.config config/consumer.properties
#开启第二个消费者
bin/kafka-console-consumer.sh --topic first --zookeeper hadoop141:2181 --consumer.config config/consumer.properties
```

（4）查看 hadoop102 和 hadoop103 的接收者。

![](./images/image-20210731202255777.png)

当再增加一个消费者,使 kafka 重新分配,可以预见是一人一条

### 3.4 Kafka 高效读写数据

1）顺序写磁盘

Kafka 的 producer 生产数据，要写入到 log 文件中，写的过程是一直追加到文件末端， 为顺序写。官网有数据表明，同样的磁盘，顺序写能到 600M/s，而随机写只有 100K/s。这 与磁盘的机械机构有关，顺序写之所以快，是因为其省去了大量磁头寻址的时间。

2）零复制技术

![](./images/image-20210731202957637.png)

参考: java NIO 的 transferTo 方法

### 3.5 Zookeeper 在 Kafka 中的作用

Kafka 集群中有一个 broker 会被选举为 Controller，负责管理**集群 broker 的上下线**，所 有 topic 的**分区副本分配**和 **leader 选举**等工作。

Controller 的管理工作都是依赖于 Zookeeper 的。

以下为 partition 的 leader 选举过程：

![](./images/image-20210731214606770.png)

这里说的选举新的 leader 是选举 partition 的 leader,并不是 broker 的 controller,controller 是通过抢占产生的

#### 3.6.1 Producer 事务

为了实现跨分区跨会话的事务，需要引入一个全局唯一的 Transaction ID，并将 Producer 获得的 PID 和 Transaction ID 绑定。这样当 Producer 重启后就可以通过正在进行的 Transaction ID 获得原来的 PID。

为了管理 Transaction，Kafka 引入了一个新的组件 Transaction Coordinator。Producer 就 是通过和 Transaction Coordinator 交互获得 Transaction ID 对应的任务状态。Transaction Coordinator 还负责将事务所有写入 Kafka 的一个内部 Topic，这样即使整个服务重启，由于 事务状态得到保存，进行中的事务状态可以得到恢复，从而继续进行。

#### 3.6.2 Consumer 事务

上述事务机制主要是从 Producer 方面考虑，对于 Consumer 而言，事务的保证就会相对 较弱，尤其时无法保证 Commit 的信息被精确消费。这是由于 Consumer 可以通过 offset 访 问任意信息，而且不同的 Segment File 生命周期不同，同一事务的消息可能会出现重启后被 删除的情况。

## 4 Kafka API

### 4.1 Producer API

#### 4.1.1 消息发送流程

Kafka 的 Producer 发送消息采用的是**异步发送**的方式。在消息发送的过程中，涉及到了 **两个线程——main 线程和 Sender 线程**，以及**一个线程共享变量——RecordAccumulator**。 main 线程将消息发送给 RecordAccumulator，Sender 线程不断从 RecordAccumulator 中拉取 消息发送到 Kafka broker。

![](./images/image-20210731223425692.png)

相关参数：

**batch.size**：只有数据积累到 batch.size 之后，sender 才会发送数据。

**linger.ms**：如果数据迟迟未达到 batch.size，sender 等待 linger.time 之后就会发送数据。

#### 4.1.2 异步发送 API

1）导入依赖

```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>0.11.0.0</version>
</dependency>
```

2）编写代码

需要用到的类：

KafkaProducer：需要创建一个生产者对象，用来发送数据

ProducerConfig：获取所需的一系列配置参数

ProducerRecord：每条数据都要封装成一个

ProducerRecord 对象

1.不带回调函数的 API

```java
public class MyProducer {
    public static void main(String[] args) {
        // 创建kafka生产者的配置信息
        Properties props = new Properties();
        // kafka 集群，broker-list
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "hadoop141:9092");
        // ack应答级别
        props.put("acks", "all");
        // 重试次数
        props.put("retries", 1);
        // 批次大小(16k)
        props.put("batch.size", 16384);
        // 等待时间(1毫秒)
        props.put("linger.ms", 1);
        // RecordAccumulator 缓冲区大小(32兆)
        props.put("buffer.memory", 33554432);
        // key value 的序列化类
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        // 创建生产者对象
        KafkaProducer<String, String> producer = new KafkaProducer<String, String>(props);
        // 发送数据
        for (int i = 0; i < 10; i++) {
            producer.send(new ProducerRecord<>("chen", "atguigu--" + i));
        }
        // 关闭资源
        producer.close();
    }
}
```

2.带回调函数的 API

回调函数会在 producer 收到 ack 时调用，为异步调用，该方法有两个参数，分别是 RecordMetadata 和 Exception，如果 Exception 为 null，说明消息发送成功，如果 Exception 不为 null，说明消息发送失败。

注意：消息发送失败会自动重试，不需要我们在回调函数中手动重试。

```java
public class CallBackProducer {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "hadoop141:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        // 创建生产者对象
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);
        // 发送数据
        for (int i = 0; i < 10; i++) {
            producer.send(new ProducerRecord<>("chen", i + "", "atguigu--" + i), (recordMetadata, e) -> {
                if (e == null) {
                    System.out.println("分区: " + recordMetadata.partition() + "\t偏移量: " + recordMetadata.offset());
                    System.out.println();
                }
            });
        }
        // 关闭资源
        producer.close();
    }
}
```

#### 4.1.3 同步发送 API

同步发送的意思就是，一条消息发送之后，会阻塞当前线程，直至返回 ack。

由于 send 方法返回的是一个 Future 对象，根据 Futrue 对象的特点，我们也可以实现同 步发送的效果，只需在调用 Future 对象的 get 方发即可。

```java
//很少使用,了解即可
producer.send(..省略代码...).get()
```

### 4.2 Consumer API

Consumer 消费数据时的可靠性是很容易保证的，因为数据在 Kafka 中是持久化的，故 不用担心数据丢失问题。

由于 consumer 在消费过程中可能会出现断电宕机等故障，consumer 恢复后，需要从故 障前的位置的继续消费，所以 consumer 需要实时记录自己消费到了哪个 offset，以便故障恢 复后继续消费。

所以 offset 的维护是 Consumer 消费数据是必须考虑的问题。

#### 4.2.1 自动提交 offset

需要用到的类：

KafkaConsumer：需要创建一个消费者对象，用来消费数据

ConsumerConfig：获取所需的一系列配置参数

ConsuemrRecord：每条数据都要封装成一个

ConsumerRecord 对象

自动提交 offset 的相关参数：

enable.auto.commit：是否开启自动提交 offset 功能

auto.commit.interval.ms：自动提交 offset 的时间间隔

```java
public class MyConsumer {
    public static void main(String[] args) throws IOException {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "hadoop141:9092");
        // 开启自动提交
        // 如果不自动提交,那么就需要手动提交,否则会造成重复消费:
        // 即offset不会被写入硬盘,一旦会话关闭,offset还是上一次的offset
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
        // 自动提交的延迟
        props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");
        // key和value的反序列化
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        // 消费者组
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "bigdata");
        // 重置消费者的offset,因为当前组消费的offset已经被记录了,所以不会被重置
        // 什么时候重置offset:
        // 1.换了组,新换的组没有offset嘛,那就从头开始消费
        // 2.offset文件过期
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        // 获取消费者客户端对象
        KafkaConsumer<Integer, String> consumer = new KafkaConsumer<>(props);
        // 订阅主题
        consumer.subscribe(Arrays.asList("first", "second"));
        // 获取数据
        while (true) {
            ConsumerRecords<Integer, String> consumerRecords = consumer.poll(100);
            // 遍历数据
            consumerRecords.forEach(item -> {
                System.out.println("key: " + item.key() + "\tvalue: " + item.value());
            });
        }
    }
}
```

#### 4.2.2 手动提交 offset

虽然自动提交 offset 十分简介便利，但由于其是基于时间提交的(比如到时间还没有消费完,但是已经提交了,这时候宕机,就会造成漏消费)，开发人员难以把握 offset 提交的时机。因此 Kafka 还提供了手动提交 offset 的 API。

手动提交 offset 的方法有两种：分别是 **commitSync（同步提交）**和 **commitAsync（异步 提交）**。两者的相同点是，**都会将本次 poll 的一批数据最高的偏移量提交**；不同点是， commitSync 阻塞当前线程，一直到提交成功，并且会自动失败重试（由不可控因素导致， 也会出现提交失败）；而 commitAsync 则没有失败重试机制，故有可能提交失败。

1）同步提交 offset(伪代码)

由于同步提交 offset 有失败重试机制，故更加可靠

```java
//关闭自动提交 offset
props.put("enable.auto.commit", "false");
//同步提交，当前线程会阻塞直到 offset 提交成功
consumer.commitSync();
```

2）异步提交 offset(伪代码)

虽然同步提交 offset 更可靠一些，但是由于其会阻塞当前线程，直到提交成功。因此吞 吐量会收到很大的影响。因此更多的情况下，会选用异步提交 offset 的方式。

```java
//关闭自动提交 offset
props.put("enable.auto.commit", "false");
//异步提交
consumer.commitAsync(new OffsetCommitCallback() {
    @Override
    public void onComplete(Map<TopicPartition,OffsetAndMetadata> offsets, Exception exception) {
        if (exception != null) {
            System.err.println("Commit failed for" +offsets);
        }
    }
}
```

3） 数据漏消费和重复消费分析

无论是同步提交还是异步提交 offset，都有可能会造成数据的漏消费或者重复消费。先 提交 offset 后消费，有可能造成数据的漏消费；而先消费后提交 offset，有可能会造成数据 的重复消费。

#### 4.2.3 自定义存储 offset(伪代码)

Kafka 0.9 版本之前，offset 存储在 zookeeper，0.9 版本及之后，默认将 offset 存储在 Kafka 的一个内置的 topic 中。除此之外，Kafka 还可以选择自定义存储 offset。

offset 的维护是相当繁琐的，因为需要考虑到消费者的 Rebalace。

**当有新的消费者加入消费者组、已有的消费者推出消费者组或者所订阅的主题的分区发 生变化，就会触发到分区的重新分配，重新分配的过程叫做 Rebalance。**

消费者发生 Rebalance 之后，每个消费者消费的分区就会发生变化。**因此消费者要首先获取到自己被重新分配到的分区，并且定位到每个分区最近提交的 offset 位置继续消费。**

要实现自定义存储 offset，需要借助 **ConsumerRebalanceListener**，以下为示例代码，其 中提交和获取 offset 的方法，需要根据所选的 offset 存储系统自行实现。

```java
consumer.subscribe(Arrays.asList("first"), new ConsumerRebalanceListener() {
    // 该方法会在 Rebalance 之前调用
    @Override
    public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
        commitOffset(currentOffset);
    }
    // 该方法会在 Rebalance 之后调用
    @Override
    public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
        currentOffset.clear();
        for (TopicPartition partition : partitions) {
            consumer.seek(partition, getOffset(partition));// 定位到最近提交的 offset 位置继续消费
        }
    }
});
// 获取某分区的最新 offset
private static long getOffset(TopicPartition partition) {
    return 0;
}
// 提交该消费者所有分区的 offset
private static void commitOffset(Map<TopicPartition, Long> currentOffset) {
}
```

### 4.3 自定义 Interceptor

#### 4.3.1 拦截器原理

Producer 拦截器(interceptor)是在 Kafka 0.10 版本被引入的，主要用于实现 clients 端的定 制化控制逻辑。

对于 producer 而言，interceptor 使得用户在消息发送前以及 producer 回调逻辑前有机会 对消息做一些定制化需求，**比如修改消息等**。同时，producer 允许用户指定多个 interceptor 按序作用于同一条消息从而形成一个拦截链(interceptor chain)。Intercetpor 的实现接口是 **org.apache.kafka.clients.producer.ProducerInterceptor**，其定义的方法包括:

（1）configure(configs) :

获取配置信息和初始化数据时调用。

（2）onSend(ProducerRecord)：

该方法封装进 KafkaProducer.send 方法中，即它运行在用户主线程中。Producer 确保在消息被序列化以及计算分区前调用该方法。**用户可以在该方法中对消息做任何操作，但最好 保证不要修改消息所属的 topic 和分区**，否则会影响目标分区的计算。

（3）onAcknowledgement(RecordMetadata, Exception)：

**该方法会在消息从 RecordAccumulator 成功发送到 Kafka Broker 之后，或者在发送过程 中失败时调用。**并且通常都是在 producer 回调逻辑触发之前。onAcknowledgement 运行在 producer 的 IO 线程中，因此不要在该方法中放入很重的逻辑，否则会拖慢 producer 的消息 发送效率。

（4）close：

**关闭 interceptor，主要用于执行一些资源清理工作**

如前所述，interceptor 可能被运行在多个线程中，因此在具体实现时用户需要自行确保 线程安全。另外**倘若指定了多个 interceptor，则 producer 将按照指定顺序调用它们**，并仅仅 是捕获每个 interceptor 可能抛出的异常记录到错误日志中而非在向上传递。这在使用过程中 要特别留意。

#### 4.3.2 拦截器案例

1）需求：

实现一个简单的双 interceptor 组成的拦截链。第一个 interceptor 会在消息发送前将时间 戳信息加到消息 value 的最前部；第二个 interceptor 会在消息发送后更新成功发送消息数或 失败发送消息数。

![](./images/image-20210801204144580.png)

2）案例实操

（1）增加时间戳拦截器

```java
public class TimeInterceptor implements ProducerInterceptor<String, String> {
    @Override
    public ProducerRecord<String, String> onSend(ProducerRecord<String, String> record) {
        // 创建一个新的ProducerRecord对象,并返回
        return new ProducerRecord<>(record.topic(), record.partition(), record.key(),
            System.currentTimeMillis() + ": " + record.value());
    }

    @Override
    public void onAcknowledgement(RecordMetadata metadata, Exception exception) {

    }

    @Override
    public void close() {

    }

    @Override
    public void configure(Map<String, ?> configs) {

    }
}
```

（2）统计发送消息成功和发送失败消息数，并在 producer 关闭时打印这两个计数器

```java
public class CounterInterceptor implements ProducerInterceptor<String, String> {
    private int success = 0;
    private int error = 0;

    @Override
    public ProducerRecord<String, String> onSend(ProducerRecord<String, String> record) {
        return record;
    }

    @Override
    public void onAcknowledgement(RecordMetadata metadata, Exception exception) {
        if (exception == null) {
            success++;
        } else {
            error++;
        }
    }

    @Override
    public void close() {
        System.out.println("success: " + success);
        System.out.println("error: " + error);
    }

    @Override
    public void configure(Map<String, ?> configs) {

    }
}
```

（3）producer 主程序(伪代码)

如果没有 close,那么拦截器中的 close 也不会被调用

```java
// 添加拦截器
List<String> interceptors = new ArrayList<>();
interceptors.add("com.cssl.interceptor.TimeInterceptor");
interceptors.add("com.cssl.interceptor.CounterInterceptor");
props.put(ProducerConfig.INTERCEPTOR_CLASSES_CONFIG, interceptors);
```
