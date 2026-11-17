/* Shared navigation and privacy. No hidden hand remains in rendered markup. */
(() => {
  const {$,state,game:g,emit,on}=LB;
  for(const name of ['lobby','news','evidence','reading','response','guide','reflection','team'])LB.modules[name]();
  const views={lobby:['WELCOME TO GREEN MEADOWS','Calling all news detectives!'],play:['BUILD YOUR BEST CASE','What’s the story, flock?'],reflection:['EVIDENCE TAKES THE SPOTLIGHT','Let’s see those clues!'],team:['FOUR PEOPLE · EIGHT MODULES','Make it a group project.'],permissions:['COURSE PROJECT','Content & permissions']};
  const tools=$('.tools-column'),mobile=window.matchMedia('(max-width:650px)');let current='lobby';
  function arrange(){if(current==='lobby')$('#lobby-tools').append(tools);else if(current==='reflection')$('#reflection-tools').append(tools);else {const grid=$('.play-grid');if(mobile.matches)grid.prepend(tools);else grid.append(tools);}}
  function lock(){if(g.privatePhase){g.hide();emit('voice:stop');emit('reading:stop');document.querySelectorAll('dialog[open]').forEach(d=>d.close());emit('game:changed');}}
  function show(view,focus=true){
    if(!views[view])view='lobby';
    if(view==='play'&&g.phase==='lobby')view='lobby';
    if(view==='play'&&['review','result','finished'].includes(g.phase))view='reflection';
    if(view==='reflection'&&!['review','result','finished'].includes(g.phase))view=g.phase==='lobby'?'lobby':'play';
    if(view!=='play')lock();current=view;
    document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!=='view-'+view);
    document.querySelectorAll('[data-nav]').forEach(a=>a.dataset.nav===view?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
    $('#view-kicker').textContent=views[view][0];$('#view-title').textContent=views[view][1];document.title='LAMBOOZLED! — '+views[view][1];
    if(view==='team'||view==='permissions')$('#builder-menu').open=true;
    arrange();emit('view:changed',{view});$('#game-error').hidden=true;
    if(focus){$('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
  }
  window.addEventListener('hashchange',()=>show(location.hash.slice(1)));on('navigate',({view})=>show(view));
  $('#wireframe-toggle').onclick=()=>{state.wireframe=!state.wireframe;document.body.classList.toggle('wireframe',state.wireframe);$('#wireframe-toggle').setAttribute('aria-pressed',String(state.wireframe));$('#wireframe-toggle').textContent=state.wireframe?'Game view':'Wireframe view';};
  $('#rules-button').onclick=()=>$('#rules-dialog').showModal();$('#rules-link').onclick=e=>{e.preventDefault();$('#rules-dialog').showModal();};$('#close-rules').onclick=()=>$('#rules-dialog').close();
  $('#confirm-cancel').onclick=()=>$('#confirm-dialog').close();$('#action-cancel').onclick=()=>$('#action-dialog').close();
  $('.skip').onclick=e=>{e.preventDefault();$('#main').focus();};mobile.addEventListener('change',arrange);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)lock();});
  window.addEventListener('beforeunload',e=>{if(!['lobby','finished'].includes(g.phase)){e.preventDefault();e.returnValue='';}});
  show(location.hash.slice(1)||'lobby',false);
})();
