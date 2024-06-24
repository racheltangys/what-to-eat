document.addEventListener('DOMContentLoaded', function() {
    // Select all recipe card divs
    const recipeCards = document.querySelectorAll('.recipe-tile');

    // Add click event listener to each recipe card
    recipeCards.forEach(function(card, index) {
        card.addEventListener('click', function() {

            // Extract the recipe ID or any other relevant data from the clicked card
            const recipeId = card.id

            // Construct the URL based on the extracted data
            const url = `/recipe-card?id=${recipeId}`;

            // Redirect to the constructed URL
            window.location.href = url;
        });
    });
});

// Mobile Functions

document.getElementById('menu-icon').addEventListener('click', function() {
    
    const navLinks = document.getElementById('mobile-nav');
    
    if (navLinks.style.display === 'grid') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'grid';
    }
});