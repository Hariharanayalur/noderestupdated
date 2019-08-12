const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {successRes,failRes } = require('./../utils')

//importing request DBmodel from created models directory
const Requested = require('../models/request');
//importing route DBmodel from created models directory for valid route
const Route = require('../models/route');

router.get('/',(req,res,next) => {
   /* res.status(200).json({
        message :'requests were fetched'
    });*/
    Requested.find()
   // .select('_id Distance_to_route route')
    .populate('route')  //grabbing detailed route(add second arg to filter the details)
    .exec()
   .then(docs =>{
       res.status(200).json({
           count: docs.length,
           requests: docs.map(doc =>{
               return {
                   _id: doc._id,
                   route: doc.route,
                   studentId: doc.studentId,
                   studentName:doc.studentName,
                   location:doc.location,
                   request: {
                    type: 'GET',
                    url: 'http://localhost:3000/requestedroutes/' +doc._id
     
                }
               }
           })
          
       });

   })
   .catch(err => {
       res.status(500).json({error: err});
   });
});
router.post('/',(req,res,next) => {
    Route.findById(req.body.routeId)
    .then(route =>{
        if(!route) return res.status(404).json({message:"route not found"});    //
        const requestroute =new Requested(
            {
                _id: mongoose.Types.ObjectId(),
                location: req.body.location,
                route: req.body.routeId,
                studentId:req.body.studentId,
                studentName:req.body.studentName
                
    
            }
        );
        return requestroute
        .save()//.exec()
        .then(result => {
            console.log(result);
            res.status(201).json(
                {
                   message: "request submitted",
                   submittedRequest:{
                       _id: result._id,
                       route: result.route,
                       Distance_to_route: result.Distance_to_route
                },
                   request: {
                       type: 'GET',
                       url: 'http://localhost:3000/requestedroutes/' +result._id
    
                   }
                }
            );
    
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err});
        });
    })
    .catch(
        err =>{
            res.status(500).json({
                message: "given routeId doesnot match any existing routes.\n To create a new route request, click here",
                error: err
            });
        }
    );

    
   /* res.status(201).json({
        message :'request was created',
        requestroute: requestroute
    });*/
});
router.get('/:requestId',(req,res,next) => {
    /*res.status(200).json({
        message :'request details',
        requestId : req.params.requestId
    });*/
    Requested.findById(req.params.requestId)
    .populate('route')  //same as get/ call
    .exec()
    .then(order =>{
        if(!order) return res.status(404).json({
            message: 'requested route not found'
        });
        res.status(200).json(
            {
               requestedroute: order,
               request: {
                   type:'GET',
                   url:'http://localhost:3000/requestedroutes'
               }
            }
        );
    } )
    .catch(err => {
        res.status(500).json(
            {
               error: err 
            }
        );
        
    });

});
router.delete('/:requestId',(req,res,next) => {
    /*res.status(200).json({
        message :'request deleted',
        requestId : req.params.requestId
    });*/
    Requested.remove({_id: req.params.requestId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'route request deleted',
            request: {
                type: "POST",
                url:"http://localhost:3000/requestedroutes",
                body: { routeId: "ID", Distance_to_route: "Number"}
            }
        });
    })
    .catch(err => {
        res.status(500).json(
            {
               error: err 
            }
        );
        
    });
});
module.exports = router;
