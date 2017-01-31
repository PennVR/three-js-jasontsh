var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
var renderer = new THREE.WebGLRenderer();

var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
light.position.set( 0.5, 30, 0.75 );
scene.add(light);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color:0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

renderer.setClearColor(0x3399ff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;
camera.position.y = 2;

var render = function() {
	requestAnimationFrame(render);

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
	camera.position.z -= 0.04;

	renderer.render(scene, camera);
};

var p = [];
var g2 = [];

generateArray(); 
var plane = new THREE.PlaneGeometry(10, 1000, 256, 256);

for (var i = 0; i < plane.vertices.length; i++) {
	if (plane.vertices[i].x < 4.5) {
		plane.vertices[i].z = noise(Math.abs(plane.vertices[i].x)*256.0/10.0, 
			Math.abs(plane.vertices[i].y)*256.0/1000.0) * 7;
		if (plane.vertices[i].z < 0) {
			plane.vertices[i].z = 0;
		}
	}
}

var loader = new THREE.TextureLoader();
  // URL of texture
loader.load("grass.jpg", function(texture){
	var left_mountains = new THREE.Mesh(plane, 
		new THREE.MeshBasicMaterial({color:0x00dddd, map: texture}));
	scene.add(left_mountains);
	left_mountains.position.x = -8;
	left_mountains.rotation.x = -Math.PI / 2;
});


generateArray(); 
var right_plane = new THREE.PlaneGeometry(10, 1000, 25, 800);

for (var i = 0; i < right_plane.vertices.length; i++) {
	if (right_plane.vertices[i].x > -4.5) {
		right_plane.vertices[i].z = noise(right_plane.vertices[i].x, 
			right_plane.vertices[i].y) * 7;
		if (right_plane.vertices[i].z < 0) {
			right_plane.vertices[i].z = 0;
		}
	}
}

loader.load("grass.jpg", function(texture){

	var right_mountains = new THREE.Mesh(right_plane, 
		new THREE.MeshBasicMaterial({color:0x00aaaa, map: texture}));
	scene.add(right_mountains);
	right_mountains.position.x = 8;
	right_mountains.rotation.x = -Math.PI / 2;
});

render();
function generateArray() {
	var sample_size = 256;
	var bconst = 0x1000;
	var p_imp = [];
	var i, j, k;
	for (i = 0; i < sample_size; i++) {
		p_imp[i] = i;
	}
	while (--i > 0) {
		k = p_imp[i];
		j = parseInt(Math.random() * sample_size);
		p_imp[i] = p_imp[j];
		p_imp[j] = k;
	}
	for (i = 0; i < bconst; i++) {
		p[i] = i;
		g2[i] = [];
		for (j = 0; j < 2; j++) {
			g2[i][j] = Math.random();
			if (Math.random() > 0.5) {
				g2[i][j] = 0 - g2[i][j];
			}
		}
		var s = 1 / Math.sqrt(g2[i][0] * g2[i][0] + g2[i][1] * g2[i][1]);
		g2[i][0] *= s;
		g2[i][1] *= s;
	}
	while (--i > 0) {
		k = p[i];
		j = parseInt(Math.random() * bconst);
		p[i] = p[j];
		p[j] = k;
	}
	for (i = 0; i < bconst + 2; i++) {
		p[bconst + i] = p[i];
		for (j = 0; j < 2; j++) {
			if (g2[bconst + i] == undefined) {
				g2[bconst + i] = [];
			}
			g2[bconst + i][j] = g2[i][j];
		}
	}
}

function noise(x, y) {
	var nconst = 0x1000;
	var bmconst = 0xff;
	var t = x + nconst;
	var bx0 = t & bmconst;
	var bx1 = (bx0 + 1) & bmconst;
	var rx0 = t % 1;
	var rx1 = rx0 - 1;

	t = y + nconst;
	var by0 = t & bmconst;
	var by1 = (by0 + 1) & bmconst;
	var ry0 = t % 1;
	var ry1 = ry0 - 1;

	var i = p[bx0];
	var j = p[bx1];

	var b00 = p[i + by0];
	var b10 = p[j + by0];
	var b01 = p[i + by1];
	var b11 = p[j + by1];

	var sx = rx0*rx0*(3-2*rx0);
	var sy = ry0*ry0*(3-2*ry0);

	var q = g2[b00];
	var u = rx0 * q[0] + ry0 * q[1];
	q = g2[b10];
	var v = rx1 * q[0] + ry0 * q[1];
	var a = u + sx *(v-u);

	q = g2[b01];
	u = rx0 * q[0] + ry1 * q[1];
	q = g2[b11];
	v = rx1 * q[0] + ry1 * q[1];
	var b = u + sx * (v - u);

    return a + sy * (b - a);
}