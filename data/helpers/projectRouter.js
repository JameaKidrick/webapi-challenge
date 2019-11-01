console.log('=== RUNNING PROJECT ROUTER ===');

const express = require('express');
const db = require('./projectModel');
const router = express.Router();

/****************************** MIDDLEWARE ******************************/
// VALIDATES PROJECT INFO
function validateProject(req, res, next) {
  const { name, description } = req.body;
  if(name === undefined || description === undefined){
    res.status(400).json({ error: 'missing project data' })
  }else if(name === '' || description === ''){
    res.status(400).json({ error: 'missing required name and/or description field' })
  }else{
    next()
  }
}

// VALIDATES PROJECT ID
function validateProjectId(req, res, next) {
  const id = req.params.id;
  db.get(id)
    .then(project => {
      if(!project){
        return res.status(404).json({ error: 'invalid project id' })
      }else{
        next()
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'internal server error' })
    })
}

/****************************** REQUEST HANDLERS ******************************/
// GET ALL PROJECTS
router.get('/', (req, res) => {
  db.get()
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      res.status(500).json({ error: 'internal server error' })
    })
})

// GET SPECIFIED PROJECT(ID)
router.get('/:id', validateProjectId, (req, res) => {
  db.get(req.params.id)
    .then(project => {
      res.status(200).json(project)
    })
    .catch(err => {
      res.status(500).json({ error: 'internal server error' })
    })
})

// POST PROJECT(NAME AND DESCRIPTION)
router.post('/', validateProject, (req, res) => {
  // const project = req.body;
  db.insert(req.body)
    .then(newProject => {
      res.status(200).json(newProject)
    })
    .catch(err => {
      res.status(500).json({ error: 'internal server error' })
    })
})

// UPDATE PROJECT(ID, NAME, AND DESCRIPTION)


// DELETE PROJECT(ID)


// GET ALL ACTIONS OF A SPECIFIED PROJECT(ID)


module.exports = router;