const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { User } = require('./models/User.model');
const session = require('express-session');
const { checkAuth } = require('./middleware/auth');

const Router = express.Router();
const PORT = 4321;
const headers = { 'Content-Type': 'text/html; charset=utf-8' };
const app = express();

Router
  .route('/')
  .get((req, res) => {
    res.end('Привет мир!');
  });

app
  .use((req, res, next) => {
    res
      .status(200)
      .set(headers) && next();
  })
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
  }))
  .use('/', Router)
  .post('/login/check/', async r => {
    const { body: { login } } = r;
    const user = await User.findOne({ login });
    if (user) {
      if (user.password === r.body.pass) {
        r.session.auth = 'ok';
        r.session.login = login;
        r.res.send('Вы авторизованы. Доступен закрытый маршрут!');
      } else {
        r.res.send('Неверный пароль!');
      }
    } else {
      r.res.send('Нет такого пользователя!');
    }
  })
  .get('/logout', r => {
    r.session.destroy();
    r.res.send('Сессия завершена, выполните вход.')
  })
  .get('/profile', checkAuth, r => {
    r.res.send(r.session.login);
  })
  .get('/users', checkAuth, async r => {
    const users = await User.find();
    r.res.render('users', { users });
  })
  .use('/login', (req, res) => {
    res.render('login');
  })
  .use((req, res) => {
    res
      .status(404)
      .set(headers)
      .send('Пока нет!');
  })
  .use((e, req, res, n) => {
    res
      .status(500)
      .set(headers)
      .send(`Ошибка: ${e}`);
  })
  .set('view engine', 'pug')
  .set('x-powered-by', false);

module.exports = http.createServer(app)
  .listen(process.env.PORT || PORT, () => console.log(process.pid));
