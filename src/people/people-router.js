const express = require('express');
const path = require('path');
const PeopleService = require('./people-service');
const xss = require('xss');

const peopleRouter = express.Router();
const jsonParser = express.json();

const serializePerson = (person) => ({
  person_id: person.person_id,
  fname: xss(person.fname),
  lname: xss(person.lname),
  favorite_fruit: xss(person.favorite_fruit)
});

peopleRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    PeopleService.getAllPeople(knexInstance)
      .then((people) => {
        res.json(people.map(serializePerson));
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {
      fname,
      lname,
      favorite_fruit
    } = req.body;
    const newPerson = {
        fname,
        lname,
        favorite_fruit
    };

    for (const [key, value] of Object.entries(newPerson)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    PeopleService.insertPerson(knexInstance, newPerson)
      .then((person) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${person.person_id}`))
          .json(serializePerson(person));
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  });

peopleRouter
  .route('/:person_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    PeopleService.getById(knexInstance, req.params.person_id)
      .then((person) => {
        if (!person) {
          return res
            .status(404)
            .json({ error: { message: `Person doesn't exist` } });
        }
        res.person = person;
        next();
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  })
  .get((req, res, next) => {
    res.json(serializePerson(res.person));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    PeopleService.deletePerson(knexInstance, req.params.person_id)
      .then((numRowsAffected) => {
        res.json({ message: `Successfully deleted` });
        res.status(204).end();
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {
        fname,
        lname,
        favorite_fruit
    } = req.body;
    const personToUpdate = {
        fname,
        lname,
        favorite_fruit
    };

    const numberOfValues = Object.values(personToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'fname', 'lname', or 'favorite_fruit'.`
        }
      });

    PeopleService.updatePerson(
      knexInstance,
      req.params.person_id,
      personToUpdate
    )
      .then((numRowsAffected) => {
        res.json({ message: `Successfully updated` });
        res.status(204).end();
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  });

module.exports = peopleRouter;