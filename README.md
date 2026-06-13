# ✅ To-Do List App
### InternSpark Internship — Project 2

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![LocalStorage](https://img.shields.io/badge/LocalStorage-FF6B35?style=for-the-badge&logo=databricks&logoColor=white)

---

## 📌 Project Overview

A fully featured, interactive To-Do List application built with pure Vanilla JavaScript. Tasks are stored in the browser's Local Storage so they persist after page refresh. Features a modern glassmorphism UI with smooth animations.

**Live Demo:** [https://ahtishamali17.github.io/todo-app](https://ahtishamali17.github.io/todo-app)
**GitHub Repo:** [https://github.com/ahtishamali17/todo-app](https://github.com/ahtishamali17/todo-app)

---

## ✨ Features

| Feature | Description |
|---|---|
| ➕ Add Task | Add tasks with text + priority level (Low/Medium/High) |
| ✏️ Edit Task | Edit any task via a smooth modal popup |
| 🗑️ Delete Task | Remove individual tasks permanently |
| ✅ Mark Complete | Click checkbox to toggle task done/undone |
| 🔴🟡🟢 Priority | Color-coded priority dots (High/Medium/Low) |
| 🔍 Filter | View All / Active / Completed tasks |
| 🧹 Clear Done | Delete all completed tasks at once |
| 💾 Local Storage | Tasks persist even after browser refresh/close |
| 📊 Live Counter | Real-time task count in header and filter tabs |
| 📅 Date Stamp | Creation date shown on every task |
| 🎞️ Animations | Smooth slide-in for new tasks, scale for modal |
| 📱 Responsive | Works perfectly on mobile and desktop |
| ⌨️ Keyboard | Press Enter to add, Escape to close modal, "/" to focus input |

---

## 🗂️ Folder Structure

```
todo-app/
│
├── index.html      ← App structure and markup
├── style.css       ← All styles (glassmorphism, animations, responsive)
├── app.js          ← Complete JavaScript logic (fully commented)
└── README.md       ← This file
```

---

## 🛠️ Technologies Used

- **HTML5** — Semantic structure, data attributes (`data-id`)
- **CSS3** — Glassmorphism (`backdrop-filter`), CSS animations, custom properties
- **Bootstrap Icons** — Icon library for all UI icons
- **Vanilla JavaScript** — All logic, zero external libraries
- **Web Storage API** — `localStorage.setItem()` / `getItem()` for persistence

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/todo-app.git

# 2. Open in VS Code
cd todo-app
code .

# 3. Right-click index.html → "Open with Live Server"
# OR simply double-click index.html in your file explorer
```

---

## 💾 How Local Storage Works

```javascript
// SAVE: Convert array to JSON string → store in browser
localStorage.setItem('todo-tasks', JSON.stringify(tasks));

// LOAD: Read string from browser → convert back to array
const saved = localStorage.getItem('todo-tasks');
tasks = saved ? JSON.parse(saved) : [];

// WHERE IS IT STORED?
// Browser DevTools → Application tab → Local Storage → your URL
// Data survives: page refresh, browser close, computer restart
// Data is cleared: if user clears browser data, or you call localStorage.clear()
```

---

## 🧠 JavaScript Architecture

```
app.js
│
├── STATE VARIABLES
│   ├── tasks[]         — array of all task objects
│   ├── currentFilter   — 'all' | 'active' | 'completed'
│   └── editingId       — id of task being edited
│
├── LOCAL STORAGE
│   ├── loadTasks()     — read from localStorage on page load
│   └── saveTasks()     — write to localStorage on every change
│
├── CRUD OPERATIONS
│   ├── addTask()       — create new task object, push to array
│   ├── toggleComplete()— flip task.completed boolean
│   ├── openEdit()      — fill modal, show it
│   ├── saveEdit()      — update task text/priority
│   └── deleteTask()    — filter task out of array
│
├── RENDERING
│   ├── getFilteredTasks() — returns filtered subset
│   ├── renderTasks()      — clears list, redraws all cards
│   ├── createTaskElement()— builds one <li> DOM element
│   └── updateCounts()     — updates all counter badges
│
└── EVENT LISTENERS
    ├── addBtn click / Enter key
    ├── filter buttons
    ├── clear completed
    ├── modal save/cancel/Escape
    └── "/" key shortcut
```

---

## 📋 Task Object Structure

```javascript
{
  id:        "task_1705312890123",  // unique ID using Date.now()
  text:      "Buy groceries",       // task description
  completed: false,                 // toggle with checkbox
  priority:  "high",                // 'low' | 'medium' | 'high'
  date:      "Jan 15, 2024"         // creation date string
}
```

---

## 🌐 Deployment — GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit: To-Do List App with Local Storage"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
git push -u origin main
# Settings → Pages → main branch → Save
```

---



## 📋 Internship Submission Checklist

- [x] Add Task functionality
- [x] Edit Task (modal with pre-filled values)
- [x] Delete Task
- [x] Mark Complete / Incomplete toggle
- [x] Priority system (High / Medium / Low)
- [x] Filter: All / Active / Completed
- [x] Clear all completed tasks
- [x] Local Storage persistence
- [x] Live task counter
- [x] Creation date on each task
- [x] Responsive design
- [x] Keyboard shortcuts
- [x] XSS protection (escapeHTML)
- [x] Deployed on GitHub Pages

---

## 👨‍💻 Author

**Ahtisham Ali**
- GitHub: [@ahtishamali17](https://github.com/ahtishamali17)
- Email: theali0017@email.com

---

*Built with ❤️ as part of InternSpark Web Development Internship*
