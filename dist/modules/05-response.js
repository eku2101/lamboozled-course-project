/* M05 — optional explanations, opt-in dictation, deliberate draw/drop. */
(() => {
  const {$,esc,game:g,on,emit}=LB;let recognition=null,listening=false;
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  LB.modules.response=()=>{render();on('game:changed',render);on('draft:changed',summary);on('voice:stop',stopVoice);on('view:changed',stopVoice);};
  function render(){
    stopVoice();if(!g.privatePhase){$('#response-module').innerHTML='';return;}
    $('#response-module').innerHTML=`<section class="panel panel-pad turn-actions" data-module="05"><span class="module-label">M05 · RESPONSE & DROP</span><div class="case-summary" id="case-summary" aria-live="polite"></div><details class="explain-box"><summary>Say why · type or speak</summary><label class="form-label" for="reasoning">My clues help because…</label><textarea id="reasoning" maxlength="1000" placeholder="You can also explain out loud to your friends.">${esc(g.player.draft.reasoning)}</textarea><button class="button small" type="button" id="dictate" ${Recognition?'':'disabled'}>◉ Speak my explanation</button><div id="voice-consent" class="voice-consent" hidden><p>Your browser may send your voice to a speech service. Avoid private details. We do not save audio.</p><div class="button-row"><button class="button small" type="button" id="voice-start">Use my microphone</button><button class="button small" type="button" id="voice-cancel">Keep typing</button></div></div><p id="voice-status" class="status-text" role="status">${Recognition?'Your microphone is off.':'Voice input is unavailable here. Typing works.'}</p></details><div class="turn-buttons">${g.phase==='turn'?`<button class="button" id="draw-card" ${g.deck.length?'':'disabled'}>＋ Draw a card <small>ends your turn</small></button><span class="or-label">OR</span>`:''}<button class="button primary" id="drop-case">${g.phase==='drop'?'Drop my case':'Drop my evidence'} ↓</button></div><p class="small-print">${g.phase==='drop'?'Everyone is dropping. No more draws or actions.':g.actionUsed?'Action used ✓ · Now draw or drop.':'Optional: play one action from your hand first.'}</p>${!g.deck.length?'<p class="small-print">The draw deck is empty. Time to drop!</p>':''}</section>`;
    $('#reasoning').oninput=e=>g.draft({reasoning:e.target.value});
    $('#dictate').onclick=()=>{if(listening)stopVoice();else{$('#voice-consent').hidden=false;$('#voice-start').focus();}};
    $('#voice-cancel').onclick=()=>{$('#voice-consent').hidden=true;$('#dictate').focus();};$('#voice-start').onclick=startVoice;
    if($('#draw-card'))$('#draw-card').onclick=()=>LB.run(()=>g.draw(),'Card drawn. Pass the device.');
    $('#drop-case').onclick=()=>{
      if(!g.player.draft.side){LB.announce('Choose Real or Fake above first.');$('[name=case-side]')?.focus();return;}
      const d=g.player.draft;LB.ask({title:d.ids.length?'Ready to drop?':'Drop with no evidence?',text:(d.ids.length?d.ids.length+' card'+(d.ids.length===1?'':'s')+' for your '+d.side.toUpperCase()+' case. ':'Your case will score zero. ')+(g.phase==='turn'?'Everyone else must drop too.':'Your case stays hidden until everyone is ready.'),confirm:'Yes, drop my case',action:()=>LB.run(()=>g.submit(),g.cases.length+1===g.players.length?'All cases are in! Compare them together.':'Case dropped. Pass the device.')});
    };summary();
  }
  function summary(){if(!g.privatePhase||!$('#case-summary'))return;const d=g.player.draft,cards=g.player.hand.filter(c=>d.ids.includes(c.id));const points=cards.filter(c=>g.applies(c)).reduce((n,c)=>n+c.points,0);$('#case-summary').innerHTML=`<strong>${d.ids.length} clues picked <span>· ${points} matching points</span></strong><span>${d.side?'Case: '+d.side.toUpperCase():'Pick REAL or FAKE above'}</span>`;}
  function startVoice(){
    if(!Recognition||!g.privatePhase)return;emit('reading:stop');$('#voice-consent').hidden=true;
    const current=new Recognition(),playerId=g.active;recognition=current;current.lang='en-US';current.continuous=true;current.interimResults=false;
    current.onstart=()=>{if(recognition!==current)return;listening=true;$('#dictate').textContent='■ Stop listening';$('#voice-status').textContent='Listening. Stop, then check your words.';};
    current.onresult=e=>{if(recognition!==current||!g.privatePhase||g.active!==playerId)return;const parts=[];for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)parts.push(e.results[i][0].transcript);const input=$('#reasoning');input.value=(input.value+' '+parts.join(' ')).trim().slice(0,1000);g.draft({reasoning:input.value});};
    current.onerror=()=>{if(recognition===current&&$('#voice-status'))$('#voice-status').textContent='Couldn’t hear you. You can type or try again.';};
    current.onend=()=>{if(recognition!==current)return;recognition=null;listening=false;if($('#dictate'))$('#dictate').textContent='◉ Speak my explanation';if($('#voice-status')?.textContent.startsWith('Listening'))$('#voice-status').textContent='Stopped. Check your words before dropping.';};
    try{current.start();}catch{recognition=null;$('#voice-status').textContent='Microphone unavailable. You can type instead.';}
  }
  function stopVoice(){if(recognition){const current=recognition;recognition=null;current.abort();}listening=false;if($('#dictate'))$('#dictate').textContent='◉ Speak my explanation';if($('#voice-status')?.textContent.startsWith('Listening'))$('#voice-status').textContent='Stopped. Check your words.';}
})();
