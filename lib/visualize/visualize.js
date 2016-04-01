
 var nodeTypeMappings = {
	 1: "element",
	 2: "attribute",
	 3: "text",
	 8: "comment",
	 9: "root"
 };
 
function createD3GraphNode(nodeName, nodeType)  {
		
	var result = {
		"data":{ "name": nodeName, "nodetype": nodeType }
	};
	result.children = [ ];
	return result;
}
 
function mapToD3GraphElement(node) {
	
	var nodeType = nodeTypeMappings[node.nodeType] || "unknown";
	var nodeName = node.nodeName;
	var nodeValue = node.nodeValue;
	
	if (nodeType == "text" && nodeValue.trim()==='') {
		console.log("ignoring whitespace");
		return;
	}
	
	var result = createD3GraphNode(nodeName, nodeType);
	for (var i = 0; i < node.childNodes.length; i++) {
		var childElement = mapToD3GraphElement(node.childNodes[i]);
		if (childElement)
			result.children.push(childElement);
	}
	
	if (nodeType == "element") {
		 for (var i = 0; i < node.attributes.length; i++) {
			var attribute = node.attributes[i];
			var attributeName = "Attribute '" + attribute.name + "'";
			var attributeElement = createD3GraphNode(attributeName, "attribute");
			result.children.push(attributeElement);
		}
	}
		
	
	return result;
}
 
  function showD3Tree(xmlDoc) {
    
	var docElement = xmlDoc.documentElement;
	var root = createD3GraphNode("root", "root");
	root.children.push(mapToD3GraphElement(docElement));
	
	var dataParsed = [ root ];

        var nodes = {};
        var edges = [];

        dataParsed.forEach(function (e) {
          populate(e, nodes, edges);
        });

        var g = new dagreD3.graphlib.Graph()
            .setGraph({})
            .setDefaultEdgeLabel(function () {
              return {};
            });

        for (var key in nodes) {
          var node = nodes[key];
          g.setNode(node.id, {
            label: node.label,
            class: node.nodeclass,
            //  round edges
            rx: 5,
            ry: 5
          });
        }

        edges.forEach(function (e) {
          g.setEdge(e.source, e.target, {
            lineTension: .8,
            lineInterpolate: "bundle"
          });
        });

		$("#svg-canvas").empty();
        var render = new dagreD3.render();

        var svg = d3.select("#svg-canvas"),
            svgGroup = svg.append("g");

        render(d3.select("#svg-canvas g"), g);

		var availableWidth = $("#svg-canvas").width() - 40;
		var graphWidth = g.graph().width;
        var sc = (graphWidth > availableWidth) ? (availableWidth / graphWidth) : 1.0;
		var xCenterOffset = (availableWidth - graphWidth) / 2;
		

		var translate = 'translate(' + xCenterOffset + ',20)';
        var scale = sc ? ' scale(' + sc+ ')' : '';
		svgGroup.attr('transform', translate + scale)

         svg.attr("height", g.graph().height + 40);

		//  enable zoom and scrolling
		var zoomer = d3.behavior.zoom();
		
        svg.call(zoomer.on("zoom", function redraw() {
			var ev = d3.event;
			svgGroup.attr("transform", "translate(" + ev.translate + ")" + " scale(" + ev.scale + ")");
        }));
	
  }

  function populate(data, nodes, edges) {
    var nodeID = Object.keys(nodes).length;

    var newNode = {
      label: data.data.name,
      id: nodeID + ""
    };

    var classes = [ ];
    if (data.data.nodetype) {
      classes.push("type-" + data.data.nodetype);
    }

    newNode.nodeclass = classes.join(" ");

    nodes[nodeID] = newNode;

    data.children.forEach(function (child) {
      var newChild = populate(child, nodes, edges);

      edges.push({
        source: newNode.id,
        target: newChild.id,
        id: newNode.id + "-" + newChild.id
      });

    });

    return newNode;
  }
  
  


  function buildGraphData(node, nodes, links) {

    var index = nodes.length;
    nodes.push({
      name: node.data.content,
      group: 1
    });

    node.children.forEach(function (e) {
      links.push({
        source: index,
        target: nodes.length,
        value: 2
      });
      buildGraphData(e, nodes, links);
    });
  }



 