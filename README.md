# 项目说明

 egg-sachikawa是一套基于[egg.js](https://eggjs.org/)的大中型应用后端框架，该框架在基本egg框架的基础上集成了诸多应用后端功能。使开发者不需要掌握太多的知识，仅仅只需要编写少量业务代码就能轻松的搭建一个安全完整的应用后端。

## 目录
- [框架介绍](#框架介绍)
- [开发理念](#开发理念)
- [快速入门](#快速入门)
- [框架特性](#框架特性)
  - [路由](#路由)
  - [参数校验](#参数校验)
  - [返回数据处理](#返回数据处理)
  - [安全性](#安全性)
  - [数据库](#数据库)
  - [Redis](#Redis)
  - [缓存](#缓存)
  - [分布式锁](#分布式锁)
  - [远程调用](#远程调用)
  - [工具包](#工具包)
- [项目结构](#项目结构)
  - [框架扩展](#框架扩展)
  - [中间件](#中间件)
  - [路由工厂](#路由工厂)
  - [扩展库](#扩展库)
- [二次扩展](#二次扩展)
- [开发指南](#开发指南)

## 框架介绍

### 适用范围
- 本框架仅适用于后端开发。不适用于前端开发，也不适用于前后端一体的网站开发。
- 本框架适用于高并发，和逻辑运算量不是很大的项目，例如各种网站项目。但是不适用于逻辑运算量巨大的项目，例如神经网络训练项目。
- 本框架适用于使用方和开发方统一的项目，如企业自主研发项目。不适用于使用方和开发方不统一的项目，如外包项目。除非开发者不介意对方得到整个项目的全部源代码。

### 框架优势
- 较低的开发门槛。只要了解Javascript和简单的数据库操作，就可以迅速的上手。
- 较低的开发和维护成本。由于框架设计的核心理念就是用尽可能简洁的代码来完成项目，而且大量采用配置代替代码，因此最终项目代码会相对少一些，也更容易维护一些。
- 完善的功能集合。框架集成了一个后端项目中能用到的大多数功能，并且都提供了简单的使用方法。
- 容易扩展。作为一个[egg.js](https://eggjs.org/)框架，sachikawa可以很容易的进行二次扩展。并且框架本身选择的功能包大多也都提供了自主扩展的方法。

## 开发理念
本框架的核心理念是：**用最少最简洁的代码来完成项目**<br/>
在现代的在线应用中，后端作为产品的数据管理中心，其重要性是不言而喻的。后端作为前端和数据中心沟通的桥梁，除了需要同时针对成千上万个用户的数据处理请求之外，还必须要能随时确保数据的安全有效，并且还要具备一定的防范恶意攻击的能力。因此，在应用后端发展的过程中，针对不同的问题，也产生了各种各样的解决方案。<br/>
然而对于一个初中级开发者来说，要完全掌握并熟练应用这些解决方案非常困难。缺少经验的开发者在很多时候甚至意识不到某些问题的存在，更不用说如何防范和规避问题。即使对于有经验的开发者来说，在多个方案中选择一种合适的也需要花费不少时间。为了避免这些问题，作者依据自己在后端开发过程中遇到的问题，把大量常用解决方案整合到了框架中，并且尽可能的简化了这些方案的使用方法，并努力确保这些方案的可替代性和可扩展性。<br/>
通过集成这些方案，可以让初中级开发者也可以使用尽可能少的代码，在较低的风险下快速的进行后端项目开发，从而降低整个项目的开发成本。

## 快速入门
本节将展示一下如何快速的使用本框架完成一个简单的项目并实际运行。

### 一、准备工作
由于本项目基于[egg.js](https://eggjs.org/)。因此开发前必须先完成以下准备工作：
- 掌握JavaScript脚本的编写，并且了解ES6语法
- 已经安装好最新稳定版的Node.js
- 掌握Node.js，并且熟悉npm命令
- 阅读过[egg.js](https://eggjs.org/)的[快速入门文档](https://eggjs.org/zh-cn/intro/quickstart.html)并且能够跟着指引简单的搭建一个http项目。
- 对http协议有基本的了解，至少了解何谓**无状态协议**

### 二、搭建项目
1. 使用egg的脚手架搭建一个simple类型的项目，确保项目能正常执行
2. 在项目下执行以下命令来安装sachikawa框架
```bash
$ npm i egg-sachikawa --save
```
3. 编辑package.json文件，在egg下加入framework来启用sachikawa框架
```json
  "egg": {
    "framework": "egg-sachikawa"
  },
```
4. 通过在app目录下新建文件```http/get/test.js```来添加一个API接口
```js
// app/http/get/test.js
'use strict';
module.exports = () => {
  return {
    async controller() {
      this.success('Hello!Sachikawa!');
    },
  };
};
```
5. 由于这个项目不需要使用数据库，我们还需要先屏蔽数据库插件。在config目录下新建文件plugin.js
```js
// config/plugin.js
'use strict';

module.exports = {
  sequelize: {
    enable: false,
  },
};
```
6. 修改app/router.js文件，启用路由工厂
```js
'use strict';

module.exports = app => {
  app.routerFactory.buildAllRouters(app.router);
};
```
6. 至此，项目搭建完成
### 三、启动项目进行测试
在创建好项目之后，在项目目录下执行命令```npm run dev```来启动项目进行测试。项目启动完成以后在浏览器输入[http://127.0.0.1:7001/test](http://127.0.0.1:7001/test)就可以看到接口返回的结果了。

## 框架特性
本项目作为一个基于[egg.js](https://eggjs.org/)的框架，除了集成egg自身的大量特性以外，为了专注于解决后端开发的问题，还追加了很多与egg基本框架不同的特性。
### 路由
**框架以路径映射的方式管理路由，只需要往特定路径里添加特定文件就可以得到对应接口**<br/>
和egg.js通过router.js文件统一管理项目路由的方式不同，sachikawa框架采用了完全相反的路由管理思路。我们使用[egg-router-factory](https://github.com/985ch/egg-router-factory)来进行路由管理。同时，sachikawa仍然兼容egg.js推荐的接口管理方案。<br/>
在后端项目中，不同的接口依赖的参数和特性各不相同，有些简单的接口只需要简单的依赖，有些复杂的接口可能需要依赖大量的复杂中间件，而针对不同的接口每个中间件可能还要有不同的配置。于是为了让项目便于维护，把原本的```接口逻辑```拆分为```接口配置+接口逻辑```就显得十分必要。因此，我们把每一个接口处理成了一个JSON，这个JSON除了接口逻辑以外，还包含了这个接口需要的所有[中间件](#中间件)的相关配置，而[路由工厂](#路由工厂)则提供了把这些中间件解析成一个个不同接口的功能。<br/>
在这个前提下，每一个接口都需要数行才能描述清楚，如果将所有这些接口放到router.js文件下的话，就会导致该文件太长难以阅读和修改。
除此之外，我们放弃了用独立文件管理所有接口路径还可以减少编码量，让接口路径更加易懂，更能够避免多个开发者在开发过程中经常修改同一个文件导致问题。<br/>
关于路由文件的具体编写方法请参考[开发指南](#开发指南)

### 参数校验
**框架以JSON配置的方式实现参数校验和处理，开发者无需针对不同情况再做额外处理**<br/>
既然是后端项目，那每个接口肯定就要依赖各种各样不同的参数来执行。而对接口参数的校验和处理又成了一个新的问题，为了让代码更简洁易懂，我们并不打算让开发者专门去写代码来校验和处理参数，我们选择了基于[ajv](https://github.com/epoberezkin/ajv)的参数校验中间件[koa-ajv-parser](https://github.com/985ch/koa-ajv-parser)来完成这个任务。<br/>
该插件基于[JSON Schema标准](http://json-schema.org/)并做了一些简化处理，可以通过简单的配置JSON来对参数进行限制。若有参数无法通过校验则直接返回一个错误给访问者，而通过校验的参数则会在进行处理之后存入到ctx.state.params供开发者直接使用。<br/>

### 返回数据处理
**框架提供了现成的方法用于返回标准格式的数据结果，而无需编写代码来对结果进行封装，此外框架还支持结果缓存和压缩。**<br/>
和前端返回html页面不同，后端返回数据通常是以JSON为主。本框架也选择了JSON作为后端返回结果，并且默认提供了对**调用成功**和**调用失败**两种结果的封装。开发者只要简单的调用对应函数就能实现返回对应的结果，而不再需要在每个接口拼写完整的返回结果JSON。<br/>
除了简单的返回结果之外，框架也可以避免由于开发者忘写返回语句导致接口没有响应的情况。在开发者没有给结果赋值的情况下，接口调用方也会得到对应的错误信息，并依据信息联系开发者修复问题。此外，框架还提供了一种可以从任意位置直接把错误抛回给前端并终止业务的方法。为了确保对代码流程的控制，一般情况下请尽量避免使用该方法。但是在必要的时候，该方法也可以大幅度简化业务流程的编写。<br/>
除了对返回结果进行封装，框架还允许开发者利用[koa-compress](https://github.com/koajs/compress)中间件对返回结果进行gzip压缩，以及通过[接口缓存](#缓存)来实现数据的快速返回。<br/>
而如果开发者希望以其他形式返回数据的话，也可以简单的改写框架自带的方法或者像原生egg.js一样直接给ctx.body赋值。

### 安全性
**框架继承了egg.js的安全特性，还可以添加额外的访问限制**<br/>
本框架继承了egg.js的全部安全特性。而在具体业务方面，除了提供严格的参数校验，框架还集成了[koa-ip](https://github.com/nswbmw/koa-ip)中间件用于限制来访者的IP。<br/>

### 数据库
**框架默认采用模型化的方式来访问数据库，并针对常用功能提供了简化方法**<br/>
框架选择使用[egg-sequelize](https://github.com/eggjs/egg-sequelize)来访问数据库，egg-sequelize又依赖于ORM工具[sequelize](https://sequelize.org/)。通过sequelize，我们可以把绝大多数SQL语句作为对象来处理。这不但能够大幅度降低代码的编写和阅读难度，同时也可以避免缺乏经验的开发者由于SQL语句编写不慎导致的**SQL注入漏洞**。<br/>
除了sequelize默认的方法之外，我们还根据之前的开发经验给框架提供了专门的方法用于扩展sequelize的数据模型，以进一步减少开发软件所需的代码量。<br/>
由于sequelize需要对应的数据模型文件，而且数据模型文件比较复杂。一般情况下，我们建议搭配[egg-sequelize-mg](https://github.com/985ch/egg-sequelize-mg)来自动生成数据模型，以提高生产效率。

### Redis
**框架通过[Redis](https://redis.io/)来实现状态管理，缓存和分布式锁等特性**<br/>
众所周知，HTTP协议是无状态协议，因此如何对访问者的状态进行管理就是一个大问题。在传统项目中，使用cookie和session也是一种解决方案，但是在大规模分布式项目中，两者都有其局限性。因此需要一个专门的工具用于管理访问者的状态，而我们选择了以高效著称的Redis来实现这个方案。同时本框架另外两个特性[缓存](#缓存)和[分布式锁](#分布式锁)也依赖Redis来实现。<br/>
在框架中，我们选择了[egg-redis](https://github.com/eggjs/egg-redis)来管理Redis连接。


### 缓存
**框架封装了缓存模块，让开发者仅需几行代码就可以轻松的给项目添加缓存功能**<br/>
在大规模的项目里面，同一时间可能会有上万个用户在访问我们的服务器后端。而如果后端的每一个操作都要查询数据库的话，会造成数据库负担过大，甚至导致数据库宕机。为了避免这种情况的发生，我们可以利用缓存来把数据库的数据存储到本地或者是专门的缓存服务器，以降低对用户操作对数据库的压力，同时提高后端对请求的响应速度。<br/>
框架使用[egg-cache-9](https://github.com/985ch/egg-cache-9)来实现缓存的使用，而该插件则是对[node-cache-9](https://github.com/985ch/node-cache-9)的简单封装。通过该插件，任何开发者都能通过添加几行代码来轻易的使用缓存，也可以轻松的去除对应缓存。<br/>

### 分布式锁
**框架可以利用分布式锁来避免多服务器同时访问一个数据导致的数据一致性问题**<br/>
在大型分布式项目中，我们需要解决这么一个问题：在一个耗时较长，而且对数据一致性有严格要求的操作中。我们如何避免在操作尚未结束的情况下由其他服务器发起的另一个请求也来修改这个数据。通常我们可以用**锁**来解决这个问题，而和单进程的锁不同，而大部分开发者都没有能力去实现一个完整的分布式锁。因此我们在考虑之后，将分布式锁也集成到了项目中，让开发者只需要几行代码就能简单的用上分布式锁。<br/>
分布式锁通过[egg-redlock-9](https://github.com/985ch/egg-redlock-9)来实现，而egg-redlock-9则是对[redlock](https://github.com/mike-marcacci/node-redlock)的一个封装。

### 远程调用
**框架允许开发者对远程调用进行封装之以函数的形式进行调用，从而达到精简代码的目的**<br/>
在后端项目中，我们经常会遇到要访问另一个服务器的接口的情况。通常我们可以直接编写代码来实现整个访问的流程，包括传入参数，处理结果和抛出错误等。但是这样以来，一方面代码会增加，另一方面代码的阅读难度也会上升。在研究了市面上各种RPC方案之后，最终我们放弃了直接使用现成的RPC方案，而改为使用[egg-rpc-like](https://github.com/985ch/egg-rpc-like)来实现类似效果。<br/>
该解决方案并没有使用市面上任何一种完整的RPC解决方案，而只提供了把任意接口封装成为函数形式的方法。通过这个插件，我们既可以使用市面上现有的RPC方案，也可以简单的把任意HTTP请求封装成为RPC的形式来调用。

### 工具包
**框架还提供了工具包类Utils来帮助开发者来进一步精简他们的代码**<br/>
由于我们的目标是让开发者可以用尽可能少的代码完成功能，因此我们还对开发中经常用到的一些简单方法进行了封装。哪怕只是把原本用3行代码实现的方法缩减到1行，当这个方法被使用1000次之后也能让整个项目减少2000行代码。<br/>
工具包提供的功能会经常更新，具体可以查看[开发指南](#开发指南)。

## 项目结构
本项目的结构来自[egg.js](https://eggjs.org/)的框架模板，因此不再对每个目录进行详细介绍，这里只简单概述一下项目下各个文件的功能。

### 框架扩展
app/extend目录下的两个文件分别提供了对Application对象和对Context对象的扩展。其中Application对象追加了errCode对象，用于标准化接口的错误信息；而Context对象则追加了三个方法用于快速返回结果给前端。<br/>
以上方法均可以根据实际需求在项目中被覆盖。<br/>

### 中间件
app/middleware目录下集成了几个默认中间件。
- cache：接口缓存中间件，提供了缓存接口数据的功能。
- compress：结果压缩中间件，提供了压缩结果成为gzip并返回的功能。考虑到性能损耗，多和cache中间件共同使用。
- ipfilter：IP限制中间件，提供了限制访问者IP的功能。
- onerror：错误处理中间件，提供了标准的错误处理功能，也可以在项目中再次扩展。
- params：参数校验中间件，提供了参数校验和处理功能。

### 路由工厂
app/factory.js是路由工厂脚本，该脚本提供了将接口JSON解析并生成对应接口的功能。由于中间件的挂在都在路由工厂进行，因此当项目中存在自定义的中间件时，就要对路由工厂进行扩展。<br/>
**注意：在项目中，仍然需要通过app/router.js脚本来主动调用路由工厂来生成接口。**

### 扩展库
lib目录下存放了一些扩展脚本，用于给框架提供额外的功能和特性。
- errors：提供了错误模板，用于支持框架的一些特性。
- extendmodel：提供了对数据模型的扩展，以简化数据查询类语句的编写。被utils引用。
- framework：egg.js框架模板文件，提供对框架内容的导出。
- randString：提供生成随机字符串的方法。被utils引用。
- utils：提供了框架的[工具包](#工具包)，通过framework导出。

## 二次扩展
关于框架的二次扩展内容参见[egg.js](https://eggjs.org/)的[框架开发](https://eggjs.org/zh-cn/advanced/framework.html)

## 开发指南
具体如何使用本项目进行后端开发详见[项目wiki](https://github.com/985ch/egg-sachikawa/wiki)