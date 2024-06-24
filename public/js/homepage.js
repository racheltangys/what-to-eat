// Get the addButton element
const addButton = document.querySelector('.button#add');
const moreIngredientsButton = document.querySelector('#more-ingredients');
const submitAddIngredientsButton = document.querySelector('#submit-add-ingredients');
const pantryBox = document.getElementById('pantry-box');
const navHomeButton = document.getElementById('nav-bar-home');
let pantryItem = [];

// Function to format ingredient
function textCleanup(inputText) {
    // Lowercase the string
    const lowerCaseText = inputText.toLowerCase();

    // Uppercase the first letter
    const formattedText = lowerCaseText.charAt(0).toUpperCase() + lowerCaseText.slice(1);

    return formattedText;
}

moreIngredientsButton.addEventListener('click', function() {
    event.preventDefault();

    const pantryDiv = document.getElementById('pantry');
    pantryDiv.style.display = 'none';

    const addIngredientsDiv = document.getElementById('add-ingredients');
    addIngredientsDiv.style.display = 'block';
});

// Add a click event listener to the addButton
addButton.addEventListener('click', function() {
    // Get the value of the ingredient input
    const ingredientValue = document.getElementById('pantry-add-ingredient').value;
    const category = document.getElementById('category').value;
    
    // Save values into pantryItem object
    let newPantryItem = {
        category: category,
        ingredient: textCleanup(ingredientValue)
    };

    pantryItem.push(newPantryItem);

    // Clear the input text
    document.getElementById('pantry-add-ingredient').value = '';       
    
    // Get pantry-box element
    const pantryBox = document.getElementById('pantry-box');
    pantryBox.innerHTML = '';

    pantryItem.forEach(function(item) {

        // Create a container div for checkbox and label
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        // Create the remove button
        const button = document.createElement('button');
        button.className = "button remove";
        button.id = item.ingredient.toLowerCase();
        button.innerText = 'X';

        // Create the label
        const label = document.createElement('label');
        label.htmlFor = item.ingredient.toLowerCase();
        label.className = 'pantry-box-items';
        label.textContent = item.ingredient;

        // Append checkbox and label to the container div
        itemDiv.appendChild(button);
        itemDiv.appendChild(label);

        // Append the container div to the pantry-box
        pantryBox.appendChild(itemDiv);

    console.log(pantryItem)
    });

});

// Remove ingredient from pantry box
document.addEventListener('click', function(event) {
    console.log(pantryItem);

    const target = event.target;
    if (target.classList.contains('remove')) {
        const buttonId = target.id;
        
        // reiterate pantry-box
        pantryBox.innerHTML = ''
        pantryItem = pantryItem.filter(item => item.ingredient.toLowerCase() !== buttonId);

        pantryItem.forEach(function(item) {
      
            // Create a container div for checkbox and label
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';

            // Create the remove button
            const button = document.createElement('button');
            button.className = "button remove";
            button.id = item.ingredient.toLowerCase();
            button.innerText = 'X';

            // Create the label
            const label = document.createElement('label');
            label.htmlFor = item.ingredient.toLowerCase();
            label.className = 'pantry-box-items';
            label.textContent = item.ingredient;

            // Append checkbox and label to the container div
            itemDiv.appendChild(button);
            itemDiv.appendChild(label);

            // Append the container div to the pantry-box
            pantryBox.appendChild(itemDiv);
      
        });
    };
});

submitAddIngredientsButton.addEventListener('click', function() {
    const pantryDiv = document.getElementById('pantry');
    pantryDiv.style.display = 'flex';

    const addIngredientsDiv = document.getElementById('add-ingredients');
    addIngredientsDiv.style.display = 'none';

    // Retrieve object from local storage
    let pantry = JSON.parse(localStorage.getItem('pantry')) || { items: [] };

    // Ensure pantry.items is an array
    if (!Array.isArray(pantry.items)) {
        pantry.items = [];
    }

    // Add unique pairs from pantryItem to the pantry
    pantryItem.forEach(function(item) {
        if (!pantry.items.some(p => p.category === item.category && p.ingredient === item.ingredient)) {
            pantry.items.push(item);
        }
    });

    // Save submitted ingredients into local storage
    localStorage.setItem('pantry', JSON.stringify(pantry));

    // Remove items in pantryItem object so that it doesn't show in box
    pantryItem = [];
    pantryBox.innerHTML = '';

    // Reflect pantry into Homepage
    pantry.items.forEach(function(item) {
        const category = item.category;
        const ingredient = item.ingredient;

        const categoryElement = document.querySelector(`.checkboxes#${category}`);

        const divContainer = document.createElement('div')

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = category;
        input.name = ingredient.toLowerCase();

        const label = document.createElement('label');
        label.textContent = ingredient

        divContainer.appendChild(input);
        divContainer.appendChild(label);
        categoryElement.appendChild(divContainer);
    })
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

