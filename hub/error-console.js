(function(){
  var logs = [];
  var panel = null;

  function createPanel() {
    if (panel) return;
    panel = document.createElement('div');
    panel.id = '_errConsole';
    panel.style.cssText = 'position:fixed;bottom:10px;right:10px;width:350px;max-height:200px;background:rgba(0,0,0,0.9);color:#0f0;font-family:monospace;font-size:11px;padding:10px;border-radius:8px;overflow-y:auto;z-index:99999;display:none;border:1px solid #333;';

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:8px;border-bottom:1px solid #333;padding-bottom:5px;';
    header.innerHTML = '<span style="color:#fff;">Console</span><span id="_errClose" style="cursor:pointer;color:#f55;">X</span>';
    panel.appendChild(header);

    var content = document.createElement('div');
    content.id = '_errContent';
    panel.appendChild(content);

    document.body.appendChild(panel);

    document.getElementById('_errClose').onclick = function() {
      panel.style.display = 'none';
    };
  }

  function addLog(type, args) {
    var msg = Array.prototype.slice.call(args).map(function(a) {
      if (typeof a === 'object') {
        try { return JSON.stringify(a); } catch(e) { return String(a); }
      }
      return String(a);
    }).join(' ');

    logs.push({ type: type, msg: msg, time: new Date().toLocaleTimeString() });
    if (logs.length > 50) logs.shift();

    updatePanel();
  }

  function updatePanel() {
    if (!panel) createPanel();
    var content = document.getElementById('_errContent');
    if (!content) return;

    var colors = { error: '#f55', warn: '#fa0', log: '#0f0', info: '#0af' };
    content.innerHTML = logs.map(function(l) {
      return '<div style="color:' + (colors[l.type] || '#fff') + ';margin:2px 0;word-break:break-all;">[' + l.time + '] ' + l.msg + '</div>';
    }).join('');

    content.scrollTop = content.scrollHeight;

    if (logs.some(function(l) { return l.type === 'error'; })) {
      panel.style.display = 'block';
    }
  }

  // Override console methods
  var _log = console.log, _err = console.error, _warn = console.warn, _info = console.info;

  console.log = function() { addLog('log', arguments); _log.apply(console, arguments); };
  console.error = function() { addLog('error', arguments); _err.apply(console, arguments); };
  console.warn = function() { addLog('warn', arguments); _warn.apply(console, arguments); };
  console.info = function() { addLog('info', arguments); _info.apply(console, arguments); };

  // Catch global errors
  window.addEventListener('error', function(e) {
    addLog('error', [e.message + ' at ' + e.filename + ':' + e.lineno]);
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', function(e) {
    addLog('error', ['Unhandled rejection: ' + e.reason]);
  });

  // Toggle with triple-click
  var clicks = 0;
  document.addEventListener('click', function() {
    clicks++;
    setTimeout(function() { clicks = 0; }, 500);
    if (clicks >= 3 && panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  });
})();
