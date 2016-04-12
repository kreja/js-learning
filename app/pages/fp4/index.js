'use strict';
require('./index.less');

var _ = require('underscore');
var dom = require('../../mods/dom.js');
var printToDom = dom.print;
var printDivider = dom.printDivider.bind(dom);

/////////
// 传递函数 //
/////////
printDivider('传递函数');
var people = [{
    name: 'rose',
    age: 18
},{
    name: 'jack',
    age: 22
},{
    name: 'bob',
    age: 15
}];

printToDom( _.max([1, 2, 3]) );

// 这不是真正的函数式
printToDom(
    _.max(people, function(x){ // 可以传入 func 来确定怎么取值
        return x.age;
    })
);




/////////
// 传递函数-函数式 //
/////////
printDivider('传递函数-函数式');
/**
 * 获取值、获取最佳值、集合
 * @return {[type]} [description]
 */
function finder(valueFunc, bestFunc, coll){
    return _.reduce(coll, function(best, current){
        var bestValue = valueFunc(best);
        var currentValue = valueFunc(current);

        return (bestValue===bestFunc(bestValue, currentValue)) ? best : current;
    });
}

printToDom(
    finder(_.property('age'), Math.max, people)
);

printToDom(
    finder(_.property('name'), function(x, y){
        return x.charAt(0) === 'r' ? x : y; // 这里其实跟 finder 里的三目运算重复了
    }, people)
);

printToDom(
    finder(_.identity, Math.max, [1, 3, 2])
);



/////////
// 传递函数-函数式-优化 //
/////////
printDivider('传递函数-函数式-优化');
function best(bestFunc, coll){
    return _.reduce(coll, function(oldV, newV){
        return bestFunc(oldV, newV) ? oldV : newV;
    });
}
printToDom(
    best(function(x, y){
        return x > y;
    }, [1, 3, 2])
);

function finder(valueFunc, bestFunc, coll){
    return _.reduce(coll, function(best, current){
        return bestFunc(valueFunc(best), valueFunc(current)) ? best : current;
    });
}
printToDom(
    finder(_.property('name'), function(x, y){
        return x.charAt(0) === 'r'; // 优化后，只要返回是否是 best 就可以了
    }, people)
);



/////////
// 函数优化案例 //
/////////
printDivider('函数优化案例');

/**
 * 限定了重复类型，只能是一个值
 */
function repeat(times, value){
    return _.map(_.range(times), function(){
        return value;
    });
}
printToDom( repeat(3, 'ok') );

/**
 * 把参数 value 替换成了函数，打开了一个充满可能性的世界
 * 缺点：repeatedly 只能指定参数，不能根据条件判断
 */
function repeatedly(times, func){
    return _.map(_.range(times), func);
}
printToDom( repeatedly(3, function(x){
    return x + 1;
}) );
// 使用场景：生成一些已知数量的 DOM 节点，每个节点都可以有计数值的 id
repeatedly(3, function(n){
    var id = 'id' + n;
    $('body').append( $('<p>我是生成的 DOM 节点</p>').attr('id', id) );
    return id;
});

/**
 * 再优化：根据条件判断是否继续重复
 */
function iterateUntil(func, check, init){
    var ret = [];
    var res = func(init);

    while(check(res)){
        ret.push(res);
        res = func(res);
    }

    return ret;
}
printToDom(
    '找到 2..1024 之间 2 的幂值',
    iterateUntil(function(x){
        return x * 2;
    }, function(x){
        return x <= 1024;
    }, 1)
);





/////////
// 返回其他函数的函数 //
/////////
printDivider('返回其他函数的函数');
function always(value){
    return function(){
        return value;
    };
}
var f = always({a: 'jack'});
var g = always({a: 'jack'}); // 跟上面是不一样的对象
printToDom(
    f() === g()
);



/////////
// 返回其他函数的函数 //
/////////
printDivider('返回其他函数的函数');
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
/**
 * 接收一个方法，在任何给定的对象上调用它 ⭐️
 * 意义在于：
 *     把方法变成了函数，比如下面的 map，本来是 arr.map 现在变成了一个函数
 *     并且做好了兼容，对象调用本身没有的方法时，就返回 undefined
 */
function invoker(name, method){
    return function(target){
        if(!existy(target)){
            console.warn('must provide a target');
            return ;
        }
        var targetMethod = target[name]; // 得到方法
        var args = _.rest(arguments);

        return doWhen(existy(targetMethod) && method===targetMethod, function(){
            return targetMethod.apply(target, args);
        });
    };
}
var rev = invoker('reverse', Array.prototype.reverse);
printToDom(
    rev([3, 4, 5]),
    _.map([[1, 2, 3]], rev)
);

var map = invoker('map', Array.prototype.map);
printToDom(
    map([3, 4, 5], function(x){
        return x * 2;
    })
);




/////////
// 捕获变量 //
/////////
printDivider('捕获变量');
function uniqueString(len){
    return Math.random().toString(36).substr(2, len); // 还有这功能。。。⭐️
}
printToDom(
    uniqueString(10)
);

/**
 * 后缀从某数字开始增长
 * 在闭包中改变捕获的变量，是危险的，尽量避免
 */
function makeUniqueStringFunction(start){
    var counter = start;

    return function(prefix){
        return [prefix, counter++].join('');
    };
}
var uniqueString = makeUniqueStringFunction(3);
printToDom( uniqueString('hello') );
printToDom( uniqueString('hello') );

// 对象的方式，但是不好
var generator = {
    counter: 0,
    uniqueString: function(prefix){
        return [prefix, this.counter++].join('');
    }
};
printToDom( generator.uniqueString('world') );
printToDom( generator.uniqueString('world') );
generator.counter = 'test'; // 一变就完了
printToDom( generator.uniqueString('world') );

// 私有变量 解决上面问题
var generator = (function(init){
    var counter = init;

    return {
        uniqueString: function(prefix){
            return [prefix, counter++].join('');
        }
    };
})(0);
printToDom( generator.uniqueString('私有') );
printToDom( generator.uniqueString('私有') );
generator.counter = 'test'; // 一变就完了
printToDom( generator.uniqueString('私有') );






