import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, Bell, BookOpen, BrainCircuit, Briefcase,
  CheckCircle2, ChevronRight, Clock3, Copy, FileSearch, FileText, Fingerprint,
  FolderOpen, Globe2, Hash, Image as ImageIcon, Info, LayoutDashboard, LockKeyhole,
  LogIn, LogOut, Menu, Network, Plus, Search, Settings, Shield, ShieldCheck,
  Sparkles, UploadCloud, User, Users, Video, X, Zap
} from "lucide-react";

type View = "dashboard" | "investigate" | "cases" | "research" | "reports";
type Account = { email: string; password: string; name: string; createdAt: string };
type CaseRecord = { id: string; fileName: string; verdict: string; confidence: number; date: string; owner: string };

const DEMO_ACCOUNT: Account = {
  email: "investigator@aimd.local",
  password: "AIMD2026!",
  name: "Investigator",
  createdAt: new Date().toISOString()
};

const sampleCase: CaseRecord = {
  id: "AIMD-2026-0524-001",
  fileName: "crowd_protest.mp4",
  verdict: "Likely AI-Altered",
  confidence: 87,
  date: "24 May 2026, 10:45 AM",
  owner: DEMO_ACCOUNT.email
};

function loadAccounts(): Account[] {
  try {
    const saved = JSON.parse(localStorage.getItem("aimd_accounts") || "[]");
    return saved.length ? saved : [DEMO_ACCOUNT];
  } catch { return [DEMO_ACCOUNT]; }
}

function IconButton({ children, title, onClick }: {children: React.ReactNode; title: string; onClick?:()=>void}) {
  return <button className="iconBtn" title={title} onClick={onClick}>{children}</button>;
}

function Auth({ onLogin }: { onLogin: (a: Account) => void }) {
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    const accounts = loadAccounts();
    if (mode === "signup") {
      if (!email.includes("@") || password.length < 8) {
        setError("Use a valid email and a password of at least 8 characters."); return;
      }
      if (accounts.some(a => a.email.toLowerCase() === email.toLowerCase())) {
        setError("An AIMD account with this email already exists."); return;
      }
      const account = { email, password, name: name || "Investigator", createdAt: new Date().toISOString() };
      localStorage.setItem("aimd_accounts", JSON.stringify([...accounts, account]));
      onLogin(account); return;
    }
    const account = accounts.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (!account) { setError("Account not found or password is incorrect."); return; }
    onLogin(account);
  }

  return (
    <div className="authShell">
      <div className="authCard">
        <div className="brandMark"><ShieldCheck size={30}/><span>AIMD</span><small>KKNS</small></div>
        <div className="eyebrow">AI MEDIA INVESTIGATION & DETECTION</div>
        <h1>{mode === "login" ? "Investigator sign in" : "Create investigator account"}</h1>
        <p className="muted">A practical evidence console for synthetic-media investigations.</p>
        <button className="googleBtn" onClick={() => setError("Google OAuth is a production integration. Use an AIMD account for this prototype.")}>
          <span className="googleG">G</span> Continue with Google
        </button>
        <div className="or"><span>or use AIMD account</span></div>
        <form onSubmit={submit}>
          {mode === "signup" && <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Investigator name"/></label>}
          <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@agency.gov" required/></label>
          <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 8 characters" required/></label>
          {error && <div className="error"><AlertTriangle size={15}/>{error}</div>}
          <button className="primary wide" type="submit"><LogIn size={17}/>{mode === "login" ? "Sign in" : "Create account"}</button>
        </form>
        <div className="switchAuth">
          {mode === "login" ? "New investigator?" : "Already registered?"}
          <button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("")}}>
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </div>
        <div className="authNote"><LockKeyhole size={14}/> Demo accounts are stored locally. Google passwords are never requested.</div>
      </div>
    </div>
  );
}

function Sidebar({ view, setView, account, logout }: {view:View; setView:(v:View)=>void; account:Account; logout:()=>void}) {
  const nav: [View,string,React.ReactNode][] = [
    ["dashboard","Dashboard",<LayoutDashboard size={18}/>],
    ["investigate","New Investigation",<FileSearch size={18}/>],
    ["cases","Case Records",<FolderOpen size={18}/>],
    ["research","Evidence Search",<Globe2 size={18}/>],
    ["reports","Reports",<FileText size={18}/>],
  ];
  return <aside className="sidebar">
    <div className="sideBrand"><div className="shield"><Shield size={26}/></div><div><strong>AIMD</strong><small>AI MEDIA INVESTIGATION<br/>& DETECTION</small></div></div>
    <div className="ownerTag"><span>KKNS</span><small>PROJECT OWNER MARK</small></div>
    <div className="navLabel">WORKSPACE</div>
    {nav.map(([id,label,icon])=><button key={id} className={"navItem "+(view===id?"active":"")} onClick={()=>setView(id)}>{icon}<span>{label}</span>{id==="research"&&<em>BETA</em>}</button>)}
    <div className="navLabel lower">SYSTEM</div>
    <button className="navItem"><Settings size={18}/><span>Settings</span></button>
    <div className="sideSpacer"/>
    <div className="secureBox"><ShieldCheck size={18}/><div><strong>Secure workspace</strong><span>Local demo session</span></div></div>
    <div className="profile">
      <div className="avatar"><User size={17}/></div><div className="profileText"><strong>{account.name}</strong><span>{account.email}</span></div>
      <IconButton title="Sign out" onClick={logout}><LogOut size={16}/></IconButton>
    </div>
  </aside>;
}

function Topbar({ setView }: {setView:(v:View)=>void}) {
  return <header className="topbar">
    <div><div className="topTitle">AIMD Investigation Console</div><div className="topSub">Preserve · Examine · Correlate · Report</div></div>
    <div className="topActions">
      <button className="outline" onClick={()=>setView("research")}><Search size={16}/> Research sweep</button>
      <IconButton title="Notifications"><Bell size={18}/></IconButton>
      <div className="status"><span className="dot"/> System ready</div>
    </div>
  </header>;
}

function Metric({label,value,detail,icon}: {label:string;value:string;detail:string;icon:React.ReactNode}) {
  return <div className="metric"><div className="metricIcon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>;
}

function Dashboard({ setView, cases }: {setView:(v:View)=>void; cases:CaseRecord[]}) {
  return <div className="page">
    <div className="pageIntro"><div><div className="eyebrow">FIELD OVERVIEW</div><h1>Good morning, Investigator.</h1><p>Review recent media examinations and continue an open investigation.</p></div><button className="primary" onClick={()=>setView("investigate")}><Plus size={18}/> New investigation</button></div>
    <div className="metrics">
      <Metric label="Open cases" value={String(cases.length)} detail="Local workspace" icon={<Briefcase size={19}/>}/>
      <Metric label="Media examined" value="18" detail="Demo workspace" icon={<FileSearch size={19}/>}/>
      <Metric label="Flagged media" value="07" detail="Requires review" icon={<AlertTriangle size={19}/>}/>
      <Metric label="System status" value="Ready" detail="All modules online" icon={<Activity size={19}/>}/>
    </div>
    <div className="grid2">
      <section className="panel large">
        <div className="panelHead"><div><span className="sectionNo">01</span><div><h2>Recent investigations</h2><p>Latest media handled in this workspace.</p></div></div><button className="textBtn" onClick={()=>setView("cases")}>View all <ArrowRight size={15}/></button></div>
        <div className="caseRows">{cases.slice(0,4).map(c=><div className="caseRow" key={c.id} onClick={()=>setView("cases")}><div className="fileIcon"><Video size={17}/></div><div className="caseMain"><strong>{c.fileName}</strong><span>{c.id} · {c.date}</span></div><div className="verdict amber">{c.verdict}</div><div className="confidence">{c.confidence}%</div><ChevronRight size={16} className="dim"/></div>)}</div>
      </section>
      <section className="panel">
        <div className="panelHead"><div><span className="sectionNo">02</span><div><h2>Investigation path</h2><p>The AIMD workflow.</p></div></div></div>
        <div className="path">
          {["Preserve source","Run forensic checks","Correlate provenance","Trace propagation","Export report"].map((x,i)=><div className="pathItem" key={x}><span>{String(i+1).padStart(2,"0")}</span><div><strong>{x}</strong><small>{["Hash + original file","Visual + temporal signals","Metadata + credentials","Known/public evidence","Case-ready summary"][i]}</small></div>{i<4&&<ChevronRight size={15}/>}</div>)}
        </div>
      </section>
    </div>
    <section className="notice"><div className="noticeIcon"><Info size={18}/></div><div><strong>Prototype evidence policy</strong><p>Analysis scores shown in this demo are simulated. A production deployment should connect verified forensic models, authorized search APIs and a server-side evidence store before results are used operationally.</p></div></section>
  </div>;
}

function Investigate({ onCase }: {onCase:(c:CaseRecord)=>void}) {
  const [file,setFile] = useState<File|null>(null);
  const [preview,setPreview] = useState("");
  const [busy,setBusy] = useState(false);
  const [done,setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);

  function choose(f?:File) {
    if(!f) return;
    setFile(f); setDone(false); setPreview(URL.createObjectURL(f));
  }
  function analyze() {
    if(!file) return;
    setBusy(true); setDone(false);
    setTimeout(()=>{setBusy(false);setDone(true);onCase({
      id:"AIMD-"+Date.now().toString().slice(-8),
      fileName:file.name, verdict:"Likely AI-Altered", confidence:87,
      date:new Date().toLocaleString(), owner:"current"
    })},1200);
  }

  return <div className="page">
    <div className="pageIntro"><div><div className="eyebrow">NEW INVESTIGATION</div><h1>Examine a piece of media.</h1><p>Start by preserving the exact file you received. AIMD then builds a review trail around it.</p></div><div className="caseBadge"><Fingerprint size={17}/> Evidence-first workflow</div></div>
    <div className="investigationGrid">
      <section className="panel uploadPanel">
        <div className="panelHead"><div><span className="sectionNo">01</span><div><h2>Source media</h2><p>Image or video · preserve the original file</p></div></div></div>
        <div className={"dropzone "+(file?"hasFile":"")} onClick={()=>inputRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();choose(e.dataTransfer.files?.[0])}}>
          <input ref={inputRef} type="file" accept="image/*,video/*" hidden onChange={e=>choose(e.target.files?.[0])}/>
          {file ? <>
            {file.type.startsWith("image/") ? <img src={preview} className="mediaPreview"/> : <div className="videoPreview"><Video size={48}/><strong>{file.name}</strong><span>Video selected for analysis</span></div>}
            <div className="fileMeta"><strong>{file.name}</strong><span>{(file.size/1024/1024).toFixed(2)} MB · {file.type || "unknown type"}</span></div>
            <button className="smallOutline" onClick={(e)=>{e.stopPropagation();setFile(null);setPreview("")}}>Remove</button>
          </> : <><UploadCloud size={38}/><strong>Drop evidence here</strong><span>or click to browse · JPG, PNG, MP4, MOV</span><small>Keep the original file unchanged for strongest provenance.</small></>}
        </div>
        <div className="uploadFooter"><span><Hash size={14}/> SHA-256 generated locally</span><span><LockKeyhole size={14}/> Private browser session</span></div>
      </section>
      <section className="panel">
        <div className="panelHead"><div><span className="sectionNo">02</span><div><h2>Analysis scope</h2><p>Checks prepared for this investigation.</p></div></div></div>
        <div className="checkList">
          {[
            ["AI-generation indicators","Pixel, texture and synthesis artifacts",<BrainCircuit/>],
            ["Temporal consistency","Frame-to-frame anomalies for video",<Activity/>],
            ["Metadata & credentials","EXIF, C2PA and editing history",<FileText/>],
            ["Provenance correlation","Known/public source relationships",<Network/>],
            ["Origin discovery","Search-assisted evidence sweep",<Globe2/>]
          ].map(([a,b,ic])=><div className="checkItem" key={String(a)}><div className="checkIcon">{ic}</div><div><strong>{a}</strong><span>{b}</span></div><CheckCircle2 size={17} className="ok"/></div>)}
        </div>
        <button className="primary wide" disabled={!file||busy} onClick={analyze}>{busy?<><Activity className="spin" size={17}/> Running checks…</>:<><Zap size={17}/> Analyze media</>}</button>
        {done&&<div className="success"><CheckCircle2 size={17}/><div><strong>Analysis complete</strong><span>Demo findings have been added to Case Records.</span></div></div>}
      </section>
    </div>
    {done&&<AnalysisResult/>}
  </div>;
}

function AnalysisResult() {
  const signals=[["Face / object consistency","High","Anomaly detected"],["Lighting & shadows","Medium","Inconsistent"],["Noise pattern","High","Texture mismatch"],["Compression pattern","Medium","Irregular blocks"],["Temporal consistency","Medium","Frame mismatch"],["Color & saturation","Low","Within expected range"]];
  return <div className="resultGrid">
    <section className="panel resultCard"><div className="panelHead"><div><span className="sectionNo">03</span><div><h2>Analysis result</h2><p>Simulated forensic assessment</p></div></div></div><div className="scoreWrap"><div className="scoreCircle"><strong>87%</strong><span>confidence</span></div><div><div className="verdictBig">Likely AI-Altered</div><p>Multiple synthetic-media indicators were detected. This result should be treated as an investigative lead, not a standalone determination.</p></div></div><div className="probRow"><span>AI-generated <b>15%</b></span><span className="activeProb">AI-altered <b>87%</b></span><span>Likely real <b>13%</b></span></div></section>
    <section className="panel"><div className="panelHead"><div><span className="sectionNo">04</span><div><h2>Forensic signals</h2><p>Why the media was flagged.</p></div></div></div><div className="signalList">{signals.map(s=><div className="signal" key={s[0]}><div><strong>{s[0]}</strong><span>{s[2]}</span></div><b className={s[1]==="High"?"high":s[1]==="Medium"?"medium":"low"}>{s[1]}</b></div>)}</div></section>
    <section className="panel"><div className="panelHead"><div><span className="sectionNo">05</span><div><h2>Provenance & metadata</h2><p>Evidence attached to the source.</p></div></div></div><div className="kv"><span>Content Credentials (C2PA)<b>Not detected</b></span><span>Metadata availability<b className="amberText">Partial</b></span><span>Digital watermark<b>Not detected</b></span><span>SHA-256 hash<b>7f3a…9c4e <Copy size={13}/></b></span><span>Editing software<b>Not identified</b></span></div></section>
    <section className="panel"><div className="panelHead"><div><span className="sectionNo">06</span><div><h2>Origin & propagation</h2><p>Evidence chain assembled from available records.</p></div></div></div><div className="timeline">{["Earliest observed","Original upload","Edited version","Repost","Wider circulation"].map((x,i)=><div className="timeItem" key={x}><div className="timeDot"/><div><strong>{x}</strong><span>{["12 May · 08:21","12 May · 09:02","12 May · 09:45","12 May · 10:15","12 May · 10:42"][i]}</span><small>{["Source unknown","Social media","Instagram","WhatsApp","Multiple platforms"][i]}</small></div></div>)}</div></section>
  </div>;
}

function Cases({ cases }: {cases:CaseRecord[]}) {
  return <div className="page"><div className="pageIntro"><div><div className="eyebrow">CASE RECORDS</div><h1>Evidence register.</h1><p>Investigations created in this browser workspace.</p></div></div>
    <section className="panel"><div className="tableHead"><span>CASE</span><span>MEDIA</span><span>VERDICT</span><span>CONFIDENCE</span><span>DATE</span></div>{cases.map(c=><div className="tableRow" key={c.id}><span className="mono">{c.id}</span><strong>{c.fileName}</strong><span className="verdict amber">{c.verdict}</span><b>{c.confidence}%</b><span>{c.date}</span></div>)}</section>
  </div>;
}

function Research() {
  const [query,setQuery]=useState("crowd protest video");
  const [searched,setSearched]=useState(false);
  const results=[
    ["Potential source match","Public social post","Similarity 91%","12 May 2026 · 08:21"],
    ["Related report","News article","Similarity 76%","12 May 2026 · 11:04"],
    ["Edited variant","Public social post","Similarity 84%","13 May 2026 · 09:18"],
    ["Archive reference","Web archive","Similarity 68%","14 May 2026 · 15:32"]
  ];
  return <div className="page"><div className="pageIntro"><div><div className="eyebrow">EVIDENCE DISCOVERY</div><h1>Research sweep.</h1><p>Correlate a claim, filename or visual description with authorized public evidence sources.</p></div><div className="caseBadge"><Globe2 size={17}/> Search module</div></div>
    <section className="panel searchPanel"><div className="searchLine"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setSearched(true)} placeholder="Search a claim, filename, caption or phrase"/><button className="primary" onClick={()=>setSearched(true)}>Run sweep</button></div><div className="searchSources"><span><CheckCircle2 size={14}/> Web index</span><span><CheckCircle2 size={14}/> News index</span><span><CheckCircle2 size={14}/> Public social references</span><span><CheckCircle2 size={14}/> Archive references</span></div></section>
    {!searched?<div className="emptyResearch"><Search size={34}/><strong>Start with a search term.</strong><span>A production backend can connect this workspace to approved search APIs and visual-similarity services.</span></div>:
    <section className="panel"><div className="panelHead"><div><span className="sectionNo">RESULTS</span><div><h2>Evidence candidates for “{query}”</h2><p>Prototype results for demonstrating the investigation flow.</p></div></div></div><div className="researchRows">{results.map(r=><div className="researchRow" key={r[0]}><div className="sourceIcon"><Globe2 size={18}/></div><div><strong>{r[0]}</strong><span>{r[1]} · {r[3]}</span></div><b>{r[2]}</b><button className="iconBtn" title="Open evidence"><ArrowRight size={16}/></button></div>)}</div></section>}
    <div className="notice"><div className="noticeIcon"><Info size={18}/></div><div><strong>What this module does in production</strong><p>It should query approved sources, normalize timestamps, compare perceptual hashes/embeddings, preserve URLs and snapshots where legally permitted, and feed corroborated findings into the origin graph.</p></div></div>
  </div>;
}

function Reports({ cases }: {cases:CaseRecord[]}) {
  const [selected,setSelected]=useState(cases[0]?.id||"");
  const current=cases.find(c=>c.id===selected)||cases[0];
  function download() {
    if(!current)return;
    const body=`AIMD INVESTIGATION REPORT\n\nCase: ${current.id}\nMedia: ${current.fileName}\nVerdict: ${current.verdict}\nConfidence: ${current.confidence}%\nDate: ${current.date}\n\nNOTE: Prototype report. Findings are simulated and require validated forensic services before operational use.\n\nKKNS • AIMD`;
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([body],{type:"text/plain"})); a.download=`${current.id}-report.txt`; a.click();
  }
  return <div className="page"><div className="pageIntro"><div><div className="eyebrow">REPORTING</div><h1>Investigation report.</h1><p>Turn the evidence trail into a concise case brief.</p></div><button className="primary" onClick={download}><FileText size={17}/> Export report</button></div>
    <div className="reportGrid"><section className="panel"><div className="panelHead"><div><span className="sectionNo">01</span><div><h2>Choose case</h2><p>Select an investigation to preview.</p></div></div></div>{cases.map(c=><button key={c.id} className={"caseSelect "+(selected===c.id?"selected":"")} onClick={()=>setSelected(c.id)}><FolderOpen size={17}/><span><strong>{c.id}</strong><small>{c.fileName}</small></span><ChevronRight size={15}/></button>)}</section>
    {current&&<section className="panel reportPreview"><div className="reportHeader"><div className="brandMark mini"><ShieldCheck size={21}/><span>AIMD</span><small>KKNS</small></div><span>INVESTIGATION BRIEF</span></div><h2>{current.fileName}</h2><div className="reportVerdict"><span>Assessment</span><strong>{current.verdict}</strong><b>{current.confidence}%</b></div><div className="reportSection"><h3>Executive finding</h3><p>The submitted media contains multiple indicators consistent with AI-assisted alteration. This prototype assessment should be corroborated with validated forensic models and source evidence.</p></div><div className="reportSection"><h3>Evidence trail</h3><div className="reportBullets"><span><CheckCircle2/> SHA-256 source hash recorded</span><span><CheckCircle2/> Metadata and content-credential checks completed</span><span><CheckCircle2/> Forensic signal matrix attached</span><span><CheckCircle2/> Origin/propagation timeline attached</span></div></div><div className="reportFooter">AIMD · AI Media Investigation & Detection · KKNS · Prototype</div></section>}</div>
  </div>;
}

export default function App() {
  const [account,setAccount]=useState<Account|null>(null);
  const [view,setView]=useState<View>("dashboard");
  const [cases,setCases]=useState<CaseRecord[]>([sampleCase]);

  useEffect(()=>{const saved=localStorage.getItem("aimd_session");if(saved){try{setAccount(JSON.parse(saved))}catch{}}},[]);
  useEffect(()=>{const saved=localStorage.getItem("aimd_cases");if(saved)try{setCases(JSON.parse(saved))}catch{}},[]);
  function login(a:Account){setAccount(a);localStorage.setItem("aimd_session",JSON.stringify(a));}
  function logout(){setAccount(null);localStorage.removeItem("aimd_session");}
  function addCase(c:CaseRecord){const next=[c,...cases.filter(x=>x.id!==c.id)];setCases(next);localStorage.setItem("aimd_cases",JSON.stringify(next));}
  if(!account) return <Auth onLogin={login}/>;

  return <div className="app">
    <Sidebar view={view} setView={setView} account={account} logout={logout}/>
    <main className="main"><Topbar setView={setView}/>
      {view==="dashboard"&&<Dashboard setView={setView} cases={cases}/>}
      {view==="investigate"&&<Investigate onCase={addCase}/>}
      {view==="cases"&&<Cases cases={cases}/>}
      {view==="research"&&<Research/>}
      {view==="reports"&&<Reports cases={cases}/>}
      <footer>KKNS · AIMD 2026 <span>Prototype interface · For authorized investigative research only</span></footer>
    </main>
  </div>;
}