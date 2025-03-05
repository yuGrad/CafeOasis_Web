const cafeContainer = document.getElementById("cafe-container");
const targetElement = document.getElementById("search-target");
const params = new URLSearchParams(window.location.search);

let currentPage = 0;
let isLoading = false;
let hasMore = true;
let target;

function searchCafes(pageNum = 0) {
	if (pageNum === 0) {
		cafeContainer.innerHTML = "";
		hasMore = true;
	}

	// (검색어 input 요소가 있을 경우 값을 가져옵니다)
	targetElement.value = targetElement.value || params.get("target");
	const target = targetElement.value || null;
	if (!target) return;

	isLoading = true;

	fetch(
		`/cafes/search?target=${encodeURIComponent(target)}&page_num=${pageNum}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
		.then((response) => {
			if (!response.ok) throw new Error(`Server error(${response.status})`);
			return response.json();
		})
		.then((res) => {
			const cafes = res.data.cafes;

			window.history.pushState(
				{},
				"",
				`/cafes?target=${encodeURIComponent(target)}`
			);

			// 만약 불러온 데이터가 없으면 더 이상 로드할 데이터가 없음 처리
			if (cafes.length === 0) {
				if (pageNum === 0) {
					cafeContainer.innerHTML =
						"<p class='text-gray-600'>검색 결과가 없습니다.</p>";
				}
				hasMore = false;
				return;
			}

			cafes.forEach((cafe) => {
				cafeContainer.innerHTML += `
					<div class="bg-white p-4 rounded-lg shadow mb-6">
						<div class="flex flex-col md:flex-row items-center md:items-start space-x-0 md:space-x-4">
						<!-- 이미지 -->
						<div class="md:w-1/5">
							<img
								src="${cafe.image_link}"
								alt="Cafe Image"
								class="rounded-lg mb-4 md:mb-0 h-40 object-cover"
							/>
						</div>
						<!-- 일반 정보 -->
						<div class="flex-1 md:w-2/4 text-center md:text-left space-y-4">
							<a href="/cafes/${cafe._id}">
							<h2 class="text-xl font-bold font-sans text-gray-800">
								${cafe.cafe_name}
							</h2>
							</a>
							<p class="font-sans text-gray-600">
							<strong>네이버 평점:</strong> ${cafe.starring ? cafe.starring : 0}
							</p>
							<p class="font-sans text-gray-600">
							<strong>전화번호:</strong> ${
								cafe.phone_number ? cafe.phone_number : "제공하지 않음"
							}
							</p>
							<p class="font-sans text-gray-600">
							<strong>주소:</strong> ${cafe.address}
							</p>
							<p class="font-sans text-gray-600">
							<strong>영업 시간:</strong> ${
								cafe.business_hours ? cafe.business_hours : "제공하지 않음"
							}
							</p>
						</div>
						</div>
					</div>
        		`;
			});
		})
		.catch((error) => console.error("Fetching error:", error))
		.finally(() => {
			isLoading = false;
		});
}

searchCafes(0);
cafeContainer.addEventListener("scroll", () => {
	if (
		hasMore &&
		!isLoading &&
		cafeContainer.scrollTop + cafeContainer.clientHeight >=
			cafeContainer.scrollHeight - 200
	) {
		currentPage++;
		searchCafes(currentPage);
	}
});
