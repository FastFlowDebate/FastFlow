/*
jQuery(function($) {
  var $sidedrawerEl = $('#thefilemanager');

  function showMenu() {

  var $titleEls = $('strong', $sidedrawerEl);

  $titleEls
    .next()
    .hide();

  $titleEls.on('click', function() {
    $(this).next().slideToggle(200);
  });
});
