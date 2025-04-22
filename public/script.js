const form = document.getElementById("review-form");
const reviewsDiv = document.getElementById("reviews");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  await fetch("/api/reviews", {
    method: "POST",
    body: formData,
  });
  form.reset();
  loadReviews();
});

async function loadReviews() {
  reviewsDiv.innerHTML = "";
  const res = await fetch("/api/reviews");
  const reviews = await res.json();

  reviews.forEach(({ title, review, rating, reviewer, image }) => {
    const reviewEl = document.createElement("div");
    reviewEl.classList.add("review");
    reviewEl.innerHTML = `
      <h2>${title}</h2>
      <p><strong>Rating:</strong> ${rating}/10</p>
      <p>${review}</p>
      <p><em>– ${reviewer}</em></p>
      ${image ? `<img src="${image}" alt="Movie Poster"/>` : ""}
    `;
    reviewsDiv.appendChild(reviewEl);
  });
}

loadReviews();
