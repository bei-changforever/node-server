## 全局热重启
```npm install -g nodemon``
## 在项目目录下创建 nodemon.json 文件

```json
{ 
    "restartable": "rs",
    "ignore": [
        ".git",
        ".svn",
        "node_modules/**/node_modules"
    ],
    "verbose": true,
    "execMap": {
        "js": "node --harmony"
    },
    "watch": [
 
    ],
    "env": {
        "NODE_ENV": "development"
    },
    "ext": "js json"
 }

```
 ### 修改package.json
```json
 "scripts": {
    "start": "nodemon ./bin/www"
  }
```

## 接口文件
1. EqRouter
2. AirRouter
3. RoomRouter

## Controller 控制层
负责在页面和程序之间传输数据的，做页面的跳转。用户在页面中填写完表单数据，点击提交按钮，页面的表单数据由Controller传入Service层。
## Server 服务层
负责业务模块的应用逻辑设计。Controller只负责管理，而Service负责实施。同样是首先设计接口，再设计其实现类，然后在Spring的配置文件中配置其实现的关联。我们就可以在应用中调用service接口来进行业务处理。service层的业务实，具体要调用已经定义的dao层接口，封装service层业务逻辑有利于通用的业务逻辑的独立性和重复利用性。
## DAO 数据层
dao层主要做数据持久层的工作，封装了负责与数据库进行联系的一些任务，dao层的设计首先是设计dao层的接口，然后在Spring的配置文件中定义该接口的实现类，然后就可以调用该接口来进行数据业务的处理，而不用关心此接口的具体实现类是哪个类，结构清晰，DAO层的数据源，以及有关的数据库连接参数都在/config/db.config配置文件中进行配置。


## PM2 进程管理

再编写配置文件，设置环境变量，根目录下新建一个ecosystem.config.js:

module.exports = {
    apps: [{
        name: "your_app_name",
        script: "./bin/www",
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development",
            "DOMAIN": "http://xxx.xxx.xxxx"
        },
        env_uat: {
            "PORT": 3000,
            "NODE_ENV": "uat",
            "DOMAIN": "http://xxx.xxx.xxxx"
        },
        env_production: {
            "PORT": 3000,
            "NODE_ENV": "production",
            "DOMAIN": "http://xxx.xxx.xxxx"
        }
    }]
}


npm install -g pm2
npm install -g cross-env


"scripts": {
    "dev": "cross-env NODE_ENV=development DEBUG=app-server nodemon ./bin/www --name 'app'",
    "start": "pm2 start ecosystem.config.js --env production",
    "uat": "pm2 start ecosystem.config.js --env uat"
  },

