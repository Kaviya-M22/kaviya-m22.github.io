// K-Explorer Robot — stylized 3D portfolio character inspired by the supplied reference.
const mount=document.getElementById("robot3d");
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(34,mount.clientWidth/mount.clientHeight,.1,100);
camera.position.set(0,3.0,8.6);

const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(mount.clientWidth,mount.clientHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
mount.appendChild(renderer.domElement);

const pink=new THREE.MeshStandardMaterial({color:0xf28bd4,metalness:.7,roughness:.2,emissive:0x28071f,emissiveIntensity:.45});
const lavender=new THREE.MeshStandardMaterial({color:0xb9b5ff,metalness:.62,roughness:.2});
const white=new THREE.MeshStandardMaterial({color:0xecefff,metalness:.45,roughness:.19});
const blueWhite=new THREE.MeshStandardMaterial({color:0x9edcff,metalness:.45,roughness:.18});
const dark=new THREE.MeshStandardMaterial({color:0x171a2b,metalness:.82,roughness:.15});
const screenMat=new THREE.MeshStandardMaterial({color:0x050817,metalness:.82,roughness:.08,emissive:0x050d25,emissiveIntensity:.8});
const cyan=new THREE.MeshBasicMaterial({color:0x25d8ff});
const orange=new THREE.MeshBasicMaterial({color:0xffa52d});
const pinkGlow=new THREE.MeshBasicMaterial({color:0xff48bd});

const bot=new THREE.Group();scene.add(bot);
function add(o,x=0,y=0,z=0){o.position.set(x,y,z);bot.add(o);return o}
function box(w,h,d,m,x=0,y=0,z=0){return add(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m),x,y,z)}
function sphere(x,y,z,sx,sy,sz,m){const o=add(new THREE.Mesh(new THREE.SphereGeometry(1,32,24),m),x,y,z);o.scale.set(sx,sy,sz);return o}
function cyl(r,h,m,x=0,y=0,z=0,rx=0,rz=0){const o=add(new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,32),m),x,y,z);o.rotation.x=rx;o.rotation.z=rz;return o}
function rounded(w,h,d,r,m,x=0,y=0,z=0){
  const s=new THREE.Shape();
  s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
  s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);
  s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
  const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:4,bevelSize:r*.55,bevelThickness:r*.55,curveSegments:8});
  g.center(); return add(new THREE.Mesh(g,m),x,y,z);
}

// Feet and legs
for(const x of [-.62,.62]){
  rounded(.78,.48,.88,.12,dark,x,.48,.02);
  rounded(.72,.12,.74,.05,pinkGlow,x,.29,.08);
  rounded(.58,.07,.48,.035,orange,x,.37,.27);
  rounded(.52,.85,.52,.12,white,x,.92,0);
  box(.42,.055,.40,cyan,x,1.03,.28);
  box(.42,.045,.40,pinkGlow,x,.76,.28);
}

// Slim mechanical waist and torso
rounded(1.18,.50,.72,.15,dark,0,1.48,0);
rounded(1.72,1.25,1.10,.27,white,0,2.05,0);
rounded(1.48,1.02,.12, .20,lavender,0,2.08,.60);
// front chest panel
rounded(.68,.52,.10,.13,dark,0,2.10,.70);
const paw=new THREE.Mesh(new THREE.CircleGeometry(.16,24),orange);add(paw,0,2.10,.765);
for(const a of [0,.9,1.8,2.7]){const p=new THREE.Mesh(new THREE.CircleGeometry(.045,16),orange);add(p,Math.cos(a)*.09,2.19+Math.sin(a)*.08,.77)}

// Shoulders + articulated arms
for(const side of [-1,1]){
  sphere(side*.99,2.30,0,.27,.27,.30,pink);
  rounded(.46,.82,.48,.13,white,side*1.10,1.88,0);
  rounded(.48,.52,.50,.13,dark,side*1.12,1.35,0);
  cyl(.15,.42,dark,side*1.12,1.02,0,0,0);
  // hands / grippers
  sphere(side*1.12,.76,0,.28,.22,.25,white);
  for(const q of [-.11,0,.11]){
    cyl(.035,.20,lavender,side*(1.12+q),.57,.10,Math.PI/2,0);
  }
  box(.46,.055,.38,cyan,side*1.10,1.97,.29);
  box(.46,.045,.38,pinkGlow,side*1.10,1.70,.29);
}

// Neck and deliberate floating gap
cyl(.22,.18,dark,0,2.88,0);
const lev=new THREE.Mesh(new THREE.SphereGeometry(.13,24,16),cyan);add(lev,0,2.98,0);
for(const y of [2.91,3.04]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.30,.014,8,48),y<3?pinkGlow:cyan);add(ring,0,y,0)}

// Large rounded rectangular robot head
rounded(2.85,2.05,1.25,.34,white,0,4.15,0);
// colored side shell panels
rounded(.30,1.22,1.30,.10,pink,1.48,4.12,0);
rounded(.30,1.22,1.30,.10,lavender,-1.48,4.12,0);
// top shell accents
box(.10,1.20,.12,lavender,-.45,5.16,.42);
box(.10,1.20,.12,blueWhite,.45,5.16,.42);
for(const x of [-.45,.45]) sphere(x,5.18,.47,.065,.065,.035,cyan);

// glossy dark face screen
rounded(2.42,1.34,.18,.22,screenMat,0,4.13,.69);
// screen inner reflection
rounded(2.18,.10,.02,.04,new THREE.MeshBasicMaterial({color:0x243657,transparent:true,opacity:.35}),0,4.66,.80);
// expressive animated screen eyes — large, clearly visible and gently blinking
const eyeGroup = new THREE.Group();
eyeGroup.position.set(0,0,0);
bot.add(eyeGroup);
function eyeMesh(x){
  const g=new THREE.Group();
  g.position.set(x,4.22,.84);
  const socket=new THREE.Mesh(
    new THREE.SphereGeometry(.33,32,24),
    new THREE.MeshBasicMaterial({color:0x06101d})
  );
  socket.scale.set(.82,.92,.20);
  g.add(socket);
  const iris=new THREE.Mesh(
    new THREE.SphereGeometry(.235,32,24),
    new THREE.MeshBasicMaterial({color:0x26dcff})
  );
  iris.scale.set(.86,1.08,.20);
  iris.position.z=.075;
  g.add(iris);
  const pupil=new THREE.Mesh(
    new THREE.SphereGeometry(.095,24,20),
    new THREE.MeshBasicMaterial({color:0x071225})
  );
  pupil.scale.set(.9,1.2,.18);
  pupil.position.z=.12;
  g.add(pupil);
  const shine=new THREE.Mesh(
    new THREE.SphereGeometry(.055,20,16),
    new THREE.MeshBasicMaterial({color:0xffffff})
  );
  shine.position.set(-.075,.085,.16);
  g.add(shine);
  eyeGroup.add(g);
  return g;
}
const leftEye=eyeMesh(-.55), rightEye=eyeMesh(.55);
let blinkPhase=0;
function updateBlink(t){
  // Smooth blink roughly every 4.2 seconds; eyes briefly close, then reopen.
  const cycle=(t%4200)/4200;
  let open=1;
  if(cycle>.88 && cycle<.94){
    const q=(cycle-.88)/.06; open=1-0.94*Math.sin(q*Math.PI);
  }
  leftEye.scale.y=open; rightEye.scale.y=open;
}

// tiny central smile on screen
const smile=new THREE.Mesh(new THREE.TorusGeometry(.12,.018,8,24,Math.PI),pinkGlow);add(smile,0,3.98,.82);smile.rotation.x=Math.PI/2;

// side sensor modules
for(const side of [-1,1]){
  cyl(.25,.18,dark,side*1.56,4.14,0,Math.PI/2);
  cyl(.15,.20,pink,side*1.66,4.14,0,Math.PI/2);
  sphere(side*1.72,4.14,.03,.045,.045,.045,cyan);
}

// head-top explorer antenna
cyl(.035,.46,lavender,0,5.42,0);
sphere(0,5.68,0,.11,.11,.11,pinkGlow);

// subtle floating circuit particles
const pts=[];for(let i=0;i<90;i++)pts.push((Math.random()-.5)*7,Math.random()*6+.2,(Math.random()-.5)*4.5);
const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
scene.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0x9edcff,size:.024,transparent:true,opacity:.7})));

// floor + lighting
const floor=new THREE.Mesh(new THREE.CircleGeometry(5.5,64),new THREE.MeshStandardMaterial({color:0x080a12,roughness:.8,metalness:.2}));floor.rotation.x=-Math.PI/2;floor.position.y=.08;scene.add(floor);
for(const r of [2.0,3.3,4.6]){const rr=new THREE.Mesh(new THREE.RingGeometry(r-.008,r+.008,96),new THREE.MeshBasicMaterial({color:r===3.3?0xff48bd:0x35bfff,transparent:true,opacity:.18}));rr.rotation.x=-Math.PI/2;rr.position.y=.09;scene.add(rr)}
scene.add(new THREE.AmbientLight(0xabbcff,.72));
const l1=new THREE.PointLight(0xff45bb,17,11);l1.position.set(3,6,4);scene.add(l1);
const l2=new THREE.PointLight(0x35cfff,15,10);l2.position.set(-4,4,3);scene.add(l2);
const l3=new THREE.PointLight(0xffa52d,7,8);l3.position.set(0,2,5);scene.add(l3);

// intuitive drag / zoom
let dragging=false,lastX=0,lastY=0,rotY=0,rotX=0,distance=8.6;
renderer.domElement.style.touchAction="none";
renderer.domElement.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener("pointermove",e=>{if(!dragging)return;rotY+=(e.clientX-lastX)*.008;rotX+=(e.clientY-lastY)*.004;rotX=Math.max(-.38,Math.min(.38,rotX));lastX=e.clientX;lastY=e.clientY});
renderer.domElement.addEventListener("pointerup",()=>dragging=false);renderer.domElement.addEventListener("pointercancel",()=>dragging=false);
renderer.domElement.addEventListener("wheel",e=>{e.preventDefault();distance=Math.max(6.5,Math.min(11,distance+e.deltaY*.004))},{passive:false});
function frame(t){requestAnimationFrame(frame);updateBlink(t);bot.rotation.y+=(rotY-bot.rotation.y)*.08;bot.rotation.x+=(rotX-bot.rotation.x)*.08;bot.position.y=Math.sin(t*.0014)*.04;camera.position.set(0,3.0,distance);camera.lookAt(0,2.65,0);renderer.render(scene,camera)}
requestAnimationFrame(frame);
addEventListener("resize",()=>{camera.aspect=mount.clientWidth/mount.clientHeight;camera.updateProjectionMatrix();renderer.setSize(mount.clientWidth,mount.clientHeight)});
