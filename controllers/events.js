'use strict';

var events = require('../models/events');
var validator = require('validator');

// Date data that would be useful to you
// completing the project These data are not
// used a first.
//
var allowedDateInfo = {
  months: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  },
  days: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31],
  minutes: [0, 30],
  hours: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
  ]
};

/**
 * Controller that renders a list of events in HTML.
 */
function listEvents(request, response) {
  var currentTime = new Date();
  var contextData = {
    'events': events.all,
    'time': currentTime
  };
  response.render('event.html', contextData);
}

/**
 * Controller that renders a list of events in JSON.
 */
function apiListEvents(request, response) {
  if (request.query.search)
    response.json({events: events.getByTitle(request.query.search)});
  else
    response.json({events: events.all});
}

/**
 * Controller that renders a page for creating new events.
 */
function newEvent(request, response){
  var contextData = {
    'allowedDateInfo': allowedDateInfo
  };
  response.render('create-event.html', contextData);
}

/**
 * Controller to which new events are submitted.
 * Validates the form and adds the new event to
 * our global list of events.
 */
function saveEvent(request, response){
  // console.log("In saveEvent");
  // for (var item in request.body)
  //   if(request.body.hasOwnProperty(item)){
  //           console.log(item + " = " + request.body[item]);
  //         }
    
  var contextData = {
    errors: [],
    allowedDateInfo: allowedDateInfo
  };
  var year = parseInt(request.body.year);
  var month = parseInt(request.body.month);
  var day = parseInt(request.body.day);
  var hour = parseInt(request.body.hour);
  var minute = parseInt(request.body.minute);
  
  if (validator.isLength(request.body.title, 1, 50) === false) {
    contextData.errors.push('Your title should be between 1 and 50 letters.');
  }
  if (validator.isLength(request.body.location, 1, 50) === false) {
    contextData.errors.push('Your event\'s location should be between 1 and 50 letters.');
  }
  if (isNaN(year)) {
    contextData.errors.push('Your event\'s year is not an integer.');
  } else if (year < 2015 || year > 2016) {
    //console.log("Added error due to year");
    contextData.errors.push('Your event\'s year is out of range.');
  }
  if (isNaN(month) || month < 0 || month > 11) {
    //console.log("Added error due to day");
    contextData.errors.push('Your event\'s month is not acceptable.');
  }
  if (isNaN(day) || day < 1 || day > 31) {
    //console.log("Added error due to day");
    contextData.errors.push('Your event\'s day is not acceptable.');
  }
  if (isNaN(hour) ||  hour < 0 || hour > 23) {
    //console.log("Added error due to hour");
    contextData.errors.push('Your event\'s hour is not acceptable.');
  }
  if (validator.matches(request.body.image, /http(s?):\/\/([a-z,0-9,.,\/,\?,=]+)(.gif|.png)/i) === false) {
    contextData.errors.push('Your image url is not valid. '+request.body.image);
  }


  if (contextData.errors.length === 0) {
    var newid = parseInt(events.nextId());
    var date = new Date(year, month, day, hour, minute, 0,0);
    var datestr = date.toDateString();
    var newEvent = {
      id: newid,
      title: request.body.title,
      location: request.body.location,
      image: request.body.image,
      date:datestr,
      attending: []
    };
    events.all.push(newEvent);
    response.redirect('/events/'+newid);
  }else{
    //response.status(302).send(contextData.errors);
    response.render('create-event.html', contextData);
  }
}

function eventDetail (request, response) {
  var ev = events.getById(parseInt(request.params.id));
  if (ev === null) {
    response.status(404).send('No such event');
  } else
    response.render('event-detail.html', {event: ev});
}

function rsvp (request, response){
  var ev = events.getById(parseInt(request.params.id));
  if (ev === null) {
    response.status(404).send('No such event');
  } else {

    if(!validator.isEmail(request.body.email) || validator.matches(request.body.email, /^([\w-]+(?:\.[\w-]+)*)@yale.edu/i) === false){
      var contextData = {errors: [], event: ev};
      contextData.errors.push('Invalid email');
      response.render('event-detail.html', contextData);
    }else{
      ev.attending.push(request.body.email);
      response.redirect('/events/' + ev.id);
      }
      
    }
  
}

/**
 * Export all our functions (controllers in this case, because they
 * handles requests and render responses).
 */
module.exports = {
  'listEvents': listEvents,
  'apiListEvents': apiListEvents,
  'eventDetail': eventDetail,
  'newEvent': newEvent,
  'saveEvent': saveEvent,
  'rsvp': rsvp
};