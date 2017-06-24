/* Start Munchkin */
(function() {
  var didInit = false;
  function initMunchkin() {
    if (didInit === false) {
      didInit = true;
      Munchkin.init('315-FTT-121', { domainLevel: 2 });
    }
  }
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = '//munchkin.marketo.net/munchkin.js';
  s.onreadystatechange = function() {
    if (this.readyState == 'complete' || this.readyState == 'loaded') {
      initMunchkin();
    }
  };
  s.onload = initMunchkin;
  document.getElementsByTagName('head')[0].appendChild(s);
})();

/* End Munchkin */

/* Start Google Analytics */

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

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-53307642-1', 'auto');
ga('require', 'linkid');

// Set initial landing page URL for first time visitors
if (!returning_visitor) {
  ga('set', 'dimension1', page_url );
}

ga('send', 'pageview');

/* End Google Analytics */

/* Start LinkedIn Insight */
_linkedin_data_partner_id = "21211";
(function()
{var s = document.getElementsByTagName("script")[0]; var b = document.createElement("script"); b.type = "text/javascript";b.async = true; b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js"; s.parentNode.insertBefore(b, s);}
)();

/* Start Bizible */
var js = document.createElement("script");

js.type = "text/javascript";
js.async = true;
js.src = "//cdn.bizible.com/scripts/bizible.js";

document.getElementsByTagName('head')[0].appendChild(js);

/* End Bizible */

/* Start AdRoll */
adroll_adv_id = "B4WBOZRXZJCUNDX7DXWKFH";
adroll_pix_id = "ZJLTB6RO7VALNIBQURFRAE";
/* OPTIONAL: provide email to improve user identification */
/* adroll_email = "username@example.com"; */
(function () {
  var _onload = function(){
    if (document.readyState && !/loaded|complete/.test(document.readyState)){setTimeout(_onload, 10);return}
    if (!window.__adroll_loaded){__adroll_loaded=true;setTimeout(_onload, 50);return}
    var scr = document.createElement("script");
    var host = (("https:" == document.location.protocol) ? "https://s.adroll.com" : "http://a.adroll.com");
    scr.setAttribute('async', 'true');
    scr.type = "text/javascript";
    scr.src = host + "/j/roundtrip.js";
    ((document.getElementsByTagName('head') || [null])[0] ||
      document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
  };
  if (window.addEventListener) {window.addEventListener('load', _onload, false);}
  else {window.attachEvent('onload', _onload)}
}());

function recordUser(){
  try {
    __adroll.record_user({"adroll_segments": "15884d16"})
  }
  catch(err) { console.log(err); }
}

/* End AdRoll */

/* Start FullStory */
window['_fs_debug'] = false;
window['_fs_host'] = 'fullstory.com';
window['_fs_org'] = '4PCGY';
window['_fs_namespace'] = 'FS';
(function(m,n,e,t,l,o,g,y){
    if (e in m && m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].'); return;}
    g=m[e]=function(a,b){g.q?g.q.push([a,b]):g._api(a,b);};g.q=[];
    o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';
    y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
    g.identify=function(i,v){g(l,{uid:i});if(v)g(l,v)};g.setUserVars=function(v){g(l,v)};
    g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
    g.clearUserCookie=function(c,d,i){if(!c || document.cookie.match('fs_uid=[`;`]*`[`;`]*`[`;`]*`')){
    d=n.domain;while(1){n.cookie='fs_uid=;domain='+d+
    ';path=/;expires='+new Date(0).toUTCString();i=d.indexOf('.');if(i<0)break;d=d.slice(i+1)}}};
})(window,document,window['_fs_namespace'],'script','user');

/* End FullStory */

/* Demandbase */
(function(d,b,a,s,e){ var t = b.createElement(a),
  fs = b.getElementsByTagName(a)[0]; t.async=1; t.id=e; t.src=s;
  fs.parentNode.insertBefore(t, fs); })
(window,document,'script','https://scripts.demandbase.com/ucA8pUay.min.js','demandbase_js_lib');

/* End Demandbase */

/* Start Quora */
!function(q,e,v,n,t,s){if(q.qp) return; n=q.qp=function(){n.qp?n.qp.apply(n,arguments):n.queue.push(arguments);}; n.queue=[];t=document.createElement(e);t.async=!0;t.src=v; s=document.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);}(window, 'script', 'https://a.quora.com/qevents.js');
qp('init', '247e840cafa44cae9ac4b50a0cc1965a');
qp('track', 'ViewContent');
/* End Quora */
