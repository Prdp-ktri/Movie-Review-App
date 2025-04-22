document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reviewForm");
  const reviewList = document.getElementById("reviewList");

  // Load existing reviews on page load
  fetch("/api/reviews")
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

      const formData = new FormData(form); // includes all form fields including file input

      fetch("https://movie-review-app-57cf.onrender.com/api/reviews", {
        method: "POST",
        body: formData, // No JSON.stringify — this handles files too
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
          addReviewToDOM(data); // Add the new review to the page
          form.reset(); // Optional: reset form after submission
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
