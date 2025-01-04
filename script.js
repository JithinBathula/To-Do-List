const newTaskInput = document.getElementById("new-task")
const addBtn = document.getElementById("add-btn")
const taskList = document.getElementById("task-list")
const searchInput = document.getElementById("search-input")
const filterButtons = document.querySelectorAll(".filter-btn") // selects all the 3 buttons in filter-btn class as a nodelist. similar to an array but with lesser methods
const clearCompletedBtn = document.getElementById("clear-completed")
let tasks = []

window.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem("tasks")
    if (data) tasks = JSON.parse(data)
    renderTasks()
})

addBtn.addEventListener("click", addTask)

// An event that adds tasks once someone clicks and releases the enter keytab
newTaskInput.addEventListener("keyup", e => {
    if (e.key === "Enter") addTask()
})

// Whenever someone changes the value in the search input element, this event gets triggered
searchInput.addEventListener("input", () => renderTasks())


// adding an event listener for each of the 3 filter buttons. When any of the buttons is clicked, it removes the active class from all the buttons and adds it to the one that it is clicked to
filterButtons.forEach(btn => {d
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"))
        btn.classList.add("active")
        renderTasks()
    })
})

clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => !t.completed) // filters out all the completed tasks, leaving only the non completed tasks
    saveTasks()
    renderTasks()
})

function addTask() {
    const val = newTaskInput.value.trim()
    if (!val) return
    tasks.push({ text: val, completed: false })
    newTaskInput.value = ""
    saveTasks()
    renderTasks()
}

function renderTasks() {
    taskList.innerHTML = ""
    const searchTerm = searchInput.value.toLowerCase()
    const filter = document.querySelector(".filter-btn.active").dataset.filter
    const filteredTasks = tasks.filter(t => {
        if (searchTerm && !t.text.toLowerCase().includes(searchTerm)) return false
        if (filter === "active" && t.completed) return false
        if (filter === "completed" && !t.completed) return false
        return true
    })

    filteredTasks.forEach((t, i) => {
        const li = document.createElement("li")
        li.className = "task-item"

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = t.completed
        checkbox.addEventListener("change", () => {
            t.completed = !t.completed
            saveTasks()
            renderTasks()
        })

        const span = document.createElement("span")
        span.className = "task-text"
        if (t.completed) span.classList.add("completed")
        span.textContent = t.text
        span.addEventListener("dblclick", () => {
            editTask(i)
        })

        const delBtn = document.createElement("button")
        delBtn.textContent = "Delete"
        delBtn.className = "delete-btn"

        delBtn.addEventListener("click", () => {
            tasks.splice(i, 1)
            saveTasks()
            renderTasks()
        })

        li.appendChild(checkbox)
        li.appendChild(span)
        li.appendChild(delBtn)
        taskList.appendChild(li)
    })
}

function editTask(index) {
    const li = taskList.children[index]
    if (!li) return

    const taskItem = tasks[index]
    const span = li.querySelector(".task-text")
    const input = document.createElement("input")

    input.type = "text"
    input.value = taskItem.text
    input.className = "edit-input"

    li.replaceChild(input, span)
    input.focus()
    input.addEventListener("blur", () => saveEdit())
    input.addEventListener("keyup", e => {
        if (e.key === "Enter") saveEdit()
    })

    function saveEdit() {
        const val = input.value.trim()
        if (!val) {
            tasks.splice(index, 1)
        } else {
            taskItem.text = val
        }
        saveTasks()
        renderTasks()
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}
