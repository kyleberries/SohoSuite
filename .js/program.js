var adb = require('adbkit');
var fs = require('fs')
var Promise = require('bluebird');
var client = adb.createClient();
var markdown = require( "markdown" ).markdown;
var shell = require('shelljs');
var fbSerial = null;
var adbSerial = null;

$(document).ready(function(){
  $('body').css('opacity','0')
  $('body').fadeTo(500,1);
});

function console(output){
$('#console').text(output);
}
function fastbootCheck(){
setInterval(function(){
   shell.exec('fastboot -i 0x1949 devices',function(code,output){
       if(output != ''){
	       fbSerial = output.substr(0,16);
	       shell.exec('fastboot -i 0x1949 getvar product',function(code,output){
		      if(output.match(/Soho/g) != 'Soho'){fbSerial = null;}
		   })
	   }

   })
  },5000)
}
/*function adbCheck(){
client.listDevices()
  .then(function(devices) {
   if(devices !='' &&devices != null){
    return Promise.filter(devices, function(device) {
      return client.getProperties(device.id)
        .then(function(properties) {
		 	 dev = device.id;
          var model = properties['ro.product.model'];
		  if(model!='KFSOWI'){dev = null}
        })
    })
  }
  else {dev=null}
  })
}*/
function adbShell(command){
if(dev==null){throw Error('adbShell >No KFSOWI detected')};
   client.shell(dev,command,function(err,output){
      output.on('data',function(chunk){
	    console('adbShell >'+chunk)
	  })
   })
};
function adbPush(local,remote){
if(dev == null){throw Error('No KFSOWI detected')}
client.listDevices()
  .then(function(devices) {
    return Promise.map(devices, function(device) {
      return client.push(device.id,local,remote)
        .then(function(transfer) {
          return new Promise(function(resolve, reject) {
            transfer.on('progress', function(stats) {
              console('[%s] Pushed %d bytes so far',
                device.id,
                stats.bytesTransferred)
            })
            transfer.on('end', function() {
              console('[%s] Push complete', device.id)
              resolve()
            })
            transfer.on('error', reject)
          })
        })
    })
  })
  .then(function() {
    console('Done pushing '+local+' to '+remote)
  })
  .catch(function(err) {
    connsole(err.stack)
  })
};
function track(){
client.trackDevices()
  .then(function(tracker) {
    tracker.on('add', function(device) {
      $('#tracker').text('Device Detected in ADB mode', device.id);
	  adbSerial = device.id;
    })
    tracker.on('remove', function(device) {
      $('#tracker').text('Device unplugged', device.id)
	  adbSerial = null;
    })
    tracker.on('end', function() {
      $('#tracker').text('Tracking stopped')
	  adbSerial = null;
    })
  })
  .catch(function(err) {
      $('#tracker').text('Something went wrong:', err.stack)
	  adbSerial = null;
  })
};

function root(){
alert('Please power Kindle on as usual, but plug into fastboot cable');
if(adbSerial==null)throw Error('No device detected');
client.reboot(dev);
console('Please wait...');
setTimeout(function(){
 if(fbSerial!=null){
    shell.exec('fastboot -i 0x1949 continue')
	}
 else{console('No device detected')}
},5000)
};

  //ERROR Handler
		   process.on('uncaughtException', function (exception) {
$('#console').css('color','red');
console(exception)
  }); 