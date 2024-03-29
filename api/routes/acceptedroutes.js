const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {successRes,failRes } = require('./../utils')//
const Route = require('../models/route');
//HANDLING DIFFERENT URL REQUESTS

router.get('/', (req, res, next) => {
    /*res.status(200).json({
        message: 'Handling GET requests to /acceptedroutes'
    */
    Route.find({})
        .exec()
        .then(routes => {
            res.status(200).json(successRes(200,routes,"fetched routes"))
        })
        .catch(err =>{
            console.log('err r r ', err);
            
            res.status(500).json(failRes(500,err,"internal error"))
        })

})


router.post('/', (req, res, next) => {
    //uncomment for demo http request
    /* const acceptroute = {
        name :req.body.name,
        price : req.body.price
    };*/
    //for DB request
    const route = new Route     //donot change variables, i tried and ended up in undefined error
        (
            {
                _id: new mongoose.Types.ObjectId(),
                destination: req.body.destination,
                route_index: req.body.route_index,
                no_seats:req.body.no_seats

            }
        );
    route.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'created route successfully with following parameters',
            createdRoute: {
                destination: result.destination,
                route_index: result.route_index,
                _id: result._id,
                no_seats:result.no_,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/acceptedroutes/" + result._id
                }
            }
        })
            .catch(err => console.log(err));

    });
});
router.get('/:routeId', (req, res, next) => {
    const id = req.params.routeId;
    
    Route.findById(id)
        .exec()
        .then(doc => {
            res.status(200).json(successRes(200,doc,'fetched single id '));
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(failRes(500, err, 'catch error in route id '));

        });
});
//CAREFUL! BODY MUST BE IN AN ARRAY FORM 
//(objects containing "propName":_VALUE_ and "value": _VALUE_)
/*
sample patch body:
[
{
	"propName" : "price", "value": "30"

} ]
*/
router.patch('/:routeId', (req, res, next) => {
    /*  res.status(200).json({
          message: 'Updated product'
      });
      */
    const id = req.params.routeId

    //static update (must fill all the fields even when not necessary)
    // Route.update({_id : id}, { $set: {name:req.body.newName, price:req.body.newPrice}})
    //dynamic update for eirther of the properties
    const updateOp = {};
    for (const ops of req.body)  //checking for available update requests in the body
    {
        updateOp[ops.propName] = ops.value;
    }
    Route.update({ _id: id }, { $set: updateOp })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });

        });
});
router.delete('/:routeId', (req, res, next) => {
    /* res.status(200).json({
         message: 'Deleted product'
     });
     */
    const id = req.params.routeId
    Route.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json(result);

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;