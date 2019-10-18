(function () {
  var agt = navigator.userAgent.toLowerCase();
  if (agt.indexOf('opera') !== -1) window.location.href = '/browser_update.html';
  if (agt.indexOf('staroffice') !== -1) window.location.href = '/browser_update.html';
  if (agt.indexOf('webtv') !== -1) window.location.href = '/browser_update.html';
  if (agt.indexOf('beonex') !== -1) window.location.href = '/browser_update.html';
  if (agt.indexOf('chimera') !== -1) window.location.href = '/browser_update.html';
  if (agt.indexOf('netpositive') !== -1) window.location.href = '/browser_update.html';
  if (agt.indexOf('phoenix') !== -1) window.location.href = '/browser_update.html';
  // if (agt.indexOf("firefox") != -1) return 'Firefox';
  // if (agt.indexOf("safari") != -1) return 'Safari';
  if (agt.indexOf('skipstone') !== -1) window.location.href = '/browser_update.html';
  if (agt.indexOf('netscape') !== -1) window.location.href = '/browser_update.html';
  // if (agt.indexOf('mozilla/5.0') !== -1) window.location.href = '/browser_update.html';
  if (agt.indexOf('msie') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
    var rv = 0;
    var ua = navigator.userAgent;
    var re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
    if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
    if (rv !== 0 && rv <= 9) {
      window.location.href = '/browser_update.html';
    }
  }
})();
