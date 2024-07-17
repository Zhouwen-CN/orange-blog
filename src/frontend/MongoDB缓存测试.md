---
title: MongoDB 缓存测试
icon: fa-solid fa-leaf
category:
  - 前端
tag:
  - mongodb
---

# MongoDB 缓存测试

:four_leaf_clover: 文章的主要内容是通过设置 `--wiredTigerCacheSizeGB` 控制缓存的大小，测试不同的缓存大小对查询速度的影响

<!-- more -->

::: info 参数说明
--wiredTigerCacheSizeGB arg

Maximum amount of memory to allocate for cache; Defaults to 1/2 of physical

为缓存分配的最大内存量；默认为物理值的 1/2（也就是我 windows 电脑的的 1/2，`最小值为 0.25`）
:::

## 1 造数据

使用 mockjs 生成 100 万条数据，插入到 MongoDB 中，并测试查询速度和内存占用情况。

### 1.1 创建测试项目

```shell
#初始化项目
pnpm init
#安装以来
pnpm install mockjs mongodb
#编写脚本
touch index.js
#运行脚本
node index.js
```

### 1.2 编写 nodejs 脚本

```javascript
const Mock = require('mockjs');

/**
 * id:自增
 * name:姓名
 * email:邮箱
 * age:年龄
 * address:地址
 * intro:个人说明
 * createTime:创建时间
 */
const data = Mock.mock({
  'list|1000000': [
    {
      id: '@increment',
      name: '@cname',
      email: '@email',
      age: '@natural(18, 80)',
      address: '@county(true)',
      intro: '@cparagraph',
      createTime: '@datetime',
    },
  ],
});

// 需要使用mongosh先创建用户
// db.createUser({user: "root", pwd:  "123456", roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] } )

const { MongoClient } = require('mongodb');
const uri = 'mongodb://root:123456@127.0.0.1:27017';
const client = new MongoClient(uri);

// 库名
const dbName = 'test';

async function main() {
  await client.connect();
  console.log('创建连接: ' + new Date().toLocaleString());
  const db = client.db(dbName);
  const collection = db.collection('users');

  // 插入数据
  await collection.insertMany(data.list);

  return '插入完成: ' + new Date().toLocaleString();
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
```

这里创建了 100 万条数据，占用空间 343 兆

![](./images/Snipaste_2024-07-17_13-44-40.png)

## 2 插入操作测试

每次插入数据时重启 mongodb

### 2.1 未配置参数插入测试

![](./images/Snipaste_2024-07-17_15-56-17.png)

### 2.2 配置参数插入测试

--wiredTigerCacheSizeGB 0.25

![](./images/Snipaste_2024-07-17_15-50-53.png)

::: warning
可见影响并不大
:::

## 3 查询操作测试

查询语句：

```javascript
db.users.find({ address: { $regex: '^江西.*$' } }).explain('executionStats');
```

指标说明：

- `nReturned`：查询返回文档数
- `executionTimeMillis`：查询耗时
- `totalDocsExamined`：集合总共文档数

### 3.1 未配置参数查询测试

第一次查询

```{3,4,6}
  executionStats: {
    executionSuccess: true,
    nReturned: 29555, //查询返回文档数
    executionTimeMillis: 1106, //查询耗时
    totalKeysExamined: 0,
    totalDocsExamined: 1000000 //集合总共文档数
  }
```

第二次查询

```{3,4,6}
  executionStats: {
    executionSuccess: true,
    nReturned: 29555,
    executionTimeMillis: 618,
    totalKeysExamined: 0,
    totalDocsExamined: 1000000,
  }
```

::: warning
可以看到时间变快了，猜测可能和缓存有关
:::

查询完成后，查看 mongodb 内存占用

![](./images/Snipaste_2024-07-17_13-52-26.png)

### 3.2 配置参数查询测试

--wiredTigerCacheSizeGB 0.25

第一次查询

```{3,4,6}
  executionStats: {
    executionSuccess: true,
    nReturned: 29555,
    executionTimeMillis: 1083,
    totalKeysExamined: 0,
    totalDocsExamined: 1000000,
  }
```

第二次查询

```{3,4,6}
  executionStats: {
    executionSuccess: true,
    nReturned: 29555,
    executionTimeMillis: 5913,
    totalKeysExamined: 0,
    totalDocsExamined: 1000000,
  }
```

第三次查询

```{3,4,6}
  executionStats: {
    executionSuccess: true,
    nReturned: 29555,
    executionTimeMillis: 6971,
    totalKeysExamined: 0,
    totalDocsExamined: 1000000,
  }
```

::: warning
可以看到缓存大小的改变，对查询的速度影响很大
:::

查询完成后，查看 mongodb 内存占用

![](./images/Snipaste_2024-07-17_14-05-02.png)
