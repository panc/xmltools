$(document).ready(function() {	
    "use strict";
    
    $("#validateDtd").click(validate);
    
    function validate(){
        var xmlContent = xmlDtdEditor.getValue();
        
        clearConsole();

        if (xmlContent < 10) {
			setResult("Enter XML Content");
            consoleWriteLine("Enter XML Content"); 
			return;
		}
		
        consoleWriteLine("Validating ...");
		
        // TODO
        var contentHandler = new DomContentHandler();
        var saxParser = XMLReaderFactory.createXMLReader();
        saxParser.setHandler(contentHandler);
        saxParser.setFeature('http://xml.org/sax/features/validation', true);
        
        try {
            saxParser.parseString(xmlContent);
        } catch(e) {
            var message = e.message;
            if (message.length > 100)
                message = message.substring(0, 100);
                
            consoleWriteLine(message);
        }
        
        if (contentHandler.saxParseExceptions.length === 0) 
        	setResult("Document validates against the schema!", true);
		else
        	setResult("Document does not validate.", false);
    }
    
    function setResult(text, success) {
        
        if (success)
            $("#dtd-validation-result").removeClass("validation-error").addClass("validation-success");
		else
            $("#dtd-validation-result").removeClass("validation-success").addClass("validation-error");
        
        $("#dtd-validation-result").text(text);
        consoleWriteLine(text);
    }
    
    function consoleWriteLine(text) {
		var value = $("#dtd-validation-console").val();
        $("#dtd-validation-console").val(value + text + "\r");
    }
    
    function clearConsole() {
        $("#validation-console").val(" ");
    }
    
    var xmlDtdEditor = CodeMirror.fromTextArea($("#xmlAndDtDToValidate")[0], {
        mode: "application/xml",
        matchTags: {bothTags: true},
        lineNumbers: true,
        lineWrapping: true,
        theme: "xq-light",
        viewportMargin: Infinity,
        extraKeys: {
        }
	});
	xmlDtdEditor.setValue("");
    
    $('a[data-toggle="tab"][aria-controls="tab3"]').on('shown.bs.tab', function(e) { 
        xmlDtdEditor.refresh();
    });
});
