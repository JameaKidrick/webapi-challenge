const db = require('../dbConfig.js');
const mappers = require('./mappers');

module.exports = {
  // calling get returns an array of all the resources contained in the database. If you pass an id to this method it will return the resource with that id if one is found
  get: function(id) {
    let query = db('actions');

    if (id) {
      return query
        .where('id', id)
        .first()
        .then(action => {
          if (action) {
            return mappers.actionToBody(action);
          } else {
            return action;
          }
        });
    }

    return query.then(actions => {
      return actions.map(action => mappers.actionToBody(action));
    });
  },

  // calling insert passing it a resource object will add it to the database and return the newly created resource
  insert: function(action) {
    return db('actions')
      .insert(action)
      .then(([id]) => this.get(id));
  },

  // accepts two arguments, the first is the id of the resource to update, and the second is an object with the changes to apply. It returns the updated resource. If a resource with the provided id is not found, the method returns null
  update: function(id, changes) {
    return db('actions')
      .where('id', id)
      .update(changes)
      .then(count => (count > 0 ? this.get(id) : null));
  },

  // the remove method accepts an id as it's first parameter and, upon successfully deleting the resource from the database, returns the number of records deleted
  remove: function(id) {
    return db('actions')
      .where('id', id)
      .del();
  },
};
