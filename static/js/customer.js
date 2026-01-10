const list = document.getElementsByClassName("list");

// --- DELETE MODULE ---
const deleteTrigger = document.getElementById("deleteTrigger");
const confirmModule = document.getElementById("confirmModule");
const deleteCancel = document.getElementById("deleteCancel");
const deleteBtn = document.getElementById("deleteBtn");
const confirmOverlay = document.getElementById("confirmOverlay");

let confirmFlag = false;
if (deleteTrigger) {
    deleteTrigger.addEventListener("click", function (event) {
        if (!confirmFlag) {
            confirmModule.classList.remove("hidden");
            confirmOverlay.classList.remove("hidden");
            confirmFlag = true;
        }
    })
}

function closeConfirm() {
    if (confirmFlag) {
        confirmModule.classList.add("hidden");
        confirmOverlay.classList.add("hidden");
        confirmFlag = false;
    }
}

if (deleteCancel) deleteCancel.addEventListener("click", closeConfirm);
if (confirmOverlay) confirmOverlay.addEventListener("click", closeConfirm);

// --- GLOBAL VARIABLES ---
const currentCustomerId = JSON.parse(document.getElementById('current-customer-id').textContent);
const currentUserId = document.getElementById('current-user-id') ? JSON.parse(document.getElementById('current-user-id').textContent) : null;

// --- PROJECT LIST & TOTALS ---
const projectsContainer = document.getElementById('projectsContainer')
const addProjectBtn = document.getElementById('addProjectBtn');

async function updateTotals() {
    const projectsCostsContainer = document.getElementById('projectsCosts');
    const projectsCostsTotalsContainer = document.getElementById('projectsCostsTotals');

    if (!projectsCostsContainer) return;

    const previousCosts = projectsCostsContainer.innerHTML;
    const previousTotals = projectsCostsTotalsContainer.innerHTML;

    projectsCostsContainer.innerHTML = `<p class="text-gray-500 animate-pulse">Loading...</p>`
    projectsCostsTotalsContainer.innerHTML = `<p class="text-text">Total: <span class="animate-pulse text-gray-500">Calculating...</span></p>`

    try {
        const response = await fetch('/api/v1/projects/');
        if (!response.ok) {
            projectsCostsContainer.innerHTML = previousCosts;
            projectsCostsTotalsContainer.innerHTML = previousTotals;
            throw new Error('Server error: ' + response.status);
        }
        const data = await response.json();

        projectsCostsContainer.innerHTML = '';
        projectsCostsTotalsContainer.innerHTML = '';

        let costTotals = 0.00
        data.forEach((project) => {
            if (project.customers.includes(currentCustomerId)) {
                costTotals += parseFloat(project.price);
                let projectCost = `<p>${project.name} - ${project.price}€</p>`
                projectsCostsContainer.insertAdjacentHTML('beforeend', projectCost);
            }
        })

        projectsCostsTotalsContainer.innerHTML = `<p class="text-text">Total: <strong>${costTotals}€</strong></p>`
    } catch (e) {
        console.log('Error: ' + e)
        projectsCostsContainer.innerHTML = previousCosts;
        projectsCostsTotalsContainer.innerHTML = previousTotals;
    }
}

if (addProjectBtn) {
    addProjectBtn.addEventListener('click', addProject);
}

const priorities = [
    ['low', 'Low'],
    ['medium', 'Medium'],
    ['high', 'High']
];

const defaultPriority = 'low';

const priorityOptions = priorities.map(([value, label]) => {
    const isSelected = value === defaultPriority ? 'selected' : '';
    return `<option value="${value}" ${isSelected}>${label}</option>`;
}).join('');

// --- USER SELECTOR CLASS ---
class UserSelector {
    constructor({ triggerBtnId, relativePlacement, targetWrapperId, initialUserIds = [], modalTitle = "Select Users" }) {
        this.triggerBtn = document.getElementById(triggerBtnId);
        this.relativeDiv = document.getElementById(relativePlacement);
        this.targetWrapper = document.getElementById(targetWrapperId);
        this.selectedUsers = new Set(initialUserIds);
        this.allUsers = [];
        this.modalTitle = modalTitle;
        this.isOpen = false;

        this.instanceId = Math.random().toString(36).substr(2, 9);
        this.modalId = `modal-${this.instanceId}`;
        this.overlayId = `overlay-${this.instanceId}`;
        this.listContainerId = `list-${this.instanceId}`;

        this.init();
    }

    async init() {
        if (!this.relativeDiv) return;
        this.createModalDOM();

        this.modalDiv = document.getElementById(this.modalId);
        this.overlay = document.getElementById(this.overlayId);
        this.listContainer = document.getElementById(this.listContainerId);

        this.attachEventListeners();

        await this.fetchUsers();
        this.renderSummary();
    }

    createModalDOM() {
        const modalHTML = `
            <div id="${this.modalId}" class="absolute z-50 top-0 right-0 flex flex-col bg-bg shadow rounded p-4 hidden w-max space-y-2">
                <h3 class="font-bold text-xl mb-2 text-text">${this.modalTitle}</h3>
                <hr>
                <div id="${this.listContainerId}" class="flex flex-col max-h-60 overflow-y-auto gap-1">
                    <div class="text-gray-400 text-sm p-2 animate-pulse">Loading...</div>
                </div>
            </div>
            <div id="${this.overlayId}" class="fixed top-0 left-0 w-full h-full z-40 hidden"></div>
        `;
        this.relativeDiv.insertAdjacentHTML('beforeend', modalHTML);
    }

    attachEventListeners() {
        if(this.triggerBtn) {
            this.triggerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleModal();
            });
        }
        this.overlay.addEventListener('click', () => this.closeModal());
        this.listContainer.addEventListener('click', (e) => {
            const userRow = e.target.closest('[data-user-id]');
            if (userRow) {
                const userId = parseInt(userRow.dataset.userId);
                this.toggleUserSelection(userId);
            }
        });
    }

    async fetchUsers() {
        if (this.allUsers.length > 0) return;
        try {
            const response = await fetch('/api/v1/users/list/');
            if (response.ok) {
                this.allUsers = await response.json();
            } else {
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    toggleModal() {
        if (this.isOpen) {
            this.closeModal();
        } else {
            this.openModal();
        }
    }

    async openModal() {
        this.isOpen = true;
        this.modalDiv.classList.remove('hidden');
        this.overlay.classList.remove('hidden');
        await this.fetchUsers();
        this.renderList();
    }

    closeModal() {
        this.isOpen = false;
        this.modalDiv.classList.add('hidden');
        this.overlay.classList.add('hidden');
        this.renderSummary();
    }

    toggleUserSelection(id) {
        if (this.selectedUsers.has(id)) {
            this.selectedUsers.delete(id);
        } else {
            this.selectedUsers.add(id);
        }
        this.renderList();
    }

    renderList() {
        this.listContainer.innerHTML = this.allUsers.map(user => {
            const isSelected = this.selectedUsers.has(user.id);
            const bgClass = isSelected ? 'bg-brand-50 border-brand-400' : 'bg-white border-transparent hover:bg-gray-50';
            return `
                <div data-user-id="${user.id}" class="flex items-center gap-3 p-2 border cursor-pointer transition-all select-none ${bgClass}">
                    <div class="w-9 h-9 flex-shrink-0 overflow-hidden rounded-full">
                        <img src="${user.avatar}">
                    </div>
                    <div class="text-sm font-medium text-text">${user.username}</div>
                </div>
            `;
        }).join('');
    }

    renderSummary() {
        const selectedObjects = this.allUsers.filter(u => this.selectedUsers.has(u.id));
        if (this.targetWrapper) {
            if (selectedObjects.length === 0) {
                this.targetWrapper.innerHTML = '<span class="text-gray-400 text-sm">No users assigned</span>';
                return;
            }
            this.targetWrapper.innerHTML = selectedObjects.map(user => `
                <div class="flex items-center gap-2 mb-1" title="${user.username}">
                    <div class="w-9 h-9 overflow-hidden rounded-full border border-gray-300">
                        <img src="${user.avatar || '/static/default-avatar.png'}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <p>${user.username}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    getSelectedIds() {
        return Array.from(this.selectedUsers);
    }
}

// --- PROJECT STAGE FETCHING ---
async function getStages() {
    try {
        const response = await fetch('/api/v1/projects/stages/');
        if (!response.ok) throw new Error('Server error: ' + response.status);
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("Error: " + e);
        return [];
    }
}

async function initProjectStages() {
    const wrapper = document.getElementById('new-project-stages-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = `<select class="border rounded p-1" disabled><option>Loading...</option></select>`;
    const stages = await getStages();

    const optionsHTML = stages.map(stage => {
        return `<option value="${stage.id}">${stage.name}</option>`;
    }).join('');

    wrapper.innerHTML = `<select id="projectStages" name="stage_id" class="border rounded p-1">${optionsHTML}</select>`;
}

async function fetchUsers() {
    try {
        const response = await fetch('/api/v1/users/list/');
        if (!response.ok) throw new Error('Server error: ' + response.status);
        return await response.json();
    } catch (e) {
        console.log("Error: " + e);
        return [];
    }
}

// --- LOAD PROJECTS ---
const projectsLength = document.getElementById('projects-length') ? JSON.parse(document.getElementById('projects-length').textContent) : 0;
let projectCount = parseInt(projectsLength);

async function loadProjects() {
    if(!projectsContainer) return;
    const oldLoad = projectsContainer.innerHTML;

    const loadingCard = `
        <div class="bg-bg shadow p-4 rounded-sm border border-[#f7f7f7] animate-pulse space-y-4 mb-4">
            <div class="flex justify-between items-center gap-3">
                <div class="rounded-md bg-gray-300 w-full h-5  animate-pulse"></div>
                <div class="rounded-md bg-gray-300 w-[32px] h-5 animate-pulse"></div>
            </div>
            <div class="flex gap-3 items-start h-12">
                <div class="rounded-md bg-gray-300 w-full h-full animate-pulse"></div>
                <div class="rounded-md bg-gray-300 h-8 w-[120px] animate-pulse"></div>
            </div>
            <div class="w-[220px] h-8 rounded-md bg-gray-300 animate-pulse"></div>
        </div>
    `
    projectsContainer.innerHTML = '';
    const totalLoops = projectCount + 1;
    for (let i = 0; i < totalLoops; i++) {
        projectsContainer.insertAdjacentHTML('beforeend', loadingCard);
    }

    await new Promise(r => setTimeout(r, 1000));

    try {
        const response = await fetch('/api/v1/projects/');
        if (!response.ok) {
            projectsContainer.innerHTML = oldLoad;
            throw new Error('Server error: ' + response.status);
        }
        projectsContainer.innerHTML = '';
        const data = await response.json();

        const priorityIcons = {
            'low': 'Default.svg',
            'medium': 'Medium.svg',
            'high': 'High.svg'
        };

        const contributors = await fetchUsers();
        const stages = await getStages();

        data.forEach ((project) =>  {
            if (project.customers.includes(currentCustomerId)) {
                const iconFile = priorityIcons[project.priority]

                const desc = project.description || "";
                const shortDesc = desc.length > 80 ? desc.slice(0, 80) + "..." : desc;
                const descriptionHtml = desc
                    ? `<div class="relative p-2 border border-gray-400 rounded-sm w-full">
                           ${shortDesc} 
                           <p class="text-sm text-text bg-bg absolute top-[-22px] translate-y-1/2 left-[2px]">Description:</p>
                       </div>`
                    : `<div></div>`;

                const contributorsContainer = document.createElement('div')
                contributors.forEach((contributor) => {
                    if (project.contributed.includes(contributor.id)) {
                        const div = `
                            <div class="flex items-center gap-2 mb-1" title="${contributor.username}">
                                <div class="w-9 h-9 overflow-hidden rounded-full border border-gray-300">
                                    <img src="${contributor.avatar}" class="w-full h-full object-cover">
                                </div>
                                <div>
                                    <p>${contributor.username}</p>
                                </div>
                            </div>
                        `
                        contributorsContainer.insertAdjacentHTML('beforeend', div);
                    }
                })
                contributorsContainer.classList.add('flex', 'items-center', 'gap-4')

                let stageName = "Unknown";
                stages.forEach((stage) => {
                    if (stage.id === project.stage) {
                        stageName = stage.name
                    }
                })

                let card = `
                <div class="bg-bg border border-[#f7f7f7] shadow-sm rounded-sm p-4 mb-4">
                        <a href="/project/${project.id}">
                        <div class="flex items-center justify-between">
                            <h2 class="text-3xl font-semibold mb-4 text-text">${project.name}</h2>
                            <div>
                                <img title="${project.priority}" src="/static/img/${iconFile}" alt="${project.priority} priority flag">
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <div class="flex gap-3 flex-col w-full">
                                ${descriptionHtml}
                                <div>
                                <p class="text-text text-lg mb-1">Users Contributed:</p>
                                <div class="flex gap-3 items-center">
                                ${contributorsContainer.outerHTML}
                                </div>
                                </div>
                            </div>
                            <div>
                                <p>Price: <strong>${project.price}€</strong></p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center mt-6">
                            <div>
                                <p>Project Stage: ${stageName}</p>
                            </div>
                            <div>
                                <p class="text-gray-400">Updated At: 
                                ${ new Date(project.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
                                </p>
                            </div>
                        </div>
                        </a>
                    </div>
                `
                projectsContainer.insertAdjacentHTML('beforeend', card);
            }
        });
    } catch (e) {
        console.error("LoadProjects Error:", e);
        projectsContainer.innerHTML = oldLoad;
        throw e;
    }
}

// --- SAVE PROJECT ---
const saveNewProjectValidator = new FormValidator();
async function saveNewProject(btn, users) {

    btn.disabled = true;
    btn.innerText = "Saving...";
    btn.classList.add('animate-pulse');
    try {
        saveNewProjectValidator.reset();

        const name = document.getElementById('projectNameField')
        const description = document.getElementById('projectDescriptionField')
        const price = document.getElementById('projectPrice')
        const priority = document.getElementById('priority')
        const stage = document.getElementById('projectStages')

        const customers = [currentCustomerId];

        saveNewProjectValidator.checkText(name, 'Invalid Project Title');

        if (saveNewProjectValidator.passes()) {
            const payload = {
                name: name.value,
                description: description.value,
                price: price.value ? parseFloat(price.value) : 0,
                priority: priority.value,
                stage: stage.value,
                contributed: users,
                customers: customers
            };

            const response = await fetch('/api/v1/projects/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken // Using the global variable
                },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                await loadProjects();
                projectCount += 1;
                await updateTotals();
                toggleAddProject();
            } else {
                const errorData = await response.json();
                console.error("Save failed:", errorData);
                btn.disabled = false;
                btn.innerText = "Save";
                btn.classList.remove('animate-pulse');
                alert("Failed to save project. Check console for details.");
            }
        } else {
            btn.disabled = false;
            btn.innerText = "Save";
            btn.classList.remove('animate-pulse');
        }

    } catch (error) {
        console.error("Network Error:", error);
        alert("Something went wrong. Check console.");
        btn.disabled = false;
        btn.innerText = "Save";
        btn.classList.remove('animate-pulse');
    }
}

const projectBlock = `
    <div id="newPorjectFormCard" class="bg-bg border border-[#f7f7f7] shadow-sm rounded-sm p-4 mb-4">
        <form>
        <div class="flex items-center justify-between">
            <h2 class="text-3xl font-semibold mb-4 text-text"><input type="text" id="projectNameField" name="projectNameField" placeholder="Project Title"></h2>
            <div>
                <label for="priority" class="mr-2">Priority:</label>
                <select id="priority" name="priority" class="border rounded p-1">
                    ${priorityOptions} 
                </select>
            </div>
        </div>
        <div class="flex gap-3 w-full items-start mt-3">
            <div class="w-full flex gap-3 flex-col">
                <div class="w-full relative p-2 border border-gray-400 rounded-sm"><textarea class="w-full focus:outline-none" id="projectDescriptionField" name="description"></textarea> <label for="description" class="text-sm text-text bg-bg absolute top-[-22px] translate-y-1/2 left-[2px]">Description:</label></div>
                <div class="w-full flex gap-4 items-center">
                    <p class="text-text text-lg mb-1">Assigned Project Users:</p>
                    <div id="addProjectUserRelativeBox" class="relative">
                        <button type="button" id="assignProjectUsersBtn" class="bg-brand-400 hover:cursor-pointer rounded-full py-1 px-2 text-sm">+</button>
                    </div>
                </div>
                <div id="selectedUsersWrapper" class="flex gap-3 items-center"></div>
            </div>
            <div class="flex flex-col gap-1">
                <label for="projectPrice">Price:</label>
                <div class="flex items-center gap-0">
                <input class="focus:outline-none" placeholder="0.00" type="number" id="projectPrice" name="projectPrice"><p>€</p>
                </div>
            </div>
        </div>
        <div class="flex justify-between items-center mt-6">
            <div class="flex items-center gap-1">
                <label for="projectStages">Project Stage:</label>
                <div id="new-project-stages-wrapper"></div>
            </div>
            <div class="flex justify-end items-center gap-3">
                <button type="button" id="cancelNewProject" class="px-2 py-1 bg-error text-bg hover:cursor-pointer">Cancel</button>
                <button type="button" id="saveNewProject" class="px-2 py-1 bg-brand-400 hover:cursor-pointer">Save</button>
            </div>
        </div>
        </form>
    </div>
`

let activeNewProjectCard = false

function toggleAddProject() {
    activeNewProjectCard = !activeNewProjectCard;
    if (!activeNewProjectCard) {
        addProjectBtn.classList.remove('hidden');
    }
}

function cancelNewProject() {
    const formCard = document.getElementById('newPorjectFormCard');
    if (formCard) formCard.remove();
    toggleAddProject();
}

function addProject() {
    if (!activeNewProjectCard) {
        projectsContainer.insertAdjacentHTML('beforeend', projectBlock)

        const saveBtn = document.getElementById('saveNewProject');
        const cancelNewProjectBtn = document.getElementById('cancelNewProject');
        cancelNewProjectBtn.addEventListener('click', cancelNewProject);

        const newProjectAssigner = new UserSelector({
            triggerBtnId: 'assignProjectUsersBtn',
            relativePlacement: 'addProjectUserRelativeBox',
            targetWrapperId: 'selectedUsersWrapper',
            initialUserIds: [currentUserId],
            modalTitle: 'Assign Project Members'
        });
        initProjectStages();

        saveBtn.addEventListener('click', () => {
            saveNewProject(saveBtn, newProjectAssigner.getSelectedIds());
        });
        addProjectBtn.classList.add('hidden');
        activeNewProjectCard = !activeNewProjectCard;
    }
}

const assignUser = new UserSelector({
    triggerBtnId: 'assignBtn',
    relativePlacement: 'assignEmployeeRelative',
    targetWrapperId: 'assignedEmployeeContainer',
    initialUserIds: [currentUserId],
    modalTitle: 'Assign Employees'
});

// --- CUSTOMER UPDATE ---
const form = document.getElementById('customerEditForm');
const validator = new FormValidator();

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        validator.reset();

        const firstNameInput = form.elements['first_name'];
        const lastNameInput  = form.elements['last_name'];
        const emailInput  = form.elements['email'];
        const phoneInput  = form.elements['phone_number'];
        const sourceSelect = form.elements['source'];
        const leadStatusSelect = form.elements['lead_status'];

        // Validation Checks
        validator.checkText(firstNameInput, 'First Name is required');
        validator.checkText(lastNameInput, 'Last Name is required');
        validator.checkEmail(emailInput, 'Invalid Email');
        validator.checkPhone(phoneInput, 'Invalid Phone Number');
        validator.checkText(sourceSelect, 'Please select a Source');
        validator.checkText(leadStatusSelect, 'Please select a Status');

        // Check if Project Card is open
        if (typeof activeNewProjectCard !== 'undefined' && activeNewProjectCard) {
            const formCard = document.getElementById('newPorjectFormCard');
            if(formCard) {
                formCard.classList.remove('border-[#f7f7f7]');
                formCard.classList.add('border-red-500', 'border-2');
                alert("Please save or cancel the new project before updating the customer.");
            }
        } else {
            if (validator.passes()) {
                console.log("Validation passed. Preparing data...");

                const formData = new FormData(form);

                // --- DATA CLEANUP TO PREVENT 400 ERRORS ---
                if (formData.get('company') === "") formData.delete('company');
                if (formData.get('source') === "") formData.delete('source');
                if (formData.get('lead_status') === "") formData.delete('lead_status');

                const fileInput = document.getElementById('related_files');
                if (fileInput && fileInput.files.length === 0) {
                    formData.delete('files');
                }

                await updateCustomer(formData);
            } else {
                console.log("Validation failed.");
            }
        }
    });
}

async function updateCustomer(formData) {
    try {
        const response = await fetch(`/api/v1/customers/${currentCustomerId}/`, {
            method: "PATCH",
            headers: {
                "X-CSRFToken": csrftoken, // Using the global variable
            },
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Success:", data);
            window.location.reload();
        } else {
            const errorData = await response.json();
            console.error("Server Validation Error:", errorData);
            alert("Update Failed:\n" + JSON.stringify(errorData, null, 2));
        }

    } catch (e) {
        console.error("Network or Script Error:", e);
        alert("Network error.");
    }
}

// --- COMPANY CREATION ---
const addCompanyBtn = document.getElementById('addCompany');
const createCompanyRelative = document.getElementById('createCompanyRelative');

const addCompanyFormDIV = `
    <div id="tempFormWrapper" class="absolute top-0 left-0 p-3 bg-bg shadow-sm rounded-md z-20">
        <div id="addCompanyForm">
            <div class="flex gap-4">
                <div class="flex flex-col">
                    <label class="text-sm text-text">Company Name:</label>
                    <input type="text" placeholder="Company Name" name="company_name"
                           class="border border-gray-300 rounded px-2 py-1">
                </div>
                <div class="flex flex-col">
                    <label class="text-sm text-text">Vat ID:</label>
                    <input type="text" placeholder="Vat ID" name="vat_id"
                           class="border border-gray-300 rounded px-2 py-1">
                </div>
                <div class="flex justify-center items-center">
                    <button type="button" id="addCompanySubmit" class="leading-none px-2 py-1 text-sm text-text bg-brand-400 hover:cursor-pointer rounded">Create</button>
                </div>
            </div>
        </div>
    </div>
    <div id="closeAddCompany" class="fixed top-0 left-0 h-full w-full bg-black opacity-15 z-10"></div>
`;

if (addCompanyBtn) {
    addCompanyBtn.addEventListener('click', () => {
        if (document.getElementById('addCompanyForm')) return;
        createCompanyRelative.insertAdjacentHTML('beforeend', addCompanyFormDIV);

        const overlay = document.getElementById('closeAddCompany');
        const formWrapper = document.getElementById('tempFormWrapper');
        const submitBtn = document.getElementById('addCompanySubmit');
        const formContainer = document.getElementById('addCompanyForm');

        const nameInput = formContainer.querySelector('input[name="company_name"]');
        const vatInput = formContainer.querySelector('input[name="vat_id"]');

        const closeForm = () => {
            overlay.remove();
            formWrapper.remove();
        };

        overlay.addEventListener('click', closeForm);

        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            let isValid = true;
            nameInput.classList.remove('border-red-500');
            vatInput.classList.remove('border-red-500');

            if (!nameInput.value.trim()) {
                nameInput.classList.add('border-red-500');
                isValid = false;
            }
            if (!vatInput.value.trim()) {
                vatInput.classList.add('border-red-500');
                isValid = false;
            }

            if (!isValid) return;

            const companyData = {
                company_name: nameInput.value,
                vat_id: vatInput.value
            };

            submitBtn.innerText = "Creating...";
            submitBtn.disabled = true;

            await createCompany(companyData, closeForm);
        });
    });
}

async function createCompany(data, callback) {
    try {
        const response = await fetch('/api/v1/companies/list/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken, // Using the global variable
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            if (callback) callback();
            window.location.reload();
        } else {
            console.error("Server Error:", response.status);
            alert("Failed to create company.");
        }

    } catch (e) {
        console.error("Network Error:", e);
        alert("Network error occurred.");
    } finally {
        const submitBtn = document.getElementById('addCompanySubmit');
        if (submitBtn) {
            submitBtn.innerText = "Create";
            submitBtn.disabled = false;
        }
    }
}