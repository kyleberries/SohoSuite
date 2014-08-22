var sudo = require('shelljs');
var adb = require('adbkit');
var client = adb.createClient();

sudo.exec('fastboot command',function(err){callback};