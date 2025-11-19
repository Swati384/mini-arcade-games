(() => {
  const box = document.getElementById('box');
  const lastEl = document.getElementById('last');
  const bestEl = document.getElementById('best');
  const resetBtn = document.getElementById('reset');

  const BEST_KEY = 'reaction-best-ms';
  let startTime = 0;
  let timeoutId = null;
  let state = 'idle'; // idle -> waiting -> go

  function loadBest(){
    const v = localStorage.getItem(BEST_KEY);
    bestEl.textContent = v ? v : '—';
  }

  function setBoxClass(cls, text){
    box.className = 'box ' + cls;
    box.textContent = text;
    state = cls === 'waiting' ? 'waiting' : (cls === 'go' ? 'go' : (cls === 'fault' ? 'fault' : 'idle'));
  }

  function startRound(){
    setBoxClass('waiting','Wait for green...');
    const delay = 800 + Math.floor(Math.random()*2200);
    timeoutId = setTimeout(()=>{
      setBoxClass('go','CLICK!');
      startTime = Date.now();
    }, delay);
  }

  function handleEarly(){
    clearTimeout(timeoutId);
    setBoxClass('fault','Too soon!');
    setTimeout(()=> setBoxClass('waiting','Click to start'), 1100);
  }

  function handleClickWhenGo(){
    const ms = Date.now() - startTime;
    document.getElementById('last').textContent = ms;
    const prev = localStorage.getItem(BEST_KEY);
    if(!prev || ms < Number(prev)){
      localStorage.setItem(BEST_KEY, String(ms));
      bestEl.textContent = String(ms);
    }
    setBoxClass('waiting','Click to start');
  }

  box.addEventListener('click', ()=>{
    if(state === 'idle' || state === 'waiting' && box.textContent === 'Click to start'){
      // start
      if(timeoutId) clearTimeout(timeoutId);
      startRound();
      return;
    }

    if(state === 'waiting' && box.classList.contains('waiting') && box.textContent !== 'Click to start'){
      // clicked too early
      handleEarly();
      return;
    }

    if(state === 'go'){
      handleClickWhenGo();
      return;
    }

    // default
    startRound();
  });

  resetBtn.addEventListener('click', ()=>{
    localStorage.removeItem(BEST_KEY);
    bestEl.textContent = '—';
  });

  // init
  loadBest();
  setBoxClass('waiting','Click to start');

})();
