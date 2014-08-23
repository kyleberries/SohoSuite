/*
ALWAYS use fastboot cable unless directed otherwise (restore, possibly roms)


----------------------GUI----------------------------------------
ADB  FASTBOOT                SohuSuite    alpha_ver0.5
 O      O <  id='adb/fastbootDot'
{--------} >red or green, click to retest
-----------------------------------------------------------------
*/

//Global variables
var terminal = require('shelljs');
var Promise = require('bluebird');
var adbkit = require('adbkit');
var client = adbkit.createClient();
var adb;
var fastboot;

//if-else
if(adb = 'true') 
     {
	   $('.adbDot').css('color','green');
	   $('#console').text('Device Detected');
	 }
if(adb = 'false') $('.adbDot').css('color','red');
if(fastboot = 'true') 
     {
	  $('.fastbootDot').css('color','green');
      $('#console').text('Device Detected');
	 }
if(fastboot = 'false') $('.fastbootDot').css('color','red');
if(fastboot = 'warning') $('.fastbootDot').css('color','yellow');

//functions
    
	//Check for device in Fastboot and verify it is a KFSOWI
    function fastbootCheck(){
        terminal.exec('fastboot -i 0x1949 getvar product', function(output) {
	            if(output.match(/Soho/g) != 'Soho') 
			        {throw new Error('No fastboot kindle device detected.')}
				if(output.match(/Soho/g = 'Soho')
				    {terminal.exec('fastboot -i 0x1949 devices',function(output){
							fbSerial = output.substr(0,16)
							fastboot = 'true';
						   })
					       };
		                   });
		.catch(function(err){
		    alert(err);
		    fastboot = 'false';
			fbSerial = null;
                });
};		  
		
    //Check for booted device and verify it is a KFSOWI		
    function adbCheck(){
        client.listDevices()
        .then(function(devices) {
             if (devices.length <= 0) {
			     $('.tool').css('display','block');
			     throw new Error('No ADB Device Detected.')};
                 return Promise.filter(devices, function(device) {
                     return client.getProperties(device.id)
                     .then(function(properties) {
                         if(properties['ro.product.model'] != "KFSOWI" && properties['ro.product.model'] != "") {	
					       $('.tool').css('display','none');
		                   throw new Error('Wrong Device. SoSu WILL brick this device')}
		                });
                        });
                        });
         .then(function(supportedDevices) {
	        adb = 'true';
	        $('.tool').css('display','block')})
        .catch(function(err) {
             alert(err);
		     adb = 'false'})
  };