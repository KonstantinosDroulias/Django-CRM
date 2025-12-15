function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(name + "=")) {
      return decodeURIComponent(c.substring(name.length + 1));
    }
  }
  return null;
}

const newLeadBtn = document.getElementById("newLeadBtn");
const newLeadForm = document.getElementById("newLeadForm");
const newLeadFormOverlay = document.getElementById("newLeadFormOverlay");
const backgroundOverlay = document.getElementById("backgroundOverlay");

const companyDetailBtn = document.getElementById("companyDetailsFlag");
const companyDetailsForm = document.getElementById("companyDetailsForm");

let displayFlag = false;
newLeadBtn.addEventListener('click', () => {
    if (!displayFlag) {
        newLeadFormOverlay.classList.remove("hidden");
        backgroundOverlay.classList.remove("hidden");
        displayFlag = true;
    }
})

backgroundOverlay.addEventListener('click', () => {
    if (displayFlag) {
        newLeadFormOverlay.classList.add("hidden");
        backgroundOverlay.classList.add("hidden");
        displayFlag = false;
    }
})

companyDetailBtn.addEventListener("change", () => {
    const isChecked = companyDetailBtn.checked;
    if (isChecked) {
        companyDetailsForm.classList.remove("hidden");
    } else {
        companyDetailsForm.classList.add("hidden");
    }
});

newLeadForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const payload = {
        customer_data: {
            first_name: document.getElementById("firstName").value,
            last_name: document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            phone_number: document.getElementById("phoneNumber").value,

            // CHANGE 2: Use 'value' instead of 'expected_value' to match Python
            value: document.getElementById("value").value,

            source_id: document.getElementById("new_source").value,
            lead_status_id: document.getElementById("new_lead_status").value,
        },
        company_data: null,
    };

    if (companyDetailBtn.checked) {
        payload.company_data = {
            name: document.getElementById("companyName").value,
            vat_id: document.getElementById("vatID").value,
        };
    }

  try {
    const res = await fetch("/customer/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Validation/API error:", data);
      return;
    }

  } catch (err) {
    console.error("Network error:", err);
  }
});