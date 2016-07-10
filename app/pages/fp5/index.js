'use strict';
require('./index.less');

var _ = require('underscore');
var dom = require('../../mods/dom.js');
var printToDom = dom.print;
var printDivider = dom.printDivider.bind(dom);



/////////
// common //
/////////
function existy(x){
    return x != null;
}
function truthy(x){
    return (x !== false) && existy(x); // 注意是全等，所以 0 是 true
}
function doWhen(cond, action){
    if(truthy(cond))
        return action();
    else
        return undefined;
}
// 把元素连接起来
function cat(){
    var head = _.first(arguments);

    if(existy(head)){
        // 不能直接用 head.concat(_.rest(arguments)); 因为 arguments 是类似二维数组的
        return head.concat.apply(head, _.rest(arguments));
    }else{
        return [];
    }
}
// 把 head 加到 tail 前
function construct(head, tail){
    return cat([head], _.toArray(tail)); // 为什么要 _.toArray ？看下面注释
}
function invoker(name, method){
    return function(target){
        if(!existy(target)){
            console.warn('must provide a target');
            return ;
        }
        var targetMethod = target[name]; // 得到方法
        var args = _.rest(arguments); // 调用对象就要放到参数中，而原来的参数就是 _.rest(arguments)

        return doWhen(existy(targetMethod) && method===targetMethod, function(){
            return targetMethod.apply(target, args);
        });
    };
}




/////////
// 第五章 GO! //
/////////





/**
 * 输入 n 个函数，返回一个函数 A
 * 函数A:
 *  遍历 n 个函数，直至能成功调用为止，返回这第一个存在的值
 * @return {[type]} [description]
 */
printDivider('dispatch');
function dispatch(/*func*/){
    var funcs = _.toArray(arguments);
    var size = funcs.length; // 这个是 const，不要到下面的函数中才取值，以免每次调用都要取一遍

    return function(target /*, args*/){
        var ret = undefined;
        // var size = funcs.length; // 写在这里就每次都要取一遍，多此一举

        // 遍历 n 个函数
        for(var funcIndex=0; funcIndex<size; funcIndex++){
            var func = funcs[funcIndex];
            // 把参数放到当前函数中执行
            // construct 后就是类似 argumnets 的数组，所以这其实就是把 arguments 转化成数组
            // todo::那为毛不直接用 toArray(arguments)
            ret = func.apply(func, construct(target, _.rest(arguments)));

            if(existy(ret)) return ret;
        }

        return ret;
    };
}
// 神奇的使用！
// 场景：
//  提供了一群函数，遍历匹配到函数a，入参 b 有对应的方法 a，再执行 a(b)并结束遍历。
//  当要对不同类型的数据，执行相似的操作时，可以使用该函数，而不用考虑具体类型。（其实是默默帮你匹配到了类型）
var str = dispatch(
    invoker('toString', Array.prototype.toString), // invoker::返回一个函数a，调用对象没有该方法时执行a返回 undefined，所以如果调用对象没有该方法就会一直尝试后面的函数，直到遇到本身有的方法或者全部试完
    invoker('toString', String.prototype.toString)
);
printToDom(
    '【102】',
    str('a') //过程分析：先调用第一个 invoker 返回的函数 a，因为 'a' 是字符串，所以它没有 Array.prototype.toString 的方法，所以执行函数 a 返回 undefined；继续调用第二个 invoker 返回的函数 b， 因为 'a' 有 String.prototype.toString 的方法，所以返回执行结果 'a'
);
printToDom('【105】', str(_.range(10)));






