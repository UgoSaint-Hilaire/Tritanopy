'use strict'
document.getElementById('burger-menu').addEventListener('click', function() {
    var navLinks = document.getElementById('nav-links');
    if (navLinks.style.display === 'block') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'block';
    }
});


window.addEventListener('resize', function() {
    var navLinks = document.getElementById('nav-links');
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex'; 
    } else {
        navLinks.style.display = 'none'; 
    }
});
