document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reviewForm");
  const reviewList = document.getElementById("reviewList");

  // Load existing reviews on page load
  fetch("https://movie-review-app-57cf.onrender.com/api/reviews")
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

      fetch("https://movie-review-app-57cf.onrender.com/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, review, rating, reviewer }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Server error ${res.status}: ${text}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Review submitted:", data);
          addReviewToDOM(data); // Add the new review to the DOM
          form.reset(); // Reset the form
        })
        .catch((err) => console.error("Error submitting review:", err));
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
