import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import { authenticated as customer_routes } from './router/auth_users.js';
import { general as genl_routes } from './router/general.js';

const app = express();

app.use(json());
app.use(
  '/customer',
  session({
    secret: 'fingerprint_customer',
    resave: true,
    saveUninitialized: true,
  })
);

app.use('/customer/auth/*', function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization.accessToken;
    jwt.verify(token, 'access', (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: 'User not authenticated' });
      }
    });
  } else {
    return res.status(403).json({ message: 'User not logged in' });
  }
});

const PORT = 5050;

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log('Server is running'));
