

document.addEventListener("DOMContentLoaded", function(){
  console.log("LOADED")
  const usersContainer = document.getElementById('users-container')
  const notesContainer = document.getElementById('notes-container')
  const newNoteForm = document.getElementById('new-note-form')

  let users = fetch('http://localhost:3000/api/v1/users').then(res => res.json())
  let notes = fetch('http://localhost:3000/api/v1/notes').then(res => res.json())


  newNoteForm.addEventListener('submit', createNewNote)

  function createNewNote(event) {
    event.preventDefault()
    const title = document.getElementById('new-note-title').value
    const body = document.getElementById('new-note-body').value
    fetch('http://localhost:3000/api/v1/notes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `${title}`,
        body: `${body}`,
        user_id: 1})
    }).then(res => res.json()).then(json => {
      let noteDiv = document.createElement('div')
      noteDiv.addEventListener('click', function(event){
        if (event.target.innerText === json.title) {
          let noteP = document.createElement('p')
          noteP.innerText = json.body
          event.target.parentNode.append(noteP)
        }
      })
      noteDiv.innerHTML += `<h3>${json.title}</h3>`
      notesContainer.append(noteDiv)
    })
  }

  function renderNotes() {
  notesContainer.innerHTML = `<h1>Notes</h1>`
    notes.then(json => {
      console.log(json)
      json.forEach(note => {
        let noteDiv = document.createElement('div')
        noteDiv.addEventListener('click', viewNote)
        noteDiv.innerHTML += `<h3>${note.title}</h3>`
        notesContainer.append(noteDiv)
      })
    })
  }

  function viewNote(event) {
    // debugger
    if (event.target.parentNode.children.length <= 1) {
      notes.then(json => {
        json.forEach(note => {
          if (event.target.innerText === note.title) {
            let noteP = document.createElement('p')
            let deleteButton = document.createElement('button')
            deleteButton.class = 'deleteNote'
            deleteButton.innerText = "Delete"
            deleteButton.addEventListener('click', deleteTheNote)
            let editButton = document.createElement('button')
            editButton.class = 'editNote'
            editButton.innerText = 'Edit'
            editButton.addEventListener('click', editTheNote)
            noteP.innerText = note.body
            event.target.parentNode.append(noteP, editButton, deleteButton)
          }
        })
      })
    }
  }

    function deleteTheNote(event) {
      alert("About to Delete!!!")
      const noteTitle = event.target.parentNode.children[0].innerText
      notes.then(json => {
        json.forEach(note => {
          if (noteTitle === note.title) {
            event.target.parentNode.remove()
            fetch(`http://localhost:3000/api/v1/notes/${note.id}`, {
              method: "DELETE"
            })
          }
        })
      })
    }

    function editTheNote(event) {
      let userInput = prompt("Please enter new note content", "something something something")
      event.target.parentNode.children[1].innerText = userInput
      const noteTitle = event.target.parentNode.children[0].innerText
      notes.then(json => {
        json.forEach(note => {
          if (noteTitle === note.title) {
            fetch(`http://localhost:3000/api/v1/notes/${note.id}`, {
              method: "PATCH",
              headers: {
                'content-type': 'application/json'
              },
              mode: 'cors',
              body: JSON.stringify({
                body: userInput
              })
            })
          }
        })
      })
    }



  // renderUsers()
  renderNotes()
})
