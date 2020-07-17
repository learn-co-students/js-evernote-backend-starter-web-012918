### Project Description

We will be making an Evernote clone!  Fork and `clone` this repo, and follow the requirements below to get started:

---

### Running the Server

This project uses a Rails backend as a JSON API. That means that the server will **respond** with JSON by default whenever you send an HTTP request.

The models, controllers, and routes are already setup for you. Run the following commands to get started:

- `$ cd server` to change to the server directory
- `$ bundle install`
- `$ rails db:migrate && rails db:seed`
- `$ rails s`

Navigate to http://localhost:3000/rails/info/routes to see the routes available

Some user data has already been seeded for you! Navigate to http://localhost:3000/api/v1/users/1 in your browser and take a look!

When sending an HTTP POST request to create a new note, send your request to http://localhost:3000/api/v1/notes

Don't forget to include a `body`, `title`, and `user_id` in the body of your request. **Notes `belong_to` users**. Remember associations? Don't forget to include a foreign key here!

You'll also want to include the proper headers in your `fetch` requests:

```js
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

---

### Project Requirements
1. You will be developing the HTML/CSS/JS front-end to support a pre-defined Rails API backend. (This repo provides you with a starter back end to work with.) The domain model consists of Users and Notes. Each user has many notes.
2. The Frontend and Backend will live in two separate repositories. All interactions between the client and the server should be handled asynchronously (Ajax / fetch).
3. The application should support:
    * 1. Listing all of a user's notes on a sidebar -->  For now, only create one user.  There will be no log in.
    * 2. When a user clicks on a note "preview" in the sidebar, the full note body and any other details of the currently selected note should show on the page.  
    3. Allow users to create, edit and delete notes.

    * //create
    //edit
    * //delete

    4. Feel free to add on your own features if you have built all of the above!  Some ideas:  You could add filter or search functionality, multiple users, or support for rich format (bold, italic, etc) when creating a note.
4. **You may not use authentication or authorization. This means no user log in**. We'll look at patterns for dealing with client-side auth later in the semester, so you'll have plenty of time to deal with this case.
