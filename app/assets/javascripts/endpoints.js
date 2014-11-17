// returns JSON or an empty array if invalid JSON
function parseJSON(params){
    try{
        params = JSON.parse(params);
    }
    catch(e){
        params = [];
    }

    return params;
}

$(document).ready(function() {
    $(".field_with_errors").parent().parent().addClass("has-error");

	$(".btn-export").click(function(event) {
        // $("code").hide();
		id = $(this).data("endpoint-id");
		$("#export-" + id).toggle();
        event.preventDefault();
	})

    $("#endpoint_method").change(function() {
        if ($(this).val() == "POST") {
            $("#show-body-wrapper").show();
        } else {
            $("#show-body-wrapper").hide();    
        }
    });

    if (typeof(endpoint) !== "undefined") {
        if (endpoint.method != 'GET') { 
            $("#post-body").insertBefore("#request-sender").show();
            $("#post-body").insertBefore("#params").show();
        }
    }
});

