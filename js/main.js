var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color:0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

var render = function() {
	requestAnimationFrame(render);

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

	renderer.render(scene, camera);
};

var p = [];
var g2 = [];

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
	var u = rx0 * q[0] + ry[0] * q[1];
	q = g2[b10];
	var v = rx1 * q[0] + ry[1] * q[1];
	var a = u + sx *(v-u);

	q = g2[b01];
	u = rx0 * q[0] + ry1 * q[1];
	q = g2[b11];
	v = rx1 * q[0] + ry1 * q[1];
	var b = u + sx * (v - u);

    return a + sy * (b - a);
}

generateArray();

render();