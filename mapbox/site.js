'use strict';
/* global mapboxgl */

mapboxgl.accessToken = 'pk.eyJ1IjoiczEwNDE3NDgiLCJhIjoiY2traTR3ajBqMDZwYjJucXMxb3dleDY3MiJ9.DXlwHSTcaYXvM1TQiFQH7Q';
var map = new mapboxgl.Map({
  container: 'map',
  attributionControl: {
    position: 'top-left'
  },
  style: 'mapbox://styles/saman/ciql4uao1000xbkm7knq5qf52',
  center: [-93.253567, 44.983679],
  zoom: 17,
  bearing: -9.47,
  pitch: 45.00
});

var marker;
var delta = 100;
var vConsole = new VConsole();
map.boxZoom.disable();
map.dragPan.disable();
map.doubleClickZoom.disable();
map.scrollZoom.disable();
map.keyboard.disable();
map.touchZoomRotate.disable();

var geolocate = new mapboxgl.Geolocate({position: 'top-right' });
map.addControl(geolocate);

geolocate.on('geolocate', function() {
  // Apparently this get's reset on result :/
  map.setBearing(-9.47);
  map.setPitch(45.00);
});

function easeTo(t) {
  if (marker && t === 1) marker.remove();
  return t * (2 - t);
}

function move(pos, bearing) {
  if (bearing) {
    map.easeTo({
      bearing: pos,
      easing: easeTo
    });
  } else {
    map.panBy(pos, {
      easing: easeTo
    });
  }
}

function goDirection(dir) {
  switch (dir) {
    case 'left':
      move(map.getBearing() - 100, true);
      break;
    case 'right':
      move(map.getBearing() + 15, true);
      break;
    case 'up':
      move([0, -delta]);
      break;
    case 'down':
      move([0, delta]);
      break;
  }
}

document.body.addEventListener('keydown', function(e) {
  switch (e.which) {
    case 38: // up
      goDirection('up');
    break;
    case 40: // down
      goDirection('down');
    break;
    case 37: // left
      goDirection('left');
    break;
    case 39: // right
      goDirection('right');
    break;
  }

}, true);

var compass = document.querySelector('.js-compass');
window.addEventListener('deviceorientation',function(event){
  var alpha =event.alpha;
  var rotate = 'rotate(' + alpha + 'deg)';
  move(alpha-90, true);
  compass.style.transform = rotate;
  //console.log(alpha);
})
/*map.on('rotate', function() {
  //監聽
  var rotate = 'rotate(' + alpha + 'deg)';
  compass.style.transform = rotate;
});*/

var buttonLeft = ['left', document.querySelector('.js-left')];
var buttonRight = ['right', document.querySelector('.js-right')];
var buttonTop = ['up', document.querySelector('.js-up')];
var buttonBottom = ['down', document.querySelector('.js-down')];

var buttons = [buttonLeft, buttonRight, buttonTop, buttonBottom];
var persist;

function buttonStart(b) {
  persist = setInterval(function() {
    goDirection(b[0]);
  }, 20);
}

function buttonEnd() {
  clearInterval(persist);
}

buttons.forEach(function(b) {
  b[1].addEventListener('mousedown', buttonStart.bind(this, b));
  b[1].addEventListener('touchstart', buttonStart.bind(this, b));
  b[1].addEventListener('mouseup', buttonEnd.bind(this, b));
  b[1].addEventListener('touchend', buttonEnd.bind(this, b));
});

function createMarker(e) {
  var markerEl = document.createElement('div');
  var dot = document.createElement('div');
  dot.className = 'waypoint-dot';
  var shadow = document.createElement('div');
  shadow.className = 'waypoint-shadow';
  markerEl.appendChild(dot);
  markerEl.appendChild(shadow);
  marker = new mapboxgl.Marker(markerEl).setLngLat(e.lngLat).addTo(map);

  window.setTimeout(function() {
    map.flyTo({
      center: e.lngLat,
      easing: easeTo
    });
  }, 500);
}

map.on('click', createMarker);
map.on('touchstart', createMarker);
