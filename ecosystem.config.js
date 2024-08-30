module.exports = {
    apps: [{
        name: "Thing-Server",
        script: "./bin/www",
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development",
            "DOMAIN": "http://localhost:3000"
        },
        env_uat: {
            "PORT": 3000,
            "NODE_ENV": "uat",
            "DOMAIN": "http://localhost:3000"
        },
        env_production: {
            "PORT": 3000,
            "NODE_ENV": "production",
            "DOMAIN": "http://localhost:3000"
        }
    }]
}
