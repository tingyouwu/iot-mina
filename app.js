//app.js
import { getUUID } from './utils/util';
import { storage } from './utils/storage';

App({
    aliConfig: {
        RegionId: 'cn-shanghai',                           // 用户填写
        AccessKeyId: 'xxxxx',           // 用户填写
        AccessKeySecret: 'xxxxxx', // 用户填写
        ProductKey: 'xxxxx',                         // 用户填写
        EndPoint:  'https://iot.cn-shanghai.aliyuncs.com/'
    },

    globalData: {
        uuid: '',
    },

    onLaunch: function () {
        // 判断UUID
        let uuid = storage.get('uuid') || '';
        if(!uuid){
            uuid = getUUID();
            storage.setSync('uuid',uuid);
            this.globalData.uuid = uuid;
        }else {
          this.globalData.uuid = uuid;
        }
    },
});
