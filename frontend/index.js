function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded and parsed");

  const BASE_URL = "http://localhost:3000/api/v1"
  const USER_ID = 1

  let notesContainer = document.getElementById("notes-container")
  let noteDetail = document.getElementById('note-detail')

  notesContainer.addEventListener('click', function(event) {
    if (event.target.tagName === "H3") {
      let noteId = parseInt(event.target.dataset.id)

      getNote(noteId) // fetch request for note json
      .then(json => {
        noteDetail.innerHTML = `<h2>${json.title}</h2><p>${json.body}</p>`
        addEditDeleteBtns(json)
      })
    }
  })

  let getUserNotes = (userId) => {
    return fetch(`${BASE_URL}/users/${userId}`)
    .then( res => res.json())
  }

  let addEditDeleteBtns = (json) => {
    noteDetail.innerHTML = `<h2>${json.title}</h2><p>${json.body}</p>`

    let deleteBtn = document.createElement('button')
    deleteBtn.innerText = "Delete Post"
    deleteBtn.dataset.id = json.id
    deleteBtn.addEventListener('click', function(event) {
      deleteNote(this.dataset.id)
    })

    let editBtn = document.createElement('button')
    editBtn.innerText = "Edit Post"
    editBtn.dataset.id = json.id
    editBtn.addEventListener('click', function(event) {
      editForm(this.dataset.id)
    })

    noteDetail.append(deleteBtn)
    noteDetail.innerHTML += "<br>"
    noteDetail.append(editBtn)
  }

  let displayTopper = (json) => {
    let username = document.getElementById('username')
    setAttributes(username, {"data-id": json.id, "name": json.name})
    username.innerText = json.name
    let newBtn = document.createElement('button')
    setAttributes(newBtn, {"id": "new-post", "type": "button", "name": "button"})
    newBtn.innerText = "New Post"
    newBtn.addEventListener('click', function() {
      newForm(USER_ID)
    })
    username.append(newBtn)
  }

  let displayNotes = ({notes}) => { // (notes) vs ({notes}). ({notes}) is looking for "notes" key in the passed in argument
    console.log(notes)
    notes.forEach(noteData => {
      let noteLi = document.createElement('div')
      noteLi.innerHTML = `<h3 data-id=${noteData.id}>${noteData.title}</h3><p>${noteData.body.slice(0, 30)}<p>`
      notesContainer.append(noteLi)
    })
  }

  let getNote = (noteId) => {
    return fetch(`${BASE_URL}/notes/${noteId}`)
    .then( res => res.json() )
  }

  let newForm = (userId) => {
    let notesContainer = document.getElementById("notes-container")
    let createBtn = document.createElement('button')
    createBtn.innerText = "Create Post"
    let newPostTitle = document.createElement('input')
    let newPostBody = document.createElement('textarea')
    setAttributes(newPostTitle, {"class": "form-input"})
    setAttributes(newPostBody, {"class": "form-textarea"})
    noteDetail.innerHTML = ""
    noteDetail.append(newPostTitle)
    noteDetail.innerHTML += "<br>"
    noteDetail.append(newPostBody)
    noteDetail.append(createBtn)
    createBtn.addEventListener('click', function() {
      newPost()
    })
  }

  let newPost = (userId) => {
    let noteDetail = document.getElementById('note-detail')
    let postTitle = noteDetail.querySelector('input').value
    let postBody = noteDetail.querySelector('textarea').value
    let id = parseInt(document.getElementById('username').dataset.id)
    let name = document.getElementById('username').attributes.name.value

    let body = {
      title: postTitle,
      body: postBody,
      user_id: id
    }
    fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then( res => res.json() )
    .then( json => {
      let noteLi = document.createElement('div')
      noteLi.innerHTML = `<h3 data-id=${json.id}>${json.title}</h3><p>${json.body.slice(0, 30)}<p>`
      notesContainer.append(noteLi)
      noteDetail.innerHTML = `<h2>${json.title}</h2><p>${json.body}</p>`
    })
  }

  let deleteNote = (noteId) => {
    return fetch(`${BASE_URL}/notes/${noteId}`, {
      method: "DELETE"
    })
  }

  let editForm = (noteId) => {
    let noteDetail = document.getElementById('note-detail')

    let updateBtn = document.createElement('button')
    updateBtn.innerText = "Update Post"
    updateBtn.addEventListener('click', function(event) {
      editNote(noteId)
    })

    let editPostTitle = document.createElement('input')
    let editPostBody = document.createElement('textarea')
    setAttributes(editPostTitle, {"class": "form-input", "value": event.target.parentNode.querySelector('h2').innerText})
    setAttributes(editPostBody, {"class": "form-textarea"})
    editPostBody.value = event.target.parentNode.querySelector('p').innerText

    noteDetail.innerHTML = ""
    noteDetail.append(editPostTitle)
    noteDetail.innerHTML += "<br>"
    noteDetail.append(editPostBody)
    noteDetail.append(updateBtn)
  }

  let editNote = (noteId) => {
    let noteDetail = document.getElementById('note-detail')
    let postTitle = noteDetail.querySelector('input').value
    let postBody = noteDetail.querySelector('textarea').value
    let body = {
      title: postTitle,
      body: postBody
    }
    return fetch(`${BASE_URL}/notes/${noteId}`, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then( res => res.json())
    .then( json => {
      document.querySelector(`[data-id='${json.id}']`).innerText = json.title
      document.querySelector(`[data-id='${json.id}']`).nextSibling.innerText = json.body.slice(0, 30)
      let noteId = parseInt(document.querySelector(`[data-id="${json.id}"]`).dataset.id)

      getNote(noteId)
      .then(json => {
        noteDetail.innerHTML = `<h2>${json.title}</h2><p>${json.body}</p>`
        addEditDeleteBtns(json)
      })
    })
  }

//////////////////////////////// RUN

  getUserNotes(USER_ID)
    .then( json => {
      displayTopper(json)
      displayNotes(json) // json argument has "notes" key. Otherwise we can pass (json.notes)
    })
})
