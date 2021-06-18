// ==UserScript==
// @name         京東搶券
// @version      1.5
// @description  Get coupon
// @author       Neal Liu
// @match        https://pro.jd.com/mall/active/*/index.html
// @match        https://pro.m.jd.com/mall/active*
// @match        https://a.jd.com/*
// @run-at       document-body
// @grant        none
// @homepageURL  https://github.com/sryku2000/jdAutoGetCoupon
// @updateURL    https://github.com/sryku2000/jdAutoGetCoupon/raw/main/getCoupon.user.js
// @downloadURL  https://github.com/sryku2000/jdAutoGetCoupon/raw/main/getCoupon.user.js
// ==/UserScript==
const sleep = (ms) => {
    console.log(`[SLEEP] ${ms}ms`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    try {
        let eventTimes = [{
            "startTime": "08:59:55",
            "endTime": "09:00:05"
        }, {
            "startTime": "09:59:55",
            "endTime": "10:00:05"
        }, {
            "startTime": "11:59:55",
            "endTime": "12:00:05"
        }, {
            "startTime": "14:59:55",
            "endTime": "15:00:05"
        }, {
            "startTime": "19:59:55",
            "endTime": "20:00:05"
        }, {
            "startTime": "00:00:00",
            "endTime": "00:00:05"
        }];

        // 確定下方按鈕列出現後才執行
        while (!document.querySelector('.jdm-toolbar-footer') && !document.querySelector('.ui-slidebar-new') && !document.querySelector('#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_0.module_undefined.floatLayer > div'))
            await sleep(1000);

        let footerPanel_618 = document.querySelector('.jdm-toolbar-footer');
        let footerPanel_coupon_center = document.querySelector('.ui-slidebar-new');
        let open_app_btn = document.querySelector('#J_babelOptPage > div > div.bab_opt_mod.bab_opt_mod_1_0.module_undefined.floatLayer > div');

        // 加入按鈕
        let btnStart = document.createElement('button');
        btnStart.innerHTML = 'Get coupon';
        btnStart.className = 'oui-button oui-button-danger J-trigger jdm-toolbar-tab';
        btnStart.style.height = '50px';
        btnStart.style.background = 'lightgreen';

        btnStart.addEventListener('click', () => {
            setInterval(() => {
                if (eventTimes.filter(data => (data.startTime < getTime() && getTime() < data.endTime)).length > 0) {
                    console.log('Start getting...');
                    btnStart.innerHTML = 'Getting...';
                    btnStart.disabled = true;

                    //過濾已領取優惠券
                    //618主會場(藍:運費券，紅:全品類)/618好店鉅惠開門紅/新人188大禮包
                    if (document.querySelectorAll(".coupon-item.no-illus:not(.coupon_receive):not(.coupon_today_receive)").length > 0) {
                        document.querySelectorAll(".coupon-item.no-illus:not(.coupon_receive):not(.coupon_today_receive)").forEach(function (btn) {
                            btn.click();
                        });
                    }
                    //領券中心
                    if (document.querySelectorAll('.btn-def').length > 0) {
                        document.querySelectorAll('.btn-def').forEach(function (btn) {
                            btn.click();
                        });
                    }

                    if (document.querySelectorAll('.button_can_click').length >0) {
                        document.querySelectorAll('.button_can_click').forEach(function (btn) {
                            btn.click();
                        });
                    }
                    btnStart.innerHTML = 'Getting...' + getTime();

                } else {
                    console.log(new Date() + '--It is not the time.');
                };
            }, 1000);
        })

        startBtnAppend(footerPanel_618, btnStart);
        startBtnAppend(footerPanel_coupon_center, btnStart);
        startBtnAppend(open_app_btn, btnStart);

    } catch (error) {
        console.log(error);
    }

    function startBtnAppend(elem, btn) {
        if (elem != null) {
            elem.appendChild(btn);
        }
    }

    function getTime() {
        return new Date().toLocaleString('zh-TW', {
            timeZone: 'Asia/Taipei',
            hourCycle: 'h23',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
})()

