'use strict';
var events = require('../models/events-pg');

/**
 * Controller that renders our index (home) page.
 */
function index (request, response) {
  
  var contextData = {
    'events': events.all,
    'today' : Date(),
    'title': 'Wandering Wood',
    'tagline': 'You are doomed (just kidding).'
  };
  response.render('index.html', contextData);
}

module.exports = {
  index: index
};
