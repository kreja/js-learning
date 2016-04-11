'use strict';
require('./index.less');

var _ = require('underscore');
var dom = require('../../mods/dom.js');
var printToDom = dom.print;
var printDivider = dom.printDivider.bind(dom);


/////////
// 模拟 动态作用域
// 一张查找表存储绑定
// 维护一个命名绑定栈的全局映射
/////////
printDivider('模拟 动态作用域');
var globals = {}; // 全局查找表
function makeBindFun(resolver){
    return function(k, v){
        var stack = globals[k] || [];
        globals[k] = resolver(stack, v);
        return globals;
    };
}
var stackBinder = makeBindFun(function(stack, v){
    stack.push(v);
    return stack;
});
var stackUnbinder = makeBindFun(function(stack, v){
    stack.pop();
    return stack;
});
var dynamicLookup = function(k){
    var slot = globals[k] || [];
    printToDom(_.last(slot));
    return _.last(slot);
};
stackBinder('a', 1);
stackBinder('b', 2);
dynamicLookup('a');
printToDom(JSON.stringify(globals));
stackUnbinder('a');
dynamicLookup('a');
printToDom(JSON.stringify(globals));



/////////
// 作用域 this bind //
/////////
printDivider('作用域 this bind');
function gThis(){
    printToDom(this);
    return this;
}

gThis();
gThis.call('jack');
gThis.apply(null, []);

var bindThis = _.bind(gThis, 'bThis');
gThis.call('jack'); // 没有绑定， this 就指向 jack 了
bindThis.call('jack'); // 已经绑定了，所以  this 指向 bThis 不会变了




/////////
// bindAll //
/////////
printDivider('This');
var target = {
    name: 'im right',
    aux: function(){
        printToDom(this.name);
        return this.name;
    },
    act: function(){
        return this.aux();
    }
};
// target.act.call('wat'); // index.js:154 Uncaught TypeError: this.aux is not a function   因为 this 指向 'wat' 而它没有 aux 这个方法
_.bindAll(target, 'aux', 'act'); // aux act 中的 this 绑定到 target 上，不会被改变
target.act.call('wat');




/////////
// 函数作用域模拟 //
/////////
printDivider('函数作用域模拟');
function count(n){
    // this['i'] 就是在函数作用域中，这就是对函数作用域的模拟
    for(this['i']=0; this['i']<n; this['i']++);
    printToDom(this['i']);
    return this['i'];
}
// a.count(66);
count.call(window, 66); // 改变了全局变量 this['i']，不要，应该用暂存控件代替
printToDom('window.i 变成了', window.i);

printDivider('函数作用域模拟-暂存空间');
count.call({}, 6); // 用 {}，就不会改变全局变量了，而 {} 只是一个临时值，但是这样为了传递上下文就造一个空对象也不好
printToDom('window.i 没有改变，还是', window.i);

printDivider('函数作用域模拟-clone');
count.call(_.clone(window), 8); // 不只是 window，只要是不想被改变的对象，但又需要用到里面的值，都可以 clone 一个新对象
printToDom('window.i 没有改变，还是', window.i);




/////////
// 闭包 //
/////////
printDivider('闭包');
function showObj(OBJ){
    return function(){
        printToDom(JSON.stringify(OBJ));
        return OBJ;
    };
}
var o = {a: 1};
var showA = showObj(o);
showA();
o.b = 2; // 改变结果，因为闭包中的变量和 o 指向的是同一个对象
showA();
o = {a: 1, b:3}; // 不改变结果，这是让 o 指向别的对象，所以以后 o 就跟闭包中的变量无关了
showA();
