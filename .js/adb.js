var fbSerial = null;
var adbSerial = null;
var exec = require('child_process').exec;
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
function console(output){
 $('#console').text(output);
 }
function clearCache(){
sudo.rm('-rf', './.js/cache/*');
console('Cache cleared.');
}; 
function adbPush(local,kindle){
   if(adbSerial !== null){cmd('adb push -s '+adbSerial+' '+local+' '+kindle,function(stdout){console(stdout+' complete')})}
   else if(adbSerial == null) throw new Error('No device detected [adbPush]')
   else {throw new Error('xfer fail.')}
};
function adbPull(kindle,local){
   if(adbSerial !== null){cmd('adb pull -s '+adbSerial+' '+kindle+' '+local,function(stdout){console(stdout+' complete')})}
   else if(adbSerial==null)throw new Error('No device detected [adbPull]')
   else {throw new Error('xfer fail, or detection fail')}
};
function adbShell(command){
    if(adbSerial !== null){cmd('adb shell -s '+command,function(stdout){console(stdout+' complete')})}
   else if(adbSerial==null)throw new Error('No device detected [adbShell]')
   else {throw new Error('command fail, or detection fail')}
  }; 
function fbFlash(kernel){
 //cmd('fastboot -s '+fbSerial+' boot '+kernel, function(stdout){}
};
function fastbootCheck(){
 cmd('fastboot -i 0x1949 devices',function(stdout){
if(stdout == null||stdout=='') throw Error('No device detected',002);
else if(stdout !== null$$stdout!==''){fbSerial = stdout.substr(0,16);cmd('fastboot -i 0x1949 getvar product',function(stdout){
                                         if(stdout.match(/Soho/g) !== 'Soho'){fbSerial = null}})}
  })
  if(fbSerial!==null){$('.fastboot').css('color','green');console('Fastboot Detected');}
else if(fbSerial==null)$('.fastboot').css('color','red');
};
function adbCheck(){
    cmd('adb devices',function(stdout){
	    var ret = stdout;
        if(stdout.match(/device/) !=='device') throw Error('No device detected',001);
        else if(stdout.match(/device/) =='device'){ adbSerial = stdout.substr(0,16);cmd('adb shell getprop ro.product.model', function(stdout){
		                                 if(stdout != 'KFSOWI'){adbSerial = null}})}
	  })
	  if(adbSerial!==null){$('.adb').css('color','green');console('Adb Detected');}
else if(adbSerial==null)$('.adb').css('color','red');
};
function root(){
console('ROOT coming soon...');
/*
fastbootCheck();

*/
};
function restore(){
console('RESTORE coming soon...')
};
function iceInstall(){
console('ICE coming soon...')
};
function hellfireInstall(){
console('HELLFIRE coming soon...')
};
function plasmaInstall(){
console('PLASMA coming soon...')
};










process.on('uncaughtException', function (exception) {
   console(exception)
  }); 