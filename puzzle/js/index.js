var fn = {
    ran: function ran(n, m) {
        return Math.round(Math.random() * (m - n) + n);
    },
    processThis: function processThis(fn, obj) {
        return function (e) {
            fn.call(obj,e);
        }
    }
};
function BindEvent() {}
BindEvent.prototype.on = function (ele, type, fn) {
    if (ele.addEventListener) {
        ele.addEventListener(type, fn, false);
    }
    if (!ele["aEvent" + type]) {
        ele["aEvent" + type] = [];
    }
    var a = ele["aEvent" + type];
    for (var i = 0, len = a.length; i < len; i++) {
        if (a[i] == fn) {
            return;
        }
    }
    a.push(fn);
};
BindEvent.prototype.run = function (e, type) {
    e = e || window.event;
    type = type || e.type;
    if (!e.target) {
        e.target = e.srcElement;
        e.pageX = (document.documentElement.scrollLeft || document.body.scrollLeft) + e.clientX;
        e.pageY = (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
        e.stopPropagation = function () {
            e.cancelBubble = true
        };
        e.preventDefault = function () {
            e.returnValue = false;
        }
    }
    var a = this.ele["aEvent" + type];
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (typeof a[i] == "function") {
                a[i].call(this, e);
            } else {
                a.splice(i, 1);
                i--;
            }
        }
    }
};
BindEvent.prototype.off = function (ele, type, fn) {
    if (ele.removeEventListener) {
        ele.removeEventListener(type, fn, false);
    }
    ;
    var a = ele["aEvent" + type];
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] == fn) {
                a[i] = null;
                i--;
                break;
            }
        }
    }
};
function Drag(ele) {
    this.mx = this.my = this.y = this.x = null;
    this.ele = ele;
    this.DOWN = fn.processThis(this.down, this);//this上的down;
    this.MOVE = fn.processThis(this.move, this);
    this.UP = fn.processThis(this.up, this);
    this.on(this.ele, "mousedown", this.DOWN);
    var spans=[];
};
Drag.prototype.__proto__ = BindEvent.prototype;
Drag.prototype.down = function (e) {
    e = e || window.event;
    this.x = this.ele.offsetLeft;
    this.y = this.ele.offsetTop;
    this.mx = e.pageX;
    this.my = e.pageY;
    this.l = this.x;
    this.t = this.y;
    this.ele.style.zIndex = 10;
    if (this.ele.setCapture) {
        this.ele.setCapture();
        this.on(this.ele, "mousemove", this.MOVE);
        this.on(this.ele, "mouseup", this.UP);
    } else {
        this.on(document, "mousemove", this.MOVE);
        this.on(document, "mouseup", this.UP);
    }
    e.preventDefault();
    this.run(e, "star");
    this.on(this.ele, "isHit", this.isHit);
};
Drag.prototype.move = function (e) {
    e = e || window.event;
    this.left = this.x + (e.pageX - this.mx);
    this.top = this.y + (e.pageY - this.my);
    this.ele.style.left = this.x + (e.pageX - this.mx) + "px";
    this.ele.style.top = this.y + (e.pageY - this.my) + "px";
    //this.run(e,"moving");
    this.run(e, "resetMove");
};
Drag.prototype.up = function (e) {
    e=e||window.event;
    this.ele.style.zIndex = 0;
    if (this.ele.releaseCapture) {
        this.ele.releaseCapture();
        this.off(this.ele, "mousemove", this.MOVE);
        this.off(this.ele, "mouseup", this.UP);
    } else {
        this.off(document, "mousemove", this.MOVE);
        this.off(document, "mouseup", this.UP);
    }
    this.run(e, "end");
    this.run(e, "isHit");
};
Drag.prototype.range = function (oRange) {
    this.oRange = oRange;
    this.on(this.ele, "resetMove", this.addRange);
};
Drag.prototype.addRange = function (e) {
    e=e||window.event;
    var oRange = this.oRange;
    var valX = this.left;
    var valY = this.top;
    if (valX >= oRange.right) {
        valX = oRange.right;
    } else if (valX <= oRange.left) {
        valX = oRange.left;
    }
    this.ele.style.left = valX + "px";
    if (valY >= oRange.bottom) {
        valY = oRange.bottom;
    } else if (valY <= oRange.top) {
        valY = oRange.top;
    }
    this.ele.style.top = valY + "px";
};
Drag.prototype.isHit = function (e) {
    var pos = document.getElementById("pos");
    pos.posLeft = pos.offsetLeft;
    pos.posTop = pos.offsetTop;
    var _true=(Math.abs(this.x + this.ele.offsetWidth - pos.posLeft)<5 && Math.abs(this.y - pos.offsetTop)<5)||(Math.abs(this.y + this.ele.offsetHeight- pos.offsetTop)<5 && Math.abs(this.x -pos.offsetLeft)<5)||(Math.abs(this.x - this.ele.offsetWidth - pos.posLeft)<5 && Math.abs(this.y - pos.offsetTop)<5)||(Math.abs(this.y - this.ele.offsetHeight- pos.offsetTop)<5 && Math.abs(this.x -pos.offsetLeft)<5);
    if (_true) {
        this.ele.style.left = pos.posLeft + "px";
        this.ele.style.top = pos.posTop + "px";
        pos.style.left = this.x + "px";
        pos.style.top = this.y + "px";
    }
    else {
        this.ele.style.left = this.x + "px";
        this.ele.style.top = this.y + "px";
    };
    this.run(e,"aSuccess");
};
var render = (function () {
    var conImg = document.getElementById("conImg"),
        conImgWidth=conImg.clientWidth,
        conImgHeight=conImg.clientHeight;
    var sample = document.getElementById("sample");
    var select = document.getElementById("select");
    var selects = document.getElementById("selects");
    var selectsP = document.getElementsByClassName("selects-p");
    var fileImg = document.getElementById("fileImg");
    var prompt = document.getElementById("prompt");
    var sampleRight = sample.clientWidth;
    var sampleBottom = sample.clientHeight;
    var nIndex=null;
    var isUrl=null;
    var spans = "";
    var spanImg = [];
    function numData(n) {
        var arr = [];
        for (var i = 0; i <=n ; i++) {
            var num = fn.ran(0, n - 1);
            var boo = arr.filter(function (index) {
                return index == num;
            });
            if (boo.length == 0) {
                arr.push(num);
            }
            i = arr.length;
        }
        return arr;
    };
    function aSuccess(){
        var _true=spanImg.filter(function(item){
            var _left= Math.abs(parseFloat(item.style.left));
            var _top= Math.abs(parseFloat(item.style.top));
            var _X= Math.abs(parseFloat(item.style.backgroundPositionX));
            var _Y= Math.abs(parseFloat(item.style.backgroundPositionY));
            if(_left!=_X||_top!=_Y){
                return item;
            }
        });
        if(_true.length==0){
            prompt.innerHTML="拼图成功";
            promptO();
        }
    };
    function promptO(){
        prompt.style.lineHeight="40px";
        window.setTimeout(function(){
            prompt.style.lineHeight=0;
        },3000);
    }
    function inn(n) {
        n = n ? n :9;
        nIndex=n;
        var nSqrt=Math.sqrt(n);
        var num=0;
        var position=[];
        for (var i = 0; i < n - 1; i++) {
            spans += "<span></span>";
        }
        spans += "<span id='pos'></span>";
        conImg.innerHTML = spans;
        var spansClass = conImg.getElementsByTagName("span");
        var pos = document.getElementById("pos");
        for (var j=0;j<=nSqrt;j++){
            if(j==nSqrt){
                if(num==nSqrt-1){
                    continue;
                }
                num++;
                j=-1;
            }else{
                position.push({left:j*(conImgWidth/nSqrt),top:num*(conImgHeight/nSqrt)});
            }
        };
        var arr=numData(spansClass.length-1);
        for (i = n - 2; i >= 0; i--) {
            var span = spansClass[i];
            if(isUrl){
                span.style.background = "url(" + isUrl + ")";
            }
            span.style.left=position[arr[i]].left+"px";
            span.style.top=position[arr[i]].top+"px";
            span.style.width=conImgWidth/nSqrt+"px";
            span.style.height=conImgHeight/nSqrt+"px";
        }
        pos.style.width=conImgWidth/nSqrt+"px";
        pos.style.height=conImgHeight/nSqrt+"px";
        pos.style.left="auto";
        pos.style.top="auto";
        pos.style.bottom="0";
        pos.style.right="0";
        arr=numData(spansClass.length-1);
        for (i = n - 2; i >= 0; i--) {
           span = spansClass[i];
            span.style.backgroundSize=nSqrt+"00% "+nSqrt+"00%";
            span.style.backgroundPosition="-"+position[arr[i]].left+"px -"+position[arr[i]].top+"px";
            var spanOn = new Drag(span);
            spanOn.on(span, "start");
            spanOn.range({
                left: 0,
                top: 0,
                right: sampleRight - span.offsetWidth,
                bottom: sampleBottom - span.offsetHeight
            });
            spanOn.n = n;
            spanImg.push(span);
            spanOn.on(span,"aSuccess",aSuccess);
        }
        spans = "";
        arr = [];
    };
    function showImg(file) {
        if (!file)return;
        var size = Math.floor(file.size / 1024);
        var type = file.type;
        if (!/image\//.test(type)) {
            return false;
        }
        if (size > 1000) {
            return false;
        }
        if (typeof  FileReader == "undefined") {
            alert("该浏览器不支持FileReader接口");
        } else {
            var render = new FileReader();
            render.readAsDataURL(file);
            render.onload = function () {
                isUrl=this.result;
                spanImg.map(function (item) {
                    var nSqrt=Math.sqrt(nIndex);
                    var positionX = item.style.backgroundPositionX;
                    var positionY = item.style.backgroundPositionY;
                    item.style.background = "url(" + isUrl + ")";
                    item.style.backgroundSize = nSqrt+"00% "+nSqrt+"00%";
                    item.style.backgroundPositionX = positionX;
                    item.style.backgroundPositionY = positionY;
                });
            };
        }
    };
    return {
        init: function () {
            var begin = document.getElementById("begin");
            begin.onclick = function () {
                window.clearTimeout(time);
                var _file = fileImg.files;
                if (_file.length) {
                    if(!this.success){
                        this.success=true;
                        prompt.innerHTML="上传成功";
                        promptO();
                    }
                    for (var i = 0; i < _file.length; i++) {
                        showImg(_file[i]);
                        if(nIndex){inn(nIndex);}else(inn(9));
                    }
                }else{
                    if(nIndex){inn(nIndex);}else(inn(9));
                }

            };
            select.onclick=function (){
                selects.style.display="block";
            };
            conImg.ondragenter=function (){
                prompt.innerHTML="放开我";
                promptO();
            };
            conImg.ondragover=function (e){
                e.preventDefault();
            };
            conImg.ondrop=function (e){
                prompt.innerHTML="变脸给你看!";
                promptO();
                e.preventDefault();
                var _file=e.dataTransfer.files;
                console.log(_file);
                for (var i = 0; i < _file.length; i++) {
                    showImg(_file[i]);
                    if(nIndex){inn(nIndex);}else(inn(9));
                }
            };
            for(var i=0;i<selectsP.length;i++){
                selectsP[i].onclick=function(){
                    var diff=this.innerHTML;
                    if(diff=="简单"){
                        inn(9);
                    }else if(diff=="一般"){
                        inn(16);
                        select.innerHTML=diff;
                    }else if(diff=="困难"){
                        inn(25);
                        select.innerHTML=diff;
                    };
                    selects.style.display="none";
                };
            }
            var time = window.setTimeout(function () {
                inn(9)
            }, 1000);
            //inn(9);
        }
    }
})();
render.init();

