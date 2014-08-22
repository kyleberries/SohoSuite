var sudo = require('shelljs');
var Promise = require('bluebird');
var adb = require('adbkit');
var client = adb.createClient();

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
  
function fbDown(){
$('#console').text(sudo.ls());
/*
adbShell('su -c mount -o remount rw, /system');
adbShell('su -c dd if=/dev/block/mmcblk0p1 of=/sdcard/kernel.img');
adbPull('/sdcard/kernel.img', './.js/cache/kernel.img');
$('#console').text('Downgrading Kernel. Please enter fastboot mode');
var downGrade = sudo.exec('fastboot -i 0x1949 wait-for-device flash boot ./resources/11310.img');
downGrade.stdout.on('data', function(data) {
  $('#console').text(data)
});*/
};

function fbUp(){
alert('done');
/*$('#console').text('Upgrading Kernel. Please enter fastboot mode');
var upGrade = sudo.exec('fastboot -i 0x1949 wait-for-device flash boot ./.js/cache/kernel.img');
upGrade.stdout.on('data', function(data) {
  $('#console').text(data)
});*/
};

function rootTest(){
fbDown();
/*adbPush('./.resources/root/su','/data/local/tmp/su');
adbPush('./.resources/root/exploit','/data/local/tmp/exploit');
adbPush('./.resources/root/rootme.sh','/data/local/tmp/rootme.sh');
adbPush('./.resources/root/root.sh','/data/local/tmp/root.sh');
adbShell('chmod 755 /data/local/tmp/*');
adbShell('/data/local/tmp/root.sh');*/
fbUp();
};

  
