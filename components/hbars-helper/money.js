var Handlebars = require('handlebars');

Handlebars.registerHelper('format-money', function(amount, base, label) {
    amount = parseInt(amount) || 0;

    if (!base) {
        base = 100;
    }

    return amount / base;
});
