
var name = $('#name').val();

$(document).ready(function(){
    $('#submit').click(function(){
        $('#feedback').html('Thanks ' + name + ' your message has been sent.')
    });
});