const express = require('express')
const path = require('path')
const AnimalsService = require('./animals-service')
const xss = require('xss')

const animalsRouter = express.Router()
const jsonParser = express.json()

const serializeAnimal = (animal) => ({
  animal_id: animal.animal_id,
  animal_type: xss(animal.animal_type),
  animal_description: xss(animal.animal_description),
  belongs_to_pid: xss(animal.belongs_to_pid)
})

animalsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    AnimalsService.getAllAnimals(knexInstance)
      .then((animals) => {
        res.json(animals.map(serializeAnimal))
      })
      .catch((err) => {
        console.log({ err })
        next()
      })
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    const {
      animal_type,
      animal_description,
      belongs_to_pid
    } = req.body
    const newAnimal = {
        animal_type,
        animal_description,
        belongs_to_pid
    }

    for (const [key, value] of Object.entries(newAnimal)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    AnimalsService.insertAnimal(knexInstance, newAnimal)
      .then((animal) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${animal.animal_id}`))
          .json(serializeAnimal(animal))
      })
      .catch((err) => {
        console.log({ err })
        next()
      })
  })

  animalsRouter
  .route('/count')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    AnimalsService.getAllAnimals(knexInstance)
      .then((animals) => {
        res.json(animals.length)
      })
      .catch((err) => {
        console.log({ err })
        next()
      })
  })

animalsRouter
  .route('/:animal_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db')
    AnimalsService.getById(knexInstance, req.params.animal_id)
      .then((animal) => {
        if (!animal) {
          return res
            .status(404)
            .json({ error: { message: `Animal doesn't exist` } })
        }
        res.animal = animal
        next()
      })
      .catch((err) => {
        console.log({ err })
        next()
      })
  })
  .get((req, res, next) => {
    res.json(serializeAnimal(res.animal))
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db')
    AnimalsService.deleteAnimal(knexInstance, req.params.animal_id)
      .then((numRowsAffected) => {
        res.json({ message: `Successfully deleted` })
        res.status(204).end()
      })
      .catch((err) => {
        console.log({ err })
        next()
      })
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    const {
        animal_type,
        animal_description,
        belongs_to_pid
    } = req.body
    const animalToUpdate = {
        animal_type,
        animal_description,
        belongs_to_pid
    }

    const numberOfValues = Object.values(animalToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'animal_type', 'animal_description', or 'belongs_to_pid'.`
        }
      })

    AnimalsService.updateAnimal(
      knexInstance,
      req.params.animal_id,
      animalToUpdate
    )
      .then((numRowsAffected) => {
        res.json({ message: `Successfully updated` })
        res.status(204).end()
      })
      .catch((err) => {
        console.log({ err })
        next()
      })
  })

module.exports = animalsRouter