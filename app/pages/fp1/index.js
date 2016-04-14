'use strict';
require('./index.less');

var dom = require('../../mods/dom.js');
var printToDom = dom.print;
var printDivider = dom.printDivider.bind(dom);


/////////////////////////////////
// js 中 null / undefined 表示不存在 //
/////////////////////////////////
printDivider('js 中 null / undefined 表示不存在');
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

printToDom( exeIfHasField([1, 2, 3], 'reverse') );

printToDom( exeIfHasField([1, 2, 3], 'ok') );







/////////////////////////////////
// 数组降维 //
/////////////////////////////////
printDivider('数组降维');
var _ = require('underscore');
function add(x, y){
    return x + y;
}

/**
 * 前提：addArrayElements 的参数是数组
 *     那么 arguments 就成了二维数组
 * 目的：把二维数组降为一维数组
 */
var addArrayElements = function(){
    return _.reduce(arguments, add, 0); // arguments 是二维数组
};
printToDom(
    '没有降维',
    addArrayElements([1, 2, 3, 4])
); // 01,2,3,4

/**
 * 作用：
 *     接收一个函数，返回一个函数
 *     返回的函数：传入一个数组，降维，当做封装函数的参数列表
 *
 * 使用场景：数组降维
 */
function splat(func){
    return function(arr){
        return func.apply(null, arr); // 执行函数 func，参数是 array 里的元素
    };
}
// arguments 降维了，arguments 就是一维数组
var addArrayElements = splat(function(){
    return _.reduce(arguments, add, 0);
});
printToDom(
    '降维',
    addArrayElements([1, 2, 3, 4])
); // 10

/**
 * 配合 identity 降维
 */
var addArrayElements = function(){
    var args = _.identity.apply(null, arguments);
    return _.reduce(args, add, 0);
};
printToDom(
    'apply + identity 降维',
    addArrayElements([1, 2, 3, 4])
);






