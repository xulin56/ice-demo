import { Message } from '@alifd/next';
import { createApp, IAppConfig, config } from 'ice';
const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
  router: {
    type: 'browser' // hash、memory
  },
  store: {
  },
  logger: {
    level: config.loglevel
  },
  request: {
    // 可选的，全局设置 request 是否返回 response 对象，默认为 false
    withFullResponse: false,

    baseURL: '',
    headers: {},
    // ...RequestConfig 其他参数

    // 拦截器
    interceptors: {
      request: {
        onConfig: (config) => {
          // 发送请求前：可以对 RequestConfig 做一些统一处理
          config.headers = {
            'Content-Type': 'application/json;charset=utf-8',
            'If-Modified-Since': 0
          };
          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        }
      },
      response: {
        onConfig: (response) => {
          // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
          if (!response.data.success) {
            Message.error(response.data.message)
          }
          return response;
        },
        onError: (error) => {
          // 请求出错：服务端返回错误状态码
          console.log(error.response.data); 
          Message.error(`${error.response.status}服务器错误`);
          console.log(error.response.headers);
          return Promise.reject(error);
        }
      },
    }
  }
};
createApp(appConfig);
