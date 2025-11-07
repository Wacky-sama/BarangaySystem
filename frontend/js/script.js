document.getElementById("loginBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("loginMessage");

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    messageEl.textContent = data.message;

    if (data.status === "success") {
      const role = String(data.role).trim().toLowerCase();
      console.log("User role from backend:", role);
      localStorage.setItem("user", JSON.stringify({
          user_id: data.user_id,
          role: role,
          first_name: data.first_name,
          last_name: data.last_name,
        })
      );
      messageEl.style.color = "green";

      switch (role) {
        case "admin":
          window.location.href = "admin.html";
          break;
        case "staff":
          window.location.href = "staff.html";
          break;
        case "resident":
          window.location.href = "resident.html";
          break;
        default:
          alert("Unknown role: " + role);
          window.location.href = "login.html";
      }
    } else {
      messageEl.style.color = "red";
    }
  } catch (error) {
    messageEl.textContent = "Error connecting to server.";
    messageEl.style.color = "red";
  }
});
