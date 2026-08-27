// Diary Desk - Simple JavaScript for Teacher Management Application

// Simple data storage (in real app, this would be a database)
let currentUser = null;
let tasks = [
    { id: 1, title: 'Prepare Science Quiz', time: '14:00', description: 'Create quiz for Grade 8', completed: false },
    { id: 2, title: 'Grade Math Homework', time: '16:00', description: 'Grade assignments from Tuesday', completed: false }
];
let leaveRequests = [
    { id: 1, type: 'Annual Leave', startDate: '2024-03-15', endDate: '2024-03-17', status: 'approved', reason: 'Family vacation' },
    { id: 2, type: 'Sick Leave', startDate: '2024-04-05', endDate: '2024-04-05', status: 'pending', reason: 'Doctor appointment' }
];

// Simple user data
const users = [
    { email: 'teacher@school.edu', password: 'password123', name: 'John Doe', department: 'Mathematics', id: 'T12345' }
];

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in (simple check)
    const savedUser = localStorage.getItem('diaryDeskUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLogin();
    }
    
    setupEventListeners();
}

function setupEventListeners() {
    // Login/Signup Navigation
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    
    if (showSignupLink) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSignup();
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showLogin();
        });
    }
    
    // Forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Task Management
    const addTaskBtn = document.getElementById('add-task-btn');
    const addTaskModal = document.getElementById('add-task-modal');
    const cancelTaskBtn = document.getElementById('cancel-task');
    const addTaskForm = document.getElementById('add-task-form');
    
    if (addTaskBtn && addTaskModal) {
        addTaskBtn.addEventListener('click', function() {
            addTaskModal.classList.add('active');
        });
    }
    
    if (cancelTaskBtn && addTaskModal) {
        cancelTaskBtn.addEventListener('click', function() {
            addTaskModal.classList.remove('active');
        });
    }
    
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', handleAddTask);
    }
    
    // Task Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterTasks(filter);
            
            filterBtns.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Leave Management
    const requestLeaveBtn = document.getElementById('request-leave-btn');
    const leaveModal = document.getElementById('leave-modal');
    const cancelLeaveBtn = document.getElementById('cancel-leave');
    const leaveForm = document.getElementById('leave-form');
    
    if (requestLeaveBtn && leaveModal) {
        requestLeaveBtn.addEventListener('click', function() {
            leaveModal.classList.add('active');
        });
    }
    
    if (cancelLeaveBtn && leaveModal) {
        cancelLeaveBtn.addEventListener('click', function() {
            leaveModal.classList.remove('active');
        });
    }
    
    if (leaveForm) {
        leaveForm.addEventListener('submit', handleLeaveRequest);
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Profile settings
    const saveSettingsBtn = document.querySelector('[data-testid="button-save-settings"]');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', handleSaveSettings);
    }
}

// Screen Management
function showLogin() {
    hideAllScreens();
    document.getElementById('login-screen').classList.add('active');
}

function showSignup() {
    hideAllScreens();
    document.getElementById('signup-screen').classList.add('active');
}

function showDashboard() {
    hideAllScreens();
    document.getElementById('dashboard-screen').classList.add('active');
    updateDashboard();
}

function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
}

function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update page-specific content
        if (pageName === 'tasks') {
            renderTasks();
        } else if (pageName === 'leave') {
            renderLeaveRequests();
        } else if (pageName === 'profile') {
            updateProfile();
        }
    }
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in real app, this would be secure)
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('diaryDeskUser', JSON.stringify(user));
        showDashboard();
        showNotification('Welcome back!', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showNotification('User already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        email: email,
        password: password,
        name: name,
        department: 'General',
        id: 'T' + Date.now()
    };
    
    users.push(newUser);
    currentUser = newUser;
    localStorage.setItem('diaryDeskUser', JSON.stringify(newUser));
    
    showDashboard();
    showNotification('Account created successfully!', 'success');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('diaryDeskUser');
    showLogin();
    showNotification('Logged out successfully', 'success');
}

// Dashboard Updates
function updateDashboard() {
    if (!currentUser) return;
    
    // Update user name
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = currentUser.name;
    }
    
    // Update metrics
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const tasksCountElement = document.querySelector('[data-testid="text-tasks-count"]');
    if (tasksCountElement) {
        tasksCountElement.textContent = pendingTasks;
    }
    
    // Update leave balance (simple calculation)
    const usedAnnualLeave = leaveRequests.filter(req => req.type === 'Annual Leave' && req.status === 'approved').length;
    const remainingLeave = 20 - usedAnnualLeave;
    const leaveBalanceElement = document.querySelector('[data-testid="text-leave-balance"]');
    if (leaveBalanceElement) {
        leaveBalanceElement.textContent = remainingLeave;
    }
    
    // Update weekly progress
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const weekProgressElement = document.querySelector('[data-testid="text-week-progress"]');
    if (weekProgressElement) {
        weekProgressElement.textContent = `${completedTasks}/${totalTasks}`;
    }
}

// Task Management
function renderTasks() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;
    
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.setAttribute('data-testid', `task-item-${task.id}`);
        
        taskItem.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       data-testid="checkbox-task-${task.id}"
                       onchange="toggleTask(${task.id})">
                <span class="task-title ${task.completed ? 'completed' : ''}">${task.title}</span>
                <span class="task-time">Due: ${task.time}</span>
            </div>
            <button class="task-delete" onclick="deleteTask(${task.id})" 
                    data-testid="button-delete-task-${task.id}">🗑️</button>
        `;
        
        taskList.appendChild(taskItem);
    });
}

function handleAddTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const time = document.getElementById('task-time').value;
    const description = document.getElementById('task-description').value;
    
    const newTask = {
        id: Date.now(),
        title: title,
        time: time,
        description: description,
        completed: false
    };
    
    tasks.push(newTask);
    renderTasks();
    updateDashboard();
    
    // Close modal and reset form
    document.getElementById('add-task-modal').classList.remove('active');
    document.getElementById('add-task-form').reset();
    
    showNotification('Task added successfully!', 'success');
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateDashboard();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
    updateDashboard();
    showNotification('Task deleted', 'success');
}

function filterTasks(filter) {
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const isCompleted = checkbox.checked;
        
        let shouldShow = true;
        if (filter === 'pending') {
            shouldShow = !isCompleted;
        } else if (filter === 'completed') {
            shouldShow = isCompleted;
        }
        
        item.style.display = shouldShow ? 'flex' : 'none';
    });
}

// Leave Management
function renderLeaveRequests() {
    const requestList = document.querySelector('.request-list');
    if (!requestList) return;
    
    requestList.innerHTML = '';
    
    leaveRequests.forEach(request => {
        const requestItem = document.createElement('div');
        requestItem.className = 'request-item';
        requestItem.setAttribute('data-testid', `leave-request-${request.id}`);
        
        const statusClass = request.status === 'approved' ? 'approved' : 'pending';
        
        requestItem.innerHTML = `
            <div class="request-info">
                <span class="request-date">${formatDateRange(request.startDate, request.endDate)}</span>
                <span class="request-type">${request.type}</span>
                <span class="request-status ${statusClass}" data-testid="status-${request.status}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
            </div>
        `;
        
        requestList.appendChild(requestItem);
    });
    
    // Update leave summary
    updateLeaveSummary();
}

function handleLeaveRequest(e) {
    e.preventDefault();
    
    const type = document.getElementById('leave-type').value;
    const startDate = document.getElementById('leave-start').value;
    const endDate = document.getElementById('leave-end').value;
    const reason = document.getElementById('leave-reason').value;
    
    const newRequest = {
        id: Date.now(),
        type: type,
        startDate: startDate,
        endDate: endDate,
        status: 'pending',
        reason: reason
    };
    
    leaveRequests.push(newRequest);
    renderLeaveRequests();
    
    // Close modal and reset form
    document.getElementById('leave-modal').classList.remove('active');
    document.getElementById('leave-form').reset();
    
    showNotification('Leave request submitted!', 'success');
}

function updateLeaveSummary() {
    const annualUsed = leaveRequests.filter(req => req.type === 'Annual Leave' && req.status === 'approved').length;
    const sickUsed = leaveRequests.filter(req => req.type === 'Sick Leave' && req.status === 'approved').length;
    
    const annualUsedElement = document.querySelector('[data-testid="text-annual-used"]');
    const sickUsedElement = document.querySelector('[data-testid="text-sick-used"]');
    
    if (annualUsedElement) annualUsedElement.textContent = annualUsed;
    if (sickUsedElement) sickUsedElement.textContent = sickUsed;
}

// Profile Management
function updateProfile() {
    if (!currentUser) return;
    
    const profileName = document.querySelector('[data-testid="text-profile-name"]');
    const profileEmail = document.querySelector('[data-testid="text-profile-email"]');
    const profileDepartment = document.querySelector('[data-testid="text-profile-department"]');
    const profileId = document.querySelector('[data-testid="text-profile-id"]');
    
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileDepartment) profileDepartment.textContent = currentUser.department;
    if (profileId) profileId.textContent = currentUser.id;
}

function handleSaveSettings() {
    showNotification('Settings saved successfully!', 'success');
}

// Search Functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    // Simple search in current page
    const currentPage = document.querySelector('.page.active');
    if (!currentPage) return;
    
    const searchableElements = currentPage.querySelectorAll('.task-item, .activity-item, .request-item');
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        const shouldShow = text.includes(searchTerm);
        element.style.display = shouldShow ? 'flex' : 'none';
    });
}

// Utility Functions
function formatDateRange(startDate, endDate) {
    if (startDate === endDate) {
        return new Date(startDate).toLocaleDateString();
    }
    return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
}

function showNotification(message, type) {
    // Simple notification system
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#34A853' : '#dc3545'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .task-title.completed {
        text-decoration: line-through;
        opacity: 0.6;
    }
`;
document.head.appendChild(style);