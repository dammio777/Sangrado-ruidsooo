const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const dir=process.argv[2],mode=process.argv[3];
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:mode=='full'?2:1});
await pg.goto('file://'+dir+'/index.html',{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);
if(mode=='full'){fs.mkdirSync(dir+'/fr',{recursive:true});const N=Math.round(33.5*30);
for(let i=0;i<N;i++){await pg.evaluate(t=>setT(t),i/30);await pg.screenshot({path:`${dir}/fr/${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});}}
else{const ts=[3.8,5.8,8.5,11.8,14.9,16.8,18.5,23,28.9,33];let k=0;for(const t of ts){await pg.evaluate(t=>setT(t),t);await pg.screenshot({path:`${dir}/k${k++}.png`});}}
await b.close();})();
