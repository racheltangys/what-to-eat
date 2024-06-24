// Mobile Functions

document.getElementById('menu-icon').addEventListener('click', function() {
    
    const navLinks = document.getElementById('mobile-nav');
    
    if (navLinks.style.display === 'grid') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'grid';
    }
});