const assert = require("assert")
const Article = require("../models/article")

let record

const firstRecord = {
  id: 0,
  name: 'Kiwis',
  quantity: 120,
  buyPrice: 1.2,
  sellPrice: 1.5,
  category: 'large'
}

const secondRecord = {
  id: 1,
  name: 'Oranges',
  quantity: 10,
  buyPrice: 1.10,
  sellPrice: 1.20,
  category: 'large'
}

beforeEach(function(done) {
  record = new Article(firstRecord)
  record.save().then((rec) => {
    assert(rec.id === record.id)
    assert(rec.name === record.name)
    newRec = new Article(secondRecord)
    newRec.save().then(rec2 => {
      assert(rec2.id === secondRecord.id)
      assert(rec2.name === secondRecord.name)
      done()
    })
  })
})

describe("test that CRUD operations are working as expected", () => {
  it("finds and reads a saved record", done => {
    Article.find({
      id: record.id
    }).then(results => {
      assert(results.length === 1)
      assert(results[0].id === record.id)
      assert(results[0].name === 'Kiwis')
      assert(results[0].category === 'large')
      done()
    })
  })

  it("creates a new document", async () => {
    const newRec = new Article(secondDocument)
    const rec2 = await newRec.save()
    assert(rec2.id === secondDocument.id)
    assert(rec2.name === secondDocument.name)
    
    const results = await Article.find({
      category: 'Produce'
    })
    assert(results.length === 2)
    
    // insert of existing records should fail
    Article.insertMany(results).then(res => assert(res.ok === 1)).catch(err => {
      assert(err.result.nInserted === 0)
    })
  })

  it("updates record using instance", done => {
    record
      .updateOne({ id: record.id, name: 'Strawberries' })
      .then(() => Article.findOne({ id: record.id }))
      .then(record => {
        assert(record.name === 'Strawberries')
        done()
      })
  })

  it("increments quantity by 50", done => {
    Article.updateOne({ id: record.id }, {$inc: { quantity: 50 } }).then(function() {
      Article.findOne({ id: record.id }).then(function(newRecord) {
        assert(newRecord.quantity === 170)
        done()
      })
    })
  })

  it("creates a second record", done => {
    record = new Article(secondRecord)
    record.save().then(record => {
      assert(record.id === secondRecord.id)
      assert(record.name === secondRecord.name)
      done()
    })
  })

  it("removes a saved record by id", done => {
    Article.findOneAndRemove(record.id)
      .then(() => Article.findOne({ id: 0 }))
      .then(record => {
        assert(record === null)
        done()
      })
  })
})
