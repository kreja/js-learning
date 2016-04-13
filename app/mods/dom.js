'use strict';
/**
 * dom 操作函数
 * @type {Object}
 */
var _ = require('underscore');

var dom = {
    print: function(/* arguments */){
        var args = _.toArray(arguments);
        var p = document.createElement('p');

        if(_.has(args[0], 'newClass')){
            p.classList.add(args[0].newClass);
            args = _.rest(args);
        }

        var s = _.chain(args).map(function(x){
            return _.isObject(x) || _.isArray(x) ? JSON.stringify(x) : x;
        }).join(' ');

        var newContent = document.createTextNode(s);
        p.appendChild(newContent);
        document.body.appendChild(p);
    },
    printDivider: function(s){
        this.print({newClass: 'divider'}, '=============== ' + s + ' ===============');
    }
};

module.exports = dom;
