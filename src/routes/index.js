var express = require('express');
var router = express.Router();
import {Assignment, Wish} from '../database';

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

async function populateAssignments(participants) {
  const assignmentByName = assign(participants);
  const assignments = [];
  for (const name of Object.keys(assignmentByName)) {
    const model = new Assignment({
      name: name,
      assignee: assignmentByName[name],
    });
    assignments.push(model);
    await Assignment.create(model);
  }
  return assignments;
}

async function fetchAssignments(participants) {
  const assignments = await Assignment.find({});
  if (assignments.length === 0)
    return populateAssignments(participants);
  return assignments;
}

async function fetchWishes(participants) {
  const wishes = {};
  for (const participant of participants) {
    const wish = await Wish.findOne({name: participant});
    if (wish)
      wishes[wish.name] = wish.wish;
    else
      wishes[participant] = 'Пока ничего не пожелал(а)';
  }
  return wishes;
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Тайный Санта', participants });
});

router.post('/result', async function(req, res) {
  const name = req.body['name'];
  await fetchAssignments(participants);
  const assignment = await Assignment.findOne({ name });
  const wish = await Wish.findOne({ name });
  res.render('result', {
    name,
    assignee: assignment.assignee,
    wish: wish ? wish.wish : ''
  });
});

router.get('/assignment', async function(req, res) {
  res.render('assignment', {
    participants,
    assignments: await fetchAssignments(participants),
    wishes: await fetchWishes(participants),
  });
});

router.post('/recordwish', async function(req, res) {
  const name = req.body['name']
  const wish = req.body['wish']
  await Wish.create(new Wish({name, wish}));
  res.render('recordwish')
});

module.exports = router;
