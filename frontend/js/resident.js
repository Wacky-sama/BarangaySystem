const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "resident") {
  alert("Unauthorized access! Redirecting...");
  window.location.href = "login.html";
}

document.getElementById("residentNameNav").textContent =
  `${user.first_name} ${user.last_name}`;
document.getElementById("residentNameDashboard").textContent =
  `${user.first_name} ${user.last_name}`;

const requestsTable = document.getElementById("requestsTable");

function showToast(title, message, type = "info") {
  const toast = new bootstrap.Toast(document.getElementById("toast"));
  document.getElementById("toast-title").textContent = title;
  document.getElementById("toast-body").textContent = message;

  const header = document.querySelector("#toast .toast-header");
  header.className = "toast-header";
  if (type === "success") header.classList.add("bg-success", "text-white");
  if (type === "error") header.classList.add("bg-danger", "text-white");
  if (type === "warning") header.classList.add("bg-warning");

  toast.show();
}

const textarea = document.getElementById("clearancePurpose");
const charCount = document.getElementById("charCount");

textarea.addEventListener("input", () => {
  charCount.textContent = `${textarea.value.length} / 200 characters`;
});

async function loadRequests() {
  try {
    const response = await fetch(`${API_URL}/clearances/user/${user.user_id}`);
    const clearances = await response.json();

    requestsTable.innerHTML = "";

    if (clearances.length === 0) {
      requestsTable.innerHTML = '<tr><td colspan="4" class="text-center">No requests yet.</td></tr>';
      return;
    }

    clearances.forEach(r => {
      requestsTable.innerHTML += `
        <tr>
          <td>${r.purpose}</td>
          <td>${r.control_number || '-'}</td>
          <td>${new Date(r.created_at).toLocaleString()}</td>
          <td class="capitalize">
            <span class="badge bg-${r.status === 'approved' ? 'success' : r.status === 'verified' ? 'warning text-dark' : 'secondary'}">
              ${r.status}
            </span>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    requestsTable.innerHTML = '<tr><td colspan="4">Failed to load requests.</td></tr>';
  }
}

document.getElementById("submitRequest").addEventListener("click", async () => {
  const purpose = textarea.value.trim();

  if (purpose.length < 10) {
    return showToast("Validation Error", "Purpose must be at least 10 characters long.", "warning");
  }

  if (purpose.length > 200) {
    return showToast("Validation Error", "Purpose cannot exceed 200 characters.", "warning");
  }

  const btn = document.getElementById("submitRequest");
  btn.disabled = true;
  btn.textContent = "Submitting...";

  try {
    const response = await fetch(`${API_URL}/clearances`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ user_id: user.user_id, purpose })
    });

    const data = await response.json();

    if (data.status === "success") {
      showToast("Success!", "Your clearance request has been submitted.", "success");
      textarea.value = "";
      charCount.textContent = "0 / 200 characters";
      loadRequests();
    } else {
      showToast("Error", data.message || "Submission failed.", "error");
    }
  } catch (error) {
    showToast("Error", "Server error while submitting.", "error");
  }

  btn.disabled = false;
  btn.textContent = "Submit Request";
});

loadRequests();
