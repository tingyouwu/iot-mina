/**
 *  针对AliYun API的HTTP请求工具类
 *  @Date 2020-04-26
 **/

// 通用网络请求
import http from './http.js';
import timeFormat from './timeFormat.js';
// 加密模块
let crypto = require("./cryptojs/cryptojs.js").Crypto;

const app = getApp();

// 配置公共参数
const _defaultParams = () => {
    // 阿里云要求的公共请求参数  https://help.aliyun.com/document_detail/30561.html?spm=a2c4g.11186623.6.739.6bc03d291aEGp1
    let commonParams = {
        Format: 'JSON', // 返回值的类型，支持JSON和XML类型
        Version: '2018-01-20', // API版本号
        AccessKeyId: app.aliConfig.AccessKeyId, // 阿里云颁发给用户的访问服务所用的密钥ID
        // Signature: '', // 签名结果串 需要另外计算  为了方便 不放在公共参数
        SignatureMethod: 'HMAC-SHA1', // 签名方式，目前支持HMAC-SHA1
        Timestamp: timeFormat.getCurrentUTCTime('{YYYY}-{MM}-{DD}T{HH}:{mm}:{ss}Z'), // 请求的时间戳，日期格式按照ISO8601标准表示，并需要使用UTC时间。格式为YYYY-MM-DDThh:mm:ssZ。2016-01-04T12:00:00Z
        SignatureVersion: '1.0', // 签名算法版本
        SignatureNonce: new Date().getTime() + '', // 唯一随机数,用于防止网络重放攻击。用户在不同请求中要使用不同的随机数值
        RegionId: app.aliConfig.RegionId, // 设备所在地域（与控制台上的地域对应），如cn-shanghai。
    };
    return commonParams;
};

// 将数组参数格式化成url传参方式
const _flatArrayList = (target, key, Array) => {
    for (let i = 0; i < Array.length; i++) {
        let item = Array[i];

        if (item && typeof item === 'object') {
            const keys = Object.keys(item);
            for (let j = 0; j < keys.length; j++) {
                target[`${key}.${i + 1}.${keys[j]}`] = item[keys[j]];
            }
        } else {
            target[`${key}.${i + 1}`] = item;
        }
    }
};

//将所有请求参数展开平面化，考虑到有些接口给到的参数是数组
const _flatParams = (params) => {
    let target = {};
    let keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = params[key];
        if (Array.isArray(value)) {
            _flatArrayList(target, key, value);
        } else {
            target[key] = value;
        }
    }
    return target;
};

// url编码
const _percentEncode= (str) => {
    let result = encodeURIComponent(str);

    return result.replace(/\!/g, '%21')
        .replace(/\'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
};

/**
 * 构造规范化的请求字符串
 * @param {Object} params 请求参数，不包括Signature
 * @return {String} result 格式:key1=value1&key2=value2....
 **/
const _getCanonicalizedQueryString = (params) => {
    let list = [];
    let flatParams = _flatParams(params);
    console.log(flatParams);
    Object.keys(flatParams).sort().forEach((key) => {
        let value = flatParams[key];
        list.push([_percentEncode(key), _percentEncode(value)]);
    });

    let queryList = [];
    for (let i = 0; i < list.length; i++) {
        let [key, value] = list[i];
        queryList.push(key + '=' + value);
    }
    return queryList.join('&');
};

/**
 * 获取加密字符串
 * @param {String} stringToSign 请求方法
 * @param {Object} key 签名key
 **/
const _signature = (stringToSign, key) => {
    let signature = crypto.HMAC(crypto.SHA1, stringToSign, key, {
        asBase64: true
    });

    return signature;
};

/**
 * 处理接口响应内容
 *
 * @param {String} res
 * @param {function} resolve
 * @param {function} reject
 **/
function handleResponse(res, resolve, reject) {
    let { Success } = res;
    if (Success) {
        // api调用成功 返回整个数据
        resolve && resolve(res);
    } else {
        // api调用失败
        let { RequestId, Code, ErrorMessage} = res;
        reject && reject({
            RequestId,
            Code,
            ErrorMessage
        });
    }
}

let aliyunApi = {

    /**
     * AliyunApi GET请求
     * @param {Object} opts 包含请求参数、请求URL、请求头
     **/
    get(opts = {}) {
        opts.url = opts.url || app.aliConfig.EndPoint;
        // 获取公共参数
        let defaultParams = _defaultParams();
        // 合并参数
        opts.data = Object.assign(defaultParams,opts.data);
        let canonicalizedQueryString = _getCanonicalizedQueryString(opts.data);
        let stringToSign = `GET&${_percentEncode('/')}&${_percentEncode(canonicalizedQueryString)}`;
        console.log(stringToSign);
        let signature = _signature(stringToSign, app.aliConfig.AccessKeySecret + '&');
        // 补上 Signature参数
        opts.data = {
            ...opts.data,
            Signature: signature
        };

        return new Promise((resolve, reject) => {
            http.get(opts).then((res) => {
                handleResponse(res, resolve, reject);
            }).catch(err => {
                console.log(err);
            })
        });
    },

    /**
     * AliyunApi POST请求
     * @param {Object} opts 包含请求参数、请求URL、请求头
     **/
    post(opts = {}) {
        opts.url = opts.url || app.aliConfig.EndPoint;
        // 获取公共参数
        let defaultParams = _defaultParams();
        // 合并参数
        opts.data = Object.assign(defaultParams,opts.data);
        let canonicalizedQueryString = _getCanonicalizedQueryString(opts.data);
        let stringToSign = `POST&${_percentEncode('/')}&${_percentEncode(canonicalizedQueryString)}`;
        let signature = _signature(stringToSign, app.aliConfig.AccessKeySecret + '&');
        // 补上 Signature参数
        opts.data = {
            ...opts.data,
            Signature: signature
        };

        opts.headers = opts.headers || {};
        opts.headers['content-type'] = 'application/x-www-form-urlencoded'

        return new Promise((resolve, reject) => {
            http.post(opts).then((res) => {
                handleResponse(res, resolve, reject);
            }).catch(err => {
                console.log(err);
            })
        });
    }
};

export { aliyunApi };
