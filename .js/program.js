var adb = require('adbkit');
var fs = require('fs')
var Promise = require('bluebird');
var client = adb.createClient();
var markdown = require( "markdown" ).markdown;
var cmd = require('shelljs').exec;
var fbSerial = null;
var adbSerial = null;
var fbCheck = setInterval(function(){
   cmd('fastboot -i 0x1949 devices',function(code,output){
	//   if(output == '' || output == null){alert('test')}
	   	   if(output != '' && output != null){
	       fbSerial = output.substr(0,16);
		   $('#fb').css('color','green')
	       cmd('fastboot -i 0x1949 getvar product',function(code,output){
		      if(output.match(/Soho/g) != 'Soho'){fbSerial = null;
			                                      $('#fb').css('color','red')
												  $('#fb').text('err')}
		   })
	   }
	   else{fbSerial = null}
	   $('#fb').css('color','red')

   })
  },1000)
  
$(document).ready(function(){
  $('body').css('opacity','0')
  $('body').fadeTo(500,1);
});
function console(output){
$('#console').text(output);
}
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
setTimeout(function(){
client.trackDevices()
  .then(function(tracker) {
    tracker.on('add', function(device) {
      $('#adb').css('color','green')
	  adbSerial = device.id;
    })
    tracker.on('remove', function(device) {
      $('#adb').css('color','red')
	  adbSerial = null;
    })
    tracker.on('end', function() {
      $('#adb').text('err')
	  $('#adb').css('color','red')
	  adbSerial = null;
    })
  })
  .catch(function(err) {
      $('#adb').text('err')
	  $('#adb').css('color','red')
	  adbSerial = null;
  })
  },1000)
};
function fastboot(command){
   var fb = cmd('fastboot -i 0x1949 '+command,{async:true})
   fb.stdout.on('data', function(data) {
  console(data)
});
};



  //ERROR Handler
		   process.on('uncaughtException', function (exception) {
$('#console').css('color','red');
console(exception)
  }); 
  
  
  
  