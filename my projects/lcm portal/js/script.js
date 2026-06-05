// Global variables
let currentUser = null;
let courses = [];
let assignments = [];
let grades = [];

// Sample data for demonstration
const sampleData = {
    courses: [
        {
            id: 1,
            name: "Introduction to Computer Science",
            instructor: "Dr. Smith",
            code: "CS101",
            semester: "Fall 2024",
            credits: 3
        },
        {
            id: 2,
            name: "Data Structures and Algorithms",
            instructor: "Prof. Johnson",
            code: "CS201",
            semester: "Fall 2024",
            credits: 4
        },
        {
            id: 3,
            name: "Database Management",
            instructor: "Dr. Williams",
            code: "CS301",
            semester: "Fall 2024",
            credits: 3
        }
    ],
    assignments: [
        {
            id: 1,
            title: "Programming Assignment 1",
            course: "CS101",
            dueDate: "2024-12-15",
            status: "pending",
            points: 100
        },
        {
            id: 2,
            title: "Algorithm Analysis Report",
            course: "CS201",
            dueDate: "2024-12-10",
            status: "completed",
            points: 150
        },
        {
            id: 3,
            title: "Database Design Project",
            course: "CS301",
            dueDate: "2024-12-20",
            status: "pending",
            points: 200
        }
    ],
    grades: [
        {
            course: "CS101",
            assignment: "Quiz 1",
            score: 85,
            total: 100,
            percentage: 85
        },
        {
            course: "CS201",
            assignment: "Midterm Exam",
            score: 92,
            total: 100,
            percentage: 92
        },
        {
            course: "CS301",
            assignment: "Lab Exercise 3",
            score: 78,
            total: 100,
            percentage: 78
        }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
});

function initializeApp() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target === '#home') {
                showHome();
            } else if (target === '#courses') {
                showCourses();
            } else if (target === '#assignments') {
                showAssignments();
            } else if (target === '#grades') {
                showGrades();
            } else if (target === '#profile') {
                showProfile();
            }
        });
    });
}

function loadSampleData() {
    courses = [...sampleData.courses];
    assignments = [...sampleData.assignments];
    grades = [...sampleData.grades];
}

// Modal functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('userType').value;
    
    // Validate email and password
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Validate password length
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Simulate login (in real app, this would be an API call)
    currentUser = {
        id: 1,
        name: email.split('@')[0],
        email: email,
        type: userType,
        loginTime: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Close modal and show dashboard
    closeModal('loginModal');
    showDashboard();
    showMessage('Login successful!', 'success');
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const userType = document.getElementById('regUserType').value;
    
    // Validate required fields
    if (!name || !email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    // Validate name format (at least two words)
    if (name.trim().split(/\s+/).length < 2) {
        showMessage('Please enter your full name (first and last name)', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Validate password length and complexity
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
        showMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number', 'error');
        return;
    }
    
    // Simulate registration
    currentUser = {
        id: Date.now(),
        name: name,
        email: email,
        type: userType,
        registrationTime: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Close modal and show dashboard
    closeModal('registerModal');
    showDashboard();
    showMessage('Registration successful!', 'success');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showHome();
    showMessage('Logged out successfully', 'success');
}

// Navigation functions
function showHome() {
    document.getElementById('home').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    
    // Update navigation
    updateActiveNavLink('#home');
}

function showDashboard() {
    if (!currentUser) {
        showMessage('Please login first', 'error');
        return;
    }
    
    document.getElementById('home').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    // Update user info
    document.getElementById('userName').textContent = `Welcome, ${currentUser.name}`;
    
    // Populate dashboard content
    populateDashboard();
    
    // Update navigation
    updateActiveNavLink('#dashboard');
}

function showCourses() {
    if (!currentUser) {
        showMessage('Please login first', 'error');
        return;
    }
    
    showDashboard();
    // Focus on courses section
    const coursesCard = document.querySelector('.dashboard-card:first-child');
    if (coursesCard) {
        coursesCard.scrollIntoView({ behavior: 'smooth' });
    }
}

function showAssignments() {
    if (!currentUser) {
        showMessage('Please login first', 'error');
        return;
    }
    
    showDashboard();
    // Focus on assignments section
    const assignmentsCard = document.querySelectorAll('.dashboard-card')[1];
    if (assignmentsCard) {
        assignmentsCard.scrollIntoView({ behavior: 'smooth' });
    }
}

function showGrades() {
    if (!currentUser) {
        showMessage('Please login first', 'error');
        return;
    }
    
    showDashboard();
    // Focus on grades section
    const gradesCard = document.querySelectorAll('.dashboard-card')[2];
    if (gradesCard) {
        gradesCard.scrollIntoView({ behavior: 'smooth' });
    }
}

function showProfile() {
    if (!currentUser) {
        showMessage('Please login first', 'error');
        return;
    }
    
    showMessage('Profile page coming soon!', 'success');
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeLink) {
            link.classList.add('active');
        }
    });
}

// Dashboard functions
function populateDashboard() {
    populateCourses();
    populateAssignments();
    populateGrades();
}

function populateCourses() {
    const coursesList = document.getElementById('coursesList');
    if (!coursesList) return;
    
    coursesList.innerHTML = '';
    
    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'course-item';
        courseElement.innerHTML = `
            <h4>${course.name}</h4>
            <p><strong>Code:</strong> ${course.code}</p>
            <p><strong>Instructor:</strong> ${course.instructor}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Semester:</strong> ${course.semester}</p>
        `;
        coursesList.appendChild(courseElement);
    });
}

function populateAssignments() {
    const assignmentsList = document.getElementById('assignmentsList');
    if (!assignmentsList) return;
    
    assignmentsList.innerHTML = '';
    
    assignments.forEach(assignment => {
        const assignmentElement = document.createElement('div');
        assignmentElement.className = 'assignment-item';
        assignmentElement.innerHTML = `
            <h4>${assignment.title}</h4>
            <p><strong>Course:</strong> ${assignment.course}</p>
            <p><strong>Due Date:</strong> ${formatDate(assignment.dueDate)}</p>
            <p><strong>Points:</strong> ${assignment.points}</p>
            <span class="status ${assignment.status}">${assignment.status}</span>
        `;
        assignmentsList.appendChild(assignmentElement);
    });
}

function populateGrades() {
    const gradesList = document.getElementById('gradesList');
    if (!gradesList) return;
    
    gradesList.innerHTML = '';
    
    grades.forEach(grade => {
        const gradeElement = document.createElement('div');
        gradeElement.className = 'grade-item';
        gradeElement.innerHTML = `
            <h4>${grade.assignment}</h4>
            <p><strong>Course:</strong> ${grade.course}</p>
            <p><strong>Score:</strong> ${grade.score}/${grade.total} (${grade.percentage}%)</p>
        `;
        gradesList.appendChild(gradeElement);
    });
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Add to top of page
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.insertBefore(messageElement, hero.firstChild);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Course Management Functions
function addCourse(courseData) {
    const newCourse = {
        id: Date.now(),
        ...courseData
    };
    courses.push(newCourse);
    if (currentUser) {
        populateCourses();
    }
}

function updateCourse(courseId, updates) {
    const courseIndex = courses.findIndex(course => course.id === courseId);
    if (courseIndex !== -1) {
        courses[courseIndex] = { ...courses[courseIndex], ...updates };
        if (currentUser) {
            populateCourses();
        }
    }
}

function deleteCourse(courseId) {
    courses = courses.filter(course => course.id !== courseId);
    if (currentUser) {
        populateCourses();
    }
}

// Assignment Management Functions
function addAssignment(assignmentData) {
    const newAssignment = {
        id: Date.now(),
        ...assignmentData
    };
    assignments.push(newAssignment);
    if (currentUser) {
        populateAssignments();
    }
}

function updateAssignment(assignmentId, updates) {
    const assignmentIndex = assignments.findIndex(assignment => assignment.id === assignmentId);
    if (assignmentIndex !== -1) {
        assignments[assignmentIndex] = { ...assignments[assignmentIndex], ...updates };
        if (currentUser) {
            populateAssignments();
        }
    }
}

function deleteAssignment(assignmentId) {
    assignments = assignments.filter(assignment => assignment.id !== assignmentId);
    if (currentUser) {
        populateAssignments();
    }
}

// Grade Management Functions
function addGrade(gradeData) {
    const newGrade = {
        ...gradeData
    };
    grades.push(newGrade);
    if (currentUser) {
        populateGrades();
    }
}

function updateGrade(gradeIndex, updates) {
    if (gradeIndex >= 0 && gradeIndex < grades.length) {
        grades[gradeIndex] = { ...grades[gradeIndex], ...updates };
        if (currentUser) {
            populateGrades();
        }
    }
}

function deleteGrade(gradeIndex) {
    if (gradeIndex >= 0 && gradeIndex < grades.length) {
        grades.splice(gradeIndex, 1);
        if (currentUser) {
            populateGrades();
        }
    }
}

// Export functions for external use
window.LMS = {
    addCourse,
    updateCourse,
    deleteCourse,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addGrade,
    updateGrade,
    deleteGrade,
    showMessage,
    currentUser: () => currentUser
};
