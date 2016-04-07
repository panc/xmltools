$(document).ready(function() {	
    "use strict";
    
    var dtdFiles = [];

    $("#validateDtd").click(validate);
    
    function validate(){
        var xmlContent = xmlDtdEditor.getValue();
        var dtdContent = dtdEditor.getValue();
        
        clearConsole();

        if (xmlContent < 10) {
			setResult("Enter XML Content");
            consoleWriteLine("Enter XML Content"); 
			return;
		}
		
        consoleWriteLine("Validating ...");
	    
        var errorMessage = "";
        
        if (dtdContent.length < 5){
            var contentHandler = new DomContentHandler();
            var saxParser = XMLReaderFactory.createXMLReader();
            saxParser.setHandler(contentHandler);
            saxParser.setFeature('http://xml.org/sax/features/validation', true);
            
            try {
                saxParser.parseString(xmlContent);
            } catch(e) {
                errorMessage = e.message;
                if (errorMessage.length > 100)
                    errorMessage = errorMessage.substring(0, 100);
            }
        }
        else {
            var files = [
                { path: 'xml', data: xmlContent },
                { path: 'subjects.dtd', data: dtdContent }
            ];
            
            var args = ['--noent', '--dtdvalid', 'subjects.dtd', 'xml'];
            var result = xmllint(args, files);
            
            errorMessage = result.stderr;
        }
        
        if (errorMessage.length == 0) 
			setResult("Document validates against the DTD definition!", true);
        else
			setResult("Document does not validate.", false);
        
        consoleWriteLine(errorMessage);
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
        $("#dtd-validation-console").val(" ");
    }
    
    var xmlDtdEditor = createEditor($("#xmlAndDtdToValidate")[0]);
	xmlDtdEditor.setValue("");
    
    var dtdEditor = createEditor($("#dtdToValidate")[0]);
	dtdEditor.setValue("");
	
    function createEditor(textarea) {
        return CodeMirror.fromTextArea(textarea, {
            mode: "application/xml",
            matchTags: {bothTags: true},
            lineNumbers: true,
            lineWrapping: true,
            theme: "xq-light",
            viewportMargin: Infinity,
            extraKeys: { }
        });
    }
	
    $('a[data-toggle="tab"][aria-controls="tab3"]').on('shown.bs.tab', function(e) { 
        xmlDtdEditor.refresh();
        dtdEditor.refresh();
    });
    
    $('#dtdTabHeaders a[data-toggle="tab"]').on('shown.bs.tab', function(e) { 
        xmlDtdEditor.refresh();
        dtdEditor.refresh();
    });
    
    $('#dtdFileName').on('change', function(){
        $('#dtdFileNameHeader').html(this.value);
    });
});
