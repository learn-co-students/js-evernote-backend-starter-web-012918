let postList = document.getElementById('posts')
let postContent = document.getElementById('post-content')
let form = document.getElementById('createPost')

document.addEventListener("DOMContentLoaded", function(){

  function getAllPosts(){
    fetch('http://localhost:3000/api/v1/notes')
    .then(guy => guy.json())
    .then(json => renderPosts(json))
  }

  function renderPosts(json){
    postList.innerText = ''
    json.forEach(function(element){
      console.log(element)
      let listItem = document.createElement('li')
      listItem.id = `li-${element.id}`
      listItem.innerText = element.title
      listItem.addEventListener('click', getPost)
      postList.append(listItem)
    })
  }

  function getPost(){
    let postId = parseInt(this.id.slice(3))
    fetch(`http://localhost:3000/api/v1/notes/${postId}`)
    .then(guy => guy.json())
    .then(json => showPost(json))
  }

  function showPost(json){
    let postItem = document.createElement('li')
    let postUser = document.createElement('h3')
    let deleteButton = document.createElement('button')
    let postId = json.id

    deleteButton.innerText = "Delete"
    deleteButton.id = `del-${postId}`
    deleteButton.addEventListener('click', deletePost)
    postItem.innerText = json.body
    // postUser.innerText = json.user.name
    postContent.innerText = ""
    postContent.append(postUser)
    postContent.append(postItem)
    postContent.append(deleteButton)
  }

  function deletePost(e){
    let postId = parseInt(e.target.id.slice(4))
    fetch('http://localhost:3000/api/v1/notes/'+postId,{
      method: "DELETE"
    })
    .then(guy => {
      postContent.innerHTML = ""
      getAllPosts()
    })
  }

  function createPost(e){
    e.preventDefault()
    let postTitle = document.getElementById('title').value
    let postContent = document.getElementById('content').value
    let postUser = 1
    let newPost = {title : postTitle, body : postContent, user_id : postUser }
    fetch('http://localhost:3000/api/v1/notes',{
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(() => getAllPosts())
  }

  form.addEventListener('submit', createPost)


  getAllPosts()


})
