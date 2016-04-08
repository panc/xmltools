$(document).ready(function() {	
    "use strict";
    
    var xmlDoc, nodes, nodeIndex, treeRef, xpathResults, xpathResultNodeIndex;

    var tree = $('#myTree');
		
	$("#evaluateXPathButton").click(evaluateXPath); 
	$("#loadLocalXmlFileButton").click(loadLocalXmlFile);
	$("#showVisualizationButton").click(showVisualization);
    
    $("#inputXpath").keyup(function(event){
        if(event.keyCode == 13)
            $("#evaluateXPathButton").click();
    });

	var xmlEditor = createEditor($("#inputXml")[0]);
	xmlEditor.setValue("");
    
    var nodeTypeMappings = {
        1: "element",
        2: "attribute",
        3: "text",
        8: "comment",
        9: "root"
    };
    
    function createGraphNode(nodeName, nodeType, value, node)  {
            
        var result = {
            "text": nodeName, 
            "icon": "css/icon-" + nodeType + ".png",
            "state" : { "opened" : true },
            "value" : value,
            "type" : nodeType
        };
        
        if (node) {
            result.nodeIndex = nodeIndex;
            nodes[nodeIndex++] = node;
        }
        
        result.children = [ ];
        return result;
    }
    
    function mapToGraphElement(node) {
        
        var nodeType = nodeTypeMappings[node.nodeType] || "unknown";
        var nodeName = node.nodeName;
        var nodeValue = node.nodeValue;
        
        if (nodeType == "text" && nodeValue.trim()==='') {
            // console.log("ignoring whitespace");
            return;
        }
        
        var result = createGraphNode(nodeName, nodeType, nodeValue, node);
        
        for (var i = 0; i < node.childNodes.length; i++) {
            var childElement = mapToGraphElement(node.childNodes[i]);
            if (childElement)
                result.children.push(childElement);
        }
        
        if (nodeType == "element") {
            result.namespace = node.namespaceURI;
            result.outerText = node.outerHTML;
            
            for (var i = 0; i < node.attributes.length; i++) {
                var attribute = node.attributes[i];
                var attributeName = "Attribute '" + attribute.name + "'";
                var attributeElement = createGraphNode( attributeName, "attribute", attribute.value);
                result.children.push(attributeElement);
            }
        }
            
        
        return result;
    }

    function showDetailsForNode(node) {
        
        $("#info-value").text(node.value || ' ');
        $("#info-namespace").text(node.namespace || ' ');
        $("#info-type").text(node.type);
        $("#info-outerText").text(node.outerText || ' ');
    }

    function updateTree() {
        
        if (treeRef) {
            treeRef.destroy();
            treeRef = null;
        }
        
        var inputXml = xmlEditor.getValue();
        var xPath = $("#inputXpath").val();
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(inputXml,"text/xml");
        var docElement = xmlDoc.documentElement;
        
        nodes = { };
        nodeIndex = 0;
        
        var documentRoot = createGraphNode("root", "root", '', xmlDoc);
        documentRoot.state.selected = true;
        documentRoot.children.push(mapToGraphElement(docElement));
        
        
        // var tree = $('#myTree').jstree("destroy");
        tree.jstree({ 'core' : {
                'multiple' : false,
                'data' : [ documentRoot ]
        } }).on('select_node.jstree', function(e,node) {
            showDetailsForNode(node.node.original);
        });
        
        treeRef = tree.jstree();
        
        /* if (showD3Tree) { 
            var tabContainer = $('#mainTabs');
            $('a[href="#tab2"]', tabContainer).tab('show');
            showD3Tree(xmlDoc);
            $('a[href="#tab1"]', tabContainer).tab('show');
        }*/
        
    }
    
    function showVisualization() {	 
        updateTree();
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    function loadLocalXmlFile() {
        $.ajax({
            url: $("#localFileName").val(),
            dataType: "html",
            success: function(result) {
                xmlEditor.setValue(result);
            }
        });
    }
    
    function evaluateXPath() {
        
        $("#svg-canvas").hide();
        $("#result-list").show();
        var tableBody = $("#resultBody").html("");
        
        var xPath = $("#inputXpath").val();
        
        var selectedId = treeRef.get_selected();
        var selectedNode = treeRef.get_node(selectedId);
        var contextNode = nodes[selectedNode.original.nodeIndex] || xmlDoc.documentElement;
        
        
        var nodeResults = xmlDoc.evaluate(xPath, contextNode, null, XPathResult.ANY_TYPE, null);
        var iterator=nodeResults.iterateNext();
        
        xpathResults = { };
        xpathResultNodeIndex = 0;
        
        while (iterator)
        {
            var outerTextOrValue = (iterator.nodeValue) 
                ? '<b>Value: ' + escapeHtml(iterator.nodeValue) + '</b>' 
                : escapeHtml(iterator.outerHTML);
            
            var tr = $("<tr><td>" + iterator.nodeType + "</td><td>" + iterator.nodeName + "</td><td>" + outerTextOrValue + "</td></tr>");
            tr.appendTo(tableBody).data("node", xpathResultNodeIndex);
            xpathResults[xpathResultNodeIndex] = iterator;
            
            tr.click(function(){
                var nodeId = $(this).data("node");
                var node = xpathResults[nodeId];
                showDetailsForNode({
                    "value" : node.nodeValue,
                    "namespace" : node.namespaceURI,
                    "outerText" : node.outerHTML,
                    "type" : "element"
                });
            });
            
            xpathResultNodeIndex++;
            iterator=nodeResults.iterateNext();
        }
    }
});