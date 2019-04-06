const express = require('express');
const app = express();
const port = 5000;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const db_url = process.env.MONGOLAB_URI;

app.use(express.json());

app.get('/api/servants/', (req, res) => {
  const class_filter = req.query.class;

  MongoClient.connect(db_url, { useNewUrlParser: true })
  .then(function (client) {
    const myservantlist = client.db('myservantlist');
    const servants = myservantlist.collection('servants');

    var query = {};
    if (class_filter) {
      const class_filter_arr = JSON.parse(req.query.class)
      if (class_filter_arr.length != 0)
        query = {class: {$in: class_filter_arr}}
    }
    var projection = {'_id': 0};
    var sort = {'id': 1}

    var servant_datas_cursor = servants.find(query, {projection: projection}).sort(sort);
    servant_datas_cursor.toArray()
    .then(function (result) {
      res.send(result);
      client.close();
    })
    .catch((e) => {
      client.close();
      Error(e)
    });
  })
  .catch(Error);
});

app.get('/api/servant/:servant_id', (req, res) => {
  var servant_id = Number(req.params.servant_id)

  MongoClient.connect(db_url, { useNewUrlParser: true })
  .then(function (client) {
    const myservantlist = client.db('myservantlist');
    const servants = myservantlist.collection('servants');

    var query = {'id' : servant_id};
    var projection = {'_id': 0};
    var servant_data_cursor = servants.find(query, {projection: projection});

    servant_data_cursor.toArray()
    .then(function (result) {
      res.send(result);
      client.close();
    })
    .catch((e) => {
      client.close();
      Error(e)
    });
  })
  .catch(Error);
});

app.listen(port, () => console.log(`Listening on port ${port}`));