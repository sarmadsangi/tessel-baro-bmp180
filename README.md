# Tessel Baro BMP180

## Usage

Check `test.js` for working example.

```
const getCurrentTemperature = require('./index.js');

getCurrentTemperature((value) => {
  // value contains calibrated value and normal value
  console.log(value);
});
```
