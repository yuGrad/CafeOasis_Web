const container = document.getElementById("reviewsContainer");

document.addEventListener("DOMContentLoaded", () => {
	const cafeId = document.getElementById("cafe_id").value;

	fetch(`/cafes/reviews/${cafeId}?pageNum=1`)
		.then((response) => {
			if (!response.ok) throw new Error(`Servier error(${response.status})`);

			return response.json();
		})
		.then((reviews) => {
			updateReviewsHTML(reviews);
		})
		.catch((error) => console.error("Fetching error:", error));
});

function updateReviewsHTML(reviews) {
	container.innerHTML = ""; // 기존 내용을 지웁니다.

	if (reviews.length > 0) {
		reviews.forEach((review, idx) => {
			const reviewElement = document.createElement("div");

			reviewElement.id = `reviewdiv_${idx}`;
			reviewElement.className =
				"relative bg-white p-4 rounded-lg shadow-md mb-4";
			reviewElement.innerHTML = `
						<div class="flex items-center space-x-4">
								<input type="hidden" id="review_${idx}" value="${review._id}" />
								<div class="text-sm font-semibold">${review.reviewer}</div>
								<div class="text-gray-500 text-xs">${new Date(
									review.date
								).toLocaleDateString()}</div>
								<button class="absolute top-2 right-2 focus:outline-none" onclick="removeReview(${idx})">
										❌
								</button>
						</div>
						<p class="text-gray-700 mt-2">${review.content}</p>
						<div class="flex items-center mt-2">
								${Array(Number(review.starring)).fill("&#9733;").join("")}${Array(
				5 - review.starring
			)
				.fill("&#9734;")
				.join("")}
								<span class="text-gray-500 text-xs">(평점: ${review.starring}/5)</span>
								<div class="absolute bottom-2 right-2 flex items-center justify-end text-blue-500 hover:text-blue-600 text-xs mt-2">
								<button class="focus:outline-none" onclick="increaseLikeCnt(${idx})">
										좋아요
								</button>
								<p id="like_${idx}" class="ml-2">(${review.likes})</p>
						</div>
						</div>
			`;

			container.appendChild(reviewElement);
		});
	} else {
		container.innerHTML =
			'<div class="text-center text-gray-500">아직 리뷰가 없습니다.</div>';
	}
}

function increaseLikeCnt(idx) {
	const reviewId = document.getElementById(`review_${idx}`).value;
	const likeTag = document.getElementById(`like_${idx}`);

	fetch(`/cafes/reviews/${reviewId}/likes`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			if (!response.ok) throw new Error(`Servier error(${response.status})`);

			const likeTagLength = likeTag.innerText.length;
			const likeTagValue = Number(
				likeTag.innerText.slice(1, likeTagLength - 1)
			);

			likeTag.innerText = `(${likeTagValue + 1})`;
		})
		.catch((error) => console.error("Fetching error:", error));
}

async function submitCafeReview() {
	const cafeId = document.getElementById("cafe_id").value;
	// const reviewer = document.getElementById("reviewer").value; // reviewr 데이터는 session에 존재
	const content = document.getElementById("content").value;
	const starring = document.querySelector(
		'input[name="starring"]:checked'
	)?.value;

	if (!content || !starring) {
		alert("리뷰 내용이나 별점이 비었습니다.");
		return;
	}
	try {
		const response = await fetch(`/cafes/reviews/${cafeId}`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				cafe_id: cafeId,
				content: content,
				starring: starring,
			}),
		});

		if (!response.ok) throw new Error("리뷰 등록 실패, 서버측 error");
		// 새로고침
		location.reload(true);
	} catch (err) {
		console.log(err);
	}
}

function removeReview(idx) {
	const reviewDiv = document.getElementById(`reviewdiv_${idx}`);
	const cafeId = document.getElementById("cafe_id").value;
	const reviewId = document.getElementById(`review_${idx}`).value;

	fetch(`/cafes/${cafeId}/reviews/${reviewId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			if (!response.ok) {
				response.json().then((data) => alert(data.message));
				throw new Error(`Servier error(${response.status})`);
			}

			container.removeChild(reviewDiv);
		})
		.catch((error) => {
			console.error("Fetching error:", error);
		});
}

function updatePagination(direction) {
	const cafeId = document.getElementById("cafe_id").value;
	const currentPageNum = document.getElementById("currentPage");
	const nextPageNum = Number(currentPageNum.textContent) + Number(direction);

	if (nextPageNum > 0) {
		fetch(`/cafes/reviews/${cafeId}?pageNum=${nextPageNum}`)
			.then((response) => {
				if (!response.ok) throw new Error(`Server error(${response.status})`);

				return response.json();
			})
			.then((reviews) => {
				updateReviewsHTML(reviews);
				currentPageNum.innerText = nextPageNum;
			})
			.catch((error) => console.error("Fetching error:", error));
	}
}
