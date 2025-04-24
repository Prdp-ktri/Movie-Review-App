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

      const formData = new FormData(form);

      fetch("/api/reviews", {
        method: "POST",
        body: formData,
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
      ${
        review.coverImage
          ? `<img src="${review.coverImage}" alt="Cover Image" class="cover-image" />`
          : ""
      }
      <button onclick="editReview('${review._id}')">Edit</button>
      <button onclick="deleteReview('${review._id}')">Delete</button>
      <hr/>
    `;
    reviewList.appendChild(reviewItem);
  }

  // Function to edit a review
  window.editReview = function (reviewId) {
    const reviewItem = document.querySelector(
      `.review-item[data-id="${reviewId}"]`
    );
    const currentTitle = reviewItem
      .querySelector("h3")
      .textContent.split(" (")[0];
    const currentReviewText =
      reviewItem.querySelector("p:nth-of-type(1)").textContent;
    const currentRating = reviewItem
      .querySelector("h3")
      .textContent.match(/\((\d)\/5\)/)?.[1];
    const currentReviewer = reviewItem
      .querySelector("p:nth-of-type(2)")
      .textContent.replace("Reviewer: ", "");

    const newTitle = prompt("Enter the updated title:", currentTitle);
    const newReviewText = prompt(
      "Enter the updated review:",
      currentReviewText
    );
    const newRating = prompt("Enter the updated rating (1-5):", currentRating);
    const newReviewer = prompt(
      "Enter the updated reviewer name:",
      currentReviewer
    );

    const coverImageInput = document.createElement("input");
    coverImageInput.type = "file";
    coverImageInput.accept = "image/*";
    document.body.appendChild(coverImageInput);
    coverImageInput.click();

    coverImageInput.onchange = function () {
      const formData = new FormData();
      formData.append("title", newTitle || currentTitle);
      formData.append("review", newReviewText || currentReviewText);
      formData.append("rating", newRating || currentRating);
      formData.append("reviewer", newReviewer || currentReviewer);
      if (coverImageInput.files[0]) {
        formData.append("coverImage", coverImageInput.files[0]);
      }

      fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((updatedReview) => {
          reviewItem.querySelector(
            "h3"
          ).textContent = `${updatedReview.title} (${updatedReview.rating}/5)`;
          reviewItem.querySelector("p:nth-of-type(1)").textContent =
            updatedReview.review;
          reviewItem.querySelector(
            "p:nth-of-type(2)"
          ).textContent = `Reviewer: ${updatedReview.reviewer}`;
          if (updatedReview.coverImage) {
            const image =
              reviewItem.querySelector(".cover-image") ||
              document.createElement("img");
            image.src = updatedReview.coverImage;
            image.alt = "Cover Image";
            image.className = "cover-image";
            reviewItem.appendChild(image);
          }
          document.body.removeChild(coverImageInput);
        })
        .catch((error) => console.error("Error updating review:", error));
    };
  };

  // Function to delete a review
  window.deleteReview = function (reviewId) {
    fetch(`/api/reviews/${reviewId}`, {
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
