$("document").ready(function() {
  THREE.ImageUtils.crossOrigin = '';
	var loader = new THREE.FontLoader();
	loader.load("https://threejs.org/examples/fonts/helvetiker_bold.typeface.json", function(font) {
		run(font);
	});
});

function run(font) {
		var threeData = [];
	var x, y, z, x2, y2;
	for (i = 0; i < 100; i++) {
		x = (i + 1) * 0.01;
		x2 = 0.0339 * Math.log(x) + 0.0954
		h = 100 - i
		y = (h + 1) * 0.01;
		y2 = -0.0833 * Math.pow(y, 2) + 0.125 * y + 0.0283;
		z = x2 + y2;
		threeData.push([(x * 100) - 50, (z * 500) - 50, - 50]);
	}
  console.log(threeData)
	runThree(threeData, font);
	animate();
}

function formatThousands(n) {
	var parts = n.toString().split(".");
	return (parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : ""));
}

function removeCommas(str) {
	while (str.search(",") >= 0) {
		str = (str + "").replace(",", "");
	}
	return str;
}
var scene, camera, renderer, particles;
var sizeofparticles = 1;

function runThree(threeData, font, axisScales) {

var threeSize = 1;
var textmesh;
var worldPosition = [-50, -50, -50];
	var axisScales = [
		[0, 25, 50, 75, 100],
		[0, 5, 10, 15, 20],
		[0, 25, 50, 75, 100]
	];

	$(".toggleChart").show();
	// Create the scene and set the scene size.
	var threeContainer = $(".threeChartContainer")
	var threeHeight = threeContainer.height();
	var threeWidth = threeContainer.width();
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(threeWidth, threeHeight);
	renderer.setClearColor(0xecf0f1);
	$(".threeChartContainer").append(renderer.domElement);
	// Create a camera, zoom it out from the model a bit, and add it to the scene.
	camera = new THREE.PerspectiveCamera(45, threeWidth / threeHeight, 0.1, 20000);
	camera.position.set(20, 60, 200);
	scene.add(camera);
	//setup controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	// Add Axis helper
	var axisHelper = new THREE.AxisHelper(10);
	//geometry and material
	var geometry = new THREE.Geometry();
	var material = new THREE.PointsMaterial({
		color: 0x1a2a32,
		size: 1,
		opacity: 0.7,
		transparent: true,
		sizeAttenuation: true
	});
	// position each particle
	for (i = 0; i < threeData.length; i++) {
		var vertex = new THREE.Vector3();
		vertex.x = threeData[i][0];
		vertex.y = threeData[i][1];
		vertex.z = threeData[i][2];
		geometry.vertices.push(vertex);
	}
	//create a blue LineBasicMaterial
	var lineMaterial = new THREE.LineBasicMaterial({
		color: 0x444444
	});
	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push(new THREE.Vector3(worldPosition[0], worldPosition[1], worldPosition[2]));
	lineGeometry.vertices.push(new THREE.Vector3((worldPosition[0] + 100), worldPosition[1], worldPosition[2]));
	lineGeometry.vertices.push(new THREE.Vector3(worldPosition[0], worldPosition[1], worldPosition[2]));
	lineGeometry.vertices.push(new THREE.Vector3(worldPosition[0], (worldPosition[1] + 100), worldPosition[2]));
	var line = new THREE.Line(lineGeometry, lineMaterial);
	scene.add(line);
	//create a blue LineBasicMaterial
	var lineMaterial = new THREE.LineBasicMaterial({
		color: 0xff4444
	});

	// add axis labels
	position = [0, -65, -55];
	addText(position, "Time", font, "middle", 3)
	position = [-75, 0, -50];
	addText(position, "Price", font, "middle", 3)
  position = [0, 60, -50];
	addText(position, "Stock Price Chart", font, "middle", 4, true)

	particles = new THREE.Points(geometry, material);
	particles.sortParticles = true;
	scene.add(particles);
	var axisIncrement = 100 / (axisScales[0].length - 1)
	var axisStart = worldPosition[0]
	for (i = 0; i < axisScales[0].length; i++) {
		var position = [axisStart + (axisIncrement * i), (worldPosition[1] + 0.5), worldPosition[2]];
		var text = formatThousands(axisScales[0][i])
		addText(position, " " + text, font, "left", 1.8)
	}
	axisIncrement = 100 / (axisScales[1].length - 1)
	axisStart = -50
	for (i = 1; i < axisScales[1].length; i++) {
		var position = [worldPosition[0] - 1, axisStart + (axisIncrement * i), worldPosition[2]];
		var text = formatThousands(axisScales[1][i])
		addText(position, text + " ", font, "right", 1.8)
	}
}
// Renders the scene and updates the render as needed.
function animate() {
	// textmesh.lookAt( camera.position );
	requestAnimationFrame(animate);
	camera.up = new THREE.Vector3(0, 1, 0)
	renderer.render(scene, camera);
	controls.update();
}

function makeTextSprite(message) {
	var fontface = "Lato";
	var fontsize = 16;
	//var spriteAlignment = THREE.SpriteAlignment.topLeft;
	// Create canvas
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	context.font = "Normal " + fontsize + "px " + fontface;
	// get size data (height depends only on font size)
	var metrics = context.measureText(message);
	var textWidth = metrics.width;
	context.canvas.width = textWidth;
	context.canvas.height = fontsize;
	// context.canvas.width = textWidth
	// context.canvas.height = fontsize
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";
	context.fillText(message, 0, fontsize + 0);
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;
	var spriteMaterial = new THREE.SpriteMaterial({
		map: texture
	});
	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(12, 12, 12);
	return sprite;
}


function addText(position, text, font, anchor, size, underline) {
	var textgeometry = new THREE.TextGeometry(text, {
		size: size,
		height: 0.1,
		curveSegments: 3,
		font: font,
		weight: "bold",
		style: "normal",
		bevelEnabled: false
	});
	var textmaterial = new THREE.MeshPhongMaterial({
		shininess: 1,
		color: 0x444444
	});
	var lineMaterial = new THREE.LineBasicMaterial({
		color: 0x444444
	});
	var textmesh = new THREE.Mesh(textgeometry, lineMaterial);
	var box = new THREE.Box3().setFromObject(textmesh);
  var lineGeometry = new THREE.Geometry();
  
	if (anchor === "right") {
		textmesh.position.set(position[0] - box.size().x, position[1], position[2]);
	} else {
		if (anchor === "middle") {
			textmesh.position.set(position[0] - (box.size().x/2), position[1], position[2]);
		} else {
			textmesh.position.set(position[0], position[1], position[2]);
		}
	}
  	if (underline) {
		lineGeometry.vertices.push(new THREE.Vector3(position[0] - (box.size().x/2), position[1] -1, position[2]));
		lineGeometry.vertices.push(new THREE.Vector3(position[0] + (box.size().x/2), position[1] - 1, position[2]));
		var line = new THREE.Line(lineGeometry, lineMaterial);
		scene.add(line);
	}
	scene.add(textmesh);
}