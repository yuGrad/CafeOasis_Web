const mainContent = document.getElementById("mainContent");
const sectionTitle = document.getElementById("sectionTitle");
const sectionContent = document.getElementById("sectionContent");

document.addEventListener("DOMContentLoaded", () => {});

function loadSection(section) {
	mainContent.style.display = "block";

	if (section === "bookmarks") {
		loadBookmarks();
	} else if (section === "reviews") {
		loadReviews();
	} else if (section === "liked-reviews") {
		loadLikedReviews();
	}
}

// Fetch 즐겨찾기 카페 데이터
function loadBookmarks() {
	isLikedReviewSection = false;
	sectionTitle.textContent = "북마크한 카페";
	sectionContent.innerHTML =
		"<p class='text-gray-600'>북마크한 카페 데이터를 불러오는 중...</p>";
	fetch("/users/me/cafe-bookmarks")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch favorite cafes");
			}
			return response.json();
		})
		.then(({ data }) => {
			// 데이터가 비어 있는 경우
			if (data.bookmarks.length === 0) {
				sectionContent.innerHTML =
					"<p class='text-gray-600'>카페 북마크가 없습니다.</p>";
				return;
			}
			// 데이터가 있는 경우 렌더링
			sectionContent.innerHTML = data.bookmarks
				.map(
					(cafe) => `
								<div class="flex justify-between border-b py-2">
										<div>
												<a href="/cafes/${cafe._id}" class="text-blue-500 hover:underline">
														${cafe.cafe_name}
												</a>
												<p class="text-sm text-gray-500">${cafe.address}</p>
										</div>
										<p class="text-sm text-gray-600">평점: ${cafe.starring}</p>
								</div>
							`
				)
				.join("");
		})
		.catch((error) => {
			console.error(error);
			sectionContent.innerHTML =
				"<p class='text-red-500'>데이터를 불러오는 중 오류가 발생했습니다.</p>";
		});
}

// Fetch My Review Data
function loadReviews() {
	isLikedReviewSection = false;
	sectionTitle.textContent = "내가 작성한 리뷰";
	sectionContent.innerHTML =
		"<p class='text-gray-600'>내가 작성한 리뷰 데이터를 불러오는 중...</p>";
	fetch("/users/me/cafe-reviews")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch favorite cafes");
			}
			return response.json();
		})
		.then(({ data }) => {
			if (data.reviews.length === 0) {
				sectionContent.innerHTML =
					"<p class='text-gray-600'>내가 작성한 리뷰가 없습니다.</p>";
				return;
			}
			sectionContent.innerHTML = data.reviews
				.map(
					(review) => `
									<div class="flex justify-between border-b py-2">
											<div>
													<a href="/cafes/${review.cafe_id}" class="text-blue-500 hover:underline">
															${review.cafe_info.cafe_name}
													</a>
													<p class="text-sm text-gray-500 mt-1">${review.content}</p>
											</div>
											<p class="text-sm text-gray-600">
													${new Date(review.date).toLocaleDateString("ko-KR")}
											</p>
									</div>
								`
				)
				.join("");
		})
		.catch((error) => {
			console.error(error);
			sectionContent.innerHTML =
				"<p class='text-red-500'>데이터를 불러오는 중 오류가 발생했습니다.</p>";
		});
}

let currentPage = 0;
let isLoading = false;
let hasMoreLikedReviews = true;
let isLikedReviewSection = false;

// Fetch My Liked Review Data -> Scroll
function loadLikedReviews(pageNum = 0) {
	isLikedReviewSection = true;
	sectionTitle.textContent = "내가 좋아요한 리뷰";
	if (pageNum === 0) {
		sectionContent.innerHTML =
			"<p class='text-gray-600'>내가 좋아요한 리뷰 데이터를 불러오는 중...</p>";
	}
	isLoading = true;

	fetch(`/users/me/liked-reviews?page_num=${pageNum}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch liked reviews");
			}
			return response.json();
		})
		.then(({ data }) => {
			if (pageNum === 0) {
				sectionContent.innerHTML = "";
			}

			// 불러온 데이터가 없으면 추가 데이터 없음 처리
			if (data.reviews.length === 0) {
				if (pageNum === 0) {
					sectionContent.innerHTML =
						"<p class='text-gray-600'>내가 좋아요한 리뷰가 없습니다.</p>";
				}
				hasMoreLikedReviews = false;
				return;
			}

			// 그룹별로 좋아요한 리뷰 렌더링
			const newGroups = data.reviews
				.map((group) => {
					return `
				<div class="mb-4">
				  <!-- 카페 정보 헤더 -->
				  <div class="border-b pb-2 mb-2">
					<a href="/cafes/${
						group.cafe_info.cafe_id
					}" class="text-blue-500 hover:underline text-lg font-semibold">
					  ${group.cafe_info.cafe_name}
					</a>
				  </div>
				  <!-- 리뷰 목록 -->
				  ${group.reviews
						.map(
							(review) => `
											<div>
												<p class="text-sm text-gray-500">${review.content}</p>
												<p class="text-sm text-gray-600 text-right">좋아요: ${review.likes}</p>
											</div>
										`
						)
						.join("")}
				</div>
			  `;
				})
				.join("");

			sectionContent.innerHTML += newGroups;
		})
		.catch((error) => {
			console.error(error);
			if (pageNum === 1) {
				sectionContent.innerHTML =
					"<p class='text-red-500'>데이터를 불러오는 중 오류가 발생했습니다.</p>";
			}
		})
		.finally(() => {
			isLoading = false;
		});
}

const sectionContentElement = document.getElementById("sectionContent");
sectionContentElement.addEventListener("scroll", () => {
	if (
		isLikedReviewSection &&
		hasMoreLikedReviews &&
		!isLoading &&
		sectionContentElement.scrollTop + sectionContentElement.clientHeight >=
			sectionContentElement.scrollHeight - 200
	) {
		currentPage++;
		loadLikedReviews(currentPage);
	}
});
