document.addEventListener("DOMContentLoaded", function () {
    // Function to get a cookie by name
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
  
      if (parts.length === 2) return parts.pop().split(";").shift();
    }
  
    // Function to set the authToken cookie
    function setCookie(name, value) {
      document.cookie = `${name}=${value}; path=/; max-age=3600`;
    }
  
    // Check if user is logged in
    let authToken = getCookie("authToken");
    const loggedInMenu = document.getElementById("loggedIn");
    const loggedOutMenu = document.getElementById("loggedOut");
  
    if (authToken) {
      loggedInMenu.classList.remove("d-none");
      loggedOutMenu.classList.add("d-none");
    } else {
      loggedInMenu.classList.add("d-none");
      loggedOutMenu.classList.remove("d-none");
    }
  
    // Logout functionality
    const logoutButton = document.querySelector(
      '#loggedIn a[href="logout.html"]'
    );
    if (logoutButton) {
      logoutButton.addEventListener("click", function (e) {
        e.preventDefault();
        document.cookie = "authToken=; Max-Age=-99999999; path=/";
        window.location.href = "http://127.0.0.1:8080/library-ui/index.html";
      });
    }
  
    // Fetch users
    const usersTableBody = document.getElementById("users-list");
  
    async function fetchUsers() {
      try {
        authToken = getCookie("authToken");
  
        const response = await fetch(
          "http://127.0.0.1:8080/library/public/user/display",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
  
        authToken = getCookie("authToken");
  
        const data = await response.json();
  
        if (data.status === "success") {
          setCookie("authToken", data.token);
          // Populate users
          const users = data.data;
          usersTableBody.innerHTML = "";
  
          users.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                          <td>${user.username}</td>
                      `;
            usersTableBody.appendChild(row);
          });
        } else {
          alert("Failed to fetch users: " + data.data.title);
          window.location.href =
            "http://127.0.0.1:8080/library-ui/users/authenticate.html";
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    }
  
    fetchUsers();
    
    // Handle update form submission
    const updateUserForm = document.getElementById("manageFormContainer");
    if (updateUserForm) {
      updateUserForm.addEventListener("submit", async function (e) {
        e.preventDefault();
  
        const newUsername = document.getElementById("new-username").value.trim();
        const repeatUsername = document
          .getElementById("repeat-username")
          .value.trim();
        const newPassword = document.getElementById("new-password").value.trim();
        const repeatPassword = document
          .getElementById("repeat-password")
          .value.trim();
  
        // Validate input
        if (newUsername && newUsername !== repeatUsername) {
          alert("Usernames do not match!");
          return;
        }
        if (newPassword !== repeatPassword) {
          alert("Passwords do not match!");
          return;
        }
  
        if (!newPassword && !newUsername) {
          alert("You must update either the username or password.");
          return;
        }
  
        // Get the token
        const authToken = getCookie("authToken");
  
        try {
          const response = await fetch(
            "http://127.0.0.1:8080/library/public/user/update",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                username: newUsername || undefined,
                password: newPassword || undefined,
              }),
            }
          );
  
          const data = await response.json();
  
          if (data.status === "success") {
            // Update the token
            setCookie("authToken", data.token);
  
            alert("User updated successfully!");
            document.getElementById("manageFormContainer").style.display = "none";
            fetchUsers();
            // Clear each input field
            document.getElementById("new-username").value = "";
            document.getElementById("repeat-username").value = "";
            document.getElementById("new-password").value = "";
            document.getElementById("repeat-password").value = "";
          } else {
            alert("Failed to update user: " + (data.data?.title || data.message));
          }
        } catch (error) {
          console.error("Error updating user:", error);
          alert("Error updating user. Please try again later.");
        }
      });
    }
  
    // Manage user button click event
    const manageAccBtn = document.getElementById("manage-account-btn");
    manageAccBtn.addEventListener("click", function () {
      document.getElementById("manageFormContainer").style.display = "block";
    });
  
    // Function to handle account deletion
    function deleteAccount() {
      if (confirm("Are you sure you want to delete your account?")) {
        const authToken = getCookie("authToken");
  
        fetch("http://127.0.0.1:8080/library/public/user/delete", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              alert("Account successfully deleted!");
              window.location.href =
                "http://127.0.0.1:8080/library-ui/users/authenticate.html";
            } else {
              alert(
                "Failed to delete account: " +
                  (data.data?.title || "Unknown error")
              );
            }
          })
          .catch((error) => {
            console.error("Error deleting account:", error);
            alert("Error deleting account. Please try again later.");
          });
      }
    }
  
    // Attach the deleteAccount function to the Delete Account button
    const deleteAccountButton = document.querySelector(
      ".btn.btn-danger.w-100.mb-3"
    );
    if (deleteAccountButton) {
      deleteAccountButton.addEventListener("click", deleteAccount);
    }
  });  