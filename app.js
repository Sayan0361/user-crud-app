const express = require('express');
const app = express();
const PORT = 5000;
const path = require('path');
const userModel = require('./models/user'); // Import the user model

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

// Routes
app.get('/', (req, res) => {
    res.render('index',{ title: 'Home' });
});

app.get('/read', async (req, res) => {
    // Delete all documents inside the userModel collection
    // await userModel.deleteMany({});
    // console.log('Deleted all users');
  
    // Fetch the updated list (should be empty)
    let allUsers = await userModel.find();
    console.log(allUsers);
    res.render('read', { users: allUsers, title: 'Read Users' });
  });

app.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    userModel.findByIdAndDelete(id)
        .then(() => {
            console.log('User Deleted : ' + id);
            res.redirect('/read');
        })
        .catch(err => {
            console.error('Error deleting user:', err);
            res.status(500).send('Internal Server Error');
        });
})

app.post('/create', async (req,res)=>{
    let {name, email, imageurl} = req.body;
    let createdUser = await userModel.create({
        name,
        email,
        imageurl
    })
    console.log('User Created : ' + createdUser);
    res.redirect('/read');
})

// Show edit form
app.get('/edit/:id', async (req, res) => {
    try {
        let user = await userModel.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.render('edit', { user, title: 'Update User' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Handle update submission
app.post('/update/:id', async (req, res) => {
    try {
        const { name, email, imageurl } = req.body;
        let updatedUser = await userModel.findByIdAndUpdate(req.params.id, { name, email, imageurl }, { new: true });
        if (!updatedUser) return res.status(404).send('User not found');
        console.log('User Updated:', updatedUser);
        res.redirect('/read');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
