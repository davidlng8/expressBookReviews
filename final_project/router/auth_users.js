import { Router } from 'express';
import jwt from 'jsonwebtoken';
import books from './booksdb.js';
const regd_users = Router();

let users = [];

const isValid = (username) => {
  const userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  console.log(users, validusers);
  if (validusers.length > 0) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('here: ', username, password);
  if (!username || !password || isValid(username)) {
    return res.status(404).json({ message: 'Error logging in' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: { username, password },
      },
      'access',
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send('User successfully logged in');
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    const { stars, text } = req.body;
    const { username } = req.user.data;
    book.reviews[username] = { stars, text };
    return res.status(200).json({ msg: 'Thanks for your review' });
  }
  return res.status(404).json({ msg: 'no book found' });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    const { username } = req.user.data;
    if (book.reviews[username]) {
      delete book.reviews[username];
      return res.status(200).json({ msg: 'Your review was deleted' });
    }
    return res.status(400).json({ msg: `No review for you to delete` });
  }
  return res.status(404).json({ msg: 'no book found' });
});

export const authenticated = regd_users;
const _isValid = isValid;
export { _isValid as isValid };
const _users = users;
export { _users as users };
