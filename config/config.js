require("dotenv").config();

// code from Chris
// environmentValueOrDefault is a helper function 
// found just below this example in the document.
// const dbUser = environmentValueOrDefault('DB_USER', 'root');
// const dbPassword = environmentValueOrDefault('DB_PASSWORD', 'root');
// const dbHost = environmentValueOrDefault('DB_HOST', 'localhost');
// const dbPort = environmentValueOrDefault('DB_PORT', '3306');
// const dbName = environmentValueOrDefault('DB_NAME', 'myRPG_db');

// function environmentValueOrDefault(key, defaultValue){
//     return typeof process.env[key] !== 'undefined'
//         ? process.env[key]
//         : defaultValue;
// }

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, PUB_KEY, SUB_KEY } = process.env;

module.exports =
{
    "development": {
      "username": DB_USER,
      "password": DB_PASSWORD,
      "database": DB_NAME,
      "host": DB_HOST,
      "port": DB_PORT,
      "dialect": "mysql"
    },
    "test": {
        "username": DB_USER,
        "password": DB_PASSWORD,
        "database": DB_NAME,
        "host": DB_HOST,
        "port": DB_PORT,
        "dialect": "mysql"
    },
    "production": {
        "username": DB_USER,
        "password": DB_PASSWORD,
        "database": DB_NAME,
        "host": DB_HOST,
        "port": DB_PORT,
        "dialect": "mysql"
    },
    "pubnub": {
        "publishKey": PUB_KEY,
        "subscribeKey": SUB_KEY
    }
};
