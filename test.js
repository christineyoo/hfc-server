const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '3.237.71.225',
      port : 3306,
      user : 'christine',
      password : 'iamchristine11!',
      database : 'people_pets'
    }
  });

  function getAllAnimals(knex) {
    return knex
      .select("*")
      .from("animals")
      .then(rows => console.log(rows));
 }


 getAllAnimals(knex)

module.exports = test