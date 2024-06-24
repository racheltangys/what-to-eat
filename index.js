const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

// For uploading picture
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/', // Directory where images will be saved
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image'); // 'image' is the name of the form field
  
// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Middleware to get IP Address
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`Client IP Address: ${ip}`);
    next();
});

app.get('/', (req, res) => {
    res.render("index.ejs");
});

app.get('/recipe', async (req,res) => {

    var ingredients = Object.keys(req.query);
    console.log(ingredients);

    if(ingredients.length === 0) {
      
      const response = await fetch('http://localhost:4000/recipes');
      const data = await response.json();
      var recipes = data;

    } else {

      const query = ingredients.join("+");
      const response = await fetch('http://localhost:4000/recipe-list?q=' + query);
      const data = await response.json();
      var recipes = data;

    };
    
    res.render("recipe-list.ejs", {recipe: recipes})
});

app.get('/recipe-card', async (req, res) => {
    const id = String(req.query.id);

    try {
        const response = await fetch('http://localhost:4000/recipes?id=' + id);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const recipe = data[0];

        // Filter out key-value pairs where value is not null
        const filteredObj = Object.fromEntries(Object.entries(recipe).filter(([key, value]) => value !== null));

        // Filter the keys based on the substrings 'strIngredient' or 'strMeasure'
        const filteredKeys = Object.fromEntries(Object.entries(filteredObj).filter(([key, value]) => key.includes('strIngredient') || key.includes('strMeasure')));

        // Merge Ingredient and Measure
        const numOfIngredients = (Object.keys(filteredKeys).length)/2
        const ingredients = [];

        for (let i = 1; i <= numOfIngredients; i++) {
            const ingredientKey = `strIngredient${i}`;
            const measureKey = `strMeasure${i}`;

            if (filteredKeys[ingredientKey] && filteredKeys[measureKey]) {
                const ingredient = filteredKeys[ingredientKey];
                const measure = filteredKeys[measureKey];
                ingredients.push(`${measure} ${ingredient}`);
            }
        }

        res.render('recipe-card.ejs', { recipe: recipe, ingredients: ingredients });

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        res.status(500).send('Server error');
    }
});

app.get('/create', (req, res) => {
    res.render("create.ejs");
});

// Upload route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.status(400).send({ message: err });
      } else {
        if (req.file == undefined) {
          res.status(400).send({ message: 'No file selected' });
        } else {
          res.send({
            message: 'File uploaded successfully',
            file: `uploads/${req.file.filename}`
          });
        }
      }
    });
  });

app.listen(port, () => {
    console.log('Listening on port ${port}')
});