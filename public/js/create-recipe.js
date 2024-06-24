// Get the addButton element
const addButton = document.getElementById('add-ingredient');
const ingredientBox = document.getElementById('ingredient-box');
let ingredient = [];

let uploadButton = document.getElementById("upload-button");
let chosenImage = document.getElementById("chosen-image");
let fileName = document.getElementById("file-name")

// Create text cleanup function
function textCleanup(inputText) {
    const lowerCaseText = inputText.toLowerCase();
    return lowerCaseText.charAt(0).toUpperCase() + lowerCaseText.slice(1);
}

// Add ingredient
function addIngredient() {
    const measureValue = document.getElementById('journal-measure').value;
    const ingredientValue = document.getElementById('journal-ingredient').value;

    let newIngredient = {
        measure: measureValue,
        ingredient: textCleanup(ingredientValue)
    };

    ingredient.push(newIngredient);

    document.getElementById('journal-measure').value = '';
    document.getElementById('journal-ingredient').value = '';

    renderIngredients();
}

// Render ingredients
function renderIngredients() {
    ingredientBox.innerHTML = '';

    ingredient.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.id = index;

        const divButton = document.createElement('div')
        divButton.className = "create-recipe-buttons";

        const editButton = document.createElement('button');
        editButton.className = "button x-small edit";
        editButton.id = index;
        editButton.innerText = '✐';

        const removeButton = document.createElement('button');
        removeButton.className = "button x-small remove";
        removeButton.id = index;
        removeButton.innerText = 'x';

        const measureLabel = document.createElement('label');
        measureLabel.className = 'ingredient-box-item-measure';
        measureLabel.name = `strMeasure${index+1}`;
        measureLabel.id = index;
        measureLabel.innerText = item.measure;

        const ingredientLabel = document.createElement('label');
        ingredientLabel.className = 'ingredient-box-item-ingredient';
        ingredientLabel.name = `strIngredient${index+1}`;
        ingredientLabel.id = index;
        ingredientLabel.innerText = item.ingredient;

        divButton.appendChild(editButton);
        divButton.appendChild(removeButton);
        itemDiv.appendChild(divButton);
        itemDiv.appendChild(measureLabel);
        itemDiv.appendChild(ingredientLabel);

        ingredientBox.appendChild(itemDiv);
    });
}

// Remove ingredient
function removeIngredient(buttonId) {
    ingredient.splice(buttonId, 1);
    renderIngredients();
}

// Edit ingredient
function editIngredient(buttonId) {
    const ingredientBoxItem = document.querySelector(`.item[id="${buttonId}"]`);
    ingredientBoxItem.innerHTML = '';

    const measureInput = document.createElement('input');
    measureInput.className = "ingredient-box-measure-edit";
    measureInput.id = buttonId;
    measureInput.value = ingredient[buttonId].measure;

    const ingredientInput = document.createElement('input');
    ingredientInput.className = "ingredient-box-ingredient-edit";
    ingredientInput.id = buttonId;
    ingredientInput.value = ingredient[buttonId].ingredient;

    const doneButton = document.createElement('button');
    doneButton.className = "button small done-edit-ingredient";
    doneButton.id = buttonId;
    doneButton.innerText = "Done";

    ingredientBoxItem.appendChild(measureInput);
    ingredientBoxItem.appendChild(ingredientInput);
    ingredientBoxItem.appendChild(doneButton);
}

// Done editing ingredient
function doneEditIngredient(buttonId) {
    const measureValue = document.querySelector(`.ingredient-box-measure-edit[id="${buttonId}"]`).value;
    const ingredientValue = document.querySelector(`.ingredient-box-ingredient-edit[id="${buttonId}"]`).value;

    ingredient[buttonId].measure = measureValue;
    ingredient[buttonId].ingredient = ingredientValue;

    renderIngredients();
}

// Submit Data to API
function postDataApi() {

    event.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = {
        strMeal: formData.get(strMeal),
        strInstructions: formData.get(strMeal)
    }

    console.log(ingredient);
}

// Upload Picture
uploadButton.addEventListener('change', function() {
    let reader = new FileReader();
    reader.readAsDataURL(uploadButton.files[0]);
    reader.onload = function() {
        chosenImage.setAttribute("src", reader.result);
    }
    fileName.textContent = uploadButton.files[0].name;
});

// Event listeners
addButton.addEventListener('click', addIngredient);

document.addEventListener('click', function (event) {
    const target = event.target;

    if (target.classList.contains('remove')) {
        removeIngredient(target.id);
    }

    if (target.classList.contains('edit')) {
        editIngredient(target.id);
    }

    if (target.classList.contains('done-edit-ingredient')) {
        doneEditIngredient(target.id);
    }
});

// Save recipe to DB
document.getElementById('create-recipe').addEventListener('submit', function(event) {
    
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get form data
    const formData = new FormData(this);

    const data = {
        strMeal: formData.get('strMeal'),
        strInstructions: formData.get('strInstructions')
    };

    // Get Ingredient
    ingredient.forEach((item, index) => {
        data[`strMeasure${index+1}`] = item.measure;
        data[`strIngredient${index+1}`] = item.ingredient;
    });
            
    // Post data to API
    fetch('http://localhost:4000/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });

});

uploadButton.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(uploadButton.files[0]);
    reader.onload = () => {
        chosenImage.setAttribute("src", reader.result);
    }
    fileName.textContent = uploadButton.files[0].name;
}

// Mobile Functions

document.getElementById('menu-icon').addEventListener('click', function() {
    
    const navLinks = document.getElementById('mobile-nav');
    
    if (navLinks.style.display === 'grid') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'grid';
    }
});