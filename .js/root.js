function root1(){
//alert('Please power Kindle on as usual, but plug into fastboot cable');
//if(adbSerial==null)throw Error('adbSerial >No device detected');
//client.reboot(adbSerial);
$('#root').attr("onclick","root2()");
$('#root').attr("value","Next");
console('Verify Kindle is in fastboot mode, and the fastboot indicator above is green ,then click next.');
};
function root2(){
setTimeout(function(){
if(fbSerial==null||fbSerial==''){ $('#root').attr("onclick","root1()");
                                  $('#root').attr("value","Root");
								  throw Error('fbSerial >No device detected');}
fastboot('continue');
$('#root').attr("onclick","root1()");
$('#root').attr("value","Root");
console('Verify Kindle is back in adb mode, adb the adb indicator above is green ,then click next.');
},1200)
};

