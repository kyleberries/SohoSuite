function rom1(rom){
alert('Please power Kindle on as usual, but plug into fastboot cable');
if(adbSerial==null){throw Error('adb >No device detected');
                    $('#rom').attr("onclick","rom1(rom)").attr("value","Install ROM");}
client.reboot(adbSerial);
$('#rom').attr("onclick","rom2(rom)").attr("value","Next");
console('Verify Kindle is in fastboot mode, and the fastboot indicator above is green ,then click next.');
};

function rom2(rom){
if(fbSerial==null){throw Error('fastboot >No device detected');
                    $('#rom').attr("onclick","rom1(rom)").attr("value","Install ROM");}
fastboot('erase userdata');
fastboot('erase cache');
fastboot('flash system ./.resources/rom/'+rom+'.img');
fastboot('continue');
$('#rom').attr("onclick","rom1(rom)").attr("value","Install ROM");
console('ROM install complete. Booting now');
};
