//flash 11310 kernel/recovery and minisystem
function restore1(){
alert('Please power Kindle off, and plug into fastboot cable');
fbCheck();
if(fbSerial==null){$('#restore').attr("onclick","restore1()").attr("value","Restore");}
fastboot('getvar product');
fastboot('getvar all');
$('#restore').attr("onclick","restore2()").attr("value","Next");
alert('click next to reboot to home screen');
};

//run wipe, and restore
function restore2(){
fastboot('continue');
$('#restore').attr("onclick","restore1()").attr("value","Restore");
};