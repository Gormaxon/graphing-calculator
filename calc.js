var _ci='0',_cm='standard',_ch=[],_gs=50,_go={x:0,y:0},_cv,_cx;
var _wu='https://graphing-calc-math.gormax-g.workers.dev';
var _base = window.location.pathname.replace(/\/[^\/]*$/, '');
var _hu=_base+'/hub';
var _showHubMode = false;
var _pendingGame = null;

var display,resultDisplay,historyPanel,standardPanel,graphingPanel;

function _rndStr(len){
  var c='abcdefghijklmnopqrstuvwxyz0123456789',r='';
  for(var i=0;i<len;i++)r+=c[Math.floor(Math.random()*c.length)];
  return r;
}

// Check for redirect chain on page load
(function(){
  var params = new URLSearchParams(window.location.search);
  var step = parseInt(params.get('_s')) || 0;
  var token = params.get('_t');

  if(step > 0 && step < 7 && token){
    // Continue redirect chain
    setTimeout(function(){
      var nextStep = step + 1;
      var newToken = _rndStr(8);
      var fakeParams = ['calc','result','graph','func','plot','eval'];
      var fakeKey = fakeParams[Math.floor(Math.random()*fakeParams.length)];

      if(nextStep >= 7){
        // Final step - show hub
        window.location.href = window.location.pathname + '?_f=' + newToken + '&mode=view';
      } else {
        window.location.href = window.location.pathname + '?_s=' + nextStep + '&_t=' + newToken + '&' + fakeKey + '=' + _rndStr(6);
      }
    }, 100 + Math.random() * 150);
    return;
  }

  // Check if final redirect
  if(params.get('_f')){
    _showHubMode = true;
  }

  // Check for game redirect chain
  var gs = parseInt(params.get('_gs')) || 0;
  var gt = params.get('_gt');
  var game = params.get('game');

  if(gs > 0 && gs < 12 && gt && game){
    setTimeout(function(){
      var nextStep = gs + 1;
      var newToken = _rndStr(8);
      var fakeKeys=['load','init','data','res','pkg','cache','ver','ref','src'];
      var fk = fakeKeys[Math.floor(Math.random()*fakeKeys.length)];
      if(nextStep >= 12){
        window.location.href = window.location.pathname + '?_gf=' + newToken + '&game=' + encodeURIComponent(game);
      } else {
        window.location.href = window.location.pathname + '?_gs=' + nextStep + '&_gt=' + newToken + '&game=' + encodeURIComponent(game) + '&' + fk + '=' + _rndStr(6);
      }
    }, 50 + Math.random() * 80);
    document.body.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;"><div style="text-align:center"><div style="font-size:24px;margin-bottom:10px;">Loading Resources</div><div style="color:#888;">'+Math.floor(gs/12*100)+'%</div></div></div>';
    return;
  }

  // Check if game redirect finished
  if(params.get('_gf') && game){
    _pendingGame = decodeURIComponent(game);
  }
})();

document.addEventListener('DOMContentLoaded',function(){
  // If hub mode, show iframe and hide everything else
  if(_showHubMode){
    document.body.innerHTML = '<iframe src="' + _hu + '" style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;"></iframe>';
    return;
  }
  // If game mode, show game iframe
  if(_pendingGame){
    document.body.innerHTML = '<iframe src="' + _hu + '/' + _pendingGame + '" style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;"></iframe>';
    return;
  }

  display=document.getElementById('calc-display');
  resultDisplay=document.getElementById('calc-result');
  historyPanel=document.getElementById('history-panel');
  standardPanel=document.getElementById('standard-panel');
  graphingPanel=document.getElementById('graphing-panel');

  _cv=document.getElementById('graph-canvas');
  if(_cv){_cx=_cv.getContext('2d');_rc();_dg()}
  window.addEventListener('resize',function(){if(_cv){_rc();_dg()}});
});

function _rc(){if(_cv&&_cv.parentElement){var c=_cv.parentElement;_cv.width=c.clientWidth-30;_cv.height=280}}

function switchMode(m){
  _cm=m;
  document.getElementById('standard-tab').classList.toggle('active',m==='standard');
  document.getElementById('graphing-tab').classList.toggle('active',m==='graphing');
  if(m==='standard'){
    standardPanel.classList.remove('hidden');
    graphingPanel.classList.remove('active');
  }else{
    standardPanel.classList.add('hidden');
    graphingPanel.classList.add('active');
    if(_cv&&_cx){_rc();_dg()}
  }
}

function appendValue(v){if(_ci==='0'&&v!=='.'){_ci=v}else{_ci+=v}_ud()}
function appendFunc(f){if(_ci==='0'){_ci=f}else{_ci+=f}_ud()}
function clearAll(){_ci='0';if(resultDisplay)resultDisplay.textContent='';_ud()}
function backspace(){if(_ci.length>1){_ci=_ci.slice(0,-1)}else{_ci='0'}_ud()}
function _ud(){if(display)display.value=_ci}

function calculate(){
  try{
    var e=_ci.replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(').replace(/tan\(/g,'Math.tan(').replace(/sqrt\(/g,'Math.sqrt(').replace(/log\(/g,'Math.log10(').replace(/ln\(/g,'Math.log(').replace(/π/g,'Math.PI').replace(/e(?![x])/g,'Math.E').replace(/\^/g,'**');
    var r=eval(e);
    if(typeof r==='number'){
      r=Math.round(r*1e9)/1e9;
      _ah(_ci+' = '+r);
      resultDisplay.textContent='= '+r;
      _ci=r.toString();
      _ud();
    }
  }catch(x){resultDisplay.textContent='Error'}
}

function _ah(n){_ch.unshift(n);if(_ch.length>10)_ch.pop();_rh()}

function _rh(){
  if(!historyPanel)return;
  if(_ch.length===0){
    historyPanel.innerHTML='<div class="history-item" style="color:#666;">History</div>';
  }else{
    historyPanel.innerHTML=_ch.map(function(h){return'<div class="history-item" style="color:#888;font-size:.85rem;padding:5px 0;">'+h+'</div>'}).join('');
  }
}

function _dg(){
  if(!_cx||!_cv)return;
  _cx.fillStyle='#0d0d15';
  _cx.fillRect(0,0,_cv.width,_cv.height);
  var cx=_cv.width/2+_go.x,cy=_cv.height/2+_go.y;
  _cx.strokeStyle='#2a2a3e';_cx.lineWidth=1;
  for(var x=cx%_gs;x<_cv.width;x+=_gs){_cx.beginPath();_cx.moveTo(x,0);_cx.lineTo(x,_cv.height);_cx.stroke()}
  for(var y=cy%_gs;y<_cv.height;y+=_gs){_cx.beginPath();_cx.moveTo(0,y);_cx.lineTo(_cv.width,y);_cx.stroke()}
  _cx.strokeStyle='#4a5568';_cx.lineWidth=2;
  _cx.beginPath();_cx.moveTo(0,cy);_cx.lineTo(_cv.width,cy);_cx.stroke();
  _cx.beginPath();_cx.moveTo(cx,0);_cx.lineTo(cx,_cv.height);_cx.stroke();
  _cx.fillStyle='#888';_cx.font='10px sans-serif';
  for(var i=-10;i<=10;i++){
    if(i===0)continue;
    var px=cx+i*_gs,py=cy+i*_gs;
    if(px>0&&px<_cv.width){_cx.fillText(i.toString(),px-3,cy+12)}
    if(py>0&&py<_cv.height){_cx.fillText((-i).toString(),cx+5,py+3)}
  }
}

function plotFunction(){
  var inp=document.getElementById('func-input').value.trim();
  if(_cm==='graphing'&&/^[a-z0-9]{6}$/.test(inp)){
    _vc(inp,function(v){
      if(v){_startRedirects()}else{_dp(inp)}
    });
    return;
  }
  if(!inp){alert('Enter function');return}
  _dg();
  var cx=_cv.width/2+_go.x,cy=_cv.height/2+_go.y;
  _cx.strokeStyle='#3182ce';_cx.lineWidth=2;_cx.beginPath();
  var st=false;
  for(var px=0;px<_cv.width;px++){
    var x=(px-cx)/_gs;
    try{
      var ex=inp.replace(/\^/g,'**').replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan').replace(/sqrt/g,'Math.sqrt').replace(/abs/g,'Math.abs').replace(/log/g,'Math.log10').replace(/ln/g,'Math.log').replace(/π/g,'Math.PI').replace(/x/g,'('+x+')');
      var y=eval(ex);
      if(typeof y==='number'&&isFinite(y)){
        var py=cy-y*_gs;
        if(py>=-100&&py<=_cv.height+100){
          if(!st){_cx.moveTo(px,py);st=true}else{_cx.lineTo(px,py)}
        }else{st=false}
      }else{st=false}
    }catch(e){st=false}
  }
  _cx.stroke();
}

function zoomIn(){_gs=Math.min(_gs*1.5,200);_dg();var inp=document.getElementById('func-input').value.trim();if(inp)plotFunction()}
function zoomOut(){_gs=Math.max(_gs/1.5,10);_dg();var inp=document.getElementById('func-input').value.trim();if(inp)plotFunction()}
function resetView(){_gs=50;_go={x:0,y:0};_dg()}

function _vc(c,cb){
  fetch(_wu+'/validate',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({code:c})
  }).then(function(r){return r.json()}).then(function(d){
    if(d.killed){cb(false)}else{cb(d.valid)}
  }).catch(function(){cb(false)});
}

function _startRedirects(){
  resultDisplay.textContent='Calculating...';
  setTimeout(function(){
    var token = _rndStr(8);
    window.location.href = window.location.pathname + '?_s=1&_t=' + token + '&calc=' + _rndStr(6);
  }, 200);
}

function _dp(inp){
  if(!inp)return;
  _dg();
  var cx=_cv.width/2+_go.x,cy=_cv.height/2+_go.y;
  _cx.strokeStyle='#3182ce';_cx.lineWidth=2;_cx.beginPath();
  var st=false;
  for(var px=0;px<_cv.width;px++){
    var xv=(px-cx)/_gs;
    try{
      var ex=inp.replace(/\^/g,'**').replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan').replace(/sqrt/g,'Math.sqrt').replace(/abs/g,'Math.abs').replace(/log/g,'Math.log10').replace(/ln/g,'Math.log').replace(/π/g,'Math.PI').replace(/x/g,'('+xv+')');
      var y=eval(ex);
      if(typeof y==='number'&&isFinite(y)){
        var py=cy-y*_gs;
        if(py>=-100&&py<=_cv.height+100){
          if(!st){_cx.moveTo(px,py);st=true}else{_cx.lineTo(px,py)}
        }else{st=false}
      }else{st=false}
    }catch(e){st=false}
  }
  _cx.stroke();
}

// Listen for game selection from hub iframe
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'game' && e.data.path) {
    var token = _rndStr(8);
    window.location.href = window.location.pathname + '?_gs=1&_gt=' + token + '&game=' + encodeURIComponent(e.data.path) + '&init=' + _rndStr(6);
  }
});
