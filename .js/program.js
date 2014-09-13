process.on('uncaughtException', function (exception) {
 console(exception)
  });
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
	       cmd('fastboot -i 0x1949 getvar product',function(code,output){
		      if(output.match(/Soho/g) != 'Soho'){fbSerial = null;}
		   })
	   }
	   else{fbSerial = null}

   })
  },1000)
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
function fastboot(command){
   var fb = cmd('fastboot -i 0x1949 '+command,{async:true})
   fb.stdout.on('data', function(data) {
  console(data)
});
};

  
  
  