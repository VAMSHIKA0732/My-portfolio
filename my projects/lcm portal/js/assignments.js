// Assignments page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAssignmentsPage();
});

function initializeAssignmentsPage() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Setup event listeners
    setupAssignmentEventListeners();
    
    // Load and display assignments
    loadAssignments();
    populateCourseOptions();
}

function setupAssignmentEventListeners() {
    // Add assignment form
    const addAssignmentForm = document.getElementById('addAssignmentForm');
    if (addAssignmentForm) {
        addAssignmentForm.addEventListener('submit', handleAddAssignment);
    }

    // Submit assignment form
    const submitAssignmentForm = document.getElementById('submitAssignmentForm');
    if (submitAssignmentForm) {
        submitAssignmentForm.addEventListener('submit', handleSubmitAssignment);
    }

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

function loadAssignments() {
    const assignmentsGrid = document.getElementById('assignmentsGrid');
    if (!assignmentsGrid) return;

    // Get assignments from localStorage or use sample data
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [
        {
            id: 1,
            title: "Programming Assignment 1",
            course: "CS101",
            description: "Create a simple calculator program in Python",
            points: 100,
            dueDate: "2024-12-15T23:59",
            type: "homework",
            status: "pending",
            submitted: false,
            submissionDate: null
        },
        {
            id: 2,
            title: "Algorithm Analysis Report",
            course: "CS201",
            description: "Analyze the time complexity of sorting algorithms",
            points: 150,
            dueDate: "2024-12-10T23:59",
            type: "project",
            status: "completed",
            submitted: true,
            submissionDate: "2024-12-08T14:30"
        },
        {
            id: 3,
            title: "Database Design Project",
            course: "CS301",
            description: "Design a database schema for a library management system",
            points: 200,
            dueDate: "2024-12-20T23:59",
            type: "project",
            status: "pending",
            submitted: false,
            submissionDate: null
        }
    ];

    // Update assignment statuses based on due dates
    assignments = updateAssignmentStatuses(assignments);
    localStorage.setItem('assignments', JSON.stringify(assignments));

    assignmentsGrid.innerHTML = '';

    assignments.forEach(assignment => {
        const assignmentCard = createAssignmentCard(assignment);
        assignmentsGrid.appendChild(assignmentCard);
    });
}

function updateAssignmentStatuses(assignments) {
    const now = new Date();
    
    return assignments.map(assignment => {
        const dueDate = new Date(assignment.dueDate);
        
        if (assignment.status === 'completed') {
            return assignment;
        } else if (dueDate < now) {
            return { ...assignment, status: 'overdue' };
        } else {
            return { ...assignment, status: 'pending' };
        }
    });
}

function createAssignmentCard(assignment) {
    const card = document.createElement('div');
    card.className = `assignment-card ${assignment.status}`;
    
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = dueDate < new Date() && assignment.status !== 'completed';
    const timeRemaining = getTimeRemaining(dueDate);
    
    card.innerHTML = `
        <div class="assignment-header">
            <h3>${assignment.title}</h3>
            <span class="assignment-status ${assignment.status}">${assignment.status.toUpperCase()}</span>
        </div>
        <div class="assignment-info">
            <p><strong>Course:</strong> ${assignment.course}</p>
            <p><strong>Type:</strong> ${assignment.type}</p>
            <p><strong>Points:</strong> ${assignment.points}</p>
            <p><strong>Due Date:</strong> ${formatDateTime(dueDate)}</p>
            ${isOverdue ? `<p class="overdue-warning"><i class="fas fa-exclamation-triangle"></i> Overdue</p>` : ''}
            ${!isOverdue && assignment.status === 'pending' ? `<p class="time-remaining">${timeRemaining}</p>` : ''}
        </div>
        <div class="assignment-description">
            <p>${assignment.description}</p>
        </div>
        <div class="assignment-actions">
            <button class="btn btn-outline" onclick="viewAssignmentDetails(${assignment.id})">
                <i class="fas fa-eye"></i> View Details
            </button>
            ${assignment.status === 'pending' && !assignment.submitted ? 
                `<button class="btn btn-primary" onclick="submitAssignment(${assignment.id})">
                    <i class="fas fa-upload"></i> Submit
                </button>` :
                assignment.submitted ? 
                `<button class="btn btn-success" disabled>
                    <i class="fas fa-check"></i> Submitted
                </button>` :
                `<button class="btn btn-secondary" disabled>
                    <i class="fas fa-clock"></i> Overdue
                </button>`
            }
        </div>
    `;
    
    return card;
}

function getTimeRemaining(dueDate) {
    const now = new Date();
    const diff = dueDate - now;
    
    if (diff <= 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} remaining`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    } else {
        return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
    }
}

function formatDateTime(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function populateCourseOptions() {
    const courseSelect = document.getElementById('assignmentCourse');
    if (!courseSelect) return;

    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    courseSelect.innerHTML = '<option value="">Select Course</option>';
    
    courses.forEach(course => {
        if (course.enrolled) {
            const option = document.createElement('option');
            option.value = course.code;
            option.textContent = `${course.code} - ${course.name}`;
            courseSelect.appendChild(option);
        }
    });
}

function showAddAssignmentModal() {
    document.getElementById('addAssignmentModal').style.display = 'block';
}

function handleAddAssignment(e) {
    e.preventDefault();
    
    const assignmentData = {
        title: document.getElementById('assignmentTitle').value,
        course: document.getElementById('assignmentCourse').value,
        description: document.getElementById('assignmentDescription').value,
        points: parseInt(document.getElementById('assignmentPoints').value),
        dueDate: document.getElementById('assignmentDueDate').value,
        type: document.getElementById('assignmentType').value,
        status: 'pending',
        submitted: false,
        submissionDate: null
    };
    
    // Add assignment to localStorage
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    assignmentData.id = Date.now();
    assignments.push(assignmentData);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    // Close modal and refresh
    closeModal('addAssignmentModal');
    loadAssignments();
    showMessage('Assignment added successfully!', 'success');
    
    // Reset form
    document.getElementById('addAssignmentForm').reset();
}

function viewAssignmentDetails(assignmentId) {
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const assignment = assignments.find(a => a.id === assignmentId);
    
    if (!assignment) return;
    
    const content = document.getElementById('assignmentDetailsContent');
    const dueDate = new Date(assignment.dueDate);
    
    content.innerHTML = `
        <h2>${assignment.title}</h2>
        <div class="assignment-details">
            <div class="detail-row">
                <strong>Course:</strong> ${assignment.course}
            </div>
            <div class="detail-row">
                <strong>Type:</strong> ${assignment.type}
            </div>
            <div class="detail-row">
                <strong>Points:</strong> ${assignment.points}
            </div>
            <div class="detail-row">
                <strong>Due Date:</strong> ${formatDateTime(dueDate)}
            </div>
            <div class="detail-row">
                <strong>Status:</strong> <span class="assignment-status ${assignment.status}">${assignment.status.toUpperCase()}</span>
            </div>
            <div class="detail-row">
                <strong>Description:</strong>
                <p>${assignment.description}</p>
            </div>
            ${assignment.submitted ? `
                <div class="detail-row">
                    <strong>Submitted:</strong> ${formatDateTime(new Date(assignment.submissionDate))}
                </div>
            ` : ''}
        </div>
        <div class="assignment-actions">
            ${assignment.status === 'pending' && !assignment.submitted ? 
                `<button class="btn btn-primary" onclick="submitAssignment(${assignment.id})">
                    <i class="fas fa-upload"></i> Submit Assignment
                </button>` :
                assignment.submitted ? 
                `<button class="btn btn-success" disabled>
                    <i class="fas fa-check"></i> Already Submitted
                </button>` :
                `<button class="btn btn-secondary" disabled>
                    <i class="fas fa-clock"></i> Overdue
                </button>`
            }
            <button class="btn btn-outline" onclick="closeModal('assignmentDetailsModal')">
                Close
            </button>
        </div>
    `;
    
    document.getElementById('assignmentDetailsModal').style.display = 'block';
}

function submitAssignment(assignmentId) {
    // Store the assignment ID for the submission form
    document.getElementById('submitAssignmentForm').setAttribute('data-assignment-id', assignmentId);
    document.getElementById('submitAssignmentModal').style.display = 'block';
}

function handleSubmitAssignment(e) {
    e.preventDefault();
    
    const assignmentId = parseInt(document.getElementById('submitAssignmentForm').getAttribute('data-assignment-id'));
    const submissionText = document.getElementById('submissionText').value;
    const submissionFile = document.getElementById('submissionFile').files[0];
    const submissionNotes = document.getElementById('submissionNotes').value;
    
    if (!submissionText.trim()) {
        showMessage('Please provide submission text', 'error');
        return;
    }
    
    // Update assignment in localStorage
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const assignmentIndex = assignments.findIndex(a => a.id === assignmentId);
    
    if (assignmentIndex !== -1) {
        assignments[assignmentIndex].submitted = true;
        assignments[assignmentIndex].submissionDate = new Date().toISOString();
        assignments[assignmentIndex].status = 'completed';
        assignments[assignmentIndex].submission = {
            text: submissionText,
            file: submissionFile ? submissionFile.name : null,
            notes: submissionNotes,
            submittedAt: new Date().toISOString()
        };
        
        localStorage.setItem('assignments', JSON.stringify(assignments));
        
        // Close modal and refresh
        closeModal('submitAssignmentModal');
        loadAssignments();
        showMessage('Assignment submitted successfully!', 'success');
        
        // Reset form
        document.getElementById('submitAssignmentForm').reset();
    }
}

function filterAssignments(filter) {
    const buttons = document.querySelectorAll('.filter-buttons .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const assignments = document.querySelectorAll('.assignment-card');
    
    assignments.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const status = card.classList.contains(filter);
            card.style.display = status ? 'block' : 'none';
        }
    });
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

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
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
    const assignmentsSection = document.querySelector('.assignments-section');
    if (assignmentsSection) {
        assignmentsSection.insertBefore(messageElement, assignmentsSection.firstChild);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}
