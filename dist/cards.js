/* M02/M03 — original sample content. No official deck text or artwork. */
(function(root){
  const contexts=[
    {id:'source',title:'Who posted it?',icon:'🐑',text:'A named local reporter wrote the post.',facts:['named-source']},
    {id:'history',title:'Earlier posts',icon:'↶',text:'This account shared a made-up story last week.',facts:['unreliable-history']},
    {id:'reports',title:'Other reports',icon:'▤',text:'A second local report agrees with the main claim.',facts:['independent-report']},
    {id:'photo',title:'Check the photo',icon:'▣',text:'The photo is from an older event.',facts:['old-photo']},
    {id:'expert',title:'Ask an expert',icon:'★',text:'Someone who works there confirms the main claim.',facts:['expert-support']},
    {id:'missing',title:'What is missing?',icon:'?',text:'The post leaves out an important limit.',facts:['missing-detail']}
  ];
  const stories=[
    {id:'library',title:'Library opens late EVERY night!',byline:'By Rowan Ram · The Meadow Bulletin',sentences:['A post says the library will open until nine every night.','It has a photo, but no link to the opening times.'],facts:['author','no-link','big-claim'],art:'library-sheep.svg',alt:'A sheep reading outside the library',context:{source:'Rowan writes the library column each week.',history:'This account once posted a made-up library event.',reports:'The town paper also reports new evening hours.',photo:'The busy-library photo was taken last year.',expert:'A librarian confirms there will be two late nights.',missing:'The new hours apply only on Tuesdays and Thursdays.'}},
    {id:'garden',title:'Giant carrots take over the school garden!',byline:'By Clover Lamb · The Meadow Bulletin',sentences:['The garden club grew carrots as long as a ruler.','A post says EVERY carrot in the garden is a giant!'],facts:['author','no-link','big-claim'],art:'clue-schedule.svg',alt:'An illustrated notice to investigate',context:{source:'Clover is a reporter for the school paper.',history:'This account shared an invented contest last month.',reports:'Another school reporter saw two very large carrots.',photo:'The shared garden picture is from last spring.',expert:'The garden teacher confirms that two carrots are huge.',missing:'Most of the carrots are an ordinary size.'}},
    {id:'bus',title:'Free bus rides for the WHOLE town!',byline:'By Fern Fleece · The Meadow Bulletin',sentences:['A post says everyone can ride the town bus for free.','It shows a bus photo but gives no link to the offer.'],facts:['author','no-link','big-claim'],art:'clue-shares.svg',alt:'An illustration of sheep sharing a post',context:{source:'Fern reports on town travel each month.',history:'This account once shared a false road closure.',reports:'A second paper reports that some rides will be free.',photo:'The bus photo is from an event two years ago.',expert:'A bus driver confirms a free-ride event is planned.',missing:'The offer is for children on Saturday morning only.'}}
  ];
  const evidence=[
    {key:'author',title:'A named author',side:'real',points:1,fact:'author',text:'The news names its writer.',icon:'🐑'},
    {key:'no-link',title:'Where is the link?',side:'fake',points:1,fact:'no-link',text:'The news gives no link to check.',icon:'↗'},
    {key:'big-claim',title:'A very big claim',side:'fake',points:1,fact:'big-claim',text:'The headline makes a sweeping claim.',icon:'!'},
    {key:'source',title:'A local reporter',side:'real',points:2,fact:'named-source',context:'source',text:'The source is a named local reporter.',icon:'🐑'},
    {key:'history',title:'A shaky history',side:'fake',points:2,fact:'unreliable-history',context:'history',text:'This source has shared made-up news.',icon:'↶'},
    {key:'reports',title:'Another report agrees',side:'real',points:2,fact:'independent-report',context:'reports',text:'A separate report backs the main claim.',icon:'▤'},
    {key:'photo',title:'An old photo',side:'fake',points:2,fact:'old-photo',context:'photo',text:'The picture is from an older event.',icon:'▣'},
    {key:'expert',title:'An expert backs it',side:'real',points:3,fact:'expert-support',context:'expert',text:'Someone who knows the place confirms it.',icon:'★'},
    {key:'missing',title:'A detail changes things',side:'fake',points:3,fact:'missing-detail',context:'missing',text:'An important limit was left out.',icon:'?'}
  ];
  const actions=[
    {key:'scout',type:'action',title:'Extra clues',icon:'＋',text:'Draw up to 2 extra cards. Then draw or drop.',effect:'scout'},
    {key:'take',type:'action',title:'Sneaky sheep',icon:'↗',text:'Take 1 random card from another player. Then draw or drop.',effect:'take'},
    {key:'swap',type:'action',title:'Flock swap',icon:'⇄',text:'Swap hands with another player. Then draw or drop.',effect:'swap'}
  ];
  const data={contexts,stories,evidence,actions};
  if(typeof module==='object'&&module.exports)module.exports=data;else root.LamboozledCards=data;
})(typeof globalThis==='object'?globalThis:this);
