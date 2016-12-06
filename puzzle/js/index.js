var fn={
    ran:function ran(n, m) {
        return Math.round(Math.random() * (m - n) + n);
    },
    on:function on(ele, type, fn) {
        if (ele.addEventListener) {
            ele.addEventListener(type, fn, false);
            return;
        }
        if (!ele["aEvent" + type]) {
            ele["aEvent" + type] = [];
            ele.attachEvent("on" + type, function () {
                run.call(ele);
            });
        }
        var a = ele["aEvent" + type];
        if (a && a.length) {
            for (var i = 0, len = a.length; i < len; i++) {
                if (a[i] == fn) {
                    return
                }
            }
            a.push(fn);
        }

    },
    run:function run(e) {
        e = e || window.event;
        var type = e.type;
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
        var a = this["aEvent" + type];
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
    },
    off:function off(ele, type, fn) {
        if (ele.removeEventListener) {
            ele.removeEventListener(type, fn, false);
            return;
        };
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
    },
    processThis:function processThis(fn, obj) {
        return function (e) {
            fn.call(obj);
        }
    }
};
var render = (function () {
    var conImg = document.getElementById("conImg");
    var spans = "";
    var arr = [];
    function numData(n) {
        n = n ? 9 : n;
        for (var i = 0; i <= (n - 1); i++) {
            var num = fn.ran(1, n - 1);
            var boo = arr.filter(function (index) {
                return index == num;
            });
            //console.log(boo,arr);
            if (boo.length == 0) {
                arr.push(num);
            }
            i = arr.length;
        }
    };
    function inn(n){
        n = n ? 9 : n;
        numData(n);
        for (var i = 0; i < n - 1; i++) {
            spans += "<span class='img" + arr[i] + "'></span>";
        }
        conImg.innerHTML = spans;
        var spansClass = document.getElementsByTagName("span");
        for (i = n - 2; i >= 0; i--) {
            var span = spansClass[i];
            span.className += " pos" + i;
            fn.on(span, "mousedown", down);
        }
        spans = "";
        arr = [];
    };
    function down(e) {
        e = e || window.event;
        this.x = this.offsetLeft;
        this.y = this.offsetTop;
        this.mx = e.pageX;
        this.my = e.pageY;
        this.l = this.x;
        this.t = this.y;
        console.log(this.x,this.y);
        this.style.zIndex=10;
        if (this.setCapture) {
            this.setCapture();
            this.MOVE = move.bind(this);
            this.UP = up.bind(this);
            fn.on(document, "mousemove", this.MOVE);
            fn.on(document, "mouseup", this.UP);
        } else {
            fn.on(this, "mousemove", move);
            fn.on(this, "mouseup", up);
        }
        e.preventDefault();
    }
    function move(e) {
        e = e || window.event;
        this.left=this.x + (e.pageX - this.mx);
        this.top=this.y + (e.pageY - this.my);
        if(this.left==0&&this.left==480){
            console.log("1");
        }else if(this.top==0&&this.left==340){
            console.log("2");
        }
        this.style.left = this.x + (e.pageX - this.mx) + "px";
        this.style.top = this.y + (e.pageY - this.my) + "px";
    }
    function up() {
        this.style.zIndex=0;
        if (this.releaseCapture) {
            this.releaseCapture();
            fn.off(this, "mousemove", this.MOVE);
            fn.off(this, "mouseup", this.UP);
        } else {
            fn.off(this, "mousemove", move);
            fn.off(this, "mouseup", up);
        }
        if(this.flag){
            this.left-=this.x;
            this.top-=this.y;
            if(this.left>100){
                this.style.left=this.l+240+"px";
                this.style.top =this.t+"px";
                return ;
            }else if(this.left<-100){
                this.style.left=this.l-240+"px";
                this.style.top =this.t+"px";
                return ;
            }else{
                if(this.top>100){
                    this.style.top=this.t+170+"px";
                    this.style.left =this.l+"px";
                }else if(this.top<-100){
                    this.style.top=this.t-170+"px";
                    this.style.left =this.l+"px";
                }else{
                    this.style.left =this.l+"px";
                    this.style.top=this.t+"px";
                }
            }
        }else{
            this.style.left =this.l+"px";
            this.style.top=this.t+"px";
        };

    }
    return {
        init: function () {
            var begin = document.getElementById("begin");
            begin.onclick = function () {
                window.clearTimeout(time);
                inn(9);
            };
            var time=window.setTimeout(function(){inn(9)},1000);
            //inn(9);
        }
    }
})();
render.init();

