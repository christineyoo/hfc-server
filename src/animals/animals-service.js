const AnimalsService = {
  getAllAnimals(knex) {
    return knex('animals').select('*')
  },
  insertAnimal(knex, newAnimal) {
    return knex('animals')
      .insert(newAnimal)
      .returning('*')
      .then((rows) => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex('animals').select('*').where({ animal_id : id }).first()
  },
  deleteAnimal(knex, id) {
    return knex('animals').where({ animal_id : id }).delete()
  },
  updateAnimal(knex, id, newAnimalFields) {
    return knex('animals').where({ animal_id : id }).update(newAnimalFields)
  }
}

module.exports = AnimalsService
