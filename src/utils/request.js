import { useRequest } from 'ice';

const API = (url, method, data)=>{
    return new Promise((resolve, reject)=>{
        let params = {
            url,
            method,
        }
        if(data) params.data = data;
        const reApi = useRequest(params);
          if(!reApi.error) {
            reApi.request();
            resolve(reApi.data);
        }else {
            reject(reApi.error)
        };
    });
}


  export default API