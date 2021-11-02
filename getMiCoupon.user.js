// ==UserScript==
// @name         小米搶券
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://event.mi.com/tw/double-11-2021/sales*
// @icon         https://www.google.com/s2/favicons?domain=mi.com
// @grant        none
// ==/UserScript==



const sleep = (ms) => {
        console.log(`[SLEEP] ${ms}ms`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    //0點/9點/16點/20點
    (async() => {
        try {
            let eventTimes = [{
                "startTime": "23:59:55",
                "endTime": "00:00:05"
            }, {
                "startTime": "08:59:55",
                "endTime": "09:00:05"
            }, {
                "startTime": "15:59:55",
                "endTime": "16:00:05"
            }, {
                "startTime": "19:59:55",
                "endTime": "20:00:05"
            }];

            let eventTimesEverydayTenClock = [{
                "startTime": "09:59:55",
                "endTime": "10:00:05"
            }];

            // 確定下方按鈕列出現後才執行
            while (!document.querySelector('.fl'))
                await sleep(1000);

            // 11/1~3:1635696000
            // 11/11: 1636560000
            let startTime = "1635696000";
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

                        if ($(".J_couponArea[data-start-time=" + startTime + "]").length > 0) {
                            $(".J_couponArea[data-start-time=" + startTime + "]").each(function() { $(this).click(); });
                        }

                        btnStart.innerHTML = 'Getting...' + getTime();

                    } else {
                        console.log(new Date() + '--It is not the time.');
                    };

                    if (eventTimesEverydayTenClock.filter(data => (data.startTime < getTime() && getTime() < data.endTime)).length > 0) {
                        console.log('Start getting...');
                        btnStart.innerHTML = 'Getting...';
                        btnStart.disabled = true;

                        if ($(".J_couponArea[data-start-time=1635300000]").length > 0) {
                            $(".J_couponArea[data-start-time=1635300000]").each(function() { $(this).click(); });
                        }

                        btnStart.innerHTML = 'Getting...' + getTime();

                    } else {
                        console.log(new Date() + '--It is not the time.');
                    };


                }, 100);
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