/* Shared integration contract. Module owners should coordinate changes here. */
window.LB = (() => {
  const bus = new EventTarget();
  const state = {player:'You',selected:[],stance:'',reasoning:'',submitted:null,guideEnabled:false,guideUses:[],reflection:'',nextCheck:'',wireframe:false};
  const $ = (selector, root=document) => root.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function emit(name, detail={}) { bus.dispatchEvent(new CustomEvent(name,{detail})); }
  function on(name, handler) { bus.addEventListener(name, e => handler(e.detail)); }
  function announce(message) { $('#announcer').textContent=message; }
  function save(key,value) { try {localStorage.setItem('lb-demo-'+key,JSON.stringify(value));return true;}catch{return false;} }
  function load(key,fallback) {try {return JSON.parse(localStorage.getItem('lb-demo-'+key)) ?? fallback;}catch{return fallback;} }
  function download(name,contents,type='text/plain') {const url=URL.createObjectURL(new Blob([contents],{type})); const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function navigate(view) {if(location.hash==='#'+view) emit('navigate',{view});else location.hash=view;}
  return {$,esc,state,emit,on,announce,save,load,download,navigate,modules:{}};
})();
LB.game = new LamboozledGame(LamboozledCards);
LB.refresh = message => {
  LB.emit('reading:stop'); LB.emit('voice:stop'); LB.emit('game:changed');
  const phase=LB.game.phase;
  LB.navigate(['review','result','finished'].includes(phase)?'reflection':phase==='lobby'?'lobby':'play');
  if(message){LB.announce(message);const toast=LB.$('#game-message');if(toast)toast.textContent=message;}
};
LB.run = (fn,message='') => {try{fn();LB.refresh(message);}catch(e){LB.announce(e.message);const box=LB.$('#game-error');box.textContent=e.message;box.hidden=false;box.focus();}};
LB.ask = ({title,text,confirm='Continue',action}) => {
  LB.emit('voice:stop');LB.emit('reading:stop');
  const dialog=LB.$('#confirm-dialog');LB.$('#confirm-title').textContent=title;LB.$('#confirm-text').textContent=text;
  LB.$('#confirm-go').textContent=confirm;LB.$('#confirm-go').onclick=()=>{dialog.close();action();};dialog.showModal();
};
