/* M01 + M07: deterministic, UI-independent game rules. All mutations validate phase. */
(function(root){
  class Game {
    constructor(data,rng=Math.random){this.data=data;this.rng=rng;this.phase='lobby';this.players=[];this.round=0;this.history=[];this.serial=0;}
    shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(this.rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
    require(ok,message){if(!ok)throw new Error(message);}
    get player(){return this.players[this.active];}
    get privatePhase(){return this.phase==='turn'||this.phase==='drop';}
    start(names,target=3){
      this.require(names.length>=2&&names.length<=6,'Choose 2–6 players.');
      this.require([3,5].includes(target),'Choose a 3- or 5-point match.');
      this.require(names.every(n=>typeof n==='string'&&n.trim().length&&n.trim().length<=20),'Use short nicknames.');
      this.players=names.map((name,i)=>({id:i,name:name.trim(),score:0,hand:[],draft:{side:'',ids:[],reasoning:''},guideUses:[],guideEnabled:false}));
      this.target=target;this.round=0;this.history=[];this.newsQueue=[];this.nextRound();
    }
    nextRound(){
      this.require(this.round===0||this.phase==='result','Finish this round first.');
      this.round++;if(!this.newsQueue.length)this.newsQueue=this.shuffle(this.data.stories);
      this.story=this.newsQueue.pop();
      this.contexts=this.shuffle(this.data.contexts).slice(0,4).map(c=>({...c,text:this.story.context[c.id]}));
      const cards=[];for(let copy=0;copy<5;copy++){
        this.data.evidence.forEach(e=>cards.push({...e,type:'evidence',id:'c'+(++this.serial)}));
        this.data.actions.forEach(a=>cards.push({...a,id:'c'+(++this.serial)}));
      }
      this.deck=this.shuffle(cards);this.discard=[];this.cases=[];this.dropOrder=[];this.roundWinners=[];this.awarded=false;
      this.players.forEach(p=>{p.hand=[];p.draft={side:'',ids:[],reasoning:''};p.guideUses=[];});
      for(let n=0;n<5;n++)this.players.forEach(p=>p.hand.push(this.deck.pop()));
      this.active=(this.round-1)%this.players.length;this.actionUsed=false;this.cover('turn');
    }
    cover(next=this.phase){this.resumePhase=next;this.phase='handoff';}
    reveal(){this.require(this.phase==='handoff','No hand is waiting.');this.phase=this.resumePhase;}
    hide(){if(this.privatePhase)this.cover(this.phase);}
    draft(patch){
      this.require(this.privatePhase,'Reveal your hand first.');
      const p=this.player;const d={...p.draft,...patch};
      this.require(['','real','fake'].includes(d.side),'Choose Real or Fake.');
      this.require(Array.isArray(d.ids)&&new Set(d.ids).size===d.ids.length,'Choose each card once.');
      this.require(d.ids.every(id=>p.hand.some(c=>c.id===id&&c.type==='evidence'&&(!d.side||c.side===d.side))),'Use evidence from your hand for one side.');
      this.require(typeof d.reasoning==='string'&&d.reasoning.length<=1000,'Keep your explanation under 1,000 characters.');
      p.draft=d;
    }
    applies(card){return card.type==='evidence'&&(card.points===1?this.story.facts.includes(card.fact):this.contexts.some(c=>c.id===card.context&&c.facts.includes(card.fact)));}
    draw(){
      this.require(this.phase==='turn','You can only draw on your turn.');this.require(this.deck.length>0,'The deck is empty. Drop your case.');
      const c=this.deck.pop();this.player.hand.push(c);this.active=(this.active+1)%this.players.length;this.actionUsed=false;this.cover('turn');return c;
    }
    action(id,targetId){
      this.require(this.phase==='turn'&&!this.actionUsed,'You may play one action before drawing or dropping.');
      const p=this.player,card=p.hand.find(c=>c.id===id&&c.type==='action');this.require(card,'Choose an action from your hand.');
      const target=this.players.find(x=>x.id===targetId);
      if(card.effect==='scout')this.require(this.deck.length>0,'No cards are left to draw.');
      else {this.require(target&&target.id!==p.id,'Choose another player.');if(card.effect==='take')this.require(target.hand.length>0,'That player has no cards.');}
      p.hand=p.hand.filter(c=>c.id!==id);this.discard.push(card);
      if(card.effect==='scout'){for(let n=0;n<2&&this.deck.length;n++)p.hand.push(this.deck.pop());}
      if(card.effect==='take'){const i=Math.floor(this.rng()*target.hand.length);p.hand.push(target.hand.splice(i,1)[0]);}
      if(card.effect==='swap'){[p.hand,target.hand]=[target.hand,p.hand];}
      this.players.forEach(x=>{x.draft.ids=x.draft.ids.filter(id=>x.hand.some(c=>c.id===id));});
      this.actionUsed=true;return card;
    }
    submit(){
      this.require(this.privatePhase,'Reveal your hand first.');const p=this.player,d=p.draft;
      this.require(['real','fake'].includes(d.side),'Choose Real or Fake for your case.');
      this.draft({}); // Revalidate ownership after actions.
      this.require(!this.cases.some(c=>c.playerId===p.id),'This player already dropped.');
      if(this.phase==='turn')this.dropOrder=Array.from({length:this.players.length},(_,i)=>(this.active+i)%this.players.length);
      const cards=d.ids.map(id=>({...p.hand.find(c=>c.id===id)}));
      this.cases.push({playerId:p.id,side:d.side,reasoning:d.reasoning,cards,counted:cards.map(c=>this.applies(c)),guideUses:p.guideUses.map(x=>({...x}))});
      const next=this.dropOrder.find(id=>!this.cases.some(c=>c.playerId===id));
      if(next===undefined)this.phase='review';else{this.active=next;this.cover('drop');}
    }
    count(playerId,cardIndex,yes){this.require(this.phase==='review','Review happens after everyone drops.');const c=this.cases.find(c=>c.playerId===playerId);this.require(c&&Number.isInteger(cardIndex)&&cardIndex>=0&&cardIndex<c.cards.length,'Choose a submitted card.');c.counted[cardIndex]=Boolean(yes);}
    total(c){return c.cards.reduce((sum,card,i)=>sum+(c.counted[i]?card.points:0),0);}
    award(){
      this.require(this.phase==='review'&&!this.awarded,'This round has already been scored or is not ready.');
      this.require(this.cases.length===this.players.length,'Everyone must drop before scoring.');
      const best=Math.max(...this.cases.map(c=>this.total(c)));
      this.roundWinners=this.cases.filter(c=>this.total(c)===best).map(c=>c.playerId);
      this.roundWinners.forEach(id=>this.players[id].score++);this.awarded=true;
      this.history.push({round:this.round,story:this.story.title,winners:[...this.roundWinners],cases:this.cases.map(c=>({...c,total:this.total(c)}))});
      this.matchWinners=this.players.filter(p=>p.score>=this.target).map(p=>p.id);
      this.phase=this.matchWinners.length?'finished':'result';
    }
  }
  if(typeof module==='object'&&module.exports)module.exports=Game;else root.LamboozledGame=Game;
})(typeof globalThis==='object'?globalThis:this);
