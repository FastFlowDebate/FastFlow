// ==========================================================================
// Add footer (requires JQuery imported or used above this in DOM)
// ==========================================================================

$(function () {
  $.get('shtml/footer.shtml', function (data) {
    $('#content-wrapper').append(data)
  })
})
