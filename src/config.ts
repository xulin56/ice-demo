// 拿到当前环境
/*配置之后框架会自动根据当前环境将配置进行合并覆盖，开发者只需要在代码中直接使用 config 即可：
import { config } from 'ice';
console.log(config.appId);
*/
// if (/pre.example.com/.test(location.host)) {
//   // 动态增加预发环境
//   window.__app_mode__ = 'pre';
// }

export default {
  // 默认配置
  default: {
    appId: '123',
    baseURL: '/api',
    logLevel: 'warn'
  },
  local: {
    appId: '456',
  },
  daily: {
    appId: '789',
  },
  prod: {
    appId: '101',
    logLevel: 'error'
  }
}