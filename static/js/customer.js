const assignBtn = document.getElementById("assignBtn");
const employeeOverlay = document.getElementById("employeeOverlay");
const list = document.getElementsByClassName("list");
const employeeOverlayBg = document.getElementById("employeeOverlayBg");

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

let displayFlag = false;
assignBtn.addEventListener("click", function () {
    if (displayFlag) {
        employeeOverlay.classList.add("hidden");
        employeeOverlayBg.classList.add("hidden");
        displayFlag = false;
    } else {
        employeeOverlay.classList.remove("hidden");
        employeeOverlayBg.classList.remove("hidden");
        displayFlag = true;
    }
})

employeeOverlayBg.addEventListener("click", function () {
    if (displayFlag) {
        employeeOverlay.classList.add("hidden");
        employeeOverlayBg.classList.add("hidden");
        displayFlag = false;
    } else {
        employeeOverlay.classList.remove("hidden");
        employeeOverlayBg.classList.remove("hidden");
        displayFlag = true;
    }
})

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

async function getUsers() {
    try {
        const response = await fetch('/api/v1/users/list/');
        if(response.ok) {
            const users = await response.json();
            return users;
        } else {
            console.error('Server returned an error:', response.status);
            return [];
        }

    } catch (err) {
        console.log('Error loading users:', err);
        return [];
    }
}

async function renderUserList() {
    const users = await getUsers();

    const userOptions = users.map(({id, username, avatar}) => {

        const isSelected = selectedUsers.has(id);

        const bgClass = isSelected
            ? 'bg-gray-100'
            : 'bg-white hover:bg-gray-100';

        return `
        <div onclick="toggleUser(${id})" class="flex items-center gap-4 p-2 mb-2 border rounded-md cursor-pointer transition-colors ${bgClass}">
            <div class="w-8 h-8 flex-shrink-0 overflow-hidden rounded-full">
                <img src="${avatar || '/static/default-avatar.png'}">
            </div>
            <div>
                ${username}
            </div>
        </div>
        `;
    }).join('');
}

let selectedUsers = new Set([currentUserId]);

function toggleUser(id) {
    if (selectedUsers.has(id)) {
        selectedUsers.delete(id)
    } else {
        selectedUsers.add(id)
    }
}

const userSelectModal = `
    <div id="userSelectModalDiv" class="absolute z-20 top-0 right-0 flex flex-col bg-white shadow-lg border rounded-lg p-4 w-64 hidden">
        <h3 class="font-bold mb-2 text-gray-700">Select Users:</h3>
        
        <div id="users-list-container" class="flex flex-col max-h-60 overflow-y-auto">
        </div>
    </div>

    <div id="userSelectOverlay" class="fixed inset-0 bg-black bg-opacity-20 z-10 hidden" onclick="closeModal()"></div>
`;

document.body.insertAdjacentHTML('beforeend', userSelectModal);

const userSelectModalDiv = document.getElementById('userSelectModalDiv');
const userSelectOverlay = document.getElementById('userSelectOverlay');

const assignProjectUsersBtn = document.getElementById('assignProjectUsers');

const selectedUsersWrapper = document.getElementById('selectedUsersWrapper');

let isSelectUsersOpen = false;
assignProjectUsersBtn.addEventListener(() => {
    if (isSelectUsersOpen) {
        closeProjectUsers()
    } else {
        openProjectUsers()
    }
})

userSelectOverlay.addEventListener(() => {
    if (isSelectUsersOpen) {
        closeProjectUsers()
    } else {
        openProjectUsers()
    }
})

function openProjectUsers() {
    isSelectUsersOpen = false;
    userSelectModalDiv.classList.remove('hidden');
    userSelectOverlay.classList.remove('hidden');
}

function closeProjectUsers() {
    isSelectUsersOpen = true;
    userSelectModalDiv.classList.add('hidden');
    userSelectOverlay.classList.add('hidden');
    selectedUsersWrapper.innerHTML = loadSelectedUsers();
}

async function loadSelectedUsers() {
    const users = await getUsers();

    const selectedUsersHTML = users
        .filter(user => selectedUsers.has(user.id))
        .map(user => {
            return `
            <div class="flex items-center gap-4">
                <div class="overflow-hidden rounded-full w-8 h-8">
                    <img src="${user.avatar}" alt="Avatar" class="w-full h-full object-cover">
                </div> 
                ${user.username}
            </div>
            `;
        })
        .join('');

    return selectedUsersHTML;
}

// PROJECT ASSIGNED USERS FUNCTIONALITY END ********

const projectBlock = `
    <div class="bg-bg border border-[#f7f7f7] shadow-sm rounded-sm p-4 mb-4">
        <form>
        <div class="flex items-center justify-between">
            <h2 class="text-3xl font-semibold mb-4 text-text"><input type="text" name="projectNameField" placeholder="Project Title"></h2>
            <div>
                <label for="priority" class="mr-2">Priority:</label>
                <select id="priority" name="priority" class="border rounded p-2">
                    ${priorityOptions} 
                </select>
            </div>
        </div>
        <div class="flex gap-3">
            <div class="flex gap-3 flex-col">
                <div class="relative p-2 border border-gray-400 rounded-sm"><textarea id="description" name="description"></textarea> <label for="description" class="text-sm text-text bg-bg absolute top-[-22px] translate-y-1/2 left-[2px]">Description:</label></div>
                <div class="flex justify-between items-center">
                <p class="text-text text-lg mb-1">Assigned Project Users:</p>
                <div class="relative">
                <button id="assignProjectUsers" class="bg-brand-400 border-full py-1 px-2 text-sm">+</button>
                ${userSelectModal}
                </div>
                </div>
                <div id="selectedUsersWrapper" class="flex gap-3 items-center">
                   <!-- Loaded Selected Users. Function loadSelectedUsers() -->
                   ${loadSelectedUsers()}
                </div>
                </div>
            </div>
            <div>
                <p>Price: <strong>{{ project.price }}€</strong></p>
            </div>
        </div>
        <div class="flex justify-between items-center mt-6">
            <div>
                <p>Project Stage: {{ project.stage.name }}</p>
            </div>
            <div>
                <p class="text-gray-400">Updated At: {{ project.updated_at|date:"M d, Y" }}</p>
            </div>
        </div>
        </form>
    </div>
`

function addProject() {
    projectsContainer.insertAdjacentHTML('beforeend', projectBlock)
}