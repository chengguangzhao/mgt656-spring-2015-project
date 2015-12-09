'use strict';
var pg = require("pg");
var Sequelize = require('sequelize');

// Initialize Serialize
var sequelize = new Sequelize('d9te9e0a2uei32', 'uvrekcrenjbvhu', 'zdZi2HKugrCE7i0o7RiDHlTOZ',
{
  host    : 'ec2-54-83-199-54.compute-1.amazonaws.com',
  //port    : 5432,
  dialect : 'postgres',
  native  : true,
  pool    : {
    max : 5,
    min : 0,
    idle: 10000
  }
});

//Model schema
var events_table = sequelize.define('events_table', {
  id    : {
    type  : Sequelize.INTEGER,
    primaryKey: true
  },
  title : Sequelize.STRING(100),
  date : Sequelize.DATE,
  image: Sequelize.STRING(512),
  location: Sequelize.STRING(100)
});

//Create table if one does not exist
sequelize.sync();

var allEvents = [];

/**
 * An Array of all the events
 */
events_table.findAll().then(function(evs){
  this.allEvents=evs;
  console.log(evs);
});


/**
 * Returns the first event that has a particular id.
 */
function getById (id) {
  for (var i = allEvents.length - 1; i >= 0; i--) {
    if (id === allEvents[i].id){
      return allEvents[i];
    }
  }
  return null;
}

function nextId () {
  var j=0;
  for (var i = allEvents.length - 1; i >= 0; i--) {
    if (j < allEvents[i].id){
      j=allEvents[i].id
    }
  }
  return j+1;
}

function getByTitle (title) {
  var res = [];
  for (var i = allEvents.length - 1; i >= 0; i--) {
    if (allEvents[i].title.indexOf(title) >=0){
      res.push(allEvents[i]);
    }
  }
  return res;
}

function getFutureEvents () {
  var res = [];
  var today_date = new Date();
  for (var i = allEvents.length - 1; i >= 0; i--) {
    if (allEvents[i].date > today_date){
      res.push(allEvents[i]);
    }
  }
  return res;
}

module.exports = exports = {
  all: allEvents,
  futures: getFutureEvents,
  getById: getById,
  nextId: nextId,
  getByTitle: getByTitle
};