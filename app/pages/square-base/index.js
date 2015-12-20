'use strict';
require('./index.less');

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


/**
 * 抽象出 base
 * init/bind/render 是大部分组件都会有的方法
 * 有点生命周期的影子，组件都会有这几个阶段，初始化，绑定事件，以及渲染。还可以加一个destroy销毁的方法，用来清理现场。
 * 编写组件时可以直接继承base类，覆盖里面的bind和render方法。
 */
 var Base = Class.extend({
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
    }
});

var Square = Base.extend({
    _getSquare: function(){
        var num = parseInt(this.get('input').val(), 10);
        return num * num;
    },
    bind: function(){
        var ctx = this;
        ctx.get('input').on('keyup',function(){
                ctx.render();
        });
    },
    render: function(){
        var num = this._getSquare();
        this.get('res').html(num);
    }
});

$(function() {
    new Square({
        input: $('.input'),
        res: $('.res')
    });
});
