/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1654083978932_9157';

  // add your middleware config here
  config.middleware = [
    'errorHandler',
    'notFoundHandler',
  ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 关联数据库
  config.mongoose = {
    url: 'mongodb://127.0.0.1/caicai',
    options: {},
    // mongoose global plugins, expected a function or an array of function and options
    plugins: [],
  };

  // 参数校验，中文提示配置
  const I18n = require('i18n');
  I18n.configure({
    locales: [ 'zh-CN' ],
    defaultLocale: 'zh-CN',
    directory: __dirname + '/locale',
  });
  config.validate = {
    translate() {
      const args = Array.prototype.slice.call(arguments);
      return I18n.__.apply(I18n, args);
    },
  };

  // 关闭 csrf 防范
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ 'http://localhost:8085' ],
  };

  // 生成token
  config.jwt = {
    secret: 'e59ffb15-21b1-4357-b922-c68a6590b81c',
    expiresIn: '1d',
  };

  // oss
  config.multipart = {
    mode: 'file',
  };
  config.oss = {
    client: {
      accessKeyId: 'LTAI5tR5Tx6FHAE66xraixGF',
      accessKeySecret: 'RvbATwSjA2Su4vCkcUf2o8NFwTIiBU',
      bucket: 'node-word',
      endpoint: 'oss-cn-hangzhou.aliyuncs.com',
      timeout: '60s',
    },
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,POST',
    credentials: true,
  };

  return {
    ...config,
    ...userConfig,
  };
};
