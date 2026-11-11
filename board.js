/* A local exhibition board. Only explicitly kept, processed copies are stored. */
(function(root){'use strict';
class VisitorMemory{
 constructor(storage){this.key='becoming-data.visitors.v1';this.limit=64;this.persisted=true;try{this.storage=storage===undefined?root.localStorage:storage;}catch{this.storage=null;}this.items=[];this.read();}
 read(){try{const raw=this.storage?.getItem(this.key);const parsed=raw?JSON.parse(raw):[];this.items=Array.isArray(parsed)?parsed.filter(v=>v&&typeof v.id==='string'&&typeof v.url==='string'&&/^data:image\/png;base64,/.test(v.url)&&typeof v.printUrl==='string'&&/^data:image\/png;base64,/.test(v.printUrl)&&Number.isInteger(v.number)).slice(0,this.limit):[];this.persisted=!!this.storage;}catch{this.items=[];this.persisted=false;}return this.items;}
 persist(){try{if(!this.storage)throw new Error('Storage unavailable');this.storage.setItem(this.key,JSON.stringify(this.items));this.persisted=true;}catch{this.persisted=false;}return this.persisted;}
 upsert(id,item){const index=this.items.findIndex(v=>v.id===id);if(index<0&&this.items.length>=this.limit)return {ok:false,persisted:this.persisted};const number=index<0?Math.max(0,...this.items.map(v=>v.number))+1:this.items[index].number,record={id,number,name:String(item.name).slice(0,40),url:item.headUrl,printUrl:item.url,createdAt:Date.now(),tilt:(number*17%13)-6};if(index<0)this.items.push(record);else this.items[index]=record;return {ok:true,persisted:this.persist()};}
 remove(id){this.items=this.items.filter(v=>v.id!==id);this.persist();}
 clear(){this.items=[];try{this.storage?.removeItem(this.key);this.persisted=!!this.storage;}catch{this.persisted=false;}}
}
function createHead(image,fit={x:0,y:0,size:120}){const c=root.document.createElement('canvas');c.width=128;c.height=156;const x=c.getContext('2d'),scale=100/(fit.size||120),w=Math.min(1,.84*scale),h=Math.min(1,.96*scale),cx=.5+(fit.x||0)/100,cy=.45+(fit.y||0)/100,sx=Math.max(0,Math.min(1-w,cx-w/2)),sy=Math.max(0,Math.min(1-h,cy-h/2));x.beginPath();x.moveTo(64,2);x.bezierCurveTo(17,2,5,27,7,75);x.bezierCurveTo(9,116,32,151,64,154);x.bezierCurveTo(96,151,119,116,121,75);x.bezierCurveTo(123,27,111,2,64,2);x.closePath();x.clip();x.imageSmoothingEnabled=true;x.drawImage(image,sx*image.width,sy*image.height,w*image.width,h*image.height,0,0,128,156);return c.toDataURL('image/png');}
root.VisitorMemory=VisitorMemory;root.createVisitorHead=createHead;
})(typeof window==='undefined'?globalThis:window);
