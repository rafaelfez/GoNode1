const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const { nome, nascimento } = req.body;

  const diferenca = moment(nascimento, 'YYYY-MM-DD').fromNow(); // diferenca de tempo
  const numero = diferenca.replace(/\D/g, ''); // pega somente os numeros
  const anos = (diferenca.indexOf('years') !== -1); // verifica se são anos de diferenca

  const maior = (numero >= 18 && anos === true); // verifica se é maior de idade

  if (maior) {
    res.redirect(`/major?nome=${nome}&maior=${maior}`);
  } else {
    res.redirect(`/minor?nome=${nome}&maior=${maior}`);
  }
});

const checagem = (req, res, next) => { // checa se existe as varíaveis para retornar a rota
  if (req.query.nome && ((req.query.maior === 'true') || (req.query.maior === 'false'))) {
    next();
  } else {
    res.redirect('/');
  }
};

app.get('/major', checagem, (req, res) => {
  res.render('major', { nome: req.query.nome });
});

app.get('/minor', checagem, (req, res) => {
  res.render('minor', { nome: req.query.nome });
});

app.listen(3000);
