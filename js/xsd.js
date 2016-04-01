$(document).ready(function() {	
    "use strict";
    
    (function () {
		if (window.validateXML) 
			$(".console").text("xmllint loaded");
		else 
			$(".console").text("xmllint not loaded");
	})();
    
	$("#validateXsd").click(validate);
    
    function validate(){
        var xmlContent = xmlContentEditor.getValue();
        var schema = schemaEditor.getValue();

        clearConsole();

        if (xmlContent < 10) {
			//$(".console").removeClass("valColor1").removeClass("valColor2");
			setResult("Enter XML Content");
            consoleWriteLine("Enter XML Content"); 
			return;
		}
		if (schema.length < 10) { 
			//$(".valoutput").removeClass("valColor1").removeClass("valColor2");
			setResult("Enter XML Schema");
            consoleWriteLine("Enter XML Schema");
			return;
		}

        consoleWriteLine("Validating ...");
		
		var Module = {
			xml: xmlContent,
			schema: schema,
			arguments: ["--noout", "--schema", "file.xsd", "file.xml"]
		};
        
		var result = validateXML(Module);
        
        if (result.search("xml validates") > 0) 
        {
			setResult("Document validates against the schema!", true);
		} 
        else
        {
			//$(output1).removeClass("valColor1").addClass("valColor2");
			setResult("Document does not validate.", false);
		}
        
        consoleWriteLine(result);
    }
    
    function setResult(text, success) {
        
        if (success)
            $("#xsd-validation-result").removeClass("validation-error").addClass("validation-success");
		else
            $("#xsd-validation-result").removeClass("validation-success").addClass("validation-error");
        
        $("#xsd-validation-result").text(text);
    }
    
    function consoleWriteLine(text) {
		var value = $("#validation-console").val();
        $("#xsd-validation-console").val(value + text + "\r");
    }
    
    function clearConsole() {
        $("#xsd-validation-console").val(" ");
    }
    
    var xmlContentEditor = CodeMirror.fromTextArea($("#xmlToValidate")[0], {
        mode: "application/xml",
        matchTags: {bothTags: true},
        lineNumbers: true,
        lineWrapping: true,
        theme: "xq-light",
        viewportMargin: Infinity,
        extraKeys: {
        }
	});
	xmlContentEditor.setValue("");
	
	var schemaEditor = CodeMirror.fromTextArea($("#xmlSchema")[0], {
	    mode: "application/xml",
	    matchTags: {bothTags: true},
        lineNumbers: true,
	    lineWrapping: true,
	    theme: "xq-light",
        viewportMargin: Infinity,
        extraKeys: {            
        }
	});
	schemaEditor.setValue(""); 
    
    $('a[data-toggle="tab"][aria-controls="tab4"]').on('shown.bs.tab', function(e) { 
        xmlContentEditor.refresh();
        schemaEditor.refresh();
    });
    
    $('#validataionTabs a[data-toggle="tab"]').on('shown.bs.tab', function(e) { 
        xmlContentEditor.refresh();
        schemaEditor.refresh();
    });
});
