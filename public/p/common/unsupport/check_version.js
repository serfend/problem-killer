console.log('browser check');
var toCheck = [
  { t: "edge/", v: 79, alias: "edge浏览器" },
  { t: "chrome/", v: 79, alias: "谷歌浏览器" },
  { t: "firefox", v: 79, alias: "火狐浏览器" },
  { t: "rv:", v: 9999, alias: "IE浏览器" },
  { t: "trident/", v: 9999, alias: "IE浏览器" }
];
function checkVersion() {
  var userAgent = navigator.userAgent.toLowerCase();
  for (var i = 0; i < toCheck.length; i++) {
    var t = toCheck[i].t;
    var v = toCheck[i].v;
    var brand = userAgent.indexOf(toCheck[i].t);
    if (brand < 0) continue;
    var s = userAgent.substring(
      brand + t.length,
      userAgent.indexOf(".", brand)
    );
    toCheck[i].current = parseInt(s, 10);
    return toCheck[i];
  }
  return { t: null };
}

function check_if_need_redirect() {
  var v = checkVersion();
  if (!v || !v.current || v.current < v.v) {
    var ignore_time = localStorage.getItem("browser.version.ignore", 0);
    if (new Date().getTime() > ignore_time) {
      window.location.href =
        "/p/common/unsupport/upgrade-your-browser.html";
    } else {
      alert(
        "注意！当前正在使用较旧的浏览器访问。可能影响账号安全和访问质量。"
      );
    }
  }
}
function ignore_browser() {
  localStorage.setItem(
    "browser.version.ignore",
    new Date().getTime() + 86400000
  );
  window.location.href = "/";
}
function check_unsupport_tip() {
  var v = checkVersion();
  document.getElementById("version-current").innerText = v.current + " 版本的 " + v.alias;

  document.getElementById("version-require").innerText =
    !v || v.v > 1000 ? "已不支持此浏览器的任何版本" : "最低要求" + v.v + "版本";
  if (!v || !v.current || v.current < v.v) {
    document.getElementById("version-result").innerText =
      "这意味着在升级浏览器前，你将无法访问此网站。";
    document.getElementById("version-title").innerText = "是时候升级你的浏览器了";
    document.getElementById("version-title-description").innerText = "";
  } else {
    document.getElementById("version-result").innerText = "如有疑问，请联系管理员。";
    document.getElementById("version-title").innerText = "您可以正常使用";
    document.getElementById("version-title-description").innerText = "以下内容是给老版本浏览器看的，不是给您的";
  }
}
