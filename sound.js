/* Original, browser-synthesized game sound effects. No external audio assets. */
(function(root){'use strict';
class GameAudio{
 constructor(Context){this.Context=Context||root.AudioContext||root.webkitAudioContext;this.enabled=false;this.volume=.55;this.ctx=null;this.master=null;this.voices=new Set();this.lastHover=-Infinity;this.lastSlider=-Infinity;this.lastStep=-Infinity;this.lastPosition=null;this.distance=0;this.foot=0;this.paused=false;}
 enable(value){if(!value){this.enabled=false;this.stop();if(this.master)this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.012);return false;}if(!this.Context)return false;try{if(!this.ctx){this.ctx=new this.Context();this.master=this.ctx.createGain();const limiter=this.ctx.createDynamicsCompressor();limiter.threshold.value=-19;limiter.knee.value=14;limiter.ratio.value=4;limiter.attack.value=.003;limiter.release.value=.12;this.master.connect(limiter);limiter.connect(this.ctx.destination);this.noise=this.ctx.createBuffer(1,Math.ceil(this.ctx.sampleRate*.6),this.ctx.sampleRate);const data=this.noise.getChannelData(0);let seed=7919;for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647*2-1);}}
 this.enabled=true;this.master.gain.setTargetAtTime(this.volume*.45,this.ctx.currentTime,.018);this.resume();return true;}catch{this.enabled=false;return false;}}
 resume(){if(this.enabled&&this.ctx?.state==='suspended')this.ctx.resume().catch(()=>{});}
 setVolume(value){this.volume=Math.max(0,Math.min(1,Number(value)));if(this.master)this.master.gain.setTargetAtTime(this.enabled?this.volume*.45:0,this.ctx.currentTime,.02);if(!this.volume)this.stop();}
 stop(group){for(const v of [...this.voices])if(!group||v.group===group){try{v.gain.gain.cancelScheduledValues(this.ctx.currentTime);v.gain.gain.setTargetAtTime(.00001,this.ctx.currentTime,.005);v.node.stop(this.ctx.currentTime+.025);}catch{}this.voices.delete(v);}this.lastPosition=null;this.distance=0;}
 suspend(){this.stop();if(this.ctx?.state==='running')this.ctx.suspend().catch(()=>{});}
 setPaused(value){this.paused=value;if(value)this.stop();}
 ready(){return this.enabled&&this.volume>0&&this.ctx&&this.ctx.state!=='closed';}
 voice(node,when,duration,level,group='ui',filter=null){if(!this.ready())return;while(this.voices.size>=48){const oldest=this.voices.values().next().value;try{oldest.node.stop();}catch{}this.voices.delete(oldest);}const gain=this.ctx.createGain(),start=this.ctx.currentTime+Math.max(0,when),end=start+duration;gain.gain.setValueAtTime(.00001,start);gain.gain.exponentialRampToValueAtTime(Math.max(.00002,level),start+Math.min(.008,duration*.2));gain.gain.exponentialRampToValueAtTime(Math.max(.00002,level*.42),start+duration*.58);gain.gain.exponentialRampToValueAtTime(.00001,end);if(filter){node.connect(filter);filter.connect(gain);}else node.connect(gain);gain.connect(this.master);const v={node,gain,group};this.voices.add(v);node.onended=()=>{this.voices.delete(v);try{node.disconnect();gain.disconnect();filter?.disconnect();}catch{}};node.start(start);node.stop(end+.02);return start;}
 tone(frequency,duration=.1,when=0,type='triangle',level=.17,endFrequency=null,group='ui'){if(!this.ready())return;const o=this.ctx.createOscillator();o.type=type;const start=this.ctx.currentTime+when;o.frequency.setValueAtTime(frequency,start);if(endFrequency)o.frequency.exponentialRampToValueAtTime(Math.max(20,endFrequency),start+duration);this.voice(o,when,duration,level,group);}
 hiss(duration=.1,when=0,frequency=1800,level=.12,kind='bandpass',group='ui'){if(!this.ready())return;const b=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter();b.buffer=this.noise;b.loop=true;filter.type=kind;filter.frequency.value=frequency;filter.Q.value=.7;this.voice(b,when,duration,level,group,filter);}
 notes(notes,step=.075,type='triangle',level=.15,group='ui',start=0){notes.forEach((f,i)=>this.tone(f,step*1.55,start+i*step,type,level,null,group));}
 play(name){if(!this.ready())return;this.resume();const now=this.ctx.currentTime;
 if(name==='hover'){if(now-this.lastHover<.09)return;this.lastHover=now;this.tone(950,.035,0,'sine',.035,1200);}
 else if(name==='click'){this.tone(340,.075,0,'triangle',.14,720);this.tone(1050,.045,.035,'sine',.07,750);}
 else if(name==='collect'){this.notes([659.25,830.61,987.77,1318.51],.075,'square',.11);this.tone(1975.5,.24,.27,'sine',.09);}
 else if(name==='power'){this.notes([220,330,440,659.25],.085,'triangle',.15);}
 else if(name==='move'){this.tone(210,.11,0,'sine',.09,430);}
 else if(name==='avatar'){this.notes([523.25,659.25,783.99,659.25],.055,'triangle',.13);}
 else if(name==='shutter'){this.hiss(.055,0,2600,.22,'highpass');this.tone(160,.075,.02,'triangle',.16,85);this.hiss(.045,.11,3500,.1,'highpass');}
 else if(name==='disk'){this.tone(115,.15,0,'sawtooth',.08,170);this.notes([587.33,880],.085,'sine',.13,'ui',.17);}
 else if(name==='printer'){for(let i=0;i<9;i++){this.hiss(.04,i*.065,950+i%3*300,.07);this.tone(150+i%2*70,.045,i*.065,'square',.04);}this.notes([440,659.25],.09,'triangle',.09,'ui',.65);}
 }
 select(mode){if(!this.ready())return;this.stop('machine');const notes={svd:[440,330,220],fft:[330,660,990],sort:[392,494,587],bits:[523,784,1046],mosh:[185,311,147],flow:[440,659,587],rock:[147,196,220]};this.notes(notes[mode]||notes.sort,.065,'triangle',.12);if(mode==='mosh')this.hiss(.08,0,2100,.06);}
 slider(amount,mode){if(!this.ready())return;const now=this.ctx.currentTime;if(now-this.lastSlider<.075)return;this.lastSlider=now;const f=mode==='bits'?220*Math.pow(2,Math.floor(amount/100*8)/6):250+amount*7;this.tone(f,.045,0,mode==='bits'?'square':'sine',.065);}
 process(mode){if(!this.ready())return;this.stop('machine');if(this.paused){this.notes([440,659],.08,'triangle',.1);return;}const g='machine';
 if(mode==='svd'){[660,550,440,330,220].forEach((f,i)=>{this.tone(f,.25,i*.28,'triangle',.11,f*.94,g);this.hiss(.055,i*.28,1800,.045,'bandpass',g);});}
 else if(mode==='fft'){this.tone(140,.9,0,'sine',.12,1200,g);this.tone(1200,.85,.85,'sine',.09,220,g);this.notes([330,660,990],.09,'sine',.08,g,.35);}
 else if(mode==='sort'){this.notes([196,220,247,294,330,392,440,494,587,659],.11,'square',.065,g);this.hiss(.65,.5,2200,.07,'bandpass',g);}
 else if(mode==='bits'){this.notes([262,523,392,784,523,1047,784,1568],.14,'square',.085,g);for(let i=0;i<6;i++)this.hiss(.025,.08+i*.19,3200,.04,'highpass',g);}
 else if(mode==='mosh'){for(let i=0;i<10;i++){this.hiss(.045+i%3*.025,i*.14,650+i%4*950,.13,'bandpass',g);this.tone(70+i%3*90,.09,i*.14,'sawtooth',.07,40+i%2*45,g);}}
 else if(mode==='flow'){[392,587,784,523,880,659].forEach((f,i)=>this.tone(f,.24,i*.22,'sine',.13,f*1.5,g));this.hiss(1.5,0,650,.07,'lowpass',g);}
 else if(mode==='rock'){this.hiss(1.5,0,340,.2,'lowpass',g);for(let i=0;i<5;i++){this.tone(110-i*9,.13,i*.26,'triangle',.13,45,g);this.hiss(.09,i*.26,1000,.09,'bandpass',g);}}
 this.notes([523.25,783.99],.11,'triangle',.12,g,1.85);
 }
 step(x,z,paused=false){if(!this.ready()||paused){this.lastPosition={x,z};this.distance=0;return;}if(this.lastPosition)this.distance+=Math.hypot(x-this.lastPosition.x,z-this.lastPosition.z);this.lastPosition={x,z};const now=this.ctx.currentTime;if(this.distance<.27||now-this.lastStep<.19)return;this.distance=0;this.lastStep=now;this.foot++;this.hiss(.045,0,this.foot%2?1300:1700,.08,'bandpass','steps');this.tone(this.foot%2?135:155,.045,0,'sine',.11,65,'steps');}
}
root.GameAudio=GameAudio;
})(typeof window==='undefined'?globalThis:window);
