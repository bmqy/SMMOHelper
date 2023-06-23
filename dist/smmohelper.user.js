// ==UserScript==
// @name       SMMO游戏助手
// @namespace  npm/vite-plugin-monkey
// @version    1.0.0
// @author     monkey
// @icon       https://vitejs.dev/logo.svg
// @match      https://web.simple-mmo.com/*
// @grant      GM_info
// ==/UserScript==

(function () {
  'use strict';

  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  (function() {
    const SMMOHelper = {
      init() {
        window.addEventListener("load", () => {
          this.resetDonateButton();
          this.resetJobsButton();
          this.addHeadTravelBtn();
          this.showFooter();
          this.onUserClickBtn();
        });
      },
      // 顶部导航增加旅行按钮
      addHeadTravelBtn() {
        if (location.href.indexOf("/travel") > -1 && location.href.indexOf("/travel/party") === -1)
          return false;
        let $box = document.querySelector(".ml-4.flex.items-center.relative");
        let $a = document.createElement("a");
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
        document.querySelectorAll("button").forEach((e, i) => {
          if (e.innerText === "Gold") {
            e.outerHTML = e.outerHTML.replace("donate(", "SMMOHelper.bmqyDonate(");
          }
        });
      },
      // 重置Jobs
      resetJobsButton() {
        document.querySelectorAll("button").forEach((e, i) => {
          if (e.innerText === "Start working") {
            e.outerHTML = e.outerHTML.replace("performJob(", "SMMOHelper.bmqyPerformJob(");
          }
        });
      },
      // 重写金币捐赠方法
      bmqyDonate() {
        Swal.fire({
          imageUrl: "/img/icons/I_GoldCoin.png",
          title: "Gold Donation",
          html: "Make a donation to the poor orphanage to help the less fortunate.",
          input: "number",
          inputValue: "2000",
          inputAttributes: {
            autocapitalize: "off"
          },
          showCancelButton: true,
          confirmButtonText: "Donate",
          showLoaderOnConfirm: true,
          preConfirm: function(login) {
            return fetch("/orphanage/donate", {
              "method": "POST",
              body: new URLSearchParams("_token=" + token + "&data=" + login)
            }).then((response) => {
              if (!response.ok) {
                throw new Error(response.statusText);
              }
              return response.json();
            }).catch((error) => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              );
            });
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.value) {
            Swal.fire({
              title: result.value.title,
              type: result.value.type,
              html: result.value.result
            });
          }
        });
      },
      // 重写工作方法
      bmqyPerformJob(id, name, gold, exp) {
        var additional_text = "";
        additional_text = additional_text + "<hr/><i>Become a member and get 10 more jobs</i><br/><a href='/diamondstore/membership' class='cta cta-success'>Become a member</a>";
        additional_text = additional_text + '<hr/><h2 class="swal2-title" id="swal2-title" style="font-size:18.75px">How long do you want to work?</h2>';
        Swal.fire({
          title: name,
          html: 'How many times do you want to perform this job? Each job lasts 10 minutes and you can only perform a maximum of 10 jobs.<br/><br/><div class="notice notice-info">You cannot travel, perform quests, or battle while you are performing a job</div><div style="text-align:center"><h2 class="swal2-title" id="swal2-title" style="font-size:18.75px">Rewards</h2></div><img src="/img/icons/I_GoldCoin.png" height="15px"> ' + gold + ' <img src="/img/icons/S_Light01.png"  height="15px"> ' + exp + '<br/> <span style="color:rgba(0,0,0,0.6);font-size:11px;font-weight:500;">Per job</span>' + additional_text,
          input: "range",
          inputAttributes: {
            min: 1,
            max: 10,
            step: 1
          },
          inputValue: 10,
          showCancelButton: true,
          confirmButtonText: "Start the job",
          cancelButtonText: "No! I don't want to work!",
          showLoaderOnConfirm: true,
          preConfirm: (amount) => {
            return fetch(`/api/job/perform/` + id + `/` + amount, {
              "method": "POST",
              headers: {
                "X-CSRF-TOKEN": token
              }
            }).then((response) => {
              if (response.status == 403) {
                throw new Error("Something went wrong.");
              }
            }).catch((error) => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              );
            });
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
                Swal.showLoading();
                setTimeout(function() {
                  window.location.href = "/jobs/view/" + id;
                }, 1500);
              }
            });
          }
        });
      }
    };
    if (!window.SMMOHelper)
      window.SMMOHelper = SMMOHelper;
    window.SMMOHelper.init();
  })();

})();
