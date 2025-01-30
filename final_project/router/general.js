const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const getBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  })
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.params.username;
  const password = req.params.password;

  if(username && password){
    if(!isValid(username)){
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered." })
    } else{
      return res.status(404).json({ message: "User already exists." });
    }
  }
  return res.status(404).json({message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try{
    const bookList = await getBooks();
    res.json(bookList);
  } catch(err) {
    console.error(err);
    res.status(404).json({ message: "Error finding the book"});
  }
  res.send(JSON.stringify(books, null, 4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  getByISBN(req.params.isbn)
  .then(
    result => res.send(result),
    error => res.status(error.status).json({ message: error.message })
  );
  /*
  const ISBN = req.params.isbn;
  if(books[ISBN]){
    return res.json({
      message: "Book Found",
      book: books[ISBN]
    });
  } else{
    return res.status(404).json({ message: "Book not found "});
  }
  return res.status(300).json({message: "Yet to be implemented"}); */
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.author === author))
  .then((filteredBooks) => res.send(filteresBooks));
  /*
  let bookbyAuthor = Object.values(books).filter(book => book.author === author);
  if(bookbyAuthor.length > 0){
    return res.json({
      message: "Book found",
      books: bookbyAuthor
    })
  } else{
    return res.status(404).json({ message: "Book not found." });
  }
  return res.status(300).json({message: "Yet to be implemented"}); */
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.title === title))
  .then((filteredBooks) => res.send(filteredBooks))
  /*
  let bookbyTitle = Object.values(books).filter(book => book.title === title);
  if(bookbyTitle.length > 0){
    return res.json({
      message: "Book found",
      books: bookbyTitle
    })
  } else{
    return res.status(404).json({ message: "Book not found." });
  }
  return res.status(300).json({message: "Yet to be implemented"}); */
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  getBooks()
  .then()
  if(books[ISBN]){
    return res.json({
      message: "Book Found",
      review: books[ISBN].reviews.length > 0 ? books[ISBN].reviews : "No reviews yet."
    });
  } else{
    return res.status(404).json({ message: "Book not found "});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
