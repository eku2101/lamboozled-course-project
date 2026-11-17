/* M02 — one news card and four public context cards. */
(() => {
  const {$,esc,game:g,on,emit}=LB;
  LB.card=LamboozledCards.stories[0];
  LB.modules.news=()=>{render();on('game:changed',render);};
  function render(){
    LB.card=g.story||LamboozledCards.stories[0];const card=LB.card;
    $('#news-module').innerHTML=`<article class="panel news-panel" data-module="02"><span class="module-label">M02 · NEWS & CONTEXT</span><div class="news-card"><div class="news-meta"><span class="stamp">NEWS</span><small>MADE-UP STORY</small></div><div class="compact-story"><div><h2 id="news-title" class="news-title">${esc(card.title)}</h2><p class="news-byline">${esc(card.byline)}</p></div><img class="small-story-art" src="assets/${card.art}" alt="${esc(card.alt)}"></div><div class="readable news-body">${card.sentences.map((s,i)=>`<p data-sentence="${i}">${esc(s)}</p>`).join('')}</div><div class="button-row"><button class="button small" id="read-news">▶ Listen</button><button class="button small" id="stop-read" disabled>Stop</button></div><p id="speech-status" class="status-text" role="status">Follow the words as they light up.</p></div></article><section class="context-area" aria-labelledby="context-heading"><div class="section-top"><h2 id="context-heading">4 clues on the table</h2><span class="chip">CONTEXT</span></div><div class="context-cards">${(g.contexts||[]).map(c=>`<article class="context-card"><div><span class="context-icon" aria-hidden="true">${c.icon}</span><h3>${esc(c.title)}</h3></div><p class="readable" id="ctx-${c.id}">${esc(c.text)}</p><button class="text-button" data-listen-context="${c.id}">Listen<span class="sr-only"> to ${esc(c.title)}</span></button></article>`).join('')}</div></section>`;
    $('#read-news').onclick=()=>emit('reading:toggle');$('#stop-read').onclick=()=>emit('reading:stop');
    document.querySelectorAll('[data-listen-context]').forEach(b=>b.onclick=()=>{const c=g.contexts.find(c=>c.id===b.dataset.listenContext);emit('reading:evidence',{text:c.text,node:$('#ctx-'+c.id)});});
  }
})();
