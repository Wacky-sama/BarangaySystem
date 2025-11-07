const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "staff") {
  alert("Unauthorized access! Redirecting...");
  window.location.href = "login.html";
}

document.getElementById(
  "staffNameNav"
).textContent = `${user.first_name} ${user.last_name}`;
document.getElementById(
  "staffNameDashboard"
).textContent = `${user.first_name} ${user.last_name}`;

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadVerificationList();
  loadReleaseList();
});

function loadStats() {
  fetch(`${API_URL}/staff/stats`)
    .then((res) => res.json())
    .then((stats) => {
      const container = document.getElementById("staff-stats");

      const cards = [
        {
          title: "To Verify",
          value: stats.to_verify,
          icon: "📝",
          color: "warning",
        },
        {
          title: "Ready for Printing",
          value: stats.ready_to_print,
          icon: "📄",
          color: "success",
        },
        {
          title: "Released Today",
          value: stats.released_today,
          icon: "✅",
          color: "primary",
        },
      ];

      container.innerHTML = cards
        .map(
          (card) => `
        <div class="col-md-4">
          <div class="card text-center border-${card.color} border-2">
            <div class="card-body">
              <h2>${card.icon}</h2>
              <h5 class="card-title">${card.title}</h5>
              <p class="fw-bold fs-3 text-${card.color}">${card.value}</p>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    });
}

function loadVerificationList() {
  fetch(`${API_URL}/staff/for-verification`)
    .then((res) => res.json())
    .then((list) => {
      const tbody = document.querySelector("#verifyTable tbody");
      tbody.innerHTML = "";

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Nothing to verify.</td></tr>`;
        return;
      }

      list.forEach((item, i) => {
        tbody.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${item.first_name} ${item.last_name}</td>
            <td>${item.purpose}</td>
            <td><span class="badge bg-warning text-dark capitalize">${
              item.status
            }</span></td>
            <td>${new Date(item.created_at).toLocaleString()}</td>
            <td>
              <button class="btn btn-sm btn-success" onclick="verifyRequest('${
                item.id
              }')">Mark Verified</button>
            </td>
          </tr>
        `;
      });
    });
}

function verifyRequest(id) {
  if (!confirm("Mark this request as VERIFIED?")) return;

  fetch(`${API_URL}/staff/verify/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Staff-ID": user.user_id,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Verified!");
      loadStats();
      loadVerificationList();
      loadReleaseList();
    });
}

function loadReleaseList() {
  fetch(`${API_URL}/staff/for-release`)
    .then((res) => res.json())
    .then((list) => {
      const tbody = document.querySelector("#releaseTable tbody");
      tbody.innerHTML = "";

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No approved requests</td></tr>`;
        return;
      }

      list.forEach((r, i) => {
        tbody.innerHTML += `
    <tr>
      <td>${i + 1}</td>
      <td>
        ${r.first_name} ${r.last_name}
        ${
          r.request_type === "Walk-In"
            ? '<span class="badge bg-info ms-2">Walk-In</span>'
            : ""
        }
      </td>
      <td>${r.purpose}</td>
      <td>${r.control_number || "—"}</td>
      <td><span class="badge bg-success capitalize">approved</span></td>
      <td>
        <button class="btn btn-sm btn-primary me-2" onclick="printClearance('${
          r.id
        }')">
          Print
        </button>
        <button class="btn btn-sm btn-success" onclick="markReleased('${
          r.id
        }')">
          Release
        </button>
      </td>
    </tr>
  `;
      });
    });
}

function printClearance(id) {
  window.open(`print_clearance.html?id=${id}`, "_blank");
}

function markReleased(id) {
  if (!confirm("Mark this clearance as RELEASED?")) return;

  fetch(`${API_URL}/staff/release/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Staff-ID": user.user_id,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "Marked released!");
      loadStats();
      loadReleaseList();
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const walkInForm = document.getElementById("walkInForm");
  const contactInput = walkInForm.querySelector('input[name="contact_number"]');

  // Format contact number as user types
  contactInput.addEventListener("input", () => {
    let digits = contactInput.value.replace(/\D/g, "").slice(0, 11);
    let formatted = "";

    if (digits.length > 0) formatted = digits.slice(0, 4);
    if (digits.length >= 5) formatted += "-" + digits.slice(4, 7);
    if (digits.length >= 8) formatted += "-" + digits.slice(7, 11);

    contactInput.value = formatted;
  });

  // Walk-In submit
  walkInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(walkInForm);

    // Clean up contact number before sending
    const cleanContact = formData.get("contact_number").replace(/\D/g, "");

    fetch(`${API_URL}/staff/walk-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Staff-ID": user.user_id,
      },
      body: JSON.stringify({
        name: formData.get("name"),
        gender: formData.get("gender"),
        birthdate: formData.get("birthdate"),
        address: "Casambalangan, Santa Ana, Cagayan",
        contact_number: cleanContact,
        purpose: formData.get("purpose"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Walk-in request encoded!");
        walkInForm.reset();
        loadStats();
        loadVerificationList();
      });
  });
});
