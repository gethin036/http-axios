/*
  type：请求方法
  data: 发送的数据
  url: 请求的url
  success:回掉函数
*/
ajax: function(option) {
    //1.创建异步对象
    var xhr = new XMLHttpRequest();
    //2.请求行
    if (option.type == 'get' && option.data) {
        option.url += '?';
        option.url += option.data;
        // 如果是get请求 那么 把data 设置为null 发送的时候 就相当于 发送null
        option.data = null;
    }
    xhr.open(option.type, option.url);
    //3.请求头(get请求可以省略)
    if (option.type == 'post' && option.data) {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    //4.注册状态改变事件
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let type = xhr.getResponseHeader('content-type');
            if (type.indexOf('json') != -1) {
                option.success(JSON.parse(xhr.responseText));
                return;
            }
            if (type.indexOf('xml') != -1) {
                option.success(xhr.responseXML);
                return;
            }
            option.success(xhr.responseText);
        }
    }

    //5.发送请求
    xhr.send(option.data);
}





/*
    自定义封装axios

 */

import axios from 'axios';  // 引入axios
import qs from 'qs';  

axios.default.timeout = 50000;  // 设置超时时间
axios.default.baseURL = '';  // 设置请求头

// 数据序列化 整理post请求的数据
axios.default.transformRequest = [function(data) {
    return qs.stringify(data)
}]

// http request 拦截
axios.interceptors.request.use( 
    config => {
        config.data = JSON.stringify(config.data);  // 可能也是数据序列化
        config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded' 
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


axios.interceptors.response.use(

    response => {
        if(response.data.errcode == 2) {
            router.push({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath} // 从哪个页面跳转
            })
        }

        return response;
    },
    error => {
        return Promise.reject(error);
    }
);


	/**
	 * 封装get方法
	 * @param url
	 * @param data
	 * @returns {Promise}
	 */
    export function get(url, params={}) {
        return new Promise((resolve, reject) => {
            axios.get(url,{
            	params: params
            })
            .then(response => {
            	resolve(response.data);
            })
            .catch(err => {
            	reject(err);
            })
        })
    };

    /**
	 * 封装post请求
	 * @param url
	 * @param data
	 * @returns {Promise}
	 */
    export function post(url,data={}) {
    	return new Promise((resolve, reject) => {
    		axios.post(url, data)
    			.then(response => {
    				resolve(response.data);
    			}),err => {
    				reject(err);
    			}
    	})
    }



    import {get, post} from '../utils/http'
    Vue.prototype.$get = get;
    Vue.prototype.$post = post;



    this.$get() || this.$post()

