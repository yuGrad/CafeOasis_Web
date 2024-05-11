document.addEventListener("DOMContentLoaded", () => {
  const cafeId = document.getElementById("cafe_id").value;

  fetch(`/cafes/reviews/${cafeId}`)
    .then((response) => {
      if (!response.ok) throw new Error(`Servier error(${response.status})`);

      return response.json();
    })
    .then((reviews) => {
      updateReviewsHTML(reviews);
    })
    .catch((error) => console.error("Fetching error:", error));

  function updateReviewsHTML(reviews) {
    const container = document.getElementById("reviewsContainer");
    container.innerHTML = ""; // 기존 내용을 지웁니다.

    if (reviews.length > 0) {
      reviews.forEach((review) => {
        const reviewElement = document.createElement("div");
        reviewElement.className = "bg-white p-4 rounded-lg shadow";

        reviewElement.innerHTML = `
          <div class="flex items-center space-x-4 mb-4">
            <div class="text-sm font-semibold">${review.reviewer}</div>
            <div class="text-gray-500 text-xs">${new Date(
              review.date
            ).toLocaleDateString()}</div>
          </div>
          <p class="text-gray-700">${review.context}</p>
          <div class="flex items-center mt-2">
            ${Array(review.starring).fill("&#9733;").join("")}${Array(
          5 - review.starring
        )
          .fill("&#9734;")
          .join("")}
            <span class="text-gray-500 text-xs">(평점: ${
              review.starring
            }/5)</span>
          </div>
          <div class="text-right">
            <button class="text-blue-500 hover:text-blue-600 text-xs">좋아요 (${
              review.likes
            })</button>
          </div>
        `;

        container.appendChild(reviewElement);
      });
    } else {
      container.innerHTML =
        '<div class="text-center text-gray-500">아직 리뷰가 없습니다.</div>';
    }
  }
});
