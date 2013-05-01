//= require jquery
//= require jquery_ujs

$(function() {
  $('.popup').click(function(){
    window.open(this.href, 'pwin','width=640,height=500,resizable=yes,scrollbars=yes');
    return false;
  });
});