
import axios from 'axios';
// import {error} from 'components/Message';
// import urls from './urls';
// import {lStore} from './index';
// import store from 'store';
// import {startLoading,stopLoading} from 'views/App/actions';
import qs from 'qs';
import { Message } from '@alifd/next';

const error = Message.error;
const axiosInstance = axios.create({
  baseURL: '',
  // 自定义请求头信息
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json;charset=utf-8',
  },
  // 超时时间
  timeout: 30000,
  // 跨域是否携带身份凭证
  withCredentials: false, // default
  // 返回数据的格式arraybuffer,blob,document,json,text,stream
  responseType: 'json', // default
  // xsrf
  xsrfCookieName: 'XSRF-TOKEN', // default
  xsrfHeaderName: 'X-XSRF-TOKEN', // default
  // http响应内容的最大值
  maxContentLength: 2000,
  // `validateStatus`定义了是否根据http相应状态码，来resolve或者reject promise
  // 如果`validateStatus`返回true(或者设置为`null`或者`undefined`),那么promise的状态将会是resolved,否则其状态就是rejected
  validateStatus: function (status) {
    return status >= 200 && status < 400; // default
  },
});

// POST传参序列化
axiosInstance.interceptors.request.use(
  config => {
    // store.dispatch(startLoading());
    const isPost = config.method === 'post'
    // const token = lStore.get('token')
    if (token) {
      config.headers['authorization'] = token.split('@')[0];
    }
    const extraData = {
      // token,
    }

    // 是否开启表单提交模式，除了加个formData外，入参不变
    if (config.formData) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    // 根据key获取真实的请求url
    config.url = urls[config.url] || config.url
    config.params = { ...config.params, ...(isPost ? {} : extraData) }
    config.transformRequest = [
      (data) => {
        data = { ...data, ...(isPost ? extraData : {}) }
        return config.formData ? qs.stringify(data) : JSON.stringify(data)
      }
    ]
    return config
  },
  error => {
    if (error) {
      console.log('axios.interceptors.request', error)
    }
    const err = {
      code: 400,
      desc: '错误的传参!',
      data: {},
    }
    // error(err.desc)
    return Promise.reject(err)
  },
);

// code状态码200判断

axiosInstance.interceptors.response.use(
  resp => {
    // store.dispatch(stopLoading());
    // console.log('resp', resp)
    const { url, nopreprocess } = resp.config
    const res = resp.data;
    // 如果是外部服务就直接返回
    if (isHttp(url)) return res
    // 如果返回html
    if (typeof resp.data === 'string' && (resp.data.includes('<!DOC') || resp.data.includes('<!doc'))) {
      error('服务器错误（非json格式）!');
      return Promise.reject({
        code: 400,
        desc: '服务器错误（非json格式）!',
        data: {},
      });
    }
    if (res.rc !== 0 && !nopreprocess) {
      // error(res.msg);
      error('error');
      return Promise.reject(res);
    }
    return res;
  },
  errors => {
    // store.dispatch(stopLoading());
    if (errors) {
      console.log('axios.interceptors.response', errors);
    }
    // 设置默认返回
    const errDefault = {
      code: 404,
      desc: '网络有点慢,换个姿势再来一次!',
      data: {},
    };
    // 如果没有返回值
    if (!errors.response) {
      return Promise.reject(errDefault);
    }
    // 如果有response.status
    switch (errors.response.status || 404) {
      case 400:
        error(errors.response.data.msg)
        break;
      case 401:
        browser.push('/login');
        break;
      case 403:
        console.log('RES STATUS: ', 403);
        break;
      case 404:
        console.log('RES STATUS: ', 404);
        break;
      case 406:
        console.log('RES STATUS: ', 406);
        break;
      case 410:
        console.log('RES STATUS: ', 410);
        break;
      case 422:
        console.log('RES STATUS: ', 422);
        break;
      case 500:
        console.log('RES STATUS: ', 500);
        break;
      default:
        alert(errors.response.status+'系统异常')
        break;
    }
    const err = { ...errDefault, ...errors.response.data };
    // error(err.msg);
    return Promise.reject(err);
  },
);

export default axiosInstance;


const isHttp = function (path) {
  let httptest = /^http[s]?:\/\//;
  return httptest.test(path)
}
