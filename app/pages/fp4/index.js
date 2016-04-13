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



/////////
// 防止不存在的函数：使用 fnull //
/////////
printDivider('防止不存在的函数：使用 fnull');
var nums = [1, 2, 3, null, 5];
printToDom(
    '因为有个 null，所以乘积结果是错误的',
    _.reduce(nums, function(product, n){
        return product * n;
    })
);

/**
 * 封装 func，提供默认参数
 * 只能解决一级 null/undefined
 * 对于 {name: null, age: 18} 这种二级 null 无法解决
 */
function fnull(func /*, defaults*/){
    var defaults = _.rest(arguments); // 默认参数

    return function(/*args*/){ // 返回包装后的守卫函数
        // 只有在 守卫函数 被调用时才会遍历默认值，即只在需要的时候发生
        var args = _.map(arguments, function(e, i){
            return existy(e) ? e : defaults[i]; // 默认参数代替 null/undefined
        });
        return func.apply(null, args);
    };
}
var nums = [1, 2, 3, null, 5];
var saveMult = fnull(function(product, n){
    return product * n;
}, 1, 1);
printToDom(
    '使用 fnull 得到正确结果',
    _.reduce( nums, saveMult)
);

// 解决配置对象的问题 ⭐️⭐️⭐️
printDivider('解决配置对象的问题 ⭐️⭐️⭐️');
function defaults(d){ // 默认配置对象
    return function(o, k){ // object key
        var val = fnull(_.identity, d[k]); // 守卫函数，会把空参数替换成默认参数
        return o && val(o[k]);
    };
}
function findName(person){
    var lookup = defaults({name: 'jack'});
    return lookup(person, 'name'); // 找到 person 的 name 属性
}
printToDom(
    '正确参数',
    findName({name: 'rose'})
);
printToDom(
    '默认参数',
    findName({name: null})
);
printToDom(
    '默认参数',
    findName({})
);




printDivider('解决配置对象的问题 - 自我推导');
// old way 写 findName
function findName(person){
    // val 就是一个守卫函数，它自带默认值
    var val = fnull(_.identity, 'jack'); // fnull(_.identity /*, defaults*/) 很有用！就是把单个 null/ undefined 转换成 默认参数
    return person && val(person.name); // 如果 person.name 是空，就会用 jack 替代
}
// 升级 findName，更通用，而不只是针对 person (这里 person 替换成了 obj)
function defaults(config){
    return function(obj, key){ // 其实就是获取 obj 里的 key 值，不过当 obj[key] 是空时会用默认值替换
        var val = fnull(_.identity, config[key]);
        return obj && val(obj[key]);
    };
}
var find = defaults({name: 'Jay'});
printToDom(
    find({}, 'name')
);
// 再优化，直接写成 findName
var findName = function(person){
    return find(person, 'name');
};
printToDom(
    findName({})
);





/////////
// 对象校验器 //
/////////
printDivider('对象校验器');
/**
 * 参数：若干个验证器（谓词函数）
 * return: 一个 checker 函数，他会用这些验证器进行验证，如果验证错误就会添加错误信息到数组中，最后返回该数组
 * 所以返回空数组就表明通过了所有验证器
 */
function checker(/*validators*/){ // validator 是 谓词函数
    var validators = _.toArray(arguments); // 要 toArray，因为 arguments 不是数组

    return function(obj){
        // 用 reduce 是一个棒棒的选择！因为它可以记录 errs
        return _.reduce(validators, function(errs, check){ // check 就是当前的验证器
            if(check(obj)){
                return errs; // 通过 check, errs 不变
            }else{
                // check 是一个验证器，它是一个函数，他还有一个 message 属性，表示错误信息
                return _.chain(errs).push(check.message).value(); // 不通过，添加 err
            }
        }, []);
    };
}

// 永远通过的验证器
var alwaysPasses = checker( always(true), always(true) );
printToDom(
    alwaysPasses({})
);

var fails = always(false);
fails.message = 'a failure in life'; // 要另外设置 message，不好
var alwaysFails = checker(fails, always(true), fails);
printToDom(
    alwaysFails({})
);


// 验证器优化，不需要另外设置 message
function validator(message, fun){
    // 为什么不是直接 f = fun?
    // 应该是因为这一段：
    //      message 是一个非常普通的属性名，如果给它设置值可能会抹掉正常的值，所以要新建一个 function
    var f = function(/* args */){
        return fun.apply(fun, arguments);
    };

    f.message = message;
    return f;
}
var gonnaFail = checker( validator('ZOMG!', always(false)) );
printToDom(
    gonnaFail(100)
);

// 起一个更具有描述性的名字
function aMap(obj){
    return _.isObject(obj);
}
var checkCommand = checker( validator('must be a map', aMap) );
printToDom(
    checkCommand(100)
);


printDivider('对象校验器-hasKeys');
/**
 * 得到一个谓词函数，判断对象是否有某些 key
 */
function hasKeys(){
    var keys = _.toArray(arguments);

    var fun = function(obj){
        // 每一个 key 都有才返回 true
        return _.every(keys, function(k){
            return _.has(obj, k);
        });
    };

    fun.message = ['Must have values for keys:'].concat(keys).join(' ');
    return fun;
}
var checkCommand = checker( validator('must be a map', aMap), hasKeys('name', 'age') );
printToDom(
    checkCommand(1)
);
printToDom(
    checkCommand({name: 'ok', age: 12})
);



/////////
// 推荐用 _.chain ，因为可以进行链式调用 //
/////////
printDivider('用 _.chain 进行链式调用');
var peoples = [{
    name: 'jack'
},{
    name: 'rose'
}];
printToDom(
    _.chain(peoples).push({
        name: 'bob'
    }).shift().map(function(x){
        return x.name;
    })
);












