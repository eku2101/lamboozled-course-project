/* M06 — optional scripted guide. No model, no score changes, no private-hand advice. */
(() => {
  const {$,esc,game:g,on}=LB;
  const prompts={rules:{label:'My turn?',text:'You may play one action. Then draw a card OR drop your evidence. One drop means everyone drops!'},hint:{label:'A little hint',text:'Pick one side. Does each evidence card fit the news or a context clue on the table?'},reflect:{label:'Think it over',text:'Which clue changed your thinking? Did my hint help? What would you check yourself?'}};
  LB.modules.guide=()=>{render();on('game:changed',render);};
  function render(){
    const p=g.privatePhase?g.player:null;
    $('#guide-module').innerHTML=`<section class="panel guide-panel compact-guide" data-module="06"><span class="module-label">M06 · OPTIONAL GUIDE</span><div class="guide-heading"><img src="assets/pip-sheep.svg" alt=""><div><h2>Ask Pip</h2><small>Scripted hints · not live AI</small></div></div>${p?`<label class="toggle-row">Hints for ${esc(p.name)}<input id="guide-enable" type="checkbox" ${p.guideEnabled?'checked':''}></label><div id="guide-content" ${p.guideEnabled?'':'hidden'}><div class="guide-controls">${Object.entries(prompts).map(([id,q])=>`<button class="button small" data-guide="${id}">${q.label}</button>`).join('')}</div><p id="guide-answer" role="status" hidden></p><small id="guide-count">${p.guideUses.length} hints this round</small></div>`:'<p>Optional help on your turn. You make the case!</p>'}</section>`;
    if(!p)return;$('#guide-enable').onchange=e=>{p.guideEnabled=e.target.checked;$('#guide-content').hidden=!p.guideEnabled;};
    document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>{if(!p.guideEnabled)return;const q=prompts[b.dataset.guide];p.guideUses.push({kind:b.dataset.guide,label:q.label});$('#guide-answer').hidden=false;$('#guide-answer').textContent=q.text;$('#guide-count').textContent=p.guideUses.length+' hints this round';});
  }
})();
