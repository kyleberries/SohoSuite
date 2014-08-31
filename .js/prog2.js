var adb = require('adbkit');
var Promise = require('bluebird');
var client = adb.createClient();

function console(stdout){
$('#console').text(stdout);
}
function adbCheck(){
client.trackDevices()
  .then(function(tracker) {
    tracker.on('add', function(device) {
	  client.shell(device,'getprop ro.product.model',function(output){
	    if(output=='KFSOWI'){console('adb >KFSOWI Detected.');
		                    $('.tool').css('display','block')}
		else throw Error('adb >Unsupported device.')
	  })})
    tracker.on('remove', function(device) {
      console('Device was unplugged', device.id);
	  $('.tool').css('display','none');
    })
    tracker.on('end', function() {
      console('Tracking stopped');
	  $('.tool').css('display','none');
    })
  })
  .catch(function(err) {
    $('.tool').css('display','none');
    throw Error('Error:', err.stack)
  })
}
function adbPush(local,remote){
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
    console('Done pushing '+local+'to Kindle')
  })
  .catch(function(err) {
    throw Error('Something went wrong:', err.stack)
  })
  client.kill();
};
function adbPull(name,remote,local){
client.listDevices()
  .then(function(devices) {
    return Promise.map(devices, function(device) {
      return client.pull(device.id, remote)
        .then(function(transfer) {
          return new Promise(function(resolve, reject) {
            var fn = './.js/cache/' + device.id + name
            transfer.on('progress', function(stats) {
              console('[%s] Pulled %d bytes so far',
                device.id,
                stats.bytesTransferred)
            })
            transfer.on('end', function() {
              console('[%s] Pull complete', device.id)
              resolve(device.id)
            })
            transfer.on('error', reject)
            transfer.pipe(fs.createWriteStream(fn))
          })
        })
    })
  })
  .then(function() {
    console('Done pulling '+remote+' from Kindle')
  })
  .catch(function(err) {
    throw Error('Something went wrong:', err.stack)
  })
  client.kill();
};

function adbShell(command){
client.shell(device,command,function(output) console(output))
}

function adbReboot(){
adbShell('su -c reboot');
};

//ERROR Handler
		   process.on('uncaughtException', function (exception) {
   $('#console').css('color','red');
   console(exception);
  }); 