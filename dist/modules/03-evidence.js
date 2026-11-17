/* M03 — private hands, action cards, evidence selection. */
(() => {
  const {$,esc,game:g,on,emit}=LB;
  LB.modules.evidence=()=>{render();on('game:changed',render);on('draft:changed',render);};
  function render(){
    const mount=$('#evidence-module');if(!g.privatePhase){mount.innerHTML='';return;}
    const p=g.player,d=p.draft;
    mount.innerHTML=`<section data-module="03"><span class="module-label">M03 · HAND & ACTIONS</span><div class="section-top"><div><h2>${esc(p.name)}’s hand</h2><p>Choose a side, then tap your evidence.</p></div><span class="chip">${p.hand.length} cards</span></div><fieldset class="case-picker"><legend>My case is…</legend>${['real','fake'].map(side=>`<label class="case-choice ${side}"><input type="radio" name="case-side" value="${side}" ${d.side===side?'checked':''}>${side==='real'?'REAL':'FAKE'}</label>`).join('')}</fieldset><div class="hand-grid">${p.hand.map(c=>{
      const action=c.type==='action',chosen=d.ids.includes(c.id),fits=!action&&g.applies(c),sideOK=!d.side||c.side===d.side;
      return `<article class="hand-card ${action?'action-card':c.side} ${chosen?'picked':''}"><span class="hand-top"><span class="stamp small-stamp">${action?'SAMPLE ACTION':c.side.toUpperCase()}</span><b>${action?c.icon:'+'+c.points}</b></span><span class="hand-icon" aria-hidden="true">${c.icon}</span><h3>${esc(c.title)}</h3><p class="readable" id="card-text-${c.id}">${esc(c.text)}</p>${action?'<span class="card-hint">Once per turn</span>':`<span class="card-hint">${fits?'✓ Matches the table':'○ Clue not shown'}${d.side&&!sideOK?' · Other side':''}</span>`}<div class="card-buttons"><button class="hand-pick" data-pick="${c.id}" ${action?(g.phase!=='turn'||g.actionUsed?'disabled':''):(!d.side||!sideOK?'disabled':'')} ${action?'':`aria-pressed="${chosen}"`}>${action?'Play action':chosen?'✓ In my case':!d.side?'Choose a side first':!sideOK?'Other side':'+ Add to my case'}</button><button class="hand-listen" data-listen-card="${c.id}" aria-label="Listen to ${esc(c.title)}">▶</button></div></article>`;
    }).join('')||'<p class="empty-hand">No cards left. You can still drop a zero-point case.</p>'}</div><div class="deck-row" aria-label="Three decks"><span class="mini-deck">NEWS<br><b>Face down</b></span><span class="mini-deck context-deck">CONTEXT<br><b>4 revealed</b></span><span class="mini-deck evidence-deck">EVIDENCE / ACTION<br><b>${g.deck.length} left to draw</b></span></div><p class="small-print">+1 uses the news · +2 / +3 uses a shown context clue</p></section>`;
    document.querySelectorAll('[name=case-side]').forEach(r=>r.onchange=()=>{g.draft({side:r.value,ids:d.ids.filter(id=>p.hand.find(c=>c.id===id)?.side===r.value)});emit('draft:changed');$(`[name=case-side][value="${r.value}"]`).focus();});
    document.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const c=p.hand.find(c=>c.id===b.dataset.pick);if(c.type==='action'){chooseAction(c);return;}g.draft({ids:d.ids.includes(c.id)?d.ids.filter(id=>id!==c.id):[...d.ids,c.id]});emit('draft:changed');$(`[data-pick="${c.id}"]`)?.focus();LB.announce(g.player.draft.ids.length+' evidence cards selected.');});
    document.querySelectorAll('[data-listen-card]').forEach(b=>b.onclick=()=>{const c=p.hand.find(c=>c.id===b.dataset.listenCard);emit('reading:evidence',{text:c.text,node:$('#card-text-'+c.id)});});
  }
  function chooseAction(card){
    const dialog=$('#action-dialog');$('#action-title').textContent=card.title;$('#action-description').textContent=card.text;
    $('#action-target-row').hidden=card.effect==='scout';$('#action-target').innerHTML=g.players.filter(p=>p.id!==g.active).map(p=>`<option value="${p.id}" ${card.effect==='take'&&!p.hand.length?'disabled':''}>${esc(p.name)} · ${p.hand.length} cards</option>`).join('');
    $('#action-go').onclick=()=>{dialog.close();LB.run(()=>g.action(card.id,Number($('#action-target').value)),card.title+' played. Now draw or drop.');};dialog.showModal();
  }
})();
