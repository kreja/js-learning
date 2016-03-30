'use strict';
require('./index.less');
var dom = require('../../mods/dom.js');
var printToDom = dom.print;
var printDivider = dom.printDivider.bind(dom);

// https://github.com/MostlyAdequate/mostly-adequate-guide
// https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch5.html
// this is my practice while reading the book



/**
 * 可以传入任意个参数（函数），从右往左执行
 * 如果满足结合律，那么参数顺序可以任意
 * 对于每个函数参数的要求：都要有 return
 * 右边函数的返回值正好满足作为左边函数的参数
 * @return {[type]} [description]
 */
printDivider('compose 实例');
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
printToDom(strengthHello('yo hello world'));
printToDom(strengthHelloWithPrefix('yo hello world'));












////////////////////
// 满足结合律，可以任意顺序传参 //
////////////////////
printDivider('结合律 实例');
var getAddFn = function(x){ // curry func
    return function(y){
        return x + y;
    };
};

var addTen = getAddFn(10);
var addOne = getAddFn(1);
var addTwo = getAddFn(2);

var add13 = compose(addTen, addTwo, addOne);
printToDom(add13(0));

add13 = compose(addTwo, addOne, addTen);
printToDom('满足结合律，∴调换顺序后结果不变：' + add13(0));












///////////////
// 一次化简的心路历程！！！ 非常重要！！！ //
///////////////
printDivider('一次化简的心路历程！！！ 非常重要！！！');
var _ = require('ramda');

var blog = [{
    id: '1',
    content: '你好，哈哈'
},{
    id: '2',
    content: '天气不错'
},{
    id: '3',
    content: '很搞笑'
},{
    id: '4',
    content: '我要去跑步了'
},{
    id: '5',
    content: '这是测试'
}];

// 1 最初始的写法
var getById = function(id){
    return _.find(function(item){
        return item.id == id;
    }, blog);
};

// 2
var getById = function(id){
    return _.find(function(item){
        return _.prop('id', item) == id; // 这里改用 _.prop
    }, blog);
};

// 3
var getById = function(id){
    return _.find(_.propEq('id', id), blog); // 改用 _.propEq。但是：_.propEq('id', id) 应该可以放右边，然后正好跟参数 id 消掉，所以要交换参数位置
};

// 4
var find = _.flip(_.find); // 用 _.flip 来翻转 _.find 的参数顺序
var getById = function(id){
    // return find(blog, _.propEq('id', id)); // 参数顺序翻转了
    return find(blog)( _.propEq('id')(id) ); // 写成 curry 的调用形式，发现是函数 _.propEq('id') 执行后的返回值作为参数传入 find(blog)，所以可以改成 compose
};

// 5
var find = _.flip(_.find);
var getById = function(id){
    return compose(find(blog), _.propEq('id'))(id); // 可以用一等公民函数法则来化简

};

var find = _.flip(_.find);
var getById = compose( find(blog), _.propEq('id') );
var res = getById('1');
printToDom('找到的 blog：' + (res&&res.content));









