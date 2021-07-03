

//Can't access the MAPBOX_TOKEN FROM process.env directly so we will get that by storing it in a const on show page and run that script first
mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});



//To add a marker
new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)

//Adding a popup
.setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h4>${campground.title}</h4><p>${campground.location}</p>`)) // add popup
.addTo(map);