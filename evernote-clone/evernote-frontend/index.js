document.addEventListener("DOMContentLoaded", function(){

  let sidebar = document.getElementById('notes-container')
  sidebar.innerHTML = ""
  let mainBody = document.getElementById('main-content')
  mainBody.innerHTML = ""
  fetch("http://localhost:3000/api/v1/notes")
  .then(res => res.json())
  .then(json => {
    json.forEach(note => {
      console.log(note.title)
      let newNote = new Note(note.title, note.body, note.id)
    })
  })

  let submit = document.getElementById('new-note-submit')
  submit.addEventListener('click', function(event){
  event.preventDefault()
    Note.createNote()
  })
})
