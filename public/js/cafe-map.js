const latitude = document.getElementById("latitude").value;
const longitude = document.getElementById("longitude").value;
const position = new naver.maps.LatLng(latitude, longitude);

const cafe_name = document.getElementById("cafe_name").value;
const connection_site = document.getElementById("connection_site").value;

const map = new naver.maps.Map("map", {
	center: position,
	zoom: 15,
	zoomControl: false,
});

const marker = new naver.maps.Marker({
	position: position,
	map: map,
});

const contentString = `<a href="${connection_site}" target="_blank">${cafe_name}</a>`;

const infowindow = new naver.maps.InfoWindow({
	content: contentString,
});

naver.maps.Event.addListener(marker, "click", function (e) {
	if (infowindow.getMap()) {
		infowindow.close();
	} else {
		infowindow.open(map, marker);
	}
});

infowindow.open(map, marker);
