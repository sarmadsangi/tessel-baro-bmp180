# Tessel Baro BMP180

## Usage

Check `test.js` for working example.

```JavaScript
var tessel = require('tessel');
const bmpDriver = require('./index.js');
const bmp = bmpDriver.use(tessel.port.A);


setInterval(() => {
  bmp.getCurrentTemperature((value) => {
    console.log(value);
  });
}, 1200);
```
