// --- Panel UI State Management ---
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", function () {
  navLinks.classList.toggle("active");
});

// --- Full-Stack Integration Logic ---
const API_URL = "http://localhost:3000/users";
const userForm = document.getElementById("user-form");
const usersList = document.getElementById("users-list");
const responseMessage = document.getElementById("response-message");

// Function to fetch database records from the backend API (GET)
function fetchUsers() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((payload) => {
      if (payload.status === "success") {
        usersList.innerHTML = ""; // Reset UI display container
        payload.data.forEach((user) => {
          const card = document.createElement("div");
          card.className = "user-card";
          card.innerHTML = `<p><strong>${user.name}</strong></p><p style="font-size:0.85rem;color:#666;">${user.email}</p>`;
          usersList.appendChild(card);
        });
      }
    })
    .catch((error) => {
      usersList.innerHTML =
        '<p style="color:red; font-size:0.85rem;">Server engine offline. Run server.js via node.</p>';
    });
}

// Function to send fresh JSON record updates to server engine (POST)
userForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Stop standard page refreshes

  const nameInput = document.getElementById("username").value;
  const emailInput = document.getElementById("useremail").value;

  const dataPayload = {
    name: nameInput,
    email: emailInput,
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataPayload),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success") {
        responseMessage.style.color = "green";
        responseMessage.textContent =
          "Success: Connection validation approved!";
        userForm.reset(); // Wipe form fields clean
        fetchUsers(); // Refresh live side metrics instantly
      } else {
        responseMessage.style.color = "red";
        responseMessage.textContent = "Error: " + result.message;
      }
    })
    .catch((error) => {
      responseMessage.style.color = "red";
      responseMessage.textContent = "Network processing interruption detected.";
    });
});

// Run initial ingress data poll on page loading completion
fetchUsers();
