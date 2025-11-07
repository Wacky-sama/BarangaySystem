const user = JSON.parse(localStorage.getItem("user"));
const adminId = user.user_id;
if (!user || user.role !== "admin") {
  alert("Unauthorized access! Redirecting to login...");
  window.location.href = "login.html";
}

document.getElementById("adminNameNav").textContent = 
`${user.first_name} ${user.last_name}`;
document.getElementById("adminNameDashboard").textContent = 
`${user.first_name} ${user.last_name}`;

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadClearances();
  loadPendingUsers();
  loadResidents();
  loadStaff();
});

function loadStats() {
  fetch(`${API_URL}/admin/stats`)
    .then((res) => res.json())
    .then((stats) => {
      const container = document.getElementById("stats-cards");
      const cards = [
        {
          title: "Total Residents",
          value: stats.total_residents,
          icon: "👥",
          color: "primary",
        },
        {
          title: "Pending Requests",
          value: stats.pending_requests,
          icon: "🕒",
          color: "warning",
        },
        {
          title: "Certificates Issued",
          value: stats.issued_certificates,
          icon: "📜",
          color: "success",
        },
        {
          title: "Staff Members",
          value: stats.staff_count,
          icon: "👨‍💼",
          color: "info",
        },
      ];

      container.innerHTML = cards
        .map(
          (card) => `
        <div class="col-md-3">
          <div class="card text-center border-${card.color} border-2">
            <div class="card-body">
              <h2>${card.icon}</h2>
              <h5 class="card-title mt-2">${card.title}</h5>
              <p class="fw-bold fs-4 text-${card.color}">${card.value}</p>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    })
    .catch((err) => console.error("Error loading stats:", err));
}

function loadClearances() {
  const tableBody = document.querySelector("#clearanceTable tbody");
  if (!tableBody) return;

  fetch(`${API_URL}/clearances`)
    .then((res) => res.json())
    .then((clearances) => {
      tableBody.innerHTML = "";

      if (clearances.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No clearance requests yet</td></tr>`;
        return;
      }

      clearances.forEach((c, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${c.first_name} ${c.last_name}</td>
          <td>${c.purpose || "—"}</td>
          <td>
            <span class="badge capitalize ${
              c.status === "verified" ? "bg-warning text-dark" : "bg-success"
            }">
              ${c.status}
            </span>
          </td>
          <td>${c.issued_date || "—"}</td>
          <td>${c.control_number || "—"}</td>
          <td>
            ${
              c.status === "verified"
                ? `<button class="btn btn-sm btn-success" onclick="approveClearance('${c.id}')">Approve</button>`
                : `<span class="text-muted">Approved</span>`
            }
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error loading clearances:", err);
      tableBody.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Failed to load clearances</td></tr>`;
    });
}

function approveClearance(id) {
  if (!confirm("Approve this clearance request?")) return;

  fetch(`${API_URL}/clearances/approve/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Admin-ID": adminId
    },
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Clearance approved!");
      loadStats();
      loadClearances();
    })
    .catch((err) => {
      console.error("Error approving clearance:", err);
      alert("Something went wrong during approval.");
    });
}

function loadPendingUsers() {
  const tableBody = document.querySelector("#pendingUsersTable tbody");
  if (!tableBody) return;

  fetch(`${API_URL}/pending-users`)
    .then((res) => res.json())
    .then((users) => {
      tableBody.innerHTML = "";

      if (users.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No pending registrations</td></tr>`;
        return;
      }

      users.forEach((u, i) => {
        const mi = u.middle_initial ? `${u.middle_initial}.` : "";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${i + 1}</td>
          <td>${u.first_name} ${mi} ${u.last_name}</td>
          <td>${u.username}</td>
          <td class="capitalize">${u.role}</td>
          <td>${new Date(u.created_at).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm btn-success me-2" onclick="updateUserStatus('${u.id}', 'approve')">Approve</button>
            <button class="btn btn-sm btn-danger" onclick="updateUserStatus('${u.id}', 'decline')">Decline</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error loading pending users:", err);
      tableBody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">Failed to load pending users</td></tr>`;
    });
}

function updateUserStatus(id, action) {
  if (!confirm(`Are you sure you want to ${action} this user?`)) return;

  fetch(`${API_URL}/users/${id}/${action}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Admin-ID": adminId
    },
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Action completed.");
      loadPendingUsers();
      loadResidents();
      loadStaff();
    })
    .catch((err) => {
      console.error("Error updating user:", err);
      alert("Something went wrong.");
    });
}

function loadResidents() {
  const tableBody = document.querySelector("#residentsTable tbody");
  if (!tableBody) return;

  fetch(`${API_URL}/approved-users`)
    .then((res) => res.json())
    .then((users) => {
      tableBody.innerHTML = "";

      const residents = users.filter(u => u.role === "resident");

      if (residents.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No residents yet</td></tr>`;  // Updated colspan to 5
        return;
      }

      residents.forEach((u) => {
        const mi = u.middle_initial ? `${u.middle_initial}.` : ""; 

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${u.first_name} ${mi} ${u.last_name}</td>
          <td>${u.username}</td>
          <td class="capitalize">${u.role}</td>  <!-- Added Role column -->
          <td>${new Date(u.created_at).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id}')">
              Delete
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error loading residents:", err);
      tableBody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Failed to load residents</td></tr>`;
    });
}

function loadStaff() {
  const tableBody = document.querySelector("#staffTable tbody");
  if (!tableBody) return;

  fetch(`${API_URL}/approved-users`)
    .then((res) => res.json())
    .then((users) => {
      tableBody.innerHTML = "";

      const staff = users.filter(u => u.role === "staff");

      if (staff.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No staff yet</td></tr>`;
        return;
      }

      staff.forEach((u) => {
        const mi = u.middle_initial ? `${u.middle_initial}.` : ""; 

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${u.first_name} ${mi} ${u.last_name}</td>
          <td>${u.username}</td>
          <td class="capitalize">${u.role}</td>  <!-- Added Role column -->
          <td>${new Date(u.created_at).toLocaleDateString()}</td>
          <td>  <!-- Added Action column -->
            <button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id}')">
              Delete
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error loading staff:", err);
      tableBody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Failed to load staff</td></tr>`;
    });
}

function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  fetch(`${API_URL}/users/${id}/delete`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Admin-ID": adminId
    },
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "User deleted successfully.");
      loadResidents();
      loadStaff();
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      alert("Something went wrong.");
    });
}

const addStaffBtn = document.getElementById("addStaffBtn");
const addStaffModal = new bootstrap.Modal(document.getElementById("addStaffModal"));
addStaffBtn.addEventListener("click", () => addStaffModal.show());

const addStaffForm = document.getElementById("addStaffForm");
const staffFirstName = document.getElementById("staffFirstName");
const staffLastName = document.getElementById("staffLastName");
const staffMiddleInitial = document.getElementById("staffMiddleInitial");
const staffUsername = document.getElementById("staffUsername");
const staffPassword = document.getElementById("staffPassword");

function createErrorMessage(id) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("small");
    el.id = id;
    el.className = "text-danger d-block";
    return el;
  }
  return el;
}
const firstNameError = createErrorMessage("staffFirstNameError");
const lastNameError = createErrorMessage("staffLastNameError");
const middleError = createErrorMessage("staffMiddleError");
const usernameError = createErrorMessage("staffUsernameError");

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/\s+/g, " ");
}

staffFirstName.addEventListener("input", () => {
  staffFirstName.value = capitalizeWords(staffFirstName.value.replace(/[^a-zA-Z\s'"-]/g, ""));
});

staffLastName.addEventListener("input", () => {
  staffLastName.value = capitalizeWords(staffLastName.value.replace(/[^a-zA-Z\s]/g, ""));
  lastNameError.textContent = /^[A-Za-z\s]+$/.test(staffLastName.value) ? "" : "Letters only";
});

staffMiddleInitial.addEventListener("input", () => {
  staffMiddleInitial.value = staffMiddleInitial.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0,1);
});

staffUsername.addEventListener("input", () => {
  staffUsername.value = staffUsername.value.toLowerCase().replace(/\s/g, "");
});

addStaffForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!staffFirstName.value || !staffLastName.value || !staffUsername.value || !staffPassword.value) {
    alert("Fill all required fields!");
    return;
  }
  if (firstNameError.textContent || lastNameError.textContent) {
    alert("Fix errors before submitting!");
    return;
  }

  const payload = {
    first_name: staffFirstName.value.trim(),
    last_name: staffLastName.value.trim(),
    middle_initial: staffMiddleInitial.value.trim(),
    username: staffUsername.value.trim(),
    password: staffPassword.value,
    admin_id: adminId
  };

  try {
    const res = await fetch(`${API_URL}/register-staff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.status === "success") {
      alert("Staff added successfully!");
      addStaffModal.hide();
      addStaffForm.reset();
      loadResidents();
      loadStaff();
    } else {
      alert(data.message || "Failed to add staff.");
    }
  } catch (err) {
    console.error("Error adding staff:", err);
    alert("Something went wrong.");
  }
});