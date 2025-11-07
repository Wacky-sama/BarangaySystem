document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const messageDiv = document.getElementById("message");

  const firstNameInput = document.getElementById("first_name");
  const lastNameInput = document.getElementById("last_name");
  const middleInitialInput = document.getElementById("middle_initial");
  const usernameInput = document.getElementById("username");
  const birthdateInput = document.getElementById("birthdate");
  const contactInput = document.getElementById("contact_number");

  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const middleError = document.getElementById("middleError");
  const birthdateError = document.getElementById("birthdateError");
  const contactError = document.getElementById("contactError");
  const usernameError = document.getElementById("usernameError");

 function capitalizeWords(str) {
    return str
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase())
      .replace(/\s+/g, " ");
  }

  firstNameInput.addEventListener("input", () => {
    firstNameInput.value = capitalizeWords(firstNameInput.value.replace(/[^a-zA-Z\s'"-]/g, ""));
  });

  lastNameInput.addEventListener("input", () => {
    lastNameInput.value = capitalizeWords(lastNameInput.value.replace(/[^a-zA-Z\s]/g, ""));
    lastNameError.textContent =
      /^[A-Za-z\s]+$/.test(lastNameInput.value) ? "" : "Letters only.";
  });

  middleInitialInput.addEventListener("input", () => {
    middleInitialInput.value = middleInitialInput.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 1);
  });

  usernameInput.addEventListener("input", () => {
    usernameInput.value = usernameInput.value.toLowerCase().replace(/\s/g, "");
  });

  contactInput.addEventListener("input", () => {
    let digits = contactInput.value.replace(/\D/g, "").slice(0, 11);

    let formatted = "";
    if (digits.length > 0) formatted = digits.slice(0, 4);
    if (digits.length >= 5) formatted += "-" + digits.slice(4, 7);
    if (digits.length >= 8) formatted += "-" + digits.slice(7, 11);

    contactInput.value = formatted;

    if (digits.length > 0 && digits.length < 11) {
      contactError.textContent = "Contact number must be 11 digits.";
    } else {
      contactError.textContent = "";
    }
  });

  birthdateInput.addEventListener("change", () => {
    const today = new Date();
    const birthdate = new Date(birthdateInput.value);

    const age = today.getFullYear() - birthdate.getFullYear();
    const month = today.getMonth() - birthdate.getMonth();
    const day = today.getDate() - birthdate.getDate();

    if (birthdate > today) {
      birthdateError.textContent = "Birthdate cannot be in the future.";
      return;
    }

    if (age < 18 || (age === 18 && (month < 0 || (month === 0 && day < 0)))) {
      birthdateError.textContent = "You must be at least 18 years old.";
    } else {
      birthdateError.textContent = "";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (
      firstNameError.textContent ||
      lastNameError.textContent ||
      birthdateError.textContent ||
      contactError.textContent
    ) {
      messageDiv.textContent = "Fix the errors before submitting.";
      messageDiv.className = "text-danger fw-bold";
      return;
    }

    const formData = Object.fromEntries(new FormData(form).entries());
    formData.contact_number = contactInput.value.replace(/\D/g, "");

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      messageDiv.textContent = data.message;
      messageDiv.className =
        data.status === "success"
          ? "text-success fw-bold"
          : "text-danger fw-bold";

      if (data.status === "success") {
        form.reset();
          window.location.href = "login.html";
      }
    } catch (err) {
      console.error("Registration error:", err);
      messageDiv.textContent = "Something went wrong. Try again.";
      messageDiv.className = "text-danger fw-bold";
    }
  });

  const today = new Date().toISOString().split("T")[0];
  birthdateInput.max = today;
});
