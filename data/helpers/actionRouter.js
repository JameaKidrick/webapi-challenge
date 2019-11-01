console.log('=== RUNNING ACTION ROUTER ===');

const express = require('express');
const db = require('./actionModel');
const projectDB = require('./projectModel');
const router = express.Router();

/****************************** MIDDLEWARE ******************************/
// VALIDATES ACTION INFO
function validateAction(req, res, next) {
  const { description, notes } = req.body;
  if(description === undefined || notes === undefined){
    res.status(400).json({ error: 'missing action data' })
  }else if(description === '' || notes === ''){
    res.status(400).json({ error: 'missing required description and/or notes field' })
  }else{
    next()
  }
}

// VALIDATES ACTION ID
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
    .catch(err => {
      res.status(500).json({ error: 'internal server error' })
    })
}

/****************************** REQUEST HANDLERS ******************************/
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
router.post('/project/:id', validateAction, (req, res) => {
  const action = req.body;
  const id = req.params.id;
  action.project_id = id
  projectDB.get(id)
    .then(project => {
      if(!project){
        res.status(404).json({ error: 'invalid project id' })
      }else{
        db.insert(action)
        .then(newActionObj => {
          res.status(200).json(newActionObj)
        })
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'internal server error' })
    })
})

// UPDATE ACTION (ID, DESCRIPTION, AND NOTES)
router.put('/:id', [validateAction, validateActionId], (req, res) => {
  const action = req.body;
  const id = req.params.id;
  db.update(id, action)
    .then(action => {
      res.status(200).json(action)
    })
    .catch(err => {
      res.status(500).json({ error: 'internal server error' })
    })
})

// DELETE ACTION (ID)
router.delete('/:id', validateActionId, (req, res) => {
  const id = req.params.id;
  db.get(id)
    .then(actionObj => {
      db.remove(id)
      .then(deletedAction => {
        res.status(200).json(actionObj)
      })
      .catch(err => {
        res.status(500).json({ error: 'internal server error' })
      })
    })
})

module.exports = router;