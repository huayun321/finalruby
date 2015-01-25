var express = require('express');
var router = express.Router();

/* GET users by name */
router.get('/:username', function(req, res) {
  res.send('respond with a resource');
});

/* sign up */
router.get('/signup', function(req, res) {
    res.send('respond with a resource');
});

/* login */
router.get('/login', function(req, res) {
    res.send('respond with a resource');
});

router.post('/login', function(req, res) {
    res.send('respond with a resource');
});

/* logout */
router.get('/logout', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router;
