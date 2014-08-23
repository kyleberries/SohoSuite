/*
if bad device alert('Unsupported device detected. All tools disabled')

if ADB = red && FASTBOOT = red alert('No Device Detected')

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
if(adb = 'true') $('.adbDot').css('color','green');
if(adb = 'false') $('.adbDot').css('color','red');
if(fastboot = 'true') $('.fastbootDot').css('color','green');
if(fastboot = 'flase') $('.fastbootDot').css('color','red');
if(fastboot = 'warning') $('.fastbootDot').css('color','yellow')
//functions
    function fastbootCheck(){
        terminal.exec('fastboot -i 0x1949 devices', function(code, output) {
            function(output){
	            if(output = "") 
			        {throw new Error('No Device Detected.');}
				if(output.match(/DEVICE/g)) 
				    {fastboot = 'warning';
				      alert('unknown device detected');}
				if(output != "")
				    {terminal.exec('fastboot -i 0x1949 getvar [kindle]',function(code,     output){
					         if(output == [kindle])
						  		{fastboot = 'true'}
						     if(output != [kindle])
						        {throw new Error('Bad Device Detected.')}
						   })
					   };
                             }
		.catch(function(err) 
		        {alert(err);
				 fastboot = 'false';
                });
		});
};		  
		  
    function adbCheck(){
        client.listDevices()
        .then(function(devices) {
             if (devices.length <= 0) {
			     $('.tool').css('display','block');
			     throw new Error('No Device Detected.')};
                 return Promise.filter(devices, function(device) {
		             $('.detector').css('text-shadow','1px 1px black');
                     return client.getProperties(device.id)
                     .then(function(properties) {
                         if(properties['ro.product.model'] != "KFSOWI" && properties['ro.product.model'] != "") {	
					       $('.tool').css('display','none');
		                   throw new Error('Wrong Device. KS WILL brick this device')}
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