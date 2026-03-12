import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import './index.css';

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap');
  :root {
    --v:#06060C; --d:#0C0C15; --s:#13131E; --r:#1B1B28; --h:#232333; --e:#2C2C40;
    --gold:#C9A84C; --gold2:#E8C97A; --gf:rgba(201,168,76,0.12);
    --blue:#4A8BD4; --green:#50C87A; --red:#E05555; --amber:#E09A45; --purple:#8B5CF6;
    --bd:rgba(255,255,255,0.06); --bd2:rgba(255,255,255,0.11); --bd3:rgba(255,255,255,0.18);
    --t:#EDE8DF; --t2:#7878A0; --t3:#3A3A58; --t4:#22223A;
    --dp:'Cormorant Garamond',Georgia,serif;
    --ui:'DM Sans',system-ui,sans-serif;
    --mn:'JetBrains Mono',monospace;
  }
  body { background:var(--v); color:var(--t); font-family:var(--ui); font-size:13px; line-height:1.5; }
  *::-webkit-scrollbar { width:3px; height:3px; }
  *::-webkit-scrollbar-track { background:transparent; }
  *::-webkit-scrollbar-thumb { background:var(--e); border-radius:2px; }
  input::placeholder { color:var(--t3); }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes slideR   { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideU   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 0 rgba(201,168,76,0)} 50%{box-shadow:0 0 28px rgba(201,168,76,0.35)} }
  .hc { transition:border-color .2s,transform .2s,box-shadow .2s; }
  .hc:hover { border-color:rgba(201,168,76,0.35)!important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.5); }
  .bp { transition:all .12s; }
  .bp:hover { filter:brightness(1.15); }
  .bp:active { transform:scale(0.97); }
`;

/* ─── SCENE DATA ─────────────────────────────────────────────────────────── */
const INIT_SCENE = {
  walls: [
    { id:'w1', sx:-6, sz:-5, ex:6,  ez:-5, h:2.9, t:.20, label:'South Facade' },
    { id:'w2', sx:6,  sz:-5, ex:6,  ez:5,  h:2.9, t:.20, label:'East Facade' },
    { id:'w3', sx:6,  sz:5,  ex:-6, ez:5,  h:2.9, t:.20, label:'North Facade' },
    { id:'w4', sx:-6, sz:5,  ex:-6, ez:-5, h:2.9, t:.20, label:'West Facade' },
    { id:'w5', sx:0,  sz:-5, ex:0,  ez:1.5,h:2.9, t:.15, label:'Central Partition' },
    { id:'w6', sx:-6, sz:1.5,ex:0,  ez:1.5,h:2.9, t:.15, label:'Bedroom Wall' },
  ],
  furniture: [
    { id:'f1', x:-3.5, z:-1.8, w:2.4, d:.9,  h:.80, color:'#3C3028', label:'Sectional Sofa' },
    { id:'f2', x:-3.5, z:.10,  w:1.1, d:.55, h:.38, color:'#5A4830', label:'Coffee Table' },
    { id:'f3', x:-3.0, z:3.50, w:1.8, d:2.1, h:.50, color:'#2E384A', label:'King Bed' },
    { id:'f4', x:3.5,  z:-2.0, w:1.4, d:.7,  h:.74, color:'#3C3824', label:'Work Desk' },
    { id:'f5', x:3.5,  z:3.0,  w:.9,  d:.6,  h:.80, color:'#3A2E24', label:'Armchair' },
  ],
};

const PROJECTS = [
  { id:'p1', name:'Villa Moderna',          client:'G. Marchetti', type:'Residential',  area:'340 m²',    status:'active',   collabs:3, updated:'2h ago',   rooms:6,  floors:2 },
  { id:'p2', name:'Skyline Office Tower',   client:'Apex Corp.',   type:'Commercial',   area:'12,400 m²', status:'review',   collabs:7, updated:'Yesterday', rooms:42, floors:18 },
  { id:'p3', name:'Arts & Culture Pavilion',client:'City Council', type:'Public',       area:'2,800 m²',  status:'draft',    collabs:2, updated:'3d ago',    rooms:12, floors:2 },
  { id:'p4', name:'Lakeside Retreat',       client:'T. Holmqvist', type:'Residential',  area:'280 m²',    status:'complete', collabs:1, updated:'1w ago',    rooms:5,  floors:1 },
  { id:'p5', name:'Harbor Mixed-Use',       client:'Marina Dev.',  type:'Mixed-Use',    area:'8,200 m²',  status:'active',   collabs:5, updated:'5h ago',    rooms:28, floors:6 },
  { id:'p6', name:'Mountain Lodge',         client:'Alpine Res.',  type:'Hospitality',  area:'1,600 m²',  status:'draft',    collabs:3, updated:'2d ago',    rooms:20, floors:3 },
];

const SUGGESTIONS = [
  { id:'s1', icon:'⟷', title:'Traffic Flow',     desc:'Bedroom corridor is 0.8m — below ADA 0.9m minimum. Widen by 10cm.', sev:'warn', tag:'ADA' },
  { id:'s2', icon:'◐', title:'Natural Light',    desc:'South living wall can accommodate 40% more glazing without structural changes.', sev:'tip', tag:'Energy' },
  { id:'s3', icon:'▣', title:'Space Efficiency', desc:'Kitchen layout scores 68/100. Rotating work island 90° improves the work triangle.', sev:'info', tag:'Layout' },
  { id:'s4', icon:'✓', title:'Building Code',    desc:'Min. bedroom area is 9m². Current master bedroom: 12.4m². Compliant.', sev:'ok', tag:'Code' },
];

const VERSIONS = [
  { id:'v3', label:'Added corner windows + skylight',      time:'14:32',    author:'You',     current:true },
  { id:'v2', label:'Moved central partition east 0.5m',    time:'11:15',    author:'Sarah K.', current:false },
  { id:'v1', label:'Initial AI 3D generation from PDF',    time:'Yesterday',author:'AI',      current:false },
];

const COLLABS = [
  { name:'You',      role:'Owner',  initials:'YO', color:'#C9A84C', online:true },
  { name:'Sarah K.', role:'Editor', initials:'SK', color:'#4A8BD4', online:true },
  { name:'M. Rossi', role:'Viewer', initials:'MR', color:'#50C87A', online:false },
];

const STATUS_COLOR = { active:'#50C87A', review:'#E09A45', draft:'#7878A0', complete:'#4A8BD4' };
const SEV_COLOR    = { warn:'#E09A45',   tip:'#4A8BD4',    info:'#7878A0',  ok:'#50C87A' };

/* ─── THREE.JS HOOK ──────────────────────────────────────────────────────── */
function useScene(canvasRef, sceneData, selectedId, onSelect) {
  const R      = useRef({ renderer:null, camera:null, scene:null, raf:null });
  const orbit  = useRef({ theta:.7, phi:.7, r:22, tx:0, tz:0 });
  const drag   = useRef({ on:false, x:0, y:0, sx:0, sy:0 });

  const rebuild = useCallback(() => {
    const { scene } = R.current;
    if (!scene) return;
    while (scene.children.length) scene.remove(scene.children[0]);

    scene.add(new THREE.HemisphereLight(0xFFF0E0, 0x404060, .7));
    const sun = new THREE.DirectionalLight(0xFFFAF0, 1.5);
    sun.position.set(10, 22, 8); sun.castShadow = true;
    sun.shadow.mapSize.width = sun.shadow.mapSize.height = 2048;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xD0DFFF, .4);
    fill.position.set(-10, 6, -14); scene.add(fill);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshStandardMaterial({ color:0xF0EBE2, roughness:.98 })
    );
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

    const grid = new THREE.GridHelper(60, 60, 0xB8B0A8, 0xB8B0A8);
    grid.material.opacity = .12; grid.material.transparent = true; scene.add(grid);

    sceneData.walls.forEach(w => {
      const dx = w.ex - w.sx, dz = w.ez - w.sz;
      const len = Math.hypot(dx, dz), ang = Math.atan2(dz, dx);
      const sel = selectedId === w.id;
      const geo = new THREE.BoxGeometry(len, w.h, w.t);
      const mat = new THREE.MeshStandardMaterial({
        color: sel ? 0x5A9BE8 : 0xECE8E0, roughness:.7, metalness:.02,
        emissive: sel ? 0x1A3C6A : 0x000000, emissiveIntensity: sel ? .35 : 0,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set((w.sx+w.ex)/2, w.h/2, (w.sz+w.ez)/2);
      m.rotation.y = -ang; m.castShadow = m.receiveShadow = true;
      m.userData = { id:w.id, label:w.label, type:'wall' };
      scene.add(m);
      // cap strip
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(len, .04, w.t + .02),
        new THREE.MeshStandardMaterial({ color: sel ? 0x6AABF8 : 0xD4CCC0, roughness:.5 })
      );
      cap.position.set((w.sx+w.ex)/2, w.h+.02, (w.sz+w.ez)/2);
      cap.rotation.y = -ang; scene.add(cap);
    });

    sceneData.furniture.forEach(f => {
      const sel = selectedId === f.id;
      const geo = new THREE.BoxGeometry(f.w, f.h, f.d);
      const mat = new THREE.MeshStandardMaterial({
        color: sel ? 0x5A9BE8 : parseInt(f.color.slice(1), 16),
        roughness:.75, metalness:.08,
        emissive: sel ? 0x1A3C6A : 0x000000, emissiveIntensity: sel ? .3 : 0,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(f.x, f.h/2, f.z); m.castShadow = m.receiveShadow = true;
      m.userData = { id:f.id, label:f.label, type:'furniture' };
      m.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color:0x000000, transparent:true, opacity:.1 })
      ));
      scene.add(m);
    });
  }, [sceneData, selectedId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cont = canvas.parentElement;
    const W = cont.offsetWidth, H = cont.offsetHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x0C0C15); R.current.renderer = renderer;

    const cam = new THREE.PerspectiveCamera(48, W/H, .1, 500);
    R.current.camera = cam;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0C0C15, .014);
    R.current.scene = scene;
    rebuild();

    const moveCam = () => {
      const { theta, phi, r, tx, tz } = orbit.current;
      cam.position.set(
        tx + r * Math.sin(phi) * Math.sin(theta),
        r  * Math.cos(phi),
        tz + r * Math.sin(phi) * Math.cos(theta)
      );
      cam.lookAt(tx, 0, tz);
    };
    moveCam();

    const ray = new THREE.Raycaster();
    const onDown = e => { drag.current = { on:true, x:e.clientX, y:e.clientY, sx:e.clientX, sy:e.clientY }; };
    const onMove = e => {
      if (!drag.current.on) return;
      const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
      drag.current.x = e.clientX; drag.current.y = e.clientY;
      orbit.current.theta -= dx * .007;
      orbit.current.phi = Math.max(.08, Math.min(1.48, orbit.current.phi + dy * .005));
      moveCam();
    };
    const onUp    = () => { drag.current.on = false; };
    const onWheel = e => {
      e.preventDefault();
      orbit.current.r = Math.max(4, Math.min(55, orbit.current.r + e.deltaY * .04));
      moveCam();
    };
    const onClick = e => {
      if (Math.abs(e.clientX-drag.current.sx)+Math.abs(e.clientY-drag.current.sy) > 6) return;
      const rect = canvas.getBoundingClientRect();
      const mv = new THREE.Vector2(
        ((e.clientX-rect.left)/rect.width)*2-1,
        -((e.clientY-rect.top)/rect.height)*2+1
      );
      ray.setFromCamera(mv, cam);
      const hits = ray.intersectObjects(scene.children, true).filter(h => h.object.userData.id);
      onSelect(hits.length ? hits[0].object.userData.id : null);
    };
    const onResize = () => {
      const W = cont.offsetWidth, H = cont.offsetHeight;
      renderer.setSize(W, H); cam.aspect = W/H; cam.updateProjectionMatrix();
    };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('wheel', onWheel, { passive:false });
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('resize', onResize);

    const loop = () => { R.current.raf = requestAnimationFrame(loop); renderer.render(scene, cam); };
    loop();

    return () => {
      cancelAnimationFrame(R.current.raf);
      renderer.dispose();
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => { rebuild(); }, [rebuild]);
}

/* ─── MICRO COMPONENTS ───────────────────────────────────────────────────── */
const Btn = ({ children, onClick, gold, danger, sm, style, ...p }) => (
  <button onClick={onClick} className="bp" style={{
    display:'inline-flex', alignItems:'center', gap:5,
    padding: sm ? '4px 10px' : '6px 14px', borderRadius:5, cursor:'pointer',
    fontFamily:'var(--ui)', fontSize: sm ? 11 : 12, fontWeight:500, whiteSpace:'nowrap',
    background: gold ? 'var(--gold)' : 'var(--r)',
    border: gold ? 'none' : danger ? '1px solid rgba(224,85,85,.4)' : '1px solid var(--bd)',
    color: gold ? '#07070C' : danger ? 'var(--red)' : 'var(--t2)',
    transition:'all .15s', ...style
  }} {...p}>{children}</button>
);

const Tag = ({ c, children }) => (
  <span style={{ fontSize:10, padding:'2px 7px', borderRadius:3, fontFamily:'var(--mn)',
    letterSpacing:'.04em', background:`${c}1A`, color:c, border:`1px solid ${c}33` }}>
    {children}
  </span>
);

const Ico = ({ d, size=14, color='currentColor', sw=1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

const Spinner = () => (
  <div style={{ width:14, height:14, border:'2px solid var(--bd2)',
    borderTopColor:'var(--gold)', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
);

const Divider = () => <div style={{ height:1, background:'var(--bd)', margin:'8px 0' }}/>;

/* ─── 2D PLAN SVG ────────────────────────────────────────────────────────── */
const PlanSVG = ({ style }) => (
  <svg viewBox="-8 -7 16 14" style={{ width:'100%', height:'100%', ...style }}>
    {INIT_SCENE.walls.map(w => (
      <line key={w.id} x1={w.sx} y1={w.sz} x2={w.ex} y2={w.ez}
        stroke="rgba(201,168,76,.7)" strokeWidth=".35"/>
    ))}
    {INIT_SCENE.furniture.map(f => (
      <rect key={f.id} x={f.x-f.w/2} y={f.z-f.d/2} width={f.w} height={f.d}
        fill="rgba(201,168,76,.12)" stroke="rgba(201,168,76,.45)" strokeWidth=".12"/>
    ))}
  </svg>
);

/* ─── LANDING ────────────────────────────────────────────────────────────── */
function Landing({ onEnter }) {
  return (
    <div style={{ width:'100vw', height:'100vh', background:'var(--v)', display:'flex',
      flexDirection:'column', alignItems:'center', justifyContent:'center',
      overflow:'hidden', position:'relative' }}>

      {/* Grid bg */}
      <div style={{ position:'absolute', inset:0,
        backgroundImage:'linear-gradient(rgba(201,168,76,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.04) 1px,transparent 1px)',
        backgroundSize:'56px 56px' }}/>

      {/* Radial glow */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width:700, height:700, borderRadius:'50%',
        background:'radial-gradient(circle,rgba(201,168,76,.07) 0%,transparent 68%)',
        pointerEvents:'none' }}/>

      {/* Nav */}
      <header style={{ position:'absolute', top:0, left:0, right:0,
        padding:'20px 48px', display:'flex', justifyContent:'space-between', alignItems:'center',
        borderBottom:'1px solid var(--bd)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, background:'var(--gold)', borderRadius:4,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#07070C" strokeWidth="2.5">
              <polygon points="3,3 21,3 21,21 3,21"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="12" y1="3" x2="12" y2="21"/>
            </svg>
          </div>
          <span style={{ fontFamily:'var(--dp)', fontSize:20, fontWeight:500,
            color:'var(--gold)', letterSpacing:'.05em' }}>ArchitectAI</span>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <span style={{ color:'var(--t3)', fontSize:11, fontFamily:'var(--mn)',
            letterSpacing:'.08em' }}>BETA v0.9</span>
          <Btn onClick={onEnter} style={{ color:'var(--t2)' }}>Log in</Btn>
          <Btn gold onClick={onEnter} style={{ padding:'8px 22px', fontSize:13 }}>Start free →</Btn>
        </div>
      </header>

      {/* Hero */}
      <div style={{ textAlign:'center', zIndex:1, padding:'0 40px', maxWidth:760 }}>
        <div style={{ fontSize:10, letterSpacing:'.22em', color:'var(--gold)',
          fontFamily:'var(--mn)', marginBottom:22, animation:'fadeUp .5s ease both' }}>
          AI-POWERED ARCHITECTURAL DESIGN PLATFORM
        </div>
        <h1 style={{ fontFamily:'var(--dp)', fontSize:'clamp(52px,7.5vw,92px)', fontWeight:300,
          lineHeight:1.03, letterSpacing:'-.02em', color:'var(--t)',
          marginBottom:20, animation:'fadeUp .6s .1s ease both' }}>
          From 2D Plans<br/>
          <em style={{ fontStyle:'italic', color:'var(--gold)' }}>to Living 3D</em>
        </h1>
        <p style={{ color:'var(--t2)', fontSize:16, lineHeight:1.75, maxWidth:480,
          margin:'0 auto 40px', animation:'fadeUp .6s .2s ease both' }}>
          Upload a floor plan. Watch AI build an editable 3D model in under 60 seconds.
          Edit with natural language. Collaborate in real time. Present to clients.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center',
          animation:'fadeUp .6s .3s ease both' }}>
          <button onClick={onEnter} className="bp" style={{
            padding:'13px 36px', borderRadius:6, background:'var(--gold)', color:'#07070C',
            fontSize:14, fontWeight:600, fontFamily:'var(--ui)', border:'none', cursor:'pointer',
            animation:'glow 3s ease-in-out infinite' }}>
            Launch the App
          </button>
          <button onClick={onEnter} className="bp" style={{
            padding:'13px 36px', borderRadius:6, background:'transparent', color:'var(--t)',
            fontSize:14, fontFamily:'var(--ui)', border:'1px solid var(--bd2)', cursor:'pointer' }}>
            Watch Demo
          </button>
        </div>
      </div>

      {/* Decorative plans */}
      <div style={{ position:'absolute', right:60, top:'50%', transform:'translateY(-50%)',
        width:240, height:200, opacity:.4, animation:'fadeIn 1s .6s ease both' }}>
        <PlanSVG/>
      </div>
      <div style={{ position:'absolute', left:60, top:'50%',
        transform:'translateY(-50%) scaleX(-1)', width:180, height:150,
        opacity:.22, animation:'fadeIn 1s .8s ease both' }}>
        <PlanSVG/>
      </div>

      {/* Feature pills */}
      <div style={{ position:'absolute', bottom:32, display:'flex', gap:12,
        flexWrap:'wrap', justifyContent:'center', padding:'0 40px',
        animation:'fadeUp .6s .5s ease both' }}>
        {['2D→3D in 30 sec','NLP Editing','Multi-User Collab','BIM / IFC Export',
          'Offline PWA','Building Code AI'].map(f => (
          <span key={f} style={{ fontSize:11, padding:'5px 14px', borderRadius:20,
            border:'1px solid var(--bd2)', color:'var(--t3)',
            fontFamily:'var(--mn)', letterSpacing:'.04em' }}>{f}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────────────────────── */
function Dashboard({ onOpen, onNew }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const list = PROJECTS.filter(p => {
    const q = search.toLowerCase();
    const mQ = !q || p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
    const mF = filter === 'all' || p.status === filter;
    return mQ && mF;
  });

  return (
    <div style={{ width:'100vw', height:'100vh', background:'var(--v)',
      display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Header */}
      <header style={{ padding:'0 32px', height:52, display:'flex', alignItems:'center',
        gap:16, borderBottom:'1px solid var(--bd)', background:'var(--d)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginRight:8 }}>
          <div style={{ width:24, height:24, background:'var(--gold)', borderRadius:3,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#07070C" strokeWidth="2.5">
              <polygon points="3,3 21,3 21,21 3,21"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="12" y1="3" x2="12" y2="21"/>
            </svg>
          </div>
          <span style={{ fontFamily:'var(--dp)', fontSize:17, fontWeight:500,
            color:'var(--gold)', letterSpacing:'.04em' }}>ArchitectAI</span>
        </div>
        <span style={{ color:'rgba(255,255,255,.18)', fontSize:14 }}>/</span>
        <span style={{ color:'var(--t2)', fontSize:13 }}>Projects</span>
        <div style={{ flex:1 }}/>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--s)',
          border:'1px solid var(--bd)', borderRadius:6, padding:'6px 12px' }}>
          <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={12} color="var(--t3)"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…"
            style={{ background:'none', border:'none', outline:'none', color:'var(--t)',
              fontSize:12, fontFamily:'var(--ui)', width:160 }}/>
        </div>
        <Btn gold onClick={onNew} style={{ gap:6, padding:'7px 16px', fontSize:12 }}>
          <span style={{ fontSize:16, lineHeight:1, marginTop:-1 }}>+</span> New Project
        </Btn>
        <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--h)',
          border:'1px solid var(--bd2)', display:'flex', alignItems:'center',
          justifyContent:'center', cursor:'pointer', fontSize:10,
          color:'var(--t2)', fontWeight:600 }}>YO</div>
      </header>

      {/* Stats + filters */}
      <div style={{ padding:'10px 32px', borderBottom:'1px solid var(--bd)',
        background:'var(--d)', display:'flex', gap:36, flexShrink:0, alignItems:'center' }}>
        {[['6','Projects'],['3','Active'],['12','Collaborators'],['2.4 GB','Storage']].map(([v,l]) => (
          <div key={l} style={{ display:'flex', alignItems:'baseline', gap:8 }}>
            <span style={{ fontFamily:'var(--mn)', fontSize:18, color:'var(--t)', fontWeight:500 }}>{v}</span>
            <span style={{ color:'var(--t3)', fontSize:11 }}>{l}</span>
          </div>
        ))}
        <div style={{ flex:1 }}/>
        {['all','active','review','draft','complete'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background:'none', border:'none', cursor:'pointer', fontSize:11,
            fontFamily:'var(--mn)', letterSpacing:'.06em', textTransform:'uppercase',
            color: filter===f ? 'var(--gold)' : 'var(--t3)',
            borderBottom: filter===f ? '1px solid var(--gold)' : '1px solid transparent',
            paddingBottom:2, transition:'color .15s' }}>{f}</button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ flex:1, overflowY:'auto', padding:28,
        display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',
        gap:18, alignContent:'start' }}>
        {list.map((p, i) => (
          <div key={p.id} className="hc" onClick={() => onOpen(p)}
            style={{ background:'var(--s)', border:'1px solid var(--bd)', borderRadius:10,
              cursor:'pointer', overflow:'hidden', animation:`fadeUp .4s ${i*.05}s ease both` }}>
            <div style={{ height:130, background:'linear-gradient(135deg,#0A0F1E,#141828)',
              position:'relative', display:'flex', alignItems:'center',
              justifyContent:'center', overflow:'hidden' }}>
              <div style={{ width:160, height:110, opacity:.55 }}><PlanSVG/></div>
              <div style={{ position:'absolute', top:10, right:10, display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:6, height:6, borderRadius:'50%',
                  background:STATUS_COLOR[p.status],
                  boxShadow:`0 0 6px ${STATUS_COLOR[p.status]}` }}/>
                <span style={{ fontSize:9, fontFamily:'var(--mn)', letterSpacing:'.08em',
                  textTransform:'uppercase', color:STATUS_COLOR[p.status] }}>{p.status}</span>
              </div>
              <div style={{ position:'absolute', bottom:10, left:10, fontSize:9,
                fontFamily:'var(--mn)', color:'var(--t3)', letterSpacing:'.06em' }}>
                {p.floors}F · {p.rooms} rooms
              </div>
            </div>
            <div style={{ padding:'14px 16px' }}>
              <h3 style={{ fontFamily:'var(--dp)', fontSize:16, fontWeight:500,
                color:'var(--t)', marginBottom:3 }}>{p.name}</h3>
              <p style={{ color:'var(--t3)', fontSize:11, marginBottom:10 }}>{p.client}</p>
              <div style={{ display:'flex', gap:6, marginBottom:12, flexWrap:'wrap' }}>
                <Tag c="var(--t2)">{p.type}</Tag>
                <Tag c="var(--blue)">{p.area}</Tag>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                paddingTop:10, borderTop:'1px solid var(--bd)' }}>
                <div style={{ display:'flex' }}>
                  {Array.from({ length:Math.min(p.collabs,4) }).map((_,j) => (
                    <div key={j} style={{ width:20, height:20, borderRadius:'50%',
                      background:`hsl(${j*70+190},45%,38%)`, border:'2px solid var(--s)',
                      marginLeft:j>0?-6:0, display:'flex', alignItems:'center',
                      justifyContent:'center', fontSize:7, color:'#fff', fontWeight:700 }}>
                      {String.fromCharCode(65+j)}
                    </div>
                  ))}
                  {p.collabs>4 && (
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--h)',
                      border:'2px solid var(--s)', marginLeft:-6, display:'flex',
                      alignItems:'center', justifyContent:'center', fontSize:7, color:'var(--t3)' }}>
                      +{p.collabs-4}
                    </div>
                  )}
                </div>
                <span style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--mn)' }}>{p.updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── EDITOR ─────────────────────────────────────────────────────────────── */
function Editor({ project, onBack, onPresent }) {
  const canvasRef = useRef(null);
  const [scene,       setScene]       = useState(INIT_SCENE);
  const [selectedId,  setSelectedId]  = useState(null);
  const [nlp,         setNlp]         = useState('');
  const [nlpBusy,     setNlpBusy]     = useState(false);
  const [log,         setLog]         = useState([{ type:'system', text:'Scene generated from floor plan. 6 walls, 5 furniture items detected.' }]);
  const [rPanel,      setRPanel]      = useState('ai');
  const [uploading,   setUploading]   = useState(false);
  const [uploadPct,   setUploadPct]   = useState(0);
  const [viewMode,    setViewMode]    = useState('3d');

  useScene(canvasRef, scene, selectedId, setSelectedId);

  const allObjs = [...scene.walls, ...scene.furniture];
  const sel     = selectedId ? allObjs.find(o => o.id === selectedId) : null;

  const addLog = (type, text) =>
    setLog(l => [{ type, text, ts: new Date().toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'}) },
                 ...l.slice(0,19)]);

  /* NLP via secure Vercel API route (/api/nlp) */
  const handleNLP = async () => {
    if (!nlp.trim() || nlpBusy) return;
    const instr = nlp; setNlp(''); setNlpBusy(true);
    addLog('user', instr);
    try {
      const res = await fetch('/api/nlp', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          instruction: instr,
          walls:     scene.walls.map(w => ({ id:w.id, label:w.label })),
          furniture: scene.furniture.map(f => ({ id:f.id, label:f.label, x:f.x, z:f.z })),
        }),
      });
      const result = await res.json();

      if (result.action === 'move' && result.objectId && result.delta) {
        const [dx,,dz] = result.delta;
        setScene(s => ({
          ...s,
          walls:     s.walls.map(w     => w.id===result.objectId ? {...w, sx:w.sx+dx, sz:w.sz+dz, ex:w.ex+dx, ez:w.ez+dz} : w),
          furniture: s.furniture.map(f => f.id===result.objectId ? {...f, x:f.x+dx, z:f.z+dz} : f),
        }));
      } else if (result.action === 'remove' && result.objectId) {
        setScene(s => ({
          ...s,
          walls:     s.walls.filter(w     => w.id !== result.objectId),
          furniture: s.furniture.filter(f => f.id !== result.objectId),
        }));
        if (selectedId === result.objectId) setSelectedId(null);
      } else if (result.action === 'add' && result.newItem) {
        setScene(s => ({ ...s, furniture:[...s.furniture, { id:`f${Date.now()}`, ...result.newItem }] }));
      } else if (result.action === 'resize' && result.objectId && result.newSize) {
        const [w,h,d] = result.newSize;
        setScene(s => ({ ...s, furniture:s.furniture.map(f => f.id===result.objectId ? {...f,w,h,d} : f) }));
      } else if (result.action === 'recolor' && result.objectId && result.newColor) {
        setScene(s => ({ ...s, furniture:s.furniture.map(f => f.id===result.objectId ? {...f, color:result.newColor} : f) }));
      }
      addLog('ai', result.description || 'Done.');
    } catch {
      addLog('err', 'AI error. Check your ANTHROPIC_API_KEY in Vercel env vars.');
    }
    setNlpBusy(false);
  };

  const simulateUpload = () => {
    setUploading(true); setUploadPct(0);
    const t = setInterval(() => {
      setUploadPct(p => {
        if (p >= 100) { clearInterval(t); setTimeout(() => setUploading(false), 600); return 100; }
        return p + Math.random() * 12;
      });
    }, 120);
  };

  return (
    <div style={{ width:'100vw', height:'100vh', background:'var(--v)',
      display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* TOP BAR */}
      <header style={{ height:50, borderBottom:'1px solid var(--bd)', background:'var(--d)',
        display:'flex', alignItems:'center', flexShrink:0, zIndex:10 }}>

        <div style={{ width:220, height:'100%', display:'flex', alignItems:'center',
          gap:8, padding:'0 16px', borderRight:'1px solid var(--bd)', flexShrink:0 }}>
          <button onClick={onBack} className="bp" style={{ background:'none', border:'none',
            cursor:'pointer', display:'flex', padding:4, borderRadius:4 }}>
            <Ico d="M19 12H5M12 5l-7 7 7 7" size={14} color="var(--t3)"/>
          </button>
          <div style={{ width:1, height:20, background:'var(--bd)' }}/>
          <span style={{ fontFamily:'var(--dp)', fontSize:16, fontWeight:500,
            color:'var(--gold)', letterSpacing:'.04em' }}>ArchitectAI</span>
        </div>

        <div style={{ padding:'0 18px', borderRight:'1px solid var(--bd)', height:'100%',
          display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:'var(--dp)', fontSize:15, color:'var(--t)' }}>
            {project?.name || 'Villa Moderna'}
          </span>
          <Tag c="var(--green)">Auto-saved</Tag>
        </div>

        <div style={{ display:'flex', padding:'0 10px', gap:2, height:'100%', alignItems:'center' }}>
          {[
            { d:'M3 12h18M3 6h18M3 18h18', tip:'Select' },
            { d:'M5 12h14M12 5l7 7-7 7',   tip:'Move' },
            { d:'M21 21l-6-6m6 6v-4.5m0 4.5h-4.5M3 3l6 6M3 3v4.5M3 3h4.5', tip:'Scale' },
          ].map((t,i) => (
            <button key={i} title={t.tip} className="bp" style={{
              width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center',
              background: i===0 ? 'var(--gf)' : 'none',
              border: i===0 ? '1px solid var(--bd2)' : '1px solid transparent',
              borderRadius:5, cursor:'pointer' }}>
              <Ico d={t.d} size={13} color={i===0 ? 'var(--gold)' : 'var(--t3)'}/>
            </button>
          ))}
        </div>

        <div style={{ flex:1 }}/>

        {/* View toggle */}
        <div style={{ display:'flex', gap:1, padding:'0 12px', borderLeft:'1px solid var(--bd)',
          height:'100%', alignItems:'center' }}>
          {['3D','2D','Section'].map(m => (
            <button key={m} onClick={() => setViewMode(m.toLowerCase())} style={{
              fontSize:11, padding:'3px 10px', borderRadius:4,
              fontFamily:'var(--mn)', letterSpacing:'.06em',
              background: viewMode===m.toLowerCase() ? 'var(--gf)' : 'none',
              border: viewMode===m.toLowerCase() ? '1px solid var(--bd2)' : '1px solid transparent',
              color: viewMode===m.toLowerCase() ? 'var(--gold)' : 'var(--t3)',
              cursor:'pointer' }}>{m}</button>
          ))}
        </div>

        {/* Collab avatars */}
        <div style={{ display:'flex', alignItems:'center', padding:'0 14px',
          borderLeft:'1px solid var(--bd)', height:'100%', gap:0 }}>
          {COLLABS.map((c,i) => (
            <div key={i} title={`${c.name} — ${c.role}`} style={{
              width:26, height:26, borderRadius:'50%', background:c.color,
              border:`2px solid ${c.online?c.color:'var(--t4)'}`,
              marginLeft:i>0?-6:0, display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:8, fontWeight:700, color:'#07070C', cursor:'pointer',
              opacity:c.online?1:.5,
              filter:c.online?`drop-shadow(0 0 4px ${c.color}55)`:'none',
              zIndex:COLLABS.length-i }}>
              {c.initials}
            </div>
          ))}
          <span style={{ fontSize:10, color:'var(--t3)', marginLeft:8, fontFamily:'var(--mn)' }}>2 online</span>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:6, padding:'0 14px',
          borderLeft:'1px solid var(--bd)', height:'100%', alignItems:'center' }}>
          <Btn style={{ gap:5, fontSize:11 }}>
            <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={12}/>
            Export
          </Btn>
          <Btn gold onClick={onPresent} style={{ gap:5, fontSize:11, padding:'5px 14px' }}>
            <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={12} color="#07070C"/>
            Present
          </Btn>
        </div>
      </header>

      {/* MAIN */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

        {/* LEFT SIDEBAR */}
        <aside style={{ width:220, background:'var(--d)', borderRight:'1px solid var(--bd)',
          display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 }}>

          {/* Upload btn */}
          <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--bd)' }}>
            {uploading ? (
              <div style={{ background:'var(--s)', border:'1px solid var(--bd)',
                borderRadius:6, padding:'10px 12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:11, color:'var(--t2)' }}>Processing plan…</span>
                  <span style={{ fontSize:10, fontFamily:'var(--mn)', color:'var(--gold)' }}>
                    {Math.min(100,Math.round(uploadPct))}%
                  </span>
                </div>
                <div style={{ height:2, background:'var(--bd)', borderRadius:1 }}>
                  <div style={{ height:'100%', width:`${Math.min(100,uploadPct)}%`,
                    background:'var(--gold)', borderRadius:1, transition:'width .1s' }}/>
                </div>
              </div>
            ) : (
              <button onClick={simulateUpload} className="bp" style={{
                width:'100%', padding:'9px', borderRadius:6, background:'var(--gf)',
                border:'1px dashed rgba(201,168,76,.35)', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={13} color="var(--gold)"/>
                <span style={{ fontSize:11, color:'var(--gold)', fontWeight:500 }}>Upload Floor Plan</span>
              </button>
            )}
          </div>

          {/* Layers header */}
          <div style={{ padding:'10px 14px 6px', display:'flex', alignItems:'center',
            justifyContent:'space-between' }}>
            <span style={{ fontSize:10, letterSpacing:'.1em', color:'var(--t3)',
              fontFamily:'var(--mn)', textTransform:'uppercase' }}>Layers</span>
            <span style={{ fontSize:9, color:'var(--t4)', fontFamily:'var(--mn)' }}>{allObjs.length} objects</span>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'0 8px 8px' }}>
            {/* Walls */}
            <div style={{ marginBottom:4 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 6px',
                color:'var(--t3)', fontSize:11 }}>
                <Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" size={11} color="var(--t3)"/>
                <span style={{ fontFamily:'var(--mn)', fontSize:10, letterSpacing:'.06em',
                  textTransform:'uppercase' }}>Walls ({scene.walls.length})</span>
              </div>
              {scene.walls.map(w => (
                <div key={w.id} onClick={() => setSelectedId(s => s===w.id ? null : w.id)}
                  style={{ display:'flex', alignItems:'center', gap:7, padding:'4px 8px',
                    borderRadius:4, cursor:'pointer', marginBottom:1,
                    background: selectedId===w.id ? 'var(--gf)' : 'transparent',
                    border: selectedId===w.id ? '1px solid var(--bd2)' : '1px solid transparent',
                    transition:'all .1s' }}>
                  <div style={{ width:3, height:14, borderRadius:1, flexShrink:0,
                    background: selectedId===w.id ? 'var(--gold)' : 'var(--t4)' }}/>
                  <span style={{ fontSize:11, flex:1, overflow:'hidden', textOverflow:'ellipsis',
                    whiteSpace:'nowrap', color: selectedId===w.id ? 'var(--t)' : 'var(--t2)' }}>
                    {w.label}
                  </span>
                  <span style={{ fontSize:9, fontFamily:'var(--mn)', color:'var(--t4)' }}>{w.id}</span>
                </div>
              ))}
            </div>

            <Divider/>

            {/* Furniture */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 6px',
                color:'var(--t3)', fontSize:11 }}>
                <Ico d="M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={11} color="var(--t3)"/>
                <span style={{ fontFamily:'var(--mn)', fontSize:10, letterSpacing:'.06em',
                  textTransform:'uppercase' }}>Furniture ({scene.furniture.length})</span>
              </div>
              {scene.furniture.map(f => (
                <div key={f.id} onClick={() => setSelectedId(s => s===f.id ? null : f.id)}
                  style={{ display:'flex', alignItems:'center', gap:7, padding:'4px 8px',
                    borderRadius:4, cursor:'pointer', marginBottom:1,
                    background: selectedId===f.id ? 'var(--gf)' : 'transparent',
                    border: selectedId===f.id ? '1px solid var(--bd2)' : '1px solid transparent',
                    transition:'all .1s' }}>
                  <div style={{ width:10, height:10, borderRadius:2, flexShrink:0,
                    background:f.color,
                    border: selectedId===f.id ? '1px solid var(--gold)' : '1px solid var(--bd)' }}/>
                  <span style={{ fontSize:11, flex:1, overflow:'hidden', textOverflow:'ellipsis',
                    whiteSpace:'nowrap', color: selectedId===f.id ? 'var(--t)' : 'var(--t2)' }}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Properties panel */}
            {sel && (
              <div style={{ marginTop:12, background:'var(--s)', border:'1px solid var(--bd)',
                borderRadius:6, padding:'10px', animation:'slideU .2s ease' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:10, fontFamily:'var(--mn)', letterSpacing:'.08em',
                    color:'var(--gold)', textTransform:'uppercase' }}>Properties</span>
                  <button onClick={() => setSelectedId(null)}
                    style={{ background:'none', border:'none', cursor:'pointer', padding:2 }}>
                    <Ico d="M18 6 6 18M6 6l12 12" size={10} color="var(--t3)"/>
                  </button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {[
                    ['Label',  sel.label],
                    ['ID',     sel.id],
                    sel.w    ? ['Size',   `${sel.w}×${sel.d}×${sel.h} m`]                                    : null,
                    sel.sx!=null ? ['Length', `${Math.hypot(sel.ex-sel.sx,sel.ez-sel.sz).toFixed(1)} m`]      : null,
                    sel.h    ? ['Height', `${sel.h} m`]                                                      : null,
                  ].filter(Boolean).map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:10, color:'var(--t3)' }}>{k}</span>
                      <span style={{ fontSize:10, fontFamily:'var(--mn)', color:'var(--t)',
                        background:'var(--r)', padding:'2px 6px', borderRadius:3 }}>{v}</span>
                    </div>
                  ))}
                </div>
                {sel.color && (
                  <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:10, color:'var(--t3)' }}>Material</span>
                    <div style={{ width:14, height:14, borderRadius:3, background:sel.color,
                      border:'1px solid var(--bd2)' }}/>
                    <span style={{ fontSize:10, fontFamily:'var(--mn)', color:'var(--t2)' }}>{sel.color}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* CANVAS */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
          <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
            <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'100%' }}/>

            {/* HUD */}
            <div style={{ position:'absolute', top:14, left:14, display:'flex', gap:8, pointerEvents:'none' }}>
              {[
                `${project?.name||'Villa Moderna'}  ·  ${project?.area||'340 m²'}`,
                `${viewMode.toUpperCase()}  ·  ORBIT`
              ].map((txt,i) => (
                <div key={i} style={{ background:'rgba(6,6,12,.8)', border:'1px solid var(--bd)',
                  borderRadius:5, padding:'5px 10px', backdropFilter:'blur(4px)' }}>
                  <span style={{ fontSize:10, fontFamily:'var(--mn)',
                    color: i===0 ? 'var(--t2)' : 'var(--t3)', letterSpacing:'.06em' }}>{txt}</span>
                </div>
              ))}
            </div>

            {/* View controls */}
            <div style={{ position:'absolute', bottom:16, right:16,
              display:'flex', flexDirection:'column', gap:4 }}>
              {[
                'M12 2v20M2 12h20',
                'M21 21l-6-6m6 6v-4.5m0 4.5h-4.5M3 3l6 6M3 3v4.5M3 3h4.5',
                'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'
              ].map((d,i) => (
                <button key={i} className="bp" style={{ width:30, height:30,
                  background:'rgba(13,13,21,.85)', border:'1px solid var(--bd)',
                  borderRadius:5, cursor:'pointer', display:'flex',
                  alignItems:'center', justifyContent:'center' }}>
                  <Ico d={d} size={13} color="var(--t3)"/>
                </button>
              ))}
            </div>

            {!selectedId && (
              <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)',
                background:'rgba(6,6,12,.75)', border:'1px solid var(--bd)', borderRadius:20,
                padding:'5px 14px', backdropFilter:'blur(4px)', pointerEvents:'none' }}>
                <span style={{ fontSize:10, fontFamily:'var(--mn)', color:'var(--t3)', letterSpacing:'.06em' }}>
                  CLICK TO SELECT  ·  DRAG TO ORBIT  ·  SCROLL TO ZOOM
                </span>
              </div>
            )}
          </div>

          {/* NLP BAR */}
          <div style={{ padding:'10px 16px', borderTop:'1px solid var(--bd)',
            background:'var(--d)', flexShrink:0 }}>
            {log.length > 0 && (
              <div style={{ marginBottom:8, maxHeight:72, overflowY:'auto',
                display:'flex', flexDirection:'column', gap:3 }}>
                {log.slice(0,3).map((l,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8,
                    animation:'slideU .2s ease' }}>
                    <div style={{ width:16, height:16, borderRadius:3, flexShrink:0, marginTop:1,
                      background: l.type==='user' ? 'var(--gf)' : l.type==='ai' ? 'rgba(74,139,212,.15)' : 'rgba(255,255,255,.04)',
                      border:`1px solid ${l.type==='user'?'rgba(201,168,76,.25)':l.type==='err'?'rgba(224,85,85,.25)':'var(--bd)'}`,
                      display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:8 }}>
                        {l.type==='user'?'→':l.type==='ai'?'◆':l.type==='err'?'!':'·'}
                      </span>
                    </div>
                    <span style={{ fontSize:11, lineHeight:1.4, flex:1,
                      color: l.type==='err'?'var(--red)':l.type==='system'?'var(--t3)':'var(--t2)' }}>
                      {l.text}
                    </span>
                    {l.ts && <span style={{ fontSize:9, fontFamily:'var(--mn)',
                      color:'var(--t4)', flexShrink:0, marginTop:1 }}>{l.ts}</span>}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, flex:1,
                background:'var(--s)', borderRadius:7, padding:'8px 14px',
                border: nlp ? '1px solid rgba(201,168,76,.35)' : '1px solid var(--bd2)',
                transition:'border-color .15s' }}>
                <Ico d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M17.657 17.657l-.707-.707M12 20v1M6.343 17.657l-.707.707M4 12H3M6.343 6.343l-.707-.707" size={14} color="var(--gold)"/>
                <input value={nlp} onChange={e => setNlp(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && handleNLP()}
                  placeholder={`Describe a change… e.g. "move the sofa 1m north" or "add a dining table"`}
                  style={{ flex:1, background:'none', border:'none', outline:'none',
                    color:'var(--t)', fontSize:12, fontFamily:'var(--ui)' }}/>
                {nlp && <span style={{ fontSize:10, fontFamily:'var(--mn)', color:'var(--t3)' }}>↵</span>}
              </div>
              <button onClick={handleNLP} disabled={!nlp.trim()||nlpBusy} className="bp"
                style={{ height:38, padding:'0 18px', borderRadius:7,
                  background: nlp.trim() ? 'var(--gold)' : 'var(--r)',
                  border:'none', cursor: nlp.trim() ? 'pointer' : 'default',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                {nlpBusy ? <Spinner/> : <>
                  <Ico d="M5 12h14M12 5l7 7-7 7" size={14} color={nlp.trim()?'#07070C':'var(--t3)'}/>
                  <span style={{ fontSize:12, fontWeight:500, fontFamily:'var(--ui)',
                    color: nlp.trim() ? '#07070C' : 'var(--t3)' }}>Apply</span>
                </>}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside style={{ width:268, background:'var(--d)', borderLeft:'1px solid var(--bd)',
          display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 }}>
          <div style={{ display:'flex', borderBottom:'1px solid var(--bd)', flexShrink:0 }}>
            {[['ai','AI'],['versions','History'],['collab','Team']].map(([k,l]) => (
              <button key={k} onClick={() => setRPanel(k)} style={{
                flex:1, padding:'11px 0', fontSize:11, fontFamily:'var(--mn)',
                letterSpacing:'.06em', background:'none', border:'none', cursor:'pointer',
                textTransform:'uppercase',
                color: rPanel===k ? 'var(--gold)' : 'var(--t3)',
                borderBottom: rPanel===k ? '2px solid var(--gold)' : '2px solid transparent',
                transition:'all .15s' }}>{l}</button>
            ))}
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'12px' }}>

            {/* AI tab */}
            {rPanel==='ai' && (
              <div style={{ animation:'fadeIn .25s ease' }}>
                <div style={{ marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)',
                    boxShadow:'0 0 6px var(--green)', animation:'blink 2s ease infinite' }}/>
                  <span style={{ fontSize:11, color:'var(--t2)', fontFamily:'var(--mn)' }}>AI Analysis Active</span>
                </div>
                {SUGGESTIONS.map((s,i) => (
                  <div key={s.id} style={{ marginBottom:8, background:'var(--s)',
                    border:'1px solid var(--bd)', borderRadius:7, padding:'10px 11px',
                    borderLeft:`2px solid ${SEV_COLOR[s.sev]}`,
                    animation:`slideR .3s ${i*.07}s ease both` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:5 }}>
                      <span style={{ fontSize:13, lineHeight:1 }}>{s.icon}</span>
                      <span style={{ fontSize:12, fontWeight:500, color:'var(--t)', flex:1 }}>{s.title}</span>
                      <Tag c={SEV_COLOR[s.sev]}>{s.tag}</Tag>
                    </div>
                    <p style={{ fontSize:11, color:'var(--t2)', lineHeight:1.5 }}>{s.desc}</p>
                    <div style={{ marginTop:7, display:'flex', gap:5 }}>
                      <button className="bp" style={{ fontSize:10, padding:'3px 8px', borderRadius:4,
                        background:'var(--r)', border:'1px solid var(--bd)',
                        cursor:'pointer', color:'var(--t2)', fontFamily:'var(--ui)' }}>Apply Fix</button>
                      <button className="bp" style={{ fontSize:10, padding:'3px 8px', borderRadius:4,
                        background:'none', border:'1px solid var(--bd)',
                        cursor:'pointer', color:'var(--t3)', fontFamily:'var(--ui)' }}>Dismiss</button>
                    </div>
                  </div>
                ))}
                <Divider/>
                <p style={{ fontSize:11, color:'var(--t3)', textAlign:'center',
                  padding:'8px 0', fontFamily:'var(--mn)' }}>
                  {allObjs.length} objects · 4 findings
                </p>
              </div>
            )}

            {/* History tab */}
            {rPanel==='versions' && (
              <div style={{ animation:'fadeIn .25s ease' }}>
                <div style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'center', marginBottom:10 }}>
                  <span style={{ fontSize:11, color:'var(--t2)', fontFamily:'var(--mn)',
                    letterSpacing:'.06em', textTransform:'uppercase' }}>Snapshots</span>
                  <Btn sm style={{ fontSize:9 }}>Save now</Btn>
                </div>
                {VERSIONS.map((v,i) => (
                  <div key={v.id} style={{ display:'flex', gap:9, marginBottom:10,
                    animation:`slideR .3s ${i*.07}s ease both` }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', flexShrink:0, marginTop:2,
                        background: v.current ? 'var(--gold)' : 'var(--h)',
                        border:`2px solid ${v.current?'var(--gold2)':'var(--bd2)'}`,
                        boxShadow: v.current ? '0 0 8px rgba(201,168,76,.5)' : 'none' }}/>
                      {i < VERSIONS.length-1 && (
                        <div style={{ width:1, flex:1, background:'var(--bd)', marginTop:2, minHeight:20 }}/>
                      )}
                    </div>
                    <div style={{ flex:1, paddingBottom:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
                        <span style={{ fontSize:12, color: v.current?'var(--t)':'var(--t2)',
                          fontWeight: v.current?500:400 }}>{v.label}</span>
                        {v.current && <Tag c="var(--gold)">current</Tag>}
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        <span style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--mn)' }}>{v.time}</span>
                        <span style={{ fontSize:10, color:'var(--t3)' }}>by {v.author}</span>
                      </div>
                      {!v.current && (
                        <button className="bp" style={{ marginTop:5, fontSize:10, padding:'2px 8px',
                          borderRadius:3, background:'none', border:'1px solid var(--bd)',
                          cursor:'pointer', color:'var(--t3)', fontFamily:'var(--ui)' }}>
                          ↩ Restore
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Team tab */}
            {rPanel==='collab' && (
              <div style={{ animation:'fadeIn .25s ease' }}>
                <span style={{ fontSize:11, color:'var(--t2)', fontFamily:'var(--mn)',
                  letterSpacing:'.06em', textTransform:'uppercase', display:'block', marginBottom:12 }}>
                  Active Session
                </span>
                {COLLABS.map((c,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0',
                    borderBottom:'1px solid var(--bd)', animation:`slideR .3s ${i*.07}s ease both` }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:c.color,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10, fontWeight:700, color:'#07070C', flexShrink:0,
                      filter: c.online ? `drop-shadow(0 0 6px ${c.color}66)` : 'none',
                      opacity: c.online ? 1 : .5 }}>
                      {c.initials}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, color: c.online?'var(--t)':'var(--t2)',
                        fontWeight: c.online?500:400 }}>{c.name}</div>
                      <div style={{ fontSize:10, color:'var(--t3)' }}>
                        {c.role} · <span style={{ color: c.online?'var(--green)':'var(--t4)' }}>
                          {c.online?'Online':'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:14 }}>
                  <Divider/>
                  <p style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--mn)',
                    letterSpacing:'.08em', textTransform:'uppercase', margin:'8px 0 6px' }}>
                    Share Link
                  </p>
                  <div style={{ display:'flex', gap:6 }}>
                    <div style={{ flex:1, background:'var(--s)', border:'1px solid var(--bd)',
                      borderRadius:5, padding:'6px 10px', fontSize:10, fontFamily:'var(--mn)',
                      color:'var(--t3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      architectai.vercel.app/p/vm-...
                    </div>
                    <Btn sm>Copy</Btn>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─── PRESENT MODE ───────────────────────────────────────────────────────── */
function PresentMode({ project, onBack }) {
  const canvasRef = useRef(null);
  useScene(canvasRef, INIT_SCENE, null, () => {});

  return (
    <div style={{ width:'100vw', height:'100vh', background:'#030306',
      display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <header style={{ position:'absolute', top:0, left:0, right:0, zIndex:10,
        padding:'16px 28px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12,
          background:'rgba(6,6,12,.85)', border:'1px solid var(--bd)',
          borderRadius:8, padding:'8px 16px', backdropFilter:'blur(8px)' }}>
          <span style={{ fontFamily:'var(--dp)', fontSize:16, color:'var(--gold)',
            letterSpacing:'.04em' }}>{project?.name || 'Villa Moderna'}</span>
          <div style={{ width:1, height:16, background:'var(--bd)' }}/>
          <span style={{ fontSize:11, color:'var(--t3)', fontFamily:'var(--mn)' }}>
            {project?.area || '340 m²'}
          </span>
          <Tag c="var(--blue)">PRESENTATION</Tag>
        </div>
        <div style={{ display:'flex', gap:8, background:'rgba(6,6,12,.85)',
          border:'1px solid var(--bd)', borderRadius:8,
          padding:'8px 12px', backdropFilter:'blur(8px)' }}>
          <Btn sm>📥 Export PDF</Btn>
          <button onClick={onBack} className="bp" style={{ padding:'4px 14px', borderRadius:5,
            background:'var(--gold)', border:'none', cursor:'pointer',
            fontSize:11, fontWeight:500, fontFamily:'var(--ui)', color:'#07070C' }}>
            Exit
          </button>
        </div>
      </header>
      <div style={{ flex:1, position:'relative' }}>
        <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'100%' }}/>
        <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)',
          background:'rgba(6,6,12,.8)', border:'1px solid var(--bd)', borderRadius:24,
          padding:'7px 18px', backdropFilter:'blur(4px)' }}>
          <span style={{ fontSize:11, fontFamily:'var(--mn)', color:'var(--t2)', letterSpacing:'.06em' }}>
            DRAG TO ORBIT  ·  SCROLL TO ZOOM  ·  CLICK TO ANNOTATE
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── UPLOAD MODAL ───────────────────────────────────────────────────────── */
function UploadModal({ onClose, onDone }) {
  const [stage, setStage] = useState('idle');
  const [pct,   setPct]   = useState(0);
  const [file,  setFile]  = useState(null);

  const start = () => {
    setStage('uploading'); setPct(0);
    const t = setInterval(() => {
      setPct(p => {
        if (p >= 100) {
          clearInterval(t);
          setStage('generating');
          setTimeout(() => setStage('done'), 1800);
          return 100;
        }
        return p + Math.random() * 14;
      });
    }, 110);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'center',
      backdropFilter:'blur(4px)', animation:'fadeIn .2s ease' }}>
      <div style={{ background:'var(--s)', border:'1px solid var(--bd2)', borderRadius:12,
        width:440, padding:'28px', animation:'fadeUp .25s ease' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <h2 style={{ fontFamily:'var(--dp)', fontSize:22, fontWeight:400, color:'var(--t)' }}>
            Upload Floor Plan
          </h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <Ico d="M18 6 6 18M6 6l12 12" size={16} color="var(--t3)"/>
          </button>
        </div>

        {stage === 'idle' && (
          <>
            <div onClick={() => document.getElementById('file-inp').click()}
              style={{ border:'1px dashed rgba(201,168,76,.35)', borderRadius:8, padding:'32px',
                textAlign:'center', cursor:'pointer', background:'var(--gf)', transition:'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--gf)'}>
              <div style={{ fontSize:32, marginBottom:8 }}>📐</div>
              <p style={{ color:'var(--t2)', fontSize:13, marginBottom:4 }}>
                {file ? file.name : 'Drop your floor plan here'}
              </p>
              <p style={{ color:'var(--t3)', fontSize:11, fontFamily:'var(--mn)' }}>
                PDF · JPG · PNG · DWG · DXF
              </p>
              <input id="file-inp" type="file" accept=".pdf,.jpg,.png,.dwg,.dxf"
                style={{ display:'none' }} onChange={e => setFile(e.target.files?.[0])}/>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:16 }}>
              <Btn onClick={onClose} style={{ flex:1, justifyContent:'center' }}>Cancel</Btn>
              <button onClick={start} className="bp" style={{ flex:1, padding:'8px', borderRadius:6,
                background:'var(--gold)', border:'none', cursor:'pointer',
                fontSize:12, fontWeight:500, fontFamily:'var(--ui)', color:'#07070C' }}>
                Generate 3D Model →
              </button>
            </div>
          </>
        )}

        {(stage==='uploading'||stage==='generating') && (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
              gap:10, marginBottom:14 }}>
              <Spinner/>
              <span style={{ fontSize:13, color:'var(--t2)' }}>
                {stage==='uploading' ? 'Uploading…' : 'AI generating 3D model…'}
              </span>
            </div>
            <div style={{ height:4, background:'var(--r)', borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background:'var(--gold)',
                borderRadius:2, transition:'width .15s',
                backgroundImage:'linear-gradient(90deg,var(--gold),var(--gold2),var(--gold))',
                backgroundSize:'200% 100%', animation:'shimmer 1.5s linear infinite' }}/>
            </div>
            {stage==='generating' && (
              <p style={{ marginTop:10, fontSize:11, fontFamily:'var(--mn)', color:'var(--t3)' }}>
                Detecting walls, rooms, openings…
              </p>
            )}
          </div>
        )}

        {stage==='done' && (
          <div style={{ textAlign:'center', padding:'16px 0', animation:'fadeUp .3s ease' }}>
            <div style={{ fontSize:40, marginBottom:10, color:'var(--green)' }}>✓</div>
            <p style={{ fontSize:14, color:'var(--t)', marginBottom:6 }}>3D model ready!</p>
            <p style={{ fontSize:11, color:'var(--t3)', marginBottom:16, fontFamily:'var(--mn)' }}>
              6 walls · 4 rooms · 5 furniture items detected
            </p>
            <button onClick={onDone} className="bp" style={{ padding:'9px 28px', borderRadius:6,
              background:'var(--gold)', border:'none', cursor:'pointer',
              fontSize:13, fontWeight:500, fontFamily:'var(--ui)', color:'#07070C' }}>
              Open in Editor →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [view,       setView]       = useState('landing');
  const [project,    setProject]    = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (document.getElementById('arch-css')) return;
    const s = document.createElement('style');
    s.id = 'arch-css'; s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
  }, []);

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden' }}>
      {view==='landing'  && <Landing  onEnter={() => setView('dashboard')}/>}
      {view==='dashboard' && (
        <Dashboard
          onOpen={p => { setProject(p); setView('editor'); }}
          onNew={() => setShowUpload(true)}
        />
      )}
      {view==='editor'   && (
        <Editor
          project={project}
          onBack={() => setView('dashboard')}
          onPresent={() => setView('present')}
        />
      )}
      {view==='present'  && (
        <PresentMode
          project={project}
          onBack={() => setView('editor')}
        />
      )}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onDone={() => { setShowUpload(false); setProject(PROJECTS[0]); setView('editor'); }}
        />
      )}
    </div>
  );
}
