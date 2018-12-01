import merge from 'lodash.merge'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const env = process.env.NODE_ENV

const baseConfig = {
  port: 3000,
  secrets: {},
  db: {
    //url: 'mongodb://localhost:27017/school_management_system'
    url: 'mongodb://heroku_c29m5v6j:gi360lcbseg601af65rb91n7ml@ds123434.mlab.com:23434/heroku_c29m5v6j'

  }
}

let envConfig = {}

switch (env) {
  case 'development':
  case 'dev':
    envConfig = require('./dev').config
    break;
  case 'test':
  case 'testing':
    envConfig = require('./testing').config
    break;
  case 'prod':
  case 'production':
    envConfig = require('./prod').config
  default:
    envConfig = require('./dev').config
}


export default merge(baseConfig, envConfig)
