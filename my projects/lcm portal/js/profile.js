// Profile page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
});

function initializeProfilePage() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Setup event listeners
    setupProfileEventListeners();
    
    // Load user data
    loadUserProfile();
    loadAcademicInfo();
    updateProfileStats();
}

function setupProfileEventListeners() {
    // Personal info form
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', handlePersonalInfoUpdate);
    }

    // Change password form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Notification checkboxes
    const notificationCheckboxes = document.querySelectorAll('.notification-settings input[type="checkbox"]');
    notificationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleNotificationChange);
    });

    // Privacy checkboxes
    const privacyCheckboxes = document.querySelectorAll('.privacy-settings input[type="checkbox"]');
    privacyCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handlePrivacyChange);
    });
}

function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Update profile header
    document.getElementById('profileName').textContent = currentUser.name || 'User Name';
    document.getElementById('profileEmail').textContent = currentUser.email || 'user@example.com';
    document.getElementById('profileType').textContent = currentUser.type || 'Student';

    // Load personal information
    const personalInfo = JSON.parse(localStorage.getItem('personalInfo')) || {
        firstName: currentUser.name?.split(' ')[0] || '',
        lastName: currentUser.name?.split(' ')[1] || '',
        email: currentUser.email || '',
        phone: '',
        dateOfBirth: '',
        address: ''
    };

    // Populate form fields
    document.getElementById('firstName').value = personalInfo.firstName;
    document.getElementById('lastName').value = personalInfo.lastName;
    document.getElementById('email').value = personalInfo.email;
    document.getElementById('phone').value = personalInfo.phone;
    document.getElementById('dateOfBirth').value = personalInfo.dateOfBirth;
    document.getElementById('address').value = personalInfo.address;

    // Load notification settings
    const notificationSettings = JSON.parse(localStorage.getItem('notificationSettings')) || {
        emailNotifications: true,
        gradeNotifications: true,
        courseNotifications: false
    };

    Object.entries(notificationSettings).forEach(([setting, value]) => {
        const checkbox = document.getElementById(setting);
        if (checkbox) {
            checkbox.checked = value;
        }
    });

    // Load privacy settings
    const privacySettings = JSON.parse(localStorage.getItem('privacySettings')) || {
        profileVisibility: true,
        gradeVisibility: true
    };

    Object.entries(privacySettings).forEach(([setting, value]) => {
        const checkbox = document.getElementById(setting);
        if (checkbox) {
            checkbox.checked = value;
        }
    });
}

function loadAcademicInfo() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const enrolledCourses = courses.filter(course => course.enrolled);
    
    const currentCoursesContainer = document.getElementById('currentCourses');
    if (currentCoursesContainer) {
        currentCoursesContainer.innerHTML = '';
        
        enrolledCourses.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course-item';
            courseElement.innerHTML = `
                <div class="course-info">
                    <h4>${course.name}</h4>
                    <p>${course.code} - ${course.instructor}</p>
                    <p>${course.credits} credits</p>
                </div>
                <div class="course-status">
                    <span class="status enrolled">Enrolled</span>
                </div>
            `;
            currentCoursesContainer.appendChild(courseElement);
        });
    }
}

function updateProfileStats() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    
    const enrolledCourses = courses.filter(course => course.enrolled);
    const completedAssignments = assignments.filter(assignment => assignment.status === 'completed');
    const gradedGrades = grades.filter(grade => grade.status === 'graded');
    
    // Calculate GPA
    const gpa = calculateGPA(gradedGrades);
    
    // Update stats
    document.getElementById('enrolledCourses').textContent = enrolledCourses.length;
    document.getElementById('completedAssignments').textContent = completedAssignments.length;
    document.getElementById('overallGPA').textContent = gpa;
}

function calculateGPA(grades) {
    if (grades.length === 0) return '0.0';
    
    const gradePoints = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0
    };
    
    const totalPoints = grades.reduce((sum, grade) => {
        const points = gradePoints[grade.grade] || 0;
        return sum + points;
    }, 0);
    
    return (totalPoints / grades.length).toFixed(1);
}

function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function handlePersonalInfoUpdate(e) {
    e.preventDefault();
    
    const personalInfo = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        address: document.getElementById('address').value
    };
    
    // Save to localStorage
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    
    // Update current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentUser.name = `${personalInfo.firstName} ${personalInfo.lastName}`;
    currentUser.email = personalInfo.email;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update profile display
    document.getElementById('profileName').textContent = `${personalInfo.firstName} ${personalInfo.lastName}`;
    document.getElementById('profileEmail').textContent = personalInfo.email;
    
    showMessage('Personal information updated successfully!', 'success');
}

function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Simple validation
    if (newPassword !== confirmPassword) {
        showMessage('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // In a real application, this would validate the current password
    // and update it on the server
    showMessage('Password changed successfully!', 'success');
    
    // Reset form
    document.getElementById('changePasswordForm').reset();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
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
    const profileSection = document.querySelector('.profile-section');
    if (profileSection) {
        profileSection.insertBefore(messageElement, profileSection.firstChild);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

function handleNotificationChange(e) {
    const setting = e.target.id;
    const isEnabled = e.target.checked;
    
    // Save to localStorage
    const notificationSettings = JSON.parse(localStorage.getItem('notificationSettings')) || {};
    notificationSettings[setting] = isEnabled;
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    
    showMessage(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
}

function handlePrivacyChange(e) {
    const setting = e.target.id;
    const isEnabled = e.target.checked;
    
    // Save to localStorage
    const privacySettings = JSON.parse(localStorage.getItem('privacySettings')) || {};
    privacySettings[setting] = isEnabled;
    localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
    
    showMessage(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
}
