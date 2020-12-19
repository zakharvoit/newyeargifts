var express = require('express');
var router = express.Router();

const participants = [
    'Захар',
    'Лиза',
    'Костя',
    'Тася',
    'Антон',
    'Вика',
    'Роман',
    'Настя',
    'Сергей',
    'Света',
  ];

const forbidden = {
  'Захар': 'Лиза',
  'Лиза': 'Захар',
  'Костя': 'Тася',
  'Тася': 'Костя',
  'Антон': 'Вика',
  'Вика': 'Антон',
  'Роман': 'Настя',
  'Настя': 'Роман',
  'Сергей': 'Света',
  'Света': 'Сергей',
};

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function assign(participants) {
  const shuffled = shuffle(participants);
  const assigned = {};
  const taken = {};
  for (let i = 0; i < shuffled.length; i++) {
    for (let next = (i + 1) % shuffled.length; next != i; next = (next + 1) % shuffled.length) {
      if (assigned[shuffled[i]] === undefined && taken[shuffled[next]] === undefined && forbidden[shuffled[i]] != shuffled[next]) {
        assigned[shuffled[i]] = shuffled[next];
        taken[shuffled[next]] = shuffled[i];
      }
    }
  }
  return assigned;
}

const assignment = assign([...participants]);
const wishes = {}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Тайный Санта', participants });
});

router.post('/result', function(req, res) {
  const name = req.body['name'];
  res.render('result', { name, assignee: assignment[name], wish: wishes[name] ? wishes[name] : '', assigneeWish: wishes[assignment[name]] ? wishes[assignment[name]] : 'Пока ничего не пожалал(а)' });
});

router.get('/assignment', function(req, res) {
  res.render('assignment', {participants, assignment, wishes});
});

router.post('/recordwish', function(req, res) {
  const name = req.body['name']
  const wish = req.body['wish']
  wishes[name] = wish;
  res.render('recordwish')
});

module.exports = router;
