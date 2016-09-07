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








