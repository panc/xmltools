$(document).ready(function() {	
    "use strict";
    
    var additionalXsdFiles = [];
    
	$("#validateXsd").click(validate);
    
    function validate(){
        var xmlContent = xmlContentEditor.getValue();
        var schema = schemaEditor.getValue();

        clearConsole();

        if (xmlContent.length < 10) {
			setResult("Enter XML Content");
            consoleWriteLine("Enter XML Content"); 
			return;
		}
		if (schema.length < 10) { 
			setResult("Enter XML Schema");
            consoleWriteLine("Enter XML Schema");
			return;
		}

        consoleWriteLine("Validating ...");
		
        var files = additionalXsdFiles.map(function(item){
            
            return {
                path: $(item.content.find('.name')[0]).val(),
                data: item.editor.getValue()
            };
        });
        
        files.push({ path: 'mainSchema', data: schema });
        files.push({ path: 'xml', data: xmlContent });
        
        var args = ['--noent', '--schema', 'mainSchema', 'xml'];
	    var result = xmllint(args, files);
        
        if (result.stderr.indexOf("xml validates") > -1 ) 
			setResult("Document validates against the schema!", true);
        else
			setResult("Document does not validate.", false);
        
        consoleWriteLine(result.stderr);
    }
    
    function setResult(text, success) {
        
        if (success)
            $("#xsd-validation-result").removeClass("validation-error").addClass("validation-success");
		else
            $("#xsd-validation-result").removeClass("validation-success").addClass("validation-error");
        
        $("#xsd-validation-result").text(text);
    }
    
    function consoleWriteLine(text) {
		var value = $("#xsd-validation-console").val();
        $("#xsd-validation-console").val(value + text + "\r");
    }
    
    function clearConsole() {
        $("#xsd-validation-console").val(" ");
    }
    
    var xmlContentEditor = createEditor($("#xmlToValidate")[0]);
	xmlContentEditor.setValue("");
	
	var schemaEditor = createEditor($("#xmlSchema")[0]);
	schemaEditor.setValue("");
        
    $('a[data-toggle="tab"][aria-controls="tab4"]').on('shown.bs.tab', function(e) { 
        xmlContentEditor.refresh();
        schemaEditor.refresh();
    });
    
    $('#xsdTabHeaders a[data-toggle="tab"]').on('shown.bs.tab', function(e) { 
        xmlContentEditor.refresh();
        schemaEditor.refresh();
    });
    
    $('#addXsdTab').on('click', function(){
        
        var id = additionalXsdFiles.length;
        var name = 'Schema-Name-' + id;

        var header = $('<li id="tab-header-val-' + id + '" role="presentation">' + 
                            '<a href="#tab-content-val-' + id + '" aria-controls="tab-content-val-' + id + '" role="tab" data-toggle="tab">' + 
                                '<span class="name">' + name + '</span>' + 
                                '<span class="close">X</span>' +
                            '</a>' +
                        '</li>');        
        
        var content = $('<div role="tabpanel" class="tab-pane" id="tab-content-val-' + id + '">' +
                            '<div class="tab-inner">' +
                                '<div class="form-group">' + 
                                    '<input type="text" class="name" value="' + name + '"/>' + 
                                    '<textarea class="form-control codeEditor" placeholder="XML Schema" value=""></textarea>' +
                                '</div>' +
                            '</div>' +
                        '</div>');
        
        $('#addXsdTab').before(header);
        $('#xsdTabs').append(content);
                    
        var nameInput = $(content.find('.name')[0]);
        nameInput.on('change', function(){
            $(header).find('span.name').html(this.value);
        });
        
        var newEditor = createEditor(content.find('.codeEditor')[0]);
	    newEditor.setValue("");
        newEditor.refresh();
         
        var item = {
            editor: newEditor,
            content: content
        };
        additionalXsdFiles.push(item);
        
        var closeButton = $(header.find('.close')[0]);
        closeButton.on('click', function(){
            $(header).remove();
            $(content).remove();
            additionalXsdFiles.remove(item)
        });
    });
});
