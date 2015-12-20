'use strict';
require('./index.less');


/**
 * 1. 作用域隔离-normal
 * 缺点：没有私有的概念。bind、getSquare 应该是私有的。但是 square 之外的代码却能修改这两个方法，是不安全的。
 */
// var square = {
//     $square: null, // 输入元素
//     $input: null,
//     $res: null,
//     /**
//      * 初始化
//      * @return {[type]} [description]
//      */
//     init: function(config){
//         config = config || {};
//         this.$square = $(config.square);
//         this.$input = this.$square.find('.input');
//         this.$res = this.$square.find('.res');

//         this.bind();
//         return this; // 链式调用
//     },
//     /**
//      * 绑定事件
//      * @return {[type]} [description]
//      */
//     bind: function(){
//         var ctx = this;
//         ctx.$input.on('keyup',function(){
//             ctx.render();
//         });
//     },
//     /**
//      * 求平方数
//      * @return {[type]} [description]
//      */
//     getSquare: function(){
//         var num = parseInt(this.$input.val(), 10);
//         return num * num;
//     },
//     /**
//      * 渲染
//      * @return {[type]} [description]
//      */
//     render: function(){
//         var num = this.getSquare();
//         this.$res.html(num);
//     }
// };

// $(function(){
//     square
//         .init({square:'.dora-square'})
//         .render(); // 链式调用
// });








/**
 * 2. 作用域隔离-函数闭包写法
 * 写在自动执行的闭包里，只对外公开构造函数
 * 适合：一个组件
 * 缺点：不适合一套组件（没有继承）
 */
var Square = (function(){
        // 私有变量
        var _bind = function(that){
                that.$input.on('keyup',function(){
                        that.render();
                });
        };

        var _getSquare = function(that){
                var num = parseInt(that.$input.val(), 10);
                return num * num;
        };

        // 构造函数
        var Square = function(config){
                config = config || {};
                this.$square = $(config.square);
                this.$input = this.$square.find('.input');
                this.$res = this.$square.find('.res');

                _bind(this);
                return this; // 链式调用
        };

        Square.prototype.render = function(){
                var num = _getSquare(this);
                this.$res.html(num);
        };

        return Square; // 返回构造函数
})();

$(function() {
    new Square({square:'.dora-square'}).render();
});
