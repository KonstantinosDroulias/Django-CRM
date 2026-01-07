const newLeadBtn = document.getElementById("newLeadBtn");
const newLeadForm = document.getElementById("newLeadForm");
const newLeadFormOverlay = document.getElementById("newLeadFormOverlay");
const backgroundOverlay = document.getElementById("backgroundOverlay");

const companyDetailBtn = document.getElementById("companyDetailsFlag");
const companyDetailsForm = document.getElementById("companyDetailsForm");

const leadStatusOptions = JSON.parse(document.getElementById("lead-status-data").textContent);

let displayFlag = false;
function toggleModal() {
    if (!displayFlag) {
        newLeadFormOverlay.classList.remove("hidden");
        backgroundOverlay.classList.remove("hidden");
        displayFlag = true;
    } else {
        newLeadFormOverlay.classList.add("hidden");
        backgroundOverlay.classList.add("hidden");
        displayFlag = false;
    }
}

newLeadBtn.addEventListener('click', toggleModal);

backgroundOverlay.addEventListener('click', toggleModal);

companyDetailBtn.addEventListener("change", () => {
    const isChecked = companyDetailBtn.checked;
    if (isChecked) {
        companyDetailsForm.classList.remove("hidden");
    } else {
        companyDetailsForm.classList.add("hidden");
    }
});

async function loadTable() {
    const tbody = document.getElementById("customersTableBody");

    tbody.innerHTML = `
        <tr>
            <td colspan="12" class="py-10 text-center">
                <div class="flex flex-col items-center justify-center">
                    
                    <img class="animate-spin h-8 w-8 mb-2" src="/static/img/loading.svg" alt="Loading">
                    
                    <p class="text-gray-500 text-sm">Loading customers...</p>
                </div>
            </td>
        </tr>
    `;
    //await new Promise(resolve => setTimeout(resolve, 2000));
    try {
        const res = await fetch('/api/v1/customers/list/');

        if (!res.ok) {
            console.error("Failed to load table");
            return;
        }

        const rawData = await res.json();
        const customers = Array.isArray(rawData) ? rawData : rawData.results;

        tbody.innerHTML = '';

        customers.forEach(customer => {
            const companyHtml = customer.company_display_name
                ? `<td class="p-3 text-nowrap">
                        <p class="relative group">
                            ${customer.company_display_name}
                            <a href="company/${customer.company}" class="hidden group-hover:block absolute top-0 left-[-30px] z-50 p-1 border-1 bg-bg shadow-sm">
                                <img width="20px" height="20px" src="/static/img/business.svg" alt="Business Icon">
                            </a>
                        </p>
                    </td>`
                : `<td class="p-3 text-nowrap">No Details</td>`;

            let usersHtml = '';

            if (customer.assigned_users && customer.assigned_users.length > 0) {
                customer.assigned_users.forEach(u => {
                    let avatarHtml = '';

                    if (u.group === 'Manager') {
                        avatarHtml = `
                            <div class="relative" title="Manager">
                                <div class="border-2 border-orange-300 shrink-0 rounded-full overflow-hidden w-[32px] h-[32px]">
                                    <img src="${u.avatar}" alt="User Avatar" class="w-full h-full object-cover">
                                </div>
                                <img src="/static/img/star.svg" alt="Star Icon" width="16px" class="absolute top-[-15px] right-0 z-10 text-shadow translate-y-1/2">
                            </div>`;
                    }
                    else if (u.group === 'Admin') {
                        avatarHtml = `
                            <div title="Admin" class="border-2 border-brand-400 shrink-0 rounded-full overflow-hidden w-[32px] h-[32px]">
                                <img src="${u.avatar}" alt="User Avatar" class="w-full h-full object-cover">
                            </div>`;
                    }
                    else {
                        avatarHtml = `
                            <div title="Employee" class="shrink-0 rounded-full overflow-hidden w-[32px] h-[32px]">
                                <img src="${u.avatar}" alt="User Avatar" class="w-full h-full object-cover">
                            </div>`;
                    }

                    usersHtml += `
                        <div class="flex items-center gap-2 mb-1">
                             ${avatarHtml}
                             <p class="text-text text-lg">${u.username}</p>
                        </div>`;
                });
            } else {
                usersHtml = '<span class="text-gray-400 text-sm">Unassigned</span>';
            }

            const optionsHtml = leadStatusOptions.map(status => {
                const isSelected = customer.lead_status == status.id ? 'selected' : '';
                return `<option value="${status.id}" ${isSelected}>${status.name}</option>`;
            }).join('');

            const lastContactHtml = `
                <input 
                    type="date" 
                    value="${customer.last_contact || ''}" 
                    data-id="${customer.id}" 
                    data-field="last_contact"
                    onchange="updateCustomerDate(this)"
                    class="bg-transparent border-none text-sm text-gray-700 focus:ring-brand-400 rounded-sm p-1 hover:bg-gray-100 cursor-pointer"
                >`;

            const nextContactHtml = `
                <input 
                    type="date" 
                    value="${customer.next_contact || ''}" 
                    data-id="${customer.id}" 
                    data-field="next_contact" 
                    onchange="updateCustomerDate(this)"
                    class="bg-transparent border-none text-sm text-gray-700 focus:ring-brand-400 rounded-sm p-1 hover:bg-gray-100 cursor-pointer"
                >`;

            const row = `
                <tr class="group border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    
                    <td class="p-3 text-nowrap">
                        <p class="relative">
                            ${customer.first_name} ${customer.last_name}
                            <a class="hidden group-hover:block absolute top-0 left-[-30px] z-50 p-1 border-1 bg-bg shadow-sm" href="/customer/${customer.id}">
                                <img width="20px" height="20px" src="/static/img/PersonIcon.svg" alt="Edit Icon">
                            </a>
                        </p>
                    </td>
           
                    ${companyHtml}
           
                    <td class="p-3 text-nowrap">${customer.email}</td>
                    <td class="p-3 text-nowrap">${customer.phone_number || '-'}</td>
                    
                    <td class="p-3 text-nowrap">${customer.source_name || '-'}</td>
           
                    <td class="p-3 text-nowrap">
                        <select class="pl-1 py-1 pr-2 text-sm bg-bg border-1 rounded-sm">
                            ${optionsHtml}
                        </select>
                    </td>
           
                    <td class="p-3 text-nowrap">
                        <div class="h-[40px] overflow-y-scroll space-y-1 scrollbar-thin">
                            ${usersHtml}
                        </div>
                    </td>
           
                    <td class="p-3 text-nowrap">${lastContactHtml}</td>
                    <td class="p-3 text-nowrap">${nextContactHtml}</td>
           
                    <td class="p-3 text-nowrap">
                        ${customer.value ? customer.value + '€' : '<span class="text-center block">-</span>'}
                    </td>
           
                    <td class="p-3 text-nowrap">
                        ${new Date(customer.created_at).toLocaleDateString()}
                    </td>
                </tr>
            `;

            tbody.insertAdjacentHTML('beforeend', row);
        });
    } catch (err) {
        console.error("Network error loading table:", err);

        tbody.innerHTML = `
            <tr>
                <td colspan="12" class="py-10 text-center text-red-500">
                    Something went wrong loading the data.
                </td>
            </tr>`;
    }
}

document.addEventListener('DOMContentLoaded', loadTable);

newLeadForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const btn = document.getElementById("createLeadBtn");
    const spinner = document.getElementById("btnSpinner");
    const btnText = document.getElementById("btnText");

    spinner.classList.remove("hidden");
    btn.disabled = true;
    btnText.innerText = "Saving...";

    const getValue = (id) => {
        const val = document.getElementById(id).value;
        return val === "" ? null : val;
    };

    const payload = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone_number: document.getElementById("phoneNumber").value,

        value: getValue("value"),
        last_contact: getValue("last_contact"),
        next_contact: getValue("follow_up_date"),

        source: document.getElementById("new_source").value,
        lead_status: document.getElementById("new_lead_status").value,
    }

    if (companyDetailBtn.checked) {
        payload.company_name = document.getElementById('companyName').value;
        payload.vat_id = document.getElementById('vatID').value;
    }

    try {
        const res = await fetch("/api/v1/customers/list/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Validation error", data);
            return;
        }

        console.log(data);
        toggleModal();
        loadTable();
    } catch (err) {
        console.error('Network error:', err);
        alert("Something went wrong. Please check the connection");
    } finally {
        spinner.classList.add("hidden");
        btn.disabled = false;
        btnText.innerText = "Create Lead";
    }
})