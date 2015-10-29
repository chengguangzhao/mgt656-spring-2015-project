'use strict';
var pip = require('../models/people');

/**
 * Controller that renders our about page.
 */
function about (request, response) {
  var contextData = {
    'people': pip.all
  };
  response.render('about.html', contextData);
}

module.exports = {
  about: about
};