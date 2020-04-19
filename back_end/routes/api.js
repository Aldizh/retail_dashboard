const express = require('express');
const mongoose = require('mongoose');

const Article = require('../models/article')
const router = express.Router();

/*
 * Fetch available records from our database
 * @param {req} - Express request
 * @param {req.query} - Mongo DB query
 * @return {res} Express response
*/
router.get("/articles", async (req, res) => {
  const pageNumber = req.query.pageNumber || 0
  const resultsPerPage = 10

  const articles = await Article
    .find({})
      .skip(resultsPerPage * pageNumber)
      .limit(resultsPerPage)
    .catch(err => res.json({ success: false, data: [], err }))

  return res.json({ success: true, data: articles });
});

/*
 * Fetch available records from our database
 * @param {req} - Express request
 * @param {req.query} - Mongo DB query
 * @return {res} Express response
*/
router.get("/articles/all", async (req, res) => {
  const articles = await Article
    .find()
    .catch(err => {
      console.log('Error fetching articles...', err.message)
      return res.json({ success: false, data: [], error: err });
    })
  return res.json({ success: true, data: articles });
});

// insert one or many records in our database
router.post("/articles", (req, res, next) => {
  if (Array.isArray(req.body)) {
    Article.insertMany(req.body).then((data) => {
      return res.json({ success: true, data });
    }).catch(err => {
      return res.status(400).json({ success: false, data: [], error: err });
    })
  } else {
    const {
      id,
      name,
      quantity,
      buyPrice,
      category,
      available,
      geometry
    } = req.body;

    let data = new Article({
      name,
      quantity,
      buyPrice,
      category,
      geometry,
      available
    });

    data
      .save()
      .then(result => {
        return res.json({ success: true, data: result });
      })
      .catch(err => {
        console.log('Error saving articles...', err.message)
        return res.status(400).json({ error: 'Bad request' });
      })
  }
});

// get data by id
router.get("/articles/:id", (req, res, next) => {
  const { id } = req.params
  const objectId = new mongoose.Types.ObjectId(id)

  Article
    .findById(objectId).exec()
    .then((article) => res.json({ success: true, data: article }))
    .catch(err => res.json({ success: false, data: [], err }))
});

// updates an existing record in our database
router.put("/articles/:id", (req, res, next) => {
  const { name, quantity, buyPrice } =  req.body
  const { id } = req.params
  const objectId = new mongoose.Types.ObjectId(id)

  Article
    .findById(objectId).exec()
    .then((article) => {
      if (article.id) {
        Article.updateOne({ id: article.id }, {
          name,
          quantity,
          buyPrice
        }).then(record => {
          return res.json({ success: true, record})
        }).catch(err => {
          return res.status(400).json({ success: false, error: err})
        })
      } else return res.status(400).json({ success: false, error: "This record does not exist" });
    }).catch(err => res.json({ success: false, data: [], err }))
});

// deletes a record from our database
router.delete("/articles/:id", (req, res, next) => {
  const { id } = req.params
  const objectId = new mongoose.Types.ObjectId(id)

  Article
    .findByIdAndDelete(objectId).exec()
    .then((deleted) => {
      return res.json({ success: true, data: deleted })
    }).catch(err => {
      return res.status(400).json({ success: false, error: err})
    })
});

// deletes all records from our database
router.delete("/articles", (req, res, next) => {
  Article.deleteMany({}).then(data => {
    return res.status(200).json({ success: true, deleteCount: data.deletedCount})
  }).catch(err => {
    return res.status(400).json({ success: false, error: err})
  })
});

module.exports = router;
