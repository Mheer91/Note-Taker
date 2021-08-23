const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/api/notes', (req, res) => res.json(notes));

app.post('/api/notes/', (req, res) => {

const {title, text, noteID} = req.body;

  if(req.params.noteID){
    console.log(`${req.noteID}`)
  }
});


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });


app.listen(PORT, () =>
  console.log(`Being my dad on port ${PORT}!`)
);

     
// cd Documents/GitHub/Note-Taker/Develop