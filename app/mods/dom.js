'use strict';
/**
 * dom 操作函数
 * @type {Object}
 */
var _ = require('underscore');

var dom = {
    print: function(){
        var s = _.map(arguments, JSON.stringify).join(' ');
        var p = document.createElement('p');
        var newContent = document.createTextNode(s);
        p.appendChild(newContent);
        document.body.appendChild(p);
    },
    printDivider: function(s){
        this.print('=============== ' + s + ' ===============');
    }
};

module.exports = dom;
