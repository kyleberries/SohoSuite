var Promise = require('bluebird');
var adb = require('adbkit');
var client = adb.createClient();
var cmd = require('child_process');
var fbSerial;
var adbSerial;
function clearCache(){
sudo.rm('-rf', './.js/cache/*');
$('#console').text('Cache cleared.');
};
function OLDadbCheck(){
client.listDevices()
  .then(function(devices) {
   if (devices.length <= 0) {$('.tool').css('display','block'); throw new Error('No Device Detected.')};
    return Promise.filter(devices, function(device) {
      return client.getProperties(device.id)
        .then(function(properties) {
          if(properties['ro.product.model'] != "KFSOWI" && properties['ro.product.model'] != "") {	$('.tool').css('display','none');
		  throw new Error('Wrong Device. KS WILL brick this device');
        }})
    })
  })
  .then(function(supportedDevices) {
    $('#console').text('KFSOWI detected: '+ supportedDevices);
	$('.tool').css('display','block');
	$('#console').css('color','green');
  })
  .catch(function(err) {
    $('#console').text(err);
  })
  };  
function adbPush(local,kindle){
client.listDevices()
  .then(function(devices) {
    return Promise.map(devices, function(device) {
      return client.push(device.id, local, kindle)
        .then(function(transfer) {
          return new Promise(function(resolve, reject) {
            transfer.on('progress', function(stats) {
              $('#console').text('[%s] Pushed %d bytes so far',
                device.id,
                stats.bytesTransferred)
            })
            transfer.on('end', function() {
              $('#console').text('[%s] Push complete', device.id)
              resolve()
            })
            transfer.on('error', reject)
          })
        })
    })
  })
  .then(function() {
    $('#console').text('File upload complete.')
  })
  .catch(function(err) {
    $('#console').text('Error: ', err)
  })
  client.kill();
};
function adbPull(local,kindle){
client.listDevices()
  .then(function(devices) {
    return Promise.map(devices, function(device) {
      return client.pull(device.id, local, kindle)
        .then(function(transfer) {
          return new Promise(function(resolve, reject) {
            transfer.on('progress', function(stats) {
              $('#console').text('[%s] Pulled %d bytes so far',
                device.id,
                stats.bytesTransferred)
            })
            transfer.on('end', function() {
              $('#console').text('[%s] Pull complete', device.id)
              resolve()
            })
            transfer.on('error', reject)
          })
        })
    })
  })
  .then(function() {
    $('#console').text('File download complete.')
  })
  .catch(function(err) {
    $('#console').text('Error: ', err)
  })
  client.kill();
};
function adbShell(command){
  client.listDevices()
  .then(function(devices) {
    return Promise.map(devices, function(device) {
      return client.shell(device.id, command)
    })
  })
  .then(function() {
    $('#console').text(command+' completed.')
  })
  .catch(function(err) {
    $('#console').text('Error: ', err)
  })
  client.kill()
  }; 
function fastbootCheck(){
cmd.exec('fastboot -i 0x1949 devices',function(stdout){
if(stdout == null) $('#console').text('Error: No Fastboot Device Detected');
else if(stdout !== null)
   { command('fastboot -i 0x1949 devices', function(stdout){fbSerial = stdout.substr(0,16)})}
  })
};
function adbCheck(){
cmd.exec('fastboot -i 0x1949 devices',function(stdout){
if(stdout == null) $('#console').text('Error: No Fastboot Device Detected');
else if(stdout !== null)
   { command('fastboot -i 0x1949 devices', function(stdout){fbSerial = stdout.substr(0,16)})}
  })
};
  