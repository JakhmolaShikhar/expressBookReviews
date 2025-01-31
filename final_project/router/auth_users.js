const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(404).json({ message: "Error logging in!" });
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: username
    }, 'access', {expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "User successfully logged in.", token: accessToken });
  } else{
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if(books[isbn]){
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).send("review successfully posted");
  } else{
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if(books[isbn] && books[isbn].reviews[username]){
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).send("Review successfully deleted.");
  } else{
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
