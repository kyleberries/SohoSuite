//boot to fastboot mode
function root1(){
alert('Please power Kindle on as usual, but plug into fastboot cable');
if(adbSerial==null){throw Error('adb >No device detected');
                    $('#root').attr("onclick","root1()").attr("value","Root");}
client.reboot(adbSerial);
$('#root').attr("onclick","root2()").attr("value","Next");
console('Verify Kindle is in fastboot mode, and the fastboot indicator above is green ,then click next.');
};

//flash 11310 and reboot to adb
function root2(){
if(fbSerial==null){ $('#root').attr("onclick","root1()").attr("value","Root");
								  throw Error('fastboot >No device detected');}
  // possible async issue here
fastboot('flash boot ./.resources/11310/boot.img');
fastboot('continue');
$('#root').attr("onclick","root3()");
console('Please wait until device reconnects in adb mode above before continuing.');
};

//Run root exploit
function root3(){
if(adbSerial==null){throw Error('adb >No device detected');
                    $('#root').attr("onclick","root1()").attr("value","Root");}
adbPush('./.resources/root/su','/data/local/tmp/su');
adbPush('./.resources/root/exploit','/data/local/tmp/exploit');
adbPush('./.resources/root/rootme.sh','/data/local/tmp/rootme.sh');
adbShell('chmod 755 /data/local/tmp/*');
adbShell("/data/local/tmp/exploit -c '/data/local/tmp/rootme.sh'");
client.reboot(adbSerial);
console('Please wait until device reconnects in fastboot mode above before continuing.');
$('#root').attr("onclick","root4()").attr("value","Next");
};

//flash 11325 kernel/recovery
function root4(){
if(fbSerial==null){ $('#root').attr("onclick","root1()").attr("value","Root");
								  throw Error('fastboot >No device detected');}
  // possible async issue here
fastboot('flash boot ./.resources/11325/boot.img');
fastboot('flash recovery ./.resources/11325/recovery.img');
fastboot('continue');
$('#root').attr("onclick","root1()").attr("value","Root");
console('Kindle is rooted with 11.3.2.5');
};

