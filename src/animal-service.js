const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '3.237.71.225',
      port : 8000,
      user : 'christine',
      password : 'iamchristine11!',
      database : 'people_pets'
    }
  });

const AnimalService = {
    getAllAnimals(knex) {
        return knex('animals').select('*')
    }
}

// console.log(AnimalService.getAllAnimals(knex))

module.exports = AnimalService