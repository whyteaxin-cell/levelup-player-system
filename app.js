const state={
  screen:"system", name:localStorage.name||"Player", username:localStorage.username||"player_01",
  goal:localStorage.goal||"NEET", subjects:JSON.parse(localStorage.subjects||'["Physics","Chemistry","Biology"]'),
  level:+localStorage.level||1, xp:+localStorage.xp||120, streak:+localStorage.streak||3,
  stats:JSON.parse(localStorage.stats||'{"INT":32,"FOC":28,"DIS":35,"PHY":18,"MEM":30,"WIL":27}'),
  quests:JSON.parse(localStorage.quests||JSON.stringify([
    {title:"Study session",sub:"Choose your own subject",xp:100,done:false},
    {title:"Practice",sub:"Complete 20 questions",xp:80,done:false},
    {title:"Move your body",sub:"30 minute activity",xp:50,done:false}
  ]))
};
const $=s=>document.querySelector(s);
const save=()=>{for(const k of ["name","username","goal","subjects","level","xp","streak","stats","quests"])localStorage[k]=JSON.stringify(state[k]);localStorage.name=state.name;localStorage.username=state.username};
function levelNeed(){return 250+state.level*100}
function gainXP(n){state.xp+=n;while(state.xp>=levelNeed()){state.xp-=levelNeed();state.level++;state.stats.DIS=Math.min(100,state.stats.DIS+1); alert(`⚡ LEVEL UP!\\nYou reached Level ${state.level}.`)}save()}
function nav(){document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.screen===state.screen));}
function render(){
 nav(); const main=$("#main");
 const title={system:"Welcome, "+state.name,quests:"Quests",social:"Social",messages:"Messages",profile:"Player Profile"}[state.screen];
 $("#screenTitle").textContent=title;
 if(!localStorage.onboarded){return onboarding(main)}
 ({system:system,quests:quests,social:social,messages:messages,profile:profile}[state.screen])(main);
}
function onboarding(main){
 main.innerHTML=`<section class="onboard">
 <div class="eyebrow">INITIALIZING PLAYER SYSTEM</div>
 <h2 class="big">Build your own<br><span class="rank">real-life RPG.</span></h2>
 <p class="muted">Tell the System what you actually want to improve. Nothing is fixed.</p>
 <div class="card">
 <label class="small">PLAYER NAME</label><input id="onName" placeholder="Your name">
 <label class="small">USERNAME</label><input id="onUser" placeholder="@username">
 <label class="small">MAIN GOAL</label><input id="onGoal" placeholder="NEET / Coding / Fitness / Anything">
 <label class="small">SUBJECTS / ACTIVITIES</label><input id="onSubs" placeholder="Physics, Chemistry, Biology">
 <button class="btn" style="width:100%;margin-top:10px" id="begin">INITIALIZE MY SYSTEM ⚡</button>
 </div></section>`;
 $("#begin").onclick=()=>{state.name=$("#onName").value||"Player";state.username=($("#onUser").value||"player_01").replace("@","");state.goal=$("#onGoal").value||"Personal Growth";state.subjects=($("#onSubs").value||"General").split(",").map(x=>x.trim()).filter(Boolean);localStorage.onboarded="1";save();render()}
}
function system(main){
 const need=levelNeed(), pct=Math.min(100,state.xp/need*100);
 main.innerHTML=`<section class="screen">
 <div class="hero"><div class="playerLine"><div class="avatar">⚔</div><div><div class="muted">@${state.username}</div><h2 style="margin:3px 0">LEVEL ${state.level}</h2><div class="rank">RANK ${state.level<11?"E":state.level<21?"D":state.level<31?"C":state.level<41?"B":"A"}</div></div></div>
 <div class="xpbar"><i style="width:${pct}%"></i></div><div class="small muted">${state.xp} / ${need} XP</div></div>
 <div class="grid"><div class="card stat"><div class="muted">🔥 Streak</div><b>${state.streak}</b><div class="small">days</div></div><div class="card stat"><div class="muted">🎯 Goal</div><b style="font-size:18px">${state.goal}</b><div class="small">${state.subjects.length} focus areas</div></div></div>
 <div class="sectionTitle"><h3>⚔ Today's Quests</h3><button class="btn secondary" id="addQuest">+ Add</button></div>
 <div class="list">${state.quests.map((q,i)=>`<div class="card quest"><button class="check ${q.done?"done":""}" data-q="${i}">${q.done?"✓":"○"}</button><div><div class="questTitle">${q.title}</div><div class="small muted">${q.sub}</div></div><div class="reward">+${q.xp}</div></div>`).join("")}</div>
 <div class="sectionTitle"><h3>🧟 Current Boss</h3></div>
 <div class="card boss"><div class="rank">THE PROCRASTINATOR</div><p class="muted">Your completed verified quests damage the boss.</p><div class="xpbar"><i style="width:${Math.max(5,100-state.quests.filter(q=>q.done).length*18)}%"></i></div><div class="hp">HP ${Math.max(5,100-state.quests.filter(q=>q.done).length*18)}%</div></div>
 </section>`;
 document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{let i=+b.dataset.q;if(!state.quests[i].done){state.quests[i].done=true;gainXP(state.quests[i].xp);state.stats.DIS=Math.min(100,state.stats.DIS+1);save();render()}});
 $("#addQuest").onclick=()=>openAddQuest();
}
function quests(main){
 main.innerHTML=`<section class="screen"><div class="tabs"><span class="pill">Daily</span><span class="pill">Weekly</span><span class="pill">Boss Battles</span></div>
 <div class="sectionTitle"><h3>Your focus areas</h3><button class="btn secondary" id="subjects">Edit</button></div>
 <div class="list">${state.subjects.map((s,i)=>`<div class="card"><b>📚 ${s}</b><div class="small muted">Custom progress • You decide what counts</div><div class="actions"><button class="btn" data-study="${i}">Start +50 XP</button></div></div>`).join("")}</div>
 <div class="sectionTitle"><h3>Verification</h3></div><div class="card"><b>🛡 Verified XP</b><p class="small muted">Manual claims give small rewards. Focus sessions, quizzes and other evidence can unlock full XP later.</p><span class="pill">Trust-aware progression</span></div></section>`;
 document.querySelectorAll("[data-study]").forEach(b=>b.onclick=()=>{gainXP(50);alert("Quest recorded. Verified XP features can be connected in the next build.");render()});
 $("#subjects").onclick=()=>openSubjects();
}
function social(main){
 main.innerHTML=`<section class="screen"><input class="search" id="search" placeholder="Search players, groups or challenges"><div class="sectionTitle"><h3>For You</h3></div>
 <div class="list">
 <div class="card feedItem"><div class="miniAvatar">⚡</div><div><b>@alex_21</b><div class="small muted">Level 34 • A Rank</div><p>Reached a new level 🔥</p><button class="btn secondary follow">Follow</button></div></div>
 <div class="card feedItem"><div class="miniAvatar">🌙</div><div><b>@meena</b><div class="small muted">Level 29 • B Rank</div><p>30-day streak completed 🏆</p><button class="btn secondary follow">Follow</button></div></div>
 </div></section>`;
 document.querySelectorAll(".follow").forEach(b=>b.onclick=()=>{b.textContent=b.textContent==="Follow"?"Following":"Follow"});
}
function messages(main){
 main.innerHTML=`<section class="screen"><input class="search" placeholder="Search messages"><div class="sectionTitle"><h3>Messages</h3><button class="btn">New</button></div>
 <div class="list">${["@alex_21","@meena","Study Squad"].map((x,i)=>`<div class="card feedItem"><div class="miniAvatar">${i===2?"👥":"✦"}</div><div><b>${x}</b><div class="small muted">${i===0?"Challenge accepted ⚔️":i===1?"Congrats on Level 30 🔥":"12 members"}</div></div></div>`).join("")}</div></section>`;
}
function profile(main){
 main.innerHTML=`<section class="screen"><div class="hero" style="text-align:center"><div class="avatar" style="margin:auto">⚔</div><h2>${state.name}</h2><div class="muted">@${state.username}</div><div class="rank">LEVEL ${state.level} • RANK ${state.level<11?"E":state.level<21?"D":state.level<31?"C":state.level<41?"B":"A"}</div><div class="actions" style="justify-content:center"><button class="btn secondary" id="edit">Edit Player</button><button class="btn" id="share">Share Profile</button></div></div>
 <div class="sectionTitle"><h3>📊 Stats</h3></div><div class="card">${Object.entries(state.stats).map(([k,v])=>`<div class="statrow"><span>${k}</span><div class="meter"><i style="width:${v}%"></i></div><b>${v}</b></div>`).join("")}</div>
 <div class="sectionTitle"><h3>🏆 Achievements</h3></div><div class="grid"><div class="card">🔥 ${state.streak} Day Streak</div><div class="card">⚔ ${state.quests.filter(q=>q.done).length} Quests</div></div>
 <div class="sectionTitle"><h3>📅 Progress Calendar</h3></div><div class="card"><div class="calendar">${Array.from({length:30},(_,i)=>`<div class="day ${i%4===0?"done":""} ${i===29?"today":""}">${i+1}</div>`).join("")}</div></div></section>`;
 $("#edit").onclick=()=>openEdit(); $("#share").onclick=()=>navigator.clipboard?.writeText("@"+state.username).then(()=>alert("Username copied!"));
}
function openAddQuest(){showSheet(`<h3>Add a custom quest</h3><input id="qt" placeholder="Quest name"><input id="qs" placeholder="Description"><input id="qx" type="number" value="50" placeholder="XP"><button class="btn" id="saveQ">Add Quest</button>`);$("#saveQ").onclick=()=>{state.quests.push({title:$("#qt").value||"Custom quest",sub:$("#qs").value||"Your objective",xp:+$("#qx").value||50,done:false});save();closeSheet();render()}}
function openSubjects(){showSheet(`<h3>Edit focus areas</h3><p class="small muted">Add or remove anything you want to improve.</p><input id="newSub" placeholder="New subject / activity">${state.subjects.map((s,i)=>`<div class="card" style="margin:7px 0;display:flex;justify-content:space-between"><span>${s}</span><button class="btn danger" data-del="${i}">Remove</button></div>`).join("")}<button class="btn" id="addSub">Add</button>`);$("#addSub").onclick=()=>{let v=$("#newSub").value.trim();if(v){state.subjects.push(v);save();closeSheet();openSubjects()}};document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{state.subjects.splice(+b.dataset.del,1);save();closeSheet();openSubjects()})}
function openEdit(){showSheet(`<h3>Edit Player</h3><input id="en" value="${state.name}"><input id="eu" value="${state.username}"><input id="eg" value="${state.goal}"><button class="btn" id="saveE">Save</button>`);$("#saveE").onclick=()=>{state.name=$("#en").value||"Player";state.username=$("#eu").value.replace("@","")||"player";state.goal=$("#eg").value||"Personal Growth";save();closeSheet();render()}}
function showSheet(content){$("#modal").classList.remove("hidden");$("#modal").innerHTML=`<div class="sheet">${content}<button class="btn secondary" style="width:100%;margin-top:10px" onclick="closeSheet()">Close</button></div>`}
function closeSheet(){$("#modal").classList.add("hidden")}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>{state.screen=b.dataset.screen;render()});
$("#notifyBtn").onclick=()=>alert("🔔 No new system notifications.");
render();
