const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const AnimalService = require('./animal-service')
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

const app = express()

const morganOption = 'common'

app.use(morgan(morganOption))
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello world!!!!!!')
})

app.get('/api/animals', (req, res, next) => {
    
    // function getAllAnimals(knex) {
    //     return knex
    //       .select("*")
    //       .from("animals")
    //       .then(rows => console.log(rows));
    //  }

    //  getAllAnimals(knex)
    // test()
    const animals = getAllAnimals(knex)
    console.log('here', animals)
    res.send(animals)

})

  function getAllAnimals(knex) {
    return knex
      .select("*")
      .from("animals")
      .then(rows => console.log('there', rows));
 }

module.exports = app