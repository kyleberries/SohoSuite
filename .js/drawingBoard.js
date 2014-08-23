if bad device alert('Unsupported device detected. All tools disabled')

if ADB = red && FASTBOOT = red alert('No Device Detected')

ALWAYS use fastboot cable unless directed otherwise (restore, possibly roms)

----------------------GUI----------------------------------------
ADB  FASTBOOT                SohuSuite    alpha_ver0.5
 O      O <  id='adb/fastbootDot'
{--------} >red or green, click to retest
-----------------------------------------------------------------

var adb;
var fastboot;


check connected device.id. (loop once for adb and fastboot?)
if return does not contain "DEVICE"
   check 'ro.product.model'
    if 'ro.product.model' = 'KFSOWI'
	   check 'ro.build.incremental' && var fireOS = incremental - extra text
	      if fireOS != kernels[] $('#console').text('Error: FireOS version unsupported')
		  else{  .catch(function(err) {$('#console').text('Error: ', err)})}
		  
		  

		  
    function fastbootCheck(){
       sudo.exec('fastboot -i 0x1949 devices', function(code, output) {
            function(output){
	            if(output = "") 
			        {throw new Error('No Device Detected.');}
				if(output.match(/DEVICE/g)) 
				    {$('#fastbootDot').css('color','yellow');
				      alert('unknown device detected');}
				if(output != "")
				    {sudo.exec('fastboot -i 0x1949 getvar [kindle]',function(code,     output){
					      if(output == [kindle])
						  		{$('#fastbootDot').css('color','green');}
						  if(output != [kindle])
						        {alert('Bad device detected! tools disabled');
								  $('.tools').css('display','none')}
						   })
					   };
                             }
		.catch(function(err) 
		         {alert(err);
				  $('#fastbootDot').css('color','red');
                  })
		});
};		  

		  
		  
		  function adbCheck(){
client.listDevices()
  .then(function(devices) {
   if (devices.length <= 0) {$('.tool').css('display','block'); throw new Error('No Device Detected.')};
    return Promise.filter(devices, function(device) {
		$('.detector').css('text-shadow','1px 1px black');
      return client.getProperties(device.id)
        .then(function(properties) {
          if(properties['ro.product.model'] != "KFSOWI" && properties['ro.product.model'] != "") {	$('.tool').css('display','none');
		  throw new Error('Wrong Device. KS WILL brick this device');
		  $('#adbDot').css('color','red');
        }})
    })
  })
  .then(function(supportedDevices) {
    $('#detector').text('KFSOWI detected: '+ supportedDevices
	adb = true;
	$('.tool').css('display','block');
	$('#adbDot').css('color','green');
  })
  .catch(function(err) {
    alert(err);
		$('#adbDot').css('color','red');
  })
  };