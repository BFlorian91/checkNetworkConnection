const speedTest = require('speedtest-net');
const colors = require('colors');
const fs = require('fs');

const time = 60 * Math.pow(10, 3);
const minCo = 150;
 
setInterval((async () => {

  try {
    
    const res = await speedTest();
    
    // Round at 2 decimal bandwidth and convert in Mb/s
    const download = 
     Math.round(((res.download.bandwidth * 8) / Math.pow(10, 6)) * 100) / 100;
    const upload =
     Math.round(((res.upload.bandwidth * 8) / Math.pow(10, 6)) * 100) / 100;
    
    // Get packetLoss
    const packetLoss = res.packetLoss;
    
    // Create logs if errors
    if (packetLoss > 2) {
      fs.appendFileSync('packet-error.txt', `You have ${packetLoss} packetloss !!!\n`); 
    }
    if (download < minCo) { 
      fs.appendFileSync('connectionError.txt', `You have ${download} MB/s is so LOW !!\n`)
    }
    
    // Display CLI informations
    console.log(`
      DL: ${download < minCo ? colors.red(download) : colors.green(download)}
      UP: ${upload < minCo ? colors.red(upload) : colors.green(upload)}
      PL: ${packetLoss == undefined ? colors.green(0) : packetLoss > 2 ? colors.red(packetLoss) : colors.green(packetLoss)}
      --------------------------------------------------------------------
    `);
    
  } catch (err) {
    console.log(err.message);
  }
}), time);
