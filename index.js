const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan')
const env = require('dotenv').config();
const mongoose = require('mongoose');
const Phonebk = require('./mongo');
const port = process.env.PORT || 3000;
const cors = require('cors');
const errorhandler = require('./error')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

app.use(morgan((tokens, req,res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body),
  ].join(' ')
}))

app.get("/api/persons", async (req, res, next ) => {

  let phonebk = await Phonebk.find({}, (err, docs) => {
    if (docs) {
      return res.json(docs);
    }
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id' ,async (req,res, next) => {
  let id = req.params.id;
  if(id) {
    let ph = await Phonebk.findById(id, async(err, docs) => {
      if(docs) {
        res.json(docs)
      }
    })
      .catch(error => next(error))
  }
})

app.get("/info", async(req,res) => {
  let count = await Phonebk.estimatedDocumentCount()
  res.json(`There are ${count} numbers in the database `)
})

app.delete('/api/persons/:id', async (req,res, next) => {
  let id = req.params.id;
  if(id) {
    let ph = await Phonebk.findByIdAndDelete(id, (err,docs) => {
      if(docs) {
        res.json(`Deleted User`).status(204).end();
      }
    }).catch(error => {
      next(error)
    })
  } else {
    res.json("Please give a proper id")
  }
})

app.post('/api/persons', async (request ,response, next) => {

  let name = request.body.name;
  let ph = request.body.number;

  if(!name || !ph) {
    return response.status(404).json({ "error": "Name or Number not provided" }).end()
  }

  let phonebk = new Phonebk({ name: name, number: ph })

  await phonebk.save()
    .then(res => response.redirect('/api/persons'))
    .catch(error => next(error))
})

app.put("/api/persons/:id", async (req,res, next) => {
  let id = req.params.id;
  let num = req.body.number;
  if(id && num) {
    let phbk = await Phonebk.findByIdAndUpdate(id, req.body, { runValidators: true, context: 'query' },async (err, docs) => {
      if(docs) {
        res.json(docs)
      }
    })
      .catch(error => next(error))
  } else {
    res.json('Not updated')
  }
})

app.use(errorhandler)

app.listen(port)
console.log(`Server is listening on ${port}`)
