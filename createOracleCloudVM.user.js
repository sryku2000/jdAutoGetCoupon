// ==UserScript==
// @name         Oracle Cloud 建虛擬機 + Skip Timeout
// @version      2.1 
// @description  Get Free VM
// @author       Eason Lin
// @match        https://cloud.oracle.com/compute/instances/create*
// @match        https://console.ap-seoul-1.oraclecloud.com/compute/instances/create*
// @match        https://compute.plugins.oci.oraclecloud.com/latest/prod-ap-tokyo-1-index.tpl.html
// @match        https://compute.plugins.oci.oraclecloud.com/latest/prod-ap-seoul-1-index.tpl.html
// @run-at       document-body
// @grant        GM_addStyle
// ==/UserScript==
GM_addStyle('#GM_timeout_showtime{ background-color: teal; border-radius: 10px; color: navajowhite; font-size: 2em; padding: 10px; position: fixed; right: 30px; top: 120px; z-index: 999; transition-duration: 0.3s; opacity: 1;} #GM_timeout_showtime:hover{opacity: 0}');
GM_addStyle('#GM_log{ background-color: teal; border-radius: 10px; bottom: 80px; color: navajowhite; font-size: 2em; padding: 10px; position: fixed; right: 30px; z-index: 9999; transition-duration: 0.3s; opacity: 1;} #GM_log:hover{opacity: 0}');

const sleep = (ms) => {
    console.log(`[SLEEP] ${ms}ms`);
    return new Promise(resolve => setTimeout(resolve, ms));
}
const sleepRand = (min, max) => {
    let randSec = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, randSec * 1000));
}
const getFullNow = () => {
    return new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
const getNow = () => {
    return new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const getLSItem = (name) => {
    return localStorage.getItem(name) || '無記錄';
}

// top (timeout視窗)
if (location.href.includes('compute/instances/create')) {
    console.log('[HELLO] top');
    let timeout_showtime = document.createElement('div');
    timeout_showtime.id = 'GM_timeout_showtime';
    timeout_showtime.innerHTML = 'Timeout 尚未出現';
    document.body.appendChild(timeout_showtime);
    setInterval(() => {
        let btnContinue = document.querySelector('.oui-form-dialog__footer-controls .oui-button-primary');
        if (btnContinue) {
            if (btnContinue.innerHTML === '繼續作業') {
                timeout_showtime.innerHTML = 'Timeout 出現時間: ' + getFullNow();
                btnContinue.click();
            }
        }
    }, 10000);
}

// iframe (自動點擊建立)
if (location.href.includes('compute.plugins.oci.oraclecloud.com')) {
    console.log('[HELLO] iframe');
    let log = document.createElement('div');
    log.id = 'GM_log';
    //讀取上次記錄
    log.innerHTML = `上次開始時間： ${getLSItem('startTime')}<br>上次最後執行時間： ${getLSItem('execTime')}`;
    document.body.appendChild(log);
    (async () => {
        try {
            // 確定下方按鈕列出現後才執行
            while (!document.querySelector('.oui-savant__Panel--Footer')) {
                await sleep(1000);
            }
            // 加入按鈕
            let btnStart = document.createElement('button');
            let footerPanel = document.querySelector('.oui-savant__Panel--Footer');
            btnStart.innerHTML = 'Do Big Things';
            btnStart.className = 'oui-button oui-button-danger';
            btnStart.addEventListener('click', async () => {
                localStorage.setItem('startTime', getFullNow());
                document.querySelector('.oui-button-primary').click();
                btnStart.innerHTML = 'Doing Big Things';
                btnStart.disabled = true;
                setInterval(() => {
                    document.querySelector('.oui-button-primary').click();
                    btnStart.innerHTML = 'Doing Big Things';
                    log.innerHTML = `開始時間：${getLSItem('startTime')}<br>最近執行時間：${getNow()}`;
                    localStorage.setItem('execTime', getFullNow());
                }, 5000);
                // 隨機秒數，上下捲動頁面
                let ele = document.querySelector('.oui-savant__Panel--Contents');
                while (true) {
                    ele.scrollTo({ top: ele.scrollHeight, behavior: 'smooth' })
                    await sleepRand(3, 10);
                    ele.scrollTo({ top: 0, behavior: 'smooth' })
                    await sleepRand(8, 15);
                }
            })
            footerPanel.appendChild(btnStart);
        } catch (error) {
            console.log(error);
        }
    })()
}