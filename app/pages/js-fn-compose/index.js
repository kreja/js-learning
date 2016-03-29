'use strict';
require('./index.less');

// https://github.com/MostlyAdequate/mostly-adequate-guide
// https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch5.html
// this is my practice while reading the book

/**
 * 可以传入任意个参数（函数），从右往左执行
 * 如果满足结合律，那么参数顺序可以任意
 * 对于每个函数参数的要求：都要有 return
 * @return {[type]} [description]
 */
var compose = function(){
    var args = arguments;

    return function(x){
        var res = x;
        for(var i=args.length-1; i>=0; i--){
            res = args[i](res);
        }

        return res;
    };
};

var toUpperCase = function(str){
    return str.toUpperCase();
};

var getMatchFn = function(RegExp){ // it's a curry func!
    return function(str){
        var res = str.match(RegExp);
        return res && res[0] || 'not matched';
    };
};

var findHello = function(s){
    return getMatchFn(/hello/)(s);
};

var addPrefix = function(s){
    return 'The result is:' + s;
};

var strengthHello = compose(toUpperCase, findHello);
var strengthHelloWithPrefix = compose(addPrefix, strengthHello);
console.log( strengthHello('yo hello world') );
console.log( strengthHelloWithPrefix('yo hello world') );






////////////////////
// 满足结合律，可以任意顺序传参 //
////////////////////
var getAddFn = function(x){ // curry func
    return function(y){
        return x + y;
    };
};

var addTen = getAddFn(10);
var addOne = getAddFn(1);
var addTwo = getAddFn(2);

var add13 = compose(addTen, addTwo, addOne);
console.log( add13(0) );

add13 = compose(addTwo, addOne, addTen);
console.log( '满足结合律，∴调换顺序后结果不变：', add13(0) );







