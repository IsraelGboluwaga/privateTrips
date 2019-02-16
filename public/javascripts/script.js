var name = $('#name').val();

$(document).ready(function () {
	//For feedback on contact form
	$('#submit').click(function () {
		$('#feedback').html('Thanks, your message has been sent.');
	});
	//to view add session form
	$('#addpage').click(function () {
		$('#add-form-view').removeClass('visibility');
		$('#hide-rest').addClass('visibility');
		$('#view-changepassword-form').addClass('visibility');
	});
	//to close add session form
	$('#close-2').click(function () {
		$('#add-form-view').addClass('visibility');
		$('#hide-rest').removeClass('visibility');
		$('#view-changepassword-form').addClass('visibility');

	})
	//to view change password form
	$('#change-password').click(function () {
		$('#view-changepassword-form').removeClass('visibility');
		$('#hide-rest').addClass('visibility');
		$('#add-form-view').addClass('visibility');
	});
	//to close change-password form.
	$('#close').click(function () {
		$('#view-changepassword-form').addClass('visibility');
		$('#add-form-view').addClass('visibility');
		$('#hide-rest').removeClass('visibility');

	})
});



