// ==UserScript==
// @name         SMMO游戏助手
// @namespace    npm/vite-plugin-monkey
// @version      1.0.0
// @author       monkey
// @description  https://web.simple-mmo.com/，游戏助手
// @icon         https://web.simple-mmo.com/apple-touch-icon.png
// @match        https://web.simple-mmo.com/*
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const SMMOHelper = {
    storageKey: {
      player: "player",
      playerId: "playerId",
      levelStep: "levelStep",
      token: "csrfToken"
    },
    getValue(key) {
      try {
        return _GM_getValue(key, "");
      } catch (error) {
        return localStorage.getItem(key) || "";
      }
    },
    setValue(key, val) {
      try {
        return _GM_setValue(key, val);
      } catch (error) {
        localStorage.setItem(key, val);
      }
    },
    init() {
      this.fakeFetch();
      this.searchPlayerId();
      this.resetDonateButton();
      this.resetJobsButton();
      this.addHeadTravelBtn();
      this.showFooter();
      this.onUserClickBtn();
    },
    searchPlayerId() {
      setTimeout(() => {
        let a = document.querySelector('a[href^="/user/view/"]');
        let id = a.href.match(/\d+/)[0];
        if (id)
          this.setValue(this.storageKey.playerId, id);
      }, 0);
    },
    // 顶部导航增加旅行按钮
    addHeadTravelBtn() {
      if (location.href.indexOf("/travel") > -1 && location.href.indexOf("/travel/party") === -1)
        return false;
      if (document.querySelector("#btnToTravel"))
        return false;
      let $box = document.querySelector(".ml-4.flex.items-center.relative");
      let $a = document.createElement("a");
      $a.id = "btnToTravel";
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
    showFooter() {
      let $div = document.createElement("div");
      $div.style.position = "fixed";
      $div.style.left = "10px";
      $div.style.bottom = "10px";
      $div.style.fontSize = "14px";
      $div.style.color = "#999";
      $div.innerHTML = `${_GM_info["script"]["name"]} v${_GM_info["script"]["version"]}`;
      document.body.appendChild($div);
    },
    // 验证辅助
    validateHelp() {
    },
    // 监听事件动作，更新Bio
    onUserClickBtn() {
      if (location.href.indexOf("/travel") > -1) {
        let btns = document.querySelectorAll("button");
        btns.forEach((e, i) => {
          if (e.id.indexOf("step_btn_") > -1) {
            e.addEventListener("click", () => {
              this.getPlayerBio();
              console.log("旅行");
            });
          }
        });
      } else if (location.href.indexOf("/npcs/attack/") > -1) {
        let btns = document.querySelectorAll("button");
        btns.forEach((e, i) => {
          if (e.innerText === "Attack") {
            e.addEventListener("click", () => {
              console.log("攻击");
            });
          }
        });
      } else if (location.href.indexOf("/crafting/material/") > -1) {
        let btns = document.querySelectorAll("button");
        btns.forEach((e, i) => {
          if (e.id === "crafting_button") {
            e.addEventListener("click", () => {
              console.log("采集");
            });
          }
        });
      } else if (location.href.indexOf("/quests/view/") > -1) {
        let btns = document.querySelectorAll("button");
        btns.forEach((e, i) => {
          if (e.id === "questButton") {
            e.addEventListener("click", () => {
              console.log("任务");
            });
          }
        });
      } else if (location.href.indexOf("/crafting/menu") > -1) {
        let btns = document.querySelectorAll("button");
        btns.forEach((e, i) => {
          if (e.innerText === "Claim Items") {
            e.addEventListener("click", () => {
              console.log("制作");
            });
          }
        });
      }
    },
    // 重置Donate
    resetDonateButton() {
      document.querySelectorAll("button[type=button]").forEach((e) => {
        if (e.innerText === "Gold") {
          e.addEventListener("click", function() {
            setTimeout(() => {
              document.querySelector(".swal2-input").value = 2e3;
            }, 0);
          });
        }
      });
    },
    // 重置Jobs
    resetJobsButton() {
      document.querySelectorAll("button[type=button]").forEach((e) => {
        if (e.innerText === "Start working") {
          e.addEventListener("click", function() {
            setTimeout(() => {
              document.querySelector("input[type=range]").value = 10;
              document.querySelector("output").innerHTML = 10;
            }, 0);
          });
        }
      });
    },
    // 拦截请求
    fakeFetch() {
      const originFetch = window.fetch;
      window.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
          if (url === "https://api.simple-mmo.com/api/action/travel/4") {
            let resRaw = response.clone();
            let resF = await resRaw.json();
            this.checkPlayerLevel(resF.level) && this.updatePlayerBio(resF.level);
            setValue(this.storageKey.player, resF);
            return response;
          } else {
            return response;
          }
        });
      };
    },
    http(options) {
      return new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          method: options.methods || "GET",
          url: options.url,
          responseType: options.responseType || null,
          headers: options.headers || null,
          data: options.data || "",
          onload: function(xhr) {
            if (xhr.status == 200) {
              resolve(xhr.response);
            } else {
              reject(xhr.response);
            }
          },
          onerror: function(xhr) {
            reject(xhr.response);
          }
        });
      });
    },
    // 检测等级变化
    checkPlayerLevel(level) {
      let playerData = getValue(this.storageKey.player, {});
      if (!playerData.level)
        return false;
      let levelStep = getValue("levelStep", 100);
      if (playerData.level != level && level % levelStep === 0) {
        return true;
      }
      return false;
    },
    getNewBio(level, old) {
      let news = "";
      let oldArr = [];
      if (old.indexOf("===== LEVEL UP =====") === -1) {
        news = `${old}
===== LEVEL UP =====
${this.getDate()} LV${level}
===== UPDATE =====`;
      } else {
        let oldStr = /\=\=\=\=\= LEVEL UP \=\=\=\=\=\n([a-zA-Z0-9 \-\r\n:]+)\n(?=\=\=\=\=\= UPDATE \=\=\=\=\=)/ig.exec(old)[1];
        oldArr = oldStr.split(/\n/);
        let newLine = `${this.getDate()} LV${level}`;
        if (oldArr.indexOf(newLine) === -1) {
          oldArr.push(newLine);
        }
        news = old.replace(/(\=\=\=\=\= LEVEL UP \=\=\=\=\=\n)([a-zA-Z0-9 \-\r\n:]+)(\n\=\=\=\=\= UPDATE \=\=\=\=\=)/ig, `$1${oldArr.join("\n")}$3`);
      }
      return news;
    },
    getDate() {
      let now = /* @__PURE__ */ new Date();
      let y = now.getFullYear();
      let m = ("0" + (now.getMonth() + 1)).slice(-2);
      let d = ("0" + now.getDate()).slice(-2);
      return `${y}-${m}-${d}`;
    },
    // 更新Bio
    async updatePlayerBio(level) {
      let playerId = this.getValue(this.storageKey.playerId);
      let csrfToken = this.getValue(this.storageKey.token);
      if (!playerId || !csrfToken)
        return false;
      let url = `https://web.simple-mmo.com/user/character/${playerId}/bio/submit`;
      let old = await this.getPlayerBio();
      let newBio = await this.getNewBio(level, old);
      this.http({
        url,
        methods: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: `_token=${csrfToken}&content=${newBio}`
      });
    },
    // 获取Bio
    async getPlayerBio() {
      let playerId = this.getValue(this.storageKey.playerId);
      if (!playerId)
        return false;
      let url = `https://web.simple-mmo.com/user/view/${playerId}/bio?new_page_refresh=true`;
      let response = await this.http({
        url
      });
      let domParser = new DOMParser();
      let dom = domParser.parseFromString(response, "text/html");
      let csrfToken = document.querySelector("meta[name=csrf-token]").content;
      this.setValue(this.storageKey.token, csrfToken);
      return dom.querySelector("textarea#content").innerHTML;
    }
  };
  window.addEventListener("load", function() {
    SMMOHelper.init();
  });

})();
