
// ── STORAGE ───────────────────────────────────────────────────────────────────
const SK={
  prospects:'fpcm_prospects',templates:'fpcm_templates',mission:'fpcm_mission',
  days:'fpcm_days',streak:'fpcm_streak',reviews:'fpcm_reviews',starred:'fpcm_starred',
  nonneg:'fpcm_nonneg',milestones:'fpcm_milestones',content:'fpcm_content',
  xp:'fpcm_xp',reasons:'fpcm_reasons',nnStreak:'fpcm_nnStreak',
  driveToken:'fpcm_driveToken',driveFileId:'fpcm_driveFileId',driveClientId:'fpcm_driveClientId',
  stateLog:'phq_stateLog',morningRitual:'phq_morningRitual',manifesto:'phq_manifesto',affirmations:'phq_affirmations',
  paperRitual:'phq_paperRitual',morningStreak:'phq_morningStreak',perfectDays:'phq_perfectDays',
  settings:'life_settings',dailyLock:'life_dailyLock',penaltyApplied:'life_penaltyApplied',
  idbBackup:'life_idb_ts',lastStatePopup:'life_lastStatePopup',
  deviceId:'lo_device_id',supabaseSettings:'lo_supabase',
  nnLabels:'lo_nn_labels',
  firedAlarmsToday:'life_firedAlarms',
  criticalPriority:'life_criticalPriority',
  pinnedWisdom:'life_pinnedWisdom',
  wisdomIndex:'life_wisdomIdx'
};
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v!==null?JSON.parse(v):d;}catch(e){return d;}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}  _scheduleSyncToSupabase();};
const todayStr=()=>new Date().toISOString().split('T')[0];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function yesterdayStr(){const d=new Date();d.setDate(d.getDate()-1);return d.toISOString().split('T')[0];}
function getLastWorkday(){const d=new Date();d.setDate(d.getDate()-1);if(d.getDay()===0)d.setDate(d.getDate()-1);return d.toISOString().split('T')[0];}
function fmtDate(s){if(!s)return '';try{const d=new Date(s+'T12:00:00');return d.toLocaleDateString('de',{day:'2-digit',month:'2-digit',year:'numeric'});}catch(e){return s;}}

function fmtAge(ms){const m=Math.floor(ms/60000);if(m<60)return m+'m';const h=Math.floor(ms/3600000);if(h<24)return h+'h';return Math.floor(ms/86400000)+'d';}

function detectPlatform(url){
  const u=(url||'').toLowerCase();
  if(u.includes('instagram.com'))return{label:'IG',cls:'soc-ig'};
  if(u.includes('linkedin.com'))return{label:'LI',cls:'soc-li'};
  if(u.includes('tiktok.com'))return{label:'TT',cls:'soc-tt'};
  if(u.includes('youtube.com')||u.includes('youtu.be'))return{label:'YT',cls:'soc-yt'};
  return{label:'🌐',cls:'soc-web'};
}

// ── XP / LEVELS ───────────────────────────────────────────────────────────────
const LEVELS=[
  {level:1, name:'Cold Caller',     min:0,     max:49},
  {level:2, name:'DM Sender',       min:50,    max:149},
  {level:3, name:'Pipeline Builder',min:150,   max:349},
  {level:4, name:'Reply Hunter',    min:350,   max:699},
  {level:5, name:'Closer',          min:700,   max:1199},
  {level:6, name:'Agency Pro',      min:1200,  max:1999},
  {level:7, name:'Frequency Master',min:2000,  max:3999},
  {level:8, name:'Life Architect',  min:4000,  max:6999},
  {level:9, name:'Revenue Machine', min:7000,  max:10999},
  {level:10,name:'Empire Builder',  min:11000, max:16999},
];
const PRESTIGE_NAMES=['Shadow Walker','Dark Horse','Phantom Closer','Apex Operator','Legend','Myth','The 0.1%'];

// ── DAILY WISDOM ──────────────────────────────────────────────────────────────
const WISDOM_ENTRIES=[
  {q:'Du bist nicht deine Gedanken. Du bist das Bewusstsein dahinter.',ctx:'Alessandro, May 17 — Consciousness Foundation'},
  {q:'Awareness ist der Schritt vor der Reaktion. Frage dich: Ist diese Reaktion es wert?',ctx:'Alessandro, May 17 — Awareness before reaction'},
  {q:'Es ist kein strategisches Spiel. Es ist ein spirituelles Spiel der Selbstverbesserung.',ctx:'Alessandro — Die universelle Lektion'},
  {q:'Die gleiche Situation + ein anderer State = ein völlig anderes Ergebnis.',ctx:'Alessandro — State ist die einzige Variable'},
  {q:'Outreach aus Angst verscheucht Kunden. Geh rein als jemand, der wählt — nicht als jemand, der braucht.',ctx:'Alessandro — Neediness Principle'},
  {q:'Neediness repels. Abundance attracts.',ctx:'Alessandro — Sales Framework'},
  {q:'Wenn das External das Internal bestimmt, bist du auf einem emotionalen Lebens-Rollercoaster.',ctx:'Alessandro, May 17 — State Control'},
  {q:'Das Universum ist ein Kellner. Vage Bestellungen bekommen vage Ergebnisse.',ctx:'Alessandro — Goal Specificity'},
  {q:'Verbotene Wörter: wahrscheinlich / eines Tages / ich hoffe / ich versuche.',ctx:'Alessandro — Language Hygiene'},
  {q:'Mach Content, den du selbst gerne siehst. Höre nie auf zu posten.',ctx:'Alessandro, May 17 — Personal Brand Philosophy'},
  {q:'5–10k im Monat ist Freiheit. Alles darüber ist Lifestyle-Inflation.',ctx:'Alessandro, May 17 — Money Calibration'},
  {q:'Elite-Events sind ein Nebenprodukt der Arbeit — kein Ziel zum Nachjagen.',ctx:'Alessandro, May 17 — Cannes Reality Check'},
  {q:'Zero Facts Mindset: Behandle jeden gleich. Kein Fanboy-Energy.',ctx:'Alessandro, May 17 — Networking'},
  {q:'Die richtigen Menschen finden dich, wenn du in hoher Frequenz bist.',ctx:'Alessandro, May 17 — Energy attracts'},
  {q:'Vor jeder Emotion: eine Pause. Bin ich dieser Reaktion wert?',ctx:'Alessandro, May 17 — Awareness'},
  {q:'Kein Ziel ohne: exaktes Datum, Betrag, Nische, Anzahl Kunden, Wie es passiert.',ctx:'Alessandro — The Waiter Analogy'},
  {q:'Das Gefühl, das du mit in den Schlaf nimmst, ist das Gefühl, mit dem du aufwachst.',ctx:'Alessandro — Evening Ritual'},
  {q:'Selbstsabotage Wurzel: Ich operiere aus Mangel. Ich fokussiere mich auf das, was ich nicht habe.',ctx:'Alessandro — 5 Levels of Why'},
  {q:'Marketing lehrt dich, dir selbst zu vertrauen. Alles andere wird dann leicht.',ctx:'Alessandro, May 17 — Adam\'s segment'},
  {q:'Ich bin dankbar, dass [Ergebnis] bis [genaues Datum] passiert ist.',ctx:'Alessandro — Manifesto Letter Format'},
];
function getDayOfYear(){const n=new Date(),s=new Date(n.getFullYear(),0,0);return Math.floor((n-s)/864e5);}
function getWisdomIndex(){
  const stored=load(SK.wisdomIndex,{date:'',idx:0});
  const today=todayStr();
  if(stored.date!==today){const idx=getDayOfYear()%WISDOM_ENTRIES.length;save(SK.wisdomIndex,{date:today,idx});return idx;}
  return stored.idx;
}
function getPinnedWisdom(){return load(SK.pinnedWisdom,[]);}
function togglePinWisdom(idx){
  const pins=getPinnedWisdom();
  const i=pins.indexOf(idx);
  if(i===-1)pins.push(idx);else pins.splice(i,1);
  save(SK.pinnedWisdom,pins);
  renderDailyWisdom();
}
function advanceWisdom(){
  const stored=load(SK.wisdomIndex,{date:todayStr(),idx:getDayOfYear()%WISDOM_ENTRIES.length});
  stored.idx=(stored.idx+1)%WISDOM_ENTRIES.length;
  save(SK.wisdomIndex,stored);
  renderDailyWisdom();
}
function renderDailyWisdom(){
  const el=document.getElementById('daily-wisdom-card');if(!el)return;
  const idx=getWisdomIndex();
  const w=WISDOM_ENTRIES[idx];
  const pins=getPinnedWisdom();
  const isPinned=pins.includes(idx);
  const pinnedHtml=pins.length?`<div style="margin-top:14px;border-top:1px solid var(--border);padding-top:12px"><div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.08em;margin-bottom:8px">MEINE ANKER</div>`+
    pins.map(pi=>`<div style="font-size:12px;color:var(--text);padding:6px 10px;background:var(--surface2);border-radius:8px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><span>${esc(WISDOM_ENTRIES[pi].q)}</span><button onclick="togglePinWisdom(${pi})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:12px;flex-shrink:0">✕</button></div>`).join('')+
    `</div>`:'' ;
  el.innerHTML=`
    <div style="font-size:11px;font-weight:700;color:var(--amber);letter-spacing:.08em;margin-bottom:10px">DENK DRAN HEUTE</div>
    <div style="font-size:15px;line-height:1.6;color:var(--text);margin-bottom:8px">"${esc(w.q)}"</div>
    <div style="font-size:11px;color:var(--muted);margin-bottom:14px">${esc(w.ctx)}</div>
    <div style="display:flex;gap:8px">
      <button onclick="togglePinWisdom(${idx})" class="btn btn-ghost btn-xs" style="color:${isPinned?'var(--amber)':'var(--muted)'}">${isPinned?'★ Gemerkt':'☆ Merken'}</button>
      <button onclick="advanceWisdom()" class="btn btn-ghost btn-xs">Weiter →</button>
    </div>
    ${pinnedHtml}
  `;
}
function computeLevel(xp){
  const found=LEVELS.find(l=>xp<=l.max);
  if(found){
    const nextL=LEVELS[found.level]||null;
    const pct=nextL?Math.min(100,Math.round(((xp-found.min)/(nextL.min-found.min))*100)):100;
    return{level:found.level,name:found.name,pct,nextXP:nextL?nextL.min:null,prevXP:found.min};
  }
  const XP_PER_PRESTIGE=10000;
  const prestigeIdx=Math.floor((xp-17000)/XP_PER_PRESTIGE);
  const lvl=11+prestigeIdx;
  const thisMin=17000+prestigeIdx*XP_PER_PRESTIGE;
  const nextMin=thisMin+XP_PER_PRESTIGE;
  const pct=Math.round(((xp-thisMin)/XP_PER_PRESTIGE)*100);
  const name=PRESTIGE_NAMES[Math.min(prestigeIdx,PRESTIGE_NAMES.length-1)];
  return{level:lvl,name,pct,nextXP:nextMin,prevXP:thisMin};
}
function getXP(){return load(SK.xp,{total:0,level:1});}
let _toastQueue=[];
let _toastBusy=false;
function _processToastQueue(){
  if(_toastBusy||!_toastQueue.length)return;
  _toastBusy=true;
  const{title,icon,sub}=_toastQueue.shift();
  const el=document.getElementById('xp-toast');if(!el){_toastBusy=false;return;}
  const iconEl=document.getElementById('xp-toast-icon');
  const titleEl=document.getElementById('xp-toast-title');
  const subEl=document.getElementById('xp-toast-sub');
  if(iconEl)iconEl.textContent=icon||'⚡';
  if(titleEl)titleEl.textContent=title;
  if(subEl)subEl.textContent=sub||'';
  el.classList.add('visible');
  setTimeout(()=>{
    el.classList.remove('visible');
    _toastBusy=false;
    setTimeout(_processToastQueue,200);
  },3500);
}
function showXPToast(title,icon,sub){
  _toastQueue.push({title,icon,sub});
  _processToastQueue();
}
function showAchievementToast(ms){
  const rarityLabel={common:'',rare:' · Rare',epic:' · Epic',legendary:' · LEGENDARY!'}[ms.rarity]||'';
  showXPToast('Achievement: '+ms.text, ms.icon||'🎖', '+'+ms.xp+' XP'+(ms.flavor?' · '+ms.flavor:'')+rarityLabel);
}
function addXPSilent(amount){
  const xpData=getXP();
  const before=computeLevel(xpData.total);
  xpData.total+=amount;
  const after=computeLevel(xpData.total);
  save(SK.xp,xpData);
  renderXPBar();
  return{leveled:after.level>before.level,newLevel:after};
}
function awardXP(amount){
  const{leveled,newLevel}=addXPSilent(amount);
  if(leveled){showXPToast('LEVEL UP — '+newLevel.name+'!','🏆','Level '+newLevel.level+' erreicht');}
  else if(amount>=50){showXPToast('+'+amount+' XP','⚡','');}
}

// ── REASONS (Dual Consequence Cards) ─────────────────────────────────────────
function getReasons(){
  return load(SK.reasons,{
    doList:['Finanziell unabhängig','Ortsunabhängig','Zeitunabhängig','Hilfe für Familie','Beweise mir selbst, dass ich es kann','Freiheit über meine Zeit'],
    dontList:['Mehr Schulden','Vielleicht wieder Job suchen','Reue, es nicht einfach gemacht zu haben','Abhängig von Ort','Arbeitswege','Zeit- und ortsbestimmt leben','Eltern enttäuscht','Keine Kontrolle über mein Leben']
  });
}
function renderReasonCards(){
  const r=getReasons();
  const doEl=document.getElementById('csq-do-list');
  const dontEl=document.getElementById('csq-dont-list');
  if(doEl)doEl.innerHTML=r.doList.map(item=>`<li class="green">${esc(item)}</li>`).join('');
  if(dontEl)dontEl.innerHTML=r.dontList.map(item=>`<li class="red">${esc(item)}</li>`).join('');
}
function editReasonList(type){
  const ta=document.getElementById('ta-'+type);
  const wrap=document.getElementById('csq-'+type+'-wrap');
  if(!ta||!wrap)return;
  const isEditing=ta.style.display!=='none';
  if(isEditing){
    const r=getReasons();
    const lines=ta.value.split('\n').map(l=>l.trim().replace(/^[-•→]\s*/,'')).filter(l=>l);
    if(type==='do')r.doList=lines;else r.dontList=lines;
    save(SK.reasons,r);
    ta.style.display='none';wrap.style.display='';
    renderReasonCards();
  } else {
    const r=getReasons();
    const items=type==='do'?r.doList:r.dontList;
    ta.value=items.join('\n');
    wrap.style.display='none';ta.style.display='block';
    setTimeout(()=>ta.focus(),10);
  }
}

// ── MISSION ───────────────────────────────────────────────────────────────────
function getMission(){return load(SK.mission,{goal:'',deadline:'',consequence:'',dailyTarget:20});}

function renderMission(){
  const m=getMission(),days=getDays(),today=todayStr();
  const sent=(days[today]||[]).length;
  const gEl=document.getElementById('mc-goal');
  if(m.goal){gEl.textContent=m.goal;gEl.className='mc-goal';}
  else{gEl.textContent='Ziel setzen → tippe auf ✎';gEl.className='mc-goal empty';}
  const dEl=document.getElementById('mc-deadline');
  dEl.textContent=m.deadline?'bis '+fmtDate(m.deadline):'';
  const cEl=document.getElementById('mc-consequence');
  if(m.consequence){cEl.textContent='Wenn nicht: '+m.consequence;cEl.style.display='block';}
  else{cEl.style.display='none';}
  document.getElementById('mc-sent').textContent=sent;
  document.getElementById('mc-target').textContent=m.dailyTarget||20;
  const streak=computeStreak();
  const sEl=document.getElementById('mc-streak');
  if(streak.count>0){sEl.textContent='🔥 Tag '+streak.count;sEl.className='mc-streak';}
  else{sEl.textContent='Streak starten';sEl.className='mc-streak zero';}
  const lvlEl=document.getElementById('mc-level');
  if(lvlEl){const xpData=getXP(),lvl=computeLevel(xpData.total);lvlEl.textContent='⚡ '+lvl.name+' · '+xpData.total+' XP';lvlEl.style.display='inline-flex';}
  const gcGoal=document.getElementById('gc-goal');
  const gcCons=document.getElementById('gc-consequence');
  if(m.goal){
    gcGoal.textContent=m.goal+(m.deadline?' · bis '+fmtDate(m.deadline):'');
    gcGoal.className='gc-goal';
  } else {
    gcGoal.textContent='Noch kein Ziel gesetzt — geh zum Outreach-Tab.';
    gcGoal.className='gc-goal empty';
  }
  gcCons.textContent=m.consequence?'Wenn nicht: '+m.consequence:'';
}

function toggleMissionEdit(){
  const v=document.getElementById('mission-edit');
  const isHidden=v.style.display==='none';
  v.style.display=isHidden?'block':'none';
  if(isHidden){
    const m=getMission();
    document.getElementById('me-goal').value=m.goal||'';
    document.getElementById('me-deadline').value=m.deadline||'';
    document.getElementById('me-consequence').value=m.consequence||'';
    document.getElementById('me-target').value=m.dailyTarget||20;
    document.getElementById('me-goal').focus();
  }
}

function saveMissionEdit(){
  const m={
    goal:document.getElementById('me-goal').value.trim(),
    deadline:document.getElementById('me-deadline').value,
    consequence:document.getElementById('me-consequence').value.trim(),
    dailyTarget:Math.max(1,parseInt(document.getElementById('me-target').value)||20)
  };
  save(SK.mission,m);
  document.getElementById('mission-edit').style.display='none';
  renderMission();
  renderStart();
  renderZiele();
}

// ── STREAK ────────────────────────────────────────────────────────────────────
function getDays(){return load(SK.days,{});}
function getStreak(){return load(SK.streak,{count:0,lastDay:null});}

function computeStreak(){
  const m=getMission(),days=getDays(),streak=getStreak();
  const today=todayStr();
  if(new Date().getDay()===0)return{...streak};
  const lwd=getLastWorkday();
  let s={...streak};
  if(s.lastDay&&s.lastDay!==today&&s.lastDay!==lwd){s.count=0;save(SK.streak,s);}
  else if(s.lastDay===lwd){
    const lwdSent=(days[lwd]||[]).length;
    if(lwdSent<(m.dailyTarget||20)&&s.count>0){s.count=0;save(SK.streak,s);}
  }
  return s;
}

function tryIncrementStreak(){
  const m=getMission(),days=getDays(),streak=getStreak(),today=todayStr();
  const sent=(days[today]||[]).length;
  if(sent>=(m.dailyTarget||20)&&streak.lastDay!==today){
    const ns={count:streak.count+1,lastDay:today};
    save(SK.streak,ns);return ns;
  }
  return streak;
}

function incrementDailyCounter(name){
  const days=getDays(),today=todayStr();
  if(!days[today])days[today]=[];
  days[today].push({name,timestamp:Date.now()});
  save(SK.days,days);
  const m=getMission();
  if(days[today].length>=(m.dailyTarget||20))tryIncrementStreak();
  awardXP(1);
  renderStart();
  updateNavDots();
  setTimeout(checkAutoAchievements,50);
}

// ── PROSPECTS ─────────────────────────────────────────────────────────────────
function getProspects(){return load(SK.prospects,[]);}
function saveProspects(p){save(SK.prospects,p);}

const STAGE_LABELS={dm_sent:'DM Gesendet',followup:'Follow-up',loom:'Loom',loom_sent:'Loom Gesendet',call_booked:'Call Gebucht',won:'Gewonnen',lost:'Lost',unqualified:'Nicht qualifiziert'};
const STAGE_ORDER=['dm_sent','followup','loom','loom_sent','call_booked','won','lost','unqualified'];

function submitAddProspect(){
  const name=document.getElementById('ap-name').value.trim();
  if(!name){document.getElementById('ap-name').focus();return;}
  const type=document.getElementById('ap-type').value;
  const stage=document.getElementById('ap-stage').value;
  const notes=document.getElementById('ap-notes').value.trim();
  const link=(document.getElementById('ap-link')?.value||'').trim();
  const today=todayStr();
  const fuDays=getSettings().defaultFollowUp||3;
  const fuDate=new Date();fuDate.setDate(fuDate.getDate()+fuDays);
  const prospect={
    id:Date.now().toString(),
    name,type,stage,notes,
    loomUrl:'',msgCount:0,links:link&&link.startsWith('http')?[link]:[],
    createdAt:today,
    followUpAt:stage==='dm_sent'?fuDate.toISOString().split('T')[0]:null,
    history:[{action:STAGE_LABELS[stage]||stage,date:today,ts:Date.now()}]
  };
  const prospects=getProspects();
  prospects.unshift(prospect);
  saveProspects(prospects);
  if(stage==='dm_sent'||stage==='loom')incrementDailyCounter(name);
  document.getElementById('ap-name').value='';
  document.getElementById('ap-type').value='';
  document.getElementById('ap-stage').value='dm_sent';
  document.getElementById('ap-notes').value='';
  const apLink=document.getElementById('ap-link');if(apLink)apLink.value='';
  document.getElementById('add-form').style.display='none';
  renderPipeline();
  renderMission();
  updateWeekStats();
}

function moveProspect(id,newStage){
  const prospects=getProspects();
  const idx=prospects.findIndex(p=>p.id===id);
  if(idx<0)return;
  const p=prospects[idx];
  p.stage=newStage;
  p.history.push({action:STAGE_LABELS[newStage]||newStage,date:todayStr(),ts:Date.now()});
  const _fuDays=getSettings().defaultFollowUp||3;
  if(newStage==='dm_sent'){
    const d=new Date();d.setDate(d.getDate()+_fuDays);
    p.followUpAt=d.toISOString().split('T')[0];
  }
  if(newStage==='loom_sent'){
    const d=new Date();d.setDate(d.getDate()+_fuDays);
    p.followUpAt=d.toISOString().split('T')[0];
  }
  saveProspects(prospects);
  if(newStage==='followup')incrementDailyCounter(p.name);
  setFilter('all');
  renderMission();
  updateWeekStats();
  setTimeout(checkAutoAchievements,50);
}

function deleteProspect(id){
  if(!confirm('Prospect löschen?'))return;
  saveProspects(getProspects().filter(p=>p.id!==id));
  if(expandedId===id)expandedId=null;
  renderPipeline();
}

function setProspectFollowUp(id,days){
  const prospects=getProspects();
  const p=prospects.find(x=>x.id===id);if(!p)return;
  const d=new Date();d.setDate(d.getDate()+days);
  p.followUpAt=d.toISOString().split('T')[0];
  saveProspects(prospects);
  renderPipeline();
  updateNavDots();
}

function toggleFollowUpDropdown(id,btn){
  const dd=document.getElementById('fu-dd-'+id);
  if(!dd)return;
  const isOpen=dd.style.display!=='none';
  document.querySelectorAll('.fu-dropdown').forEach(el=>el.style.display='none');
  if(!isOpen)dd.style.display='block';
  btn.stopPropagation&&btn.stopPropagation();
}

let activeFilter='all';
let expandedId=null;

function setFilter(f){
  activeFilter=f;
  document.querySelectorAll('.sf-pill').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.filter===f);
  });
  expandedId=null;
  renderPipeline();
}

function isFollowupDue(p){
  return p.stage==='dm_sent'&&p.followUpAt&&todayStr()>=p.followUpAt;
}

function isLoomSentFollowupDue(p){
  return p.stage==='loom_sent'&&p.followUpAt&&todayStr()>=p.followUpAt;
}

function prospectAge(p){
  if(!p.history||!p.history.length)return null;
  const last=p.history[p.history.length-1];
  const ts=last.ts||new Date(last.date+'T00:00:00').getTime();
  return Math.max(0,Date.now()-ts);
}

function renderPipeline(){
  const prospects=getProspects();
  const counts={all:prospects.length};
  STAGE_ORDER.forEach(s=>{counts[s]=prospects.filter(p=>p.stage===s).length;});
  ['all',...STAGE_ORDER].forEach(s=>{const el=document.getElementById('ct-'+s);if(el)el.textContent=counts[s]||0;});
  const _fuEl=document.getElementById('ct-followup');
  if(_fuEl)_fuEl.textContent=prospects.filter(p=>p.stage==='followup'||isFollowupDue(p)||isLoomSentFollowupDue(p)).length;
  const fuDue=prospects.filter(p=>isFollowupDue(p)).length;
  const loomSentDue=prospects.filter(p=>isLoomSentFollowupDue(p)).length;
  const loomCount=counts['loom']||0;
  const fuPill=document.querySelector('.sf-pill[data-filter="followup"]');
  const loomPill=document.querySelector('.sf-pill[data-filter="loom"]');
  const loomSentPill=document.querySelector('.sf-pill[data-filter="loom_sent"]');
  if(fuPill){fuPill.classList.toggle('alert',fuDue>0&&activeFilter!=='followup');}
  if(loomPill){loomPill.classList.toggle('alert',loomCount>0&&activeFilter!=='loom');}
  if(loomSentPill){loomSentPill.classList.toggle('alert',loomSentDue>0&&activeFilter!=='loom_sent');}
  const searchVal=(document.getElementById('prospect-search')?.value||'').toLowerCase().trim();
  let filtered=activeFilter==='all'?prospects:activeFilter==='followup'?prospects.filter(p=>p.stage==='followup'||isFollowupDue(p)||isLoomSentFollowupDue(p)):prospects.filter(p=>p.stage===activeFilter);
  if(searchVal)filtered=filtered.filter(p=>
    p.name.toLowerCase().includes(searchVal)||
    (p.type||'').toLowerCase().includes(searchVal)||
    (p.notes||'').toLowerCase().includes(searchVal)
  );
  const listEl=document.getElementById('prospect-list');
  if(!filtered.length){
    listEl.innerHTML='<div class="empty-state">'+(activeFilter==='all'?'Noch keine Prospects. Fang an zu schreiben.':'Keine Prospects in dieser Phase.')+'</div>';
    return;
  }
  listEl.innerHTML='';
  const TYPE_LABELS={coach:'Coach',speaker:'Speaker',consultant:'Consultant',course:'Course Creator'};
  filtered.forEach(p=>{
    const due=isFollowupDue(p);
    const loomDue=p.stage==='loom';
    const loomSentDueP=isLoomSentFollowupDue(p);
    const isExpanded=expandedId===p.id;
    const typeLbl=TYPE_LABELS[p.type]||'';
    const metaParts=[typeLbl,fmtDate(p.createdAt)].filter(Boolean);
    const ageMs=['won','lost'].includes(p.stage)?null:prospectAge(p);
    const ageColor=ageMs===null?'':ageMs<3*3600000?'var(--muted)':ageMs<24*3600000?'var(--amber)':'var(--red)';
    const ageChip=ageMs!==null?`<span style="font-size:10px;font-weight:700;color:${ageColor};background:var(--surface2);padding:2px 7px;border-radius:99px;flex-shrink:0">${fmtAge(ageMs)}</span>`:'';
    const linkChips=(p.links&&p.links.length)?p.links.slice(0,3).map(u=>{const pl=detectPlatform(u);return`<a href="${u}" target="_blank" rel="noopener noreferrer" class="soc-badge ${pl.cls}" style="font-size:9px;padding:1px 5px;text-decoration:none" onclick="event.stopPropagation()">${pl.label}</a>`;}).join(''):'';
    const msgCount=p.msgCount||0;
    const row=document.createElement('div');
    row.className='prospect-row';
    row.id='pr-'+p.id;
    const mainDiv=document.createElement('div');
    mainDiv.className='pr-main';
    mainDiv.onclick=()=>toggleExpand(p.id);
    mainDiv.innerHTML=`
      <div class="pr-left">
        <div class="pr-name-row">
          <span class="pr-name">${esc(p.name)}</span>
          <span class="stage-badge sb-${p.stage}">${STAGE_LABELS[p.stage]||p.stage}</span>
          ${due?'<span class="due-badge db-followup">Follow-up fällig</span>':''}
          ${loomDue?'<span class="due-badge db-loom">Loom ausstehend</span>':''}
          ${loomSentDueP?'<span class="due-badge db-followup">Follow-up fällig</span>':''}
          ${ageChip}${linkChips}
        </div>
        <div class="pr-meta">${metaParts.join(' · ')}</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
        ${!['lost'].includes(p.stage)?`<button class="msg-btn${msgCount>0?' has-msgs':''}" onclick="event.stopPropagation();incrementMsgCount('${p.id}')">💬${msgCount>0?' '+msgCount:''}</button>`:''}
        <span class="pr-chevron">${isExpanded?'▲':'▼'}</span>
      </div>`;
    row.appendChild(mainDiv);
    const expandedDiv=document.createElement('div');
    expandedDiv.className='pr-expanded'+(isExpanded?' open':'');
    if(p.notes){
      const notesDiv=document.createElement('div');
      notesDiv.className='pr-notes';
      notesDiv.textContent=p.notes;
      expandedDiv.appendChild(notesDiv);
    }
    const histWrap=document.createElement('div');
    histWrap.className='pr-hist-wrap';
    histWrap.innerHTML='<div class="pr-hist-lbl">Verlauf</div>';
    const histItems=p.history.slice().reverse();
    histItems.forEach(h=>{
      const item=document.createElement('div');
      item.className='pr-hist-item';
      item.innerHTML=`<span>${esc(h.action)}</span><span style="color:var(--muted)">${fmtDate(h.date)}</span>`;
      histWrap.appendChild(item);
    });
    expandedDiv.appendChild(histWrap);
    // Social links section
    const socWrap=document.createElement('div');
    socWrap.style.cssText='margin-bottom:10px;margin-top:10px';
    const socLbl=document.createElement('div');
    socLbl.style.cssText='font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:6px';
    socLbl.textContent='Social Links';
    const socBadges=document.createElement('div');
    socBadges.className='soc-links-row';
    const curLinks=p.links||[];
    if(curLinks.length){
      curLinks.forEach((url,i)=>{
        const pl=detectPlatform(url);
        const a=document.createElement('a');
        a.href=url;a.target='_blank';a.rel='noopener noreferrer';
        a.className='soc-badge '+pl.cls;
        a.onclick=e=>e.stopPropagation();
        a.innerHTML=pl.label+` <span style="cursor:pointer;font-size:9px;margin-left:2px" onclick="event.stopPropagation();event.preventDefault();removeProspectLink('${p.id}',${i})">✕</span>`;
        socBadges.appendChild(a);
      });
    } else {
      socBadges.innerHTML='<span style="font-size:12px;color:var(--muted)">Noch keine Links</span>';
    }
    const socAddRow=document.createElement('div');
    socAddRow.className='soc-add-row';
    const socInput=document.createElement('input');
    socInput.type='url';socInput.id='soc-input-'+p.id;
    socInput.placeholder='https://instagram.com/…';
    socInput.style.cssText='flex:1;font-size:12px;padding:6px 10px';
    socInput.onclick=e=>e.stopPropagation();
    socInput.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();addProspectLink(p.id);}};
    const socAddBtn=document.createElement('button');
    socAddBtn.className='btn btn-ghost btn-xs';socAddBtn.textContent='+ Link';
    socAddBtn.onclick=function(e){e.stopPropagation();addProspectLink(p.id);};
    socAddRow.appendChild(socInput);socAddRow.appendChild(socAddBtn);
    socWrap.appendChild(socLbl);socWrap.appendChild(socBadges);socWrap.appendChild(socAddRow);
    expandedDiv.appendChild(socWrap);
    if(p.stage==='loom'){
      const loomBtn=document.createElement('button');
      loomBtn.className='btn btn-purple btn-sm btn-full';
      loomBtn.style.cssText='margin-bottom:12px;margin-top:4px';
      loomBtn.textContent='Loom aufgenommen ✓';
      loomBtn.onclick=function(e){e.stopPropagation();moveProspect(p.id,'loom_sent');};
      expandedDiv.appendChild(loomBtn);
    }
    if(p.stage==='loom'||p.stage==='loom_sent'){
      const urlWrap=document.createElement('div');
      urlWrap.style.cssText='margin-bottom:12px';
      const urlLbl=document.createElement('label');
      urlLbl.style.cssText='display:block;font-size:12px;font-weight:500;color:var(--secondary);margin-bottom:6px';
      urlLbl.textContent='Loom-Link';
      const urlRow=document.createElement('div');
      urlRow.style.cssText='display:flex;gap:8px;align-items:center';
      const urlInput=document.createElement('input');
      urlInput.type='url';
      urlInput.placeholder='https://loom.com/share/...';
      urlInput.value=p.loomUrl||'';
      urlInput.style.cssText='flex:1;min-width:0';
      urlInput.addEventListener('blur',function(){
        const ps=getProspects();const found=ps.find(x=>x.id===p.id);
        if(found){found.loomUrl=this.value.trim();saveProspects(ps);}
      });
      urlInput.addEventListener('click',function(e){e.stopPropagation();});
      urlRow.appendChild(urlInput);
      if(p.loomUrl){
        const openBtn=document.createElement('button');
        openBtn.className='btn btn-ghost btn-xs';
        openBtn.style.cssText='flex-shrink:0';
        openBtn.textContent='Öffnen →';
        openBtn.onclick=function(e){e.stopPropagation();const url=p.loomUrl;if(url.startsWith('https://'))window.open(url,'_blank');};
        urlRow.appendChild(openBtn);
      }
      urlWrap.appendChild(urlLbl);
      urlWrap.appendChild(urlRow);
      expandedDiv.appendChild(urlWrap);
    }
    if(!['won','lost'].includes(p.stage)){
      const fuWrap=document.createElement('div');
      fuWrap.style.cssText='position:relative;margin-bottom:12px';
      const defDays=getSettings().defaultFollowUp||3;
      const fuDateDisplay=p.followUpAt?`<span style="font-size:10px;color:var(--muted);margin-left:6px">${fmtDate(p.followUpAt)}</span>`:'';
      fuWrap.innerHTML=`
        <div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">Follow-up${fuDateDisplay}</div>
        <div style="display:flex;gap:0">
          <button class="btn btn-ghost btn-xs" style="border-radius:6px 0 0 6px;flex:1;justify-content:center"
            onclick="event.stopPropagation();setProspectFollowUp('${p.id}',${defDays})">
            In ${defDays} Tag${defDays===1?'':'en'}
          </button>
          <button class="btn btn-ghost btn-xs" style="border-radius:0 6px 6px 0;border-left:1px solid var(--border);padding:0 8px"
            onclick="event.stopPropagation();const dd=document.getElementById('fu-dd-${p.id}');dd.style.display=dd.style.display==='block'?'none':'block'">▾</button>
        </div>
        <div id="fu-dd-${p.id}" style="display:none;position:absolute;top:100%;left:0;z-index:50;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:4px;min-width:140px;box-shadow:0 4px 16px rgba(0,0,0,.4)">
          ${[1,2,3,4,5,7,14].map(d=>`<div style="padding:7px 12px;font-size:13px;cursor:pointer;border-radius:5px;color:var(--text)"
            onclick="event.stopPropagation();setProspectFollowUp('${p.id}',${d});document.getElementById('fu-dd-${p.id}').style.display='none'"
            onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background=''">${d} Tag${d===1?'':'e'}</div>`).join('')}
        </div>`;
      expandedDiv.appendChild(fuWrap);
    }
    const moveRow=document.createElement('div');
    moveRow.className='pr-move-row';
    const moveLbl=document.createElement('span');
    moveLbl.className='pr-move-lbl';moveLbl.textContent='Verschieben:';
    const moveSelect=document.createElement('select');
    moveSelect.className='pr-move-select';
    moveSelect.innerHTML='<option value="">Phase wählen…</option>'+
      STAGE_ORDER.filter(s=>s!==p.stage).map(s=>`<option value="${s}">${STAGE_LABELS[s]}</option>`).join('');
    moveSelect.onchange=function(){if(this.value){moveProspect(p.id,this.value);}};
    if(!['unqualified','lost'].includes(p.stage)){
      const unqBtn=document.createElement('button');
      unqBtn.className='btn btn-ghost btn-xs';
      unqBtn.style.cssText='color:var(--muted);flex-shrink:0';
      unqBtn.textContent='Nicht qual.';
      unqBtn.onclick=function(e){e.stopPropagation();moveProspect(p.id,'unqualified');};
      moveRow.appendChild(unqBtn);
    }
    const delBtn=document.createElement('button');
    delBtn.className='btn btn-danger btn-xs';
    delBtn.textContent='Löschen';
    delBtn.onclick=function(e){e.stopPropagation();deleteProspect(p.id);};
    moveRow.appendChild(moveLbl);
    moveRow.appendChild(moveSelect);
    moveRow.appendChild(delBtn);
    expandedDiv.appendChild(moveRow);
    row.appendChild(expandedDiv);
    listEl.appendChild(row);
  });
}

function toggleExpand(id){
  expandedId=expandedId===id?null:id;
  renderPipeline();
}

function toggleAddForm(){
  const f=document.getElementById('add-form');
  const isHidden=f.style.display==='none';
  f.style.display=isHidden?'block':'none';
  if(isHidden)document.getElementById('ap-name').focus();
}

function shareAccountability(){
  const prospects=getProspects(),days=getDays(),today=todayStr();
  const sent=(days[today]||[]).length;
  const m=getMission(),streak=computeStreak();
  const fuDue=prospects.filter(p=>isFollowupDue(p)).length;
  const loomDue=prospects.filter(p=>p.stage==='loom').length;
  const streakLine=streak.count>0?`Tag ${streak.count} in Folge 🔥`:'Neuer Start';
  const d=new Date().toLocaleDateString('de');
  const summary=`📊 First Client Machine — ${d}
${streakLine}
Heute: ${sent}/${m.dailyTarget||20} DMs${sent>=(m.dailyTarget||20)?' ✅':''}
Pipeline: ${prospects.length} Prospects${fuDue?' · '+fuDue+' Follow-up fällig':''}${loomDue?' · '+loomDue+' Loom ausstehend':''}`;
  navigator.clipboard.writeText(summary).catch(()=>{const ta=document.createElement('textarea');ta.value=summary;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);});
  const el=document.getElementById('acc-ok');el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2500);
}

function incrementMsgCount(id){
  const prospects=getProspects();
  const p=prospects.find(x=>x.id===id);
  if(!p)return;
  p.msgCount=(p.msgCount||0)+1;
  if(!['won','lost'].includes(p.stage)){
    const fu=new Date();fu.setDate(fu.getDate()+3);
    p.followUpAt=fu.toISOString().split('T')[0];
  }
  saveProspects(prospects);
  const btn=document.querySelector('#pr-'+id+' .msg-btn');
  if(btn){btn.textContent='💬 '+p.msgCount;btn.className='msg-btn has-msgs';}
  showXPToast('⏰ +3 Tage','💬','Follow-up verschoben');
}

function addProspectLink(id){
  const input=document.getElementById('soc-input-'+id);if(!input)return;
  const url=input.value.trim();
  if(!url||!url.startsWith('http')){input.focus();return;}
  const prospects=getProspects();const p=prospects.find(x=>x.id===id);if(!p)return;
  if(!p.links)p.links=[];
  p.links.push(url);saveProspects(prospects);
  expandedId=id;renderPipeline();
}

function removeProspectLink(id,idx){
  const prospects=getProspects();const p=prospects.find(x=>x.id===id);if(!p||!p.links)return;
  p.links.splice(idx,1);saveProspects(prospects);
  expandedId=id;renderPipeline();
}

// ── TEMPLATES ─────────────────────────────────────────────────────────────────
let activeDMCategory='all';
function setDMCategory(cat){
  activeDMCategory=cat;
  document.querySelectorAll('#dm-cat-filter .sf-pill').forEach(btn=>btn.classList.toggle('active',btn.dataset.cat===cat));
  renderTemplates();updateDMPreview();
}

function resetTemplates(){
  if(!confirm('Alle Templates zurücksetzen? Deine Anpassungen gehen verloren.'))return;
  save(SK.templates,null);renderTemplates();updateDMPreview();
}

function getTemplates(){
  const t=load(SK.templates,null);
  if(t&&t.length)return t;
  return[
    {id:'t1',label:'Kalt IG — Direkt',category:'Kalt-Outreach IG',text:'Hey {name}, dein Profil ist mir aufgefallen — ich helfe Coaches dabei, ihren Instagram-Auftritt so aufzubauen, dass er aktiv Kunden bringt, ohne dass sie ständig selbst posten müssen. Ist das gerade ein Thema für dich?'},
    {id:'t2',label:'Kalt IG — Profil gesehen',category:'Kalt-Outreach IG',text:'Hey {name}, ich hab mir dein Profil angeschaut und fand deinen Content wirklich stark. Ich spezialisiere mich darauf, den Instagram-Kanal von Coaches komplett zu übernehmen — Content, Strategie, Posting. Alles. Du konzentrierst dich auf deine Klienten. Wäre das interessant für dich?'},
    {id:'t3',label:'Kalt LinkedIn — Kurz',category:'Kalt-Outreach LinkedIn',text:'Hi {name}, deine Arbeit hat mich angesprochen. Ich helfe Coaches und Beratern, ihren Instagram-Auftritt professionell aufzustellen — done for you. Du lieferst Material, ich übernehme den Rest. Wäre das ein Gespräch wert?'},
    {id:'t4',label:'Kalt LinkedIn — Problem',category:'Kalt-Outreach LinkedIn',text:'Hi {name}, ich arbeite mit Coaches zusammen, die wissen, dass sie auf Instagram mehr Kunden gewinnen könnten — aber die Zeit oder das Know-how fehlt. Ich übernehme das komplett. Darf ich dir kurz zeigen, wie das aussieht?'},
    {id:'t5',label:'Follow-up Tag 3',category:'Follow-up',text:'Hey {name}, ich wollte kurz nachhaken — hast du meine Nachricht von Anfang der Woche gesehen? Kein Druck, ich frag nur kurz nach.'},
    {id:'t6',label:'Follow-up sanft',category:'Follow-up',text:'Hey {name}, manchmal geht eine Nachricht im Alltag unter. Falls mein Angebot noch aktuell ist — ich bin nach wie vor offen für ein kurzes Gespräch.'},
    {id:'t7',label:'Loom ankündigen',category:'Loom Ankündigung',text:'Hey {name}, ich hab mir kurz die Zeit genommen und dir ein 3-Minuten-Video zu deinem Profil aufgenommen — konkrete Punkte, die ich sofort ändern würde. Darf ich dir den Link schicken?'},
    {id:'t8',label:'Loom-Link senden',category:'Loom Ankündigung',text:'Hey {name}, das Video ist fertig. Ich hab drei konkrete Dinge gesehen, die du sofort auf deinem Profil ändern könntest. Hier ist der Link: [LOOM LINK] — freu mich auf dein Feedback.'},
    {id:'t9',label:'Voice Message',category:'Voice Message',text:'Hey {name}, ich schick dir gleich eine kurze Sprachnachricht — geht um deinen Instagram-Auftritt und eine Idee, die ich für dich habe. Einfach kurz anhören 👂'},
    {id:'t10',label:'Holistic — Purpose',category:'Holistic / Spirituell',text:'Hey {name}, deine Arbeit hat etwas — man spürt, dass du etwas Bedeutungsvolles aufbaust. Ich helfe Menschen wie dir, diese Energie auch nach außen sichtbar zu machen, damit die richtigen Menschen dich finden können. Darf ich dir kurz zeigen, was ich meine?'},
    {id:'t11',label:'Holistic — Alignment',category:'Holistic / Spirituell',text:'Hey {name}, ich arbeite mit Coaches zusammen, die nicht nur Geld verdienen wollen, sondern wirklich in Übereinstimmung mit ihrem Angebot auftreten möchten. Instagram kann das sein — oder es kann sich falsch anfühlen. Ich helfe dir, den Unterschied zu machen. Interesse?'},
    {id:'t12',label:'Podcast Host',category:'Podcast / Creator',text:'Hey {name}, ich höre deinen Podcast — du hast eine Klarheit in der Art, wie du sprichst, die wirklich anziehend ist. Ich helfe Creators dabei, dieses Vertrauen auch auf Instagram zu nutzen, um darüber Kunden zu gewinnen. Wäre das relevant für dich?'},
    {id:'t13',label:'Creator / Content',category:'Podcast / Creator',text:'Hey {name}, dein Content zeigt, dass du wirklich Ahnung hast. Ich helfe Coaches und Creators, dieses Wissen in ein stabiles Instagram-System umzuwandeln — ohne dass du jeden Tag selbst posten musst. Soll ich dir kurz zeigen wie?'}
  ];
}

function renderTemplates(){
  const allTemplates=getTemplates();
  const filtered=activeDMCategory==='all'?allTemplates:allTemplates.filter(t=>t.category===activeDMCategory);
  const pickEl=document.getElementById('dm-pick');
  const prevVal=pickEl.value;
  pickEl.innerHTML='<option value="">Wählen…</option>';
  filtered.forEach(t=>{
    const opt=document.createElement('option');
    opt.value=t.id;opt.textContent=t.label||t.category;
    pickEl.appendChild(opt);
  });
  if(prevVal&&filtered.find(t=>t.id===prevVal))pickEl.value=prevVal;
  const listEl=document.getElementById('template-list');
  listEl.innerHTML='';
  if(!filtered.length){listEl.innerHTML='<div class="empty-state">Keine Templates in dieser Kategorie.</div>';return;}
  filtered.forEach(t=>{
    const card=document.createElement('div');card.className='tpl-card';
    const labelRow=document.createElement('div');labelRow.className='tpl-label-row';
    const labelInput=document.createElement('input');
    labelInput.className='tpl-label-input';labelInput.type='text';
    labelInput.value=t.label;labelInput.placeholder='Template-Name';
    labelInput.addEventListener('blur',function(){
      const ts=getTemplates(),found=ts.find(x=>x.id===t.id);
      if(found){found.label=this.value.trim()||'Template';save(SK.templates,ts);renderTemplates();}
    });
    const catBadge=document.createElement('span');
    catBadge.className='tpl-cat-badge';catBadge.textContent=t.category||'';
    const delBtn=document.createElement('button');
    delBtn.className='btn btn-ghost btn-xs';delBtn.textContent='✕';
    delBtn.addEventListener('click',function(){
      if(!confirm('Template löschen?'))return;
      save(SK.templates,getTemplates().filter(x=>x.id!==t.id));
      renderTemplates();updateDMPreview();
    });
    labelRow.appendChild(labelInput);labelRow.appendChild(catBadge);labelRow.appendChild(delBtn);
    const ta=document.createElement('textarea');
    ta.className='tpl-textarea';
    ta.placeholder='Deine Nachricht — benutze {name} für den Vornamen';
    ta.value=t.text;
    ta.addEventListener('blur',function(){
      const ts=getTemplates(),found=ts.find(x=>x.id===t.id);
      if(found){found.text=this.value;save(SK.templates,ts);updateDMPreview();}
    });
    card.appendChild(labelRow);card.appendChild(ta);listEl.appendChild(card);
  });
}

function addTemplate(){
  const ts=getTemplates();
  const cat=activeDMCategory==='all'?'Kalt-Outreach IG':activeDMCategory;
  ts.push({id:'t'+Date.now(),label:'Neues Template',category:cat,text:'{name}, '});
  save(SK.templates,ts);
  renderTemplates();
  setTimeout(()=>{const l=document.getElementById('template-list');if(l)l.lastElementChild&&l.lastElementChild.scrollIntoView({behavior:'smooth',block:'nearest'});},100);
}

function updateDMPreview(){
  const pickEl=document.getElementById('dm-pick');
  const name=document.getElementById('dm-name').value.trim();
  const prevEl=document.getElementById('dm-preview');
  const tid=pickEl.value;
  if(!tid){prevEl.textContent='Wähle ein Template und gib einen Namen ein.';prevEl.className='dm-preview-box empty';return;}
  const t=getTemplates().find(x=>x.id===tid);
  if(!t){prevEl.textContent='Template nicht gefunden.';prevEl.className='dm-preview-box empty';return;}
  const text=name?t.text.replace(/\{name\}/g,name):t.text;
  prevEl.textContent=text;
  prevEl.className='dm-preview-box';
}

function copyDM(){
  const prevEl=document.getElementById('dm-preview');
  if(prevEl.classList.contains('empty'))return;
  const text=prevEl.textContent;
  navigator.clipboard.writeText(text).catch(()=>{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);});
  const el=document.getElementById('dm-ok');el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2000);
}

function dmToPipeline(){
  const name=document.getElementById('dm-name').value.trim();
  switchTab('outreach');
  setTimeout(()=>{
    switchSubNav('pipeline');
    document.getElementById('add-form').style.display='block';
    if(name)document.getElementById('ap-name').value=name;
    setTimeout(()=>document.getElementById('ap-name').focus(),50);
  },50);
}

// ── ACCORDION ─────────────────────────────────────────────────────────────────
function toggleAcc(trigger){
  const content=trigger.nextElementSibling,isOpen=content.classList.contains('open');
  document.querySelectorAll('.acc-content').forEach(el=>el.classList.remove('open'));
  document.querySelectorAll('.acc-trigger').forEach(el=>el.classList.remove('open'));
  if(!isOpen){content.classList.add('open');trigger.classList.add('open');}
}

// ── MINDSET ───────────────────────────────────────────────────────────────────
const CARDS=[
  {id:0,text:"Du hast deinen Job gekündigt. Du hast deine Wohnung aufgegeben. Du bist nach Spanien gezogen. Eine DM zu schicken ist nicht der schwere Teil."},
  {id:1,text:"Rejection from a stranger online has zero real weight. You will not remember their name in 6 months. Do it anyway."},
  {id:2,text:"Jeder Tag ohne Outreach ist ein Tag, an dem ein anderer Agency Owner den Client bekommt, der eigentlich deine Freiheit hätte finanzieren sollen."},
  {id:3,text:"Du wartest nicht darauf, bereit zu sein. Du hast jetzt ein System. Es gibt keinen Grund mehr."},
  {id:4,text:"The version of you who built this system already made the decision. You're just executing it."},
  {id:5,text:"Kein Client kommt, weil du einen guten Plan hast. Clients kommen, weil du ihnen geschrieben hast."},
  {id:6,text:"Making yourself smaller to avoid rejection is a trade: short-term comfort for long-term stuck. You know how that trade ends."}
];
let msState={seq:[],idx:0};

function buildSeq(){
  const starred=load(SK.starred,[]);
  const weighted=[...CARDS,...CARDS.filter(c=>starred.includes(c.id))];
  for(let i=weighted.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[weighted[i],weighted[j]]=[weighted[j],weighted[i]];}
  const seen=new Set(),seq=[];
  for(const c of weighted){if(!seen.has(c.id)&&seq.length<3){seen.add(c.id);seq.push(c);}}
  if(seq.length<3){for(const c of CARDS){if(!seen.has(c.id)&&seq.length<3){seen.add(c.id);seq.push(c);}}}
  return seq;
}

function startMindset(){
  msState={seq:buildSeq(),idx:0};
  document.getElementById('ms-start').style.display='none';
  document.getElementById('ms-done').classList.remove('visible');
  document.getElementById('ms-cards').style.display='block';
  const dotsEl=document.getElementById('ms-dots');dotsEl.innerHTML='';
  msState.seq.forEach((_,i)=>{const d=document.createElement('div');d.className='ms-dot'+(i===0?' active':'');d.id='msd-'+i;dotsEl.appendChild(d);});
  showCard(0);
}

function showCard(idx){
  const card=msState.seq[idx],starred=load(SK.starred,[]);
  document.getElementById('ms-num').textContent=`${idx+1} von ${msState.seq.length}`;
  document.getElementById('ms-text').textContent=card.text;
  const sb=document.getElementById('star-btn');
  if(starred.includes(card.id)){sb.classList.add('starred');sb.textContent='★ Markiert';}
  else{sb.classList.remove('starred');sb.textContent='★ Trifft zu';}
  msState.seq.forEach((_,i)=>{const d=document.getElementById('msd-'+i);if(d)d.className='ms-dot'+(i<idx?' done':'')+(i===idx?' active':'');});
}

function starCard(){
  const card=msState.seq[msState.idx],starred=load(SK.starred,[]),sb=document.getElementById('star-btn');
  if(starred.includes(card.id)){save(SK.starred,starred.filter(id=>id!==card.id));sb.classList.remove('starred');sb.textContent='★ Trifft zu';}
  else{starred.push(card.id);save(SK.starred,starred);sb.classList.add('starred');sb.textContent='★ Markiert';}
  renderStarred();
}

function nextCard(){
  const next=msState.idx+1;
  if(next>=msState.seq.length){document.getElementById('ms-cards').style.display='none';document.getElementById('ms-done').classList.add('visible');}
  else{msState.idx=next;showCard(next);}
}

function resetMindset(){
  msState={seq:[],idx:0};
  document.getElementById('ms-start').style.display='block';
  document.getElementById('ms-cards').style.display='none';
  document.getElementById('ms-done').classList.remove('visible');
}

function renderStarred(){
  const starred=load(SK.starred,[]),el=document.getElementById('starred-list');
  const cards=CARDS.filter(c=>starred.includes(c.id));
  if(!cards.length){el.innerHTML='<div class="empty-state">Noch keine markiert. Nutze "Trifft zu" während der Sequenz.</div>';return;}
  el.innerHTML='';
  cards.forEach((c,i)=>{
    const d=document.createElement('div');
    d.style.cssText=`padding:12px 0;border-bottom:${i<cards.length-1?'1px solid var(--border)':'none'};font-size:13px;color:var(--secondary);line-height:1.6`;
    d.textContent=c.text;
    el.appendChild(d);
  });
}

// ── WEEKLY REVIEW ─────────────────────────────────────────────────────────────
function getWeekSent(){
  const days=getDays(),today=new Date(),dow=today.getDay();
  const mon=new Date(today);mon.setDate(today.getDate()-(dow===0?6:dow-1));mon.setHours(0,0,0,0);
  let total=0;
  for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(mon.getDate()+i);total+=(days[d.toISOString().split('T')[0]]||[]).length;}
  return total;
}

function updateWeekStats(){
  const weekSent=getWeekSent();
  const streak=computeStreak();
  const totalDMs=Object.values(getDays()).reduce((sum,arr)=>sum+(arr||[]).length,0);
  document.getElementById('week-sent').textContent=weekSent;
  document.getElementById('week-streak').textContent=streak.count;
  const totalEl=document.getElementById('week-total-dms');
  if(totalEl)totalEl.textContent=totalDMs;
  const rateEl=document.getElementById('week-reply-rate');
  if(rateEl){
    const reviews=load(SK.reviews,[]);
    if(reviews.length&&reviews[0].sent>0){
      const last=reviews[0];
      const rate=Math.round((last.replies/last.sent)*100);
      rateEl.textContent=rate+'%';
      rateEl.style.color=rate>=5?'var(--green)':rate>=2?'var(--amber)':'var(--red)';
    } else {
      rateEl.textContent='—';
      rateEl.style.color='var(--muted)';
    }
  }
  renderPipelineSnap();
}

function saveReview(btn){
  const avoid=document.getElementById('r-avoid').value.trim();
  if(!avoid){alert('Bitte die Vermeidungs-Frage beantworten. Das ist der wichtigste Teil.');document.getElementById('r-avoid').focus();return;}
  const sent=getWeekSent();
  const replies=parseInt(document.getElementById('r-replies').value)||0;
  const calls=parseInt(document.getElementById('r-calls').value)||0;
  const outcomes=document.getElementById('r-outcomes').value.trim();
  const wins=(document.getElementById('r-wins')?.value||'').trim();
  const review={date:todayStr(),sent,replies,calls,outcomes,wins,avoid,ts:Date.now()};
  const reviews=load(SK.reviews,[]);reviews.unshift(review);save(SK.reviews,reviews);
  showProjection(sent,replies,calls);
  renderPastReviews();
  ['r-replies','r-calls','r-outcomes','r-wins','r-avoid'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const orig=btn.textContent;btn.textContent='✓ Gespeichert';btn.style.background='var(--green)';
  setTimeout(()=>{btn.textContent=orig;btn.style.background='';},2000);
  awardXP(25);
  setTimeout(checkAutoAchievements,50);
}

function showProjection(sent,replies,calls){
  const card=document.getElementById('proj-card');card.style.display='block';
  const el=document.getElementById('proj-text');
  if(sent===0){el.textContent='Keine Nachrichten diese Woche. Wenn nichts gesendet wird, kommt nichts zurück. Nächste Woche anders.';return;}
  const rRate=((replies/sent)*100).toFixed(0);
  const cRate=replies>0?((calls/replies)*100).toFixed(0):0;
  const projMonth=(calls*0.25*4.3);
  let text=`Diese Woche: ${sent} Nachrichten → ${replies} Antworten (${rRate}%) → ${calls} Calls (${cRate}% der Antworten).\n\n`;
  if(projMonth>=1){text+=`Hochrechnung: Bei dieser Rate → ~${projMonth.toFixed(1)} Clients/Monat.`;}
  else if(sent>=5){const need=Math.ceil(1/Math.max(replies/sent,.01)/Math.max(calls/Math.max(replies,1),.01)/0.25);text+=`Du brauchst ~${need} Nachrichten/Woche für 1 Client/Monat. Aktuell: ${sent}/Woche. Die Lücke ist das Ziel.`;}
  else{text+='Noch zu wenig Daten. Ziel: mindestens 20 Nachrichten/Woche.';}
  el.textContent=text;
}

function renderPipelineSnap(){
  const el=document.getElementById('rev-pipeline-snap');if(!el)return;
  const prospects=getProspects();
  if(!prospects.length){el.innerHTML='<div style="font-size:13px;color:var(--muted);padding:4px 0">Noch keine Prospects.</div>';return;}
  const stages=[
    {key:'dm_sent',label:'DM Gesendet',color:'var(--accent)'},
    {key:'followup',label:'Follow-up',color:'var(--amber)'},
    {key:'loom',label:'Loom offen',color:'var(--purple)'},
    {key:'loom_sent',label:'Loom Gesendet',color:'var(--teal)'},
    {key:'call_booked',label:'Call gebucht',color:'var(--green)'},
    {key:'won',label:'Gewonnen',color:'var(--won)'},
    {key:'lost',label:'Lost',color:'var(--muted)'},
  ];
  const rows=stages.map(s=>{
    const count=prospects.filter(p=>p.stage===s.key).length;
    if(!count)return '';
    return`<div class="snap-row"><span style="color:${s.color};font-weight:500">${s.label}</span><span class="snap-count" style="color:${s.color}">${count}</span></div>`;
  }).join('');
  el.innerHTML=rows||'<div style="font-size:13px;color:var(--muted)">Keine aktiven Prospects.</div>';
}

function renderPastReviews(){
  const reviews=load(SK.reviews,[]),el=document.getElementById('past-reviews');
  if(!reviews.length){el.innerHTML='';return;}
  let html='<div class="card"><div class="card-label">Vergangene Reviews</div>';
  reviews.slice(0,6).forEach((r,i)=>{
    const d=new Date(r.ts).toLocaleDateString('de',{day:'2-digit',month:'2-digit',year:'numeric'});
    const replyRate=r.sent>0?Math.round((r.replies/r.sent)*100):0;
    const badgeCls=replyRate>=5?'rev-badge-good':replyRate>=1?'rev-badge-ok':'rev-badge-low';
    const badgeLabel=r.sent>0?replyRate+'% Reply':'0 DMs';
    const border=i<Math.min(reviews.length,6)-1?'border-bottom:1px solid var(--border)':'';
    html+=`<div class="rev-past-item" style="${border}">
      <div class="rev-past-meta">
        <span style="font-size:13px;font-weight:600">${d}</span>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span style="font-size:12px;color:var(--muted)">${r.sent} DMs · ${r.replies} Antworten · ${r.calls} Calls</span>
          <span class="rev-badge ${badgeCls}">${badgeLabel}</span>
        </div>
      </div>
      ${r.wins?`<div class="rev-wins-text">✓ ${esc(r.wins)}</div>`:''}
      ${r.avoid?`<div style="font-size:12px;color:var(--muted);font-style:italic;margin-top:4px">"${esc(r.avoid)}"</div>`:''}
    </div>`;
  });
  html+='</div>';el.innerHTML=html;
}

// ── START TAB ─────────────────────────────────────────────────────────────────
function getNonNeg(){
  const all=load(SK.nonneg,{});
  return all[todayStr()]||{workout:false,meditation:false};
}

function getNNStreak(){return load(SK.nnStreak,{current:0,best:0,lastDate:null});}
function updateNNStreak(){
  const s=getNNStreak();
  const today=todayStr();
  if(s.lastDate===today)return s;
  s.current=s.lastDate===yesterdayStr()?s.current+1:1;
  s.best=Math.max(s.best,s.current);
  s.lastDate=today;
  save(SK.nnStreak,s);
  return s;
}

function saveNonNeg(key,val){
  const all=load(SK.nonneg,{});
  const today=todayStr();
  if(!all[today])all[today]={workout:false,meditation:false,bonusGiven:false};
  const wasDone=!!all[today][key];
  all[today][key]=val;
  if(val&&!wasDone){
    save(SK.nonneg,all);
    awardXP(15);
    showXPToast('+15 XP','✅',key==='workout'?'Workout done!':'Meditation done!');
  } else if(!val&&wasDone){
    save(SK.nonneg,all);
  } else {
    save(SK.nonneg,all);
  }
  if(val&&all[today].workout&&all[today].meditation&&!all[today].bonusGiven){
    all[today].bonusGiven=true;
    save(SK.nonneg,all);
    const s=updateNNStreak();
    awardXP(10);
    const bonus={3:20,7:50,14:100,30:200};
    if(bonus[s.current]){
      awardXP(bonus[s.current]);
      showXPToast('+'+bonus[s.current]+' XP','🔥',s.current+'-Tage Streak!');
    }
    const daysSent=getDays();
    const m=getMission();
    const sent=(daysSent[today]||[]).length;
    if(sent>=(m.dailyTarget||20)){
      const pd=load(SK.perfectDays,{dates:[]});
      if(!pd.dates.includes(today)){
        pd.dates.push(today);save(SK.perfectDays,pd);
        awardXP(30);showXPToast('+30 XP','⭐','Perfekter Tag!');
      }
    }
    setTimeout(checkAutoAchievements,50);
  }
  renderStart();
}

function getNNLabels(){
  return load(SK.nnLabels,{workout:'Workout (kein Handy)',meditation:'Meditation'});
}

function editNNLabel(key){
  const span=document.getElementById('nn-label-'+key);
  if(!span||span.tagName==='INPUT')return;
  const labels=getNNLabels();
  const current=labels[key]||(key==='workout'?'Workout (kein Handy)':'Meditation');
  const inp=document.createElement('input');
  inp.type='text';
  inp.value=current;
  inp.style.cssText='background:var(--surface2);border:1px solid var(--accent);border-radius:6px;color:var(--text);font-family:inherit;font-size:14px;padding:3px 8px;outline:none;width:180px;max-width:100%';
  span.replaceWith(inp);
  inp.focus();inp.select();
  const commit=()=>{
    const val=inp.value.trim()||current;
    const l=getNNLabels();l[key]=val;save(SK.nnLabels,l);
    const newSpan=document.createElement('span');
    newSpan.className='nn-label-text';newSpan.id='nn-label-'+key;newSpan.textContent=val;
    inp.replaceWith(newSpan);
  };
  inp.addEventListener('blur',commit);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')inp.blur();if(e.key==='Escape'){inp.value=current;inp.blur();}});
}

function renderStart(){
  const m=getMission();
  const days=getDays();
  const today=todayStr();
  const sent=(days[today]||[]).length;
  const target=m.dailyTarget||20;
  const isSunday=new Date().getDay()===0;
  const outreachDone=isSunday||sent>=target;
  const nn=getNonNeg();

  const labels=getNNLabels();
  const wLbl=document.getElementById('nn-label-workout');
  if(wLbl&&wLbl.tagName==='SPAN')wLbl.textContent=labels.workout||'Workout (kein Handy)';
  const mLbl=document.getElementById('nn-label-meditation');
  if(mLbl&&mLbl.tagName==='SPAN')mLbl.textContent=labels.meditation||'Meditation';

  const wEl=document.getElementById('nn-workout');
  if(wEl){wEl.checked=!!nn.workout;document.getElementById('nn-item-workout').classList.toggle('done',!!nn.workout);}

  const mEl=document.getElementById('nn-meditation');
  if(mEl){mEl.checked=!!nn.meditation;document.getElementById('nn-item-meditation').classList.toggle('done',!!nn.meditation);}

  const nnSEl=document.getElementById('nn-streak-badge');
  if(nnSEl){
    const s=getNNStreak();
    if(s.current>0){nnSEl.textContent='🔥 '+s.current+'-Tage Streak';nnSEl.style.color='var(--amber)';}
    else{nnSEl.textContent=s.best>0?'Bester: '+s.best+' Tage':'';nnSEl.style.color='var(--muted)';}
    if(s.best>s.current&&s.best>0)nnSEl.title='Bester: '+s.best+' Tage';
  }

  if(!!nn.meditation){
    const sb=document.getElementById('btn-breathing-start');
    if(sb&&!sb.classList.contains('btn-done')){sb.disabled=true;sb.classList.add('btn-done');sb.textContent='✓ Erledigt';}
  }

  const fillEl=document.getElementById('nn-prog-fill');
  const progText=document.getElementById('nn-prog-text');
  const outreachItem=document.getElementById('nn-item-outreach');
  if(isSunday){
    if(fillEl){fillEl.style.width='100%';fillEl.className='nn-prog-fill done';}
    if(progText)progText.textContent='Ruhetag';
    if(outreachItem)outreachItem.classList.add('done');
  } else {
    const pct=Math.min(100,(sent/target)*100);
    if(fillEl){fillEl.style.width=pct+'%';fillEl.className='nn-prog-fill'+(outreachDone?' done':'');}
    if(progText)progText.textContent=sent+' / '+target;
    if(outreachItem)outreachItem.classList.toggle('done',outreachDone);
  }

  const bannerEl=document.getElementById('start-banner');
  if(bannerEl){
    if(isSunday){
      bannerEl.textContent='Sonntag = Ruhetag. Kein Outreach. Reflektiere, plane, lade auf.';
      bannerEl.className='start-banner start-banner-done';
    } else if(outreachDone){
      bannerEl.textContent='✓ Du hast dir den Rest verdient. Öffne jetzt ClickUp.';
      bannerEl.className='start-banner start-banner-done';
    } else {
      bannerEl.textContent=sent+'/'+target+' DMs — Kein ClickUp. Kein Content. Outreach zuerst.';
      bannerEl.className='start-banner start-banner-notdone';
    }
  }

  const outreachBtn=document.getElementById('outreach-btn');
  if(outreachBtn)outreachBtn.textContent=outreachDone?'Pipeline anzeigen →':'Jetzt Outreach starten →';

  const cuBtn=document.getElementById('clickup-btn');
  if(cuBtn){
    if(outreachDone){cuBtn.className='btn btn-ghost btn-full unlocked';}
    else{cuBtn.className='btn btn-ghost btn-full locked';}
  }

}

function openClickUp(){
  window.open('https://app.clickup.com','_blank');
}

function quickMove(id,newStage){
  if(!newStage)return;
  moveProspect(id,newStage);
  renderStart();
  updateNavDots();
}

function editGoalFromZiele(){
  switchTab('outreach');
  setTimeout(()=>{
    switchSubNav('pipeline');
    const e=document.getElementById('mission-edit');if(e&&e.style.display==='none')toggleMissionEdit();
  },50);
}

// ── ZIELE TAB ─────────────────────────────────────────────────────────────────
function getMilestones(){
  const defaults=[
    // ── EARLY GAME ───────────────────────────────────────────────────────────────
    {id:'ms_dm1',   text:'First Blood',        xp:5,  icon:'🩸',autoKey:'dm1',    rarity:'common',   flavor:'Erster DM je gesendet',       system:true,done:false,doneDate:null},
    {id:'ms_dm5d',  text:'Warming Up',         xp:10, icon:'🔥',autoKey:'dm5day', rarity:'common',   flavor:'5 DMs an einem Tag',           system:true,done:false,doneDate:null},
    {id:'ms_dm10',  text:'Double Digits',      xp:20, icon:'🔢',autoKey:'dm10',   rarity:'common',   flavor:'10 DMs insgesamt',             system:true,done:false,doneDate:null},
    {id:'ms_dm20d', text:'Tagesquote',         xp:30, icon:'✅',autoKey:'dm20day',rarity:'common',   flavor:'20 DMs an einem Tag',          system:true,done:false,doneDate:null},
    // ── VOLUME ───────────────────────────────────────────────────────────────────
    {id:'ms1',      text:'Fifty',              xp:50, icon:'📨',autoKey:'dm50',   rarity:'common',   flavor:'50 DMs insgesamt',             system:true,done:false,doneDate:null},
    {id:'ms2',      text:'Century',            xp:75, icon:'🚀',autoKey:'dm100',  rarity:'common',   flavor:'100 DMs insgesamt',            system:true,done:false,doneDate:null},
    {id:'ms_dm250', text:'Quarter Thousand',   xp:150,icon:'💪',autoKey:'dm250',  rarity:'rare',     flavor:'250 DMs insgesamt',            system:true,done:false,doneDate:null},
    {id:'ms_dm500', text:'Five Hundred',       xp:250,icon:'🌟',autoKey:'dm500',  rarity:'rare',     flavor:'500 DMs insgesamt',            system:true,done:false,doneDate:null},
    {id:'ms_dm1k',  text:'The Thousand',       xp:500,icon:'👑',autoKey:'dm1000', rarity:'legendary',flavor:'1000 DMs insgesamt',           system:true,done:false,doneDate:null},
    // ── STREAK ───────────────────────────────────────────────────────────────────
    {id:'ms_s3',    text:'Drei Gewinnt',       xp:60, icon:'🔥',autoKey:'streak3',rarity:'common',   flavor:'3 Tage Streak',                system:true,done:false,doneDate:null},
    {id:'ms_s5',    text:'Week Warrior',       xp:120,icon:'⚔️', autoKey:'streak5', rarity:'rare',   flavor:'5 Tage Streak',                system:true,done:false,doneDate:null},
    {id:'ms_s10',   text:'Unbreakable',        xp:250,icon:'🏔️', autoKey:'streak10',rarity:'epic',   flavor:'10 Tage Streak',               system:true,done:false,doneDate:null},
    // ── PIPELINE ─────────────────────────────────────────────────────────────────
    {id:'ms_fu5',   text:'Ghost Buster',       xp:80, icon:'👻',autoKey:'followup5',rarity:'rare',   flavor:'5 Follow-ups gesendet',        system:true,done:false,doneDate:null},
    {id:'ms_loom1', text:'Loom Lord',          xp:150,icon:'🎬',autoKey:'loom1',   rarity:'rare',    flavor:'Erste Loom aufgenommen',       system:true,done:false,doneDate:null},
    {id:'ms3',      text:'On The Radar',       xp:100,icon:'💬',                   rarity:'rare',    flavor:'Erster Reply erhalten',        system:true,done:false,doneDate:null},
    {id:'ms4',      text:'Discovery Call',     xp:150,icon:'📞',                   rarity:'epic',    flavor:'Erster IF Call gebucht',       system:true,done:false,doneDate:null},
    {id:'ms5',      text:'HOW Call Secured',   xp:200,icon:'🎯',                   rarity:'epic',    flavor:'Erster HOW Call gebucht',      system:true,done:false,doneDate:null},
    {id:'ms6',      text:'First Client',       xp:500,icon:'🏆',autoKey:'won1',    rarity:'legendary',flavor:'Erster Kunde gewonnen',       system:true,done:false,doneDate:null},
    // ── DM VOLUME (gaps) ─────────────────────────────────────────────────────
    {id:'ms_dm5',    text:'High Five',           xp:10, icon:'✋',autoKey:'dm5',      rarity:'common',   flavor:'5 DMs insgesamt',                   system:true,done:false,doneDate:null},
    {id:'ms_dm25',   text:'Building Momentum',   xp:35, icon:'📈',autoKey:'dm25',     rarity:'common',   flavor:'25 DMs insgesamt',                  system:true,done:false,doneDate:null},
    {id:'ms_dm200',  text:'200 Club',            xp:200,icon:'💎',autoKey:'dm200',    rarity:'legendary',flavor:'200 DMs insgesamt',                 system:true,done:false,doneDate:null},
    // ── DM VELOCITY ──────────────────────────────────────────────────────────
    {id:'ms_dm10day',text:'Volume Day',          xp:60, icon:'⚡',autoKey:'dm10day',  rarity:'rare',     flavor:'10 DMs an einem Tag',               system:true,done:false,doneDate:null},
    // ── REPLIES (proxy: prospects who reached Follow-up stage) ───────────────
    {id:'ms_reply1', text:'First Signal',        xp:40, icon:'📡',autoKey:'reply1',   rarity:'rare',     flavor:'Erster Reply erhalten',             system:true,done:false,doneDate:null},
    {id:'ms_reply5', text:'Conversation Maker',  xp:80, icon:'📥',autoKey:'reply5',   rarity:'rare',     flavor:'5 Replies erhalten',                system:true,done:false,doneDate:null},
    {id:'ms_reply10',text:'Hot Pipeline',        xp:150,icon:'🗣️',autoKey:'reply10',  rarity:'epic',     flavor:'10 Replies erhalten',               system:true,done:false,doneDate:null},
    // ── PIPELINE SIZE ─────────────────────────────────────────────────────────
    {id:'ms_pipe5',  text:'Pipeline Starter',    xp:60, icon:'🔁',autoKey:'pipe5',    rarity:'common',   flavor:'5 aktive Prospects gleichzeitig',   system:true,done:false,doneDate:null},
    {id:'ms_pipe25', text:'Full Pipeline',       xp:150,icon:'🏗️',autoKey:'pipe25',   rarity:'rare',     flavor:'25 aktive Prospects gleichzeitig',  system:true,done:false,doneDate:null},
    // ── NON-NEG STREAKS ───────────────────────────────────────────────────────
    {id:'ms_nn3',    text:'Routine Starter',     xp:50, icon:'🌱',autoKey:'nn3',      rarity:'common',   flavor:'3 Tage beide Non-Neg erledigt',     system:true,done:false,doneDate:null},
    {id:'ms_nn7',    text:'Week of Discipline',  xp:120,icon:'💪',autoKey:'nn7',      rarity:'rare',     flavor:'7 Tage beide Non-Neg erledigt',     system:true,done:false,doneDate:null},
    {id:'ms_nn14',   text:'Iron Habit',          xp:200,icon:'⛓️',autoKey:'nn14',     rarity:'epic',     flavor:'14 Tage beide Non-Neg erledigt',    system:true,done:false,doneDate:null},
    {id:'ms_nn30',   text:'Unshakeable',         xp:400,icon:'🗿',autoKey:'nn30',     rarity:'legendary',flavor:'30 Tage beide Non-Neg erledigt',    system:true,done:false,doneDate:null},
    // ── RESILIENCE ────────────────────────────────────────────────────────────
    {id:'ms_lost5',  text:'Lessons Learned',     xp:80, icon:'🎓',autoKey:'lost5',    rarity:'rare',     flavor:'5 Prospects auf Lost gesetzt',      system:true,done:false,doneDate:null},
    // ── LONGER STREAKS + REVIEWS ─────────────────────────────────────────────
    {id:'ms_s20',    text:'Three Weeks Strong',  xp:300,icon:'🌊',autoKey:'streak20', rarity:'epic',     flavor:'20 Tage DM-Streak',                 system:true,done:false,doneDate:null},
    {id:'ms_review5',text:'Analyst in Training', xp:80, icon:'📋',autoKey:'review5',  rarity:'common',   flavor:'5 Weekly Reviews gespeichert',      system:true,done:false,doneDate:null},
    // ── LIFE OS ──────────────────────────────────────────────────────────────
    {id:'ms_state1', text:'State Tracker',       xp:20, icon:'📊',autoKey:'state1',   rarity:'common',   flavor:'Erster State geloggt',              system:true,done:false,doneDate:null},
    {id:'ms_state10',text:'Frequency Rising',    xp:80, icon:'📈',autoKey:'state10',  rarity:'rare',     flavor:'10 State-Einträge',                 system:true,done:false,doneDate:null},
    {id:'ms_ritual1',text:'Morning Protocol',    xp:30, icon:'🌅',autoKey:'ritual1',  rarity:'common',   flavor:'Erstes Morgenritual abgeschlossen',  system:true,done:false,doneDate:null},
    {id:'ms_manif1', text:'Manifestor',          xp:100,icon:'📜',autoKey:'manif1',   rarity:'epic',     flavor:'Manifesto-Brief geschrieben',        system:true,done:false,doneDate:null},
    // ── PAPER PROTOCOL ───────────────────────────────────────────────────────────
    {id:'ms_paper1', text:'Paper Protocol',      xp:25, icon:'✍️',autoKey:'paper1',   rarity:'common',   flavor:'Tagesverträge zum ersten Mal auf Papier',system:true,done:false,doneDate:null},
    {id:'ms_paper7', text:'Journal Habit',       xp:100,icon:'📓',autoKey:'paper7',   rarity:'rare',     flavor:'7x auf Papier geschrieben',              system:true,done:false,doneDate:null},
    // ── PERFECT DAY ──────────────────────────────────────────────────────────────
    {id:'ms_perf1',  text:'Perfect Day',         xp:50, icon:'⭐',autoKey:'perfect1', rarity:'rare',     flavor:'Workout + Meditation + Outreach an einem Tag',system:true,done:false,doneDate:null},
    {id:'ms_perf7',  text:'Perfect Week',        xp:200,icon:'🌟',autoKey:'perfect7', rarity:'epic',     flavor:'7 perfekte Tage',                        system:true,done:false,doneDate:null},
    // ── MORNING STREAK ────────────────────────────────────────────────────────────
    {id:'ms_morn3',  text:'Early Bird',          xp:40, icon:'🌅',autoKey:'morning3', rarity:'common',   flavor:'3 Tage Morgenritual in Folge',           system:true,done:false,doneDate:null},
    {id:'ms_morn14', text:'Morning Master',      xp:150,icon:'🔆',autoKey:'morning14',rarity:'epic',     flavor:'14 Tage Morgenritual in Folge',          system:true,done:false,doneDate:null},
    // ── AFFIRMATIONS ──────────────────────────────────────────────────────────────
    {id:'ms_aff1',   text:'I Am',                xp:20, icon:'💬',autoKey:'aff1',     rarity:'common',   flavor:'Erste Affirmation hinzugefügt',          system:true,done:false,doneDate:null},
    {id:'ms_aff10',  text:'Affirmation Master',  xp:80, icon:'✨',autoKey:'aff10',    rarity:'rare',     flavor:'10 Affirmationen hinzugefügt',           system:true,done:false,doneDate:null},
    // ── LEVEL MILESTONES ─────────────────────────────────────────────────────────
    {id:'ms_lv3',    text:'Pipeline Builder',    xp:0,   icon:'🏗️',autoKey:'lv3',      rarity:'rare',     flavor:'Level 3 erreicht',                       system:true,done:false,doneDate:null},
    {id:'ms_lv5',    text:'Closer',              xp:0,   icon:'🎯',autoKey:'lv5',      rarity:'epic',     flavor:'Level 5 erreicht',                       system:true,done:false,doneDate:null},
    {id:'ms_lv7',    text:'Frequency Master',    xp:0,   icon:'⚡',autoKey:'lv7',      rarity:'epic',     flavor:'Level 7 erreicht',                       system:true,done:false,doneDate:null},
    {id:'ms_lv8',    text:'Life Architect',      xp:0,   icon:'🏰',autoKey:'lv8',      rarity:'legendary',flavor:'Level 8 erreicht — das ist Seltenheit',  system:true,done:false,doneDate:null},
    {id:'ms_lv10',   text:'Empire Builder',      xp:0,   icon:'👑',autoKey:'lv10',     rarity:'legendary',flavor:'Level 10 erreicht — Top 1%',             system:true,done:false,doneDate:null},
    // ── EXTRA STATE ────────────────────────────────────────────────────────────
    {id:'ms_state25',text:'State Observer',      xp:100, icon:'🧠',autoKey:'state25',  rarity:'rare',     flavor:'25 State-Einträge',                      system:true,done:false,doneDate:null},
    {id:'ms_state50',text:'Inner Compass',       xp:200, icon:'🧭',autoKey:'state50',  rarity:'epic',     flavor:'50 State-Einträge',                      system:true,done:false,doneDate:null},
    // ── EXTRA STREAKS ──────────────────────────────────────────────────────────
    {id:'ms_s30',    text:'Thirty Days',         xp:500, icon:'🌕',autoKey:'streak30', rarity:'legendary',flavor:'30 Tage DM-Streak — Legende',             system:true,done:false,doneDate:null},
    // ── EXTRA DM ───────────────────────────────────────────────────────────────
    {id:'ms_dm750',  text:'750 Strong',          xp:350, icon:'🦅',autoKey:'dm750',    rarity:'epic',     flavor:'750 DMs insgesamt',                      system:true,done:false,doneDate:null},
    {id:'ms_dm30day',text:'Volume Monster',      xp:100, icon:'🌪️',autoKey:'dm30day',  rarity:'epic',     flavor:'30 DMs an einem Tag',                    system:true,done:false,doneDate:null},
    // ── CLIENTS ────────────────────────────────────────────────────────────────
    {id:'ms_won3',   text:'Agency Mode',         xp:1000,icon:'🏰',autoKey:'won3',     rarity:'legendary',flavor:'3 Kunden gewonnen — Agency läuft',        system:true,done:false,doneDate:null},
    // ── CALLS BOOKED ────────────────────────────────────────────────────────────
    {id:'ms_cb1',    text:'First Call',          xp:150, icon:'📞',autoKey:'cb1',      rarity:'epic',     flavor:'Erster Call gebucht — der Wendepunkt',      system:true,done:false,doneDate:null},
    {id:'ms_cb3',    text:'Deal Flow',           xp:250, icon:'📅',autoKey:'cb3',      rarity:'epic',     flavor:'3 Calls gebucht — das System funktioniert', system:true,done:false,doneDate:null},
    {id:'ms_cb5',    text:'Sales Machine',       xp:400, icon:'⚡',autoKey:'cb5',      rarity:'legendary',flavor:'5 Calls gebucht — du bist im Flow',          system:true,done:false,doneDate:null},
    // ── LOOM ────────────────────────────────────────────────────────────────────
    {id:'ms_loom3',  text:'Video Selling',       xp:100, icon:'📹',autoKey:'loom3',    rarity:'rare',     flavor:'3 Looms versendet',                         system:true,done:false,doneDate:null},
    {id:'ms_loom5',  text:'Loom Machine',        xp:200, icon:'🎬',autoKey:'loom5',    rarity:'epic',     flavor:'5 Looms versendet — du machst es anders',   system:true,done:false,doneDate:null},
    // ── MORNING STREAK ──────────────────────────────────────────────────────────
    {id:'ms_morn7',  text:'Week Protocol',       xp:80,  icon:'☀️',autoKey:'morning7', rarity:'rare',     flavor:'7 Tage Morgenritual in Folge',              system:true,done:false,doneDate:null},
    {id:'ms_morn30', text:'30 Day Protocol',     xp:500, icon:'🌟',autoKey:'morning30',rarity:'legendary',flavor:'30 Tage Morgenritual — du bist anders als die Masse',system:true,done:false,doneDate:null},
    // ── STATE QUALITY ──────────────────────────────────────────────────────────
    {id:'ms_state9', text:'God Mode',            xp:100, icon:'🔥',autoKey:'stateHigh',rarity:'rare',     flavor:'State ≥ 9 zum ersten Mal geloggt',          system:true,done:false,doneDate:null},
    // ── WEEKLY VOLUME ──────────────────────────────────────────────────────────
    {id:'ms_dm100w', text:'Volume Week',         xp:200, icon:'📊',autoKey:'dm100w',   rarity:'epic',     flavor:'100 DMs in einer Woche',                    system:true,done:false,doneDate:null},
    // ── REVIEW HABIT ───────────────────────────────────────────────────────────
    {id:'ms_rev10',  text:'Pattern Recognition', xp:150, icon:'🔍',autoKey:'review10', rarity:'rare',     flavor:'10 Weekly Reviews — du erkennst Muster',    system:true,done:false,doneDate:null},
    // ── EXTREME MILESTONES ─────────────────────────────────────────────────────
    {id:'ms_won5',     text:'Empire Start',         xp:2000,icon:'🏆',autoKey:'won5',      rarity:'legendary',flavor:'5 Kunden — du bist eine Agency',              system:true,done:false,doneDate:null},
    {id:'ms_won10',    text:'Empire',               xp:5000,icon:'👑',autoKey:'won10',     rarity:'legendary',flavor:'10 Kunden — Legende',                          system:true,done:false,doneDate:null},
    {id:'ms_nn50',     text:'Iron Identity',        xp:800, icon:'🪨',autoKey:'nn50',      rarity:'legendary',flavor:'50 Tage Non-Neg in Folge',                     system:true,done:false,doneDate:null},
    {id:'ms_nn100',    text:'Unbreakable Identity', xp:2000,icon:'💎',autoKey:'nn100',     rarity:'legendary',flavor:'100 Tage — du bist neu definiert',              system:true,done:false,doneDate:null},
    {id:'ms_dm2k',     text:'Two Thousand',         xp:1000,icon:'🦁',autoKey:'dm2000',    rarity:'legendary',flavor:'2000 DMs insgesamt',                           system:true,done:false,doneDate:null},
    {id:'ms_dm5k',     text:'Five K',               xp:3000,icon:'🌋',autoKey:'dm5000',    rarity:'legendary',flavor:'5000 DMs — du hast alles gegeben',             system:true,done:false,doneDate:null},
    {id:'ms_morn60',   text:'Two Month Protocol',   xp:1000,icon:'🌞',autoKey:'morning60', rarity:'legendary',flavor:'60 Tage Morgenritual in Folge',                system:true,done:false,doneDate:null},
    {id:'ms_rev25',    text:'Half Year Analyst',    xp:300, icon:'📐',autoKey:'review25',  rarity:'epic',     flavor:'25 Weekly Reviews — halbes Jahr Klarheit',    system:true,done:false,doneDate:null},
    {id:'ms_rev50',    text:'Annual Reviewer',      xp:1000,icon:'🗂️',autoKey:'review50',  rarity:'legendary',flavor:'50 Weekly Reviews — ein volles Jahr',         system:true,done:false,doneDate:null},
    {id:'ms_perf30',   text:'Perfect Month',        xp:1000,icon:'🌟',autoKey:'perfect30', rarity:'legendary',flavor:'30 perfekte Tage',                            system:true,done:false,doneDate:null},
    {id:'ms_pipe50',   text:'Full Arsenal',         xp:300, icon:'🏗️',autoKey:'pipe50',    rarity:'epic',     flavor:'50 aktive Prospects gleichzeitig',            system:true,done:false,doneDate:null},
    {id:'ms_reply25',  text:'Conversation Machine', xp:300, icon:'🗣️',autoKey:'reply25',   rarity:'epic',     flavor:'25 Replies erhalten',                         system:true,done:false,doneDate:null},
    {id:'ms_state100', text:'Inner Compass Master', xp:400, icon:'🧭',autoKey:'state100',  rarity:'epic',     flavor:'100 State-Eintraege — du kennst dich',         system:true,done:false,doneDate:null},
  ];
  const saved=load(SK.milestones,null);
  if(!saved)return defaults;
  const savedMap=Object.fromEntries(saved.map(ms=>[ms.id,ms]));
  return defaults.map(def=>savedMap[def.id]?{...def,...savedMap[def.id]}:def)
    .concat(saved.filter(ms=>!ms.system));
}

function getWeekKey(){
  const d=new Date(),dow=d.getDay();
  const mon=new Date(d);
  mon.setDate(d.getDate()-(dow===0?6:dow-1));
  return mon.toISOString().split('T')[0];
}

function getContentWeek(){
  return load(SK.content,{})[getWeekKey()]||{ig:0,yt:0,li:0};
}

function saveContentWeek(data){
  const all=load(SK.content,{});
  all[getWeekKey()]=data;
  save(SK.content,all);
}

function adjustContent(type,delta){
  const limits={ig:7,yt:1,li:5};
  const w=getContentWeek();
  w[type]=Math.max(0,Math.min(limits[type],(w[type]||0)+delta));
  saveContentWeek(w);
  renderContentGoals();
}

function renderContentGoals(){
  const w=getContentWeek();
  const defs={ig:{id:'cg-ig',bar:'cg-ig-bar',max:7},yt:{id:'cg-yt',bar:'cg-yt-bar',max:1},li:{id:'cg-li',bar:'cg-li-bar',max:5}};
  Object.entries(defs).forEach(([key,def])=>{
    const numEl=document.getElementById(def.id);
    const barEl=document.getElementById(def.bar);
    const val=w[key]||0;
    if(numEl)numEl.textContent=val;
    if(barEl)barEl.style.width=Math.min(100,(val/def.max)*100)+'%';
  });
}

function renderZiele(){
  const m=getMission();
  const mainEl=document.getElementById('zl-main');
  const daysEl=document.getElementById('zl-days');
  if(m.goal){
    mainEl.textContent=m.goal;
    mainEl.className='goal-banner-main';
  } else {
    mainEl.textContent='Setze dein Ziel im Outreach-Tab → ✎';
    mainEl.className='goal-banner-main empty';
  }
  if(m.deadline){
    const today=new Date(todayStr()+'T12:00:00');
    const dl=new Date(m.deadline+'T12:00:00');
    const diff=Math.round((dl-today)/(1000*60*60*24));
    if(diff>0)daysEl.textContent=diff+' Tage verbleiben';
    else if(diff===0)daysEl.textContent='Deadline: heute';
    else daysEl.textContent=Math.abs(diff)+' Tage überschritten';
  } else {
    daysEl.textContent='';
  }
  renderMilestones();
  renderContentGoals();
  renderXPBar();
}

function renderMilestones(targetId){
  const milestones=getMilestones();
  const listEl=document.getElementById(targetId||'milestone-list');
  if(!milestones.length){listEl.innerHTML='<div class="empty-state" style="padding:12px 0">Noch keine Achievements.</div>';return;}

  const days=getDays();
  const today=todayStr();
  const totalDMs=Object.values(days).reduce((sum,arr)=>sum+(arr||[]).length,0);
  const todayDMs=(days[today]||[]).length;
  const streak=computeStreak();
  const prospects=getProspects();
  const followupTotal=prospects.filter(p=>p.history&&p.history.some(h=>h.action==='Follow-up')).length;
  const loomSentTotal=prospects.filter(p=>p.history&&p.history.some(h=>h.action==='Loom Gesendet')).length;
  const wonTotal=prospects.filter(p=>p.stage==='won').length;
  const activePipeline=prospects.filter(p=>!['won','lost'].includes(p.stage)).length;
  const lostTotal=prospects.filter(p=>p.stage==='lost').length;
  const reviewTotal=load(SK.reviews,[]).length;
  const nnCurStreak=load(SK.nnStreak,{current:0}).current;
  const paperRitualData=load(SK.paperRitual,{count:0});
  const paperCount=paperRitualData.count||0;
  const perfectDaysData=load(SK.perfectDays,{dates:[]});
  const perfectCount=(perfectDaysData.dates||[]).length;
  const morningStreakData=load(SK.morningStreak,{current:0});
  const morningStreakCurrent=morningStreakData.current||0;
  const affCount=getAffirmations().length;
  const currentLevel=computeLevel(getXP().total).level;

  const progressFor={
    dm1:{val:totalDMs,max:1},
    dm5:{val:totalDMs,max:5},
    dm5day:{val:todayDMs,max:5},
    dm10:{val:totalDMs,max:10},
    dm20day:{val:todayDMs,max:20},
    dm25:{val:totalDMs,max:25},
    dm50:{val:totalDMs,max:50},
    dm100:{val:totalDMs,max:100},
    dm200:{val:totalDMs,max:200},
    dm250:{val:totalDMs,max:250},
    dm500:{val:totalDMs,max:500},
    dm1000:{val:totalDMs,max:1000},
    dm10day:{val:todayDMs,max:10},
    streak3:{val:streak.count,max:3},
    streak5:{val:streak.count,max:5},
    streak10:{val:streak.count,max:10},
    streak20:{val:streak.count,max:20},
    followup5:{val:followupTotal,max:5},
    loom1:{val:loomSentTotal,max:1},
    won1:{val:wonTotal,max:1},
    reply1:{val:followupTotal,max:1},
    reply5:{val:followupTotal,max:5},
    reply10:{val:followupTotal,max:10},
    pipe5:{val:activePipeline,max:5},
    pipe25:{val:activePipeline,max:25},
    nn3:{val:nnCurStreak,max:3},
    nn7:{val:nnCurStreak,max:7},
    nn14:{val:nnCurStreak,max:14},
    nn30:{val:nnCurStreak,max:30},
    lost5:{val:lostTotal,max:5},
    review5:{val:reviewTotal,max:5},
    state1:{val:getStateLog().length,max:1},
    state10:{val:getStateLog().length,max:10},
    ritual1:{val:getMorningRitual().date===todayStr()&&getMorningRitual().stateRating?1:0,max:1},
    manif1:{val:getManifesto().trim().length>20?1:0,max:1},
    paper1:{val:paperCount,max:1},
    paper7:{val:paperCount,max:7},
    perfect1:{val:perfectCount,max:1},
    perfect7:{val:perfectCount,max:7},
    morning3:{val:morningStreakCurrent,max:3},
    morning14:{val:morningStreakCurrent,max:14},
    aff1:{val:affCount,max:1},
    aff10:{val:affCount,max:10},
    lv3:{val:currentLevel,max:3},
    lv5:{val:currentLevel,max:5},
    lv8:{val:currentLevel,max:8},
    cb1:{val:prospects.filter(p=>p.history&&p.history.some(h=>h.action==='Call Gebucht')).length,max:1},
    cb3:{val:prospects.filter(p=>p.history&&p.history.some(h=>h.action==='Call Gebucht')).length,max:3},
    cb5:{val:prospects.filter(p=>p.history&&p.history.some(h=>h.action==='Call Gebucht')).length,max:5},
    loom3:{val:loomSentTotal,max:3},
    loom5:{val:loomSentTotal,max:5},
    morning7:{val:morningStreakCurrent,max:7},
    morning30:{val:morningStreakCurrent,max:30},
    stateHigh:{val:getStateLog().filter(e=>e.value>=9).length,max:1},
    dm100w:{val:(()=>{const wkStart=new Date(getWeekKey()+'T00:00:00');return Object.entries(days).filter(([d])=>new Date(d+'T00:00:00')>=wkStart).reduce((s,[,a])=>s+(a||[]).length,0);})(),max:100},
    review10:{val:reviewTotal,max:10},
    won5:{val:wonTotal,max:5},won10:{val:wonTotal,max:10},
    nn50:{val:nnCurStreak,max:50},nn100:{val:nnCurStreak,max:100},
    dm2000:{val:totalDMs,max:2000},dm5000:{val:totalDMs,max:5000},
    morning60:{val:morningStreakCurrent,max:60},
    review25:{val:reviewTotal,max:25},review50:{val:reviewTotal,max:50},
    perfect30:{val:perfectCount,max:30},
    pipe50:{val:activePipeline,max:50},
    reply25:{val:followupTotal,max:25},
    state100:{val:getStateLog().length,max:100},
  };

  const sysAchs=milestones.filter(ms=>ms.system);
  const customMs=milestones.filter(ms=>!ms.system);
  const unlockedCount=sysAchs.filter(ms=>ms.done).length;

  const badge=document.getElementById('ach-count-badge');
  if(badge&&!targetId)badge.textContent=unlockedCount+' / '+sysAchs.length;
  renderAchFloatWidget();

  listEl.innerHTML='';

  const rarityOrder={common:0,rare:1,epic:2,legendary:3};

  function makeCard(ms){
    const rarity=ms.rarity||'common';
    let classes='ach-card';
    if(ms.done)classes+=' unlocked';
    else classes+=' locked';
    if(rarity!=='common')classes+=' '+rarity;

    const card=document.createElement('div');
    card.className=classes;
    card.id='ach-'+ms.id;

    let progressHtml='';
    if(!ms.done&&ms.autoKey&&progressFor[ms.autoKey]){
      const{val,max}=progressFor[ms.autoKey];
      const pct=Math.min(100,Math.round((val/max)*100));
      progressHtml=`<div class="ach-prog"><div class="ach-prog-lbl">${val} / ${max}</div><div class="ach-prog-bar"><div class="ach-prog-fill" style="width:${pct}%"></div></div></div>`;
    }

    const rarityBadge=`<span class="rarity-badge rarity-${rarity}">${rarity}</span>`;
    const flavorHtml=ms.flavor?`<div class="ach-flavor">${esc(ms.flavor)}</div>`:'';
    const doneSubHtml=ms.done&&ms.doneDate?`<div class="ach-sub">✓ ${fmtDate(ms.doneDate)}</div>`:'';

    card.innerHTML=`
      <div class="ach-icon">${ms.done?(ms.icon||'✅'):(ms.icon||'🎖')}</div>
      <div class="ach-body">
        ${rarityBadge}
        <div class="ach-title">${esc(ms.text)}</div>
        ${flavorHtml}${doneSubHtml}
        ${progressHtml}
      </div>
      <div class="ach-right">
        <span class="ach-xp">+${ms.xp||50} XP</span>
        ${!ms.done&&!ms.autoKey?`<input type="checkbox" style="width:16px;height:16px;accent-color:var(--green);cursor:pointer;margin-top:4px" onchange="toggleMilestone('${ms.id}',this.checked)" title="Erledigt">`:
          !ms.done&&ms.autoKey?`<span style="font-size:10px;color:var(--muted)">Auto</span>`:''}
        ${!ms.system&&!ms.autoKey?`<button style="background:transparent;border:none;color:var(--muted);cursor:pointer;font-size:11px;padding:2px 4px;border-radius:4px;line-height:1;margin-top:2px" onclick="deleteMilestone('${ms.id}')" title="Löschen">✕</button>`:''}
      </div>`;
    listEl.appendChild(card);
  }

  // System achievements: unlocked first, then locked sorted by xp
  const unlocked=sysAchs.filter(ms=>ms.done).sort((a,b)=>new Date(b.doneDate)-new Date(a.doneDate));
  const locked=sysAchs.filter(ms=>!ms.done).sort((a,b)=>{const rd=(rarityOrder[a.rarity||'common']||0)-(rarityOrder[b.rarity||'common']||0);return rd!==0?rd:(a.xp||50)-(b.xp||50);});

  if(unlocked.length){
    const hdr=document.createElement('div');
    hdr.className='ach-section-hdr';
    hdr.innerHTML='🔓 Freigeschaltet <span class="ach-count-badge" style="background:var(--green-dim);color:var(--green)">'+unlocked.length+'</span><span></span>';
    listEl.appendChild(hdr);
    unlocked.forEach(makeCard);
  }
  if(locked.length){
    const hdr=document.createElement('div');
    hdr.className='ach-section-hdr';
    hdr.innerHTML='🔒 Noch gesperrt<span></span>';
    listEl.appendChild(hdr);
    locked.forEach(makeCard);
  }

  if(customMs.length){
    const hdr=document.createElement('div');
    hdr.className='ach-section-hdr';
    hdr.innerHTML='📌 Meine Meilensteine<span></span>';
    listEl.appendChild(hdr);
    customMs.forEach(ms=>{
      const card=document.createElement('div');
      card.className='ach-card'+(ms.done?' unlocked':'');
      card.id='ach-'+ms.id;
      const doneSubHtml=ms.done&&ms.doneDate?`<div class="ach-sub">✓ ${fmtDate(ms.doneDate)}</div>`:'';
      card.innerHTML=`
        <div class="ach-icon">${ms.done?'✅':'🎖'}</div>
        <div class="ach-body">
          <div class="ach-title">${esc(ms.text)}</div>${doneSubHtml}
        </div>
        <div class="ach-right">
          <span class="ach-xp">+${ms.xp||50} XP</span>
          ${!ms.done?`<input type="checkbox" style="width:16px;height:16px;accent-color:var(--green);cursor:pointer;margin-top:4px" onchange="toggleMilestone('${ms.id}',this.checked)" title="Erledigt">`:''}
          <button style="background:transparent;border:none;color:var(--muted);cursor:pointer;font-size:11px;padding:2px 4px;border-radius:4px;line-height:1;margin-top:2px" onclick="deleteMilestone('${ms.id}')" title="Löschen">✕</button>
        </div>`;
      listEl.appendChild(card);
    });
  }
}

function toggleMilestone(id,done){
  const milestones=getMilestones();
  const ms=milestones.find(x=>x.id===id);
  if(ms){ms.done=done;ms.doneDate=done?todayStr():null;}
  save(SK.milestones,milestones);
  if(done&&ms){
    const xpAmt=ms.xp||50;
    awardXP(xpAmt);
    setTimeout(()=>{
      const card=document.getElementById('ach-'+id);
      if(card){card.classList.add('unlocking');setTimeout(()=>card.classList.remove('unlocking'),700);}
    },50);
  }
  renderMilestones();
  renderXPBar();
  renderAchFloatWidget();
}

function deleteMilestone(id){
  if(!confirm('Meilenstein löschen?'))return;
  save(SK.milestones,getMilestones().filter(x=>x.id!==id));
  renderMilestones();
}

function checkAutoAchievements(){
  const milestones=getMilestones();
  const days=getDays();
  const today=todayStr();
  const totalDMs=Object.values(days).reduce((sum,arr)=>sum+(arr||[]).length,0);
  const todayDMs=(days[today]||[]).length;
  const streak=computeStreak();
  const prospects=getProspects();
  const followupTotal=prospects.filter(p=>p.history&&p.history.some(h=>h.action==='Follow-up')).length;
  const loomSentTotal=prospects.filter(p=>p.history&&p.history.some(h=>h.action==='Loom Gesendet')).length;
  const wonTotal=prospects.filter(p=>p.stage==='won').length;
  const activePipeline=prospects.filter(p=>!['won','lost'].includes(p.stage)).length;
  const lostTotal=prospects.filter(p=>p.stage==='lost').length;
  const reviewTotal=load(SK.reviews,[]).length;
  const nnCurStreak=load(SK.nnStreak,{current:0}).current;

  const paperRitualData=load(SK.paperRitual,{count:0});
  const paperCount=paperRitualData.count||0;
  const perfectDaysData=load(SK.perfectDays,{dates:[]});
  const perfectCount=(perfectDaysData.dates||[]).length;
  const morningStreakData=load(SK.morningStreak,{current:0});
  const morningStreakCurrent=morningStreakData.current||0;
  const affCount=getAffirmations().length;
  const currentLevel=computeLevel(getXP().total).level;

  const callBookedTotal=prospects.filter(p=>p.history&&p.history.some(h=>h.action==='Call Gebucht')).length;
  const weekDMs=(()=>{const wkStart=new Date(getWeekKey()+'T00:00:00');return Object.entries(days).filter(([d])=>new Date(d+'T00:00:00')>=wkStart).reduce((s,[,a])=>s+(a||[]).length,0);})();
  const stateLog=getStateLog();
  const highStateCount=stateLog.filter(e=>e.value>=9).length;

  const conditions={
    dm1:totalDMs>=1,
    dm5:totalDMs>=5,
    dm5day:todayDMs>=5,
    dm10:totalDMs>=10,
    dm20day:todayDMs>=20,
    dm25:totalDMs>=25,
    dm50:totalDMs>=50,
    dm100:totalDMs>=100,
    dm200:totalDMs>=200,
    dm250:totalDMs>=250,
    dm500:totalDMs>=500,
    dm1000:totalDMs>=1000,
    dm10day:todayDMs>=10,
    streak3:streak.count>=3,
    streak5:streak.count>=5,
    streak10:streak.count>=10,
    streak20:streak.count>=20,
    followup5:followupTotal>=5,
    loom1:loomSentTotal>=1,
    won1:wonTotal>=1,
    reply1:followupTotal>=1,
    reply5:followupTotal>=5,
    reply10:followupTotal>=10,
    pipe5:activePipeline>=5,
    pipe25:activePipeline>=25,
    nn3:nnCurStreak>=3,
    nn7:nnCurStreak>=7,
    nn14:nnCurStreak>=14,
    nn30:nnCurStreak>=30,
    lost5:lostTotal>=5,
    review5:reviewTotal>=5,
    state1:stateLog.length>=1,
    state10:stateLog.length>=10,
    ritual1:getMorningRitual().date===todayStr()&&!!getMorningRitual().stateRating,
    manif1:getManifesto().trim().length>20,
    paper1:paperCount>=1,
    paper7:paperCount>=7,
    perfect1:perfectCount>=1,
    perfect7:perfectCount>=7,
    morning3:morningStreakCurrent>=3,
    morning14:morningStreakCurrent>=14,
    aff1:affCount>=1,
    aff10:affCount>=10,
    lv3:currentLevel>=3,
    lv5:currentLevel>=5,
    lv7:currentLevel>=7,
    lv8:currentLevel>=8,
    lv10:currentLevel>=10,
    state25:stateLog.length>=25,
    state50:stateLog.length>=50,
    streak30:streak.count>=30,
    dm750:totalDMs>=750,
    dm30day:todayDMs>=30,
    won3:wonTotal>=3,
    cb1:callBookedTotal>=1,
    cb3:callBookedTotal>=3,
    cb5:callBookedTotal>=5,
    loom3:loomSentTotal>=3,
    loom5:loomSentTotal>=5,
    morning7:morningStreakCurrent>=7,
    morning30:morningStreakCurrent>=30,
    stateHigh:highStateCount>=1,
    dm100w:weekDMs>=100,
    review10:reviewTotal>=10,
    won5:wonTotal>=5,won10:wonTotal>=10,
    nn50:nnCurStreak>=50,nn100:nnCurStreak>=100,
    dm2000:totalDMs>=2000,dm5000:totalDMs>=5000,
    morning60:morningStreakCurrent>=60,
    review25:reviewTotal>=25,review50:reviewTotal>=50,
    perfect30:perfectCount>=30,
    pipe50:activePipeline>=50,
    reply25:followupTotal>=25,
    state100:stateLog.length>=100,
  };

  const newlyUnlocked=[];
  milestones.forEach(ms=>{
    if(!ms.done&&ms.autoKey&&conditions[ms.autoKey]){
      ms.done=true;ms.doneDate=today;
      newlyUnlocked.push(ms);
    }
  });

  if(newlyUnlocked.length){
    save(SK.milestones,milestones);
    newlyUnlocked.forEach((ms,i)=>{
      setTimeout(()=>{
        const{leveled,newLevel}=addXPSilent(ms.xp||50);
        if(leveled){showXPToast('LEVEL UP — '+newLevel.name+'!','🏆','Level '+newLevel.level+' erreicht');}
        else{showAchievementToast(ms);}
        setTimeout(()=>{
          const card=document.getElementById('ach-'+ms.id);
          if(card){card.classList.add('unlocking');setTimeout(()=>card.classList.remove('unlocking'),700);}
        },80);
      },i*500);
    });
    setTimeout(()=>{renderMilestones();renderXPBar();renderAchFloatWidget();},100);
  }
}

function addMilestone(){
  const text=prompt('Meilenstein:');
  if(!text||!text.trim())return;
  const milestones=getMilestones();
  milestones.push({id:'ms'+Date.now(),text:text.trim(),done:false,doneDate:null,xp:50,icon:'🎖'});
  save(SK.milestones,milestones);
  renderMilestones();
}

function renderXPBar(){
  const xpData=getXP();
  const lvl=computeLevel(xpData.total);
  const el=document.getElementById('zl-xp-bar');
  if(el){
    const nextLabel=lvl.nextXP?' / '+lvl.nextXP+' XP':' XP (MAX)';
    el.innerHTML=`<div class="xp-bar-top"><span class="xp-bar-lvl">⚡ Level ${lvl.level} — ${lvl.name}</span><span class="xp-bar-num">${xpData.total}${nextLabel}</span></div><div class="xp-bar"><div class="xp-bar-fill" style="width:${lvl.pct}%"></div></div>`;
  }
  const lvlEl=document.getElementById('mc-level');
  if(lvlEl){lvlEl.textContent='⚡ '+lvl.name+' · '+xpData.total+' XP';lvlEl.style.display='inline-flex';}
  const nnXp=document.getElementById('nn-xp-display');
  if(nnXp)nnXp.textContent='⚡ Level '+lvl.level+' · '+xpData.total+' XP';
}

// ── TAGESPLAN TAB ─────────────────────────────────────────────────────────────
const SCHEDULE=[
  {start:'06:30',end:'06:45',title:'Aufwachen',sub:'',color:'neutral'},
  {start:'06:45',end:'07:45',title:'Workout',sub:'Kein Handy — volle Konzentration',color:'blue'},
  {start:'07:45',end:'08:00',title:'Meditation',sub:'Box Breathing — 10 Minuten',color:'purple'},
  {start:'08:00',end:'10:30',title:'Outreach',sub:'Non-negotiable — keine Ausnahmen',color:'amber'},
  {start:'10:30',end:'12:00',title:'Content / Free Value',sub:'Skripte, Looms, Profilaudits',color:'teal'},
  {start:'12:00',end:'13:00',title:'Mittagspause',sub:'',color:'neutral'},
  {start:'13:00',end:'17:00',title:'Personal Brand',sub:'Fulfillment, Content, Netzwerk',color:'blue'},
  {start:'17:00',end:'21:00',title:'Abschalten',sub:'Kein Bildschirm — spazieren, entspannen',color:'neutral'}
];

function timeToMin(t){const[h,m]=t.split(':').map(Number);return h*60+m;}
function nowMin(){const n=new Date();return n.getHours()*60+n.getMinutes();}
function fmtNow(){const n=new Date();return String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');}

function renderTagesplan(){
  const wrap=document.getElementById('tl-wrap');
  if(!wrap)return;
  const now=nowMin();
  let html='';
  let nowInserted=false;

  SCHEDULE.forEach((block,i)=>{
    const startMin=timeToMin(block.start);
    const endMin=timeToMin(block.end);
    const isPast=now>endMin;
    const isCurrent=now>=startMin&&now<endMin;

    if(isCurrent&&!nowInserted){
      html+=`<div class="tl-now-line"><div class="tl-now-dot"></div><span class="tl-now-time">${fmtNow()} Jetzt</span><div class="tl-now-hr"></div></div>`;
      nowInserted=true;
    }

    const pastClass=isPast&&!isCurrent?' past':'';
    const currentClass=isCurrent?' tl-current':'';
    html+=`<div class="tl-block tl-block-${block.color}${pastClass}${currentClass}">
      <div class="tl-time">${block.start}${block.end?' – '+block.end:''}</div>
      <div class="tl-title">${block.title}</div>
      ${block.sub?`<div class="tl-sub">${block.sub}</div>`:''}
      ${isCurrent?`<div class="tl-current-badge"><span class="tl-dot"></span>Jetzt</div>`:''}
    </div>`;
  });

  if(!nowInserted&&now>timeToMin(SCHEDULE[SCHEDULE.length-1].end)){
    html+=`<div class="tl-now-line"><div class="tl-now-dot"></div><span class="tl-now-time">${fmtNow()}</span><div class="tl-now-hr"></div></div>`;
  }

  wrap.innerHTML=html;
}

let tlInterval=null;
function startTimelineUpdater(){
  renderTagesplan();
  tlInterval=setInterval(renderTagesplan,60000);
}

// ── MEDITATION TIMER ─────────────────────────────────────────────────────────
const MED_PHASES=['Einatmen','Halten','Ausatmen','Halten'];
const MED_SUBS=['Atme langsam ein…','Luft sanft anhalten…','Lass alles los…','Pause. Stille.'];
const PHASE_DUR=4;
const CIRCUM=553;
let medTimer=null,medRemaining=0,medTotal=0,medPhase=0,medPhaseTime=0;

function startMeditationTimer(minutes){
  const dur=minutes||10;
  medTotal=dur*60;medRemaining=medTotal;medPhase=0;medPhaseTime=0;
  document.getElementById('med-overlay').classList.add('active');
  updateMedDisplay();
  if(medTimer)clearInterval(medTimer);
  medTimer=setInterval(medTick,1000);
}

function startMeditationFromSelect(){
  const dur=parseInt(document.getElementById('med-duration').value)||10;
  startMeditationTimer(dur);
}

function medTick(){
  medRemaining--;
  medPhaseTime++;
  if(medPhaseTime>=PHASE_DUR){medPhase=(medPhase+1)%4;medPhaseTime=0;}
  if(medRemaining<=0){clearInterval(medTimer);medTimer=null;completeMeditation();return;}
  updateMedDisplay();
}

function updateMedDisplay(){
  const mins=Math.floor(medRemaining/60);
  const secs=medRemaining%60;
  document.getElementById('med-timer-display').textContent=String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0');
  document.getElementById('med-phase-lbl').textContent=MED_PHASES[medPhase];
  document.getElementById('med-phase-sub').textContent=MED_SUBS[medPhase];
  const elapsed=medTotal-medRemaining;
  document.getElementById('med-ring').style.strokeDashoffset=CIRCUM*(1-elapsed/medTotal);

  let scale;
  const t=medPhaseTime/PHASE_DUR;
  if(medPhase===0)scale=0.5+1.2*t;
  else if(medPhase===1)scale=1.7;
  else if(medPhase===2)scale=1.7-1.2*t;
  else scale=0.5;
  document.getElementById('med-breath').style.transform='scale('+scale+')';

  const pct=Math.round((elapsed/medTotal)*100);
  document.getElementById('med-total-prog').textContent=pct+'% abgeschlossen';
}

function cancelMeditation(){
  if(medTimer){clearInterval(medTimer);medTimer=null;}
  document.getElementById('med-overlay').classList.remove('active');
}

function completeMeditation(){
  document.getElementById('med-overlay').classList.remove('active');
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator();const g=ctx.createGain();
    osc.connect(g);g.connect(ctx.destination);
    osc.frequency.value=528;osc.type='sine';
    g.gain.setValueAtTime(0.35,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+2.5);
    osc.start(ctx.currentTime);osc.stop(ctx.currentTime+2.5);
  }catch(e){}
  saveNonNeg('meditation',true);
  const msg=document.getElementById('med-done-msg');
  if(msg){msg.style.display='block';setTimeout(()=>msg.style.display='none',4000);}
}

// ── STATE LOG ─────────────────────────────────────────────────────────────────
function getStateLog(){return load(SK.stateLog,[]);}
function updateStateNowDisplay(val){
  const el=document.getElementById('state-now-num');
  if(!el)return;
  el.textContent=val;
  const c=val>=8?'var(--green)':val>=6?'#facc15':val>=4?'var(--amber)':'var(--red)';
  el.style.color=c;
}
function toggleStateTag(el){el.classList.toggle('active');}
function saveStateEntry(){
  const slider=document.getElementById('state-log-slider');
  const noteEl=document.getElementById('state-log-note');
  if(!slider)return;
  const rating=parseInt(slider.value);
  const tags=[...document.querySelectorAll('#state-log-tags .state-tag.active')].map(t=>t.dataset.tag);
  const entry={ts:Date.now(),rating,note:(noteEl?.value||'').trim(),tags};
  const log=getStateLog();log.push(entry);save(SK.stateLog,log);
  if(noteEl)noteEl.value='';
  document.querySelectorAll('#state-log-tags .state-tag').forEach(t=>t.classList.remove('active'));
  awardXP(5);showXPToast('+5 XP','📊','State geloggt');
  renderStateLog();
  setTimeout(checkAutoAchievements,100);
}
function renderStateLog(){
  const log=getStateLog();
  const today=todayStr();
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-2);
  const recentLog=log.filter(e=>new Date(e.ts)>=cutoff);
  const wrap=document.getElementById('state-today-log');
  if(!wrap)return;
  if(!recentLog.length){wrap.innerHTML='<div class="empty-state">Noch keine Einträge. Logge deinen State!</div>';return;}
  const byDay={};
  recentLog.forEach(e=>{const d=new Date(e.ts).toISOString().split('T')[0];if(!byDay[d])byDay[d]=[];byDay[d].push(e);});
  wrap.innerHTML=Object.keys(byDay).sort().reverse().map(d=>{
    const isToday=d===today;
    const dayLabel=isToday?'Heute':fmtDate(d);
    const entries=byDay[d].slice().reverse();
    return`<div style="margin-bottom:12px">
      <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:6px">${dayLabel}</div>`+
      entries.map(e=>{
        const t=new Date(e.ts);
        const timeStr=String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0');
        const tags=(e.tags||[]).map(tag=>`<span style="font-size:10px;padding:2px 7px;border-radius:4px;background:var(--surface);border:1px solid var(--border);margin-right:3px">${esc(tag)}</span>`).join('');
        const c=e.rating>=8?'var(--green)':e.rating>=6?'#facc15':e.rating>=4?'var(--amber)':'var(--red)';
        return`<div class="state-log-entry">
          <div class="state-log-time">${timeStr}</div>
          <div class="state-log-note">${e.note?esc(e.note):'<span style="color:var(--muted);font-style:italic">kein Text</span>'}<div style="margin-top:4px">${tags}</div></div>
          <div class="state-log-rating" style="color:${c}">${e.rating}</div>
        </div>`;
      }).join('')+'</div>';
  }).join('');
}

function toggleStateHistory(btn){
  const wrap=document.getElementById('state-history-wrap');if(!wrap)return;
  const isOpen=wrap.style.display!=='none';
  wrap.style.display=isOpen?'none':'block';
  if(btn)btn.textContent=isOpen?'Verlauf':'Schließen';
  if(!isOpen){
    const log=getStateLog();
    const el=document.getElementById('state-full-history');if(!el)return;
    if(!log.length){el.innerHTML='<div class="empty-state">Noch keine Einträge.</div>';return;}
    const byDay={};
    log.forEach(e=>{const d=new Date(e.ts).toISOString().split('T')[0];if(!byDay[d])byDay[d]=[];byDay[d].push(e);});
    el.innerHTML=Object.keys(byDay).sort().reverse().map(d=>{
      const entries=byDay[d].slice().reverse();
      const c=entries[entries.length-1]?.rating;const col=c>=8?'var(--green)':c>=6?'#facc15':c>=4?'var(--amber)':'var(--red)';
      return`<div style="margin-bottom:14px"><div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:6px">${fmtDate(d)}</div>`+
        entries.map(e=>{
          const t=new Date(e.ts);const timeStr=String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0');
          const tags=(e.tags||[]).map(tag=>`<span style="font-size:10px;padding:2px 6px;border-radius:4px;background:var(--surface2);border:1px solid var(--border);margin-right:3px">${esc(tag)}</span>`).join('');
          const cr=e.rating>=8?'var(--green)':e.rating>=6?'#facc15':e.rating>=4?'var(--amber)':'var(--red)';
          return`<div class="state-log-entry"><div class="state-log-time">${timeStr}</div><div class="state-log-note">${e.note?esc(e.note):'<span style="color:var(--muted);font-style:italic">—</span>'}<div style="margin-top:4px">${tags}</div></div><div class="state-log-rating" style="color:${cr}">${e.rating}</div></div>`;
        }).join('')+'</div>';
    }).join('');
  }
}

// ── MORNING RITUAL ────────────────────────────────────────────────────────────
function getMorningRitual(){return load(SK.morningRitual,{stateRating:null,gratitudes:['','',''],contracts:[{text:'',done:false},{text:'',done:false},{text:'',done:false}],date:null});}
function saveMorningState(val){
  const mr=getMorningRitual(),today=todayStr();
  if(mr.date!==today){mr.gratitudes=['','',''];mr.contracts=[{text:'',done:false},{text:'',done:false},{text:'',done:false}];}
  mr.stateRating=val;mr.date=today;save(SK.morningRitual,mr);
  const warn=document.getElementById('morning-state-warning');
  if(warn)warn.classList.toggle('visible',val<=7);
  const numEl=document.getElementById('morning-state-num');
  if(numEl){
    numEl.textContent=val;
    const c=val>=8?'var(--green)':val>=6?'#facc15':val>=4?'var(--amber)':'var(--red)';
    numEl.style.color=c;
  }
}
function saveMorningGratitudes(){
  const mr=getMorningRitual(),today=todayStr();
  if(mr.date!==today)mr.date=today;
  mr.gratitudes=[document.getElementById('grat-1')?.value||'',document.getElementById('grat-2')?.value||'',document.getElementById('grat-3')?.value||''];
  save(SK.morningRitual,mr);
  if(mr.gratitudes.some(g=>g.trim()))setDailyTaskDone('gratitude');
}
function saveMorningContracts(){
  const mr=getMorningRitual(),today=todayStr();
  if(mr.date!==today)mr.date=today;
  mr.contracts=[0,1,2].map(i=>({text:document.getElementById('contract-'+i)?.value||'',done:document.getElementById('contract-cb-'+i)?.checked||false}));
  save(SK.morningRitual,mr);
  if(mr.contracts.some(c=>c.text.trim()))setDailyTaskDone('contracts');
}
function completeMorningRitual(){
  const mr=getMorningRitual();
  if(!mr.stateRating){alert('Bitte zuerst deinen State bewerten (Schritt 4).');return;}
  saveMorningGratitudes();saveMorningContracts();
  const today=todayStr();
  const mStreak=load(SK.morningStreak,{current:0,best:0,lastDate:null});
  if(mStreak.lastDate!==today){
    mStreak.current=mStreak.lastDate===yesterdayStr()?mStreak.current+1:1;
    mStreak.best=Math.max(mStreak.best,mStreak.current);
    mStreak.lastDate=today;
    save(SK.morningStreak,mStreak);
    awardXP(20);showXPToast('+20 XP','🌅','Morgenritual abgeschlossen!');
    scheduleStateNotification();
  } else {
    showXPToast('Bereits gemacht','🌅','Morgenritual heute schon abgeschlossen');
  }
  _markMorningRitualBtn();
  setTimeout(checkAutoAchievements,100);
  updateNavDots();
}
function _markMorningRitualBtn(){
  const btn=document.querySelector('[onclick="completeMorningRitual()"]');
  if(!btn)return;
  btn.disabled=true;
  btn.classList.add('btn-done');
  btn.textContent='✓ Morgenritual abgeschlossen';
}
function _restoreMorningRitualBtn(){
  const mStreak=load(SK.morningStreak,{current:0,best:0,lastDate:null});
  if(mStreak.lastDate===todayStr())_markMorningRitualBtn();
}
function renderMorningRitual(){
  const mr=getMorningRitual(),today=todayStr();
  if(mr.date!==today)return;
  if(mr.stateRating){
    const slider=document.getElementById('morning-state-slider');
    if(slider)slider.value=mr.stateRating;
    saveMorningState(mr.stateRating);
  }
  mr.gratitudes.forEach((g,i)=>{const el=document.getElementById('grat-'+(i+1));if(el)el.value=g;});
  mr.contracts.forEach((c,i)=>{
    const textEl=document.getElementById('contract-'+i);const cbEl=document.getElementById('contract-cb-'+i);
    if(textEl)textEl.value=c.text;if(cbEl)cbEl.checked=c.done;
  });
  restorePaperButtons();
  restoreBreathingButton();
  _restoreMorningRitualBtn();
}

// ── MANIFESTO ─────────────────────────────────────────────────────────────────
function getManifesto(){return load(SK.manifesto,'');}
function saveManifesto(){
  const ta=document.getElementById('manifesto-ta');
  if(!ta||!ta.value.trim())return;
  const wasEmpty=!getManifesto().trim();
  save(SK.manifesto,ta.value);
  if(wasEmpty){awardXP(50);showXPToast('+50 XP','📜','Manifesto gespeichert!');}
  else{showXPToast('Gespeichert','📜','Manifesto aktualisiert');}
  setTimeout(checkAutoAchievements,100);
}
function renderManifesto(){
  const ta=document.getElementById('manifesto-ta');
  if(ta)ta.value=getManifesto();
}

// ── GOAL BUILDER ─────────────────────────────────────────────────────────────
function buildGoal(){
  const outcome=(document.getElementById('gb-outcome')?.value||'').trim();
  const amount=(document.getElementById('gb-amount')?.value||'').trim();
  const date=document.getElementById('gb-date')?.value||'';
  const niche=(document.getElementById('gb-niche')?.value||'').trim();
  const count=(document.getElementById('gb-count')?.value||'').trim();
  const how=(document.getElementById('gb-how')?.value||'').trim();
  if(!outcome&&!amount&&!date)return;
  let sentence='Ich bin dankbar, dass ich';
  if(date){const d=new Date(date+'T12:00:00');sentence+=' bis '+d.toLocaleDateString('de',{day:'2-digit',month:'long',year:'numeric'});}
  if(how)sentence+=' durch '+how;
  if(count&&niche)sentence+=' '+count+' Kunden in '+niche;
  else if(niche)sentence+=' Kunden in '+niche;
  if(amount)sentence+=' gewonnen habe und €'+amount+' auf meinem Konto sehe.';
  else sentence+=' gewonnen habe.';
  if(outcome)sentence='"'+outcome+'\n\n'+sentence+'"';
  const out=document.getElementById('goal-builder-output');
  if(out){out.textContent=sentence;out.classList.add('visible');}
}

// ── AFFIRMATIONS ──────────────────────────────────────────────────────────────
function getAffirmations(){return load(SK.affirmations,[]);}
function addAffirmation(){
  const inp=document.getElementById('aff-input');
  if(!inp||!inp.value.trim())return;
  const affs=getAffirmations();
  affs.push({id:'aff'+Date.now(),text:inp.value.trim()});
  save(SK.affirmations,affs);inp.value='';
  renderAffirmations();
}
function deleteAffirmation(id){
  save(SK.affirmations,getAffirmations().filter(a=>a.id!==id));
  renderAffirmations();
}
function renderAffirmations(){
  const affs=getAffirmations();
  const wrap=document.getElementById('aff-list');
  if(wrap){
    if(!affs.length){wrap.innerHTML='<div class="empty-state">Noch keine Affirmationen. Füge deine erste hinzu.</div>';}
    else{wrap.innerHTML=affs.map(a=>`<div class="aff-card"><div class="aff-text">"${esc(a.text)}"</div><button class="aff-del" onclick="deleteAffirmation('${a.id}')">✕</button></div>`).join('');}
  }
  const randomEl=document.getElementById('aff-random');
  if(randomEl){
    if(affs.length>0){const r=affs[Math.floor(Math.random()*affs.length)];randomEl.textContent='"'+r.text+'"';randomEl.style.display='block';}
    else{randomEl.style.display='none';}
  }
}

// ── TAB SWITCHING ──────────────────────────────────────────────────────────────
const TABS=['start','outreach','mindset','ziele','review'];
function switchTab(tab){
  document.querySelectorAll('.nav-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===tab));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  if(tab==='review'){updateWeekStats();renderPastReviews();renderFunnel();renderPipelineSnap();renderStateAnalytics();renderKPIChart();document.getElementById('sat-banner').classList.toggle('visible',new Date().getDay()===6);}
  if(tab==='mindset'){renderMission();renderAffirmations();renderStateLog();renderDailyWisdom();}
  if(tab==='outreach'){renderMission();renderPipeline();renderTemplates();renderReasonCards();renderOutreachStateBanner();}
  if(tab==='start')renderStart();
  if(tab==='ziele'){renderZiele();renderManifesto();}
  checkStateGate();
}

function switchSubNav(sub){
  document.querySelectorAll('.sub-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.sub===sub));
  document.querySelectorAll('.sub-panel').forEach(p=>p.classList.remove('active'));
  const panel=document.getElementById('sub-'+sub);
  if(panel)panel.classList.add('active');
}

// ── EXPORT / IMPORT ───────────────────────────────────────────────────────────
function exportData(){
  const data={};
  Object.values(SK).forEach(k=>{const v=localStorage.getItem(k);if(v!==null)try{data[k]=JSON.parse(v);}catch(e){data[k]=v;}});
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='outreach-agent-'+todayStr()+'.json';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

function importData(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const data=JSON.parse(e.target.result);
      if(!data.fpcm_prospects)throw new Error('Ungültige Backup-Datei — fpcm_prospects fehlt');
      Object.entries(data).forEach(([k,v])=>localStorage.setItem(k,JSON.stringify(v)));
      renderAll();
      const el=document.getElementById('import-ok');
      if(el){el.textContent='✓ Daten importiert';el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3000);}
    }catch(err){alert('Import fehlgeschlagen: '+err.message);}
    input.value='';
  };
  reader.readAsText(file);
}

// ── FUNNEL ────────────────────────────────────────────────────────────────────
function renderFunnel(){
  const el=document.getElementById('funnel-wrap');if(!el)return;
  const prospects=getProspects(),days=getDays();
  const totalDMs=Object.values(days).reduce((sum,arr)=>sum+(arr||[]).length,0);
  const reachedLoom=prospects.filter(p=>['loom','loom_sent','call_booked','won'].includes(p.stage)).length;
  const reachedCall=prospects.filter(p=>['call_booked','won'].includes(p.stage)).length;
  const won=prospects.filter(p=>p.stage==='won').length;
  const rows=[
    {label:'DMs gesendet',count:totalDMs,base:null,color:'var(--accent)'},
    {label:'In Pipeline',count:prospects.filter(p=>!['won','lost'].includes(p.stage)).length,base:totalDMs,color:'var(--amber)'},
    {label:'Loom-Phase+',count:reachedLoom,base:totalDMs,color:'var(--purple)'},
    {label:'Call gebucht+',count:reachedCall,base:totalDMs,color:'var(--green)'},
    {label:'Gewonnen',count:won,base:totalDMs,color:'var(--won)'}
  ];
  if(totalDMs===0&&prospects.length===0){el.innerHTML='<div style="font-size:13px;color:var(--muted);padding:4px 0">Noch keine Daten. Starte deinen Outreach.</div>';return;}
  el.innerHTML=rows.map(r=>{
    const pct=r.base>0?Math.round((r.count/r.base)*100):0;
    const barW=r.base>0?Math.max(r.count>0?3:0,pct):100;
    return `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500;color:var(--text)">${r.label}</span>
        <span style="font-size:12px;color:var(--muted)">${r.count}${r.base!==null?' ('+pct+'%)':''}</span>
      </div>
      <div style="height:5px;background:var(--surface2);border-radius:99px;overflow:hidden">
        <div style="height:100%;border-radius:99px;background:${r.color};width:${barW}%;transition:width .4s"></div>
      </div>
    </div>`;
  }).join('');
}

// ── STATE ANALYTICS ───────────────────────────────────────────────────────────
function renderStateAnalytics(){
  const el=document.getElementById('state-analytics-wrap');if(!el)return;
  const log=getStateLog();
  if(!log.length){el.innerHTML='<div style="font-size:13px;color:var(--muted);padding:4px 0">Noch keine State-Daten.</div>';return;}
  const byDay={};
  log.forEach(e=>{const d=new Date(e.ts).toISOString().split('T')[0];if(!byDay[d])byDay[d]=[];byDay[d].push(e.rating);});
  const days=Object.keys(byDay).sort().slice(-14);
  const avgs=days.map(d=>{const arr=byDay[d];return arr.reduce((s,v)=>s+v,0)/arr.length;});
  const overall=avgs.length?avgs.reduce((s,v)=>s+v,0)/avgs.length:0;
  const last7=avgs.slice(-7);const prev7=avgs.slice(-14,-7);
  const avgLast7=last7.length?last7.reduce((s,v)=>s+v,0)/last7.length:0;
  const avgPrev7=prev7.length?prev7.reduce((s,v)=>s+v,0)/prev7.length:0;
  const trend=prev7.length?avgLast7-avgPrev7:null;
  const trendHtml=trend!==null?`<span style="font-size:12px;color:${trend>=0?'var(--green)':'var(--red)'}">${trend>=0?'↑':'↓'} ${Math.abs(trend).toFixed(1)} vs. Vorwoche</span>`:'';
  const barW=36;const barGap=6;const chartH=70;const totalW=days.length*(barW+barGap);
  const bars=avgs.map((avg,i)=>{
    const col=avg>=8?'var(--green)':avg>=6?'#facc15':'var(--red)';
    const barH=Math.round((avg/10)*chartH);
    const x=i*(barW+barGap);
    const y=chartH-barH;
    const dateLbl=fmtDate(days[i]).slice(0,5);
    return`<g>
      <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" fill="${col}" opacity=".85"/>
      <text x="${x+barW/2}" y="${chartH+14}" text-anchor="middle" font-size="9" fill="var(--muted)">${dateLbl}</text>
      <text x="${x+barW/2}" y="${y-4}" text-anchor="middle" font-size="10" fill="${col}" font-weight="600">${avg.toFixed(1)}</text>
    </g>`;
  }).join('');
  el.innerHTML=`
    <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:10px">
      <span style="font-size:20px;font-weight:700;color:var(--amber)">${overall.toFixed(1)}</span>
      <span style="font-size:12px;color:var(--muted)">Ø Gesamt</span>
      ${trendHtml}
    </div>
    <div style="overflow-x:auto;-webkit-overflow-scrolling:touch">
      <svg viewBox="0 0 ${Math.max(totalW,300)} ${chartH+24}" style="width:100%;max-width:${Math.max(totalW,300)}px;height:${chartH+24}px;display:block" xmlns="http://www.w3.org/2000/svg">
        ${bars}
      </svg>
    </div>`;
}

// ── KPI CHART ─────────────────────────────────────────────────────────────────
let _kpiMetric='dms';
function renderKPIChart(metric){
  if(metric)_kpiMetric=metric;
  document.querySelectorAll('.kpi-btn').forEach(b=>b.classList.toggle('active',b.dataset.kpi===_kpiMetric));
  const el=document.getElementById('kpi-chart-wrap');if(!el)return;
  const days=getDays();
  const stateLog=getStateLog();
  const today=todayStr();
  const dateList=[];
  for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);dateList.push(d.toISOString().split('T')[0]);}
  let data=[];let label='';let color='var(--accent)';let maxVal=1;
  if(_kpiMetric==='dms'){
    label='DMs / Tag';color='var(--accent)';
    data=dateList.map(d=>(days[d]||[]).length);
    maxVal=Math.max(1,...data);
  } else if(_kpiMetric==='state'){
    label='State Ø';color='#facc15';
    const byDay={};
    stateLog.forEach(e=>{const d=new Date(e.ts).toISOString().split('T')[0];if(!byDay[d])byDay[d]=[];byDay[d].push(e.rating);});
    data=dateList.map(d=>byDay[d]?byDay[d].reduce((s,v)=>s+v,0)/byDay[d].length:null);
    maxVal=10;
  } else if(_kpiMetric==='streak'){
    label='Streak';color='var(--purple)';
    const sr=computeStreak();
    data=dateList.map((d,i)=>{
      const inStreak=sr.dates?sr.dates.includes(d):false;
      return inStreak?1:0;
    });
    maxVal=1;
  }
  const W=300;const H=80;const pad=4;
  const usableW=W-pad*2;const usableH=H-pad*2;
  const pts=data.map((v,i)=>{
    const x=pad+i*(usableW/(dateList.length-1||1));
    const y=v===null?null:pad+usableH-(v/maxVal)*usableH;
    return{x,y,v,d:dateList[i]};
  });
  const validPts=pts.filter(p=>p.y!==null);
  if(!validPts.length){el.innerHTML='<div style="font-size:13px;color:var(--muted);padding:8px 0">Keine Daten für diesen Zeitraum.</div>';return;}
  const polyline=validPts.map(p=>`${p.x},${p.y}`).join(' ');
  const area=validPts.map(p=>`${p.x},${p.y}`).join(' ')+` ${validPts[validPts.length-1].x},${H} ${validPts[0].x},${H}`;
  const dots=validPts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="3" fill="${color}"/>`).join('');
  const xLabels=dateList.filter((_,i)=>i%3===0||i===dateList.length-1).map((d,_,arr)=>{
    const idx=dateList.indexOf(d);
    const x=pad+idx*(usableW/(dateList.length-1||1));
    return`<text x="${x}" y="${H+13}" text-anchor="middle" font-size="9" fill="var(--muted)">${fmtDate(d).slice(0,5)}</text>`;
  }).join('');
  const lastVal=validPts[validPts.length-1].v;
  const lastFormatted=_kpiMetric==='state'?lastVal.toFixed(1):Math.round(lastVal);
  el.innerHTML=`
    <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:8px">
      <span style="font-size:22px;font-weight:700;color:${color}">${lastFormatted}</span>
      <span style="font-size:12px;color:var(--muted)">${label} heute</span>
    </div>
    <div style="overflow-x:hidden">
      <svg viewBox="0 0 ${W} ${H+18}" style="width:100%;display:block" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="kpig" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity=".3"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
        <polygon points="${area}" fill="url(#kpig)"/>
        <polyline points="${polyline}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        ${dots}
        ${xLabels}
      </svg>
    </div>`;
}

// ── PUSH NOTIFICATIONS ────────────────────────────────────────────────────────
async function requestNotificationPermission(){
  if(!('Notification' in window)){showXPToast('Nicht unterstützt','🔔','Benachrichtigungen nicht verfügbar');return;}
  if(Notification.permission==='granted'){showXPToast('Bereits aktiv','🔔','Benachrichtigungen schon erlaubt');scheduleStateNotification();return;}
  const result=await Notification.requestPermission();
  if(result==='granted'){
    showXPToast('Benachrichtigungen aktiv','🔔','Du wirst erinnert deinen State zu loggen');
    scheduleStateNotification();
  }
}
function scheduleStateNotification(){
  if(Notification.permission!=='granted')return;
  const s=getSettings();
  if(!s.stateReminderHours||s.stateReminderHours===0)return;
  const intervalMs=s.stateReminderHours*3600*1000;
  const lastStr=load(SK.lastStatePopup,null);
  const lastMs=lastStr?new Date(lastStr).getTime():Date.now();
  const nextMs=Math.max(Date.now()+60000,lastMs+intervalMs);
  const delayMs=nextMs-Date.now();
  setTimeout(()=>{
    const mr=getMorningRitual();
    if(mr.date===todayStr()&&mr.stateRating){
      if(navigator.serviceWorker&&navigator.serviceWorker.controller){
        navigator.serviceWorker.controller.postMessage({type:'SHOW_NOTIFICATION',title:'State Check-In 📊',body:'Wie ist dein State gerade? Nimm dir 10 Sekunden.'});
      } else {
        new Notification('State Check-In 📊',{body:'Wie ist dein State gerade?',icon:'/icons/icon-192.png'});
      }
    }
    scheduleStateNotification();
  },delayMs);
}

// ── ATEMÜBUNG OHNE APP ────────────────────────────────────────────────────────
function breathingDoneWithout(){
  const lock=getDailyLock(),today=todayStr();
  if(lock.date===today&&lock.breathingDone){showXPToast('Bereits gemacht','🫁','Heute schon erfasst');return;}
  if(lock.date!==today){lock.date=today;lock.gratitudeDone=false;lock.contractsDone=false;lock.breathingDone=false;}
  lock.breathingDone=true;
  save(SK.dailyLock,lock);
  awardXP(15);
  showXPToast('+15 XP','🫁','Atemübung — gut gemacht!');
  _markBreathingDone();
  setTimeout(checkAutoAchievements,100);
}
function _markBreathingDone(){
  const withoutBtn=document.getElementById('btn-breathing-without');
  if(withoutBtn){withoutBtn.disabled=true;withoutBtn.classList.add('btn-done');withoutBtn.textContent='✓ Atemübung erledigt';}
  const startBtn=document.getElementById('btn-breathing-start');
  if(startBtn){startBtn.disabled=true;startBtn.classList.add('btn-done');startBtn.textContent='✓ Erledigt';}
}
function restoreBreathingButton(){
  const lock=getDailyLock(),nn=getNonNeg();
  if((lock.date===todayStr()&&lock.breathingDone)||!!nn.meditation)_markBreathingDone();
}

// ── OUTREACH STATE BANNER & FEAR RESET ───────────────────────────────────────
const OUTREACH_REFRAMES=[
  'Ich wähle, ob ich diesen Kunden nehme. Er braucht mich mehr als ich ihn brauche.',
  'Mein Wert existiert unabhängig davon, ob diese Person Ja sagt.',
  'Ich bin dankbar. Ich arbeite aus Stärke — nicht aus Angst.',
  'Neediness repels. Abundance attracts. Was treibt mich gerade an?',
  'Clients feel the energy behind the message before they read the words.',
];
function getLastStateRating(){
  const log=getStateLog();
  const mr=getMorningRitual();
  const today=todayStr();
  const todayEntries=log.filter(e=>new Date(e.ts).toISOString().split('T')[0]===today);
  if(todayEntries.length)return todayEntries[todayEntries.length-1].rating;
  if(mr.date===today&&mr.stateRating)return mr.stateRating;
  return null;
}
function _getNextAlarmTime(){
  const s=getSettings();
  if(!s.alarmTimesEnabled||!s.alarmTimes||!s.alarmTimes.length)return null;
  const now=new Date();const nowMin=now.getHours()*60+now.getMinutes();
  for(const t of s.alarmTimes){const [th,tm]=t.split(':').map(Number);if(th*60+tm>nowMin)return t;}
  return null;
}
function renderOutreachStateBanner(){
  const el=document.getElementById('outreach-state-banner');if(!el)return;
  const rating=getLastStateRating();
  const nextAlarm=_getNextAlarmTime();
  const nextHtml=nextAlarm?`<span style="font-size:11px;color:var(--muted);margin-left:4px">· Nächster Check: ${nextAlarm}</span>`:'';
  const notifBtn=Notification&&Notification.permission!=='granted'?`<button onclick="requestNotificationPermission()" class="btn btn-xs btn-ghost" style="flex-shrink:0;margin-left:4px">🔔 Alerts</button>`:'';
  if(rating===null){
    el.className='outreach-state-banner banner-warn';
    el.innerHTML='<span>⚠ Kein State-Check heute. Outreach aus Angst verscheucht Kunden.'+nextHtml+'</span><span style="display:flex;gap:4px;align-items:center;flex-shrink:0">'+notifBtn+'<button onclick="openOutreachReset()" class="btn btn-xs btn-amber">State-Reset</button></span>';
  } else if(rating>=7){
    el.className='outreach-state-banner banner-ok';
    el.innerHTML='<span>✓ State: '+rating+'/10 — Guter Moment für Outreach.'+nextHtml+'</span><span style="display:flex;gap:4px;align-items:center;flex-shrink:0">'+notifBtn+'<button onclick="openOutreachReset()" class="btn btn-xs btn-ghost">Reset</button></span>';
  } else {
    el.className='outreach-state-banner banner-warn';
    el.innerHTML='<span>⚠ State: '+rating+'/10 — Reset empfohlen vor dem Outreach.'+nextHtml+'</span><span style="display:flex;gap:4px;align-items:center;flex-shrink:0">'+notifBtn+'<button onclick="openOutreachReset()" class="btn btn-xs btn-amber">State-Reset</button></span>';
  }
}
let _orBreathCount=0;
let _orBreathInterval=null;
function openOutreachReset(){
  const modal=document.getElementById('outreach-reset-modal');if(!modal)return;
  const rating=getLastStateRating();
  const reframe=OUTREACH_REFRAMES[getDayOfYear()%OUTREACH_REFRAMES.length];
  const ratingHtml=rating!==null?`<div style="text-align:center;margin-bottom:14px"><span style="font-size:28px;font-weight:800;color:${rating>=7?'var(--green)':'var(--amber)'}">${rating}</span><span style="font-size:14px;color:var(--muted)">/10</span></div>`:'';
  document.getElementById('or-content').innerHTML=`
    <div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:6px">State-Reset</div>
    ${ratingHtml}
    <div style="background:var(--surface2);border-radius:10px;padding:14px;margin-bottom:16px;font-size:14px;line-height:1.6;color:var(--text);border-left:3px solid var(--amber)">"${esc(reframe)}"</div>
    <div style="font-size:13px;color:var(--muted);margin-bottom:10px;text-align:center">5 Atemzüge — einatmen was du spüren willst, ausatmen was du loslässt.</div>
    <div style="text-align:center;margin-bottom:16px">
      <div id="or-breath-circle" style="width:72px;height:72px;border-radius:50%;border:3px solid var(--border);margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--muted);transition:all .5s ease">Start</div>
      <div id="or-breath-label" style="font-size:12px;color:var(--muted);margin-bottom:10px">Bereit?</div>
      <button onclick="startOrBreathing()" id="or-breath-btn" class="btn btn-purple btn-sm">Atemübung starten</button>
    </div>
    <button onclick="closeOutreachReset()" class="btn btn-amber btn-full">Ich bin bereit — Outreach starten</button>
  `;
  modal.classList.add('active');
}
function startOrBreathing(){
  _orBreathCount=0;
  clearInterval(_orBreathInterval);
  const circle=document.getElementById('or-breath-circle');
  const label=document.getElementById('or-breath-label');
  const btn=document.getElementById('or-breath-btn');
  if(btn)btn.style.display='none';
  const phases=[
    {text:'Einatmen',color:'var(--green)',scale:'scale(1.3)',dur:4000},
    {text:'Halten',color:'var(--amber)',scale:'scale(1.3)',dur:2000},
    {text:'Ausatmen',color:'var(--purple)',scale:'scale(1)',dur:4000},
  ];
  let phaseIdx=0;let breathNum=0;
  function runPhase(){
    if(breathNum>=5){if(circle)circle.style.cssText='width:72px;height:72px;border-radius:50%;border:3px solid var(--green);margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--green);transition:all .5s ease';if(circle)circle.textContent='✓';if(label)label.textContent='Perfekt. Jetzt loslegen.';return;}
    const ph=phases[phaseIdx];
    if(circle){circle.textContent=ph.text;circle.style.cssText=`width:72px;height:72px;border-radius:50%;border:3px solid ${ph.color};margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:12px;color:${ph.color};transform:${ph.scale};transition:all .5s ease`;}
    if(label)label.textContent='Atemzug '+(breathNum+1)+' von 5';
    _orBreathInterval=setTimeout(()=>{
      phaseIdx=(phaseIdx+1)%3;
      if(phaseIdx===0)breathNum++;
      runPhase();
    },ph.dur);
  }
  runPhase();
}
function closeOutreachReset(){
  clearInterval(_orBreathInterval);
  document.getElementById('outreach-reset-modal')?.classList.remove('active');
  renderOutreachStateBanner();
}

// ── CRITICAL PRIORITY ─────────────────────────────────────────────────────────
function getCriticalPriority(){return load(SK.criticalPriority,{active:false,title:'',deadline:'',note:''});}
function renderCriticalPriority(){
  const el=document.getElementById('critical-priority-card');if(!el)return;
  const cp=getCriticalPriority();
  if(!cp.active||!cp.title){el.style.display='none';return;}
  el.style.display='block';
  const today=new Date();today.setHours(0,0,0,0);
  const deadline=cp.deadline?new Date(cp.deadline+'T12:00:00'):null;
  const daysLeft=deadline?Math.ceil((deadline-today)/(864e5)):null;
  const overdue=daysLeft!==null&&daysLeft<0;
  const urgentColor=overdue?'var(--red)':'var(--amber)';
  const countdownHtml=daysLeft!==null?`<span style="font-size:22px;font-weight:800;color:${urgentColor}">${overdue?'ÜBERFÄLLIG':'Noch '+daysLeft+' Tag'+(Math.abs(daysLeft)!==1?'e':'')}</span>`:'';
  el.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
      <div style="font-size:11px;font-weight:700;color:${urgentColor};letter-spacing:.08em">⚠ KRITISCHE PRIORITÄT</div>
      <button onclick="openCriticalPriorityEdit()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:14px;padding:0" title="Bearbeiten">✎</button>
    </div>
    <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px">${esc(cp.title)}</div>
    ${countdownHtml}
    ${cp.note?`<div style="font-size:12px;color:var(--muted);margin-top:6px">${esc(cp.note)}</div>`:''}
    <button onclick="clearCriticalPriority()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:11px;margin-top:10px;padding:0">✓ Erledigt — entfernen</button>
  `;
}
function openCriticalPriorityEdit(){
  const cp=getCriticalPriority();
  const modal=document.getElementById('critical-priority-modal');if(!modal)return;
  document.getElementById('cp-title').value=cp.title||'';
  document.getElementById('cp-deadline').value=cp.deadline||'';
  document.getElementById('cp-note').value=cp.note||'';
  modal.classList.add('active');
}
function saveCriticalPriority(){
  const title=(document.getElementById('cp-title')?.value||'').trim();
  const deadline=document.getElementById('cp-deadline')?.value||'';
  const note=(document.getElementById('cp-note')?.value||'').trim();
  save(SK.criticalPriority,{active:!!title,title,deadline,note});
  document.getElementById('critical-priority-modal')?.classList.remove('active');
  renderCriticalPriority();
}
function clearCriticalPriority(){
  save(SK.criticalPriority,{active:false,title:'',deadline:'',note:''});
  renderCriticalPriority();
}

// ── RENDER ALL ────────────────────────────────────────────────────────────────
function renderAll(){
  renderMission();renderPipeline();renderTemplates();renderStarred();
  updateWeekStats();renderPastReviews();renderFunnel();renderPipelineSnap();renderStart();renderZiele();
  renderReasonCards();renderXPBar();renderMorningRitual();renderStateLog();renderManifesto();renderAffirmations();
  renderAchFloatWidget();updateNavDots();
  renderDailyWisdom();renderOutreachStateBanner();renderCriticalPriority();
}

// ── ACHIEVEMENT FLOAT WIDGET ──────────────────────────────────────────────────
function renderAchFloatWidget(){
  const lvlEl=document.getElementById('ach-float-level');
  const cntEl=document.getElementById('ach-float-count');
  if(!lvlEl||!cntEl)return;
  const xpData=getXP();const lvl=computeLevel(xpData.total);
  lvlEl.textContent='Lv. '+lvl.level;
  const milestones=getMilestones();
  const sys=milestones.filter(ms=>ms.system);
  cntEl.textContent=sys.filter(ms=>ms.done).length+' / '+sys.length;
}

function openAchievementOverlay(){
  const overlay=document.getElementById('ach-overlay');
  if(!overlay)return;
  overlay.classList.add('active');
  renderMilestones('ach-overlay-list');
  const xpData=getXP();const lvl=computeLevel(xpData.total);
  const xpEl=document.getElementById('ach-overlay-xp');
  if(xpEl)xpEl.innerHTML='<span style="font-size:13px;color:var(--amber)">⚡ Level '+lvl.level+' — '+lvl.name+' · '+xpData.total+' XP</span>';
}

function closeAchievementOverlay(){
  document.getElementById('ach-overlay')?.classList.remove('active');
}

// ── DONE ON PAPER ─────────────────────────────────────────────────────────────
function doneOnPaper(type){
  const btnId=type==='contracts'?'paper-done-contracts':'paper-done-gratitude';
  const inputsId=type==='contracts'?'contracts-inputs':'gratitude-inputs';
  const btn=document.getElementById(btnId);
  const inputsEl=document.getElementById(inputsId);
  if(!btn)return;
  const isCollapsed=inputsEl?.classList.contains('collapsed');
  if(isCollapsed){
    inputsEl.classList.remove('collapsed');
    btn.textContent=type==='contracts'?'✍️ Auf Papier +15 XP':'✍️ Auf Papier gemacht +10 XP';
    return;
  }
  if(inputsEl)inputsEl.classList.add('collapsed');
  const wasAlreadyDone=btn.classList.contains('done');
  btn.classList.add('done');
  btn.textContent='✍️ Papier ✓ — aufklappen';
  if(!wasAlreadyDone){
    const xp=type==='contracts'?15:10;
    awardXP(xp);
    showXPToast('+'+xp+' XP','✍️',type==='contracts'?'Tagesverträge auf Papier!':'Dankbarkeit auf Papier!');
    const pr=load(SK.paperRitual,{count:0,lastDate:null,todayTypes:[]});
    const today=todayStr();
    if(pr.lastDate!==today){pr.count=(pr.count||0)+1;pr.lastDate=today;pr.todayTypes=[type];}
    else if(!pr.todayTypes.includes(type)){pr.todayTypes.push(type);}
    save(SK.paperRitual,pr);
    setTimeout(checkAutoAchievements,100);
  }
}
function restorePaperButtons(){
  const pr=load(SK.paperRitual,{count:0,lastDate:null,todayTypes:[]});
  if(pr.lastDate===todayStr()&&pr.todayTypes){
    pr.todayTypes.forEach(type=>{
      const btnId=type==='contracts'?'paper-done-contracts':'paper-done-gratitude';
      const inputsId=type==='contracts'?'contracts-inputs':'gratitude-inputs';
      const btn=document.getElementById(btnId);
      const inputsEl=document.getElementById(inputsId);
      if(btn){
        btn.classList.add('done');
        btn.textContent='✍️ Papier ✓ — aufklappen';
        if(inputsEl)inputsEl.classList.add('collapsed');
      }
    });
  }
}

// ── TOGGLE TAGESPLAN ──────────────────────────────────────────────────────────
function toggleTagesplan(){
  const section=document.getElementById('tagesplan-section');
  const toggle=document.getElementById('tagesplan-toggle');
  if(!section||!toggle)return;
  const isOpen=section.classList.contains('open');
  section.classList.toggle('open',!isOpen);
  toggle.classList.toggle('open',!isOpen);
  if(!isOpen)renderTagesplan();
}

// ── GOOGLE DRIVE SYNC (removed — IndexedDB backup is used instead) ────────────

// ── SETTINGS ─────────────────────────────────────────────────────────────────
function getSettings(){
  const defaults={dailyTarget:20,stateReminderHours:4,xpPenalty:10,defaultFollowUp:3,alarmTimesEnabled:true,alarmTimes:['11:00','15:00','18:00']};
  return Object.assign({},defaults,load(SK.settings,{}));
}
function openSettings(){
  const s=getSettings();
  const el=document.getElementById('settings-overlay');if(!el)return;
  const tEl=document.getElementById('st-daily');
  const iEl=document.getElementById('st-state-int');
  const pEl=document.getElementById('st-penalty');
  const fuEl=document.getElementById('st-followup');
  if(tEl)tEl.value=s.dailyTarget;
  if(iEl)iEl.value=s.stateReminderHours;
  if(pEl)pEl.value=s.xpPenalty;
  if(fuEl)fuEl.value=s.defaultFollowUp||3;
  const atEl=document.getElementById('st-alarm-times');
  if(atEl)atEl.checked=!!s.alarmTimesEnabled;
  const sb=getSupabaseSettings();
  const sbUrl=document.getElementById('st-sb-url');
  const sbKey=document.getElementById('st-sb-key');
  const sbOn=document.getElementById('st-sb-enabled');
  if(sbUrl)sbUrl.value=sb.url||'';
  if(sbKey)sbKey.value=sb.key||'';
  const sbId=document.getElementById('st-sb-id');
  if(sbId)sbId.value=sb.id||'main';
  if(sbOn)sbOn.checked=!!sb.enabled;
  _updateSyncStatus();
  el.classList.add('active');
}
function closeSettings(){
  document.getElementById('settings-overlay')?.classList.remove('active');
}
function saveSettings(){
  const dailyTarget=parseInt(document.getElementById('st-daily')?.value)||20;
  const s={
    dailyTarget,
    stateReminderHours:parseInt(document.getElementById('st-state-int')?.value)||4,
    xpPenalty:parseInt(document.getElementById('st-penalty')?.value)||10,
    defaultFollowUp:parseInt(document.getElementById('st-followup')?.value)||3,
    alarmTimesEnabled:!!(document.getElementById('st-alarm-times')?.checked),
    alarmTimes:['11:00','15:00','18:00']
  };
  save(SK.settings,s);
  const sbUrl=(document.getElementById('st-sb-url')?.value||'').trim();
  const sbKey=(document.getElementById('st-sb-key')?.value||'').trim();
  const sbId=(document.getElementById('st-sb-id')?.value||'main').trim()||'main';
  const sbEnabled=!!(document.getElementById('st-sb-enabled')?.checked);
  localStorage.setItem(SK.supabaseSettings,JSON.stringify({url:sbUrl,key:sbKey,id:sbId,enabled:sbEnabled}));
  // also persist dailyTarget into mission so renderStart picks it up
  const m=getMission();m.dailyTarget=dailyTarget;save(SK.mission,m);
  closeSettings();
  showXPToast('Gespeichert','⚙️','Einstellungen übernommen');
  if(sbEnabled&&sbUrl&&sbKey)syncToSupabase();
  renderStart();
}

// ── STATE POPUP ───────────────────────────────────────────────────────────────
function updateStatePopupDisplay(val){
  const el=document.getElementById('sp-num');if(el)el.textContent=val;
}
function submitStatePopup(){
  const slider=document.getElementById('sp-slider');if(!slider)return;
  const val=parseInt(slider.value);
  const tags=[...document.querySelectorAll('#sp-tags .state-tag.active')].map(t=>t.dataset.tag);
  const note=(document.getElementById('sp-note')?.value||'').trim();
  const stateLog=getStateLog();
  stateLog.push({ts:Date.now(),rating:val,tags,note});
  save(SK.stateLog,stateLog);
  save(SK.lastStatePopup,new Date().toISOString());
  _clearStateGate();
  document.getElementById('state-popup')?.classList.remove('active');
  document.querySelectorAll('#sp-tags .state-tag').forEach(t=>t.classList.remove('active'));
  const noteEl=document.getElementById('sp-note');if(noteEl)noteEl.value='';
  awardXP(5);
  showXPToast('+5 XP','📊','State geloggt: '+val+'/10');
  setTimeout(checkAutoAchievements,100);
  renderStateLog();
  renderOutreachStateBanner();
}
function skipStatePopup(){
  if(_stateGated)return;
  const penalty=getSettings().xpPenalty;
  const xpData=getXP();
  xpData.total=Math.max(0,xpData.total-penalty);
  save(SK.xp,xpData);
  save(SK.lastStatePopup,new Date().toISOString());
  document.getElementById('state-popup')?.classList.remove('active');
  showXPToast('-'+penalty+' XP','⚠️','State übersprungen — Kosten der Vermeidung');
  renderXPBar();
}
function checkStatePopup(){
  const mr=getMorningRitual();
  if(mr.date!==todayStr()||!mr.stateRating)return;
  const s=getSettings();
  if(s.stateReminderHours===0)return;
  const lastStr=load(SK.lastStatePopup,null);
  if(lastStr){
    const diffHours=(Date.now()-new Date(lastStr).getTime())/3600000;
    if(diffHours<s.stateReminderHours)return;
  }
  document.getElementById('state-popup')?.classList.add('active');
}
function checkSpecificTimeAlarms(){
  const mr=getMorningRitual();
  if(mr.date!==todayStr()||!mr.stateRating)return;
  const s=getSettings();
  if(!s.alarmTimesEnabled||!s.alarmTimes||!s.alarmTimes.length)return;
  const now=new Date();
  const nowMinutes=now.getHours()*60+now.getMinutes();
  const today=todayStr();
  const fired=load(SK.firedAlarmsToday,{date:'',times:[]});
  if(fired.date!==today){fired.date=today;fired.times=[];}
  let triggered=false;
  for(const t of s.alarmTimes){
    if(fired.times.includes(t))continue;
    const [th,tm]=t.split(':').map(Number);
    const targetMinutes=th*60+tm;
    if(Math.abs(nowMinutes-targetMinutes)>3)continue;
    const lastStr=load(SK.lastStatePopup,null);
    if(lastStr&&(Date.now()-new Date(lastStr).getTime())<20*60*1000)continue;
    fired.times.push(t);
    triggered=true;
    break;
  }
  if(triggered){
    save(SK.firedAlarmsToday,fired);
    document.getElementById('state-popup')?.classList.add('active');
    if(Notification.permission==='granted'&&navigator.serviceWorker?.controller){
      navigator.serviceWorker.controller.postMessage({type:'SHOW_NOTIFICATION',title:'State Check-In 📊',body:'Wie ist dein State gerade? Nimm dir 30 Sekunden.'});
    }
  }
}
function scheduleSpecificTimeNotifications(){
  const s=getSettings();
  if(!s.alarmTimesEnabled||!s.alarmTimes||!s.alarmTimes.length)return;
  const now=new Date();
  const today=todayStr();
  const fired=load(SK.firedAlarmsToday,{date:'',times:[]});
  if(fired.date!==today)fired.times=[];
  for(const t of s.alarmTimes){
    if(fired.times.includes(t))continue;
    const [th,tm]=t.split(':').map(Number);
    const target=new Date();
    target.setHours(th,tm,0,0);
    const delayMs=target.getTime()-now.getTime();
    if(delayMs<=0)continue;
    setTimeout(()=>{
      const mr=getMorningRitual();
      if(mr.date!==todayStr()||!mr.stateRating)return;
      if(Notification.permission==='granted'&&navigator.serviceWorker?.controller){
        navigator.serviceWorker.controller.postMessage({type:'SHOW_NOTIFICATION',title:'State Check-In 📊',body:'Wie ist dein State gerade? 5 Atemzüge zuerst.'});
      }
      const f=load(SK.firedAlarmsToday,{date:todayStr(),times:[]});
      if(f.date!==todayStr()){f.date=todayStr();f.times=[];}
      if(!f.times.includes(t)){f.times.push(t);save(SK.firedAlarmsToday,f);}
      document.getElementById('state-popup')?.classList.add('active');
    },delayMs);
  }
}
let _stateGated=false;
function checkStateGate(){
  const s=getSettings();
  if(!s.alarmTimesEnabled||!s.alarmTimes||!s.alarmTimes.length)return;
  const mr=getMorningRitual();
  if(mr.date!==todayStr()||!mr.stateRating)return;
  const now=new Date();
  const nowMinutes=now.getHours()*60+now.getMinutes();
  const log=getStateLog();
  for(const t of s.alarmTimes){
    const [th,tm]=t.split(':').map(Number);
    const targetMinutes=th*60+tm;
    if(nowMinutes<targetMinutes)continue;
    const alarmTs=new Date();alarmTs.setHours(th,tm,0,0);
    const loggedAfter=log.some(e=>e.ts>=alarmTs.getTime());
    if(!loggedAfter){
      _showStatePopupGated();
      return;
    }
  }
}
function _showStatePopupGated(){
  _stateGated=true;
  const popup=document.getElementById('state-popup');
  if(!popup)return;
  popup.classList.add('active','gated');
  const tag=popup.querySelector('.state-popup-tag');
  if(tag)tag.textContent='State-Rating erforderlich';
}
function _clearStateGate(){
  _stateGated=false;
  const popup=document.getElementById('state-popup');
  if(!popup)return;
  popup.classList.remove('gated');
  const tag=popup.querySelector('.state-popup-tag');
  if(tag)tag.textContent='State Check-In';
}
function startStatePopupTimer(){
  checkStatePopup();
  checkSpecificTimeAlarms();
  checkStateGate();
  scheduleSpecificTimeNotifications();
  setInterval(checkStatePopup,300000);
  setInterval(checkSpecificTimeAlarms,60000);
  setInterval(checkStateGate,60000);
  window.addEventListener('focus',()=>{checkStatePopup();checkSpecificTimeAlarms();checkStateGate();});
}

// ── ONCE-A-DAY LOCK ───────────────────────────────────────────────────────────
function getDailyLock(){
  return load(SK.dailyLock,{date:null,gratitudeDone:false,contractsDone:false});
}
function setDailyTaskDone(type){
  const lock=getDailyLock(),today=todayStr();
  if(lock.date!==today){lock.date=today;lock.gratitudeDone=false;lock.contractsDone=false;}
  if(type==='gratitude')lock.gratitudeDone=true;
  if(type==='contracts')lock.contractsDone=true;
  save(SK.dailyLock,lock);
}
function applyMorningPenalties(){
  const today=todayStr();
  if(load(SK.penaltyApplied,null)===today)return;
  save(SK.penaltyApplied,today);
  const lock=getDailyLock();
  const yesterday=yesterdayStr();
  if(lock.date!==yesterday)return;
  const penalty=getSettings().xpPenalty;
  const missed=[];
  if(!lock.gratitudeDone)missed.push('Dankbarkeit');
  if(!lock.contractsDone)missed.push('Tagesverträge');
  if(!missed.length)return;
  const total=penalty*missed.length;
  const xpData=getXP();
  xpData.total=Math.max(0,xpData.total-total);
  save(SK.xp,xpData);
  setTimeout(()=>{
    showXPToast('-'+total+' XP','⚠️','Gestern verpasst: '+missed.join(' + '));
    renderXPBar();
  },1200);
}

// ── INDEXEDDB BACKUP ──────────────────────────────────────────────────────────
let _idb=null;
function idbInit(){
  if(!window.indexedDB)return;
  const req=indexedDB.open('life_os_backup',1);
  req.onupgradeneeded=e=>{
    if(!e.target.result.objectStoreNames.contains('kv'))
      e.target.result.createObjectStore('kv',{keyPath:'k'});
  };
  req.onsuccess=e=>{
    _idb=e.target.result;
    idbRestore();
    setInterval(idbSave,30000);
  };
}
function idbSave(){
  if(!_idb)return;
  const tx=_idb.transaction('kv','readwrite');
  const store=tx.objectStore('kv');
  Object.values(SK).forEach(k=>{
    const v=localStorage.getItem(k);
    if(v!==null)store.put({k,v});
  });
}
function idbRestore(){
  if(!_idb||localStorage.getItem('fpcm_prospects'))return;
  const tx=_idb.transaction('kv','readonly');
  const store=tx.objectStore('kv');
  let count=0;
  store.openCursor().onsuccess=e=>{
    const cur=e.target.result;
    if(cur){localStorage.setItem(cur.value.k,cur.value.v);count++;cur.continue();}
    else if(count>0){renderAll();showXPToast('Daten wiederhergestellt','💾','IndexedDB Restore');}
  };
}

// ── NAV DOTS ─────────────────────────────────────────────────────────────────
function updateNavDots(){
  const today=todayStr();
  const prospects=getProspects();
  const hasFu=prospects.some(p=>
    (p.stage==='dm_sent'&&p.followUpAt&&today>=p.followUpAt)||
    p.stage==='followup'||p.stage==='loom'||
    (p.stage==='loom_sent'&&p.followUpAt&&today>=p.followUpAt)
  );
  const fuDot=document.getElementById('nav-dot-outreach');
  if(fuDot)fuDot.style.display=hasFu?'block':'none';
  const mr=getMorningRitual();
  const startDot=document.getElementById('nav-dot-start');
  if(startDot)startDot.style.display=(mr.date===today&&mr.stateRating)?'none':'block';
}

// ── INIT ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  renderMission();
  renderPipeline();
  renderTemplates();
  renderStarred();
  updateWeekStats();
  renderPastReviews();
  renderStart();
  renderZiele();
  renderReasonCards();
  renderXPBar();
  renderMorningRitual();
  renderStateLog();
  renderManifesto();
  renderAffirmations();
  renderAchFloatWidget();
  startTimelineUpdater();
  setTimeout(checkAutoAchievements,200);
  applyMorningPenalties();
  idbInit();
  startStatePopupTimer();
  updateNavDots();
  syncFromSupabase().catch(()=>{});
  _updateSyncStatus();
  renderDailyWisdom();renderOutreachStateBanner();renderCriticalPriority();
  scheduleStateNotification();
  checkStateGate();
});

// ── SUPABASE CLOUD SYNC ───────────────────────────────────────────────────────
function getDeviceId(){
  let id=localStorage.getItem(SK.deviceId);
  if(!id){id=crypto.randomUUID();localStorage.setItem(SK.deviceId,id);}
  return id;
}
function getSupabaseSettings(){
  return load(SK.supabaseSettings,{url:'',key:'',id:'main',enabled:false});
}
function _getSyncRowId(){
  const s=getSupabaseSettings();
  return (s.id||'main').trim()||'main';
}
function _mergeById(localArr,remoteArr,idFn,tsFn){
  const map={};
  (remoteArr||[]).forEach(item=>{map[idFn(item)]=item;});
  (localArr||[]).forEach(item=>{
    const key=idFn(item);
    if(!map[key]){map[key]=item;}
    else{const lt=tsFn(item),rt=tsFn(map[key]);if(lt>rt)map[key]=item;}
  });
  return Object.values(map);
}
function _mergeByField(localArr,remoteArr,field){
  const seen=new Set();const result=[];
  [...(remoteArr||[]),...(localArr||[])].forEach(item=>{
    const k=item[field];if(!seen.has(k)){seen.add(k);result.push(item);}
  });
  return result.sort((a,b)=>{
    const av=typeof a[field]==='number'?a[field]:new Date(a[field]).getTime();
    const bv=typeof b[field]==='number'?b[field]:new Date(b[field]).getTime();
    return av-bv;
  });
}
function _mergeDays(local,remote){
  const merged={...remote};
  Object.entries(local||{}).forEach(([date,entries])=>{
    if(!merged[date]){merged[date]=entries;}
    else{const tsSet=new Set(merged[date].map(e=>e.timestamp));(entries||[]).forEach(e=>{if(!tsSet.has(e.timestamp))merged[date].push(e);});}
  });
  return merged;
}
function _mergeMilestones(localArr,remoteArr){
  const map={};
  (remoteArr||[]).forEach(m=>{map[m.id]={...m};});
  (localArr||[]).forEach(m=>{
    if(!map[m.id]){map[m.id]=m;}
    else if(m.done&&!map[m.id].done){map[m.id].done=true;map[m.id].doneDate=m.doneDate||map[m.id].doneDate;}
  });
  return Object.values(map);
}
function _mergeDailyLock(local,remote){
  if(!local&&!remote)return{date:null,gratitudeDone:false,contractsDone:false};
  if(!local)return remote;if(!remote)return local;
  if(local.date!==remote.date)return(local.date||'')>(remote.date||'')?local:remote;
  return{date:local.date,gratitudeDone:!!(local.gratitudeDone||remote.gratitudeDone),contractsDone:!!(local.contractsDone||remote.contractsDone),breathingDone:!!(local.breathingDone||remote.breathingDone)};
}
function mergeData(local,remote){
  const merged={...remote};
  const pTsFn=p=>p.history&&p.history.length?Math.max(...p.history.map(h=>h.ts||0)):(p.createdAt?new Date(p.createdAt).getTime():0);
  merged['fpcm_prospects']=_mergeById(local['fpcm_prospects'],remote['fpcm_prospects'],p=>p.id,pTsFn);
  merged['phq_stateLog']=_mergeByField(local['phq_stateLog'],remote['phq_stateLog'],'ts');
  merged['fpcm_days']=_mergeDays(local['fpcm_days'],remote['fpcm_days']);
  merged['fpcm_reviews']=_mergeByField(local['fpcm_reviews'],remote['fpcm_reviews'],'date');
  merged['fpcm_milestones']=_mergeMilestones(local['fpcm_milestones'],remote['fpcm_milestones']);
  const lxp=(local['fpcm_xp']||{total:0}).total||0;
  const rxp=(remote['fpcm_xp']||{total:0}).total||0;
  merged['fpcm_xp']={total:Math.max(lxp,rxp)};
  merged['life_dailyLock']=_mergeDailyLock(local['life_dailyLock'],remote['life_dailyLock']);
  const lp=local['life_lastStatePopup'],rp=remote['life_lastStatePopup'];
  merged['life_lastStatePopup']=lp&&rp?(new Date(lp)>new Date(rp)?lp:rp):(lp||rp||null);
  return merged;
}
function exportAllData(){
  const out={_exportedAt:new Date().toISOString()};
  Object.values(SK).forEach(k=>{
    try{const v=localStorage.getItem(k);if(v!==null)out[k]=JSON.parse(v);}catch(e){}
  });
  return out;
}
function importAllData(blob){
  const skip=new Set([SK.deviceId,SK.supabaseSettings,'_exportedAt']);
  Object.entries(blob).forEach(([k,v])=>{
    if(!skip.has(k)&&v!==undefined)localStorage.setItem(k,JSON.stringify(v));
  });
}
async function _pushToSupabase(s){
  const rowId=_getSyncRowId();
  const now=new Date().toISOString();
  const res=await fetch(`${s.url}/rest/v1/life_os_sync`,{
    method:'POST',
    headers:{apikey:s.key,Authorization:`Bearer ${s.key}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},
    body:JSON.stringify({id:rowId,data:exportAllData(),updated_at:now})
  });
  if(!res.ok)throw new Error('HTTP '+res.status);
  localStorage.setItem('lo_last_synced',now);
  _updateSyncStatus();
}
async function syncToSupabase(){
  const s=getSupabaseSettings();
  if(!s.enabled||!s.url||!s.key)return;
  try{await _pushToSupabase(s);}catch(e){}
}
async function forcePushToSupabase(){
  const s=getSupabaseSettings();
  if(!s.url||!s.key){_setSyncStatus('Bitte URL und Key eingeben.');return;}
  _setSyncStatus('Sichert…');
  try{
    await _pushToSupabase(s);
    _setSyncStatus('✓ Gesichert — '+new Date().toLocaleTimeString('de-DE'));
  }catch(e){_setSyncStatus('Fehler: '+(e.message||'Unbekannt'));}
}
async function cleanupSupabaseRows(){
  const s=getSupabaseSettings();
  if(!s.url||!s.key){_setSyncStatus('Bitte URL und Key eingeben.');return;}
  const rowId=_getSyncRowId();
  _setSyncStatus('Räumt auf…');
  try{
    const res=await fetch(`${s.url}/rest/v1/life_os_sync?id=neq.${encodeURIComponent(rowId)}`,{
      method:'DELETE',
      headers:{apikey:s.key,Authorization:`Bearer ${s.key}`,Prefer:'return=minimal'}
    });
    if(!res.ok){_setSyncStatus('Fehler: HTTP '+res.status);return;}
    _setSyncStatus('✓ Alte Einträge gelöscht');
  }catch(e){_setSyncStatus('Fehler: '+(e.message||'Unbekannt'));}
}
async function forceLoadFromSupabase(){
  const s=getSupabaseSettings();
  if(!s.url||!s.key){_setSyncStatus('Bitte URL und Key eingeben.');return;}
  _setSyncStatus('Lädt…');
  try{
    const rowId=_getSyncRowId();
    const res=await fetch(`${s.url}/rest/v1/life_os_sync?id=eq.${encodeURIComponent(rowId)}&select=data,updated_at`,{
      headers:{apikey:s.key,Authorization:`Bearer ${s.key}`}
    });
    if(!res.ok){_setSyncStatus('Fehler: HTTP '+res.status);return;}
    const rows=await res.json();
    if(!Array.isArray(rows)||!rows.length){
      _setSyncStatus('Keine Daten gefunden — zuerst von einem anderen Gerät hochladen.');
      return;
    }
    const merged=mergeData(exportAllData(),rows[0].data);
    importAllData(merged);
    localStorage.setItem('lo_last_synced',rows[0].updated_at);
    _setSyncStatus('✓ Zusammengeführt — Stand: '+new Date(rows[0].updated_at).toLocaleString('de-DE'));
    setTimeout(()=>location.reload(),900);
  }catch(e){_setSyncStatus('Fehler: '+(e.message||'Unbekannt'));}
}
async function syncFromSupabase(){
  const s=getSupabaseSettings();
  if(!s.enabled||!s.url||!s.key)return;
  try{
    const rowId=_getSyncRowId();
    const res=await fetch(`${s.url}/rest/v1/life_os_sync?id=eq.${encodeURIComponent(rowId)}&select=data,updated_at`,{
      headers:{apikey:s.key,Authorization:`Bearer ${s.key}`}
    });
    const rows=await res.json();
    if(!Array.isArray(rows)||!rows.length){
      await _pushToSupabase(s);
      return;
    }
    const remoteTs=new Date(rows[0].updated_at).getTime();
    const localTs=new Date(localStorage.getItem('lo_last_synced')||0).getTime();
    if(remoteTs>localTs){
      const merged=mergeData(exportAllData(),rows[0].data);
      importAllData(merged);
      localStorage.setItem('lo_last_synced',rows[0].updated_at);
      await _pushToSupabase(s);
      location.reload();
    } else {
      await _pushToSupabase(s);
    }
  }catch(e){}
}
function _setSyncStatus(msg){
  const el=document.getElementById('sync-status');if(el)el.textContent=msg;
}
function _updateSyncStatus(){
  const ts=localStorage.getItem('lo_last_synced');
  _setSyncStatus(ts?'Zuletzt sync: '+new Date(ts).toLocaleString('de-DE'):'Noch nicht synchronisiert');
}
let _syncTimer=null;
function _scheduleSyncToSupabase(){
  const s=getSupabaseSettings();
  if(!s.enabled||!s.url||!s.key)return;
  clearTimeout(_syncTimer);
  _syncTimer=setTimeout(syncToSupabase,5000);
}
