function restore1(){
alert('Please power Kindle off, and plug into fastboot cable');
if(fbSerial==null){$('#restore').attr("onclick","restore1()").attr("value","Restore");                   throw Error('fastboot >No Kindle detected')}
fastboot('getvar all');
fastboot('getvar product');
$('#restore').attr("onclick","restore2()").attr("value","Next");
alert('click next to reboot to home screen');
};
function restore2(){
fastboot('continue');
$('#restore').attr("onclick","restore1()").attr("value","Restore");
};