var adb = require('adbkit');
var fs = require('fs')
var Promise = require('bluebird');
var client = adb.createClient();
var markdown = require( "markdown" ).markdown;
var shell = require('shelljs');
var fbSerial = null;
var dev = null;

$(document).ready(function(){
  $('body').css('opacity','0')
  $('body').fadeTo(500,1);
});

function console(output){
$('#console').text(output);
}
function fastbootCheck(){
   shell.exec('fastboot -i 0x1949 devices',function(code,output){
       if(output != ''){
	       fbSerial = output.substr(0,16);
	       shell.exec('fastboot -i 0x1949 getvar product',function(code,output){
		      if(output.match(/Soho/g) != 'Soho'){fbSerial = null;}
		   })
	   }

   })
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
if(dev==null){throw Error('adb >No KFSOWI detected')};
   client.shell(dev,command,function(err,output){
      output.on('data',function(chunk){
	    console('ADB> '+chunk)
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
	  dev = device.id;
    })
    tracker.on('remove', function(device) {
      $('#tracker').text('Device unplugged', device.id)
	  dev = null;
    })
    tracker.on('end', function() {
      $('#tracker').text('Tracking stopped')
	  dev = null;
    })
  })
  .catch(function(err) {
      $('#tracker').text('Something went wrong:', err.stack)
	  dev = null;
  })
};

function root(){
alert('Please power Kindle on as usual, but plug into fastboot cable');
if(dev==null)throw Error('No device detected');
client.reboot(dev);
console('Please wait...');
setTimeout(fastbootCheck(),5000);
setTimeout(function(){
 if(fbSerial!=null){
    shell.exec('fastboot -i 0x1949 continue')
	}
 else{console('No device detected')}
},7000)
};

  //ERROR Handler
		   process.on('uncaughtException', function (exception) {
$('#console').css('color','red');
console(exception)
  }); 