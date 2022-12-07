#!/usr/bin/env node
import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));

//Latitude
var lat;
if (args.n){ lat = args.n; }
if (args.s){ lat = -1 * args.s; }
lat = lat? lat:100; //35;

//Longitude
var long;
if (args.e){ long = args.e; }
if (args.w){ long = -1 * args.w; }
long = long? long:100; //79;

//Timezone
const timezone = args.z? args.z : moment.tz.guess();

//Day to retrieve weather
const days = args.d!=null? args.d:1; 

const helpMsg = 
`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
-h            Show this help message and exit.
-n, -s        Latitude: N positive; S negative.
-e, -w        Longitude: E positive; W negative.
-z            Time zone: uses tz.guess() from moment-timezone by default.
-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
-j            Echo pretty JSON from open-meteo API and exit.`;


if (args.h) {
    console.log(helpMsg);
    process.exit(0);
}

//https://api.open-meteo.com/v1/forecast?latitude=42.7105&longitude=23.3238&daily=precipitation_hours&current_weather=true&timezone=America%2FNew_York
const URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=precipitation_hours&current_weather=true&timezone=${timezone}`;
// Make a request
const response = await fetch(URL);

// Get the data from the request
const data = await response.json();
if (args.j){
    console.log(data);
    process.exit(0);
}

var DAY_PHRASE;
if (days == 0) {
    DAY_PHRASE = "today";
  } else if (days > 1) {
    DAY_PHRASE = "in " + days + " days";
  } else {
    DAY_PHRASE = "tomorrow";
  }

// Do you need to wear your galoshes?
if ( data.daily.precipitation_hours[days] > "0" ) {
    console.log(`You might need your galoshes ${DAY_PHRASE}.\n`);
} else {
    console.log(`You probably won't need your galoshes ${DAY_PHRASE}.\n`)
}
