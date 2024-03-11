import { Router } from 'express';
import books from './booksdb.js';
import { isValid } from './auth_users.js';
import { users } from './auth_users.js';
const public_users = Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      return res.status(400).json({ msg: 'username already exists' });
    }
    users.push({ username, password });
    return res.status(200).json({ msg: 'User successfully registered' });
  }
  return res.status(400).json({ msg: 'bad data submission' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const book = books[req.params.isbn];
  if (book) {
    res.status(200).json(book);
  }

  res.status(404).json({ msg: 'book not found' });
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const bookList = Object.values(books).filter(
    (bk) => bk.author == req.params.author
  );
  if (bookList && bookList.length > 0) {
    return res.status(200).json(bookList);
  }
  return res
    .status(404)
    .json({ msg: `No books found for ${req.params.author}` });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const bookList = Object.values(books).filter(
    (bk) => bk.title == req.params.title
  );
  if (bookList && bookList.length > 0) {
    return res.status(200).json(bookList);
  }
  return res
    .status(404)
    .json({ msg: `No books found for ${req.params.title}` });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const book = books[req.params.isbn];
  if (book && Object.keys(book.reviews).length > 0) {
    res.status(200).json({ reviews: book.reviews });
  }

  res.status(404).json({ msg: 'No reviews found' });
});

export const general = public_users;
