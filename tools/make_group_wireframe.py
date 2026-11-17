from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_LEFT
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs'
OUT.mkdir(parents=True, exist_ok=True)
PDF = OUT / 'Lamboozled-Group-Wireframe.pdf'
W, H = 792, 612
INK, RED, TEAL, PURPLE, GOLD = map(HexColor, ['#233F46','#B5362E','#126F7B','#715597','#8B641D'])
PAPER, LINE, WASH = map(HexColor, ['#FFFCF2','#B7C5C1','#F0F3ED'])
COLORS = [RED, TEAL, PURPLE, GOLD]
DEMO = 'https://lamboozled-course-studio.eku2101.chatgpt.site/#lobby'
c = canvas.Canvas(str(PDF), pagesize=(W,H))
c.setTitle('LAMBOOZLED! - Group wireframe and four-person work plan')
c.setAuthor('Lamboozled course project team')

def rect(x,t,w,h,fill=PAPER,stroke=LINE,r=7,dash=False):
    c.saveState();c.setFillColor(fill);c.setStrokeColor(stroke);c.setLineWidth(1)
    if dash:c.setDash(3,3)
    c.roundRect(x,H-t-h,w,h,r,stroke=1,fill=1);c.restoreState()

def text(x,t,s,size=11,color=INK,bold=False):
    c.setFillColor(color);c.setFont('Helvetica-Bold' if bold else 'Helvetica',size);c.drawString(x,H-t-size,s)

def para(x,t,w,s,size=10,color=INK,bold=False,leading=None,maxh=None):
    style=ParagraphStyle('p',fontName='Helvetica-Bold' if bold else 'Helvetica',fontSize=size,leading=leading or size*1.35,textColor=color,alignment=TA_LEFT,spaceAfter=0)
    p=Paragraph(s,style);_,h=p.wrap(w,1000)
    if maxh is not None and h>maxh:raise ValueError(f'Paragraph exceeds box: {s[:65]} ({h} > {maxh})')
    p.drawOn(c,x,H-t-h);return h

def tag(x,t,label,color,w=None):
    width=w or c.stringWidth(label,'Helvetica-Bold',8)+14
    rect(x,t,width,18,white,color,4);text(x+7,t+4,label,8,color,True)

def button(x,t,w,label,primary=False):
    rect(x,t,w,25,TEAL if primary else white,TEAL,5)
    text(x+9,t+7,label,9,white if primary else INK,True)

def header(kicker,title,page):
    c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
    text(32,22,kicker,8,TEAL,True)
    text(32,39,'LAMBOOZLED!',28,RED,True)
    text(32,76,title,13,INK,True)
    text(602,29,'4 MEMBERS / 8 MODULES',9,TEAL,True)
    text(602,49,'Open the playable demo',10,TEAL,True)
    c.linkURL(DEMO,(602,H-66,758,H-46),relative=0,thickness=0)
    c.setStrokeColor(INK);c.setLineWidth(1.5);c.line(32,H-98,760,H-98)
    text(32,588,'Independent course concept | Original sample cards and labeled sample actions',8,INK)
    text(700,588,f'{page} / 2',9,TEAL,True)

header('TEAM HANDOUT / WORKING DEMO', 'Screen layout: build a case, back it with evidence.',1)
steps=[('01  SET UP','2-6 players; 5 cards each'),('02  YOUR TURN','Optional action, then draw OR drop'),('03  THE DROP','Everyone submits a case'),('04  REVIEW','Discuss which clues count'),('05  SCORE','Round winner +1; ties +1 each')]
for i,(a,b) in enumerate(steps):
    x=32+i*148
    rect(x,112,136,46,white,LINE,6)
    text(x+9,119,a,9,TEAL,True)
    para(x+9,133,119,b,8.5,maxh=24)

rect(32,171,728,379,HexColor('#ECEFE7'),INK,10)
text(45,182,'GAME TABLE',9,INK,True)
tag(135,178,'M01 / A',RED)
text(218,182,'Round 1  |  Alex\'s turn  |  Scores: Alex 0 - Sam 0',10,INK,True)
button(641,178,103,'Hide my hand')

# Main card column: M02 + M03 + M05.
rect(45,213,447,76,white,TEAL)
tag(57,223,'M02 / B',TEAL)
text(137,225,'NEWS CARD',8,TEAL,True)
text(57,248,'Library open late EVERY night!',16,INK,True)
text(57,270,'Short story + author / source',9,INK)
button(369,253,109,'Listen to card')

text(46,299,'4 CONTEXT CARDS',9,RED,True)
for i,label in enumerate(['Who posted it?','Earlier posts','Other reports','Check the photo']):
    x=45+i*114
    rect(x,316,105,48,HexColor('#FFF3EC'),RED)
    para(x+8,325,89,label,9.5,bold=True,maxh=25)
    text(x+8,348,'Short clue + Listen',7.8)

text(46,375,'YOUR PRIVATE HAND / 5 STARTING CARDS',9,TEAL,True)
tag(408,371,'M03 / B',TEAL)
for i,(side,points,label) in enumerate([('REAL','+1','News clue'),('REAL','+2','Context clue'),('FAKE','+3','Context clue'),('FAKE','+1','News clue'),('SAMPLE','','Action card')]):
    x=45+i*91
    rect(x,397,83,61,HexColor('#FFF1C9') if i==4 else white,GOLD if i==4 else TEAL)
    text(x+7,404,side,8,GOLD if i==4 else (RED if side=='FAKE' else TEAL),True)
    text(x+60,403,points,10,TEAL,True)
    text(x+7,423,label,9,INK,True)
    text(x+7,441,'Play action' if i==4 else 'Tap to select',8)

rect(45,469,447,66,white,PURPLE)
tag(57,478,'M05 / C',PURPLE)
text(136,481,'REAL or FAKE case + optional explanation',10,INK,True)
button(57,505,130,'Type / speak my reason')
button(211,505,109,'Draw a card')
text(329,513,'OR',8,INK,True)
button(351,505,127,'Drop my evidence',True)

# Support and after-drop screen preview.
rect(507,213,237,117,HexColor('#E6F1F1'),TEAL)
tag(519,223,'M04 / C',PURPLE)
text(519,251,'READ YOUR WAY',12,TEAL,True)
para(519,272,208,'Read / pause / stop<br/>Synchronized highlighting<br/>Text size, font, spacing, contrast',10,maxh=46)

rect(507,342,237,82,HexColor('#FFF0CE'),GOLD)
tag(519,352,'M06 / D',GOLD)
text(597,356,'ASK PIP / OPTIONAL',9,INK,True)
para(519,380,209,'Rule help + thinking hints<br/>Scripted preview; no automatic judging',9.5,maxh=31)

rect(507,436,237,99,white,RED,dash=True)
tag(519,446,'M07 / A',RED)
text(598,450,'AFTER EVERYONE DROPS',8,INK,True)
para(519,474,209,'Reveal cases and discuss clues.<br/><b>Count evidence, then award +1.</b><br/>Reflect, then start the next round.',10,maxh=46)

text(33,559,'M08 / D: project menu - team assignments, content permissions and shared integration.',9,INK,True)
text(33,574,'Phone: turn status > reading tools / guide > news / context > hand > response / turn controls.',8.5)
c.showPage()

header('TEAM HANDOUT / DISCUSS TOGETHER', 'Suggested work packages: choose roles together at the meeting.',2)
packages=[
    ('A','GAME FLOW & RESULTS','M01 + M07',RED,'01-lobby.js + 07-reflection.js; game-engine.js',[
        'Player setup, private handover and legal turns',
        'Everyone\'s drop, evidence totals, ties and round wins',
        'Match ending, reflection and game export'],
        'Check: a full round works, scores award once, and ties each receive one point.'),
    ('B','CARDS & EVIDENCE','M02 + M03',TEAL,'02-news.js + 03-evidence.js; cards.js',[
        'News, four context cards, decks and five-card hands',
        'Evidence selection, values and applicability',
        'Labeled sample actions and card ownership'],
        'Check: dealing, drawing, taking and swapping preserve the right cards.'),
    ('C','ACCESS & RESPONSES','M04 + M05',PURPLE,'04-reading.js + 05-response.js',[
        'Read-aloud, highlighting and reading settings',
        'Typed / spoken explanations and editable dictation',
        'Keyboard access, clear errors and device testing'],
        'Check: larger text fits and players can finish without voice or a mouse.'),
    ('D','GUIDE & INTEGRATION','M06 + M08',GOLD,'06-guide.js + 08-team.js; shared HTML / CSS',[
        'Optional guide and reflection on assistance',
        'Team board, content records and permissions',
        'Integrate modules, coordinate QA and update the demo'],
        'Check: the whole game works with the guide off; guide use never changes points.')
]
for i,(letter,title,mods,color,files,tasks,check) in enumerate(packages):
    x=32+(i%2)*372;t=114+(i//2)*176
    rect(x,t,356,162,white,LINE,9)
    c.setFillColor(color);c.roundRect(x,H-t-5,356,5,2,stroke=0,fill=1)
    tag(x+13,t+12,mods,color)
    text(x+98,t+15,letter+' / '+title,10,color,True)
    para(x+13,t+39,330,files,8.6,color=INK,maxh=15)
    for j,item in enumerate(tasks):
        c.setFillColor(color);c.circle(x+16,H-(t+64+j*15),1.8,stroke=0,fill=1)
        para(x+24,t+58+j*15,318,item,9.3,maxh=14)
    para(x+13,t+109,330,check,8.8,maxh=25)
    text(x+13,t+143,'Owner: ________________________',9,INK)

rect(32,474,728,88,HexColor('#E7F0EC'),TEAL)
text(45,486,'OUR FIRST MEETING / 30 MINUTES',11,TEAL,True)
agenda=[('10 min','Try the demo and gather changes.'),('10 min','Choose roles and agree on scope.'),('10 min','Pick first tasks, dates and check-in.')]
for i,(time,task) in enumerate(agenda):
    x=45+i*238
    text(x,510,time,9,TEAL,True);para(x,526,220,task,9.5,maxh=26)
text(33,570,'Two modules each is a starting split. Everyone tests; rebalance as needed. No roles assigned yet.',8.6)
c.showPage();c.save()
reader=PdfReader(PDF)
assert len(reader.pages)==2
all_text='\n'.join(p.extract_text() for p in reader.pages)
for needle in ['M01','M02','M03','M04','M05','M06','M07','M08','SAMPLE','30 MINUTES']:
    assert needle in all_text,needle
assert sum(len(p.get('/Annots',[])) for p in reader.pages)==2
print(f'Created {PDF}; 2 pages, 8 module labels, 2 working demo links.')
