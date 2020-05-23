const express = require('express')
const { join } = require('path')
const app = express()

app.use(express.static(join(__dirname, 'public')))

// not included in exp02 sever.js, included in todoapp sever.js example
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//reference todoapp server.js, not included in exp02 sever.js.
app.use(require('./routes/listRoutes.js'))

// not included in todoapp sever.js example
const fs = require('fs')
const { promisify } = require.apply('util')
const wf = promisify(writeFile)
const af = promisify(appendFile)
const rf = promisify(readFile)

let idTracker = 0

//HTML route to return the "index.html" file
app.get('*'), (req, res) => {
  res.sendFile(join(__dirname, "index.html"))
}

//HTML route to return the "notes.html" file
app.get('/notes'), (req, res) => {
  res.sendFile(join(__dirname, "notes.html"))
}

// route to read the notes stored in the db.json file and display the notes in json format
// use db.query for reading db.json file
app.get('/api/notes', (req, res) => {
  rf('db/db.json', 'utf-8')
    .then(notesList => {
      notesList = JSON.parse(notesList)
    })
  res.json(notesList)
})
  .catch(err => console.error(err))

// receives a new note to save on the request body, adds it to the db.json file, and then returns the new note to the client.
app.post('/api/notes', (req, res) => {
  let { title, text } = req.body
  let newNote = { title, text, id: idTracker }
  idTracker++
  rf('db/db.json', 'utf-8')
    .then(notesList => {
      notesList = JSON.parse(notesList)
      notesList.push(newNote)
      wf('/db/db.json', 'notesList')
    })
    .catch(err => console.error(err))

  app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id
    console.log(id)
    rf('/db/db.json', 'utf-8')
      .then(notesList => {
        notesList = JSON.parse(notesList)
        let filteredNotes = notesList.splice(id, 1)
        wf('/db/db.json', filteredNotes)
      })
      .catch(err => console.error(err))

    app.listen(process.env.PORT || 3000, () => console.log('http://localhost:3000'))


