var path = require('path');
var versiony = require('versiony');
var package = path.resolve(__dirname, 'package.json');

versiony.from(package).patch().to(package).end();
