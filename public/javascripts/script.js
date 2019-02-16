var name = $('#name').val();

$(document).ready(function(){
	//For feedback on contact form
    $('#submit').click(function(){
        $('#feedback').html('Thanks, your message has been sent.');
    });
	//to view add session form
	$('#addpage').click(function(){
		$('#add-form-view').removeClass('visibility');
		$('#hide-rest').addClass('visibility');
		$('#view-changepassword-form').addClass('visibility');
		});
	//to close add session form
	$('#close-2').click(function(){
		$('#add-form-view').addClass('visibility');
		$('#hide-rest').removeClass('visibility');
		$('#view-changepassword-form').addClass('visibility');
		
	})
	//to view change password form
	$('#change-password').click(function(){
		$('#view-changepassword-form').removeClass('visibility');
		$('#hide-rest').addClass('visibility');
		$('#add-form-view').addClass('visibility');
	});
	//to close change-password form.
	$('#close').click(function(){
		$('#view-changepassword-form').addClass('visibility');
		$('#add-form-view').addClass('visibility');
		$('#hide-rest').removeClass('visibility');
		
	})
});





//Chat Bot
<!-- Start of Async Drift Code -->
<script>
"use strict";

!function() {
  var t = window.driftt = window.drift = window.driftt || [];
  if (!t.init) {
    if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
    t.invoked = !0, t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ], 
    t.factory = function(e) {
      return function() {
        var n = Array.prototype.slice.call(arguments);
        return n.unshift(e), t.push(n), t;
      };
    }, t.methods.forEach(function(e) {
      t[e] = t.factory(e);
    }), t.load = function(t) {
      var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
      o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
      var i = document.getElementsByTagName("script")[0];
      i.parentNode.insertBefore(o, i);
    };
  }
}();
drift.SNIPPET_VERSION = '0.3.1';
drift.load('irysmudu95xp');
</script>
<!-- End of Async Drift Code -->