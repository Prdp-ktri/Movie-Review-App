document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reviewForm");
  const reviewList = document.getElementById("reviewList");

  // Load existing reviews on page load
  fetch("http://localhost:3000/api/reviews")
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
      const review = {
        title: formData.get("title"),
        review: formData.get("review"),
        rating: formData.get("rating"),
        reviewer: formData.get("reviewer"),
      };

      fetch("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          addReviewToDOM(data); // Add the new review to the DOM
          form.reset(); // Clear the form
        })
        .catch((error) => console.error("Error submitting review:", error));
    });
  }

  // Add review to the DOM
  function addReviewToDOM(review) {
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";
    reviewItem.setAttribute("data-id", review._id);
    reviewItem.innerHTML = `
      <h3>${review.title} (${review.rating}/5)</h3>
      <p>${review.review}</p>
      <p><strong>Reviewer:</strong> ${review.reviewer || "Anonymous"}</p>
      <button onclick="editReview('${review._id}')">Edit</button>
      <button onclick="deleteReview('${review._id}')">Delete</button>
      <hr/>
    `;
    reviewList.appendChild(reviewItem);
  }

  // Function to edit a review
  window.editReview = function (reviewId) {
    const newReviewText = prompt("Enter the updated review:");
    const newRating = prompt("Enter the updated rating (1-5):");

    if (newReviewText && newRating) {
      fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: newReviewText, rating: newRating }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((updatedReview) => {
          const reviewItem = document.querySelector(
            `.review-item[data-id="${reviewId}"]`
          );
          reviewItem.querySelector("p:nth-of-type(1)").textContent =
            updatedReview.review;
          reviewItem.querySelector(
            "h3"
          ).textContent = `${updatedReview.title} (${updatedReview.rating}/5)`;
        })
        .catch((error) => console.error("Error updating review:", error));
    }
  };

  // Function to delete a review
  window.deleteReview = function (reviewId) {
    fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          document
            .querySelector(`.review-item[data-id="${reviewId}"]`)
            .remove();
        } else {
          console.error("Failed to delete review:", response.statusText);
        }
      })
      .catch((error) => console.error("Error while deleting review:", error));
  };
});
