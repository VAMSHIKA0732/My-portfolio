/************************************* toggle icon navbar **********************************************/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
};

/************************************* scroll section active link **********************************************/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    let top = window.scrollY;

    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            let activeLink = document.querySelector(`header nav a[href*='${id}']`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });

    /************************************* Sticky header **********************************************/
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    /************************************* Remove toggle icon and navbar when link clicked **********************************************/
    menuIcon.classList.remove('fa-xmark');
    navbar.classList.remove('active');
};

/************************************* ScrollReveal animations **********************************************/
ScrollReveal({
    distance: '80px',
    duration: 1500,
    delay: 100,
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .card-container, .portfolio-box, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-content', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .card', { interval: 100 });

/************************************* Typed.js effect **********************************************/
const typed = new Typed('.multiple-text', {
    strings: ['CS Student', 'Java Developer', 'Tech Enthusiast'],
    typeSpeed: 60,
    backSpeed: 40,
    backDelay: 1500,
    loop: true
});

/************************************* Particles.js Initialization **********************************************/
particlesJS('particles-js', {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#2dd4bf" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#2dd4bf",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": true, "mode": "grab" },
            "onclick": { "enable": true, "mode": "push" },
            "resize": true
        },
        "modes": {
            "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
            "push": { "particles_nb": 4 }
        }
    },
    "retina_detect": true
});