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

var geolocate = new mapboxgl.Geolocate({position: 'top-right', positionOptions: {
  enableHighAccuracy: true
  },trackUserLocation: true});
map.addControl(geolocate);
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
  enableHighAccuracy: true
  },
  trackUserLocation: true
  }));
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




var compass = document.querySelector('.js-compass');
window.addEventListener('deviceorientation',function(event){
  var alpha =event.alpha;
  var rotate = 'rotate(' + alpha + 'deg)';
  move(alpha, true);
  compass.style.transform = rotate;
  //console.log(alpha);
})
/*map.on('rotate', function() {
  //監聽
  var rotate = 'rotate(' + alpha + 'deg)';
  compass.style.transform = rotate;
});*/



function buttonStart(b) {
  persist = setInterval(function() {
    goDirection(b[0]);
  }, 20);
}



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
map.on('locationfound', function(e) {
  map.fitBounds(e.bounds);

  myLayer.setGeoJSON({
      type: 'Feature',
      geometry: {
          type: 'Point',
          coordinates: [e.latlng.lng, e.latlng.lat]
      },
      properties: {
          'title': 'Here I am!',
          'marker-color': '#ff8888',
          'marker-symbol': 'star'
      }
  });

  // And hide the geolocation button
  geolocate.parentNode.removeChild(geolocate);
});
