var fbSerial;
var adbSerial;
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

};
function adbPull(local,kindle){

};
function adbShell(command){
 
  }; 
function fastbootCheck(){
 cmd('fastboot -i 0x1949 devices',function(stdout){
if(stdout == null) throw Error('No device detected (fastboot)');
else if(stdout !== null){fbSerial = stdout.substr(0,16);cmd('fastboot -i 0x1949 getvar product',function(stdout){
                                         if(stdout.match(/Soho/g) !== 'Soho'){fbSerial = null}})}
  })
};
function adbCheck(){
    cmd('adb devices',function(stdout){
        if(stdout == null) throw Error('No device detected (adb)');
        else if(stdout !== null){ adbSerial = stdout.substr(0,16);cmd('adb shell getprop ro.product.model', function(stdout){
		                                 if(stdout != 'KFSOWI'){adbSerial = null}})}
	  })
};
