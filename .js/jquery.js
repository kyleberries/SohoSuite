$(document).ready(function(){
  $('#adbInstall').click(function(){window.open('bin/adbInstaller.exe')});
  $('.romLink').click(function(){$('.toggle').toggle('slow')});
  $(function(){
    $('.scroll').slimScroll({
        height: '550px'
    });
});
});