var Handlebars = require('handlebars');

Handlebars.registerHelper('labelCombine', function(a, b, label) {
    if (!label) {
        label = ' | ';
    }

    if (a && b) {
        return a + label + b;
    } else if (a) {
        return a;
    } else if (b) {
        return b;
    }
});
