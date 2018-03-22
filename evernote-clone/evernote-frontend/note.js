class Note{

  constructor(title, body, id){
    this.title = title
    this.body = body
    this.id = id
    this.render()
  }

  render(){
    let sidebar = document.getElementById('notes-container')
    let note = document.createElement('div')
    note.innerHTML =
    `<h3 id="${this.id}">${this.title}</h3>`
    sidebar.append(note)
    note.addEventListener("click", (event) => {
      let mainBody = document.getElementById('main-content')
      mainBody.innerHTML = ""
      let noteBody = document.createElement('div')
      noteBody.innerHTML = `<h3 id="${this.id}">${this.title}</h3><p>${this.body}</p>`
      mainBody.append(noteBody)
      let deleteButton = document.createElement('div')
      deleteButton.innerHTML = `<button id="delete-button">Delete Note</button>`
      let editButton = document.createElement('div')
      editButton.innerHTML = `<button id="edit-button">Edit Note</button>`
      editButton.addEventListener('click', function(event){
      event.preventDefault()
        Note.editNote()
      })
      noteBody.append(editButton)
      noteBody.append(deleteButton)
      deleteButton.addEventListener("click", ()=>this.deleteNote())
    })
  }

  deleteNote(){
    let note = document.getElementById(`${this.id}`)
    let mainContent = document.getElementById('main-content')
    mainContent.innerHTML = ""
    console.log(this.id)
    note.remove()

    fetch(`http://localhost:3000/api/v1/notes/${this.id}`, {
      method: "DELETE"
    })
  }

  static editNote(){
    let mainContent = document.getElementById('main-content')
    let editForm = document.createElement('form')

    editForm.innerHTML = `
    <label for="note-title"></label>
    <input id="edit-note-title" type="text" name="note-title" placeholder="Note Title..."><br>
    <label for="note-body"></label>
    <input id="edit-note-body" type="textarea" name="note-body" placeholder="Note Body..."><br>
    <input id="edit-note-submit" type="submit" value="Make Changes"></input>
    `
    mainContent.append(editForm)

    let editSubmit = document.getElementById('edit-note-submit')
    editSubmit.addEventListener('click', function(event){
      event.preventDefault()
      let id = mainContent.firstChild.firstChild.id
      let title = document.getElementById('edit-note-title')
      let body = document.getElementById('edit-note-body')
      let data = {
        id: id,
        title: title.value,
        body: body.value,
        user_id: 2
      }
      fetch(`http://localhost:3000/api/v1/notes/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "same-origin"
        })
        .then((res) => { return res.json() })
        .then(json => {
          mainContent.innerHTML = ""
          let note = document.getElementById(`${json.id}`).parentNode
          note.innerHTML = `<h3 id="${json.id}">${json.title}</h3>`
          let noteBody = document.createElement('div')
          noteBody.innerHTML = `<h3 id="${json.id}">${json.title}</h3><p>${json.body}</p>`
          mainContent.append(noteBody)
          let deleteButton = document.createElement('div')
          deleteButton.innerHTML = `<button id="delete-button">Delete Note</button>`
          let editButton = document.createElement('div')
          editButton.innerHTML = `<button id="edit-button">Edit Note</button>`
          editButton.addEventListener('click', function(event){
          event.preventDefault()
            Note.editNote()
          })
          noteBody.append(editButton)
          noteBody.append(deleteButton)
          deleteButton.addEventListener("click", function(event){
            event.preventDefault()
            note.remove()
            mainContent.innerHTML = ""
            fetch(`http://localhost:3000/api/v1/notes/${id}`, {
              method: "DELETE"
            })
          })
        })
      })
    }


  static createNote(){
    let notes = document.getElementById('notes-container')
    let id = parseInt(notes.lastChild.lastChild.id) + 1
    let title = document.getElementById('new-note-title')
    let body = document.getElementById('new-note-body')

    let data = {
      id: id,
      title: title.value,
      body: body.value,
      user_id: 2
    }

    fetch("http://localhost:3000/api/v1/notes/",{
      method: "POST",
      headers:{
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(console.log)
    let note = new Note(data.title, data.body,id)
    document.getElementById('new-note-form').reset()
  }
}
