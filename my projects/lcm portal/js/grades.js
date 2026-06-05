// Grades page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeGradesPage();
});

function initializeGradesPage() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Setup event listeners
    setupGradeEventListeners();
    
    // Load and display grades
    loadGrades();
    calculateSummaryStats();
}

function setupGradeEventListeners() {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

function loadGrades() {
    // Get grades from localStorage or use sample data
    let grades = JSON.parse(localStorage.getItem('grades')) || [
        {
            id: 1,
            course: "CS101",
            assignment: "Quiz 1",
            score: 85,
            total: 100,
            percentage: 85,
            grade: "B",
            date: "2024-11-15",
            status: "graded"
        },
        {
            id: 2,
            course: "CS101",
            assignment: "Programming Assignment 1",
            score: 92,
            total: 100,
            percentage: 92,
            grade: "A-",
            date: "2024-11-20",
            status: "graded"
        },
        {
            id: 3,
            course: "CS201",
            assignment: "Midterm Exam",
            score: 78,
            total: 100,
            percentage: 78,
            grade: "C+",
            date: "2024-11-25",
            status: "graded"
        },
        {
            id: 4,
            course: "CS201",
            assignment: "Algorithm Analysis Report",
            score: 135,
            total: 150,
            percentage: 90,
            grade: "A-",
            date: "2024-12-08",
            status: "graded"
        },
        {
            id: 5,
            course: "CS301",
            assignment: "Database Design Quiz",
            score: 88,
            total: 100,
            percentage: 88,
            grade: "B+",
            date: "2024-12-05",
            status: "graded"
        },
        {
            id: 6,
            course: "CS301",
            assignment: "Database Project",
            score: 0,
            total: 200,
            percentage: 0,
            grade: "Not Graded",
            date: "2024-12-20",
            status: "pending"
        }
    ];

    localStorage.setItem('grades', JSON.stringify(grades));

    // Display course grades
    displayCourseGrades(grades);
    
    // Display grade history table
    displayGradeHistory(grades);
}

function displayCourseGrades(grades) {
    const courseGradesContainer = document.getElementById('courseGrades');
    if (!courseGradesContainer) return;

    // Group grades by course
    const gradesByCourse = {};
    grades.forEach(grade => {
        if (!gradesByCourse[grade.course]) {
            gradesByCourse[grade.course] = [];
        }
        gradesByCourse[grade.course].push(grade);
    });

    courseGradesContainer.innerHTML = '';

    Object.keys(gradesByCourse).forEach(course => {
        const courseGrades = gradesByCourse[course];
        const courseCard = createCourseGradeCard(course, courseGrades);
        courseGradesContainer.appendChild(courseCard);
    });
}

function createCourseGradeCard(course, grades) {
    const card = document.createElement('div');
    card.className = 'course-grade-card';
    
    // Calculate course statistics
    const gradedGrades = grades.filter(g => g.status === 'graded');
    const totalPoints = gradedGrades.reduce((sum, grade) => sum + grade.score, 0);
    const maxPoints = gradedGrades.reduce((sum, grade) => sum + grade.total, 0);
    const averageGrade = maxPoints > 0 ? (totalPoints / maxPoints * 100).toFixed(1) : 0;
    const letterGrade = getLetterGrade(averageGrade);
    
    card.innerHTML = `
        <div class="course-grade-header">
            <h3>${course}</h3>
            <div class="course-grade-summary">
                <span class="average-grade">${averageGrade}%</span>
                <span class="letter-grade">${letterGrade}</span>
            </div>
        </div>
        <div class="course-grade-details">
            <div class="grade-breakdown">
                ${grades.map(grade => `
                    <div class="grade-item ${grade.status}">
                        <div class="grade-info">
                            <span class="assignment-name">${grade.assignment}</span>
                            <span class="grade-date">${formatDate(grade.date)}</span>
                        </div>
                        <div class="grade-score">
                            <span class="score">${grade.score}/${grade.total}</span>
                            <span class="percentage">${grade.percentage}%</span>
                            <span class="letter-grade">${grade.grade}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    return card;
}

function displayGradeHistory(grades) {
    const tableBody = document.getElementById('gradesTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    grades.forEach(grade => {
        const row = document.createElement('tr');
        row.className = `grade-row ${grade.status}`;
        
        row.innerHTML = `
            <td>${grade.course}</td>
            <td>${grade.assignment}</td>
            <td>${grade.score}/${grade.total}</td>
            <td>
                <span class="grade-badge ${getGradeClass(grade.percentage)}">
                    ${grade.percentage}%
                </span>
            </td>
            <td>${formatDate(grade.date)}</td>
            <td>
                <span class="status-badge ${grade.status}">
                    ${grade.status === 'graded' ? 'Graded' : 'Pending'}
                </span>
            </td>
        `;
        
        row.addEventListener('click', () => viewGradeDetails(grade.id));
        tableBody.appendChild(row);
    });
}

function viewGradeDetails(gradeId) {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const grade = grades.find(g => g.id === gradeId);
    
    if (!grade) return;
    
    const content = document.getElementById('gradeDetailsContent');
    content.innerHTML = `
        <h2>Grade Details</h2>
        <div class="grade-details">
            <div class="detail-row">
                <strong>Course:</strong> ${grade.course}
            </div>
            <div class="detail-row">
                <strong>Assignment:</strong> ${grade.assignment}
            </div>
            <div class="detail-row">
                <strong>Score:</strong> ${grade.score}/${grade.total} (${grade.percentage}%)
            </div>
            <div class="detail-row">
                <strong>Letter Grade:</strong> ${grade.grade}
            </div>
            <div class="detail-row">
                <strong>Date:</strong> ${formatDate(grade.date)}
            </div>
            <div class="detail-row">
                <strong>Status:</strong> 
                <span class="status-badge ${grade.status}">
                    ${grade.status === 'graded' ? 'Graded' : 'Pending'}
                </span>
            </div>
        </div>
        <div class="grade-actions">
            <button class="btn btn-outline" onclick="closeModal('gradeDetailsModal')">
                Close
            </button>
        </div>
    `;
    
    document.getElementById('gradeDetailsModal').style.display = 'block';
}

function calculateSummaryStats() {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const gradedGrades = grades.filter(g => g.status === 'graded');
    
    if (gradedGrades.length === 0) {
        updateSummaryStats(0, 0, 0, 0);
        return;
    }
    
    // Calculate overall GPA (simplified)
    const totalPoints = gradedGrades.reduce((sum, grade) => sum + grade.score, 0);
    const maxPoints = gradedGrades.reduce((sum, grade) => sum + grade.total, 0);
    const averageGrade = maxPoints > 0 ? (totalPoints / maxPoints * 100) : 0;
    const gpa = calculateGPA(gradedGrades);
    const completedCount = gradedGrades.length;
    
    updateSummaryStats(gpa, totalPoints, averageGrade, completedCount);
}

function calculateGPA(grades) {
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
    
    return grades.length > 0 ? (totalPoints / grades.length).toFixed(1) : 0;
}

function updateSummaryStats(gpa, totalPoints, averageGrade, completedCount) {
    const gpaElement = document.getElementById('overallGPA');
    const pointsElement = document.getElementById('totalPoints');
    const averageElement = document.getElementById('averageGrade');
    const completedElement = document.getElementById('completedAssignments');
    
    if (gpaElement) gpaElement.textContent = gpa;
    if (pointsElement) pointsElement.textContent = totalPoints.toLocaleString();
    if (averageElement) averageElement.textContent = `${averageGrade.toFixed(1)}%`;
    if (completedElement) completedElement.textContent = completedCount;
}

function getLetterGrade(percentage) {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 65) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
}

function getGradeClass(percentage) {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'satisfactory';
    if (percentage >= 60) return 'passing';
    return 'failing';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function filterGrades(course) {
    const buttons = document.querySelectorAll('.filter-buttons .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const gradeRows = document.querySelectorAll('.grade-row');
    const courseCards = document.querySelectorAll('.course-grade-card');
    
    if (course === 'all') {
        gradeRows.forEach(row => row.style.display = 'table-row');
        courseCards.forEach(card => card.style.display = 'block');
    } else {
        gradeRows.forEach(row => {
            const courseCell = row.querySelector('td:first-child');
            row.style.display = courseCell && courseCell.textContent === course ? 'table-row' : 'none';
        });
        courseCards.forEach(card => {
            const courseTitle = card.querySelector('h3');
            card.style.display = courseTitle && courseTitle.textContent === course ? 'block' : 'none';
        });
    }
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
