
//These are all of the NPM packages
const express = require('express');
const fs = require('fs');
const path = require('path');

//This UUIDv4 package allows a unique ID to be applide with the uuidv4() function
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

//Allows us to use our css and index.js files
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//This GET lands us on the index.html when we first load the page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//This GET pulls the notes.html where we can input new notes and view saved notes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

//This GET allows us to dynamically read the db.json file. The JSON.parse line is added so that we can read the a file every time it is changed. I initially tried declaring this as a constant up top, but that caused the db.json to only be read once. 
app.get('/api/notes', (req, res) => {
  res.json(JSON.parse(fs.readFileSync("./db/db.json", "utf8")))
});

//This POST saves a new note to the json file
app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received!`);
  const { title, text, id } = req.body;


  const newNote = {
    title,
    text,
    id: uuidv4(),
  }

//First we read the json file so we can convert it to a string an add to it. 
  fs.readFile('./db/db.json', 'utf-8', (err, noteString) => {
    if (err) {
      return res.send("CRITICAL ERROR WITH FILE SYSTEM, SELF DISTRUCT IN 5 SECONDS")
    }

    let readNotes = JSON.parse(noteString);
    //This adds the new note to json array.
    readNotes.push(newNote)

    //This write file happens within the read file so that we don't accidently overwrite the json file unintentionally. 
    fs.writeFile(`./db/db.json`, JSON.stringify(readNotes), (err) => {
      err
        ? console.error(err)
        : console.log(
          `New note successfully added!` 
        );
        res.json(readNotes)
    })
  })
})

//This DELETE removes a selected note when the trash can is clicked. 
 app.delete('/api/notes/:id', (req, res) => {

   //This stores the ID of the item clicked as noteId.
   let noteId = req.params.id;

   //This reads the database so that we have something to compare to. 
   let db = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

  //This for loop cycles through the database comparing ids. When it finds a match, it splices off that item and removes it from the array. 
   for (let i = 0; i < db.length; i++){
     if (noteId === db[i].id){
       db.splice([i], 1)

      //This writes the new file with the removed note. 
      fs.writeFile(`./db/db.json`, JSON.stringify(db), (err) => {
        err
          ? console.error(err)
          : console.log(
            `New note successfully added!` 
          );
          res.json(db)
      })
     }
   }
   
 })

 //This GET returns us to index.html if something is entered into the URL that isn't already referenced. It's placed at the bottom so that it doesn't overried our other GETs. 
 app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () =>
  console.log(`Express is litening to your fine, fine code at port ${PORT}!`)
);


