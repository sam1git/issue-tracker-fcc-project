const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
// for PUT req testing.
let id;
// assigned_to fetched for the same id as variable id
let compVal;

suite('Functional Tests', function() {

  this.timeout(5000);

  suite('POST request tests', function() {
    test('create issue will every field', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/testing')
        .send({
          issue_title: "Issue_1",
          issue_text: "Issue_text",
          created_by: "Ali",
          assigned_to: "Juan",
          status_text: "Testing"
        })
        .end((err, res) => {
          assert.equal(res.status,200, 'Expected res status to be a number 200');
          assert.isObject(JSON.parse(res.text), 'Expected res to be of type Object.');
          assert.property(JSON.parse(res.text), '_id', 'Expected to include property _id');
          assert.property(JSON.parse(res.text), 'issue_title', 'Expected to include property issue_title');
          assert.property(JSON.parse(res.text), 'issue_text', 'Expected to include property issue_text');
          assert.property(JSON.parse(res.text), 'created_by', 'Expected to include property created_by');
          assert.property(JSON.parse(res.text), 'assigned_to', 'Expected to include property assigned_to');
          assert.property(JSON.parse(res.text), 'status_text', 'Expected to include property status_text');
          assert.property(JSON.parse(res.text), 'created_on', 'Expected to include property status_text');
          assert.property(JSON.parse(res.text), 'updated_on', 'Expected to include property status_text');
          assert.property(JSON.parse(res.text), 'open', 'Expected to include property status_text');
          assert.typeOf(JSON.parse(res.text).open, 'boolean');
          done();
        });
    });
  
    test('create issue with only required fields', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/testing')
        .send({
          issue_title: "Issue_1",
          issue_text: "Issue_text",
          created_by: "Ali",      
        })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.isObject(JSON.parse(res.text), 'Expected res to be of type Object.');
          assert.property(JSON.parse(res.text), '_id', 'Expected to include property _id');
          assert.property(JSON.parse(res.text), 'issue_title', 'Expected to include property issue_title');
          assert.property(JSON.parse(res.text), 'issue_text', 'Expected to include property issue_text');
          assert.property(JSON.parse(res.text), 'created_by', 'Expected to include property created_by');
          assert.property(JSON.parse(res.text), 'assigned_to', 'Expected to include property assigned_to');
          assert.property(JSON.parse(res.text), 'status_text', 'Expected to include property status_text');
          assert.property(JSON.parse(res.text), 'created_on', 'Expected to include property status_text');
          assert.property(JSON.parse(res.text), 'updated_on', 'Expected to include property status_text');
          assert.property(JSON.parse(res.text), 'open', 'Expected to include property status_text');
          assert.typeOf(JSON.parse(res.text).open, 'boolean');
          done();
        });
    });
  
    test('post request with missing required field', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/testing')
        .send({
          issue_title: "Issue_1",
        })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.isObject(JSON.parse(res.text), 'Expected res to be of type Object.');
          assert.deepEqual(JSON.parse(res.text),{error:'required field(s) missing'}, 'Expecting to return object with error key and message');
          done();
        });
    });

  });

  suite('GET request tests', function() {
    test('get request to get all issues for the project', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/testing')
        .end((err,res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.isArray(JSON.parse(res.text), 'Expected res to be an array of objects');
          assert.equal(JSON.parse(res.text).every((e) => typeof e === 'object'), true, 'Expected res to be an array of objects');
          done();
        });
    });
  
    test('view issues on project with one filer', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/testing?open=true')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.equal(JSON.parse(res.text).every((e) => e.open === true), true, 'Expected res to be an array of objects with open property set true.');
          done();
        });
    });
  
    test('view issues on project with multiple filers', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/testing?open=true&created_by=Ali')
        .end((err, res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.equal(JSON.parse(res.text).every((e) => e.open === true && e.created_by === 'Ali'), true, 'Expected res to be an array of objects with open property set true.');
          id = JSON.parse(res.text)[0]._id;
          compValue = JSON.parse(res.text)[0].assigned_to;
          done();
        });
    });
  });

  suite('PUT request tests', function() {
    
    test('update one field of an issue', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/testing')
        .send({
          _id:id,
          assigned_to: 'Wang',
        })
        .end((err,res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.deepEqual(JSON.parse(res.text), {result: 'successfully updated', '_id': id }, 'Expected to return object with id as object key.')
          done();
        });
    });

    test('update multiple fields of an issue', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/testing')
        .send({
          _id:id,
          assigned_to: 'Rome',
          created_by: 'Kevin'
        })
        .end((err,res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.deepEqual(JSON.parse(res.text), {result: 'successfully updated', '_id': id }, 'Expected to return object with id as object key.')
          done();
        });
    });

    test('update issue with missing id', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/testing')
        .send({
          assigned_to: 'Rome',
        })
        .end((err,res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.deepEqual(JSON.parse(res.text), {error: 'missing _id'}, 'Expected to return error object indicating missing id.')
          done();
        });
    });

    test('update issue attempt with no update fields', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/testing')
        .send({
          _id: id,
        })
        .end((err,res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.deepEqual(JSON.parse(res.text), {error: 'no update field(s) sent', '_id': id}, 'Expected to return error object indicating no fields to update')
          done();
        });
    });

    test('update issue with false id', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/testing')
        .send({
          _id: 'Invalid',
          created_by: 'Alison',
        })
        .end((err,res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.deepEqual(JSON.parse(res.text), {error: 'could not update', '_id': 'Invalid'}, 'Expected to return error object indicating could not update for the given id')
          done();
        });
    });
    
  });

  suite('DELETE request tests', function() {

    test('delete an issue', function(done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/testing')
        .send({_id: id})
        .end((err,res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.deepEqual(JSON.parse(res.text), {result: 'successfully deleted', '_id': id}, 'Expected to be an object indicating successfull deletion corresponding to given id');
          done();
        });
    });

    test('delete an issue with invalid ID', function(done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/testing')
        .send({_id: "Invalid"})
        .end((err,res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.deepEqual(JSON.parse(res.text), {error: 'could not delete', '_id': "Invalid"}, 'Expected to be an error object indicating failed deletion');
          done();
        });
    });

    test('delete an issue with missing ID', function(done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/testing')
        .send({})
        .end((err,res) => {
          assert.equal(res.status, 200, 'Expected res status to be a number 200');
          assert.deepEqual(JSON.parse(res.text), {error: 'missing _id'}, 'Expected to be an error object indicating missing ID');
          done();
        });
    });
    
  });
  
});
