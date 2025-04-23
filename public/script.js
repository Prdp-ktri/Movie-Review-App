let reviewerName = "";
let reviewText = "";
let ratingValue = "";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reviewForm");
  const reviewList = document.getElementById("reviewList");

  // Load existing reviews on page load
  fetch("https://movie-review-backend-app.onrender.com/api/reviews")
    .then((response) => response.json())
    .then((reviews) => {
      reviews.forEach(addReviewToDOM);
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
    });

  // Handle form submission
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const title = formData.get("title");
      const review = formData.get("review");
      const rating = formData.get("rating");
      const reviewer = formData.get("reviewer");

      fetch("https://movie-review-backend-app.onrender.com/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review: reviewText,
          rating: ratingValue,
          reviewer: reviewerName,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Review submitted successfully:", data);
        })
        .catch((error) => console.error("Error submitting review:", error));
    });
  }

  // Add review to the DOM
  function addReviewToDOM(review) {
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";
    reviewItem.innerHTML = `
      <h3>${review.title} (${review.rating}/5)</h3>
      <p>${review.review}</p>
      <p><strong>Reviewer:</strong> ${review.reviewer || "Anonymous"}</p>
      ${
        review.imageUrl
          ? `<img src="${review.imageUrl}" alt="Movie cover" style="max-width: 150px;">`
          : ""
      }
      <hr/>
    `;
    reviewList.appendChild(reviewItem);
  }
});
