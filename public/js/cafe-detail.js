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

    reviews.forEach((review) => {
      const reviewElem = document.createElement("div");
      reviewElem.className = "review";
      reviewElem.innerHTML = `
                <h4>${review.reviewer}</h4>
                <p>${review.context}</p>
                <p>Rating: ${review.starring}</p>
            `;
      container.appendChild(reviewElem);
    });
  }
});
