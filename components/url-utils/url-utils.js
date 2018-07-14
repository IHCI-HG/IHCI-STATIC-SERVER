
var resolve = function() {
    var re = '';
    for (var i = 0, len = arguments.length; i < len; i ++) {
        var arg = arguments[i];

        if (re.slice(-1) === arg[0] && arg[0] === '/') {
            re += arg.slice(1);
        } else if (re && re.slice(-1) != '/' && arg[0] != '/') {
            re += '/' + arg;
        } else {
            re += arg;
        }
    }

    return re;
};

module.exports.resolve = resolve;
