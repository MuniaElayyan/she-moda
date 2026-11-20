// موسيقى هادئة تُولَّد داخل المتصفح (Web Audio) — لا ملف صوتي ولا حقوق ولا تحميل
(()=>{const btn=$('#musicBtn');let ctx,master,timer,bar=0,on=false;
const P=()=>{try{return localStorage.getItem('music')}catch(e){return null}},S=v=>{try{localStorage.setItem('music',v)}catch(e){}};
const hz=m=>440*Math.pow(2,(m-69)/12),prog=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],pent=[69,72,74,76,79,81];
function build(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;ctx=new AC();master=ctx.createGain();master.gain.value=0;
const len=ctx.sampleRate*3.5,buf=ctx.createBuffer(2,len,ctx.sampleRate);for(let c=0;c<2;c++){const d=buf.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
const rv=ctx.createConvolver();rv.buffer=buf;const wet=ctx.createGain();wet.gain.value=.6;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2000;
master.connect(lp);lp.connect(ctx.destination);master.connect(rv);rv.connect(wet);wet.connect(lp);return true}
function note(m,t,d,v,type){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=hz(m);o.detune.value=(Math.random()-.5)*8;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+Math.min(1.5,d*.35));g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.1)}
function sched(){const t=ctx.currentTime+.1,c=prog[bar++%4];c.forEach((m,i)=>note(m,t+i*.15,9,.05,'sine'));note(c[0]-12,t,9,.06,'sine');
for(let k=0;k<4;k++)if(Math.random()<.8)note(pent[Math.floor(Math.random()*6)]+(Math.random()<.2?-12:0),t+k*2+Math.random()*.6,3.2,.04,'triangle')}
function start(first){if(!ctx&&!build())return;ctx.resume();on=true;master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(master.gain.value,ctx.currentTime);master.gain.linearRampToValueAtTime(.5,ctx.currentTime+3);if(!timer){sched();timer=setInterval(sched,8000)}btn.textContent='🎵';btn.classList.add('on');S('on');if(first)toast('🎵 موسيقى هادئة — اضغطي 🎵 لإيقافها')}
function stop(){on=false;if(ctx){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(master.gain.value,ctx.currentTime);master.gain.linearRampToValueAtTime(0,ctx.currentTime+1.2)}btn.textContent='🔇';btn.classList.remove('on');S('off')}
btn.onclick=()=>on?stop():start();
if(P()==='off')btn.textContent='🔇';else{const go=e=>{if(e.target.closest&&e.target.closest('#musicBtn'))return;removeEventListener('pointerdown',go);removeEventListener('keydown',go);start(true)};addEventListener('pointerdown',go);addEventListener('keydown',go)}
document.addEventListener('visibilitychange',()=>{if(!ctx||!on)return;document.hidden?ctx.suspend():ctx.resume()})})();
