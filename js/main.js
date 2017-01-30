var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.Geometry();

geometry.vertices.push(
	new THREE.Vector3( 0,  20, 0 ),
	new THREE.Vector3( 0, 40, 0 ),
	new THREE.Vector3(  0, 100, 0 )
);

geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

var material = new THREE.MeshBasicMaterial({color:0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

var light = new THREE.PointLight(0xffffff);
light.position.set(0,100,-10);
scene.add(light);

var render = function() {
	requestAnimationFrame(render);

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

	renderer.render(scene, camera);
};
render();