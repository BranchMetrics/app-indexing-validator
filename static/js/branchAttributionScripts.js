// Cookie helper functions
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length >= 2) return parts.pop().split(";").shift();
}
function setCookie(name, value, expires_days) {
  var d = new Date();
  d = new Date(d.getTime() + 1000*60*60*24 * expires_days);
  document.cookie = name + '=' + value + '; expires=' + d.toGMTString() + '; path=/; domain=.branch.io';
}

var returning_visitor = getCookie('bnc_returning_visitor'); // Cookie will have a value of '1' if user has been seen before, or won't exist if not
var page_url = window.location.host + window.location.pathname; // Page URL for first time visitor attribution

setCookie('bnc_returning_visitor', "1", 30); // Extend first time visitor attribution window to 30 days from current visit