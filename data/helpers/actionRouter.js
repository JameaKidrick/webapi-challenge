console.log('=== RUNNING ACTION ROUTER ===');

const express = require('express');
const db = require('./actionModel');
const router = express.Router();

/****************************** MIDDLEWARE ******************************/
// VALIDATES ACTION INFO AND ID
function validateAction(req, res, next) {
  const { description, notes } = req.body;

  if(req.body === undefined){
    res.status(400).json({ error: 'missing action data' })
  }else if(description === '' || notes === ''){
    res.status(400).json({ error: 'missing required description and/or notes field' })
  }else{
    next()
  }
}

function validateActionId(req, res, next) {
  const id = req.params.id;

  db.get(id)
    .then(action => {
      if(!action){
        return res.status(404).json({ error: 'invalid action id' })
      }else{
        next()
      }
    })
}



// GET ALL ACTIONS
router.get('/', (req, res) => {
  db.get()
    .then(actions => {
      res.status(200).json(actions)
    })
    .catch(err => {
      res.status(500).json({ error: 'internal server error' })
    })
})

// GET SPECIFIED (ID) ACTIONS
router.get('/:id', validateActionId, (req, res) => {
  db.get(req.params.id)
    .then(action => {
      res.status(200).json(action)
    })
    .catch(err => {
      res.status(500).json({ error: 'internal server error' })
    })
})

// POST ACTION (DESCRIPTION AND NOTES)

// UPDATE ACTION (ID, DESCRIPTION, AND NOTES)

// DELETE ACTION (ID)

module.exports = router;