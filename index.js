var tessel = require('tessel');

// Connect to device
var port = tessel.port.A; // Use the SCL/SDA pins of Port A
var slaveAddress = 0x77; // Specific to device
var i2c = new port.I2C(slaveAddress); // Initialize I2C communication

i2c.send(new Buffer([0xF4, 0x2E]), () => {

  const tempCalculateInterval = setInterval(() => {
    // Details of I2C transfer
    var bytesToSend = [0xF4];

    // Send/recieve data over I2C using i2c.transfer
    i2c.transfer(new Buffer(bytesToSend), 1, function (error, dataReceived) {
      // Print data received (buffer of hex values)
      const conversion = dataReceived[0] & 0b00010000;

      if (conversion === 0) {
        clearInterval(tempCalculateInterval);
        readTemp();
      }
    });
  }, 5);

});

const readTemp = () => {
  var bytesToSend = [0xF6] // An array,can be the address of a register or data to write (depends on device)
  var numBytesToRead = 2 // Read back this number of bytes

  // Send/recieve data over I2C using i2c.transfer
  i2c.transfer(new Buffer(bytesToSend), numBytesToRead, function (error, dataReceived) {
    // Print data received (buffer of hex values)
    const UT = dataReceived.readUInt16BE(0)
    readRemainingValues(UT)
  });
}

const readRemainingValues = (UT) => {
  var bytesToSend = [0xAA]; // An array,can be the address of a register or data to write (depends on device)
  var numBytesToRead = 22; // Read back this number of bytes

  // Send/recieve data over I2C using i2c.transfer
  i2c.transfer(new Buffer(bytesToSend), numBytesToRead, function (error, dataReceived) {
    // Print data received (buffer of hex values)


    const AC6 = dataReceived.readUInt16BE(10)
    const AC5 = dataReceived.readUInt16BE(8)
    const MC = dataReceived.readInt16BE(18)
    const MD = dataReceived.readInt16BE(20)

    const X1 = (UT - AC6) * AC5 / Math.pow(2, 15)
    const X2 = MC * Math.pow(2, 11) / (X1 + MD)
    const B5 = X1 + X2
    const Temp = (B5 + 8) / Math.pow(2, 4)

    console.log(Temp / 10)
  });
}
