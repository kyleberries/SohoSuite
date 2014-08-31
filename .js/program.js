var adb = require('adbkit');
var Promise = require('bluebird');
var client = adb.createClient();
var fbSerial;
var markdown = require( "markdown" ).markdown;
var exec = require('child_process').exec;
function console(stdout){
$('#console').text(stdout);
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
function fbFlash(kernel){
 //cmd('fastboot -s '+fbSerial+' boot '+kernel, function(stdout){}
};

function adbCheck(){
client.listDevices()
  .then(function(devices) {
   if(devices !='' &&devices != null){
    return Promise.filter(devices, function(device) {
      return client.getProperties(device.id)
        .then(function(properties) {
          var model = properties['ro.product.model'];
		  if(model=='KFSOWI' || model=='sdk'){console('adb >KFSOWI detected.')
		                                      $('#console').css('color','green')}
		  else {throw Error('adb >Unsupported device.')}
        })
    })
  }
  else throw Error('adb >No device detected');
  })
  .catch(function(err) {
    console(err)
  })
}

//ERROR Handler
		   process.on('uncaughtException', function (exception) {
   $('#console').css('color','red');
   $('#console').text(exception);
  }); 