// ---------- 3D AI Rescue Rover ----------
const sceneEl = document.getElementById("scene");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0d0a12, 0.055);

const camera = new THREE.PerspectiveCamera(38, sceneEl.clientWidth / sceneEl.clientHeight, 0.1, 100);
camera.position.set(5.6, 3.5, 7.2);

const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sceneEl.clientWidth, sceneEl.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
sceneEl.appendChild(renderer.domElement);

// Lightweight drag + pinch/scroll controls; no OrbitControls dependency.
let dragging = false, lastX = 0, lastY = 0;
let targetRotY = 0, targetRotX = 0;
let cameraDistance = 7.2;
let pinchStart = 0;

renderer.domElement.style.touchAction = "none";

renderer.domElement.addEventListener("pointerdown", e => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  renderer.domElement.setPointerCapture(e.pointerId);
});

renderer.domElement.addEventListener("pointermove", e => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  targetRotY += dx * 0.009;
  targetRotX += dy * 0.004;
  targetRotX = Math.max(-0.65, Math.min(0.65, targetRotX));
  lastX = e.clientX;
  lastY = e.clientY;
});

renderer.domElement.addEventListener("pointerup", () => dragging = false);
renderer.domElement.addEventListener("pointercancel", () => dragging = false);

renderer.domElement.addEventListener("wheel", e => {
  e.preventDefault();
  cameraDistance += e.deltaY * 0.004;
  cameraDistance = Math.max(4.5, Math.min(10, cameraDistance));
}, {passive:false});

function updateCamera(){
  camera.position.x = Math.sin(targetRotY) * cameraDistance;
  camera.position.z = Math.cos(targetRotY) * cameraDistance;
  camera.position.y = 3.2 + targetRotX * 2.0;
  camera.lookAt(0, .85, 0);
}

const pink = new THREE.MeshStandardMaterial({color:0xf3a5ca, metalness:.72, roughness:.24});
const lavender = new THREE.MeshStandardMaterial({color:0xbba8ff, metalness:.68, roughness:.23});
const dark = new THREE.MeshStandardMaterial({color:0x17121d, metalness:.82, roughness:.25});
const glass = new THREE.MeshPhysicalMaterial({color:0xded4ff, metalness:.15, roughness:.08, transmission:.55, transparent:true, opacity:.8});
const glow = new THREE.MeshBasicMaterial({color:0xffa8cf});

const rover = new THREE.Group();
scene.add(rover);

function box(w,h,d,mat,x=0,y=0,z=0){
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
  m.position.set(x,y,z); rover.add(m); return m;
}
function cyl(r1,r2,h,mat,x=0,y=0,z=0,rx=0,ry=0,rz=0){
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,32),mat);
  m.position.set(x,y,z); m.rotation.set(rx,ry,rz); rover.add(m); return m;
}

// chassis
box(3.25,.62,2.05,dark,0,.85,0);
box(2.75,.20,1.62,pink,0,1.18,0);
box(1.35,.52,1.05,lavender,0,1.53,.02);

// sensor dome
const dome = new THREE.Mesh(new THREE.SphereGeometry(.48,32,18,0,Math.PI*2,0,Math.PI/2),glass);
dome.position.set(0,2.02,0); rover.add(dome);

// camera eye
cyl(.15,.15,.16,dark,0,2.05,.44,Math.PI/2,0,0);
cyl(.09,.09,.18,glow,0,2.05,.55,Math.PI/2,0,0);

// antenna
cyl(.035,.035,.85,lavender,0,2.35,-.2);
cyl(.11,.11,.06,pink,0,2.78,-.2);
const antennaGlow = new THREE.Mesh(new THREE.SphereGeometry(.075,20,20),glow);
antennaGlow.position.set(0,2.82,-.2); rover.add(antennaGlow);

// wheels
for(const x of [-1.65,1.65]){
  for(const z of [-.86,.86]){
    const wheel = cyl(.48,.48,.32,dark,x,.63,z,Math.PI/2,0,0);
    const hub = cyl(.22,.22,.35,lavender,x,.63,z,Math.PI/2,0,0);
  }
}

// front sensor bars
for(const x of [-.72,0,.72]){
  box(.10,.16,.42,pink,x,1.5,1.02);
}

// side rails
box(2.9,.09,.09,lavender,0,1.5,-1.06);
box(2.9,.09,.09,lavender,0,1.5,1.06);

// floor
const floorMat = new THREE.MeshStandardMaterial({color:0x110d17,metalness:.2,roughness:.75});
const floor = new THREE.Mesh(new THREE.CircleGeometry(7,64),floorMat);
floor.rotation.x=-Math.PI/2; floor.position.y=.05; scene.add(floor);

const ringMat = new THREE.MeshBasicMaterial({color:0xbba8ff,transparent:true,opacity:.16});
for(let r=2;r<=5;r+=1){
  const ring = new THREE.Mesh(new THREE.RingGeometry(r-.006,r+.006,96),ringMat);
  ring.rotation.x=-Math.PI/2; ring.position.y=.055; scene.add(ring);
}

// floating circuit particles
const points = [];
for(let i=0;i<75;i++){
  points.push((Math.random()-.5)*10, Math.random()*4.8+.4, (Math.random()-.5)*7);
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute("position",new THREE.Float32BufferAttribute(points,3));
const particles = new THREE.Points(particleGeo,new THREE.PointsMaterial({color:0xf3a5ca,size:.025,transparent:true,opacity:.75}));
scene.add(particles);

const key = new THREE.PointLight(0xf3a5ca,18,10); key.position.set(3,5,4); scene.add(key);
const fill = new THREE.PointLight(0xbba8ff,14,9); fill.position.set(-4,3,-3); scene.add(fill);
scene.add(new THREE.AmbientLight(0xffffff,.75));

function animate(){
  requestAnimationFrame(animate);
  rover.rotation.y += .0028;
  rover.position.y = Math.sin(performance.now()*.0012)*.035;
  particles.rotation.y += .00015;
  updateCamera();
  renderer.render(scene,camera);
}
animate();

window.addEventListener("resize",()=>{
  const w=sceneEl.clientWidth,h=sceneEl.clientHeight;
  camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
});

// ---------- Scroll reveal ----------
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add("show");
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

// Mobile menu
document.querySelector(".menu").addEventListener("click",()=>{
  const nav=document.querySelector(".nav nav");
  const open=nav.style.display==="flex";
  nav.style.display=open?"none":"flex";
  if(!open){
    nav.style.position="absolute";
    nav.style.top="65px";
    nav.style.right="0";
    nav.style.padding="18px";
    nav.style.flexDirection="column";
    nav.style.background="rgba(13,10,18,.94)";
    nav.style.border="1px solid rgba(255,255,255,.12)";
    nav.style.borderRadius="15px";
  }
});
