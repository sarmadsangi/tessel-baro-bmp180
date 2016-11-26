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
      console.log('Send Complete');
      console.log(dataReceived[0]);
      const conversion = dataReceived[0] & 0b00010000;
      console.log(conversion);


      if (conversion === 0) {
        clearInterval(tempCalculateInterval);
        readTemp();
      }
    });
  }, 1200);

});


const readTemp = () => {
  var bytesToSend = [0xF6] // An array,can be the address of a register or data to write (depends on device)
  var numBytesToRead = 2 // Read back this number of bytes

  // Send/recieve data over I2C using i2c.transfer
  i2c.transfer(new Buffer(bytesToSend), numBytesToRead, function (error, dataReceived) {
    // Print data received (buffer of hex values)
    console.log(dataReceived.length)
    const val = dataReceived.readUInt16LE(0)
    console.log(`val ${val}`)

    readRemainingValues(val)
  });
}

const readRemainingValues = (UT) => {
  var bytesToSend = [0xAA]; // An array,can be the address of a register or data to write (depends on device)
  var numBytesToRead = 22; // Read back this number of bytes

  // Send/recieve data over I2C using i2c.transfer
  i2c.transfer(new Buffer(bytesToSend), numBytesToRead, function (error, dataReceived) {
    // Print data received (buffer of hex values)

    console.log('---------')
    for (var i = 0; i < dataReceived.length; i++) {
      console.log(`${i} ${dataReceived[i]}`)
    }
    console.log('=========')


    const AC6 = 23153 //dataReceived.readUInt16LE(10)
    const AC5 = 32757 //dataReceived.readUInt16LE(8)
    const MC = -8711 //dataReceived.readInt16LE(18)
    const MD = 2868 //dataReceived.readInt16LE(20)

    console.log(`AC6 ${AC6}`)
    console.log(`AC5 ${AC5}`)
    console.log(`MC ${MC}`)
    console.log(`MD ${MD}`)

    const X1 = (UT - AC6) * AC5 / Math.pow(2, 15)
    const X2 = MC * Math.pow(2, 11) / (X1 + MD)
    const B5 = X1 + X2
    const Temp = (B5 + 8) / Math.pow(2, 4)

    console.log(`X1 ${X1}`)
    console.log(`X2 ${X2}`)
    console.log(`B5 ${B5}`)

    console.log(Temp / 10)

  });
}

// const BitShift = (msb, lsb) => {
//   return (msb << 8) | lsb
// }
