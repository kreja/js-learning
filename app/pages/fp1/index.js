'use strict';
require('./index.less');

// js 中 null / undefined 表示不存在
/**
 * 判断值是否存在
 * @param  {[type]} x [任意变量]
 * @return {[Boolean]}   [存在返回 true，不存在返回 false]
 */
function existy(x){
    return x != null;
}

/**
 * 是否是 true 的同义词
 * @param  {[type]} x [任意变量]
 * @return {[Boolean]}   [description]
 */
function truthy(x){
    return (x !== false) && existy(x); // 注意是全等，所以 0 是 true
}


function doWhen(cond, action){
    if(truthy(cond))
        return action();
    else
        return undefined;
}


function exeIfHasField(target, name){
    return doWhen(target[name], function(){ // 改过了，其实不科学，target[name]可能会报错，用 underscore 的 _.result 函数比较好
        return target[name]();
    });
}

console.log( exeIfHasField([1, 2, 3], 'reverse') );

console.log( exeIfHasField([1, 2, 3], 'ok') );


