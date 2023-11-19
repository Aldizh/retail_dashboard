const express = require('express');
const mongoose = require('mongoose');

const Article = require('../models/article')
const Sale = require('../models/sale')

const router = express.Router();

/*
 * Fetch available records from our database
 * @param {req} - Express request
 * @param {req.query} - Mongo DB query
 * @return {res} Express response
*/
router.get("/articles", async (req, res) => {
  const pageNumber = req.query.pageNumber
  const resultsPerPage = 15

  let articles = []

  if (pageNumber) {
    articles = await Article
      .find({})
      .skip(resultsPerPage * (pageNumber - 1))
      .limit(resultsPerPage)
      .catch(err => res.json({ success: false, data: [], err }))
  } else {
    articles = await Article
      .find({})
      .catch(err => res.json({ success: false, data: [], err }))
  }

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
router.post("/articles", async (req, res, next) => {
  if (Array.isArray(req.body)) {
    const data = await Article.insertMany(req.body).catch(err => {
      return res.status(400).json({ success: false, data: [], error: err });
    })
    return res.json({ success: true, data });
  } else {
    const {
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

    const result = await data.save().catch(err => {
      console.log('Error saving articles...', err.message)
      return res.status(400).json({ error: 'Bad request' });
    })

    return res.json({ success: true, data: result });
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

  Article.findOneAndUpdate({ _id: objectId }, {
    name,
    quantity,
    buyPrice
  }).then(record => {
    return res.json({ success: true, record })
  }).catch(err => {
    return res.status(400).json({ success: false, error: err})
  })
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

// SALES ROUTES
// fetches all available records from our database
router.get("/sales", async (req, res) => {
  const data = await Sale.find({}).catch(err => {
    return res.json({ success: false, error: err });
  })
  return res.json({ success: true, data });
});

// get data by id
router.get("/sales/:id", (req, res, next) => {
  const { id } = req.params
  const objectId = new mongoose.Types.ObjectId(id)

  Sale
    .findById(objectId).exec()
    .then((sale) => res.json({ success: true, data: sale }))
    .catch(err => res.json({ success: false, data: [], err }))
});


// insert one or many records in our database
router.post("/sales", (req, res, next) => {
  if (Array.isArray(req.body)) {
    Sale.insertMany(req.body).then((data) => {
      return res.json({ success: true, data: data });
    }).catch(err => {
      return res.status(400).json({ success: false, error: err });
    })
  } else {
    const {
      name,
      quantity,
      buyPrice,
      sellPrice,
      category
    } = req.body;

    let sale = new Sale({
      name,
      quantity,
      buyPrice,
      sellPrice,
      category
    });

    sale
      .save()
      .then(result => {
        return res.json({ success: true, sale });
      })
      .catch(err => {
        console.log('error creating sale', err)
        return res.status(400).json({error: 'Bad request'});
      })
  }
});

// updates an existing record in our database
router.put("/sales/:id", (req, res, next) => {
  const { name, quantity, buyPrice, sellPrice, category } = req.body

  const { id } = req.params
  const objectId = new mongoose.Types.ObjectId(id)

  Sale
    .findById(objectId).exec()
    .then((sale) => {
      if (sale._id) {
        Sale.updateOne({ _id: objectId }, {
          name,
          quantity,
          buyPrice,
          sellPrice,
          category
        }).then(record => {
          return res.json({ success: true, record})
        }).catch(err => {
          return res.status(400).json({ success: false, error: err})
        })
      } else return res.status(400).json({ success: false, error: "This record does not exist" });
    }).catch(err => res.json({ success: false, data: [], err }))
});

router.delete("/sales/:id", (req, res, next) => {
  const { id } = req.params
  const objectId = new mongoose.Types.ObjectId(id)

  Sale
    .findByIdAndDelete(objectId).exec()
    .then((deleted) => {
      return res.json({ success: true, data: deleted })
    }).catch(err => {
      return res.status(400).json({ success: false, error: err})
    })
});

module.exports = router;
