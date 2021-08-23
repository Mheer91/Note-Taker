const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => res.json(notes));


app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received to add a review`);
  const { title, text, noteId } = req.body;


  const newNote = {
    title,
    text,
    noteId: uuidv4(),
  }


  fs.readFile('./db/db.json', 'utf-8', (err, noteString) => {
    if (err) {
      return res.send("CRITICAL ERROR WITH FILE SYSTEM, SELF DISTRUCT IN 5 SECONDS")
    }

    let readNotes = JSON.parse(noteString);
    readNotes.push(newNote)
    console.log(readNotes)

    fs.writeFile(`./db/db.json`, JSON.stringify(readNotes), (err) => {
      err
        ? console.error(err)
        : console.log(
          `New note successfully added!` 
        );
    })
    res.json(readNotes)
  })
})





app.listen(PORT, () =>
  console.log(`Express is litening to your fine, fine code at port ${PORT}!`)
);


