// Courses page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeCoursesPage();
});

function initializeCoursesPage() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Setup event listeners
    setupCourseEventListeners();
    
    // Load and display courses
    loadCourses();
}

function setupCourseEventListeners() {
    // Add course form
    const addCourseForm = document.getElementById('addCourseForm');
    if (addCourseForm) {
        addCourseForm.addEventListener('submit', handleAddCourse);
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

function loadCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;

    // Get courses from localStorage or use sample data
    let courses = JSON.parse(localStorage.getItem('courses')) || [
        {
            id: 1,
            name: "Introduction to Computer Science",
            code: "CS101",
            instructor: "Dr. Smith",
            credits: 3,
            semester: "Fall 2024",
            description: "Fundamental concepts of computer science and programming.",
            enrolled: true
        },
        {
            id: 2,
            name: "Data Structures and Algorithms",
            code: "CS201",
            instructor: "Prof. Johnson",
            credits: 4,
            semester: "Fall 2024",
            description: "Advanced data structures and algorithm design.",
            enrolled: true
        },
        {
            id: 3,
            name: "Database Management",
            code: "CS301",
            instructor: "Dr. Williams",
            credits: 3,
            semester: "Fall 2024",
            description: "Database design, implementation, and management.",
            enrolled: false
        }
    ];

    coursesGrid.innerHTML = '';

    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesGrid.appendChild(courseCard);
    });
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    const statusClass = course.enrolled ? 'enrolled' : 'available';
    const statusText = course.enrolled ? 'Enrolled' : 'Available';
    
    card.innerHTML = `
        <div class="course-header">
            <h3>${course.name}</h3>
            <span class="course-status ${statusClass}">${statusText}</span>
        </div>
        <div class="course-info">
            <p><strong>Code:</strong> ${course.code}</p>
            <p><strong>Instructor:</strong> ${course.instructor}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Semester:</strong> ${course.semester}</p>
        </div>
        <div class="course-description">
            <p>${course.description}</p>
        </div>
        <div class="course-actions">
            <button class="btn btn-outline" onclick="viewCourseDetails(${course.id})">
                <i class="fas fa-eye"></i> View Details
            </button>
            ${course.enrolled ? 
                `<button class="btn btn-primary" onclick="enterCourse(${course.id})">
                    <i class="fas fa-sign-in-alt"></i> Enter Course
                </button>` :
                `<button class="btn btn-secondary" onclick="enrollInCourse(${course.id})">
                    <i class="fas fa-user-plus"></i> Enroll
                </button>`
            }
        </div>
    `;
    
    return card;
}

function showAddCourseModal() {
    document.getElementById('addCourseModal').style.display = 'block';
}

function handleAddCourse(e) {
    e.preventDefault();
    
    const courseData = {
        name: document.getElementById('courseName').value,
        code: document.getElementById('courseCode').value,
        instructor: document.getElementById('instructor').value,
        credits: parseInt(document.getElementById('credits').value),
        semester: document.getElementById('semester').value,
        description: document.getElementById('description').value,
        enrolled: false
    };
    
    // Add course to localStorage
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    courseData.id = Date.now();
    courses.push(courseData);
    localStorage.setItem('courses', JSON.stringify(courses));
    
    // Close modal and refresh
    closeModal('addCourseModal');
    loadCourses();
    showMessage('Course added successfully!', 'success');
    
    // Reset form
    document.getElementById('addCourseForm').reset();
}

function viewCourseDetails(courseId) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses.find(c => c.id === courseId);
    
    if (!course) return;
    
    const content = document.getElementById('courseDetailsContent');
    content.innerHTML = `
        <h2>${course.name}</h2>
        <div class="course-details">
            <div class="detail-row">
                <strong>Course Code:</strong> ${course.code}
            </div>
            <div class="detail-row">
                <strong>Instructor:</strong> ${course.instructor}
            </div>
            <div class="detail-row">
                <strong>Credits:</strong> ${course.credits}
            </div>
            <div class="detail-row">
                <strong>Semester:</strong> ${course.semester}
            </div>
            <div class="detail-row">
                <strong>Status:</strong> <span class="course-status ${course.enrolled ? 'enrolled' : 'available'}">${course.enrolled ? 'Enrolled' : 'Available'}</span>
            </div>
            <div class="detail-row">
                <strong>Description:</strong>
                <p>${course.description}</p>
            </div>
        </div>
        <div class="course-actions">
            ${course.enrolled ? 
                `<button class="btn btn-primary" onclick="enterCourse(${course.id})">
                    <i class="fas fa-sign-in-alt"></i> Enter Course
                </button>` :
                `<button class="btn btn-secondary" onclick="enrollInCourse(${course.id})">
                    <i class="fas fa-user-plus"></i> Enroll in Course
                </button>`
            }
            <button class="btn btn-outline" onclick="closeModal('courseDetailsModal')">
                Close
            </button>
        </div>
    `;
    
    document.getElementById('courseDetailsModal').style.display = 'block';
}

function enrollInCourse(courseId) {
    let courses = JSON.parse(localStorage.getItem('courses')) || [];
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex !== -1) {
        courses[courseIndex].enrolled = true;
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCourses();
        showMessage('Successfully enrolled in course!', 'success');
        closeModal('courseDetailsModal');
    }
}

function enterCourse(courseId) {
    // In a real application, this would navigate to the course content
    showMessage('Entering course... Course content page coming soon!', 'success');
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
    const coursesSection = document.querySelector('.courses-section');
    if (coursesSection) {
        coursesSection.insertBefore(messageElement, coursesSection.firstChild);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}
