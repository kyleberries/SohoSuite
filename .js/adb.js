var fbSerial = null;
var adbSerial = null;
function cmd(command,callback){
 require('child_process').exec(command,callback);
 }
function console(output){
 $('#console').text(output);
 }
function clearCache(){
sudo.rm('-rf', './.js/cache/*');
$('#console').text('Cache cleared.');
}; 
function adbPush(local,kindle){
   if(adbSerial !== null){cmd('adb push -s '+adbSerial+' '+local+' '+kindle,function(stdout){console(stdout)})}
   else {throw new Error('xfer fail, or detection fail')}
};
function adbPull(kindle,local){
   if(adbSerial !== null){cmd('adb pull -s '+adbSerial+' '+kindle+' '+local,function(stdout){console(stdout)})}
   else {throw new Error('xfer fail, or detection fail')}
};
function adbShell(command){
    if(adbSerial !== null){cmd('adb shell -s '+command,function(stdout){console(stdout)})}
   else {throw new Error('command fail, or detection fail')}
  }; 
function fastbootCheck(){
 cmd('fastboot -i 0x1949 devices',function(stdout){
if(stdout == null) throw Error('No device detected');
else if(stdout !== null){fbSerial = stdout.substr(0,16);cmd('fastboot -i 0x1949 getvar product',function(stdout){
                                         if(stdout.match(/Soho/g) !== 'Soho'){fbSerial = null}})}
  })
};
function adbCheck(){
    cmd('adb devices',function(stdout){
        if(stdout == null) throw Error('No device detected');
        else if(stdout !== null){ adbSerial = stdout.substr(0,16);cmd('adb shell getprop ro.product.model', function(stdout){
		                                 if(stdout != 'KFSOWI'){adbSerial = null}})}
	  })
};
function detector(){
fastbootCheck();
if(fbSerial!==null)$('.fastboot').css('color','green');
else if(fbSerial==null)$('.fastboot').css('color','red');
adbCheck();
if(adbSerial!==null)$('.adb').css('color','green');
else if(adbSerial==null)$('.adb').css('color','red');
};

process.on('uncaughtException', function (exception) {
   console(exception.message)
  }); 