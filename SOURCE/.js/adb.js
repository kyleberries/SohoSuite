var sudo = require('shelljs');
var Promise = require('bluebird');
var whichOs = require('which-os');
var adb = require('adbkit');
var client = adb.createClient();
var kfsowi = null;
var fastbootSuffix;
var currentOs = whichOs().search("Windows");
var fireOs;

if(currentOs != -1) fastbootSuffix = ".cmd";
else if(currentOs = -1) fastbootSuffix = ".sh";


function clearCache(){
sudo.rm('-rf', './.js/cache/*');;
};

function kindleCheck(){
     setInterval(function(){
client.listDevices()
  .then(function(devices) {
   if (devices.length <= 0) {$('.tool').css('display','block'); throw new Error('No Device Detected.')};
    return Promise.filter(devices, function(device) {
		$('.detector').css('text-shadow','1px 1px black');
      return client.getProperties(device.id)
        .then(function(properties) {
          if(properties['ro.product.model'] != "KFSOWI" && properties['ro.product.model'] != "") {	$('.tool').css('display','none');
		  throw new Error('Wrong Device. KS WILL brick this device');
        }})
    })
  })
  .then(function(supportedDevices) {
    $('#detector').text('KFSOWI detected: '+ supportedDevices);
	$('.tool').css('display','block');
	$('#detector').css('color','green');
  })
  .catch(function(err) {
    $('#detector').text(err);
  })},100)};
  
  
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
    $('#console').text('Error: ', err.stack)
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

  
  function fbDown(){
adbShell('su -c mount -o remount rw, /system');
adbShell('su -c dd if=/dev/block/mmcblk0p1 of=/sdcard/kernel.img');
adbPull('/sdcard/kernel.img', './.js/cache/kernel.img');
var downGrade = sudo.exec('fastboot -i 0x1949 wait-for-device flash boot ./.js/11310.img');
downGrade.stdout.on('data', function(data) {
  $('#console').text(data)
});
};

function fbUp(){
var upGrade = sudo.exec('fastboot -i 0x1949 wait-for-device flash boot ./.js/cache/kernel.img');
upGrade.stdout.on('data', function(data) {
  $('#console').text(data)
});
};

  
