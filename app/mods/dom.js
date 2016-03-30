'use strict';
/**
 * dom 操作函数
 * @type {Object}
 */

var dom = {
    print: function(s){
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
