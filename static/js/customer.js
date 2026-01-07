const list = document.getElementsByClassName("list");

const deleteTrigger = document.getElementById("deleteTrigger");
const confirmModule = document.getElementById("confirmModule");
const deleteCancel = document.getElementById("deleteCancel");
const deleteBtn = document.getElementById("deleteBtn");
const confirmOverlay = document.getElementById("confirmOverlay");

const projectsContainer = document.getElementById('projectsContainer')
const addProjectBtn = document.getElementById('addProjectBtn');

let confirmFlag = false;
deleteTrigger.addEventListener("click", function (event) {
    if (!confirmFlag) {
        confirmModule.classList.remove("hidden");
        confirmOverlay.classList.remove("hidden");
        confirmFlag = true;
    }
})

function closeConfirm() {
    if (confirmFlag) {
        confirmModule.classList.add("hidden");
        confirmOverlay.classList.add("hidden");
        confirmFlag = false;
    }
}

deleteCancel.addEventListener("click", closeConfirm)
confirmOverlay.addEventListener("click", closeConfirm)

addProjectBtn.addEventListener('click', addProject);

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

// PROJECT ASSIGNED USERS FUNCTIONALITY START ********
const currentUserId = JSON.parse(document.getElementById('current-user-id').textContent);

class UserSelector {
    constructor({ triggerBtnId, relativePlacement, targetWrapperId, initialUserIds = [], modalTitle = "Select Users" }) {
        this.triggerBtn = document.getElementById(triggerBtnId);
        this.relativeDiv = document.getElementById(relativePlacement);
        this.targetWrapper = document.getElementById(targetWrapperId);
        this.selectedUsers = new Set(initialUserIds);
        this.allUsers = [];
        this.modalTitle = modalTitle;
        this.isOpen = false;

        // START - This was AI assisted
        this.instanceId = Math.random().toString(36).substr(2, 9);
        this.modalId = `modal-${this.instanceId}`;
        this.overlayId = `overlay-${this.instanceId}`;
        this.listContainerId = `list-${this.instanceId}`;
        // END - This was AI assisted

        this.init();
    }

    async init() {
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
                    <div class="text-gray-400 text-sm p-2">Loading...</div>
                </div>
            </div>
            <div id="${this.overlayId}" class="fixed top-0 left-0 w-full h-full z-40 hidden"></div>
        `;
        this.relativeDiv.insertAdjacentHTML('beforeend', modalHTML);
    }

    attachEventListeners() {
        // Toggle Open/Close on Trigger Button
        if(this.triggerBtn) {
            this.triggerBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent form submission if inside a form
                this.toggleModal();
            });
        }

        // Close on Overlay Click
        this.overlay.addEventListener('click', () => this.closeModal());

        // Event Delegation: Handle User Clicks inside the list
        this.listContainer.addEventListener('click', (e) => {
            // Find the closest parent div that has a data-user-id attribute
            const userRow = e.target.closest('[data-user-id]');
            if (userRow) {
                const userId = parseInt(userRow.dataset.userId);
                this.toggleUserSelection(userId);
            }
        });
    }

    // --- LOGIC ---

    async fetchUsers() {
        if (this.allUsers.length > 0) return; // Don't fetch if we already have them

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

        // Ensure we have data, then render the list
        await this.fetchUsers();
        this.renderList();
    }

    closeModal() {
        this.isOpen = false;
        this.modalDiv.classList.add('hidden');
        this.overlay.classList.add('hidden');

        // Update the summary view (the avatars on the main page)
        this.renderSummary();
    }

    toggleUserSelection(id) {
        if (this.selectedUsers.has(id)) {
            this.selectedUsers.delete(id);
        } else {
            this.selectedUsers.add(id);
        }
        // Re-render the list immediately to show blue highlight
        this.renderList();
    }

    // --- RENDERING ---

    renderList() {
        this.listContainer.innerHTML = this.allUsers.map(user => {
            const isSelected = this.selectedUsers.has(user.id);
            const bgClass = isSelected ? 'bg-brand-50 border-brand-400' : 'bg-white border-transparent hover:bg-gray-50';

            // Note: We use data-user-id instead of onclick="func()"
            return `
                <div 
                    data-user-id="${user.id}" 
                    class="flex items-center gap-3 p-2 border  cursor-pointer transition-all select-none ${bgClass}"
                >
                    <div class="w-9 h-9 flex-shrink-0 overflow-hidden rounded-full">
                        <img src="${user.avatar || '/static/default-avatar.png'}">
                    </div>
                    <div class="text-sm font-medium text-text">${user.username}</div>
                </div>
            `;
        }).join('');
    }

    renderSummary() {
        // Filter the cached users to find the selected ones
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

    // Helper to get data out when you submit the form
    getSelectedIds() {
        return Array.from(this.selectedUsers);
    }
}

// PROJECT ASSIGNED USERS FUNCTIONALITY END ********

// START PROJECT STAGE
async function getStages() {
    try {
        const response = await fetch('/api/v1/projects/stages/');
        if (!response.ok) {
        throw new Error('Server error: ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (e) {
        console.log("Error: " + e);
    }
}
async function initProjectStages() {
    const wrapper = document.getElementById('new-project-stages-wrapper');

    if (!wrapper) {
        console.error("Could not find new-project-stages-wrapper");
        return;
    }

    wrapper.innerHTML = `<select class="border rounded p-1" disabled><option>Loading...</option></select>`;

    const stages = await getStages();

    const optionsHTML = stages.map(stage => {
        return `<option value="${stage.id}">${stage.name}</option>`;
    }).join('');

    wrapper.innerHTML = `
        <select id="projectStages" name="stage_id" class="border rounded p-1">
            ${optionsHTML}
        </select>
    `;
}
// END PROJECT STAGE

// START PROJECT SAVE

async function saveNewProject(btn, users) {

    btn.disabled = true;
    btn.innerText = "Saving...";
    try {
        const name = document.getElementById('projectNameField').value;
        const description = document.getElementById('projectDescriptionField').value;
        const price = document.getElementById('projectPrice').value;
        const priority = document.getElementById('priority').value;
        const stage = document.getElementById('projectStages').value;
        const currentCustomerId = JSON.parse(document.getElementById('current-customer-id').textContent);

        const customers = [currentCustomerId];

        const payload = {
            name: name,
            description: description,
            price: price ? parseFloat(price) : 0,
            priority: priority,
            stage: stage,
            contributed: users,
            customers: customers
        };

        const response = await fetch('/api/v1/projects/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(payload),
        })

        if (response.ok) {
            //On going
        } else {
            const errorData = await response.json();
            console.error("Save failed:", errorData);
            alert("Error saving project: " + JSON.stringify(errorData));

            btn.disabled = false;
            btn.innerText = "Save";
        }

    } catch (error) {
        console.error("Network Error:", error);
        alert("Something went wrong. Check console.");
        btn.disabled = false;
        btn.innerText = "Save";
    }
}

// END PROJECT SAVE

const projectBlock = `
    <div class="bg-bg border border-[#f7f7f7] shadow-sm rounded-sm p-4 mb-4">
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
                <div id="selectedUsersWrapper" class="flex gap-3 items-center">
                   <!-- Loaded Selected Users. Function loadSelectedUsers() -->
                </div>
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
function addProject() {
    if (!activeNewProjectCard) {
        projectsContainer.insertAdjacentHTML('beforeend', projectBlock)

        const saveBtn = document.getElementById('saveNewProject');

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