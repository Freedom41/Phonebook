const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors');

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

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

var tele = [
            {
                "name": "Arto Hellas",
                "number": "040-123456",
                "id": 1
            },
            {
                "name": "Ada Lovelace",
                "number": "39-44-5323523",
                "id": 2
            },
            {
                "name": "Dan Abramov",
                "number": "12-43-234345",
                "id": 3
            },
            {
                "name": "Mary Poppendieck",
                "number": "39-23-6423122",
                "id": 4
            },
            {
                "name": "Adam",
                "number": "4444444444",
                "id": 5
            },
            {
                "name": "Zac",
                "number": "123456789",
                "id": 7
            }
        ]

app.get("/", (req,res) => {
    res.redirect('api/persons')
})

app.get("/api/persons", (req,res) => {
    return res.json(tele)
})

app.get('/api/persons/:id' ,(req,res) => {
    let id = Number(req.params.id); 
    let name = tele.find((ele) => ele.id === id)
    if(name) {
        return res.json(name)
    } else {
        res.json('Name not found')
    }
})

app.get("/info", (req,res) => {
    let dt = new Date();
    let len = tele.length;
    return res.json(`PhoneBook has Information about ${len} people, time of request ${dt}`)
})

app.delete('/api/persons/:id', (req,res) => {
    let id = Number(req.params.id);
    tele = tele.filter(note => note.id !== id)
    return res.status(204).end()
})

app.post('/api/persons', (req,res) => {
    let id = Math.floor(Math.random() * 100);
    let name = req.body.name;
    let ph = req.body.number;
    if(!name || !ph) {
        return res.status(404).json({"error": "Name or Number not provided"}).end()
    }
    let nameNotAvail = tele.every(ele => ele.name !== name)
    if(!nameNotAvail) {
        return res.status(400).json('Name already present').end()
    }
    tele = tele.concat({name: name, number: ph, id: id})
    return res.json(tele)
})

app.listen(port)
console.log(`Server is listening on ${port}`)
