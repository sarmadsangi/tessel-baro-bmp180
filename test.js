const getCurrentTemperature = require('./index.js');

setInterval(() => {
  getCurrentTemperature((value) => {
    console.log(value);
  });
}, 1200);
