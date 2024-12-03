const mainContent = document.getElementById("mainContent");
const sectionTitle = document.getElementById("sectionTitle");
const sectionContent = document.getElementById("sectionContent");

document.addEventListener("DOMContentLoaded", () => {});

function loadSection(section) {
	mainContent.style.display = "block";

	if (section === "bookmarks") {
		loadBookmarks();
	} else if (section === "reviews") {
	}
}

// Fetch 즐겨찾기 카페 데이터
function loadBookmarks() {
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
				sectionContent.classList.remove("hidden");
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
