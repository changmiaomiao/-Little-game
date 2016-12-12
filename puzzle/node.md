### 1.事件e忘了传递
```
processThis: function processThis(fn, obj) {
        return function (e) {
            fn.call(obj,e);
        }
    }
```
> 结果

- 在火狐上,e is undefined;并且火狐浏览器(49.0.2)的没有window.event;

> 遇到问题
- 当选择高度为510时拖拽移动时,第二排的不能向第三排空白处移;
```
原因:
总高度高度为510时,4*4的高度时每块的高度为是127.5;
第二排距离上面的top值为128;
第三排距离上面的top值为255;
128+127.5=255.5不等于255;
this.y + this.ele.offsetHeight != pos.offsetTop

```
