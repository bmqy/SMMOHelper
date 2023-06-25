import {GM_info,GM_setValue,GM_getValue,GM_xmlhttpRequest} from '$';
(function () {
    const SMMOHelper = {
        storageKey: {
            player: 'player',
            playerId: 'playerId',
            levelStep: 'levelStep',
            token: 'csrfToken',
        },
        getValue(key){
            try {
                return GM_getValue(key, '');
            } catch (error) {
                return localStorage.getItem(key) || ''
            }
        },
        setValue(key, val){
            try {
                return GM_setValue(key, val);
            } catch (error) {
                localStorage.setItem(key, val);
            }
        },
        init(){
            window.addEventListener('load', ()=>{
                this.fakeFetch();
                this.searchPlayerId();
                this.resetDonateButton();
                this.resetJobsButton();
                this.addHeadTravelBtn();
                this.showFooter();
                this.onUserClickBtn();
            })
        },
        searchPlayerId(){
            setTimeout(() => {
                let a = document.querySelector('a[href^="/user/view/"]');
                let id = a.href.match(/\d+/)[0];
                if(id) this.setValue(this.storageKey.playerId, id);
            }, 0);
        },
        // 顶部导航增加旅行按钮
        addHeadTravelBtn(){
            if(location.href.indexOf('/travel')>-1 && location.href.indexOf('/travel/party')===-1) return false;
            if(document.querySelector('#btnToTravel')) return false;
            let $box = document.querySelector('.ml-4.flex.items-center.relative');
            let $a = document.createElement('a');
            $a.id = 'btnToTravel';
            $a.innerHTML = `<a href="/travel">
                    <button class="relative lg:hidden flex-shrink-0 bg-white p-1 text-indigo-600 dark:text-indigo-700 dark:bg-indigo-950 rounded-full hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4">
                    <span class="sr-only">View Friends</span>
                    <!-- Heroicon name: outline/bell -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    </button>
                </a>`;
            $box.insertBefore($a, $box.childNodes[0]);
        },
        // 脚本底部信息
        showFooter(){
            let $div = document.createElement('div');
            $div.style.position = 'fixed';
            $div.style.left = '10px';
            $div.style.bottom = '10px';
            $div.style.fontSize = '14px';
            $div.style.color = '#999';
            $div.innerHTML = `${GM_info['script']['name']} v${GM_info['script']['version']}`
            document.body.appendChild($div);
        },
        // 验证辅助
        validateHelp(){
            let data = {
                'House': '/i-am-not-a-bot/generate_image?uid=3',
                'Pineapple': '/i-am-not-a-bot/generate_image?uid=0',
                'Candy Corn': '/i-am-not-a-bot/generate_image?uid=2',
                'Cherry': '/i-am-not-a-bot/generate_image?uid=3',
            }
        },
        // 监听事件动作，更新Bio
        onUserClickBtn(){
            // 旅行
            if(location.href.indexOf('/travel') > -1){
                let btns = document.querySelectorAll('button');
                btns.forEach((e, i) => {
                    if(e.id.indexOf('step_btn_') > -1){
                        e.addEventListener('click', ()=>{
                            this.getPlayerBio()
                            console.log('旅行');
                        })
                    }
                })
            }
            // 攻击
            else if(location.href.indexOf('/npcs/attack/') > -1){
                let btns = document.querySelectorAll('button');
                btns.forEach((e, i) => {
                    if(e.innerText === 'Attack'){
                        e.addEventListener('click', ()=>{
                            console.log('攻击');
                        })
                    }
                })
            }
            // 采集
            else if(location.href.indexOf('/crafting/material/') > -1){
                let btns = document.querySelectorAll('button');
                btns.forEach((e, i) => {
                    if(e.id === 'crafting_button'){
                        e.addEventListener('click', ()=>{
                            console.log('采集');
                        })
                    }
                })
            }
            // 任务
            else if(location.href.indexOf('/quests/view/') > -1){
                let btns = document.querySelectorAll('button');
                btns.forEach((e, i) => {
                    if(e.id === 'questButton'){
                        e.addEventListener('click', ()=>{
                            console.log('任务');
                        })
                    }
                })
            }
            // 制作
            else if(location.href.indexOf('/crafting/menu') > -1){
                let btns = document.querySelectorAll('button');
                btns.forEach((e, i) => {
                    if(e.innerText === 'Claim Items'){
                        e.addEventListener('click', ()=>{
                            console.log('制作');
                        })
                    }
                })
            }
        },
        // 重置Donate
        resetDonateButton(){
            let _this = this;
            window.donate = function () {
                _this.bmqyDonate.apply(this, arguments);
            }
        },
        // 重置Jobs
        resetJobsButton(){
            let _this = this;
            window.performJob = function () {
                _this.bmqyPerformJob.apply(this, arguments);
            }
        },
        // 重写金币捐赠方法
        bmqyDonate(){
            Swal.fire({
                imageUrl: "/img/icons/I_GoldCoin.png",
                title: 'Gold Donation',
                html: 'Make a donation to the poor orphanage to help the less fortunate.',
                input: 'number',
                inputValue: '2000',
                inputAttributes: {
                autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Donate',
                showLoaderOnConfirm: true,
                preConfirm: function(login) {
                return fetch('/orphanage/donate', {
                    'method': 'POST',
                    body: new URLSearchParams("_token="+token+"&data="+login)
                    })
                    .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json()
                    })
                    .catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    )
                    })
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.value) {
                Swal.fire({
                    title: result.value.title,
                    type: result.value.type,
                    html: result.value.result
                })
                }
            });
        },
        // 重写工作方法
        bmqyPerformJob(id, name, gold, exp){
            var additional_text = "";
                additional_text = additional_text + "<hr/><i>Become a member and get 10 more jobs</i><br/><a href='/diamondstore/membership' class='cta cta-success'>Become a member</a>";
            additional_text = additional_text + '<hr/><h2 class="swal2-title" id="swal2-title" style="font-size:18.75px">How long do you want to work?</h2>';

            Swal.fire({
                title: name,
                html: 'How many times do you want to perform this job? Each job lasts 10 minutes and you can only perform a maximum of 10 jobs.'+
                '<br/><br/><div class="notice notice-info">You cannot travel, perform quests, or battle while you are performing a job</div>'+
                '<div style="text-align:center"><h2 class="swal2-title" id="swal2-title" style="font-size:18.75px">Rewards</h2></div>'+
                '<img src="/img/icons/I_GoldCoin.png" height="15px"> '+gold+' <img src="/img/icons/S_Light01.png"  height="15px"> '+exp+'<br/> <span style="color:rgba(0,0,0,0.6);font-size:11px;font-weight:500;">Per job</span>'+additional_text,
                input: 'range',
                inputAttributes: {
                    min: 1,
                    max: 10,
                    step: 1
                },
                inputValue: 10,

                showCancelButton: true,
                confirmButtonText: 'Start the job',
                cancelButtonText: 'No! I don\'t want to work!',
                showLoaderOnConfirm: true,
                preConfirm: (amount) => {
                    return fetch(`/api/job/perform/`+id+`/`+amount, {
                        'method': 'POST',
                        headers: {
                            "X-CSRF-TOKEN": token,
                        },
                    })
                    .then(response => {
                        if (response.status == 403){
                            throw new Error("Something went wrong.");
                        }
                        //return response.json()
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                        `Request failed: ${error}`
                        )
                    })
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.value) {
                    Swal.fire({
                        title: `Started!`,
                        type: `success`,
                                showConfirmButton: false,
                        text: `You have started the job. Please wait a few moments.`,
                        onBeforeOpen: () => {
                            Swal.showLoading()
                            setTimeout(function(){
                                window.location.href = "/jobs/view/"+id;
                            }, 1500);
                        }
                    })
                }
            });
        },

        // 拦截请求
        fakeFetch(){
            const originFetch = window.fetch;
            window.fetch = (url, options) => {
                return originFetch(url, options).then(async (response) => {
                    if(url === 'https://api.simple-mmo.com/api/action/travel/4'){
                        let resRaw = response.clone();
                        let resF = await resRaw.json();
                        this.checkPlayerLevel(resF.level) && this.updatePlayerBio(resF.level);
                        setValue(this.storageKey.player, resF);
                        return response;
                    }else{
                        return response;
                    }
                });
            }
        },

        http(options){
            return new Promise((resolve, reject)=>{
                GM_xmlhttpRequest({
                    method: options.methods || 'GET',
                    url: options.url,
                    responseType: options.responseType || null,
                    headers: options.headers || null,
                    data: options.data || '',
                    onload: function (xhr) {
                        if (xhr.status == 200) {
                            resolve(xhr.response);
                        } else {
                            reject(xhr.response);
                        }
                    },
                    onerror: function(xhr){
                        reject(xhr.response);
                    }
                });
            });
        },

        // 检测等级变化
        checkPlayerLevel(level){
            let playerData = getValue(this.storageKey.player, {})
            if(!playerData.level) return false;
            let levelStep = getValue('levelStep', 100);
            if(playerData.level!=level && level%levelStep===0){
                return true;
            }
            return false;
        },

        getNewBio(level, old){
            let news = '';
            let oldArr = [];
            if(old.indexOf('===== LEVEL UP =====') === -1){
                news = `${old}\n===== LEVEL UP =====\n${this.getDate()} LV${level}\n===== UPDATE =====`
            } else {
                let oldStr = /\=\=\=\=\= LEVEL UP \=\=\=\=\=\n([a-zA-Z0-9 \-\r\n:]+)\n(?=\=\=\=\=\= UPDATE \=\=\=\=\=)/ig.exec(old)[1];
                oldArr = oldStr.split(/\n/);
                let newLine = `${this.getDate()} LV${level}`;
                if(oldArr.indexOf(newLine) === -1){
                    oldArr.push(newLine)
                }
                news = old.replace(/(\=\=\=\=\= LEVEL UP \=\=\=\=\=\n)([a-zA-Z0-9 \-\r\n:]+)(\n\=\=\=\=\= UPDATE \=\=\=\=\=)/ig, `$1${oldArr.join('\n')}$3`);
            }
            return news;
        },

        getDate(){
            let now = new Date();
            let y = now.getFullYear();
            let m = ('0'+ (now.getMonth()+1)).slice(-2);
            let d = ('0'+ now.getDate()).slice(-2)
            return `${y}-${m}-${d}`;
        },

        // 更新Bio
        async updatePlayerBio(level){
            let playerId = this.getValue(this.storageKey.playerId);
            let csrfToken = this.getValue(this.storageKey.token);
            if(!playerId || !csrfToken) return false;
            let url = `https://web.simple-mmo.com/user/character/${playerId}/bio/submit`;
            let old = await this.getPlayerBio()
            let newBio = await this.getNewBio(level, old);
            this.http({
                url: url,
                methods: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `_token=${csrfToken}&content=${newBio}`
            })
        },

        // 获取Bio
        async getPlayerBio(){
            let playerId = this.getValue(this.storageKey.playerId);
            if(!playerId) return false;
            let url = `https://web.simple-mmo.com/user/view/${playerId}/bio?new_page_refresh=true`;
            let response = await this.http({
                url: url,
            })
            let domParser = new DOMParser();
            let dom = domParser.parseFromString(response, 'text/html');
            let csrfToken = document.querySelector('meta[name=csrf-token]').content;
            this.setValue(this.storageKey.token, csrfToken);
            return dom.querySelector('textarea#content').innerHTML;
        }
    }

    if(!window.SMMOHelper) window.SMMOHelper = SMMOHelper;

    window.SMMOHelper.init();
})(window)