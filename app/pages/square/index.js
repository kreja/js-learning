'use strict';
require('./index.less');

/**
 * 作用域隔离
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
 * 函数闭包写法
 * 写在自动执行的闭包里，只对外公开构造函数
 * 适合：一个组件
 * 缺点：不适合一套组件（没有继承）
 */
// var Square = (function(){
//         // 私有变量
//         var _bind = function(that){
//                 that.$input.on('keyup',function(){
//                         that.render();
//                 });
//         };

//         var _getSquare = function(that){
//                 var num = parseInt(that.$input.val(), 10);
//                 return num * num;
//         };

//         // 构造函数
//         var Square = function(config){
//                 config = config || {};
//                 this.$square = $(config.square);
//                 this.$input = this.$square.find('.input');
//                 this.$res = this.$square.find('.res');

//                 _bind(this);
//                 return this; // 链式调用
//         };

//         Square.prototype.render = function(){
//                 var num = _getSquare(this);
//                 this.$res.html(num);
//         };

//         return Square; // 返回构造函数
// })();

// $(function() {
//     new Square({square:'.dora-square'}).render();
// });








/**
 * 面向对象
 */
// 先实现 Class
var Class = (function() {
    var _mix = function(r, s) {
        for (var p in s) {
            if (s.hasOwnProperty(p)) {
                r[p] = s[p];
            }
        }
    };

    var _extend = function() {
        //开关 用来使生成原型时,不调用真正的构成流程init
        this.initPrototype = true;
        var prototype = new this();
        this.initPrototype = false;

        var items = Array.prototype.slice.call(arguments) || [];
        var item;

        //支持混入多个属性，并且支持{}也支持 Function
        while (item = items.shift()) {
            _mix(prototype, item.prototype || item);
        }


        // 这边是返回的类，其实就是我们返回的子类
        function SubClass() {
            if (!SubClass.initPrototype && this.init){
                this.init.apply(this, arguments); //调用init真正的构造函数
            }
        }

        // 赋值原型链，完成继承
        SubClass.prototype = prototype;

        // 改变constructor引用
        SubClass.prototype.constructor = SubClass;

        // 为子类也添加extend方法
        SubClass.extend = _extend;

        return SubClass;
    };
    //超级父类
    var Class = function() {};
    //为超级父类添加extend方法
    Class.extend = _extend;

    return Class;
})();


// var Square = Class.extend({
//     init: function(config){
//         config = config || {};
//         this.$square = $(config.square);
//         this.$input = this.$square.find('.input');
//         this.$res = this.$square.find('.res');

//         this._bind();
//         this.render();
//     },
//     render: function(){
//         var num = this._getSquare();
//         this.$res.html(num);
//     },
//     _getSquare: function(){
//         var num = parseInt(this.$input.val(), 10);
//         return num * num;
//     },
//     _bind: function(){
//         var ctx = this;
//         ctx.$input.on('keyup',function(){
//                 ctx.render();
//         });
//     }
// });


// $(function() {
//     new Square({square:'.dora-square'});
// });








/**
 * 抽象出 base
 * init/bind/render 是大部分组件都会有的方法
 * 有点生命周期的影子，组件都会有这几个阶段，初始化，绑定事件，以及渲染。还可以加一个destroy销毁的方法，用来清理现场。
 * 编写组件时可以直接继承base类，覆盖里面的bind和render方法。
 */
//  var Base = Class.extend({
//     init:function(config){
//         this.__config = config; //自动保存配置项
//         this.bind();
//         this.render();
//     },
//     /**
//      * 可以使用get来获取配置项
//      * todo::一般来说这种情况下都是使用getter，setter来处理
//      * @param  {[type]} key [配置属性]
//      * @return {[type]}     [description]
//      */
//     get:function(key){
//         return this.__config[key];
//     },
//     /**
//      * 可以使用set来设置配置项
//      * @param {[type]} key   [配置项属性]
//      * @param {[type]} value [属性值]
//      */
//     set:function(key,value){
//         this.__config[key] = value;
//     },
//     bind:function(){
//     },
//     render:function() {
//     },
//     /**
//      * 定义销毁的方法，一些收尾工作都应该在这里
//      * @return {[type]} [description]
//      */
//     destroy:function(){
//     }
// });

// var Square = Base.extend({
//     _getSquare: function(){
//         var num = parseInt(this.get('input').val(), 10);
//         return num * num;
//     },
//     bind: function(){
//         var ctx = this;
//         ctx.get('input').on('keyup',function(){
//                 ctx.render();
//         });
//     },
//     render: function(){
//         var num = this._getSquare();
//         this.get('res').html(num);
//     }
// });

// $(function() {
//     new Square({
//         input: $('.input'),
//         res: $('.res')
//     });
// });






// 新的要求：输入超过三个字就警告
/**
 * 引入事件机制(观察者模式)
 */
 //辅组函数，获取数组里某个元素的索引 index
 var _indexOf = function(array,key){
    if (array === null) {
        return -1;
    }
    var i = 0, length = array.length;
    for (; i < length; i++) {
        if (array[i] === key) {
            return i;
        }
    }
    return -1;
 };

 var Events = Class.extend({
    //添加监听
    on:function(key,listener){
        //this.__events存储所有的处理函数
        if (!this.__events) {
            this.__events = {};
        }
        if (!this.__events[key]) {
            this.__events[key] = [];
        }
        if (_indexOf(this.__events,listener) === -1 && typeof listener === 'function') {
            this.__events[key].push(listener);
        }

        return this;
    },
    //触发一个事件，也就是通知
    fire:function(key){
        if (!this.__events || !this.__events[key]) {
            return;
        }
        var args = Array.prototype.slice.call(arguments, 1) || [];
        var listeners = this.__events[key];
        var i = 0;
        var l = listeners.length;

        for (i; i < l; i++) {
            listeners[i].apply(this,args);
        }
        return this;
   },
    //取消监听
    off:function(key,listener){
        if (!key && !listener) {
            this.__events = {};
        }
        //不传监听函数，就去掉当前key下面的所有的监听函数
        if (key && !listener) {
            delete this.__events[key];
        }

        if (key && listener) {
            var listeners = this.__events[key];
            var index = _indexOf(listeners, listener)

            (index > -1) && listeners.splice(index, 1);
        }

        return this;
    }
 });


 // var a = new Events();

 // //添加监听 test事件
 // a.on('test',function(msg){
 //   console.log(msg);
 // });

 // //触发 test事件
 // a.fire('test','我是第一次触发');
 // a.fire('test','我又触发了');

 // a.off('test');

 // a.fire('test','你应该看不到我了');


 /**
  * base 添加事件机制
  */
 var Base = Class.extend(Events, {
    init:function(config){
        this.__config = config; //自动保存配置项
        this.bind();
        this.render();
    },
    /**
     * 可以使用get来获取配置项
     * todo::一般来说这种情况下都是使用getter，setter来处理
     * @param  {[type]} key [配置属性]
     * @return {[type]}     [description]
     */
    get:function(key){
        return this.__config[key];
    },
    /**
     * 可以使用set来设置配置项
     * @param {[type]} key   [配置项属性]
     * @param {[type]} value [属性值]
     */
    set:function(key,value){
        this.__config[key] = value;
    },
    bind:function(){
    },
    render:function() {
    },
    /**
     * 定义销毁的方法，一些收尾工作都应该在这里
     * @return {[type]} [description]
     */
    destroy:function(){
        //去掉所有的事件监听
        this.off();
    }
 });


var Square = Base.extend({
    _getSquare: function(){
        var num = parseInt(this.get('input').val(), 10);
        return num * num;
    },
    _getNum: function(){
        return this.get('input').val().length;
    },
    bind: function(){
        var ctx = this;
        ctx.get('input').on('keyup',function(){
            ctx.fire('input', ctx._getNum()); // 触发事件
            ctx.render();
        });
    },
    render: function(){
        var num = this._getSquare();
        this.get('res').html(num);
    }
});

$(function() {
    var square = new Square({
        input: $('.input'),
        res: $('.res')
    });

    square.on('input', function(num){ // 定义事件
        if(num>3){
            console.log('超过3个字了！！！');
        }
    });
});












