var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
var renderer = new THREE.WebGLRenderer();

var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
light.position.set( 0.5, 30, 0.75 );
scene.add(light);

var sky = new THREE.Sky();
scene.add(sky.mesh);
sunSphere = new THREE.Mesh(
	new THREE.SphereBufferGeometry( 20000, 16, 8 ),
	new THREE.MeshBasicMaterial( { color: 0xffffff } )
);
sunSphere.position.y = - 700000;
sunSphere.visible = false;
scene.add( sunSphere );
renderer.setClearColor(0x3399ff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;
camera.position.y = 2;

var fireworks = [];
var splash = [];
var prob;
var x, y, z, dx, dy;
var spherebuffer;
var render = function() {
	requestAnimationFrame(render);
	if (camera.position.z > -290){
		camera.position.z -= 0.02;
	}

	prob = (10.0 - 3.0 * fireworks.length) / 100.0;
	if (Math.random() < prob && prob > 0) {
		x = Math.random() * 300 + 20;
		if (Math.random() > 0.5) {
			x *= -1;
		}
		y = Math.random() * 2 + 7;
		dx = Math.random();
		dy = 0.5;
		z = Math.random() * -110 + camera.position.z;
		dz = Math.random();
		var spheregeo = new THREE.SphereBufferGeometry(0.3, 30, 30);
		var sphere = new THREE.Mesh(spheregeo, new THREE.MeshBasicMaterial({color: 0xaaaaaa}));
		sphere.position.x = x;
		sphere.position.y = y;
		sphere.position.z = z;
		scene.add(sphere);
		fireworks.push([dx, dy, dz, sphere]);
	}
	for (var i = 0; i < fireworks.length; i++) {
		spherebuffer = fireworks[i][3];
		spherebuffer.position.x += fireworks[i][0];
		spherebuffer.position.y += fireworks[i][1];
		spherebuffer.position.z += fireworks[i][2];
		fireworks[i][1] = fireworks[i][1] - 0.05;
		if (spherebuffer.position.y > 40 || fireworks[i][1] <= 0) {
			scene.remove(spherebuffer);
			fireworks.splice(fireworks[i], 1);
			var splashes = [];
			splashes[0] = 0;
			for (var j = 0; j < Math.random()*3 + 7; j++){
				splashes[j+1] = [Math.random() * 0.1 + fireworks[i][0], 
				Math.random() * 0.2 + fireworks[i][1], 
				Math.random() * 0.1 + fireworks[i][2],
				new THREE.Mesh(new THREE.SphereBufferGeometry(0.1, 30, 30), 
					new THREE.MeshBasicMaterial({color: 0xaaaaaa}))];
				scene.add(splashes[j+1][3]);
			}
			splash.push(splashes);
		}
	}

	for (i = 0; i < splash.length; i++) {
		if (splash[i][0] > 50) {
			for (j = 1; j < splash[i].length; j++) {
				scene.remove(splash[i][j][3]);
			}
			splash.splice(splash[i], 1);
		} else {
			for (j = 1; j < splash[i].length; j++) {
				spherebuffer = splash[i][j][3];
				spherebuffer.position.x += splash[i][j][0];
				spherebuffer.position.y += splash[i][j][1];
				spherebuffer.position.z += splash[i][j][2];
			}
		}
		splash[i][0] += 1;
	}

	renderer.render(scene, camera);
};

var p = [];
var g2 = [];

generateArray(); 
var plane = new THREE.PlaneGeometry(300, 300, 256, 256);

for (var i = 0; i < plane.vertices.length; i++) {
	if (plane.vertices[i].x < 149.5) {
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
	left_mountains.position.x = -155;
	left_mountains.rotation.x = -Math.PI / 2;
});


generateArray(); 
var right_plane = new THREE.PlaneGeometry(300, 300, 256, 256);

for (var i = 0; i < right_plane.vertices.length; i++) {
	if (right_plane.vertices[i].x > -149.5) {
		right_plane.vertices[i].z = noise(Math.abs(right_plane.vertices[i].x)*256.0/100.0, 
			Math.abs(right_plane.vertices[i].y)*256.0/1000.0) * 7;;
		if (right_plane.vertices[i].z < 0) {
			right_plane.vertices[i].z = 0;
		}
	}
}

loader.load("grass.jpg", function(texture){

	var right_mountains = new THREE.Mesh(right_plane, 
		new THREE.MeshBasicMaterial({color:0x00aaaa, map: texture}));
	scene.add(right_mountains);
	right_mountains.position.x = 155;
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