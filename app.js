/* ============================================================
   TO-DO LIST APP — app.js
   Complete JavaScript with step-by-step explanations
   ============================================================ */


/* ============================================================
   STEP 1: GRAB ALL HTML ELEMENTS WE NEED
   document.getElementById() = find an HTML element by its id=""
   We store each element in a variable so we can use it later.
   ============================================================ */

const taskInput          = document.getElementById('taskInput');          // Main text input
const prioritySelect     = document.getElementById('prioritySelect');     // Priority dropdown
const addBtn             = document.getElementById('addBtn');             // + Add button
const taskList           = document.getElementById('taskList');           // <ul> that holds tasks
const emptyState         = document.getElementById('emptyState');         // "No tasks" message
const emptyText          = document.getElementById('emptyText');          // Text inside empty state
const filterBtns         = document.querySelectorAll('.filter-btn');      // All 3 filter buttons (NodeList)
const clearCompletedBtn  = document.getElementById('clearCompletedBtn'); // "Clear done" button
const totalCountEl       = document.getElementById('totalCount');         // Header count
const activeCountEl      = document.getElementById('activeCount');        // Header active count
const allCountEl         = document.getElementById('allCount');           // Filter tab count
const activeFilterEl     = document.getElementById('activeFilterCount'); // Filter tab count
const completedCountEl   = document.getElementById('completedCount');    // Filter tab count

// Edit modal elements
const editModal    = document.getElementById('editModal');    // The modal overlay
const editInput    = document.getElementById('editInput');    // Input inside modal
const editPriority = document.getElementById('editPriority'); // Priority in modal
const saveEditBtn  = document.getElementById('saveEditBtn');  // Save button in modal
const cancelEditBtn= document.getElementById('cancelEditBtn');// Cancel button in modal


/* ============================================================
   STEP 2: APP STATE
   These variables hold all the data our app needs.
   ============================================================ */

// tasks = an array (list) of task objects.
// Each task object has these properties:
// {
//   id:        "unique string"     — identifies each task
//   text:      "Buy groceries"     — the task description
//   completed: false               — is it done?
//   priority:  "high"|"medium"|"low"
//   date:      "Jan 15, 2024"      — when it was created
// }
let tasks = [];

// currentFilter = which tab is selected: 'all', 'active', or 'completed'
let currentFilter = 'all';

// editingId = the id of the task currently being edited (null if none)
let editingId = null;


/* ============================================================
   STEP 3: LOCAL STORAGE — SAVE & LOAD
   
   What is Local Storage?
   ─────────────────────
   Local Storage is a browser feature that lets you save data
   permanently on the user's computer. Unlike regular variables
   (which disappear when the page reloads), Local Storage
   data stays forever until the user clears their browser data.
   
   Important: Local Storage only stores STRINGS (text).
   So we use JSON.stringify() to convert our array to a string,
   and JSON.parse() to convert it back to an array.
   
   localStorage.setItem('key', value) → save data
   localStorage.getItem('key')        → read data
   ============================================================ */

/**
 * saveTasks()
 * Converts the tasks array to a JSON string and saves it to Local Storage.
 * Called every time the tasks array changes.
 */
function saveTasks() {
  // JSON.stringify([{id:"1",text:"Buy milk",...}])
  // becomes the string: '[{"id":"1","text":"Buy milk",...}]'
  localStorage.setItem('todo-tasks', JSON.stringify(tasks));
}

/**
 * loadTasks()
 * Reads the saved string from Local Storage and converts it back to an array.
 * Called once when the page first loads.
 */
function loadTasks() {
  const saved = localStorage.getItem('todo-tasks');
  // If there is saved data, parse it. Otherwise start with empty array.
  tasks = saved ? JSON.parse(saved) : [];
}


/* ============================================================
   STEP 4: GENERATE UNIQUE IDs
   
   Every task needs a unique identifier so we can find it later
   (for editing or deleting). We use Date.now() which gives the
   current timestamp in milliseconds — always unique.
   ============================================================ */

/**
 * generateId()
 * Returns a unique string like "task_1705312890123"
 */
function generateId() {
  return 'task_' + Date.now();
}


/* ============================================================
   STEP 5: FORMAT DATE
   
   We want to show the creation date of each task.
   Date.now() gives milliseconds. We convert it to a
   readable string like "Jan 15, 2024".
   ============================================================ */

/**
 * formatDate()
 * Returns today's date as a readable string.
 */
function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',  // "Jan", "Feb", etc.
    day:   'numeric', // 1, 2, ... 31
    year:  'numeric'  // 2024
  });
}


/* ============================================================
   STEP 6: ADD TASK
   
   This runs when the user clicks "Add" or presses Enter.
   It:
   1. Gets the text from the input
   2. Validates it (not empty)
   3. Creates a new task object
   4. Adds it to the tasks array
   5. Saves to Local Storage
   6. Re-renders the list
   ============================================================ */

/**
 * addTask()
 * Creates a new task and adds it to the list.
 */
function addTask() {
  // .trim() removes spaces from beginning and end
  const text = taskInput.value.trim();
  const priority = prioritySelect.value; // 'low', 'medium', or 'high'

  // Validation: don't add if input is empty
  if (text === '') {
    // Shake animation to show error
    taskInput.classList.add('shake');
    setTimeout(() => taskInput.classList.remove('shake'), 400);
    taskInput.focus();
    return; // stop the function here
  }

  // Create a new task object
  const newTask = {
    id:        generateId(),   // unique id like "task_1705312890123"
    text:      text,           // the task text
    completed: false,          // starts as not done
    priority:  priority,       // 'low', 'medium', or 'high'
    date:      formatDate()    // creation date like "Jan 15, 2024"
  };

  // Add the new task to the BEGINNING of the array (so newest is on top)
  tasks.unshift(newTask);

  // Save to Local Storage
  saveTasks();

  // Clear the input field
  taskInput.value = '';
  taskInput.focus(); // Keep cursor in input for quick entry

  // Re-render the list to show the new task
  renderTasks();
}


/* ============================================================
   STEP 7: TOGGLE COMPLETE
   
   When user clicks the checkbox on a task, we flip its
   completed status: false → true or true → false.
   ============================================================ */

/**
 * toggleComplete(id)
 * Flips the completed status of a task.
 * @param {string} id - the task's unique id
 */
function toggleComplete(id) {
  // Find the task in our array whose id matches
  const task = tasks.find(t => t.id === id);

  if (task) {
    // Flip the boolean: false becomes true, true becomes false
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}


/* ============================================================
   STEP 8: DELETE TASK
   
   We use Array.filter() to create a new array WITHOUT
   the task that has the given id.
   ============================================================ */

/**
 * deleteTask(id)
 * Removes a task from the array permanently.
 * @param {string} id - the task's unique id
 */
function deleteTask(id) {
  // Array.filter() keeps only items where the condition is true
  // So this removes the task with matching id
  tasks = tasks.filter(t => t.id !== id);

  saveTasks();
  renderTasks();
}


/* ============================================================
   STEP 9: OPEN EDIT MODAL
   
   When user clicks the edit button, we:
   1. Store the task's id in editingId
   2. Pre-fill the modal input with current task text
   3. Show the modal
   ============================================================ */

/**
 * openEdit(id)
 * Opens the edit modal for the task with the given id.
 * @param {string} id - the task's unique id
 */
function openEdit(id) {
  // Find the task to edit
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  editingId = id;                   // remember which task we're editing
  editInput.value = task.text;      // pre-fill input with current text
  editPriority.value = task.priority; // pre-fill priority dropdown

  // Show the modal by removing the 'hidden' class
  editModal.classList.remove('hidden');
  editInput.focus(); // put cursor in the input automatically
  editInput.select(); // select all text for easy replacement
}


/* ============================================================
   STEP 10: SAVE EDIT
   
   When user clicks "Save" in the modal, we:
   1. Get the updated text
   2. Validate it
   3. Find the task and update its properties
   4. Save and re-render
   ============================================================ */

/**
 * saveEdit()
 * Saves the changes made in the edit modal.
 */
function saveEdit() {
  const newText = editInput.value.trim();
  const newPriority = editPriority.value;

  // Don't save if input is empty
  if (newText === '') {
    editInput.focus();
    return;
  }

  // Find the task by its id and update it
  const task = tasks.find(t => t.id === editingId);
  if (task) {
    task.text = newText;
    task.priority = newPriority;
    saveTasks();
    renderTasks();
  }

  closeModal();
}


/**
 * closeModal()
 * Hides the edit modal and resets editingId.
 */
function closeModal() {
  editModal.classList.add('hidden');
  editingId = null; // clear the stored id
}


/* ============================================================
   STEP 11: CLEAR COMPLETED
   
   Removes ALL completed tasks from the array at once.
   ============================================================ */

/**
 * clearCompleted()
 * Deletes every task where completed === true.
 */
function clearCompleted() {
  // Keep only tasks that are NOT completed
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}


/* ============================================================
   STEP 12: GET FILTERED TASKS
   
   Returns a subset of tasks based on the current filter.
   'all'       → return everything
   'active'    → return only incomplete tasks
   'completed' → return only completed tasks
   ============================================================ */

/**
 * getFilteredTasks()
 * Returns tasks filtered by the currentFilter variable.
 * @returns {Array} — filtered array of tasks
 */
function getFilteredTasks() {
  if (currentFilter === 'active') {
    // Keep only tasks where completed is false
    return tasks.filter(t => !t.completed);
  }
  if (currentFilter === 'completed') {
    // Keep only tasks where completed is true
    return tasks.filter(t => t.completed);
  }
  // Default: return all tasks
  return tasks;
}


/* ============================================================
   STEP 13: CREATE TASK HTML (DOM MANIPULATION)
   
   What is DOM Manipulation?
   ─────────────────────────
   The DOM (Document Object Model) is the JavaScript
   representation of your HTML. We can create, read, update,
   and delete HTML elements entirely through JavaScript.
   
   createElement()  → creates a new HTML element
   classList.add()  → adds a CSS class to an element
   innerHTML        → sets the HTML content inside an element
   appendChild()    → adds an element inside another
   ============================================================ */

/**
 * createTaskElement(task)
 * Creates a complete <li> element for one task.
 * @param {object} task - the task object
 * @returns {HTMLElement} - the <li> element ready to insert
 */
function createTaskElement(task) {
  // Create the <li> element
  const li = document.createElement('li');
  li.classList.add('task-item');

  // If completed, add the 'completed' CSS class for strikethrough style
  if (task.completed) {
    li.classList.add('completed');
  }

  // Set a data attribute so we can find this element's task later
  li.dataset.id = task.id;

  // Build the inner HTML using a template literal (backtick string)
  // Template literals allow us to embed variables with ${variableName}
  li.innerHTML = `
    <!-- Checkbox button -->
    <button
      class="task-checkbox ${task.completed ? 'checked' : ''}"
      onclick="toggleComplete('${task.id}')"
      title="${task.completed ? 'Mark incomplete' : 'Mark complete'}"
      aria-label="Toggle task completion"
    >
      ${task.completed ? '<i class="bi bi-check-lg"></i>' : ''}
    </button>

    <!-- Priority color dot -->
    <div class="priority-dot ${task.priority}" title="${task.priority} priority"></div>

    <!-- Task text -->
    <span class="task-text">${escapeHTML(task.text)}</span>

    <!-- Creation date -->
    <span class="task-date">${task.date}</span>

    <!-- Edit & Delete buttons (appear on hover) -->
    <div class="task-actions">
      <button
        class="action-btn edit"
        onclick="openEdit('${task.id}')"
        title="Edit task"
        aria-label="Edit task"
      >
        <i class="bi bi-pencil"></i>
      </button>
      <button
        class="action-btn delete"
        onclick="deleteTask('${task.id}')"
        title="Delete task"
        aria-label="Delete task"
      >
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  `;

  return li; // return the finished element
}


/* ============================================================
   SECURITY: ESCAPE HTML
   
   Why? If a user types: <script>alert('hacked!')</script>
   and we insert it directly into innerHTML, the script runs!
   escapeHTML() converts dangerous characters to safe versions:
   < becomes &lt;   > becomes &gt;   & becomes &amp;
   This prevents XSS (Cross-Site Scripting) attacks.
   ============================================================ */

/**
 * escapeHTML(str)
 * Makes user input safe to insert into HTML.
 * @param {string} str - raw user input
 * @returns {string} - safe HTML string
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str; // textContent auto-escapes special chars
  return div.innerHTML;  // innerHTML then returns escaped version
}


/* ============================================================
   STEP 14: UPDATE COUNTERS
   
   Updates all the number badges:
   - Header: "5 total · 3 remaining"
   - Filter tabs: All(5) Active(3) Done(2)
   ============================================================ */

/**
 * updateCounts()
 * Recalculates and displays all task counts.
 */
function updateCounts() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active    = total - completed;

  // Header badges
  totalCountEl.textContent  = total;
  activeCountEl.textContent = active;

  // Filter tab badges
  allCountEl.textContent          = total;
  activeFilterEl.textContent      = active;
  completedCountEl.textContent    = completed;
}


/* ============================================================
   STEP 15: RENDER TASKS (THE MAIN DRAW FUNCTION)
   
   This is the most important function. Every time data changes,
   we call renderTasks() to completely redraw the task list.
   
   1. Clear the current list
   2. Filter tasks based on currentFilter
   3. For each task, create an element and add it to the list
   4. Show empty state if no tasks match
   5. Update all counters
   ============================================================ */

/**
 * renderTasks()
 * Clears and redraws the entire task list.
 */
function renderTasks() {
  // Clear everything currently in the <ul>
  taskList.innerHTML = '';

  // Get the filtered subset
  const filtered = getFilteredTasks();

  if (filtered.length === 0) {
    // Show the empty state message
    emptyState.style.display = 'block';

    // Customize the message based on which filter is active
    if (currentFilter === 'completed') {
      emptyText.textContent = 'No completed tasks yet.';
    } else if (currentFilter === 'active') {
      emptyText.textContent = 'No active tasks — great job! 🎉';
    } else {
      emptyText.textContent = 'No tasks yet. Add one above!';
    }
  } else {
    // Hide the empty state
    emptyState.style.display = 'none';

    // Loop through each task and add it to the list
    // forEach() calls a function once for each item in the array
    filtered.forEach(function(task) {
      const li = createTaskElement(task); // create the <li> element
      taskList.appendChild(li);           // add it to the <ul>
    });
  }

  // Always update the counter badges
  updateCounts();
}


/* ============================================================
   STEP 16: EVENT LISTENERS
   
   What is an Event Listener?
   ──────────────────────────
   An event listener "listens" for user actions (clicks,
   key presses, etc.) on an HTML element and calls a function
   when that action happens.
   
   element.addEventListener('eventName', functionToCall)
   ============================================================ */

// ADD BUTTON CLICK — add a new task
addBtn.addEventListener('click', addTask);

// ENTER KEY in the task input — same as clicking Add
taskInput.addEventListener('keydown', function(e) {
  // e.key gives the key that was pressed
  if (e.key === 'Enter') {
    addTask();
  }
});

// ENTER KEY in the edit modal input
editInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    saveEdit();
  }
  if (e.key === 'Escape') {
    closeModal();
  }
});

// SAVE EDIT BUTTON
saveEditBtn.addEventListener('click', saveEdit);

// CANCEL EDIT BUTTON
cancelEditBtn.addEventListener('click', closeModal);

// CLICK OUTSIDE MODAL to close it
editModal.addEventListener('click', function(e) {
  // e.target = the element that was actually clicked
  // If the click was directly on the dark overlay (not the modal box), close
  if (e.target === editModal) {
    closeModal();
  }
});

// CLEAR COMPLETED BUTTON
clearCompletedBtn.addEventListener('click', function() {
  const completedCount = tasks.filter(t => t.completed).length;
  if (completedCount === 0) return; // nothing to clear

  // Simple confirmation before deleting
  if (confirm(`Delete ${completedCount} completed task(s)?`)) {
    clearCompleted();
  }
});

// FILTER BUTTONS — All / Active / Completed
filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    // Remove 'active' class from all filter buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add 'active' class to the clicked button
    btn.classList.add('active');
    // Update the currentFilter variable
    // data-filter="all" → currentFilter = 'all'
    currentFilter = btn.dataset.filter;
    // Re-render with the new filter
    renderTasks();
  });
});

// KEYBOARD SHORTCUT: Press "/" to focus the input quickly
document.addEventListener('keydown', function(e) {
  if (e.key === '/' && document.activeElement !== taskInput) {
    e.preventDefault();
    taskInput.focus();
  }
});


/* ============================================================
   STEP 17: SHAKE ANIMATION (CSS + JS together)
   
   When user tries to add an empty task, we shake the input.
   The CSS class is added by JS, then removed after 400ms.
   ============================================================ */

// Add the shake animation CSS dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
  .shake { animation: shake 0.4s ease; border-color: #ef4444 !important; }
`;
document.head.appendChild(shakeStyle);


/* ============================================================
   STEP 18: INITIALIZE THE APP
   
   This runs once when the page loads:
   1. Load tasks from Local Storage
   2. Render the task list
   ============================================================ */

// Load saved tasks from Local Storage
loadTasks();

// Draw the task list
renderTasks();

// Focus the input so user can start typing immediately
taskInput.focus();

/* ============================================================
   THAT'S THE COMPLETE APP!
   
   SUMMARY OF HOW IT ALL WORKS TOGETHER:
   ──────────────────────────────────────
   1. Page loads → loadTasks() reads from localStorage → renderTasks() draws the list
   2. User types task → clicks Add → addTask() creates object → saveTasks() → renderTasks()
   3. User checks task → toggleComplete() flips .completed → saveTasks() → renderTasks()
   4. User clicks edit → openEdit() fills modal → saveEdit() updates task → renderTasks()
   5. User deletes → deleteTask() filters array → saveTasks() → renderTasks()
   6. User clicks filter → updates currentFilter → renderTasks() shows filtered list
   7. Every renderTasks() also calls updateCounts() to keep numbers correct
   ============================================================ */
