// ==UserScript==
// @name         小米搶券
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://event.mi.com/tw/smartliving
// @icon         https://www.google.com/s2/favicons?domain=mi.com
// @grant        none
// ==/UserScript==

const sleep = (ms) => {
    console.log(`[SLEEP] ${ms}ms`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    try {
        let eventTimes = [{
            "startTime": "09:59:55",
            "endTime": "10:00:05"
        }];

        // 確定下方按鈕列出現後才執行
        while (!document.querySelector('.fl'))
            await sleep(1000);

        let footerPanel_618 = document.querySelector('.fl');

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

                    if (document.querySelectorAll(".coupon").length > 0) {
                        document.querySelectorAll(".coupon").forEach(function (btn) {
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

