const db = require('../dbConfig.js');
const mappers = require('./mappers');

module.exports = {
  get,
  insert,
  update,
  remove,
  getProjectActions,
};

// calling get returns an array of all the resources contained in the database. If you pass an id to this method it will return the resource with that id if one is found
function get(id) {
  let query = db('projects as p');

  if (id) {
    query.where('p.id', id).first();

    const promises = [query, this.getProjectActions(id)]; // [ projects, actions ]

    return Promise.all(promises).then(function(results) {
      let [project, actions] = results;

      if (project) {
        project.actions = actions;

        return mappers.projectToBody(project);
      } else {
        return null;
      }
    });
  }

  return query.then(projects => {
    return projects.map(project => mappers.projectToBody(project));
  });
}

// calling insert passing it a resource object will add it to the database and return the newly created resource
function insert(project) {
  return db('projects')
    .insert(project)
    .then(([id]) => this.get(id));
}

// accepts two arguments, the first is the id of the resource to update, and the second is an object with the changes to apply. It returns the updated resource. If a resource with the provided id is not found, the method returns null
function update(id, changes) {
  return db('projects')
    .where('id', id)
    .update(changes)
    .then(count => (count > 0 ? this.get(id) : null));
}

// the remove method accepts an id as it's first parameter and, upon successfully deleting the resource from the database, returns the number of records deleted
function remove(id) {
  return db('projects')
    .where('id', id)
    .del();
}

// takes a project id as it's only argument and returns a list of all the actions for the project
function getProjectActions(projectId) {
  return db('actions')
    .where('project_id', projectId)
    .then(actions => actions.map(action => mappers.actionToBody(action)));
}
