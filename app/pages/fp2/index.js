'use strict';
require('./index.less');

var _ = require('underscore');
var dom = require('../../mods/dom.js');
var printToDom = dom.print;
var printDivider = dom.printDivider.bind(dom);





/////////
// 命令式 //
/////////
printDivider('命令式');
var lyrics = [];
for(var bottle = 9; bottle > 0; bottle--){
    lyrics.push(bottle + 'bottles of beer!');
    lyrics.push('Take one down.');

    if(bottle > 1){
        lyrics.push((bottle-1) + 'bottles of beer on the wall.');
    }else{
        lyrics.push('No more bottles of beer...');
    }
}
printToDom(lyrics);






/////////
// 函数式 //
/////////
printDivider('函数式');
function lyricSegment(n){
    return _.chain([])
        .push(n + 'bottles of beer!')
        .push('Take one down.')
        .tap(function(lyrics){
            if(n > 1){
                lyrics.push((n-1) + 'bottles of beer on the wall.');
            }else{
                lyrics.push('No more bottles of beer...');
            }
        })
        .value();
}
function song(start, end, lyricGen){
    return _.reduce(_.range(start, end, -1),function(acc, n){
        return acc.concat(lyricGen(n));
    }, []);
}
printToDom(song(9, 0, lyricSegment));





////////
// 补集 //
////////
printDivider('补集');
var a = ['a', 1, 'c'];
/**
 * 补集
 * @param  {[type]} pred [谓词函数]
 * @return {[type]}      [description]
 */
function complement(pred){
    return function(){
        return !pred.apply(null, _.toArray(arguments));
    };
}
printToDom( _.filter(a, _.isNumber) );
printToDom( _.filter(a, complement(_.isNumber)) );







/////////////////
// Applicative 示例，参考一下怎么用函数式方式处理咯 //
/////////////////
printDivider('Applicative 示例');
function existy(x){
    return x != null;
}
// 把元素连接起来
function cat(){
    var head = _.first(arguments);

    if(existy(head)){
        // 不能直接用 head.concat(_.rest(arguments)); 因为 arguments 是类似二维数组的
        return head.concat.apply(head, _.rest(arguments));
    }else{
        return [];
    }
}
printToDom( cat([1, 2, 3], [4, 5]) );

// 把 head 加到 tail 前
function construct(head, tail){
    return cat([head], _.toArray(tail)); // 为什么要 _.toArray ？看下面注释
}
printToDom( construct(4, [1]) );
printToDom( construct(4, {a: 2}) ); // 不用 _.toArray 的话结果就不一样了

// 对 coll 进行 map(func) 然后再把结果连起来
function mapcat(func, coll){
    return cat.apply(null, _.map(coll, func));
}
printToDom(
    mapcat(function(ele){ // 数组间隔插入元素
        return construct(ele, [',']);
    }, [1, 2, 3])
);

// 在数组中 间隔插入元素
// 去掉最后一个元素
function butlast(coll){ // collection 集合
    return _.toArray(coll).slice(0, -1);
}
function interpose(inter, coll){
    return butlast(mapcat(function(ele){
        return construct(ele, [inter]);
    }, coll));
}
printToDom( interpose(',', [1, 2, 3]) );





