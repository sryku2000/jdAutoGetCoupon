// ==UserScript==
// @name         Oracle Cloud 建虛擬機
// @version      0.2
// @description  Get Free VM
// @author       Eason Lin
// @match        https://compute.plugins.oci.oraclecloud.com/latest/prod-ap-tokyo-1-index.tpl.html
// @run-at       document-body
// @grant        none
// ==/UserScript==
const sleep = (ms) => {
    console.log(`[SLEEP] ${ms}ms`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    try {
        // 確定下方按鈕列出現後才執行
        while (!document.querySelector('.oui-savant__Panel--Footer')) {
            await sleep(1000);
        }
        // 加入按鈕
        let btnStart = document.createElement('button');
        let footerPanel = document.querySelector('.oui-savant__Panel--Footer');
        var hasfooterPanel = document.querySelector('.oui-savant__Panel--Footer') !== null;
        console.log('footerPanel', footerPanel);
        btnStart.innerHTML = 'Do Big Things';
        btnStart.className = 'oui-button oui-button-danger';
        btnStart.addEventListener('click', () => {
            btnStart.innerHTML = 'Doing Big Things';
            btnStart.disabled = true;
            setInterval(() => {
                var selection = document.querySelector('.oui-button-primary') !== null;
                if (selection) {
                    document.querySelector('.oui-button-primary').click();
                }
                if(hasfooterPanel){
                    let now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    btnStart.innerHTML = 'Doing Big Things ' + now;
                }
            }, 5000);
        })
        if(hasfooterPanel){
            footerPanel.appendChild(btnStart);
        }
    } catch (error) {
        console.log(error);
    }
})()