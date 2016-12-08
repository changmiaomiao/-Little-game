var fn = {
    ran: function ran(n, m) {
        return Math.round(Math.random() * (m - n) + n);
    },
    processThis: function processThis(fn, obj) {
        return function (e) {
            fn.call(obj);
        }
    }
};
function BindEvent() {
}
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
Drag.prototype.isHit = function () {
    var pos = document.getElementById("pos");
    pos.posLeft = pos.offsetLeft;
    pos.posTop = pos.offsetTop;
    var _true = (this.x + this.ele.offsetWidth == pos.posLeft && this.y == pos.offsetTop) || (this.y + this.ele.offsetHeight == pos.offsetTop && this.x == pos.offsetLeft) || (this.x - this.ele.offsetWidth == pos.posLeft && this.y == pos.offsetTop) || (this.y - this.ele.offsetHeight == pos.offsetTop && this.x == pos.posLeft)
        ;
    if (_true) {
        this.ele.style.left = pos.posLeft + "px";
        this.ele.style.top = pos.posTop + "px";
        pos.style.left = this.x + "px";
        pos.style.top = this.y + "px";
    }
    else {
        this.ele.style.left = this.x + "px";
        this.ele.style.top = this.y + "px";
    }
    ;
};
var render = (function () {
    var conImg = document.getElementById("conImg");
    var sample = document.getElementById("sample");
    var fileImg = document.getElementById("fileImg");
    var sampleLeft = sample.offsetLeft;
    var sampleTop = sample.offsetTop;
    var sampleRight = sample.clientWidth;
    var sampleBottom = sample.clientHeight;
    var spans = "";
    var arr = [];
    var spanImg = [];
    var fileTrue = false;
    var clickNum = 0;
    function numData(n) {
        n = n ? 9 : n;
        for (var i = 0; i <= (n - 1); i++) {
            var num = fn.ran(1, n - 1);
            var boo = arr.filter(function (index) {
                return index == num;
            });
            if (boo.length == 0) {
                arr.push(num);
            }
            i = arr.length;
        }
    };
    function inn(n) {
        n = n ? 9 : n;
        numData(n);
        for (var i = 0; i < n - 1; i++) {
            spans += "<span class='img" + arr[i] + "'></span>";
        }
        spans += "<span id='pos'></span>";
        conImg.innerHTML = spans;
        var spansClass = conImg.getElementsByTagName("span");
        for (i = n - 2; i >= 0; i--) {
            var span = spansClass[i];
            span.classList[1] = " pos" + i;
            span.className = span.classList[0] + " " + span.classList[1];
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
        }
        spans = "";
        arr = [];
    };
    function showImg(file) {
        if (!file)return;
        var name = file.name;
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
                var _that = this.result;
                spanImg.map(function (item) {
                    var positionX = item.style.backgroundPositionX;
                    var positionY = item.style.backgroundPositionY;
                    item.style.background = "url(" + _that + ")";
                    item.style.backgroundSize = "300% 300%";
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
                        window.alert("上传成功");
                    }
                    for (var i = 0; i < _file.length; i++) {
                        showImg(_file[i]);
                        inn(9);
                    }
                }else{
                    inn(9);
                }

            };
            fileImg.onclick = function () {

            };
            var time = window.setTimeout(function () {
                inn(9)
            }, 1000);
            //inn(9);
        }
    }
})();
render.init();

