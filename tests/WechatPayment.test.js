import WechatPayment from '../lib/WechatPayment';
import { expect } from 'chai';
import fs from 'fs';

var wechatConfig = require('../config/realWechat.json');

describe('Wechat payment 测试', function () {

    describe('Wechat Payment 构造函数', function () {
        let options = {
            //appid: wechatConfig.appId,
            mch_id: wechatConfig.mchId,
            apiKey: wechatConfig.partnerKey, //微信商户平台API密钥
            //pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
        }

        it('应该返回没有app id错误', function () {
            var fcn = function () { new WechatPayment(options) };
            expect(fcn).to.throw("Seems that app id or merchant id is not set, please provide wechat app id and merchant id.");
        });

        it('成功构造wechat payment instance', function () {
            options['appid'] = wechatConfig.appId;
            let wechatPaymentInstance = new WechatPayment(options);
            expect(wechatPaymentInstance.options).to.not.be.empty;
        });
    });

    var myResult = '';

    describe('统一下单接口: wxPayment.createUnifiedOrder', function () {
        let options = {
            appid: wechatConfig.appId,
            mch_id: wechatConfig.mchId,
            apiKey: wechatConfig.partnerKey, //微信商户平台API密钥
            //pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
        }


        let wechatPaymentInstance = new WechatPayment(options);
        it('统一下单', function () {
            wechatPaymentInstance.createUnifiedOrder({
                body: '支付测试',
                out_trade_no: '20140703' + Math.random().toString().substr(2, 10),
                total_fee: 1,
                spbill_create_ip: '192.168.2.210',
                notify_url: wechatConfig.notifyUrl,
                trade_type: wechatConfig.tradeType,
            })
                .then(result => {
                    console.log(result, 'result');
                    myResult = result;
                    expect(result.return_code).to.be.equal('SUCCESS');

                })
                .catch(err => {
                    console.log(err);
                })
        });
    });

    describe('生成payment设置: wxPayment.configForPayment', function () {
         let options = {
            appid: wechatConfig.appId,
            mch_id: wechatConfig.mchId,
            apiKey: wechatConfig.partnerKey, //微信商户平台API密钥
            //pfx: fs.readFileSync('./apiclient_cert.p12'), //微信商户平台证书 (optional，部分API需要使用)
        }
        let wechatPaymentInstance = new WechatPayment(options);
        it('生成配置', function () {
            let prepayId = 'wx201612132002348597b1e4c50601226291';
            let config = wechatPaymentInstance.configForPayment(prepayId);
            console.log(config, 'payment config');
        });
    });



});
