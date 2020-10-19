const checkAuth = (req, res, next) => {
  if (req.session.auth === 'ok') {
    next();
  } else {
    res.redirect('/login')
  }
};

module.exports = {
  checkAuth
}
