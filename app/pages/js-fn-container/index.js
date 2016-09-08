'use strict';
require('./index.less');
var dom = require('../../mods/dom.js');
var _ = require('ramda');
var printToDom = dom.print;
var printDivider = dom.printDivider.bind(dom);



printDivider('创建容器');
var Container = function(x) {
  this.__value = x;
}
Container.of = function(x) { return new Container(x); };
// 使用容器装载数据
printToDom(Container.of(3)); // Container.of(3)





printDivider('functor');
Container.prototype.map = function(f){
  return Container.of(f(this.__value))
}
printToDom(Container.of("bombs").map(_.concat(' away')).map(_.prop('length'))); // Container.of(10)





printDivider('pointfree');
//  map :: Functor f => (a -> b) -> f a -> f b
var map = _.curry(function(f, any_functor_at_all) { // any_functor_at_all 才是类型签名中的 f，因为 curry 是从右向左的
  return any_functor_at_all.map(f);
});
printToDom(map(_.concat(' away'), Container.of("bombs")));




printDivider('Maybe');
var Maybe = function(x) {
  this.__value = x;
}
Maybe.of = function(x) {
  return new Maybe(x);
}
Maybe.prototype.isNothing = function() {
  return (this.__value === null || this.__value === undefined);
}
Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
}




printDivider('用例');
var safeHead = function(xs) {
  return Maybe.of(xs[0]);
};
var streetName = _.compose(map(_.prop('street')), safeHead, _.prop('addresses'));
printToDom(streetName({addresses: []}));
printToDom(streetName({addresses: [{street: 'Ryo'}, {street: 'Jay'}]}));






printDivider('Either / Left / Right');
var Left = function(x) {
  this.__value = x;
}
Left.of = function(x) {
  return new Left(x);
}
Left.prototype.map = function(f) {
  return this;
}

var Right = function(x) {
  this.__value = x;
}
Right.of = function(x) {
  return new Right(x);
}
Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}
// 办理签证，要求大于 18 岁，存款超过 5000
var map = _.curry(function(f, any_functor_at_all) {
  return any_functor_at_all.map(f);
});
// Maybe 有 maybe，Either 也有 either。就是把容器类型转换成普通类型
var either = _.curry(function(f, g, e) {
  switch(e.constructor) {
    case Left: return f(e.__value);
    case Right: return g(e.__value);
  }
});
var check = _.curry(function(person){
	if(person.age < 18){
		return Left.of(person.name + ' is not allowed to get a visa for he/she is younger than 18.');
	}else if(person.money < 5000){
    return Left.of(person.name + ' is not allowed to get a visa for he\'s/she\'s money is less than 5000.');
  }else{
		return Right.of(person);
	}
});
var sendVisa = _.curry(function(person){
  person.visa = true;
  return person;
});
var printVisa = _.curry(function(person){
  return person.name + ' got a visa!';
});
var makeVisa = _.compose(either(_.identity, printVisa), map(sendVisa), check); // map 里的函数就是普通函数，输入输出都是普通值
printToDom(makeVisa({name: 'jack', age: 17, money: 7000}));
printToDom(makeVisa({name: 'rose', age: 20, money: 4000}));
printToDom(makeVisa({name: 'mark', age: 20, money: 7000}));











printDivider('IO，适用于：不得不跟外界交互。❗️跟外界交互就不是纯函数');
// IO 的 value 总是一个函数
var IO = function(f) {
  this.__value = f;
}
IO.of = function(x) {
  return new IO(function() {
    return x;
  });
}
IO.prototype.map = function(f) {
  // return IO.of(f(this.__value)); // old way
  // return IO.of(_.compose(f, this.__value)); // 等于下一条
  return new IO(_.compose(f, this.__value)); // new way: 因为 __value 是函数，所以要 compose
  // 这里其实并没有执行函数！只是把函数都 compose 起来生成了一个新函数赋值给 __value 得到一个新 IO
  // 这些函数可能不是纯函数，但是现在并没有执行这些函数，而是得到新函数。那么 旧函数 -> 新函数 这个函数是纯函数！
  // 我曹机智！
  // 但是，这相当于把野兽关进了笼子，最后还是得把它放出来，不过可以甩锅给调用者，__.value() 就可以释放野兽。
}

// 用例
//  io_window_ :: IO Window
var io_window = IO.of(window);
printToDom( io_window.map(function(win){ return win.innerWidth }).__value() ); // 为了打印出来所以用了 .__value()
printToDom( io_window.map(_.prop('location')).map(_.prop('href')).map(_.split('/')).__value() );



//  $ :: String -> IO [DOM]
var $ = function(selector) {
  return IO.of( document.querySelectorAll(selector) );
}
printToDom( $('#IO').map(_.head).map(function(div){ return div.innerHTML; }).__value() );









printDivider('🔥IO 烧脑用例');

// nmap :: a -> f -> a
var nmap = _.curry(function(f, a){
  return a.map(f);
});

//  url :: IO String
var url = new IO(function() { return window.location.href; });

//  toPairs =  String -> [[String]]
var toPairs = _.compose(nmap(_.split('=')), _.split('&'));

//  params :: String -> [[String]]
var params = _.compose(toPairs, _.last, _.split('?'));

//  findParam :: String -> IO Maybe [String]
var findParam = function(key) {
  // return map(params, url); // [["searchTerm","ok"],["age","10"]]
  // return map( _.compose(_.filter(_.compose(_.equals(key), _.head)), params) , url); // [["searchTerm","ok"]]
  return map(_.compose(Maybe.of, _.filter(_.compose(_.equals(key), _.head)), params), url);
};

// 调用 __value() 来运行它！
printToDom( findParam("searchTerm").__value() ); // Maybe(['searchTerm', 'wafflehouse'])
















