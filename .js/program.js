var markdown = require( "markdown" ).markdown;
var fs = require('fs');
var nw = require('nw.gui');
var win = nw.Window.get();
var exec = require('child_process').exec;

var fbSerial = null;

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

function shutdown(){
win.close(cmd('taskkill -F /im adb.exe',function(stdout){cmd('adb kill-server',function(stdout){console.log(stdout)})}));
this.close(true);
};

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
 $('#console').css('color','green');
 }
 
function startAdb(){
    cmd('adb start-server',function(){var x = null;});
								   $('#wrapper').hide();
	                               $('#bootAnim').delay(3000).fadeOut(500);
                                   $('.bootLoad').delay(3000).toggle(10);
								   $('#wrapper').delay(3500).fadeIn(500);
}

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
   
function adbCheck(){
setTimeout(
    cmd('adb shell getprop ro.product.model',function(stdout){
        if(stdout == '' || stdout == null) {throw Error('adb >No device detected.')}
		else if(stdout.match(/KFSOWI/g) == 'KFSOWI'){console('adb >KFSOWI detected.')}
		else {throw Error('adb >Unsupported device.')}
	}),1000)
};

function fastbootCheck(){
setTimeout(
    cmd('fastboot -i 0x1949 devices',function(stdout){
	     if(stdout !== null && stdout !== ''){
		                fbSerial == stdout.substr(0,16);
                        cmd('fastboot -i 0x1949 getvar product',function(stdout){
                               if(stdout.substr(0,3) == 'Soho'){console('fastboot >KFSOWI detected')}
                               else{fbSerial == null;throw Error('fastboot >Unsupported device.')}							   
											  })}
		 else{throw Error('fastboot >No device detected')}
	}),1000)
};

function fbFlash(kernel){
 //cmd('fastboot -s '+fbSerial+' boot '+kernel, function(stdout){}
};

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

 fs.readFile('./.html/home.txt', 'utf8', function (err,data) {
   var devCheck = "<input type='button' value='ADB Devices' onclick='adbCheck()' class='tool' /><input type='button' value='FASTBOOT Devices' onclick='fastbootCheck()' class='tool' />";
  if (err) {
    throw Error('SoSu >Cannot load page. '+err,004);
  }
  $('#content').html(markdown.toHTML(data));
  $('#buttonWrap').html(devCheck);
    });	
	
//ERROR Handler
		   process.on('uncaughtException', function (exception) {
   $('#console').css('color','red');
   $('#console').text(exception);
  }); 