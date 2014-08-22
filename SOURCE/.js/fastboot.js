var sudo = require('shelljs');

function fbDown(){
adbShell('su -c mount -o remount rw, /system');
adbShell('su -c dd if=/dev/block/mmcblk0p1 of=/sdcard/kernel.img');
adbPull('/sdcard/kernel.img', './cache/kernel.img');
var downGrade = sudo.exec('fastboot -i 0x1949 wait-for-device flash boot 11310.img');
downGrade.stdout.on('data', function(data) {
  $('#console').text(data)
});
};

function fbUp(){
var upGrade = sudo.exec('fastboot -i 0x1949 wait-for-device flash boot ./cache/kernel.img');
upGrade.stdout.on('data', function(data) {
  $('#console').text(data)
});
};
