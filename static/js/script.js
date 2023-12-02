
$(document).ready(function() {
  // Your code here that uses the $ symbol
  var dataTableInitialized = false;

$('.BarTitle').click(function() {
  console.log("clicked");
  var tableData = []; 

  var files = $('#pathInput').prop('files');
  var formData = new FormData();

   // Append each file to the FormData object
   for (var i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  var entries = Array.from(formData.entries());
var length = entries.length;

// console.log(entries,length);

//   console.log(formData,formData.length)

  $.ajax({
    url: '/duplicate',
    type: 'POST', 
    data: formData,
    processData: false,
    contentType: false,
    success: function(data) {
      // Update the HTML with the received result
      console.log(data);
      data.duplicates.forEach(function(duplicate) {
        var file_path = duplicate[0];
        var original_file_path = duplicate[1];
        var creation_date = duplicate[2];
        
        tableData.push([file_path, original_file_path, creation_date]);
    });

    if (dataTableInitialized) {
      // DataTable already initialized, so destroy it first
      $('#example').DataTable().destroy();
      dataTableInitialized = false;
  }
    
    $('#example').DataTable({
        data: tableData,
        language: {
            emptyTable: "No duplicate files found"
        },
        columns: [
            { title: "Duplicate File Full Path" ,className: "duplicate-file-cell"},
            { title: "Original File Full Path",className: "duplicate-file-cell" },
            { title: "Date Of Creation",className: "duplicate-file-cell" }
        ],
        columnDefs: [
          {
            targets: [0], // Specify the column index where the sorting button should be removed
            orderable: false, // Disable sorting for this column
            
          }
        ]
    });
    dataTableInitialized = true; // Set the flag to indicate DataTable is initialized
    },
    error: function(error) {
      console.log('error has occured')
      console.log(error)
    }
  });
});

$('.deleterow').on('click',function(){
var tablename = $(this).closest('table').DataTable();  
tablename
      .row( owner.parents('tr'))
      .remove()
      .draw();

} );






var deleteBox = $('<span class="deleteBox"><i class="fa fa-exclamation-triangle" aria-hidden="true" style="font-size:30px;margin-top:4%;"></i><p>Are you sure you want to delete?</p><span class="cancel">Cancel</span><span class="confirm">Yes</span></span>');
$(document).on('click', '.delete', function(){
$(this).append(deleteBox);
//background
$('body').addClass('blur-effect');
$('.SearchContainer').css('background-color',null);

var rowToDelete = $(this).closest('tr');
console.log('hello');
var rowData = retrieveRowData(rowToDelete); 
console.log(rowData)

if(!$(this).hasClass('selected')){
  $(this).addClass('selected');
  var owner = $(this);
  
  $(this).find('.cancel').unbind('click').bind('click',function(){
    owner.removeClass('selected');
    $('body').removeClass('blur-effect');
    return false;
  })
  
  $(this).find('.confirm').unbind('click').bind('click',function(){
    $(this).parent().addClass('loading');
    var parent = $(this).parent();
    
    //ajax to delete
    
    setTimeout(function(){ //On success
      parent.addClass('deleted');
      setTimeout(function(){
        owner.fadeOut(600);
        
        //remove item deleted

        deleteRowFromTable(rowToDelete);
        
        setTimeout(function(){
          owner.find('.deleted').removeClass('loading').removeClass('deleted');
          owner.removeClass('selected');
          owner.show();

          var tablename = $(this).closest('table').DataTable();  
tablename
      .row( $(this)
      .parents('tr') )
      .remove()
      .draw();
      
        },1000)	
      },1000)
      deleteFile(rowData.duplicateFilePath)
      $('body').removeClass('blur-effect');
    },1200)
   
    return false;
  })
}		
return false;
});


function retrieveRowData(row) {
  // Retrieve the data from the row and return it as an object
  var rowData = {};

  rowData.action = row.find('td:eq(0)').text().trim();
  rowData.duplicateFilePath = row.find('td:eq(1)').text().trim();
  rowData.originalFilePath = row.find('td:eq(2)').text().trim();
  rowData.dateOfCreation = row.find('td:eq(3)').text().trim();

  return rowData;
}


function deleteRowFromTable(row) {
var table = $('#example').DataTable(); // Replace "example" with your table ID

table
  .row(row)
  .remove()
  .draw(false);
}


function deleteFile(file_path) {
  console.log('deletemethod called',file_path)
  $.ajax({
    url: '/delete_file',  // Specify the server endpoint to handle the delete request
    method: 'DELETE',  // Use the appropriate HTTP method (POST, DELETE, etc.)
    data: { file_path: file_path },  // Pass the file ID as data to the server
    success: function(response) {
      // Handle the response from the server
      console.log(response);
    },
    error: function(xhr, status, error) {
      // Handle any errors that occur during the AJAX request
      console.error(error);
    }
  });
}








});

