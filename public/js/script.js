const socket = io();

// console.log("Hey")
if (navigator.geolocation) {
  // use watchposition to track the users location continuously.
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // emit the latitude and longitude via a socket with "send-location".
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    // set options for higher accuracy, a 5 sec. timeout and no caching.
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
}

// initialize a map centered at coordinates (0,0) with a zoom level of 15 using leaflet.
const map = L.map("map").setView([0, 0], 10);

// Add open street tiles to the map.
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Create an empty object markers.
const markers = {};

// when receiving location data via the socket, extract id, latitude and longitude and center the map of the coordinates.
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);

  // if a marker for the id exists, update its position, otherwise, create a new marker at the given coordinate and add it to the map.
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

// When a user disconnectsm remove their marker from the map and delete it from the markers.
socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})  