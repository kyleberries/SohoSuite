//VARIABLES
   //module 
var markdown = require( "markdown" ).markdown;
var fs = require('fs');
   //pages
var homeParsed;
var rootParsed;
var restoreParsed;
var iceParsed;
var hellfireParsed;
var plasmaParsed;
var extrasParsed;
var home = $.get('../.pages/home.txt',function(data){homeParsed = markdown.toHTML(data)});
var root = $.get('../.pages/root.txt',function(data){rootParsed = "<input type='button' id='rootBtn' onclick='rootInstall()' class='tool oneBtn' value='Root Kindle'></input><br />"+markdown.toHTML(data)});
var restore = $.get('../.pages/restore.txt',function(data){restoreParsed = "<input type='button' id='restoreBtn' onclick='restoreInstall()' class='tool oneBtn' value='Restore Kindle'></input><br />"+markdown.toHTML(data)});
var ice = $.get('../.pages/roms/ice.txt',function(data){iceParsed = "<input type='button' onclick='iceInstall()' id='iceBtn' class='tool oneBtn' value='Install Ice'></input><br />"+markdown.toHTML(data)});
var hellfire = $.get('../.pages/roms/hellfire.txt',function(data){hellfireParsed = "<input type='button' onclick='hellfireInstall()' id='hellfireBtn' class='tool oneBtn' value='Install Hellfire'></input><br />"+markdown.toHTML(data)});
var plasma = $.get('../.pages/roms/plasma.txt',function(data){plasmaParsed = "<input type='button' onclick='plasmaInstall()' id='plasmaBtn' class='tool oneBtn' value='Install Plasma'></input><br />"+markdown.toHTML(data)});
var extras = $.get('../.pages/extras.txt',function(data){extrasParsed = markdown.toHTML(data)});
   //window control
var nw = require('nw.gui');
var win = nw.Window.get();
win.isMaximized = false;
   //device control
var fbSerial = null;
var exec = require('child_process').exec;
//FUNCTIONS
   //tools
   //window control
function shutdown(){
win.close(killAdb())};
function mini(){
win.unmaximize()};
function maxi(){
            if (win.isMaximized)
               { win.unmaximize();
				$("#fullScreen").attr("src","../.icon/maximize.png");}
            else
              {  win.maximize();
				$("#fullScreen").attr("src","../.icon/minimize.png");}
        };
   //backend cleanup
function cmd(command, callback) {
    var proc = exec(command);

    var list = [];
    proc.stdout.setEncoding('utf8');

    proc.stdout.on('data', function (chunk) {
        list.push(chunk);
    });

    proc.stdout.on('end', function () {
        callback(list.join());
    });
}
function console(output){
 $('#console').text(output);
 }
function clearCache(){
sudo.rm('-rf', './.js/cache/*');
console('Cache cleared.');
}; 
   //adb server
function startAdb(){
    cmd('adb start-server',function(){var x = null;})
    cmd('adb devices',function(stdout){
	                                if(stdout.match(/recog/g) == 'recog') {alert('ADB not in PATH. Server not started.')}
	                               $('#bootAnim').delay(3000).fadeOut(500);
                                   $('.bootLoad').delay(3000).toggle(10);
								   setTimeout(function(){window.resizeTo(750, 500);window.moveTo(screen.width/2-300,screen.height/2-250);win.show();},3500);
								   })
}
function killAdb(){
    cmd('adb kill-server',function(){})
}
   //adb commands
function adbPush(local,kindle){
   if(adbSerial !== null){cmd('adb push -s '+adbSerial+' '+local+' '+kindle,function(stdout){console(stdout+' complete')})}
   else if(adbSerial == null) throw new Error('No device detected [adbPush]')
   else {throw new Error('xfer fail.')}
};
function adbPull(kindle,local){
   if(adbSerial !== null){cmd('adb pull -s '+adbSerial+' '+kindle+' '+local,function(stdout){console(stdout+' complete')})}
   else if(adbSerial==null)throw new Error('No device detected [adbPull]')
   else {throw new Error('xfer fail, or detection fail')}
};
function adbShell(command){
    if(adbSerial !== null){cmd('adb shell -s '+command,function(stdout){console(stdout+' complete')})}
   else if(adbSerial==null)throw new Error('No device detected [adbShell]')
   else {throw new Error('command fail, or detection fail')}
  }; 
   //Device Detector
function adbCheck(){
    cmd('adb devices',function(stdout){
        if(stdout.length<30) {throw Error('adb >No device detected.',001);$('.adb').css('color','red')}
        else if(stdout.length>30) {console(stdout.substr(30,40));
		                           adbSerial = stdout.substr(30,40);
								   cmd('adb shell getprop ro.product.model',function(stdout) {console('adb >'+stdout+' detected.');
										      $('#console').css('color','red')})
								   }
								  })
};
function fastbootCheck(){
    cmd('fastboot -i 0x1949 devices',function(stdout){
        if(stdout.length<15) {throw Error('fastboot >No device detected.',002);$('.fastboot').css('color','red')}
        else if(stdout.length>15) {console(stdout);$('.fastboot').css('color','green')}
})
};
   //kernel swap
function fbFlash(kernel){
 //cmd('fastboot -s '+fbSerial+' boot '+kernel, function(stdout){}
};
//JQUERY
function page(file,tool,btnvalue){
fs.readFile(file, 'utf8', function (err,data) {
  if (err) {
    throw Error('SoSu >Cannot load page. '+err,004);
  }
  $('#content').html(markdown.toHTML(data));
  $('#buttonWrap').html("<input type='button' class='tool oneBtn' onclick='"+tool+"()' value='"+btnvalue+"' />")
});
};
$(document).ready(function(){
  $('.romLink').click(function(){
  page('./.html/submitROM.txt','submitROM','Submit a ROM');
  $('.toggle').slideDown('slow')});
  $(function(){$('.scroll').slimScroll({height: '320px'});});
    $('#content').html(homeParsed);
    $("#rootLink").click(function(){
	      $('#content').hide();
		  $('.toggle').slideUp('slow');
	      page('./.html/root.txt','root','Root Kindle');
		  $('#content').fadeIn();
		  });
    $("#restoreLink").click(function(){
	      $('#content').hide();
		  $('.toggle').slideUp('slow');
	      page('./.html/restore.txt','restore','Restore Kindle');
		  $('#content').fadeIn();
	      });
	$("#iceLink").click(function(){
	      $('#content').hide();
	      page('./.html/roms/ice.txt','ice','Install Ice');
		  $('#content').fadeIn();
	      });
	$("#hellfireLink").click(function(){
	      $('#content').hide();
	      page('./.html/roms/hellfire.txt','hellfire','Install Hellfire');
		  $('#content').fadeIn();
		  });
	$("#plasmaLink").click(function(){
	      $('#content').hide();
	      page('./.html/roms/plasma.txt','plasma','Install Plasma');
		  $('#content').fadeIn();
		  });
	$("#extrasLink").click(function(){
	      $('#content').hide();
		  $('.toggle').slideUp('slow');
	      page('./.html/extras.txt','extras','N/A');
		  $('#content').fadeIn();
		  });
	$("#header").click(function(){
	$('.toggle').slideUp('slow');
fs.readFile('./.html/home.txt', 'utf8', function (err,data) {
   var devCheck = "<input type='button' value='ADB Devices' onclick='adbCheck()' class='tool' /><input type='button' value='FASTBOOT Devices' onclick='fastbootCheck()' class='tool' />";
  if (err) {
    throw Error('SoSu >Cannot load page. '+err,004);
  }
  $('#content').html(markdown.toHTML(data));
  $('#buttonWrap').html(devCheck);
    });
  });
		  
});
//BEFORELOAD
	        win.on('maximize', function(){
            win.isMaximized = true;
        });
            win.on('unmaximize', function(){
            win.isMaximized = false;
        });  
 fs.readFile('./.html/home.txt', 'utf8', function (err,data) {
   var devCheck = "<input type='button' value='ADB Devices' onclick='adbCheck()' class='tool' /><input type='button' value='FASTBOOT Devices' onclick='fastbootCheck()' class='tool' />";
  if (err) {
    throw Error('SoSu >Cannot load page. '+err,004);
  }
  $('#content').html(markdown.toHTML(data));
  $('#buttonWrap').html(devCheck);
    });	
	
		   process.on('uncaughtException', function (exception) {
   $('#console').css('color','red');
   console(exception);
  }); 