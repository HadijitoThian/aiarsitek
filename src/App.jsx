import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────
   FONTS
───────────────────────────────────────────────────────── */
const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
);

/* ─────────────────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────────────────── */
const T = {
  bg:"#070d0d", surface:"#0c1616", mobild:"#101c1c", border:"#182828",
  teal:"#00bfba", tealDim:"#007a77", tealGlow:"#00bfba33",
  amber:"#c47e3a", amberLight:"#e8a855", amberGlow:"#c47e3a22",
  red:"#d95050", green:"#38c46a", yellow:"#f0c040",
  text:"#ddeaea", muted:"#5d8080", dim:"#2d4848", faint:"#142020",
};

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const SERVICES = [
  { id:"1", name:"Exterior Wah",   price:35000,  duration:15, icon:"🫧", dec:"Bilas eksterior, cuci busa, lap tangan" },
  { id:"2", name:"Interior + Ext", price:60000,  duration:30, icon:"✨", dec:"Pembersihan menyeluruh luar dalam" },
  { id:"3", name:"Full Detail",    price:120000, duration:60, icon:"⭐", dec:"Detailing profesional, wax, dan poles" },
  { id:"4", name:"Engine Clean",   price:45000,  duration:25, icon:"⚙️", dec:"Pembersihan ruang mesin & bilas" },
  { id:"5", name:"Wax & Polish",   price:80000,  duration:45, icon:"💎", dec:"Koreksi cat & lapisan wax pelindung" },
];

const COFFEE_ITEMS = [
  { id:"c1", name:"Espresso",         price:18000, cat:"Espresso",   icon:"☕" },
  { id:"c2", name:"Americano",        price:22000, cat:"Espresso",   icon:"☕" },
  { id:"c3", name:"Cappuccino",       price:28000, cat:"Espresso",   icon:"☕" },
  { id:"c4", name:"Latte",            price:30000, cat:"Espresso",   icon:"☕" },
  { id:"c5", name:"Cold Brew",        price:32000, cat:"Dingin",     icon:"🧊" },
  { id:"c6", name:"Iced Latte",       price:30000, cat:"Dingin",     icon:"🧊" },
  { id:"c7", name:"Matcha Latte",     price:32000, cat:"Non-Kopi",   icon:"🍵" },
  { id:"c8", name:"Coklat Panas",     price:28000, cat:"Non-Kopi",   icon:"🍫" },
  { id:"c9", name:"Croissant",        price:25000, cat:"Makanan",    icon:"🥐" },
  { id:"c10",name:"Banana Bread",     price:22000, cat:"Makanan",    icon:"🍞" },
];

const MEMBERSHIP_PLANS = [
  { id:"m1", name:"Plan 1 Bulan",  duration:1,  price:199000, badge:null,           features:["1 cuci / hari","Hingga 3 mobil","Semua layanan","Reward poin","Akses aplikasi anggota"] },
  { id:"m2", name:"Plan 3 Bulan",  duration:3,  price:549000, badge:"Terpopuler",   features:["1 cuci / hari","Hingga 3 mobil","Semua layanan","Reward poin","Akses aplikasi anggota","Antrian prioritas"] },
  { id:"m3", name:"Plan 6 Bulan",  duration:6,  price:999000, badge:"Terbaik",      features:["1 cuci / hari","Hingga 3 mobil","Semua layanan","Reward poin","Akses aplikasi anggota","Antrian prioritas","Kopi gratis bulanan"] },
  { id:"m4", name:"Plan 1 Tahun",  duration:12, price:1799000,badge:"Hemat Terbanyak",features:["1 cuci / hari","Hingga 3 mobil","Semua layanan","Reward poin","Akses aplikasi anggota","Antrian prioritas","Kopi gratis bulanan","Detail gratis per kuartal"] },
];

const STAFF = [
  { id:"s1", name:"Fajar Nugroho",  role:"cashier",  pin:"1234" },
  { id:"s2", name:"Rina Lestari",   role:"cashier",  pin:"5678" },
  { id:"s3", name:"Doni Prakoso",   role:"bay",       pin:"1111" },
  { id:"s4", name:"Heni Wulandari", role:"barista",   pin:"2222" },
  { id:"s5", name:"Owner",          role:"admin",     pin:"0000" },
];

const MEMBERS = [
  { id:"mem1", phone:"081234567890", pin:"1234", name:"Andi Saputra",  planId:"m3", planStart:new Date(2026,0,1), cars:[{plate:"B1234ABC",label:"Avanza"},{plate:"B5678DEF",label:"Innova"},{plate:"B9012GHI",label:"Fortuner"}], washes:42, points:1250 },
  { id:"mem2", phone:"082198765432", pin:"5678", name:"Siti Rahayu",   planId:"m1", planStart:new Date(2026,2,1), cars:[{plate:"D4567JKL",label:"Jazz"}], washes:8, points:320 },
  { id:"mem3", phone:"081711112222", pin:"9012", name:"Budi Santoso",  planId:"m4", planStart:new Date(2025,11,1), cars:[{plate:"F1111MNO",label:"Pajero"},{plate:"F2222PQR",label:"CRV"}], washes:95, points:3800 },
];

const INVENTORY_DEFAULT = [
  { id:"i1",  name:"Sampo Mobil Premium", category:"Kimia",      unit:"Liter",  stock:45, reorder:10, pricePerUnit:85000,  icon:"🧴", usedBy:{"1":0.1,"2":0.2,"3":0.3} },
  { id:"i2",  name:"Semir Ban",           category:"Kimia",      unit:"Liter",  stock:8,  reorder:5,  pricePerUnit:65000,  icon:"🖤", usedBy:{"1":0.05,"2":0.05} },
  { id:"i3",  name:"Pengkilap Kaca",      category:"Kimia",      unit:"Liter",  stock:12, reorder:5,  pricePerUnit:75000,  icon:"🪟", usedBy:{"2":0.1,"3":0.2} },
  { id:"i4",  name:"Wax Poles",           category:"Kimia",      unit:"Gram",   stock:2000,reorder:500,pricePerUnit:0.18,  icon:"💎", usedBy:{"3":100,"5":150} },
  { id:"i5",  name:"Cairan Mesin",        category:"Kimia",      unit:"Liter",  stock:3,  reorder:2,  pricePerUnit:120000, icon:"⚙️", usedBy:{"4":0.5} },
  { id:"i6",  name:"Lap Microfiber",      category:"Habis Pakai",unit:"Buah",   stock:80, reorder:20, pricePerUnit:15000,  icon:"🧻", usedBy:{"1":2,"2":4,"3":6} },
  { id:"i7",  name:"Sikat Busa",          category:"Habis Pakai",unit:"Buah",   stock:15, reorder:5,  pricePerUnit:25000,  icon:"🪥", usedBy:{} },
  { id:"i8",  name:"Sarung Tangan",       category:"Habis Pakai",unit:"Pasang", stock:200,reorder:50, pricePerUnit:3000,   icon:"🧤", usedBy:{"1":1,"2":2,"3":2,"4":1,"5":2} },
  { id:"i9",  name:"Biji Kopi Espresso",  category:"Kafe",       unit:"Gram",   stock:1500,reorder:500,pricePerUnit:0.12, icon:"☕", usedBy:{} },
  { id:"i10", name:"Susu Segar",          category:"Kafe",       unit:"Liter",  stock:6,  reorder:2,  pricePerUnit:18000,  icon:"🥛", usedBy:{} },
  { id:"i11", name:"Bubuk Matcha",        category:"Kafe",       unit:"Gram",   stock:400,reorder:100,pricePerUnit:0.35,  icon:"🍵", usedBy:{} },
  { id:"i12", name:"Gelas Kertas",        category:"Kafe",       unit:"Buah",   stock:300,reorder:100,pricePerUnit:800,   icon:"🥤", usedBy:{} },
  { id:"i13", name:"Air Isi Ulang",       category:"Utilitas",   unit:"Liter",  stock:500,reorder:200,pricePerUnit:50,    icon:"💧", usedBy:{"1":20,"2":30,"4":40} },
  { id:"i14", name:"Sabun Cuci Tangan",   category:"Utilitas",   unit:"Liter",  stock:4,  reorder:2,  pricePerUnit:25000,  icon:"🧼", usedBy:{} },
  { id:"i15", name:"Kantong Sampah",      category:"Utilitas",   unit:"Buah",   stock:150,reorder:50, pricePerUnit:500,   icon:"🗑️", usedBy:{} },
  { id:"i16", name:"Tisu",               category:"Habis Pakai",unit:"Buah",   stock:500,reorder:100,pricePerUnit:200,   icon:"🧻", usedBy:{"1":5,"2":8} },
  { id:"i17", name:"Coklat Bubuk",        category:"Kafe",       unit:"Gram",   stock:600,reorder:150,pricePerUnit:0.28,  icon:"🍫", usedBy:{} },
  { id:"i18", name:"Deterjen",            category:"Kimia",      unit:"Liter",  stock:20, reorder:5,  pricePerUnit:35000,  icon:"🧽", usedBy:{"2":0.2,"3":0.3,"4":0.1} },
];

/* ─────────────────────────────────────────────────────────
   STORE
───────────────────────────────────────────────────────── */
const LS = 'sw_state';
const SESSION_KEY = 'sw_session';
const QC_KEY = 'sw_qcount';

let _bc;
try { _bc = new BroadcastChannel("sparkwash"); } catch(e){}

const _getQCount = () => { try { return parseInt(localStorage.getItem(QC_KEY)||'0'); } catch(e){return 0;} };
const _bumpQCount = () => { const n=_getQCount(); try{localStorage.setItem(QC_KEY,n+1);}catch(e){} return n; };

function genAntrian() {
  const n = _bumpQCount();
  return String(n+1).padStart(3,'0');
}

function _rehydrate(s) {
  if(!s) return s;
  const fix = o => {
    if(!o) return o;
    if(Array.isArray(o)) return o.map(fix);
    if(o instanceof Date) return o;
    if(typeof o === 'object') {
      const r={};
      for(const k in o) r[k]= (k==='timestamp'||k==='planStart'||k==='at')&&typeof o[k]==='string' ? new Date(o[k]) : fix(o[k]);
      return r;
    }
    return o;
  };
  return fix(s);
}

const _loadLS = () => { try { const r=localStorage.getItem(LS); return r?_rehydrate(JSON.parse(r)):null; } catch(e){return null;} };
const _saveLS = (state) => { try { localStorage.setItem(LS,JSON.stringify({tickets:state.tickets,coffeeOrders:state.coffeeOrders,members:state.members,shiftLog:state.shiftLog,inventory:state.inventory,alerts:state.alerts})); } catch(e){} };

function createStore() {
  const saved = _loadLS();
  let state = {
    tickets: saved?.tickets || [],
    coffeeOrders: saved?.coffeeOrders || [],
    members: saved?.members || MEMBERS,
    shiftLog: saved?.shiftLog || [],
    inventory: saved?.inventory || INVENTORY_DEFAULT,
    alerts: saved?.alerts || [],
  };

  const subs = new Set();
  const notify = () => subs.forEach(fn=>fn(state));
  const persist = () => { _saveLS(state); if(_bc) _bc.postMessage({type:'SYNC',payload:{tickets:state.tickets,coffeeOrders:state.coffeeOrders,members:state.members,shiftLog:state.shiftLog,inventory:state.inventory,alerts:state.alerts}}); };

  if(_bc) _bc.onmessage=(e)=>{ if(e.data.type==='SYNC'){state={...state,..._rehydrate(e.data.payload)};notify();} };

  return {
    getState:()=>state,
    setState:(u)=>{state=typeof u==='function'?u(state):{...state,...u};notify();persist();},
    subscribe:(fn)=>{subs.add(fn);return()=>subs.delete(fn);},

    addTicket(t) {
      const ticket={...t,id:Date.now().toString(),queueNo:genAntrian(),timestamp:new Date(),status:'waiting'};
      // deduct inventory
      const serviceIds=(t.services||[]).map(s=>s.id);
      const inv=[...state.inventory];
      serviceIds.forEach(sid=>{
        inv.forEach((item,i)=>{
          const use=item.usedBy?.[sid]||0;
          if(use>0) inv[i]={...item,stock:Math.max(0,item.stock-use)};
        });
      });
      // check low stock alerts
      inv.forEach(item=>{
        if(item.stock<=item.reorder && item.stock>0){
          const exists=state.alerts.find(a=>a.itemId===item.id&&a.status==='pending');
          if(!exists) this.addAlert({itemId:item.id,itemName:item.name,type:'auto',note:'',status:'pending',at:new Date(),read:false});
        }
      });
      state={...state,tickets:[...state.tickets,ticket],inventory:inv};
      notify(); persist();
      return ticket;
    },
    patchTicket(id,p){
      state={...state,tickets:state.tickets.map(t=>t.id===id?{...t,...p}:t)};
      notify(); persist();
    },
    addCoffeeOrder(o){
      const order={...o,id:Date.now().toString(),timestamp:new Date(),status:'new'};
      state={...state,coffeeOrders:[...state.coffeeOrders,order]};
      notify(); persist(); return order;
    },
    patchCoffeeOrder(id,p){
      state={...state,coffeeOrders:state.coffeeOrders.map(o=>o.id===id?{...o,...p}:o)};
      notify(); persist();
    },
    lookupByPlate(plate){
      return state.members.find(m=>m.cars.some(c=>c.plate.replace(/\s/g,'').toUpperCase()===plate.replace(/\s/g,'').toUpperCase()));
    },
    logAction(action){
      state={...state,shiftLog:[{...action,id:Date.now().toString(),at:new Date()},...state.shiftLog].slice(0,500)};
      notify(); persist();
    },
    addAlert(a){
      state={...state,alerts:[{...a,id:Date.now().toString()},...state.alerts]};
      notify(); persist();
    },
    markAlertRead(id){
      state={...state,alerts:state.alerts.map(a=>a.id===id?{...a,read:true}:a)};
      notify(); persist();
    },
    markAllAlertsRead(){
      state={...state,alerts:state.alerts.map(a=>({...a,read:true}))};
      notify(); persist();
    },
    resolveAlert(id){
      state={...state,alerts:state.alerts.map(a=>a.id===id?{...a,status:'resolved',read:true}:a)};
      notify(); persist();
    },
    restockItem(id,qty){
      state={...state,inventory:state.inventory.map(item=>item.id===id?{...item,stock:item.stock+qty}:item)};
      notify(); persist();
    },
    updateInventoryItem(id,patch){
      state={...state,inventory:state.inventory.map(item=>item.id===id?{...item,...patch}:item)};
      notify(); persist();
    },
    getInventory(){ return state.inventory; },
    resetAll(){
      try{localStorage.removeItem(LS);localStorage.removeItem(QC_KEY);}catch(e){}
      state={tickets:[],coffeeOrders:[],members:MEMBERS,shiftLog:[],inventory:INVENTORY_DEFAULT,alerts:[]};
      notify();
      if(_bc) _bc.postMessage({type:'RESET'});
    },
  };
}

const store = createStore();

/* ─────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────── */
function useStore(selector) {
  const [val, setVal] = useState(()=>selector(store.getState()));
  useEffect(()=>{
    setVal(selector(store.getState()));
    return store.subscribe(s=>setVal(selector(s)));
  },[]);
  return val;
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (title,body,type='info',duration=5000) => {
    const id=Date.now().toString();
    setToasts(p=>[...p,{id,title,body,type}]);
    if(duration>0) setTimeout(()=>dismiss(id),duration);
  };
  const dismiss = id => setToasts(p=>p.filter(t=>t.id!==id));
  return {toasts,show,dismiss};
}

/* ─────────────────────────────────────────────────────────
   UI PRIMITIVES
───────────────────────────────────────────────────────── */
function Toast({toasts,dismiss}) {
  const typeColor = {success:T.green,warning:T.amber,error:T.red,info:T.teal};
  return (
    <div style={{position:'fixed',top:16,right:16,zIndex:9999,display:'flex',flexDirection:'column',gap:8,maxWidth:320}}>
      {toasts.map(t=>(
        <div key={t.id} onClick={()=>dismiss(t.id)} style={{background:T.surface,border:`1px solid ${typeColor[t.type]||T.teal}`,borderLeft:`4px solid ${typeColor[t.type]||T.teal}`,borderRadius:10,padding:'12px 16px',cursor:'pointer',boxShadow:'0 4px 24px #0008'}}>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:typeColor[t.type]||T.teal,fontSize:14}}>{t.title}</div>
          {t.body&&<div style={{color:T.muted,fontSize:12,marginTop:4}}>{t.body}</div>}
        </div>
      ))}
    </div>
  );
}

function Btn({children,onClick,color=T.teal,size='md',outline=false,disabled=false,style={}}) {
  const [hov,setHov]=useState(false);
  const [press,setPress]=useState(false);
  const v={m:"7px 14px",md:"10px 20px",lg:"13px 28px",xl:"16px 36px"}[size];
  const f={m:11,md:13,lg:14,xl:16}[size];
  const bg=outline?'transparent':(press?color+'cc':hov?color+'ee':color);
  return (
    <button disabled={disabled} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setPress(false);}} onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)} onClick={onClick}
      style={{padding:v,fontSize:f,fontFamily:'DM Sans,sans-serif',fontWeight:600,background:bg,color:outline?color:'#070d0d',border:`1.5px solid ${color}`,borderRadius:8,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.5:1,transition:'all .15s',...style}}>
      {children}
    </button>
  );
}

function Badge({children,color=T.teal}) {
  return <span style={{background:color+'22',color,border:`1px solid ${color}44`,borderRadius:6,padding:'2px 8px',fontSize:11,fontWeight:600,fontFamily:'DM Mono,monospace'}}>{children}</span>;
}

function Card({children,style={}}) {
  return <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:14,padding:20,...style}}>{children}</div>;
}

function Pill({children,active,color=T.teal,onClick}) {
  return <button onClick={onClick} style={{padding:'6px 14px',fontSize:12,fontWeight:600,fontFamily:'DM Sans,sans-serif',background:active?color+'22':'transparent',color:active?color:T.muted,border:`1px solid ${active?color:T.dim}`,borderRadius:20,cursor:'pointer',transition:'all .15s'}}>{children}</button>;
}

/* ─────────────────────────────────────────────────────────
   QRIS MODAL
───────────────────────────────────────────────────────── */
function QRISModal({amount,onPaid,onClose}) {
  const [status,setStatus]=useState('waiting');
  const [sec,setSec]=useState(0);
  const fmtRp = n=>'Rp '+n.toLocaleString('id-ID');
  const qr=[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[0,1],[6,1],[0,2],[2,2],[3,2],[4,2],[6,2],[0,3],[2,3],[4,3],[6,3],[0,4],[2,4],[3,4],[4,4],[6,4],[0,5],[6,5],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[9,0],[10,0],[11,0],[8,1],[12,1],[8,2],[10,2],[12,2],[8,3],[9,3],[12,3],[10,5],[11,5],[9,6],[10,6],[12,6],[14,0],[15,0],[14,2],[15,2],[16,2],[14,3],[16,3],[15,4],[16,4]];

  useEffect(()=>{
    const t=setInterval(()=>setSec(s=>s+1),1000);
    const p=setTimeout(()=>{setStatus('verifying');setTimeout(()=>{setStatus('paid');onPaid();},1200);},5000);
    return()=>{clearInterval(t);clearTimeout(p);};
  },[]);

  return (
    <div style={{position:'fixed',inset:0,background:'#000a',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={onClose}>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:18,padding:28,maxWidth:320,width:'90%',textAlign:'center'}} onClick={e=>e.stopPropagation()}>
        <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.text,fontSize:20,marginBottom:4}}>Scan untuk Bayar</div>
        <div style={{color:T.muted,fontSize:13,marginBottom:16}}>Semua bank & e-wallet diterima</div>
        <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.teal,fontSize:28,marginBottom:20}}>{fmtRp(amount)}</div>
        <div style={{display:'inline-block',background:'#fff',padding:12,borderRadius:10,marginBottom:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(17,8px)',gap:1}}>
            {Array(17).fill(0).map((_,y)=>Array(17).fill(0).map((_,x)=>{
              const filled=qr.some(([qx,qy])=>qx===x&&qy===y);
              return <div key={x+','+y} style={{width:8,height:8,background:filled?'#000':'#fff',borderRadius:filled?2:0}} />;
            }))}
          </div>
        </div>
        {status==='waiting'&&<div style={{color:T.muted,fontSize:13,marginBottom:16}}>Menunggu pembayaran… ({sec}d)</div>}
        {status==='verifying'&&<div style={{color:T.amber,fontSize:13,marginBottom:16}}>Memverifikasi…</div>}
        {status==='paid'&&<div style={{color:T.green,fontSize:14,fontWeight:700,marginBottom:16}}>✓ Pembayaran Diterima</div>}
        {status==='waiting'&&<Btn onClick={()=>{setStatus('verifying');setTimeout(()=>{setStatus('paid');onPaid();},800);}} size="md" color={T.teal}>Simulasi Bayar</Btn>}
        <div style={{marginTop:12}}><Btn onClick={onClose} size="m" color={T.muted} outline>Tutup</Btn></div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PIN LOGIN
───────────────────────────────────────────────────────── */
function PinLogin({role,onLogin,onBack}) {
  const [pin,setPin]=useState("");
  const [err,setErr]=useState(false);
  const staff=STAFF.filter(s=>s.role===role);
  const rc={cashier:T.teal,bay:T.amber,barista:T.amber,admin:T.red}[role];
  const rl={cashier:"Kasir",bay:"Bay Cuci",barista:"Barista",admin:"Admin"}[role];
  const tryPin=(p)=>{const u=staff.find(s=>s.pin===p);if(u)onLogin(u);else{setErr(true);setTimeout(()=>{setErr(false);setPin("");},900);}};
  const press=(v)=>{if(v==="del"){setPin(p=>p.slice(0,-1));return;}const n=pin+v;setPin(n);if(n.length===4)setTimeout(()=>tryPin(n),100);};

  return (
    <div style={{minHeight:'100vh',background:T.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Sans,sans-serif'}}>
      <FontLink />
      <div style={{width:320,textAlign:'center'}}>
        <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:rc,fontSize:22,marginBottom:4}}>{rl}</div>
        <div style={{color:T.muted,fontSize:13,marginBottom:28}}>Masukkan PIN</div>
        <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:24}}>
          {[0,1,2,3].map(i=>(
            <div key={i} style={{width:14,height:14,borderRadius:'50%',background:i<pin.length?rc:T.dim,border:`2px solid ${i<pin.length?rc:T.border}`,transition:'all .15s'}} />
          ))}
        </div>
        {err&&<div style={{color:T.red,fontSize:13,marginBottom:12}}>PIN salah</div>}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16}}>
          {['1','2','3','4','5','6','7','8','9','','0','del'].map((v,i)=>(
            <button key={i} onClick={()=>v&&press(v)} disabled={!v} style={{padding:'14px 0',fontSize:v==='del'?16:20,fontFamily:'DM Mono,monospace',fontWeight:600,background:v?T.surface:'transparent',color:v==='del'?T.muted:T.text,border:`1px solid ${v?T.border:'transparent'}`,borderRadius:10,cursor:v?'pointer':'default',transition:'all .15s'}}>
              {v==='del'?'⌫':v}
            </button>
          ))}
        </div>
        <div style={{fontSize:11,color:T.dim,marginBottom:16}}>
          PIN Staf — {rl}:{staff.map(s=>`${s.name.split(' ')[0]}:${s.pin}`).join(' · ')}
        </div>
        <Btn onClick={onBack} size="m" color={T.muted} outline>← Kembali ke beranda</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MEMBER LOGIN
───────────────────────────────────────────────────────── */
function MemberLogin({onLogin,onBack}) {
  const [phone,setPhone]=useState("");
  const [pin,setPin]=useState("");
  const [step,setStep]=useState("phone");
  const [err,setErr]=useState("");
  const [member,setMember]=useState(null);

  const checkPhone=()=>{
    const m=store.getState().members.find(m=>m.phone===phone.replace(/\s/g,''));
    if(!m){setErr("Nomor telepon tidak ditemukan. Periksa kembali dan coba lagi.");return;}
    setMember(m);setStep("pin");setErr("");
  };
  const checkPin=(p)=>{
    if(p===member.pin){onLogin(member);}
    else{setErr("PIN salah. Coba lagi.");setPin("");setTimeout(()=>setErr(""),1500);}
  };
  const pressPin=(v)=>{
    if(v==='del'){setPin(p=>p.slice(0,-1));return;}
    const n=pin+v;setPin(n);if(n.length===4)setTimeout(()=>checkPin(n),100);
  };

  return (
    <div style={{minHeight:'100vh',background:T.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Sans,sans-serif'}}>
      <FontLink />
      <div style={{width:340,padding:24}}>
        <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.teal,fontSize:22,marginBottom:4,textAlign:'center'}}>Login Anggota</div>
        <div style={{color:T.muted,fontSize:13,marginBottom:28,textAlign:'center'}}>Akses akun SparkWash Anda</div>

        {step==='phone'&&(
          <>
            <label style={{color:T.muted,fontSize:12,display:'block',marginBottom:6}}>Nomor Telepon</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} onKeyDown={e=>e.key==='Enter'&&checkPhone()} placeholder="08xxxxxxxxxx"
              style={{width:'100%',padding:'12px 14px',background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:15,outline:'none',boxSizing:'border-box',marginBottom:12}} />
            {err&&<div style={{color:T.red,fontSize:12,marginBottom:10}}>{err}</div>}
            <Btn onClick={checkPhone} size="lg" style={{width:'100%',marginBottom:20}}>Lanjut →</Btn>
            <div style={{color:T.dim,fontSize:11,textAlign:'center'}}>Akun demo: 081234567890 · 082198765432 · 081711112222</div>
          </>
        )}

        {step==='pin'&&(
          <>
            <div style={{textAlign:'center',marginBottom:20}}>
              <div style={{color:T.text,fontWeight:600,fontSize:16}}>Selamat datang kembali, {member?.name.split(' ')[0]}</div>
              <div style={{color:T.muted,fontSize:13,marginTop:4}}>Masukkan PIN 4 digit Anda</div>
            </div>
            <div style={{display:'flex',gap:12,justifyContent:'center',marginBottom:20}}>
              {[0,1,2,3].map(i=>(
                <div key={i} style={{width:14,height:14,borderRadius:'50%',background:i<pin.length?T.teal:T.dim,border:`2px solid ${i<pin.length?T.teal:T.border}`,transition:'all .15s'}} />
              ))}
            </div>
            {err&&<div style={{color:T.red,fontSize:13,marginBottom:12,textAlign:'center'}}>{err}</div>}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16}}>
              {['1','2','3','4','5','6','7','8','9','','0','del'].map((v,i)=>(
                <button key={i} onClick={()=>v&&pressPin(v)} disabled={!v} style={{padding:'14px 0',fontSize:v==='del'?16:20,fontFamily:'DM Mono,monospace',fontWeight:600,background:v?T.surface:'transparent',color:v==='del'?T.muted:T.text,border:`1px solid ${v?T.border:'transparent'}`,borderRadius:10,cursor:v?'pointer':'default'}}>
                  {v==='del'?'⌫':v}
                </button>
              ))}
            </div>
            <Btn onClick={()=>{setStep('phone');setPin('');setErr('');}} size="m" color={T.muted} outline style={{width:'100%',marginBottom:10}}>← Nomor lain</Btn>
          </>
        )}

        <div style={{textAlign:'center',marginTop:8}}>
          <Btn onClick={onBack} size="m" color={T.muted} outline>← Kembali ke beranda</Btn>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MEMBER DASHBOARD
───────────────────────────────────────────────────────── */
function MemberDashboard({member,onLogout}) {
  const [tab,setTab]=useState('home');
  const [coffeeCart,setCoffeeCart]=useState([]);
  const [catFilter,setCatFilter]=useState('Semua');
  const [coffeeQris,setCoffeeQris]=useState(null);
  const {toasts,show,dismiss}=useToast();
  const tickets=useStore(s=>s.tickets);
  const coffeeOrders=useStore(s=>s.coffeeOrders);
  const seenStatuses=useRef({});

  const plan=MEMBERSHIP_PLANS.find(p=>p.id===member.planId);
  const myTickets=tickets.filter(t=>t.memberId===member.id);
  const myOrders=coffeeOrders.filter(o=>o.memberId===member.id);
  const activeTicket=myTickets.find(t=>t.status!=='done'&&t.status!=='cancelled');
  const fmtRp=n=>'Rp '+n.toLocaleString('id-ID');

  // Notifications
  useEffect(()=>{
    if(typeof Notification!=='undefined'&&Notification.permission==='default') Notification.requestPermission();
  },[]);

  useEffect(()=>{
    myTickets.forEach(t=>{
      const prev=seenStatuses.current['t_'+t.id];
      if(prev!==t.status){
        seenStatuses.current['t_'+t.id]=t.status;
        if(prev!==undefined){
          if(t.status==='washing') show('🚿 Cuci Dimulai',`${t.plate} sedang dicuci — Bay ${t.bay}`,'info',5000);
          if(t.status==='done') show('🚗 Cuci Mobil Selesai!',`${t.plate} sudah siap di pintu keluar.`,'success',0);
        }
      }
    });
    myOrders.forEach(o=>{
      const prev=seenStatuses.current['o_'+o.id];
      if(prev!==o.status){
        seenStatuses.current['o_'+o.id]=o.status;
        if(prev!==undefined){
          if(o.status==='preparing') show('Pesanan Diterima','Barista sedang membuat pesanan Anda.','info',4000);
          if(o.status==='ready') show('☕ Pesanan Siap!','Kopi Anda sudah siap di counter kafe. Silakan ambil!','success',0);
        }
      }
    });
  },[tickets,coffeeOrders]);

  const cats=['Semua',...new Set(COFFEE_ITEMS.map(c=>c.cat))];
  const filteredCoffee=catFilter==='Semua'?COFFEE_ITEMS:COFFEE_ITEMS.filter(c=>c.cat===catFilter);
  const cartTotal=coffeeCart.reduce((s,i)=>s+i.price*i.qty,0);

  const placeOrder=()=>{
    if(coffeeCart.length===0) return;
    if(cartTotal>0){
      setCoffeeQris({amount:cartTotal,onPaid:()=>{
        store.addCoffeeOrder({memberId:member.id,memberName:member.name,items:coffeeCart,total:cartTotal,source:'member_app'});
        store.logAction({action:'coffee_order',note:`${member.name} pesan kopi ${fmtRp(cartTotal)}`});
        setCoffeeCart([]);setCoffeeQris(null);
        show('Pesanan Dibuat!','Kopi Anda akan segera siap di counter kafe.','success',4000);
      }});
    } else {
      store.addCoffeeOrder({memberId:member.id,memberName:member.name,items:coffeeCart,total:0,source:'member_app'});
      setCoffeeCart([]);
      show('Pesanan Dibuat!','Kopi Anda akan segera siap di counter kafe.','success',4000);
    }
  };

  const addToCart=(item)=>{
    setCoffeeCart(p=>{
      const ex=p.find(i=>i.id===item.id);
      return ex?p.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i):[...p,{...item,qty:1}];
    });
  };

  const fmtDate=d=>{try{return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short'})}catch(e){return '-'}};
  const planEnd=plan?new Date(new Date(member.planStart).setMonth(new Date(member.planStart).getMonth()+plan.duration)):null;
  const daysLeft=planEnd?Math.max(0,Math.ceil((planEnd-Date.now())/86400000)):0;

  const REWARDS=[
    {name:'Cuci Eksterior Gratis',points:500,icon:'🚗'},
    {name:'Kopi Gratis',points:300,icon:'☕'},
    {name:'Diskon 50% Full Detail',points:800,icon:'⭐'},
    {name:'Wax & Polish Gratis',points:1200,icon:'💎'},
  ];

  const statusBadge=(s)=>({
    waiting:<Badge color={T.amber}>🕐 Menunggu bay</Badge>,
    washing:<Badge color={T.teal}>🚿 Sedang dicuci — Bay {activeTicket?.bay}</Badge>,
    done:<Badge color={T.green}>✓ Selesai</Badge>,
  }[s]||null);

  return (
    <div style={{minHeight:'100vh',background:T.bg,fontFamily:'DM Sans,sans-serif',paddingBottom:80}}>
      <FontLink />
      <Toast toasts={toasts} dismiss={dismiss} />
      {coffeeQris&&<QRISModal amount={coffeeQris.amount} onPaid={coffeeQris.onPaid} onClose={()=>setCoffeeQris(null)} />}

      {/* Sticky floating cart bar */}
      {coffeeCart.length>0&&tab==='coffee'&&(
        <div style={{position:'fixed',bottom:0,left:0,right:0,background:T.surface,borderTop:`2px solid ${T.teal}`,padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:200,boxShadow:'0 -4px 24px #000a'}}>
          <div>
            <div style={{color:T.text,fontWeight:700,fontSize:14}}>{coffeeCart.reduce((s,i)=>s+i.qty,0)} item dipilih</div>
            <div style={{color:T.teal,fontFamily:'DM Mono,monospace',fontWeight:700,fontSize:16}}>{fmtRp(cartTotal)}</div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <Btn onClick={()=>setCoffeeCart([])} size="md" color={T.muted} outline>Batal</Btn>
            <Btn onClick={placeOrder} size="md" color={T.teal}>Bayar & Pesan →</Btn>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.teal,fontSize:18}}>SparkWash</div>
          <div style={{color:T.muted,fontSize:12}}>Anggota · {member.name}</div>
        </div>
        <Btn onClick={onLogout} size="m" color={T.muted} outline>← Keluar</Btn>
      </div>

      {/* Tabs */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'10px 16px',display:'flex',gap:8,overflowX:'auto'}}>
        {[['home','🏠 Beranda'],['cars','🚗 Mobil Saya'],['coffee','☕ Pesan Kopi'],['rewards','🎁 Hadiah']].map(([id,label])=>(
          <Pill key={id} active={tab===id} onClick={()=>setTab(id)}>{label}</Pill>
        ))}
      </div>

      <div style={{padding:16,maxWidth:600,margin:'0 auto'}}>

        {/* HOME TAB */}
        {tab==='home'&&(
          <>
            {/* Active ticket */}
            {activeTicket&&(
              <Card style={{marginBottom:16,border:`1px solid ${T.teal}44`,background:T.tealGlow}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <span style={{fontSize:20}}>🚗</span>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.teal,fontSize:15}}>Mobil dalam antrian</div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontFamily:'DM Mono,monospace',color:T.text,fontSize:18,fontWeight:600}}>{activeTicket.plate}</div>
                    <div style={{color:T.muted,fontSize:12}}>{activeTicket.services?.map(s=>s.name).join(', ')}</div>
                  </div>
                  {statusBadge(activeTicket.status)}
                </div>
                <div style={{color:T.muted,fontSize:12,marginTop:8}}>Antrian #{activeTicket.queueNo}</div>
              </Card>
            )}

            {/* Plan card */}
            <Card style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
                <div>
                  <div style={{color:T.muted,fontSize:11,marginBottom:4}}>✦ {plan?.name} Keanggotaan</div>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.text,fontSize:20}}>{member.name}</div>
                  <div style={{color:T.muted,fontSize:12,marginTop:4}}>{member.cars.length} mobil terdaftar</div>
                </div>
                <Badge color={T.teal}>{daysLeft} hari tersisa</Badge>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginTop:16}}>
                {[['Periode plan',`${fmtDate(member.planStart)} – ${planEnd?fmtDate(planEnd):'?'}`],['Total Cuci',member.washes],['Poin',member.points.toLocaleString('id-ID')]].map(([l,v])=>(
                  <div key={l} style={{background:T.faint,borderRadius:8,padding:'10px 12px'}}>
                    <div style={{color:T.muted,fontSize:10,marginBottom:4}}>{l}</div>
                    <div style={{color:T.teal,fontWeight:700,fontSize:13,fontFamily:'DM Mono,monospace'}}>{v}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent orders */}
            {myOrders.length>0&&(
              <Card>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,marginBottom:12}}>Pesanan Kopi Terkini</div>
                {myOrders.slice(0,3).map(o=>(
                  <div key={o.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                    <div style={{color:T.text,fontSize:13}}>{o.items.map(i=>i.name).join(', ')}</div>
                    <Badge color={o.status==='done'?T.green:o.status==='ready'?T.teal:o.status==='preparing'?T.amber:T.muted}>
                      {o.status==='new'?'Baru':o.status==='preparing'?'Dibuat':o.status==='ready'?'Siap':'Selesai'}
                    </Badge>
                  </div>
                ))}
              </Card>
            )}
          </>
        )}

        {/* CARS TAB */}
        {tab==='cars'&&(
          <>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.text,fontSize:16,marginBottom:16}}>Ringkasan Mobil</div>
            <div style={{color:T.muted,fontSize:12,marginBottom:12}}>Hingga 3 mobil terdaftar · 1 mobil per hari</div>
            {member.cars.map((car,ci)=>{
              const carTickets=myTickets.filter(t=>t.plate===car.plate);
              const lastWash=carTickets.filter(t=>t.status==='done').sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))[0];
              return (
                <Card key={ci} style={{marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <div>
                      <div style={{fontFamily:'DM Mono,monospace',color:T.text,fontSize:18,fontWeight:600}}>{car.plate}</div>
                      <div style={{color:T.muted,fontSize:12}}>{car.label}</div>
                    </div>
                    <Badge color={T.teal}>{carTickets.filter(t=>t.status==='done').length} kali cuci</Badge>
                  </div>
                  <div style={{color:T.dim,fontSize:12}}>Cuci terakhir: {lastWash?fmtDate(lastWash.timestamp):'Belum ada riwayat cuci untuk mobil ini.'}</div>
                </Card>
              );
            })}
          </>
        )}

        {/* COFFEE TAB */}
        {tab==='coffee'&&(
          <>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.text,fontSize:16,marginBottom:4}}>SparkCafé</div>
            <div style={{color:T.muted,fontSize:12,marginBottom:16}}>Pesan saat mobil Anda dicuci</div>

            {/* Category filter */}
            <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
              {cats.map(c=><Pill key={c} active={catFilter===c} onClick={()=>setCatFilter(c)}>{c}</Pill>)}
            </div>

            {/* Items */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
              {filteredCoffee.map(item=>{
                const inCart=coffeeCart.find(i=>i.id===item.id);
                return (
                  <Card key={item.id} style={{padding:14}}>
                    <div style={{fontSize:28,marginBottom:6}}>{item.icon}</div>
                    <div style={{color:T.text,fontWeight:600,fontSize:13,marginBottom:2}}>{item.name}</div>
                    <div style={{color:T.muted,fontSize:11,marginBottom:10}}>{item.cat}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{color:T.teal,fontWeight:700,fontSize:13}}>{fmtRp(item.price)}</div>
                      <Btn onClick={()=>addToCart(item)} size="m" color={inCart?T.green:T.teal}>{inCart?`+${inCart.qty}`:'Tambah'}</Btn>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Cart */}
            {coffeeCart.length>0&&(
              <Card style={{border:`1px solid ${T.teal}44`}}>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,marginBottom:12}}>Ringkasan Pesanan</div>
                {coffeeCart.map(i=>(
                  <div key={i.id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${T.border}`}}>
                    <span style={{color:T.text,fontSize:13}}>{i.name} x{i.qty}</span>
                    <span style={{color:T.muted,fontSize:13}}>{fmtRp(i.price*i.qty)}</span>
                  </div>
                ))}
                <div style={{display:'flex',justifyContent:'space-between',marginTop:12,marginBottom:16}}>
                  <span style={{color:T.text,fontWeight:600}}>Total</span>
                  <span style={{color:T.teal,fontWeight:700,fontFamily:'DM Mono,monospace'}}>{fmtRp(cartTotal)}</span>
                </div>
                <Btn onClick={placeOrder} size="md" style={{width:'100%'}}>Buat Pesanan — {fmtRp(cartTotal)}</Btn>
              </Card>
            )}
          </>
        )}

        {/* REWARDS TAB */}
        {tab==='rewards'&&(
          <>
            <Card style={{marginBottom:16,background:T.tealGlow,border:`1px solid ${T.teal}44`}}>
              <div style={{color:T.muted,fontSize:12,marginBottom:4}}>Kumpulkan poin setiap cuci & pesan</div>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.teal,fontSize:32}}>{member.points.toLocaleString('id-ID')}</div>
              <div style={{color:T.muted,fontSize:12}}>Saldo Anda · {fmtRp(member.points*10)} nilai hadiah</div>
            </Card>

            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,marginBottom:12}}>Cara mendapat poin</div>
            {[['Setiap cuci yang ditanggung plan','50 poin'],['Layanan & tambahan berbayar','1 poin/Rp1.000'],['Di SparkCafé saat menunggu','1 poin/Rp1.000']].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${T.border}`}}>
                <span style={{color:T.text,fontSize:13}}>{l}</span>
                <Badge color={T.teal}>{v}</Badge>
              </div>
            ))}

            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,margin:'20px 0 12px'}}>Tukar Poin</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {REWARDS.map(r=>{
                const canRedeem=member.points>=r.points;
                return (
                  <Card key={r.name} style={{padding:14,opacity:canRedeem?1:.6}}>
                    <div style={{fontSize:28,marginBottom:6}}>{r.icon}</div>
                    <div style={{color:T.text,fontWeight:600,fontSize:12,marginBottom:8}}>{r.name}</div>
                    <div style={{color:canRedeem?T.teal:T.muted,fontSize:11,marginBottom:8}}>{r.points} poin diperlukan</div>
                    <Btn size="m" color={canRedeem?T.teal:T.dim} disabled={!canRedeem}>{canRedeem?'Tukar':'Terkunci'}</Btn>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CASHIER PORTAL
───────────────────────────────────────────────────────── */
function CashierPortal({session,onLogout}) {
  const [tab,setTab]=useState('pos');
  const [plate,setPlate]=useState('');
  const [found,setFound]=useState(null);
  const [selectedServices,setSelectedServices]=useState([]);
  const [coffeeItems,setCoffeeItems]=useState([]);
  const [showCoffee,setShowCoffee]=useState(false);
  const [stage,setStage]=useState('lookup');
  const [qris,setQris]=useState(null);
  const [lastTicket,setLastTicket]=useState(null);
  const [alertModal,setAlertModal]=useState(null);
  const [alertNote,setAlertNote]=useState('');
  const [restockModal,setRestockModal]=useState(null);
  const [restockQty,setRestockQty]=useState('');
  const [editModal,setEditModal]=useState(null);
  const [editStock,setEditStock]=useState('');
  const [editReorder,setEditReorder]=useState('');

  const tickets=useStore(s=>s.tickets);
  const inventory=useStore(s=>s.inventory);
  const alerts=useStore(s=>s.alerts);
  const shiftLog=useStore(s=>s.shiftLog);
  const fmtRp=n=>'Rp '+n.toLocaleString('id-ID');
  const fmtTime=d=>{try{return new Date(d).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}catch(e){return '-'}};

  const todayTickets=tickets.filter(t=>{try{return new Date(t.timestamp).toDateString()===new Date().toDateString()}catch(e){return false;}});
  const lowInventory=inventory.filter(i=>i.stock<=i.reorder);
  const unreadAlerts=alerts.filter(a=>!a.read&&a.status==='pending').length;

  const lookup=()=>{
    if(!plate.trim()) return;
    const m=store.lookupByPlate(plate.trim());
    setFound(m||null);
    setStage('services');
  };

  const toggleService=(svc)=>{
    setSelectedServices(p=>p.find(s=>s.id===svc.id)?p.filter(s=>s.id!==svc.id):[...p,svc]);
  };

  const washTotal=found?0:selectedServices.reduce((s,v)=>s+v.price,0);
  const coffeeTotal=coffeeItems.reduce((s,i)=>s+i.price*i.qty,0);
  const grandTotal=washTotal+coffeeTotal;

  const issueTicket=()=>{
    const t=store.addTicket({
      memberId:found?.id||null,
      plate:plate.trim().toUpperCase(),
      services:selectedServices,
      coffeeItems,
      isMember:!!found,
      memberName:found?.name||null,
      total:grandTotal,
    });
    if(grandTotal>0){
      setQris({amount:grandTotal,onPaid:()=>{
        store.logAction({action:'ticket',note:`${plate.toUpperCase()} — ${fmtRp(grandTotal)}`});
        setLastTicket(t);setStage('done');setQris(null);
      }});
    } else {
      store.logAction({action:'ticket',note:`${plate.toUpperCase()} — Plan (Gratis)`});
      setLastTicket(t);setStage('done');
    }
  };

  const nextCustomer=()=>{
    setPlate('');setFound(null);setSelectedServices([]);setCoffeeItems([]);setStage('lookup');setLastTicket(null);setShowCoffee(false);
  };

  const addCoffeeToTicket=(item)=>{
    setCoffeeItems(p=>{const ex=p.find(i=>i.id===item.id);return ex?p.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i):[...p,{...item,qty:1}];});
  };

  const sendAlert=(item)=>{
    store.addAlert({itemId:item.id,itemName:item.name,type:'manual',note:alertNote,status:'pending',at:new Date(),read:false,requestedBy:session.name});
    store.logAction({action:'stock_alert',note:`Peringatan stok rendah: ${item.name}`});
    setAlertModal(null);setAlertNote('');
  };

  const doRestock=(item)=>{
    const qty=parseInt(restockQty);
    if(isNaN(qty)||qty<=0) return;
    store.restockItem(item.id,qty);
    store.logAction({action:'restock',note:`Isi ulang ${item.name} +${qty}`});
    setRestockModal(null);setRestockQty('');
  };

  const doEdit=(item)=>{
    store.updateInventoryItem(item.id,{stock:parseInt(editStock)||item.stock,reorder:parseInt(editReorder)||item.reorder});
    setEditModal(null);
  };

  const cats=['Kimia','Habis Pakai','Kafe','Utilitas'];
  const [invCat,setInvCat]=useState('Semua');
  const [invSearch,setInvSearch]=useState('');
  const filteredInv=inventory.filter(i=>(invCat==='Semua'||i.category===invCat)&&i.name.toLowerCase().includes(invSearch.toLowerCase()));

  return (
    <div style={{minHeight:'100vh',background:T.bg,fontFamily:'DM Sans,sans-serif',paddingBottom:80}}>
      <FontLink />
      {qris&&<QRISModal amount={qris.amount} onPaid={qris.onPaid} onClose={()=>setQris(null)} />}

      {/* Alert Modal */}
      {alertModal&&(
        <div style={{position:'fixed',inset:0,background:'#000a',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <Card style={{maxWidth:320,width:'90%',padding:24}}>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:15,marginBottom:4}}>Kirim Permintaan Pembelian</div>
            <div style={{color:T.muted,fontSize:12,marginBottom:12}}>Beritahu pemilik untuk mengisi ulang item ini</div>
            <div style={{color:T.amber,fontWeight:600,marginBottom:4}}>{alertModal.name}</div>
            <div style={{color:T.muted,fontSize:12,marginBottom:12}}>{alertModal.stock} {alertModal.unit} tersisa</div>
            <textarea value={alertNote} onChange={e=>setAlertNote(e.target.value)} placeholder="Catatan ke pemilik (opsional)" rows={3}
              style={{width:'100%',padding:'10px 12px',background:T.faint,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:13,resize:'none',boxSizing:'border-box',marginBottom:12}} />
            <div style={{display:'flex',gap:8}}>
              <Btn onClick={()=>setAlertModal(null)} size="md" color={T.muted} outline>Batal</Btn>
              <Btn onClick={()=>sendAlert(alertModal)} size="md" color={T.amber}>Kirim Permintaan</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.teal,fontSize:18}}>Kasir</div>
          <div style={{color:T.muted,fontSize:12}}>Hari ini: {new Date().toLocaleDateString('id-ID')}</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{color:T.muted,fontSize:12}}>{session.name}</div>
          <Btn onClick={onLogout} size="m" color={T.muted} outline>← Keluar</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'10px 16px',display:'flex',gap:8}}>
        <Pill active={tab==='pos'} onClick={()=>setTab('pos')}>POS</Pill>
        <Pill active={tab==='log'} onClick={()=>setTab('log')}>Log Shift</Pill>
        <div style={{position:'relative'}}>
          <Pill active={tab==='inv'} onClick={()=>setTab('inv')}>Inventaris</Pill>
          {lowInventory.length>0&&<span style={{position:'absolute',top:-4,right:-4,width:8,height:8,background:T.amber,borderRadius:'50%'}} />}
        </div>
      </div>

      <div style={{padding:16,maxWidth:600,margin:'0 auto'}}>

        {/* POS TAB */}
        {tab==='pos'&&(
          <>
            {stage==='lookup'&&(
              <Card>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:15,marginBottom:16}}>Masukkan Nomor Plat</div>
                <div style={{color:T.muted,fontSize:12,marginBottom:8}}>Cari anggota atau tamu</div>
                <div style={{display:'flex',gap:8}}>
                  <input value={plate} onChange={e=>setPlate(e.target.value)} onKeyDown={e=>e.key==='Enter'&&lookup()} placeholder="B 1234 ABC"
                    style={{flex:1,padding:'12px 14px',background:T.faint,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:15,outline:'none',fontFamily:'DM Mono,monospace'}} />
                  <Btn onClick={lookup} size="md">Cari →</Btn>
                </div>
                {todayTickets.length>0&&(
                  <div style={{marginTop:16}}>
                    <div style={{color:T.muted,fontSize:12,marginBottom:8}}>Tiket hari ini</div>
                    {todayTickets.slice(0,5).map(t=>(
                      <div key={t.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                        <div>
                          <span style={{fontFamily:'DM Mono,monospace',color:T.text,fontSize:13}}>{t.plate}</span>
                          <span style={{color:T.muted,fontSize:11,marginLeft:8}}>#{t.queueNo}</span>
                        </div>
                        <Badge color={t.status==='done'?T.green:t.status==='washing'?T.teal:T.amber}>{t.status==='waiting'?'Menunggu':t.status==='washing'?'Mencuci':t.status==='done'?'Selesai':'Dibatalkan'}</Badge>
                      </div>
                    ))}
                  </div>
                )}
                {todayTickets.length===0&&<div style={{color:T.dim,fontSize:13,marginTop:16}}>Belum ada transaksi.</div>}
              </Card>
            )}

            {stage==='services'&&(
              <Card>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div>
                    {found?<Badge color={T.teal}>✦ Anggota — {found.name}</Badge>:<Badge color={T.amber}>Tamu</Badge>}
                    <div style={{fontFamily:'DM Mono,monospace',color:T.text,fontSize:20,fontWeight:700,marginTop:4}}>{plate.toUpperCase()}</div>
                  </div>
                  <Btn onClick={nextCustomer} size="m" color={T.muted} outline>← Kembali</Btn>
                </div>

                {found&&<div style={{color:T.muted,fontSize:12,marginBottom:12}}>Plan aktif · Cuci ditanggung plan · Kopi ditagih via QRIS</div>}

                <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,marginBottom:10}}>Pilih Layanan</div>
                {SERVICES.map(svc=>{
                  const sel=selectedServices.find(s=>s.id===svc.id);
                  return (
                    <div key={svc.id} onClick={()=>toggleService(svc)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',borderRadius:8,marginBottom:6,cursor:'pointer',background:sel?T.tealGlow:T.faint,border:`1px solid ${sel?T.teal:T.border}`}}>
                      <div style={{display:'flex',gap:10,alignItems:'center'}}>
                        <span>{svc.icon}</span>
                        <div>
                          <div style={{color:T.text,fontWeight:600,fontSize:13}}>{svc.name}</div>
                          <div style={{color:T.muted,fontSize:11}}>{svc.duration} menit · {svc.dec}</div>
                        </div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{color:found?T.muted:T.teal,fontSize:13,fontWeight:600,textDecoration:found?'line-through':'none'}}>{fmtRp(svc.price)}</div>
                        {found&&<div style={{color:T.green,fontSize:11}}>Ditanggung Plan</div>}
                      </div>
                    </div>
                  );
                })}

                {/* Coffee add-on */}
                <div style={{marginTop:16}}>
                  <Btn onClick={()=>setShowCoffee(p=>!p)} size="m" color={T.amber} outline style={{width:'100%'}}>
                    {showCoffee?'Sembunyikan ▲':'Tambah Kopi ▼'}
                  </Btn>
                  {showCoffee&&(
                    <div style={{marginTop:10,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      {COFFEE_ITEMS.map(item=>{
                        const inCart=coffeeItems.find(i=>i.id===item.id);
                        return (
                          <div key={item.id} onClick={()=>addCoffeeToTicket(item)} style={{padding:'10px 12px',borderRadius:8,cursor:'pointer',background:inCart?T.amberGlow:T.faint,border:`1px solid ${inCart?T.amber:T.border}`}}>
                            <div style={{display:'flex',gap:8,alignItems:'center'}}>
                              <span>{item.icon}</span>
                              <div>
                                <div style={{color:T.text,fontSize:12,fontWeight:600}}>{item.name}</div>
                                <div style={{color:T.muted,fontSize:11}}>{fmtRp(item.price)}{inCart?` x${inCart.qty}`:''}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div style={{marginTop:16,padding:'12px 0',borderTop:`1px solid ${T.border}`}}>
                  {found&&<div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{color:T.muted,fontSize:13}}>Cuci (Ditanggung Plan)</span><span style={{color:T.green,fontSize:13}}>Gratis</span></div>}
                  {!found&&selectedServices.length>0&&<div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{color:T.muted,fontSize:13}}>Cuci</span><span style={{color:T.text,fontSize:13}}>{fmtRp(washTotal)}</span></div>}
                  {coffeeItems.length>0&&<div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{color:T.muted,fontSize:13}}>Kopi</span><span style={{color:T.text,fontSize:13}}>{fmtRp(coffeeTotal)}</span></div>}
                  {grandTotal>0&&<div style={{display:'flex',justifyContent:'space-between',marginTop:8}}><span style={{color:T.text,fontWeight:600}}>Tagihan QRIS</span><span style={{color:T.teal,fontWeight:700,fontFamily:'DM Mono,monospace'}}>{fmtRp(grandTotal)}</span></div>}
                </div>

                <Btn onClick={issueTicket} disabled={selectedServices.length===0} size="lg" style={{width:'100%',marginTop:8}}>
                  {grandTotal>0?`Bayar via QRIS — ${fmtRp(grandTotal)}`:'Terbitkan Tiket'}
                </Btn>
              </Card>
            )}

            {stage==='done'&&lastTicket&&(
              <Card style={{textAlign:'center'}}>
                <div style={{fontSize:48,marginBottom:8}}>✓</div>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.green,fontSize:20,marginBottom:4}}>Tiket diterbitkan untuk</div>
                <div style={{fontFamily:'DM Mono,monospace',color:T.text,fontSize:28,fontWeight:700,marginBottom:8}}>{lastTicket.plate}</div>
                <div style={{color:T.muted,fontSize:13,marginBottom:4}}>Antrian #{lastTicket.queueNo}</div>
                {lastTicket.isMember&&<div style={{marginBottom:4}}><Badge color={T.teal}>Anggota — {lastTicket.memberName}</Badge></div>}
                <div style={{marginTop:16,display:'flex',gap:8,justifyContent:'center'}}>
                  <Btn onClick={nextCustomer} size="lg" color={T.teal}>Pelanggan Berikutnya</Btn>
                </div>
              </Card>
            )}
          </>
        )}

        {/* LOG TAB */}
        {tab==='log'&&(
          <Card>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:15,marginBottom:12}}>Log Shift</div>
            {shiftLog.length===0&&<div style={{color:T.dim,fontSize:13}}>Belum ada entri.</div>}
            {shiftLog.map(l=>(
              <div key={l.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                <span style={{color:T.text,fontSize:13}}>{l.note}</span>
                <span style={{color:T.dim,fontSize:11,fontFamily:'DM Mono,monospace'}}>{fmtTime(l.at)}</span>
              </div>
            ))}
          </Card>
        )}

        {/* INVENTORY TAB */}
        {tab==='inv'&&(
          <>
            {lowInventory.length>0&&(
              <div style={{background:T.amberGlow,border:`1px solid ${T.amber}44`,borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{color:T.amber,fontWeight:600,fontSize:13}}>{lowInventory.length} item stok menipis atau habis</div>
                <Btn onClick={()=>setTab('inv')} size="m" color={T.amber}>Lihat Peringatan</Btn>
              </div>
            )}

            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16}}>
              {[['Total Item',inventory.length,T.teal],['Tipis / Habis',lowInventory.length,T.amber],['Stok Habis',inventory.filter(i=>i.stock===0).length,T.red]].map(([l,v,c])=>(
                <Card key={l} style={{padding:'12px 14px',textAlign:'center'}}>
                  <div style={{color:c,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:24}}>{v}</div>
                  <div style={{color:T.muted,fontSize:11,marginTop:4}}>{l}</div>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>
              {['Semua',...cats].map(c=><Pill key={c} active={invCat===c} onClick={()=>setInvCat(c)}>{c}</Pill>)}
            </div>
            <input value={invSearch} onChange={e=>setInvSearch(e.target.value)} placeholder="Cari item…"
              style={{width:'100%',padding:'10px 14px',background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:13,outline:'none',boxSizing:'border-box',marginBottom:12}} />

            {filteredInv.map(item=>{
              const pct=Math.min(100,(item.stock/Math.max(item.reorder*3,1))*100);
              const barColor=item.stock===0?T.red:item.stock<=item.reorder?T.amber:T.green;
              return (
                <Card key={item.id} style={{marginBottom:8,padding:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span style={{fontSize:20}}>{item.icon}</span>
                      <div>
                        <div style={{color:T.text,fontWeight:600,fontSize:13}}>{item.name}</div>
                        <div style={{color:T.muted,fontSize:11}}>{item.category} · Pesan ulang di: {item.reorder} {item.unit}</div>
                      </div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <Badge color={barColor}>{item.stock} {item.unit}</Badge>
                    </div>
                  </div>
                  <div style={{background:T.faint,borderRadius:4,height:6,marginBottom:8}}>
                    <div style={{width:`${pct}%`,height:'100%',background:barColor,borderRadius:4,transition:'width .4s'}} />
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <Btn onClick={()=>{setAlertModal(item);setAlertNote('');}} size="m" color={T.amber} outline>⚠ Peringatkan</Btn>
                  </div>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BAY PORTAL
───────────────────────────────────────────────────────── */
function BayPortal({session,onLogout}) {
  const tickets=useStore(s=>s.tickets);
  const fmtTime=d=>{try{return new Date(d).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}catch(e){return '-'}};

  const queue=tickets.filter(t=>t.status==='waiting');
  const active=tickets.filter(t=>t.status==='washing');
  const done=tickets.filter(t=>t.status==='done'&&new Date(t.timestamp).toDateString()===new Date().toDateString());

  const startWash=(ticket,bay)=>{
    store.patchTicket(ticket.id,{status:'washing',bay,washedBy:session.name});
    store.logAction({action:'wash_start',note:`${ticket.plate} mulai dicuci — Bay ${bay}`});
  };
  const markDone=(ticket)=>{
    store.patchTicket(ticket.id,{status:'done',doneAt:new Date()});
    store.logAction({action:'wash_done',note:`${ticket.plate} selesai dicuci`});
  };

  return (
    <div style={{minHeight:'100vh',background:T.bg,fontFamily:'DM Sans,sans-serif',paddingBottom:80}}>
      <FontLink />
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.amber,fontSize:18}}>Bay Cuci</div>
          <div style={{color:T.muted,fontSize:12}}>{session.name}</div>
        </div>
        <Btn onClick={onLogout} size="m" color={T.muted} outline>← Keluar</Btn>
      </div>

      <div style={{padding:16,maxWidth:600,margin:'0 auto'}}>

        {/* Active */}
        {active.length>0&&(
          <>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,marginBottom:10}}>Sedang Berjalan ({active.length})</div>
            {active.map(t=>(
              <Card key={t.id} style={{marginBottom:10,border:`1px solid ${T.teal}44`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontFamily:'DM Mono,monospace',color:T.text,fontSize:18,fontWeight:700}}>{t.plate}</div>
                    <div style={{color:T.muted,fontSize:12}}>{t.services?.map(s=>s.name).join(', ')}</div>
                    <div style={{color:T.muted,fontSize:11,marginTop:4}}>Bay {t.bay} · {fmtTime(t.timestamp)}</div>
                  </div>
                  <Btn onClick={()=>markDone(t)} size="md" color={T.green}>✓ Selesai</Btn>
                </div>
              </Card>
            ))}
          </>
        )}

        {/* Queue */}
        <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,margin:'16px 0 10px'}}>Antrian ({queue.length})</div>
        {queue.length===0&&<div style={{color:T.dim,fontSize:13,marginBottom:16}}>Antrian kosong.</div>}
        {queue.map(t=>(
          <Card key={t.id} style={{marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:10}}>
              <div>
                <div style={{fontFamily:'DM Mono,monospace',color:T.text,fontSize:18,fontWeight:700}}>{t.plate}</div>
                <div style={{color:T.muted,fontSize:12}}>{t.services?.map(s=>s.name).join(', ')}</div>
                <div style={{color:T.muted,fontSize:11,marginTop:4}}>#{t.queueNo} · {fmtTime(t.timestamp)}</div>
                {t.isMember&&<div style={{marginTop:4}}><Badge color={T.teal}>Anggota</Badge></div>}
              </div>
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {[1,2,3,4].map(b=>(
                <Btn key={b} onClick={()=>startWash(t,b)} size="m" color={T.amber}>Bay {b} → Mulai</Btn>
              ))}
            </div>
          </Card>
        ))}

        {/* Done today */}
        {done.length>0&&(
          <>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,margin:'16px 0 10px'}}>Selesai Hari Ini ({done.length})</div>
            {done.map(t=>(
              <div key={t.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                <div>
                  <span style={{fontFamily:'DM Mono,monospace',color:T.muted,fontSize:13}}>{t.plate}</span>
                  <span style={{color:T.dim,fontSize:11,marginLeft:8}}>{t.services?.map(s=>s.name).join(', ')}</span>
                </div>
                <Badge color={T.green}>Selesai</Badge>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   BARISTA PORTAL
───────────────────────────────────────────────────────── */
function BaristaPortal({session,onLogout}) {
  const [tab,setTab]=useState('new');
  const [cart,setCart]=useState([]);
  const [showPos,setShowPos]=useState(false);
  const [qris,setQris]=useState(null);
  const [platePOS,setPlatePOS]=useState('');

  const coffeeOrders=useStore(s=>s.coffeeOrders);
  const fmtRp=n=>'Rp '+n.toLocaleString('id-ID');
  const fmtTime=d=>{try{return new Date(d).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}catch(e){return '-'}};

  const filterOrders=status=>coffeeOrders.filter(o=>o.status===status);
  const advance=(o)=>{
    const next={new:'preparing',preparing:'ready',ready:'done'}[o.status];
    if(next) store.patchCoffeeOrder(o.id,{status:next});
  };
  const actionLabel=(s)=>({new:'Mulai Buat',preparing:'Tandai Siap',ready:'Tandai Selesai'}[s]||'');

  const addToCart=(item)=>{
    setCart(p=>{const ex=p.find(i=>i.id===item.id);return ex?p.map(i=>i.id===item.id?{...i,qty:i.qty+1}:i):[...p,{...item,qty:1}];});
  };
  const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);

  const chargeQRIS=()=>{
    if(cart.length===0) return;
    setQris({amount:cartTotal,onPaid:()=>{
      store.addCoffeeOrder({items:cart,total:cartTotal,source:'barista_pos',plate:platePOS,memberName:null,memberId:null});
      store.logAction({action:'coffee_pos',note:`POS Tamu ${fmtRp(cartTotal)}`});
      setCart([]);setPlatePOS('');setQris(null);
    }});
  };

  const statusLabel={new:'Baru',preparing:'Dibuat',ready:'Siap',done:'Selesai'};
  const tabs=['new','preparing','ready','done'];

  return (
    <div style={{minHeight:'100vh',background:T.bg,fontFamily:'DM Sans,sans-serif',paddingBottom:80}}>
      <FontLink />
      {qris&&<QRISModal amount={qris.amount} onPaid={qris.onPaid} onClose={()=>setQris(null)} />}

      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.amber,fontSize:18}}>Barista</div>
          <div style={{color:T.muted,fontSize:12}}>{session.name}</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Btn onClick={()=>setShowPos(p=>!p)} size="m" color={T.amber} outline>POS Tamu</Btn>
          <Btn onClick={onLogout} size="m" color={T.muted} outline>← Keluar</Btn>
        </div>
      </div>

      {/* Walk-in POS */}
      {showPos&&(
        <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:16}}>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,marginBottom:10}}>POS Tamu</div>
          <input value={platePOS} onChange={e=>setPlatePOS(e.target.value)} placeholder="plat pelanggan (opsional)"
            style={{width:'100%',padding:'8px 12px',background:T.faint,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:13,outline:'none',boxSizing:'border-box',marginBottom:10}} />
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:10}}>
            {COFFEE_ITEMS.map(item=>{
              const inCart=cart.find(i=>i.id===item.id);
              return (
                <div key={item.id} onClick={()=>addToCart(item)} style={{padding:'8px 10px',borderRadius:8,cursor:'pointer',background:inCart?T.amberGlow:T.faint,border:`1px solid ${inCart?T.amber:T.border}`}}>
                  <div style={{fontSize:18,marginBottom:2}}>{item.icon}</div>
                  <div style={{color:T.text,fontSize:11,fontWeight:600}}>{item.name}</div>
                  <div style={{color:T.muted,fontSize:10}}>{fmtRp(item.price)}{inCart?` x${inCart.qty}`:''}</div>
                </div>
              );
            })}
          </div>
          {cart.length>0&&(
            <div style={{background:T.faint,borderRadius:8,padding:12}}>
              <div style={{fontWeight:600,color:T.text,fontSize:13,marginBottom:6}}>Keranjang</div>
              {cart.map(i=><div key={i.id} style={{display:'flex',justifyContent:'space-between',fontSize:12,color:T.muted,marginBottom:4}}><span>{i.name} x{i.qty}</span><span>{fmtRp(i.price*i.qty)}</span></div>)}
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:700,color:T.teal,marginTop:8,marginBottom:8}}>
                <span>Total</span><span>{fmtRp(cartTotal)}</span>
              </div>
              <Btn onClick={chargeQRIS} size="md" color={T.amber} style={{width:'100%'}}>Tagih QRIS — {fmtRp(cartTotal)}</Btn>
            </div>
          )}
        </div>
      )}

      {/* Order tabs */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'10px 16px',display:'flex',gap:8}}>
        {tabs.map(s=>(
          <Pill key={s} active={tab===s} onClick={()=>setTab(s)} color={T.amber}>
            {statusLabel[s]} ({filterOrders(s).length})
          </Pill>
        ))}
      </div>

      <div style={{padding:16,maxWidth:600,margin:'0 auto'}}>
        {filterOrders(tab).length===0&&<div style={{color:T.dim,fontSize:13}}>Tidak ada pesanan {statusLabel[tab].toLowerCase()}.</div>}
        {filterOrders(tab).map(o=>(
          <Card key={o.id} style={{marginBottom:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
              <div>
                <div style={{color:T.text,fontWeight:600,fontSize:14}}>{o.memberName||o.plate||'Tamu'}</div>
                <div style={{color:T.muted,fontSize:11}}>{fmtTime(o.timestamp)}</div>
              </div>
              <div style={{display:'flex',gap:6}}>
                {o.source==='barista_pos'&&<Badge color={T.amber}>Tamu</Badge>}
                {o.source==='member_app'&&<Badge color={T.green}>Aplikasi</Badge>}
              </div>
            </div>
            <div style={{marginBottom:10}}>
              {o.items.map((i,idx)=>(
                <div key={idx} style={{display:'flex',justifyContent:'space-between',fontSize:13,color:T.muted,padding:'4px 0',borderBottom:`1px solid ${T.border}`}}>
                  <span>{i.icon} {i.name} x{i.qty}</span>
                  <span>{fmtRp(i.price*i.qty)}</span>
                </div>
              ))}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{color:T.teal,fontWeight:700,fontFamily:'DM Mono,monospace'}}>{fmtRp(o.total)}</div>
              {o.status!=='done'&&<Btn onClick={()=>advance(o)} size="md" color={T.amber}>{actionLabel(o.status)}</Btn>}
              {o.status==='done'&&<Badge color={T.green}>✓ Selesai</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ADMIN PORTAL
───────────────────────────────────────────────────────── */
function AdminPortal({session,onLogout}) {
  const [tab,setTab]=useState('dash');
  const [memberSearch,setMemberSearch]=useState('');
  const [restockModal,setRestockModal]=useState(null);
  const [restockQty,setRestockQty]=useState('');
  const [editModal,setEditModal]=useState(null);
  const [editStock,setEditStock]=useState('');
  const [editReorder,setEditReorder]=useState('');
  const [invCat,setInvCat]=useState('Semua');
  const [invSearch,setInvSearch]=useState('');

  const tickets=useStore(s=>s.tickets);
  const coffeeOrders=useStore(s=>s.coffeeOrders);
  const members=useStore(s=>s.members);
  const shiftLog=useStore(s=>s.shiftLog);
  const inventory=useStore(s=>s.inventory);
  const alerts=useStore(s=>s.alerts);

  const fmtRp=n=>'Rp '+n.toLocaleString('id-ID');
  const fmtTime=d=>{try{return new Date(d).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}catch(e){return '-'}};

  const today=new Date().toDateString();
  const todayTickets=tickets.filter(t=>new Date(t.timestamp).toDateString()===today);
  const todayOrders=coffeeOrders.filter(o=>new Date(o.timestamp).toDateString()===today);
  const washRev=todayTickets.filter(t=>!t.isMember||t.total>0).reduce((s,t)=>s+(t.total||0),0);
  const coffeeRev=todayOrders.reduce((s,o)=>s+o.total,0);
  const totalRev=washRev+coffeeRev;
  const activeQueue=tickets.filter(t=>t.status==='waiting'||t.status==='washing');
  const memberCount=members.length;
  const unreadAlerts=alerts.filter(a=>!a.read&&a.status==='pending').length;
  const lowInventory=inventory.filter(i=>i.stock<=i.reorder);
  const cats=['Kimia','Habis Pakai','Kafe','Utilitas'];

  const exportCSV=()=>{
    const rows=[['Plat','Layanan','Total','Tipe','Status','Waktu'],...todayTickets.map(t=>[t.plate,t.services?.map(s=>s.name).join(';'),t.total,t.isMember?'Anggota':'Tamu',t.status,new Date(t.timestamp).toISOString()])];
    const csv=rows.map(r=>r.join(',')).join('\n');
    const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='sparkwash-laporan.csv';a.click();
  };

  const doRestock=(item)=>{
    const qty=parseInt(restockQty);
    if(isNaN(qty)||qty<=0) return;
    store.restockItem(item.id,qty);
    store.logAction({action:'restock',note:`Isi ulang ${item.name} +${qty}`});
    setRestockModal(null);setRestockQty('');
  };

  const doEdit=(item)=>{
    store.updateInventoryItem(item.id,{stock:parseInt(editStock)||item.stock,reorder:parseInt(editReorder)||item.reorder});
    setEditModal(null);
  };

  const filteredInv=inventory.filter(i=>(invCat==='Semua'||i.category===invCat)&&i.name.toLowerCase().includes(invSearch.toLowerCase()));
  const filteredMembers=members.filter(m=>m.name.toLowerCase().includes(memberSearch.toLowerCase())||m.cars.some(c=>c.plate.toLowerCase().includes(memberSearch.toLowerCase())));

  return (
    <div style={{minHeight:'100vh',background:T.bg,fontFamily:'DM Sans,sans-serif',paddingBottom:80}}>
      <FontLink />

      {/* Restock Modal */}
      {restockModal&&(
        <div style={{position:'fixed',inset:0,background:'#000a',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <Card style={{maxWidth:300,width:'90%',padding:24}}>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:15,marginBottom:4}}>Isi Ulang Item</div>
            <div style={{color:T.teal,fontWeight:600,marginBottom:4}}>{restockModal.name}</div>
            <div style={{color:T.muted,fontSize:12,marginBottom:12}}>Saat ini: {restockModal.stock} {restockModal.unit}</div>
            <input value={restockQty} onChange={e=>setRestockQty(e.target.value)} type="number" placeholder="Tambah jumlah (mis. 10)"
              style={{width:'100%',padding:'10px 12px',background:T.faint,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:13,outline:'none',boxSizing:'border-box',marginBottom:8}} />
            {restockQty&&!isNaN(parseInt(restockQty))&&<div style={{color:T.muted,fontSize:12,marginBottom:12}}>Total baru: {restockModal.stock+parseInt(restockQty)} {restockModal.unit} · {fmtRp((restockModal.stock+parseInt(restockQty))*restockModal.pricePerUnit)} estimasi nilai</div>}
            <div style={{display:'flex',gap:8}}>
              <Btn onClick={()=>setRestockModal(null)} size="md" color={T.muted} outline>Batal</Btn>
              <Btn onClick={()=>doRestock(restockModal)} size="md" color={T.teal}>Konfirmasi Isi Ulang</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Modal */}
      {editModal&&(
        <div style={{position:'fixed',inset:0,background:'#000a',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <Card style={{maxWidth:300,width:'90%',padding:24}}>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:15,marginBottom:12}}>Ubah — {editModal.name}</div>
            {[['Stok Saat Ini',editStock,setEditStock,editModal.stock],['Batas Pemesanan Ulang',editReorder,setEditReorder,editModal.reorder]].map(([l,v,sv,ph])=>(
              <div key={l} style={{marginBottom:10}}>
                <label style={{color:T.muted,fontSize:12,display:'block',marginBottom:4}}>{l}</label>
                <input value={v} onChange={e=>sv(e.target.value)} type="number" placeholder={String(ph)}
                  style={{width:'100%',padding:'10px 12px',background:T.faint,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:13,outline:'none',boxSizing:'border-box'}} />
              </div>
            ))}
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <Btn onClick={()=>setEditModal(null)} size="md" color={T.muted} outline>Batal</Btn>
              <Btn onClick={()=>doEdit(editModal)} size="md" color={T.teal}>Simpan</Btn>
            </div>
          </Card>
        </div>
      )}

      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.red,fontSize:18}}>Admin</div>
          <div style={{color:T.muted,fontSize:12}}>{session.name}</div>
        </div>
        <Btn onClick={onLogout} size="m" color={T.muted} outline>← Keluar</Btn>
      </div>

      {/* Tabs */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:'10px 16px',display:'flex',gap:8,overflowX:'auto'}}>
        <Pill active={tab==='dash'} onClick={()=>setTab('dash')} color={T.red}>Dasbor</Pill>
        <Pill active={tab==='members'} onClick={()=>setTab('members')} color={T.red}>Anggota</Pill>
        <Pill active={tab==='inv'} onClick={()=>setTab('inv')} color={T.red}>
          Inventaris {lowInventory.length>0&&<span style={{background:T.amber,color:'#070d0d',borderRadius:'50%',padding:'0 4px',fontSize:10,marginLeft:4}}>{lowInventory.length}</span>}
        </Pill>
        <Pill active={tab==='alerts'} onClick={()=>{setTab('alerts');store.markAllAlertsRead();}} color={T.red}>
          Permintaan {unreadAlerts>0&&<span style={{background:T.red,color:'#fff',borderRadius:'50%',padding:'0 4px',fontSize:10,marginLeft:4}}>{unreadAlerts}</span>}
        </Pill>
        <Pill active={tab==='report'} onClick={()=>setTab('report')} color={T.red}>Laporan</Pill>
      </div>

      <div style={{padding:16,maxWidth:600,margin:'0 auto'}}>

        {/* DASHBOARD */}
        {tab==='dash'&&(
          <>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.text,fontSize:16,marginBottom:16}}>Ringkasan Hari Ini</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              {[
                ['Total Pendapatan',fmtRp(totalRev),'Semua sumber',T.teal],
                ['Antrian Sekarang',activeQueue.length,`${activeQueue.filter(t=>t.status==='washing').length} sedang dicuci`,T.amber],
                ['Pendapatan Cuci',fmtRp(washRev),`${todayTickets.length} tiket`,T.green],
                ['Pendapatan Kopi',fmtRp(coffeeRev),`${todayOrders.length} pesanan`,T.amber],
              ].map(([l,v,s,c])=>(
                <Card key={l} style={{padding:14}}>
                  <div style={{color:T.muted,fontSize:11,marginBottom:4}}>{l}</div>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:c,fontSize:20}}>{v}</div>
                  <div style={{color:T.dim,fontSize:11,marginTop:4}}>{s}</div>
                </Card>
              ))}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              {[['Anggota',memberCount,'Plan aktif',T.teal],['Tamu',todayTickets.filter(t=>!t.isMember).length,'Hari ini',T.muted]].map(([l,v,s,c])=>(
                <Card key={l} style={{padding:14}}>
                  <div style={{color:T.muted,fontSize:11,marginBottom:4}}>{l}</div>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:c,fontSize:20}}>{v}</div>
                  <div style={{color:T.dim,fontSize:11,marginTop:4}}>{s}</div>
                </Card>
              ))}
            </div>

            <Card>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,marginBottom:12}}>Antrian Langsung</div>
              {activeQueue.length===0&&<div style={{color:T.dim,fontSize:13}}>Belum ada tiket.</div>}
              {activeQueue.map(t=>(
                <div key={t.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                  <div>
                    <span style={{fontFamily:'DM Mono,monospace',color:T.text,fontSize:13}}>{t.plate}</span>
                    <span style={{color:T.muted,fontSize:11,marginLeft:8}}>#{t.queueNo}</span>
                    {t.isMember&&<span style={{marginLeft:6}}><Badge color={T.teal}>A</Badge></span>}
                  </div>
                  <Badge color={t.status==='washing'?T.teal:T.amber}>{t.status==='washing'?`Bay ${t.bay}`:'Menunggu'}</Badge>
                </div>
              ))}
            </Card>
          </>
        )}

        {/* MEMBERS */}
        {tab==='members'&&(
          <>
            <input value={memberSearch} onChange={e=>setMemberSearch(e.target.value)} placeholder="Cari nama atau plat…"
              style={{width:'100%',padding:'10px 14px',background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:13,outline:'none',boxSizing:'border-box',marginBottom:12}} />
            {filteredMembers.map(m=>{
              const plan=MEMBERSHIP_PLANS.find(p=>p.id===m.planId);
              const planEnd=plan?new Date(new Date(m.planStart).setMonth(new Date(m.planStart).getMonth()+plan.duration)):null;
              const daysLeft=planEnd?Math.max(0,Math.ceil((planEnd-Date.now())/86400000)):0;
              return (
                <Card key={m.id} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
                    <div>
                      <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:15}}>{m.name}</div>
                      <div style={{color:T.muted,fontSize:12}}>{m.phone}</div>
                    </div>
                    <Badge color={T.teal}>{daysLeft} hari</Badge>
                  </div>
                  <div style={{color:T.muted,fontSize:12,marginBottom:6}}>{plan?.name} · {m.cars.length} mobil · {m.washes} kali cuci · {m.points} poin</div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {m.cars.map((c,i)=><Badge key={i} color={T.dim}>{c.plate}</Badge>)}
                  </div>
                </Card>
              );
            })}
          </>
        )}

        {/* INVENTORY */}
        {tab==='inv'&&(
          <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16}}>
              {[['Total Item',inventory.length,T.teal],['Tipis / Habis',lowInventory.length,T.amber],['Stok Habis',inventory.filter(i=>i.stock===0).length,T.red]].map(([l,v,c])=>(
                <Card key={l} style={{padding:'12px 14px',textAlign:'center'}}>
                  <div style={{color:c,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:24}}>{v}</div>
                  <div style={{color:T.muted,fontSize:11,marginTop:4}}>{l}</div>
                </Card>
              ))}
            </div>

            <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>
              {['Semua',...cats].map(c=><Pill key={c} active={invCat===c} onClick={()=>setInvCat(c)} color={T.red}>{c}</Pill>)}
            </div>
            <input value={invSearch} onChange={e=>setInvSearch(e.target.value)} placeholder="Cari item…"
              style={{width:'100%',padding:'10px 14px',background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,fontSize:13,outline:'none',boxSizing:'border-box',marginBottom:12}} />

            {filteredInv.map(item=>{
              const pct=Math.min(100,(item.stock/Math.max(item.reorder*3,1))*100);
              const barColor=item.stock===0?T.red:item.stock<=item.reorder?T.amber:T.green;
              return (
                <Card key={item.id} style={{marginBottom:8,padding:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span style={{fontSize:20}}>{item.icon}</span>
                      <div>
                        <div style={{color:T.text,fontWeight:600,fontSize:13}}>{item.name}</div>
                        <div style={{color:T.muted,fontSize:11}}>{item.category} · Pesan ulang: {item.reorder} {item.unit}</div>
                      </div>
                    </div>
                    <Badge color={barColor}>{item.stock} {item.unit}</Badge>
                  </div>
                  <div style={{background:T.faint,borderRadius:4,height:6,marginBottom:8}}>
                    <div style={{width:`${pct}%`,height:'100%',background:barColor,borderRadius:4,transition:'width .4s'}} />
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <Btn onClick={()=>{setRestockModal(item);setRestockQty('');}} size="m" color={T.teal}>+ Isi Ulang</Btn>
                    <Btn onClick={()=>{setEditModal(item);setEditStock(String(item.stock));setEditReorder(String(item.reorder));}} size="m" color={T.muted} outline>Ubah</Btn>
                  </div>
                </Card>
              );
            })}
          </>
        )}

        {/* ALERTS / PURCHASE REQUESTS */}
        {tab==='alerts'&&(
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:15}}>Permintaan Pembelian</div>
              <Btn onClick={()=>store.markAllAlertsRead()} size="m" color={T.muted} outline>Tandai semua dibaca</Btn>
            </div>
            {alerts.length===0&&<div style={{color:T.dim,fontSize:13}}>Belum ada peringatan.</div>}
            {alerts.map(a=>(
              <Card key={a.id} style={{marginBottom:8,padding:14,border:`1px solid ${a.status==='resolved'?T.dim:T.amber}44`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:6}}>
                  <div style={{fontWeight:600,color:T.text,fontSize:13}}>{a.itemName}</div>
                  <Badge color={a.status==='resolved'?T.green:T.amber}>{a.status==='resolved'?'selesai':'menunggu'}</Badge>
                </div>
                {a.note&&<div style={{color:T.muted,fontSize:12,marginBottom:6}}>"{a.note}"</div>}
                <div style={{color:T.dim,fontSize:11,marginBottom:8}}>{a.requestedBy||'Sistem'} · {a.at?new Date(a.at).toLocaleString('id-ID'):''}</div>
                {a.status==='pending'&&<Btn onClick={()=>store.resolveAlert(a.id)} size="m" color={T.green}>✓ Tandai Selesai</Btn>}
              </Card>
            ))}
          </>
        )}

        {/* REPORT */}
        {tab==='report'&&(
          <>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.text,fontSize:16,marginBottom:16}}>Laporan Harian</div>
            <Card style={{marginBottom:16}}>
              <div style={{color:T.muted,fontSize:12,marginBottom:12}}>Ringkasan — {new Date().toLocaleDateString('id-ID')}</div>
              {[['Total Transaksi',todayTickets.length],['Transaksi Anggota',todayTickets.filter(t=>t.isMember).length],['Transaksi Tamu',todayTickets.filter(t=>!t.isMember).length],['QRIS Terkumpul',fmtRp(totalRev)],['Plan (Gratis)',todayTickets.filter(t=>t.isMember&&t.total===0).length],['Pesanan Kopi',todayOrders.length],['Rata-rata Tiket',todayTickets.length>0?fmtRp(Math.round(totalRev/todayTickets.length)):'-']].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                  <span style={{color:T.muted,fontSize:13}}>{l}</span>
                  <span style={{color:T.text,fontWeight:600,fontFamily:'DM Mono,monospace',fontSize:13}}>{v}</span>
                </div>
              ))}
            </Card>

            <Card style={{marginBottom:16}}>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:T.text,fontSize:14,marginBottom:12}}>Terkini</div>
              {todayTickets.length===0&&<div style={{color:T.dim,fontSize:13}}>Belum ada transaksi hari ini.</div>}
              {todayTickets.slice(0,10).map(t=>(
                <div key={t.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${T.border}`}}>
                  <div>
                    <span style={{fontFamily:'DM Mono,monospace',color:T.text,fontSize:13}}>{t.plate}</span>
                    <span style={{color:T.muted,fontSize:11,marginLeft:6}}>#{t.queueNo}</span>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{color:T.teal,fontSize:13,fontFamily:'DM Mono,monospace'}}>{t.total>0?fmtRp(t.total):'Gratis'}</div>
                    <div style={{color:T.dim,fontSize:10}}>{fmtTime(t.timestamp)}</div>
                  </div>
                </div>
              ))}
            </Card>

            <div style={{display:'flex',gap:8}}>
              <Btn onClick={exportCSV} size="md" color={T.teal} outline>↓ Ekspor CSV</Btn>
              <Btn onClick={()=>{if(window.confirm('Reset SEMUA data? Ini akan menghapus tiket, pesanan, dan log.'))store.resetAll();}} size="md" color={T.red} outline>🗑 Reset Semua Data</Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LANDING PAGE — LUXURY REDESIGN
───────────────────────────────────────────────────────── */
function LandingPage({onMemberLogin,onStaffPortal}) {
  const [faqOpen,setFaqOpen]=useState(null);
  const [scrollY,setScrollY]=useState(0);

  useEffect(()=>{
    const fn=()=>setScrollY(window.scrollY);
    window.addEventListener('scroll',fn,{passive:true});
    return()=>window.removeEventListener('scroll',fn);
  },[]);

  const GOLD='#c9a870';
  const GOLD2='#e8d5a3';
  const CREAM='#f5f0e8';
  const WA_NUMBER='0818668277';
  const WA_LINK=`https://wa.me/62818668277?text=Halo%20SparkWash%2C%20saya%20ingin%20informasi%20keanggotaan`;

  const fmtRp=n=>'Rp '+n.toLocaleString('id-ID');

  const FAQS=[
    ['Bagaimana batas cuci harian bekerja?','Setiap keanggotaan memperbolehkan 1 kali cuci per hari. Anda bisa mendaftarkan hingga 3 mobil, namun hanya 1 mobil yang bisa dicuci per hari. Hitungan cuci direset setiap tengah malam.'],
    ['Bisakah saya mendaftarkan lebih dari satu mobil?','Ya! Semua plan mengizinkan hingga 3 mobil terdaftar. Cukup bawa plat mana saja ke kasir — kasir akan menemukan akun Anda seketika berdasarkan nomor plat.'],
    ['Apa yang terjadi jika saya ingin cuci lebih dari sekali sehari?','Cuci tambahan di luar batas harian dikenakan tarif tamu. Anggota tetap mendapat perlakuan antrian prioritas.'],
    ['Bagaimana cara login ke akun anggota saya?','Gunakan nomor telepon terdaftar dan PIN 4 digit Anda. PIN ditetapkan saat Anda mendaftar di kasir. Anda bisa melihat riwayat cuci, memesan kopi, dan memantau status antrian.'],
    ['Bisakah saya upgrade plan di tengah periode?','Ya. Kunjungi kasir dan staf kami akan menghitung sisa nilai plan Anda saat ini terhadap plan baru.'],
    ['Apakah poin kedaluwarsa?','Poin berlaku 12 bulan sejak tanggal perolehan. Cek saldo Anda di aplikasi anggota.'],
  ];

  const TESTIMONIALS=[
    {text:'Investasi terbaik untuk mobil saya. Saya cuci setiap pagi sebelum kerja. Kopinya juga enak — saya jadi suka hari cuci mobil.',name:'Rudi H.',plan:'Anggota 6 Bulan',avatar:'R'},
    {text:'Tiga mobil, cuci tak terbatas. Kami hemat banyak dibanding bayar per cuci. Staf selalu cepat dan ramah.',name:'Keluarga Tandjung',plan:'Anggota 1 Tahun',avatar:'T'},
    {text:'Aplikasi anggotanya sangat praktis. Saya bisa lihat riwayat cuci tiap mobil dan pesan kopi sambil menunggu. Suka sekali.',name:'Dewi P.',plan:'Anggota 3 Bulan',avatar:'D'},
  ];

  const navBg=scrollY>60;

  return (
    <div style={{minHeight:'100vh',background:'#050a0a',fontFamily:'DM Sans,sans-serif',color:CREAM,overflowX:'hidden'}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes shimmer{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .hero-word{animation:fadeUp .8s ease both}
        .hero-word:nth-child(1){animation-delay:.1s}
        .hero-word:nth-child(2){animation-delay:.25s}
        .hero-word:nth-child(3){animation-delay:.4s}
        .fade-in{animation:fadeIn 1.2s ease both}
        .gold-hover{transition:color .2s,border-color .2s}
        .gold-hover:hover{color:${GOLD}!important;border-color:${GOLD}!important}
        .card-lift{transition:transform .3s,box-shadow .3s}
        .card-lift:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(201,168,112,.12)!important}
        .wa-pulse{animation:float 3s ease-in-out infinite}
        .shimmer{animation:shimmer 2.5s ease-in-out infinite}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#050a0a}
        ::-webkit-scrollbar-thumb{background:${GOLD}44;border-radius:3px}
      `}</style>

      {/* ── NAVIGATION ── */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:200,padding:'20px 40px',display:'flex',justifyContent:'space-between',alignItems:'center',background:navBg?'rgba(5,10,10,.95)':'transparent',borderBottom:navBg?`1px solid ${GOLD}22`:'1px solid transparent',backdropFilter:navBg?'blur(20px)':'none',transition:'all .4s'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:32,height:32,borderRadius:'50%',border:`1.5px solid ${GOLD}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:GOLD}} />
          </div>
          <span style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:22,color:CREAM,letterSpacing:1}}>SparkWash</span>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <a href={WA_LINK} target="_blank" rel="noreferrer" style={{color:GOLD,fontSize:13,fontWeight:500,textDecoration:'none',letterSpacing:.5,display:'flex',alignItems:'center',gap:6}}>
            <span style={{fontSize:16}}>📞</span>{WA_NUMBER}
          </a>
          <button onClick={onMemberLogin} style={{padding:'9px 22px',background:'transparent',border:`1px solid ${GOLD}`,color:GOLD,fontFamily:'DM Sans,sans-serif',fontWeight:500,fontSize:13,borderRadius:2,cursor:'pointer',letterSpacing:.5,transition:'all .2s'}}
            onMouseEnter={e=>{e.target.style.background=GOLD;e.target.style.color='#050a0a';}}
            onMouseLeave={e=>{e.target.style.background='transparent';e.target.style.color=GOLD;}}>
            MASUK
          </button>
          <button onClick={onStaffPortal} style={{color:'#445555',fontSize:12,background:'none',border:'none',cursor:'pointer',letterSpacing:.5}}>STAF ↗</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{position:'relative',height:'100vh',minHeight:600,display:'flex',alignItems:'center',overflow:'hidden'}}>
        {/* Background image */}
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80)`,backgroundSize:'cover',backgroundPosition:'center',filter:'brightness(.35) saturate(.8)'}} />
        {/* Gradient overlay */}
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(5,10,10,.9) 0%,rgba(5,10,10,.4) 50%,rgba(5,10,10,.7) 100%)'}} />
        {/* Gold diagonal line */}
        <div style={{position:'absolute',top:0,left:'55%',width:1,height:'100%',background:`linear-gradient(to bottom,transparent,${GOLD}44,transparent)`,opacity:.6}} />

        <div style={{position:'relative',zIndex:1,padding:'0 40px',maxWidth:700}}>
          <div style={{color:GOLD,fontSize:11,letterSpacing:4,marginBottom:24,fontWeight:500}} className="hero-word">✦ PREMIUM CAR CARE MEMBERSHIP</div>
          <h1 style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:'clamp(48px,7vw,88px)',lineHeight:1.05,margin:'0 0 24px'}} className="hero-word">
            Mobil Anda<br/>
            <em style={{color:GOLD,fontStyle:'italic'}}>Layak yang</em><br/>
            Terbaik.
          </h1>
          <p style={{color:'#8aa0a0',fontSize:16,lineHeight:1.8,marginBottom:40,maxWidth:440}} className="hero-word">
            Keanggotaan eksklusif cuci mobil harian dengan akses SparkCafé premium. Daftar sekali, nikmati selamanya.
          </p>
          <div style={{display:'flex',gap:16,flexWrap:'wrap'}} className="fade-in">
            <a href={WA_LINK} target="_blank" rel="noreferrer" style={{padding:'16px 36px',background:GOLD,color:'#050a0a',fontWeight:600,fontSize:14,letterSpacing:1,textDecoration:'none',borderRadius:2,display:'flex',alignItems:'center',gap:10,transition:'all .2s'}}
              onMouseEnter={e=>e.currentTarget.style.background=GOLD2}
              onMouseLeave={e=>e.currentTarget.style.background=GOLD}>
              <span style={{fontSize:18}}>💬</span> DAFTAR VIA WHATSAPP
            </a>
            <button onClick={onMemberLogin} style={{padding:'16px 36px',background:'transparent',border:`1px solid ${GOLD}66`,color:CREAM,fontWeight:500,fontSize:14,letterSpacing:1,borderRadius:2,cursor:'pointer',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.color=GOLD;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=`${GOLD}66`;e.currentTarget.style.color=CREAM;}}>
              LOGIN ANGGOTA
            </button>
          </div>

          {/* Stats row */}
          <div style={{display:'flex',gap:40,marginTop:60,paddingTop:40,borderTop:`1px solid ${GOLD}22`}} className="fade-in">
            {[['500+','Anggota Aktif'],['4','Bay Cuci'],['1–3','Mobil per Member'],['08.00–20.00','Setiap Hari']].map(([v,l])=>(
              <div key={l}>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,color:GOLD,fontSize:28,lineHeight:1}}>{v}</div>
                <div style={{color:'#5a7070',fontSize:11,letterSpacing:1,marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{position:'absolute',bottom:32,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:8,opacity:.5}} className="shimmer">
          <div style={{color:GOLD,fontSize:10,letterSpacing:3}}>SCROLL</div>
          <div style={{width:1,height:40,background:GOLD}} />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{padding:'100px 40px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
          <div>
            <div style={{color:GOLD,fontSize:11,letterSpacing:4,marginBottom:16}}>PROSES KAMI</div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:'clamp(32px,4vw,52px)',lineHeight:1.15,margin:'0 0 24px'}}>Pengalaman yang<br/><em style={{color:GOLD,fontStyle:'italic'}}>Tanpa Repot</em></h2>
            <p style={{color:'#6a8888',fontSize:15,lineHeight:1.8,marginBottom:40}}>Dari pintu masuk hingga mobil mengkilap — semua tertangani dalam satu sistem terintegrasi.</p>
            <a href={WA_LINK} target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',gap:8,color:GOLD,textDecoration:'none',fontWeight:500,fontSize:14,letterSpacing:.5,borderBottom:`1px solid ${GOLD}44`,paddingBottom:4}}>
              Hubungi kami sekarang →
            </a>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {[['01','Masuk & Scan Plat','Kasir menemukan keanggotaan Anda dalam hitungan detik.'],['02','Ambil Tiket Antrian','Tidak perlu aplikasi di kasir. Proses di bawah 30 detik.'],['03','Santai di SparkCafé','Pesan kopi dari aplikasi saat mobil dicuci.'],['04','Terima Notifikasi','Mobil siap? Kami beritahu Anda langsung ke ponsel.']].map(([num,title,desc],i)=>(
              <div key={i} style={{display:'flex',gap:24,padding:'24px 0',borderBottom:`1px solid #ffffff08`}}>
                <div style={{fontFamily:'Cormorant Garamond,serif',color:GOLD,fontSize:32,fontWeight:600,lineHeight:1,minWidth:48,opacity:.5}}>{num}</div>
                <div>
                  <div style={{color:CREAM,fontWeight:600,fontSize:15,marginBottom:4}}>{title}</div>
                  <div style={{color:'#5a7070',fontSize:13,lineHeight:1.7}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{background:'#070d0d',padding:'100px 40px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <div style={{color:GOLD,fontSize:11,letterSpacing:4,marginBottom:12}}>LAYANAN CUCI</div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:'clamp(32px,4vw,52px)',margin:0}}>Pilih Perawatan<br/><em style={{color:GOLD,fontStyle:'italic'}}>Terbaik untuk Mobil Anda</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:1,background:`${GOLD}11`}}>
            {SERVICES.map((svc,i)=>(
              <div key={svc.id} className="card-lift" style={{background:'#070d0d',padding:'32px 24px',textAlign:'center',cursor:'default'}}>
                <div style={{fontSize:36,marginBottom:16}}>{svc.icon}</div>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,color:CREAM,fontSize:20,marginBottom:8}}>{svc.name}</div>
                <div style={{color:'#4a6666',fontSize:12,lineHeight:1.7,marginBottom:20}}>{svc.dec}</div>
                <div style={{borderTop:`1px solid ${GOLD}22`,paddingTop:20}}>
                  <div style={{fontFamily:'DM Mono,monospace',color:GOLD,fontSize:18,fontWeight:500}}>{fmtRp(svc.price)}</div>
                  <div style={{color:'#3a5555',fontSize:11,marginTop:4}}>{svc.duration} menit · Termasuk semua plan</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAFÉ SECTION ── */}
      <section style={{padding:'100px 40px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
          <div style={{position:'relative'}}>
            <div style={{borderRadius:2,overflow:'hidden',aspectRatio:'4/3'}}>
              <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80" alt="SparkCafé" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(.8) saturate(.9)'}} />
            </div>
            <div style={{position:'absolute',bottom:-20,right:-20,background:'#050a0a',border:`1px solid ${GOLD}33`,padding:'20px 24px',borderRadius:2}}>
              <div style={{fontFamily:'Cormorant Garamond,serif',color:GOLD,fontSize:32,fontWeight:600}}>10+</div>
              <div style={{color:'#4a6666',fontSize:11,letterSpacing:1}}>MENU PILIHAN</div>
            </div>
          </div>
          <div>
            <div style={{color:GOLD,fontSize:11,letterSpacing:4,marginBottom:16}}>SPARKCAFÉ</div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:'clamp(28px,3.5vw,48px)',lineHeight:1.15,margin:'0 0 20px'}}>Kopi Premium<br/><em style={{color:GOLD,fontStyle:'italic'}}>Saat Anda Menunggu</em></h2>
            <p style={{color:'#6a8888',fontSize:15,lineHeight:1.8,marginBottom:32}}>Pesan langsung dari aplikasi anggota saat check-in. Kopi siap bersamaan dengan mobil Anda — terkadang bahkan lebih cepat.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:32}}>
              {COFFEE_ITEMS.slice(0,4).map(item=>(
                <div key={item.id} style={{display:'flex',gap:10,alignItems:'center',padding:'12px',background:'#0a1515',border:`1px solid #1a2828`}}>
                  <span style={{fontSize:22}}>{item.icon}</span>
                  <div>
                    <div style={{color:CREAM,fontSize:13,fontWeight:500}}>{item.name}</div>
                    <div style={{color:GOLD,fontSize:12,fontFamily:'DM Mono,monospace'}}>{fmtRp(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={onMemberLogin} style={{padding:'14px 32px',background:'transparent',border:`1px solid ${GOLD}`,color:GOLD,fontWeight:500,fontSize:13,letterSpacing:1,borderRadius:2,cursor:'pointer',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background=GOLD;e.currentTarget.style.color='#050a0a';}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=GOLD;}}>
              PESAN SEKARANG
            </button>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{background:'#070d0d',padding:'100px 40px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <div style={{color:GOLD,fontSize:11,letterSpacing:4,marginBottom:12}}>PAKET KEANGGOTAAN</div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:'clamp(32px,4vw,52px)',margin:'0 0 16px'}}>Investasi Terbaik<br/><em style={{color:GOLD,fontStyle:'italic'}}>untuk Mobil Anda</em></h2>
            <p style={{color:'#4a6666',fontSize:14,maxWidth:480,margin:'0 auto'}}>Cuci harian tanpa batas per visit. Cukup masuk, tunjukkan plat, kami urus sisanya.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:1,background:`${GOLD}11`}}>
            {MEMBERSHIP_PLANS.map((plan,i)=>{
              const featured=!!plan.badge;
              return (
                <div key={plan.id} className="card-lift" style={{background:featured?`linear-gradient(135deg,#0d1a1a,#0a1515)`:'#070d0d',padding:'40px 28px',position:'relative',cursor:'default'}}>
                  {featured&&<div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${GOLD},transparent)`}} />}
                  {plan.badge&&<div style={{display:'inline-block',background:`${GOLD}22`,border:`1px solid ${GOLD}44`,color:GOLD,fontSize:10,letterSpacing:2,padding:'4px 12px',marginBottom:20,borderRadius:1}}>{plan.badge.toUpperCase()}</div>}
                  <div style={{fontFamily:'Cormorant Garamond,serif',color:CREAM,fontSize:22,fontWeight:600,marginBottom:8}}>{plan.name}</div>
                  <div style={{fontFamily:'DM Mono,monospace',color:GOLD,fontSize:32,fontWeight:500,marginBottom:4}}>{fmtRp(plan.price)}</div>
                  <div style={{color:'#3a5555',fontSize:12,marginBottom:28}}>per {plan.duration} bulan</div>
                  <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:32}}>
                    {plan.features.map(f=>(
                      <div key={f} style={{display:'flex',gap:8,alignItems:'center',fontSize:13,color:'#6a8888'}}>
                        <span style={{color:GOLD,fontSize:10}}>◆</span>{f}
                      </div>
                    ))}
                  </div>
                  <a href={WA_LINK} target="_blank" rel="noreferrer" style={{display:'block',textAlign:'center',padding:'13px',background:featured?GOLD:'transparent',border:`1px solid ${featured?GOLD:GOLD+'44'}`,color:featured?'#050a0a':GOLD,fontWeight:600,fontSize:13,letterSpacing:1,textDecoration:'none',borderRadius:1,transition:'all .2s'}}
                    onMouseEnter={e=>{if(!featured){e.currentTarget.style.background=GOLD;e.currentTarget.style.color='#050a0a';}}}
                    onMouseLeave={e=>{if(!featured){e.currentTarget.style.background='transparent';e.currentTarget.style.color=GOLD;}}}>
                    DAFTAR SEKARANG
                  </a>
                </div>
              );
            })}
          </div>
          <div style={{textAlign:'center',marginTop:32,color:'#3a5555',fontSize:13}}>
            Sudah anggota? <span onClick={onMemberLogin} style={{color:GOLD,cursor:'pointer',borderBottom:`1px solid ${GOLD}44`}}>Login di sini →</span>
          </div>
        </div>
      </section>

      {/* ── VISUAL DIVIDER ── */}
      <div style={{position:'relative',height:400,overflow:'hidden'}}>
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80" alt="car wash" style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(.25) saturate(.7)'}} />
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',textAlign:'center',padding:40}}>
          <div style={{color:GOLD,fontSize:11,letterSpacing:4,marginBottom:16}}>KUALITAS TANPA KOMPROMI</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:'clamp(28px,5vw,60px)',color:CREAM,lineHeight:1.15,margin:0}}>
            "Setiap Detail<br/><em style={{color:GOLD,fontStyle:'italic'}}>Menentukan Kesan"</em>
          </h2>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section style={{padding:'100px 40px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:60}}>
          <div style={{color:GOLD,fontSize:11,letterSpacing:4,marginBottom:12}}>KATA MEREKA</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:'clamp(28px,4vw,48px)',margin:0}}>Dipercaya 500+<br/><em style={{color:GOLD,fontStyle:'italic'}}>Anggota Setia</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:1,background:`${GOLD}11`}}>
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} style={{background:'#050a0a',padding:'40px 32px'}}>
              <div style={{color:GOLD,fontSize:20,marginBottom:20,letterSpacing:4}}>★★★★★</div>
              <p style={{fontFamily:'Cormorant Garamond,serif',color:'#8aafaf',fontSize:17,lineHeight:1.7,fontStyle:'italic',marginBottom:28}}>"{t.text}"</p>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:`${GOLD}22`,border:`1px solid ${GOLD}44`,display:'flex',alignItems:'center',justifyContent:'center',color:GOLD,fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:18}}>{t.avatar}</div>
                <div>
                  <div style={{color:CREAM,fontWeight:600,fontSize:14}}>{t.name}</div>
                  <div style={{color:GOLD,fontSize:11,letterSpacing:1}}>{t.plan.toUpperCase()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{background:'#070d0d',padding:'100px 40px'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:60}}>
            <div style={{color:GOLD,fontSize:11,letterSpacing:4,marginBottom:12}}>FAQ</div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:'clamp(28px,4vw,48px)',margin:0}}>Pertanyaan<br/><em style={{color:GOLD,fontStyle:'italic'}}>yang Sering Ditanyakan</em></h2>
          </div>
          {FAQS.map(([q,a],i)=>(
            <div key={i} style={{borderBottom:`1px solid #1a2828`}}>
              <div onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{padding:'22px 0',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}}>
                <div style={{color:CREAM,fontWeight:500,fontSize:15,paddingRight:20}}>{q}</div>
                <div style={{color:GOLD,fontSize:20,lineHeight:1,transform:faqOpen===i?'rotate(45deg)':'none',transition:'transform .2s',flexShrink:0}}>+</div>
              </div>
              {faqOpen===i&&<div style={{color:'#5a7070',fontSize:14,lineHeight:1.8,paddingBottom:22}}>{a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{position:'relative',padding:'120px 40px',textAlign:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80)`,backgroundSize:'cover',backgroundPosition:'center',filter:'brightness(.2) saturate(.6)'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,#050a0a,transparent,#050a0a)'}} />
        <div style={{position:'relative',zIndex:1}}>
          <div style={{color:GOLD,fontSize:11,letterSpacing:4,marginBottom:20}}>BERGABUNG SEKARANG</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,fontSize:'clamp(36px,6vw,72px)',lineHeight:1.1,margin:'0 0 24px'}}>
            Mobil Bersih<br/><em style={{color:GOLD,fontStyle:'italic'}}>Setiap Hari.</em>
          </h2>
          <p style={{color:'#6a8888',fontSize:16,lineHeight:1.8,marginBottom:48,maxWidth:440,margin:'0 auto 48px'}}>Bergabung dengan ratusan anggota yang mobilnya bersih setiap hari. Daftar di kasir atau hubungi kami via WhatsApp.</p>
          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="wa-pulse" style={{padding:'18px 44px',background:GOLD,color:'#050a0a',fontWeight:700,fontSize:14,letterSpacing:1.5,textDecoration:'none',borderRadius:2,display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:20}}>💬</span> {WA_NUMBER}
            </a>
            <button onClick={onMemberLogin} style={{padding:'18px 44px',background:'transparent',border:`1px solid ${GOLD}66`,color:CREAM,fontWeight:500,fontSize:14,letterSpacing:1,borderRadius:2,cursor:'pointer',transition:'all .2s'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLD;e.currentTarget.style.color=GOLD;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=`${GOLD}66`;e.currentTarget.style.color=CREAM;}}>
              LOGIN ANGGOTA
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{background:'#030808',borderTop:`1px solid ${GOLD}18`,padding:'48px 40px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:24}}>
          <div>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontWeight:600,color:CREAM,fontSize:24,letterSpacing:1,marginBottom:8}}>SparkWash</div>
            <div style={{color:'#2a4444',fontSize:13}}>Cuci Mobil Premium + SparkCafé</div>
            <div style={{color:'#2a4444',fontSize:13,marginTop:4}}>📍 Jl. Contoh No. 1, Jakarta &nbsp;·&nbsp; 08.00–20.00 setiap hari</div>
          </div>
          <div style={{textAlign:'right'}}>
            <a href={WA_LINK} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:8,color:GOLD,textDecoration:'none',fontWeight:600,fontSize:16,marginBottom:8}}>
              <span>💬</span> {WA_NUMBER}
            </a>
            <div style={{color:'#1a3333',fontSize:11,letterSpacing:1}}>© 2026 SPARKWASH. ALL RIGHTS RESERVED.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STAFF SELECTOR
───────────────────────────────────────────────────────── */
function StaffSelector({onSelect,onBack}) {
  const roles=[
    {id:'cashier',label:'Kasir',icon:'🧾',desc:'Meja depan & tiket',color:T.teal},
    {id:'bay',label:'Bay Cuci',icon:'🚿',desc:'Manajemen antrian & bay',color:T.amber},
    {id:'barista',label:'Barista',icon:'☕',desc:'Pesanan kopi & POS',color:T.amber},
    {id:'admin',label:'Admin',icon:'📊',desc:'ERP & laporan',color:T.red},
  ];
  return (
    <div style={{minHeight:'100vh',background:T.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Sans,sans-serif'}}>
      <FontLink />
      <div style={{width:360,padding:24}}>
        <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:T.text,fontSize:22,textAlign:'center',marginBottom:6}}>Portal Staf</div>
        <div style={{color:T.muted,fontSize:13,textAlign:'center',marginBottom:28}}>Pilih stasiun Anda</div>
        {roles.map(r=>(
          <div key={r.id} onClick={()=>onSelect(r.id)} style={{display:'flex',gap:14,alignItems:'center',padding:'16px 18px',borderRadius:12,marginBottom:10,cursor:'pointer',background:T.surface,border:`1px solid ${T.border}`,transition:'all .15s'}}
            onMouseEnter={e=>e.currentTarget.style.border=`1px solid ${r.color}44`} onMouseLeave={e=>e.currentTarget.style.border=`1px solid ${T.border}`}>
            <span style={{fontSize:28}}>{r.icon}</span>
            <div>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:r.color,fontSize:15}}>{r.label}</div>
              <div style={{color:T.muted,fontSize:12}}>{r.desc}</div>
            </div>
          </div>
        ))}
        <div style={{textAlign:'center',marginTop:12}}>
          <Btn onClick={onBack} size="m" color={T.muted} outline>← Kembali ke beranda</Btn>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────────────────── */
function saveSession(s) { try{localStorage.setItem(SESSION_KEY,JSON.stringify(s));}catch(e){} }
function loadSession() { try{const r=localStorage.getItem(SESSION_KEY);return r?JSON.parse(r):null;}catch(e){return null;} }
function clearSession() { try{localStorage.removeItem(SESSION_KEY);}catch(e){} }

export default function App() {
  const saved = loadSession();
  const [screen, setScreen] = useState(saved?.screen||'landing');
  const [staffPortal, setStaffPortal] = useState(saved?.staffPortal||null);
  const [staffSession, setStaffSession] = useState(saved?.staffSession||null);
  const [memberSession, setMemberSession] = useState(saved?.memberSession||null);

  useEffect(()=>{
    saveSession({screen,staffPortal,staffSession,memberSession});
  },[screen,staffPortal,staffSession,memberSession]);

  const goHome=()=>{ clearSession(); setScreen('landing'); setStaffPortal(null); setStaffSession(null); setMemberSession(null); };

  if(screen==='member-login') return <MemberLogin onLogin={m=>{setMemberSession(m);setScreen('member-dash');}} onBack={goHome} />;
  if(screen==='member-dash'&&memberSession) return <MemberDashboard member={memberSession} onLogout={goHome} />;
  if(screen==='staff-select') return <StaffSelector onSelect={r=>{setStaffPortal(r);setScreen('staff-pin');}} onBack={goHome} />;
  if(screen==='staff-pin'&&staffPortal) return <PinLogin role={staffPortal} onLogin={s=>{setStaffSession(s);setScreen('staff-portal');}} onBack={()=>setScreen('staff-select')} />;
  if(screen==='staff-portal'&&staffSession) {
    if(staffPortal==='cashier') return <CashierPortal session={staffSession} onLogout={goHome} />;
    if(staffPortal==='bay') return <BayPortal session={staffSession} onLogout={goHome} />;
    if(staffPortal==='barista') return <BaristaPortal session={staffSession} onLogout={goHome} />;
    if(staffPortal==='admin') return <AdminPortal session={staffSession} onLogout={goHome} />;
  }

  return <LandingPage onMemberLogin={()=>setScreen('member-login')} onStaffPortal={()=>setScreen('staff-select')} />;
}
