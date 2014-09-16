process.on('uncaughtException', function (exception) {
 console(exception)
  });
var adb = require('adbkit');
var fs = require('fs')
var Promise = require('bluebird');
var client = adb.createClient();
var markdown = require( "markdown" ).markdown;
var cmd = require('shelljs').exec;
var fbSerial = fbCheck();
var adbSerial = null;

var adbCheck = setTimeout(function(){
client.trackDevices()
  .then(function(tracker) {
    tracker.on('add', function(device) {
	  adbSerial = device.id;
    })
    tracker.on('remove', function(device) {
	  adbSerial = null;
    })
    tracker.on('end', function() {
	  adbSerial = null;
    })
  })
  .catch(function(err) {
	  adbSerial = null;
  })
  },1000)
var detector = setInterval(function(){
if(adbSerial!==null){$('#indicator').text('connected >ADB')
                                    $('#indicator').css('color','green')}
if(fbSerial!==null){$('#indicator').text('connected >FASTBOOT')
                                  $('#indicator').css('color','green')}
if(fbSerial==null&&adbSerial==null){$('#indicator').text('No Kindle connected')
                                  $('#indicator').css('color','red')}
},2000) 
function fbCheck(){ 
var fbDevice = null;
   cmd('fastboot -i 0x1949 devices',function(code,output){
	//   if(output == '' || output == null){alert('test')}
	   	   if(output != '' && output != null){
	       fbDevice = output.substr(0,16);
	       cmd('fastboot -i 0x1949 getvar product',function(code,output){
		      if(output.match(/Soho/g) != 'Soho'){fbDevice = null;}
		   })
	   }
	   else{fbDevice = null}

   })
   return fbDevice;
};

function console(output){
$('#console').text(output);
}
function adbShell(command){
if(adbSerial==null){throw Error('adbShell >No KFSOWI detected')};
   client.shell(adbSerial,command,function(err,output){
      output.on('data',function(chunk){
	    console('adbShell >'+chunk)
	  })
   })
};
function adbPush(local,remote){
if(adbSerial == null){throw Error('No KFSOWI detected')}
client.listDevices()
  .then(function(devices) {
    return Promise.map(devices, function(device) {
      return client.push(adbSerial,local,remote)
        .then(function(transfer) {
          return new Promise(function(resolve, reject) {
            transfer.on('progress', function(stats) {
              console('[%s] Pushed %d bytes so far',
                adbSerial,
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
function fastboot(command){
   if (fbSerial==null) throw Error('fastboot No Kindle Detected')
   cmd('fastboot -i 0x1949 '+command,function(code,output){
   if(output=='' || output==null) throw Error(command,output)
   if(code !== 0) throw Error('Unknown Error')
   console(output)
   })
};
