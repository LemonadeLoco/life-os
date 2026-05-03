
// ── STORAGE ───────────────────────────────────────────────────────────────────
const SK={
  prospects:'fpcm_prospects',templates:'fpcm_templates',mission:'fpcm_mission',
  days:'fpcm_days',streak:'fpcm_streak',reviews:'fpcm_reviews',starred:'fpcm_starred',
  nonneg:'fpcm_nonneg',milestones:'fpcm_milestones',content:'fpcm_content',
  xp:'fpcm_xp',reasons:'fpcm_reasons',nnStreak:'fpcm_nnStreak',
  driveToken:'fpcm_driveToken',driveFileId:'fpcm_driveFileId',driveClientId:'fpcm_driveClientId',
  stateLog:'phq_stateLog',morningRitual:'phq_morningRitual',manifesto:'phq_manifesto',affirmations:'phq_affirmations',
  paperRitual:'phq_paperRitual',morningStreak:'phq_morningStreak',perfectDays:'phq_perfectDays'
};
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v!==null?JSON.parse(v):d;}catch(e){return d;}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
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
  {level:1,name:'Cold Caller',min:0,max:49},
  {level:2,name:'DM Sender',min:50,max:149},
  {level:3,name:'Pipeline Builder',min:150,max:349},
  {level:4,name:'Reply Hunter',min:350,max:699},
  {level:5,name:'Closer',min:700,max:1199},
  {level:6,name:'Agency Pro',min:1200,max:1999},
  {level:7,name:'Frequency Master',min:2000,max:3499},
  {level:8,name:'Life Architect',min:3500,max:Infinity}
];
function computeLevel(xp){
  const l=LEVELS.find(l=>xp<=l.max)||LEVELS[LEVELS.length-1];
  const nextL=LEVELS[l.level]||null;
  const pct=nextL?Math.min(100,Math.round(((xp-l.min)/(nextL.min-l.min))*100)):100;
  return{level:l.level,name:l.name,pct,nextXP:nextL?nextL.min:null,prevXP:l.min};
}
function getXP(){return load(SK.xp,{total:0,level:1});}
let _toastTimer=null;
function showXPToast(title,icon,sub){
  const el=document.getElementById('xp-toast');if(!el)return;
  const iconEl=document.getElementById('xp-toast-icon');
  const titleEl=document.getElementById('xp-toast-title');
  const subEl=document.getElementById('xp-toast-sub');
  if(iconEl)iconEl.textContent=icon||'⚡';
  if(titleEl)titleEl.textContent=title;
  if(subEl)subEl.textContent=sub||'';
  el.classList.add('visible');
  if(_toastTimer)clearTimeout(_toastTimer);
  _toastTimer=setTimeout(()=>el.classList.remove('visible'),3500);
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
  setTimeout(checkAutoAchievements,50);
}

// ── PROSPECTS ─────────────────────────────────────────────────────────────────
function getProspects(){return load(SK.prospects,[]);}
function saveProspects(p){save(SK.prospects,p);}

const STAGE_LABELS={dm_sent:'DM Gesendet',followup:'Follow-up',loom:'Loom',loom_sent:'Loom Gesendet',call_booked:'Call Gebucht',won:'Gewonnen',lost:'Lost'};
const STAGE_ORDER=['dm_sent','followup','loom','loom_sent','call_booked','won','lost'];

function submitAddProspect(){
  const name=document.getElementById('ap-name').value.trim();
  if(!name){document.getElementById('ap-name').focus();return;}
  const type=document.getElementById('ap-type').value;
  const stage=document.getElementById('ap-stage').value;
  const notes=document.getElementById('ap-notes').value.trim();
  const today=todayStr();
  const fuDate=new Date();fuDate.setDate(fuDate.getDate()+3);
  const prospect={
    id:Date.now().toString(),
    name,type,stage,notes,
    loomUrl:'',msgCount:0,links:[],
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
  if(newStage==='dm_sent'){
    const d=new Date();d.setDate(d.getDate()+3);
    p.followUpAt=d.toISOString().split('T')[0];
  }
  if(newStage==='loom_sent'){
    const d=new Date();d.setDate(d.getDate()+3);
    p.followUpAt=d.toISOString().split('T')[0];
  }
  saveProspects(prospects);
  if(newStage==='followup')incrementDailyCounter(p.name);
  expandedId=null;
  renderPipeline();
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
  const fuDue=prospects.filter(p=>isFollowupDue(p)).length;
  const loomSentDue=prospects.filter(p=>isLoomSentFollowupDue(p)).length;
  const loomCount=counts['loom']||0;
  const fuPill=document.querySelector('.sf-pill[data-filter="followup"]');
  const loomPill=document.querySelector('.sf-pill[data-filter="loom"]');
  const loomSentPill=document.querySelector('.sf-pill[data-filter="loom_sent"]');
  if(fuPill){fuPill.classList.toggle('alert',fuDue>0&&activeFilter!=='followup');}
  if(loomPill){loomPill.classList.toggle('alert',loomCount>0&&activeFilter!=='loom');}
  if(loomSentPill){loomSentPill.classList.toggle('alert',loomSentDue>0&&activeFilter!=='loom_sent');}
  const filtered=activeFilter==='all'?prospects:prospects.filter(p=>p.stage===activeFilter);
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
    const linkChips=(p.links&&p.links.length)?p.links.slice(0,3).map(u=>{const pl=detectPlatform(u);return`<span class="soc-badge ${pl.cls}" style="font-size:9px;padding:1px 5px">${pl.label}</span>`;}).join(''):'';
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
    const moveRow=document.createElement('div');
    moveRow.className='pr-move-row';
    const moveLbl=document.createElement('span');
    moveLbl.className='pr-move-lbl';moveLbl.textContent='Verschieben:';
    const moveSelect=document.createElement('select');
    moveSelect.className='pr-move-select';
    moveSelect.innerHTML='<option value="">Phase wählen…</option>'+
      STAGE_ORDER.filter(s=>s!==p.stage).map(s=>`<option value="${s}">${STAGE_LABELS[s]}</option>`).join('');
    moveSelect.onchange=function(){if(this.value){moveProspect(p.id,this.value);}};
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
  if(!all[today])all[today]={workout:false,meditation:false};
  const wasDone=!!all[today][key];
  all[today][key]=val;
  save(SK.nonneg,all);
  if(val&&!wasDone){
    awardXP(15);
    showXPToast('+15 XP','✅',key==='workout'?'Workout done!':'Meditation done!');
  }
  if(val&&all[today].workout&&all[today].meditation){
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

function renderStart(){
  const m=getMission();
  const days=getDays();
  const today=todayStr();
  const sent=(days[today]||[]).length;
  const target=m.dailyTarget||20;
  const isSunday=new Date().getDay()===0;
  const outreachDone=isSunday||sent>=target;
  const nn=getNonNeg();

  renderReasonCards();

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

  const fpEl=document.getElementById('fu-panel');
  const flEl=document.getElementById('fu-list');
  if(fpEl&&flEl){
    if(outreachDone){
      const prospects=getProspects();
      const fuP=prospects.filter(p=>
        (p.stage==='dm_sent'&&p.followUpAt&&today>=p.followUpAt)||
        p.stage==='followup'||p.stage==='loom'||
        (p.stage==='loom_sent'&&p.followUpAt&&today>=p.followUpAt)
      );
      if(fuP.length){
        fpEl.style.display='block';
        flEl.innerHTML='';
        fuP.forEach((p,i)=>{
          const div=document.createElement('div');
          div.style.cssText='padding:12px 0'+(i<fuP.length-1?';border-bottom:1px solid var(--border)':'');
          div.innerHTML=`<div style="display:flex;align-items:center;gap:10px">
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:14px">${esc(p.name)}</div>
              <div style="font-size:11px;color:var(--muted);margin-top:2px">${STAGE_LABELS[p.stage]||p.stage}${p.followUpAt&&p.stage==='dm_sent'?' · fällig '+fmtDate(p.followUpAt):''}</div>
            </div>
            <select onchange="quickMove('${p.id}',this.value)" style="background:var(--surface2);border:1px solid var(--border);border-radius:7px;color:var(--text);font-size:12px;padding:5px 8px;cursor:pointer;outline:none">
              <option value="">Nächster Schritt…</option>
              ${STAGE_ORDER.filter(s=>s!==p.stage).map(s=>`<option value="${s}">${STAGE_LABELS[s]}</option>`).join('')}
            </select>
          </div>`;
          flEl.appendChild(div);
        });
      } else {
        fpEl.style.display='none';
      }
    } else {
      fpEl.style.display='none';
    }
  }
}

function openClickUp(){
  window.open('https://app.clickup.com','_blank');
}

function quickMove(id,newStage){
  if(!newStage)return;
  moveProspect(id,newStage);
  renderStart();
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
    {id:'ms_lv3',    text:'Pipeline Builder',    xp:0,  icon:'🏗️',autoKey:'lv3',      rarity:'rare',     flavor:'Level 3 erreicht',                      system:true,done:false,doneDate:null},
    {id:'ms_lv5',    text:'Closer',              xp:0,  icon:'🎯',autoKey:'lv5',      rarity:'epic',     flavor:'Level 5 erreicht',                      system:true,done:false,doneDate:null},
    {id:'ms_lv8',    text:'Life Architect',      xp:0,  icon:'🏰',autoKey:'lv8',      rarity:'legendary',flavor:'Level 8 erreicht — das ist Seltenheit', system:true,done:false,doneDate:null},
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
    const flavorHtml=ms.flavor&&!ms.done?`<div class="ach-flavor">${esc(ms.flavor)}</div>`:'';
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
  const locked=sysAchs.filter(ms=>!ms.done).sort((a,b)=>(a.xp||50)-(b.xp||50));

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
    state1:getStateLog().length>=1,
    state10:getStateLog().length>=10,
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
    lv8:currentLevel>=8,
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
  const el=document.getElementById('zl-xp-bar');if(!el)return;
  const nextLabel=lvl.nextXP?' / '+lvl.nextXP+' XP':' XP (MAX)';
  el.innerHTML=`<div class="xp-bar-top"><span class="xp-bar-lvl">⚡ Level ${lvl.level} — ${lvl.name}</span><span class="xp-bar-num">${xpData.total}${nextLabel}</span></div><div class="xp-bar"><div class="xp-bar-fill" style="width:${lvl.pct}%"></div></div>`;
  const lvlEl=document.getElementById('mc-level');
  if(lvlEl){lvlEl.textContent='⚡ '+lvl.name+' · '+xpData.total+' XP';lvlEl.style.display='inline-flex';}
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
  const tags=[...document.querySelectorAll('#tab-start .state-tag.active')].map(t=>t.dataset.tag);
  const entry={ts:Date.now(),rating,note:(noteEl?.value||'').trim(),tags};
  const log=getStateLog();log.push(entry);save(SK.stateLog,log);
  if(noteEl)noteEl.value='';
  document.querySelectorAll('#tab-state .state-tag').forEach(t=>t.classList.remove('active'));
  awardXP(5);showXPToast('+5 XP','📊','State geloggt');
  renderStateLog();
  setTimeout(checkAutoAchievements,100);
}
function renderStateLog(){
  const log=getStateLog();
  const today=todayStr();
  const todayLog=log.filter(e=>new Date(e.ts).toISOString().split('T')[0]===today);
  const wrap=document.getElementById('state-today-log');
  if(!wrap)return;
  if(!todayLog.length){wrap.innerHTML='<div class="empty-state">Noch keine Einträge heute. Logge deinen State!</div>';return;}
  wrap.innerHTML=todayLog.slice().reverse().map(e=>{
    const t=new Date(e.ts);
    const timeStr=String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0');
    const tags=(e.tags||[]).map(tag=>`<span style="font-size:10px;padding:2px 7px;border-radius:4px;background:var(--surface);border:1px solid var(--border);margin-right:3px">${esc(tag)}</span>`).join('');
    const c=e.rating>=8?'var(--green)':e.rating>=6?'#facc15':e.rating>=4?'var(--amber)':'var(--red)';
    return `<div class="state-log-entry">
      <div class="state-log-time">${timeStr}</div>
      <div class="state-log-note">${e.note?esc(e.note):'<span style="color:var(--muted);font-style:italic">kein Text</span>'}<div style="margin-top:4px">${tags}</div></div>
      <div class="state-log-rating" style="color:${c}">${e.rating}</div>
    </div>`;
  }).join('');
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
}
function saveMorningContracts(){
  const mr=getMorningRitual(),today=todayStr();
  if(mr.date!==today)mr.date=today;
  mr.contracts=[0,1,2].map(i=>({text:document.getElementById('contract-'+i)?.value||'',done:document.getElementById('contract-cb-'+i)?.checked||false}));
  save(SK.morningRitual,mr);
}
function completeMorningRitual(){
  const mr=getMorningRitual();
  if(!mr.stateRating){alert('Bitte zuerst deinen State bewerten (Schritt 1).');return;}
  saveMorningGratitudes();saveMorningContracts();
  const today=todayStr();
  const mStreak=load(SK.morningStreak,{current:0,best:0,lastDate:null});
  if(mStreak.lastDate!==today){
    mStreak.current=mStreak.lastDate===yesterdayStr()?mStreak.current+1:1;
    mStreak.best=Math.max(mStreak.best,mStreak.current);
    mStreak.lastDate=today;
    save(SK.morningStreak,mStreak);
  }
  awardXP(20);showXPToast('+20 XP','🌅','Morgenritual abgeschlossen!');
  setTimeout(checkAutoAchievements,100);
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
}

// ── MANIFESTO ─────────────────────────────────────────────────────────────────
function getManifesto(){return load(SK.manifesto,'');}
function saveManifesto(){
  const ta=document.getElementById('manifesto-ta');
  if(!ta||!ta.value.trim())return;
  save(SK.manifesto,ta.value);
  awardXP(50);showXPToast('+50 XP','📜','Manifesto gespeichert!');
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
  document.querySelectorAll('.tab-btn').forEach((btn,i)=>btn.classList.toggle('active',TABS[i]===tab));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  if(tab==='review'){updateWeekStats();renderPastReviews();renderFunnel();renderPipelineSnap();document.getElementById('sat-banner').classList.toggle('visible',new Date().getDay()===6);}
  if(tab==='mindset'){renderMission();renderAffirmations();}
  if(tab==='outreach'){renderMission();renderPipeline();renderTemplates();}
  if(tab==='start')renderStart();
  if(tab==='ziele'){renderZiele();renderManifesto();}
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

// ── RENDER ALL ────────────────────────────────────────────────────────────────
function renderAll(){
  renderMission();renderPipeline();renderTemplates();renderStarred();
  updateWeekStats();renderPastReviews();renderFunnel();renderPipelineSnap();renderStart();renderZiele();
  renderReasonCards();renderXPBar();renderMorningRitual();renderStateLog();renderManifesto();renderAffirmations();
  renderAchFloatWidget();
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
  const btn=document.getElementById(btnId);
  if(!btn||btn.classList.contains('done'))return;
  btn.classList.add('done');
  btn.textContent='✍️ Papier ✓';
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
function restorePaperButtons(){
  const pr=load(SK.paperRitual,{count:0,lastDate:null,todayTypes:[]});
  if(pr.lastDate===todayStr()&&pr.todayTypes){
    pr.todayTypes.forEach(type=>{
      const btnId=type==='contracts'?'paper-done-contracts':'paper-done-gratitude';
      const btn=document.getElementById(btnId);
      if(btn){btn.classList.add('done');btn.textContent='✍️ Papier ✓';}
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

// ── GOOGLE DRIVE SYNC ─────────────────────────────────────────────────────────
let _driveAutoTimer=null;

function getDriveToken(){
  const t=load(SK.driveToken,null);
  if(!t||Date.now()>t.expiry)return null;
  return t.token;
}

function connectDrive(){
  if(typeof google==='undefined'||!google.accounts){
    alert('Google Identity Services noch nicht geladen. Bitte Seite neu laden und erneut versuchen.');return;
  }
  const clientId=(document.getElementById('drive-client-id')?.value||'').trim();
  if(!clientId){alert('Bitte zuerst eine Google Client ID eingeben.');return;}
  google.accounts.oauth2.initTokenClient({
    client_id:clientId,
    scope:'https://www.googleapis.com/auth/drive.file',
    callback:(resp)=>{
      if(resp.error){alert('Auth fehlgeschlagen: '+resp.error);return;}
      const expiry=Date.now()+(resp.expires_in||3600)*1000-60000;
      save(SK.driveToken,{token:resp.access_token,expiry});
      save(SK.driveClientId,clientId);
      renderDriveStatus();
      driveAutoSave();
      startDriveAutoTimer();
      showXPToast('☁ Drive verbunden','☁','Auto-Sync aktiv');
    }
  }).requestAccessToken();
}

function disconnectDrive(){
  save(SK.driveToken,null);
  if(_driveAutoTimer){clearInterval(_driveAutoTimer);_driveAutoTimer=null;}
  renderDriveStatus();
}

async function driveAutoSave(){
  const token=getDriveToken();
  if(!token){renderDriveStatus();return;}
  const data={};
  Object.values(SK).forEach(k=>{const v=localStorage.getItem(k);if(v!==null)try{data[k]=JSON.parse(v);}catch(e){data[k]=v;}});
  const blob=new Blob([JSON.stringify(data)],{type:'application/json'});
  const fileId=load(SK.driveFileId,null);
  const badge=document.getElementById('drive-sync-badge');
  try{
    let id;
    if(fileId){
      const r=await fetch('https://www.googleapis.com/upload/drive/v3/files/'+fileId+'?uploadType=media',
        {method:'PATCH',headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},body:blob});
      if(r.status===401){save(SK.driveToken,null);renderDriveStatus();return;}
      if(!r.ok)throw new Error('Update failed '+r.status);
      id=fileId;
    } else {
      const meta={name:'outreach-agent-backup.json',description:'Auto-backup von Outreach Agent'};
      const form=new FormData();
      form.append('metadata',new Blob([JSON.stringify(meta)],{type:'application/json'}));
      form.append('file',blob);
      const r=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {method:'POST',headers:{'Authorization':'Bearer '+token},body:form});
      if(r.status===401){save(SK.driveToken,null);renderDriveStatus();return;}
      if(!r.ok)throw new Error('Create failed '+r.status);
      const j=await r.json();id=j.id;
      save(SK.driveFileId,id);
    }
    const now=new Date();
    const timeStr=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    if(badge){badge.textContent='☁ Gespeichert '+timeStr;badge.style.color='var(--green)';}
  }catch(e){
    console.warn('Drive sync error',e);
    if(badge){badge.textContent='☁ Sync-Fehler';badge.style.color='var(--red)';}
  }
}

function startDriveAutoTimer(){
  if(_driveAutoTimer)clearInterval(_driveAutoTimer);
  _driveAutoTimer=setInterval(driveAutoSave,60000);
}

function renderDriveStatus(){
  const token=getDriveToken();
  const connectBtn=document.getElementById('drive-connect-btn');
  const disconnBtn=document.getElementById('drive-disconnect-btn');
  const badge=document.getElementById('drive-sync-badge');
  const clientInput=document.getElementById('drive-client-id');
  if(token){
    if(connectBtn)connectBtn.style.display='none';
    if(disconnBtn)disconnBtn.style.display='inline-flex';
    if(badge&&badge.textContent.startsWith('☁ Nicht'))badge.textContent='☁ Verbunden';
    if(badge)badge.style.color='var(--green)';
    if(clientInput)clientInput.style.display='none';
  } else {
    if(connectBtn)connectBtn.style.display='inline-flex';
    if(disconnBtn)disconnBtn.style.display='none';
    if(badge){badge.textContent='☁ Nicht verbunden';badge.style.color='var(--muted)';}
    if(clientInput)clientInput.style.display='block';
  }
}

async function driveRestoreIfEmpty(){
  const hasData=localStorage.getItem('fpcm_prospects');
  if(hasData)return;
  const token=getDriveToken();
  if(!token)return;
  const fileId=load(SK.driveFileId,null);
  if(!fileId)return;
  if(!confirm('Keine lokalen Daten gefunden. Aus Drive wiederherstellen?'))return;
  try{
    const r=await fetch('https://www.googleapis.com/drive/v3/files/'+fileId+'?alt=media',
      {headers:{'Authorization':'Bearer '+token}});
    if(!r.ok)throw new Error(r.status);
    const data=await r.json();
    Object.entries(data).forEach(([k,v])=>localStorage.setItem(k,JSON.stringify(v)));
    renderAll();
    showXPToast('☁ Wiederhergestellt','☁','Drive Restore erfolgreich');
  }catch(e){alert('Restore fehlgeschlagen: '+e.message);}
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
  const savedCid=load(SK.driveClientId,null);
  if(savedCid){const el=document.getElementById('drive-client-id');if(el)el.value=savedCid;}
  renderDriveStatus();
  if(getDriveToken())startDriveAutoTimer();
  setTimeout(driveRestoreIfEmpty,500);
});
