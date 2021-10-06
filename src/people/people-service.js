const PeopleService = {
    getAllPeople(knex) {
      return knex('people').select('*')
    },
    insertPerson(knex, newPerson) {
      return knex('people')
        .insert(newPerson)
        .returning('*')
        .then((rows) => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex('people').select('*').where({ person_id : id }).first()
    },
    deletePerson(knex, id) {
      return knex('people').where({ person_id : id }).delete()
    },
    updatePerson(knex, id, newPersonFields) {
      return knex('people').where({ person_id : id }).update(newPersonFields)
    }
  }
  
  module.exports = PeopleService