(function(_0xabc,_0xdef){const _0xghi=_0x1234;while(!![]){try{const _0xsum=parseInt(_0xghi(0x1a))/1+parseInt(_0xghi(0x1b))/2;if(_0xsum===_0xdef)break;else _0xabc.push(_0xabc.shift());}catch(_0xerr){_0xabc.push(_0xabc.shift());}}}(_0x5678,0x12f));

function _0x1234(_0xaaa,_0xbbb){
    const _0xarr=_0x5678();
    return _0x1234=function(_0xccc,_0xddd){
        _0xccc=_0xccc-0x190;
        let _0xval=_0xarr[_0xccc];
        return _0xval;
    },_0x1234(_0xaaa,_0xbbb);
}

(function(){

/* 🔒 Anti Debug */
(function(){
    function _0xdev(){
        const _0xstart=Date.now();
        debugger;
        if(Date.now()-_0xstart>100) location.reload();
    }
    setInterval(_0xdev,1000);
})();

/* 🔒 Disable Console */
(function(){
    const _0xf=function(){};
    console.log=_0xf;
    console.warn=_0xf;
    console.error=_0xf;
    console.info=_0xf;
})();

/* 🔒 String Decoder */
function _0xd(_0xs){
    try{return atob(_0xs);}catch{return _0xs;}
}

/* 🔒 Self Defending */
(function(){
    const _0xfn=function(){return 'secure';};
    if(_0xfn.toString().length<20) location.reload();
})();

/* 🔒 Main */
if(window[_0xd("YXV0b0J1eWVyUnVubmluZw==")])return;
window[_0xd("YXV0b0J1eWVyUnVubmluZw==")]=true;

(async function(){

function _0xuid(){
    for(let _0xk of Object.keys(localStorage)){
        try{
            let _0xv=localStorage.getItem(_0xk);
            if(!_0xv)continue;
            try{
                let _0xo=JSON.parse(_0xv);
                if(_0xo?.memberId)return String(_0xo.memberId).trim();
                if(_0xo?.value?.memberId)return String(_0xo.value.memberId).trim();
            }catch{}
        }catch{}
    }
    return null;
}

const _0xuser=_0xuid();

if(!_0xuser){
    alert(_0xd("QWNjZXNzIERlbmllZCDinaE="));
    window.autoBuyerRunning=false;
    return;
}

try{
    const _0xres=await fetch(_0xd("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1NoaWJkYXMxMjMvQUNML21haW4vYWNjZXNzLmpzb24=")+"?t="+Date.now());
    const _0xdata=await _0xres.json();

    const _0xallowed=_0xdata.allowedUIDs.map(x=>String(x).trim());

    if(!_0xallowed.includes(_0xuser)){
        alert(_0xd("QWNjZXNzIERlbmllZCDinaE="));
        window.autoBuyerRunning=false;
        return;
    }

    alert(_0xd("QWNjZXNzIEdyYW50ZWQg4pyF"));
    _0xstart();

}catch{
    alert(_0xd("QWNjZXNzIGNoZWNrIGZhaWxlZCDinaE="));
    window.autoBuyerRunning=false;
}

})();

function _0xstart(){

let _0xrun=false,_0xtarget=1000,_0xlast="",_0xtime=0,_0xaudio=null,_0xint=null;

function _0xalarm(){
    if(_0xint)return;
    _0xint=setInterval(()=>{
        try{
            _0xaudio=new Audio(_0xd("aHR0cHM6Ly9hY3Rpb25zLmdvb2dsZS5jb20vc291bmRzL3YxL2FsYXJtcy9hbGFybV9jbG9jay5vZ2c="));
            _0xaudio.volume=1;
            _0xaudio.play();
        }catch{}
    },1200);
}

function _0xstop(){
    if(_0xint){clearInterval(_0xint);_0xint=null;}
    if(_0xaudio){_0xaudio.pause();_0xaudio.currentTime=0;}
}

function _0xsig(){
    return (document.body.innerText||"").slice(0,300);
}

new MutationObserver(()=>{
    if(!_0xrun)return;
    let _0xn=Date.now(),_0xc=_0xsig();
    if(_0xc!==_0xlast && Math.abs(_0xc.length-_0xlast.length)>50 && _0xn-_0xtime>4000){
        _0xlast=_0xc;_0xtime=_0xn;
        _0xalarm();
        setTimeout(_0xstop,4000);
    }
}).observe(document.body,{childList:true,subtree:true});

function _0xclick(el){
    try{
        const k=Object.keys(el).find(x=>x.startsWith("__reactProps"));
        if(k && el[k]?.onClick) el[k].onClick({target:el});
        else el.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    }catch{el.click();}
}

function _0xdef(){
    return Array.from(document.querySelectorAll("div,button")).find(el=>el.innerText.trim()==="Default");
}

function _0xamt(t){
    let m=t.match(/₹\s?(\d+(\.\d+)?)/);
    return m?parseFloat(m[1]):null;
}

function _0xscan(){
    for(let r of document.querySelectorAll("div")){
        let t=r.innerText||"",a=_0xamt(t);
        if(a!==null && a===Number(_0xtarget)){
            let b=Array.from(r.querySelectorAll("button")).find(x=>/buy/i.test(x.innerText));
            if(b){_0xclick(b);return true;}
        }
    }
    return false;
}

function _0xloop(){
    if(!_0xrun)return;
    let d=_0xdef();
    if(d)_0xclick(d);
    setTimeout(()=>{
        _0xscan();
        setTimeout(_0xloop,250);
    },120);
}

let p=document.createElement("div");
p.style="position:fixed;bottom:20px;right:20px;background:#000;color:#0f0;padding:10px;z-index:999999;";
p.innerHTML=`<input id="amt" value="1000"><button id="s">Start</button><button id="x">Stop</button>`;
document.body.appendChild(p);

document.getElementById("s").onclick=()=>{
    _0xtarget=Number(document.getElementById("amt").value);
    _0xrun=true;
    _0xlast=_0xsig();
    _0xloop();
};

document.getElementById("x").onclick=()=>{
    _0xrun=false;
    _0xstop();
};

}

})();

function _0x5678(){
    return ['dummy','values','for','shift','logic'];
          }
