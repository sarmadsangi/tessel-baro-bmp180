var tessel = require('tessel');
const bmpDriver = require('./index.js');
const bmp = bmpDriver.use(tessel.port.A);


setInterval(() => {
  bmp.getCurrentTemperature((value) => {
    console.log(value);
  });
}, 1200);
