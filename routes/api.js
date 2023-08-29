'use strict';
const mongoose = require('mongoose');
const schema   = require('../schema.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res) {
      let project = req.params.project;
      let model = mongoose.model(project,schema);
      // filter using req.query.params
      model.find(req.query,{__v: 0}, (err, data) => {
        if (err)  {
          console.error(err);
          res.status(500).json({error: 'An error occurred occurred while fetching the project.'});
        } else {
          res.send(data);
        }
      });
    })

    .post(function (req, res) {
      if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
        let project = req.params.project;
        let model = mongoose.model(project,schema);
        model.create({
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
        }, (e, data) => {
          if (e)  {
            console.error(e.message);
            res.status(500).json({error: 'An error occurred occurred while creating the issue'});
          } else {
            let returnObj = {...data.toObject({ virtuals: false })};
            delete returnObj.__v;
            res.send(returnObj);
          }
        });
      } else {
        res.send({error:'required field(s) missing'});
      }
    })
    
    .put(function (req, res) {
      if (req.body._id === undefined || req.body._id === "") {
        return res.send({error: 'missing _id'});
      }
      let project = req.params.project;
      let model = mongoose.model(project,schema);
      let updates = {...req.body};
      Object.keys(updates).forEach((e) => updates[e] === "" && delete updates[e]);
      delete updates._id;
      if (Object.keys(updates).length === 0) {
        return res.send({error: 'no update field(s) sent', '_id': req.body._id});
      }
      updates.updated_on = new Date().toISOString();
      model.updateOne({_id: req.body._id},updates, (e, data) => {
        if (e)  {
          console.error(e.message);
          res.send({error: 'could not update', '_id': req.body._id});
        } else {
          if (data.n === 0) {
            return res.send({ error: 'could not update', '_id': req.body._id });
          }
          res.send({"result":"successfully updated","_id": req.body._id});
        }      
      });
    })
    
    .delete(function (req, res){
      if (req.body._id === undefined || req.body._id === "") {
        return res.send({error: 'missing _id'});
      }
      let project = req.params.project;
      let model = mongoose.model(project,schema);
      model.deleteOne({_id: req.body._id}, (e, data) => {
        if (e) {
          console.error(e.message);
          res.send({"error":"could not delete","_id": req.body._id});
        } else {
          if (data.deletedCount === 0) {
            return res.send({ error: 'could not delete', '_id': req.body._id});
          }
          res.send({"result":"successfully deleted","_id": req.body._id});
        }
      });
    });

};
