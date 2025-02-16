const cafeContainer = document.getElementById("cafe-container");

function searchCafes() {
	cafeContainer.innerHTML = "";
	const target = document.getElementById("search-target").value;

	fetch(`/cafes/search?target=${target}&page_num=0`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			if (!response.ok) throw new Error(`Server error(${response.status})`);

			return response.json();
		})
		.then((res) => {
			const cafes = res.data.cafes;
			cafes.forEach((cafe) => {
				cafeContainer.innerHTML += `
				<div class="bg-white p-4 rounded-lg shadow mb-6">
					<div
						class="flex flex-col md:flex-row items-center md:items-start space-x-0 md:space-x-4"
					>
						<!-- 이미지 -->
						<div class="md:w-1/4">
							<img
								src="${cafe.image_link}"
								alt="Cafe Image"
								class="rounded-lg mb-4 md:mb-0"
							/>
						</div>
						<!-- 일반 정보 -->
						<div class="flex-1 md:w-2/4 text-center md:text-left space-y-4">
							<a href="/cafes/${cafe._id}"
								><h2 class="text-xl font-bold font-sans text-gray-800">
								${cafe.cafe_name}
								</h2></a
							>
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
		.catch((error) => console.error("Fetching error:", error));
}
