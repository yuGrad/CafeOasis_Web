let map = null;
let markers = [];
let latitude = null,
	longitude = null;

// 위치 정보 지원 여부 확인
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;

			map = new naver.maps.Map("map", {
				center: new naver.maps.LatLng(latitude, longitude),
				zoom: 15,
			});

			const greenMarkerIcon = {
				content:
					'<div style="width:20px;height:20px;border-radius:50%;background-color:green;border:2px solid white;"></div>',
				size: new naver.maps.Size(20, 20),
				anchor: new naver.maps.Point(8, 8),
			};

			// 현재 위치에 초록색 마커 생성
			const marker = new naver.maps.Marker({
				position: new naver.maps.LatLng(latitude, longitude),
				map: map,
				icon: greenMarkerIcon,
				title: "현재 위치",
			});

			naver.maps.Event.addListener(marker, "click", function () {
				const infoWindow = new naver.maps.InfoWindow({
					content: "<div>현재 위치</div>",
				});

				infoWindow.open(map, marker);
			});
		},
		(error) => {
			console.error("위치 정보를 가져오는데 실패했습니다:", error);
		}
	);
} else {
	alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
}

function findNearbyCafes() {
	if (!map || !latitude || !longitude) return;

	const radiusInput = document.getElementById("radius-input");
	const radius = radiusInput.value || 5;

	// 서버로 GET 요청 (쿼리 파라미터로 위도, 경도, 반경 전달)
	fetch(`/cafes/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`)
		.then((response) => response.json())
		.then((data) => {
			renderCafesOnMap(data.data.cafes);
		})
		.catch((error) => {
			console.error("Fetching error:", error);
		});
}

// 기존 카페 마커를 지도에서 제거하는 함수
function clearMarkers() {
	markers.forEach((marker) => marker.setMap(null));
	markers = [];
}

// 카페 데이터를 받아와 지도에 마커를 추가하는 함수
function renderCafesOnMap(cafes) {
	clearMarkers();

	if (cafes && cafes.length) {
		cafes.forEach(function (cafe) {
			var lng = cafe.coordinates[0];
			var lat = cafe.coordinates[1];

			// 마커 생성
			const marker = new naver.maps.Marker({
				position: new naver.maps.LatLng(lat, lng),
				map: map,
				title: cafe.cafe_name,
			});
			markers.push(marker);

			naver.maps.Event.addListener(marker, "click", function () {
				const infoWindow = new naver.maps.InfoWindow({
					content:
						'<div style="padding:5px;"><strong>' +
						`<a href=/cafes/${cafe._id}>${cafe.cafe_name}</a>` +
						"</strong><br>" +
						cafe.address +
						"</div>",
				});
				infoWindow.open(map, marker);
			});
		});
	}
}
