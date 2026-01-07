const todoBtn = document.getElementById('todoBtn');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

todoBtn.addEventListener('click', () => {
    let text = todoInput.value.trim();

    if (!text) return;

    fetch("/api/todos/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ text:text }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center pr-2"
        li.innerHTML = `
            <span class="text-text text-lg">${data.text}</span>
            <button onclick="removeTodoItem(this)" class="border-1 rounded-full w-3.5 h-3.5 hover:bg-brand-50 active:bg-brand-400" data-id="${data.id}" ></button>
        `;
        todoList.appendChild(li);
        todoInput.value = "";

    })
    .catch(error => {
        console.error("Error creating todo:", error);
    });
});

function removeTodoItem(buttonElement) {
    const id = buttonElement.dataset.id;

    fetch(`/api/todos/${id}/delete/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrftoken,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to delete todo");
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Remove the <li> from the DOM
            const li = buttonElement.closest("li");
            if (li) {
                li.remove();
            }
        }
    })
    .catch(error => {
        console.error("Error deleting todo:", error);
    });
}