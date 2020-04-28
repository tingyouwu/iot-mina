/**
 *  针对AliYun 设备管理API请求
 *  @Date 2020-04-27
 **/

import { aliyunApi } from '../../utils/aliyunHttp.js';

const app = getApp();

let deviceApi = {

    /**
     * 调用该接口在指定产品下注册设备
     * https://help.aliyun.com/document_detail/69470.html?spm=a2c4g.11186623.6.757.280e4f14qQCLDB
     *
     * @param {Object} param 请求参数
     * {
     *      DeviceName: xxxx,
     *      Nickname: xxxx
     * }
     **/
    registerDevice(param = {}) {
        let opts = {
            data: {
                ...param,
                Action: 'RegisterDevice',
                ProductKey: app.aliConfig.ProductKey,
            }
        };
        return aliyunApi.post(opts);
    },

    /**
     * 调用该接口查询指定产品下的所有设备列表,分页接口
     * https://help.aliyun.com/document_detail/69905.html?spm=a2c4g.11186623.6.760.35eb56ceEMpdTl
     *
     * @param {Object} param 请求参数
     * {
     *      PageSize: xxxx,
     *      CurrentPage: xxxx
     * }
     **/
    queryDevice(param = {}) {
        let opts = {
            data: {
                ...param,
                Action: 'QueryDevice',
                ProductKey: app.aliConfig.ProductKey,
            }
        };
        return aliyunApi.get(opts);
    },

    /**
     * 调用该接口删除指定设备
     * https://help.aliyun.com/document_detail/69281.html?spm=a2c4g.11186623.6.761.4b224f14ht6pYE
     *
     * @param {Object} param 请求参数
     * {
     *      IotId: xxxxx,
     * }
     **/
    deleteDevice(param = {}) {
        let opts = {
            data: {
                ...param,
                Action: 'DeleteDevice',
            }
        };
        return aliyunApi.get(opts);
    },

    /**
     * 调用该接口查看指定设备的运行状态
     * https://help.aliyun.com/document_detail/69617.html?spm=a2c4g.11186623.6.762.14565d42heHaxg
     *
     * @param {Object} param 请求参数
     * {
     *      IotId: xxxxx,
     * }
     **/
    getDeviceStatus(param = {}) {
        let opts = {
            data: {
                ...param,
                Action: 'GetDeviceStatus',
            }
        };
        return aliyunApi.get(opts);
    },

    /**
     * 调用该接口查询指定设备的详细信息
     * https://help.aliyun.com/document_detail/69594.html?spm=a2c4g.11186623.6.758.1903295caxo36Y
     *
     * @param {Object} param 请求参数
     * {
     *      IotId: xxxxx,
     * }
     **/
    queryDeviceDetail(param = {}) {
        let opts = {
            data: {
                ...param,
                Action: 'QueryDeviceDetail',
            }
        };
        return aliyunApi.get(opts);
    },

    /**
     * 调用该接口批量修改设备备注名称
     * https://help.aliyun.com/document_detail/112165.html?spm=a2c4g.11186623.6.770.20ea7734b6weHx
     *
     * @param {Object} param 请求参数
     * {
     *      DeviceNicknameInfo.N.IotId: xxxxx,
     *      DeviceNicknameInfo.N.Nickname: xxxxx
     * }
     **/
    updateDeviceNickname(param = {}) {
        let opts = {
            data: {
                ...param,
                Action: 'BatchUpdateDeviceNickname',
            }
        };
        return aliyunApi.get(opts);
    },
};

export { deviceApi };
