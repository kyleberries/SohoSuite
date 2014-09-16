//flash 11310 kernel/recovery and minisystem
function restore1(){
alert('Please power Kindle off, and plug into fastboot cable');
fbCheck();
if(fbSerial==null){$('#restore').attr("onclick","restore1()").attr("value","Restore");}
fastboot('getvar product');
fastboot('continue');
};

/*run wipe, and restore
function restore2(){
if(adbSerial==null){throw Error('fastboot >No device detected');
                    $('#restore').attr("onclick","restore1()").attr("value","Restore");}
adbShell('su -c mount -o remount rw, /data');
adbShell('su -c rm -rf /data/*');
adbShell('su -c chmod 777 /cache');
adbShell('su -c mount -o remount rw, /cache')
adbShell('mkdir /cache/recovery');
adbPush('./.resources/restore/update.zip','/cache/update.zip');
adbShell('su -c echo --update_package=/cache/update.zip>/cache/recovery/command')
console('Please unplug Kindle, and plug in with USB cable. When device reconnects click next.');
$('#restore').attr("onclick","restore3()");
};

//execute restore
function restore3(){
adbShell('su -c reboot recovery');
console('Kindle will display upgrade screen, and restore to stock.');
$('#restore').attr("onclick","restore1()").attr("value","Restore");
};*/