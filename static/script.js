
$(document).ready(function() {
    // Your code here that uses the $ symbol

  var table = $('#example').DataTable({
    language: {
      emptyTable: "No duplicate files found"
    }
  });

$('.deleterow').on('click',function(){
 var tablename = $(this).closest('table').DataTable();  
 tablename
        .row( $(this)
        .parents('tr') )
        .remove()
        .draw();

} );

});

