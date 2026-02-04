(function(){
  var PROXY = 'https://graphing-calc-math.gormax-g.workers.dev/proxy?url=';
  var ALLOWED = ['cdn.jsdelivr.net', 'cdn.tailwindcss.com', 'unpkg.com', 'cdnjs.cloudflare.com'];

  function shouldProxy(url) {
    try {
      var u = new URL(url, location.href);
      for (var i = 0; i < ALLOWED.length; i++) {
        if (u.hostname === ALLOWED[i] || u.hostname.endsWith('.' + ALLOWED[i])) {
          return true;
        }
      }
      return false;
    } catch(e) { return false; }
  }

  function proxyUrl(url) {
    return PROXY + encodeURIComponent(url);
  }

  var _fetch = window.fetch;
  window.fetch = function(input, init) {
    var url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
    if (url && shouldProxy(url)) {
      var newUrl = proxyUrl(url);
      if (typeof input === 'string') {
        input = newUrl;
      } else if (input && input.url) {
        input = new Request(newUrl, input);
      }
    }
    return _fetch.call(this, input, init);
  };

  var _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (url && shouldProxy(url)) {
      url = proxyUrl(url);
    }
    return _open.apply(this, [method, url].concat(Array.prototype.slice.call(arguments, 2)));
  };
})();
