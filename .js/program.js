var adb = require('adbkit');
var fs = require('fs')
var Promise = require('bluebird');
var client = adb.createClient();
var fbSerial;
var dev = null;
var markdown = require( "markdown" ).markdown;
var exec = require('child_process').exec;
function console(output){
$('#console').text(output);
}
function cmd(command, callback) {
    var proc = exec(command);
    var list = [];
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', function (chunk) {
        list.push(chunk);
    });
    proc.stdout.on('end', function () {
        callback(list.join());
    });
}
function fastbootCheck(){
setTimeout(
    cmd('fastboot -i 0x1949 devices',function(stdout){
	     if(stdout !== null && stdout !== ''){
                        cmd('fastboot -i 0x1949 getvar product',function(stdout){
                               if(stdout.match(/Soho/g)=='Soho'){console('fastboot >KFSOWI Detected.');fbSerial==true;}	
                               else{fbSerial==false;throw Error('fastboot >Unsupported Device.')}							   
											  })}
		 else{fbSerial==false;throw Error('fastboot >No device detected')}
	}),1000)
};
//complete
function adbCheck(){
client.listDevices()
  .then(function(devices) {
   if(devices !='' &&devices != null){
    return Promise.filter(devices, function(device) {
      return client.getProperties(device.id)
        .then(function(properties) {
		 	 dev = device.id;
          var model = properties['ro.product.model'];
		  if(model=='KFSOWI' || model=='sdk'){console('adb >KFSOWI detected.')
		                                      $('#console').css('color','green')}
		  else {dev=null;throw Error('adb >Unsupported device.')}
        })
    })
  }
  else {dev=null;throw Error('adb >No device detected')}
  })
  .catch(function(err) {
    console(err)
  })
}
function adbShell(command){
if(dev==null){throw Error('adb >No KFSOWI detected')};
client.shell(dev,command)
 .then(console('adb >'+command+' complete'))
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
  
  //ERROR Handler
		   process.on('uncaughtException', function (exception) {
   $('#console').css('color','red');
   $('#console').text(exception);
  }); 