const User = require('../models/userModel');
const Act = require('../models/actModel');
const Category = require('../models/categoryModel');
const http = require('http');
var crashed=false;
//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};
exports.health=function(req,res)
{
if(crashed==false) res.status(200).send();
else res.status(500).send();
};
exports.crash=function(req,res)
{
crashed=true;
res.status(200).send();
};
exports.act_count=function(req,res,next)
{
    if(crashed==true) res.status(500).send();
    else
     log_update(req,res,next);
    //write code here for all acts
}
var requests=0;
let log_update=function(req,res,next)
{   
    requests+=1;
}
exports.count_get=function(req,res,next){
 if(crashed==true) res.status(500).send();
    else
 res.status(200).send([requests]);
}
exports.count_reset=function(req,res,next){
    if(crashed==true) res.status(500).send();
    else{
    requests=0;
    res.status(200).json({
        
    });};
}


exports.category_create = function (req, res,next) {
    if(crashed==true) res.status(500).send();
    else {
    log_update(req,res,next);
    console.log(req.body[0]);
    if(req.body[0] === undefined){
        res.status(405).send();
    }
    let category = new Category(
        {
            categoryName: req.body[0] 
   
        }
    );
    category.save(function (err) {
        if (err) {
            res.status(400).send();
        }

        else{
            res.status(201).send();
        }
        
    })
};
};

exports.all_category_detail=function(req,res,next){
        if(crashed==true) res.status(500).send();
    else {
        log_update(req,res,next);
        var all_categories={};
        Category.find({}, function(err, category){
       if(err){
           console.log(err);
       } else {
          if(category.length == 0){
            res.status(204).json({});
          }
          else{           
            for(i=0;i<category.length;i++){
                all_categories[category[i]["categoryName"]]=category[i]["no_acts"];

            }
            res.status(200).send(all_categories);
          }
       }
});
};}
exports.category_delete_empty= function(req, res,next){
    
if(crashed==true) res.status(500).send();
    else {    log_update(req,res,next);
    res.status(405).send();
};
};




exports.category_delete = function (req, res,next) {
    if(crashed==true) res.status(500).send();
    else {
     log_update(req,res,next);
     Category.findOne({categoryName: req.params.categoryName},function(err,category){
        console.log(category);
        if(!category){
            res.status(400).send();
        }
        else{
            Category.remove({ categoryName: req.params.categoryName }, function (err, something) {
                    console.log('inside Delete', something);
                if (err) return next(err);
                res.status(200).send();}
)
        }
     })
     };
 };


     


exports.act_create = function (req, res,next) {
    if(crashed==true) res.status(500).send();
    else {
    console.log(req.body);
    log_update(req,res,next);
    var data="";
    var flag=0;
    http.get('http://23.20.81.0:80/api/v1/users', (resp) => {
        console.log(resp.body);
  // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            len=JSON.parse(data).length
            console.log(len);
            for (i=0;i<len;i++){
                if(JSON.parse(data)[i]==req.body.username)
                {    flag=1;
                    console.log(JSON.parse(data)[i])
                    console.log(req.body.username)
                }
            }
            if(flag==0){
                console.log("username does not exist");
                res.status(400).json();
            }
            else{
                Category.find({categoryName: req.body.categoryName}, function(err,category){
                    if(category.length==0){
                        console.log("category does not exist",req.body.categoryName);
                        res.status(400).json();
                    }
                    
                    else{

                        if("upvotes" in req.body){
                            console.log("inside samarth");
                            res.status(400).json();
                        }
                        var regex = /[0-9][0-9][-][0-9][0-9][-][0-9][0-9][0-9][0-9][:][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/;
                      // if(!req.body.timestamp.match(regex)){
                        //    console.log("TS") ;
                          //  res.status(400).json(); 

                        //}
                        var regex_b64 =/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
                        //if(!req.body.imgB64.match(regex_b64)){
                          //   console.log("b64") ;
                            //res.status(400).json();  
                                                 
                        //}

                        let act = new Act({
                            username: req.body.username,
                            actid: req.body.actId,
                            caption: req.body.caption,
                            timestamp: req.body.timestamp,
                            imgB64: req.body.imgB64,
                            categoryName: req.body.categoryName
                        });

                        act.save(function (err) {
                            if (err) {
                                console.log("some error",err);
                                res.status(400).json();
                            }
                            else{
                                Category.findOne({ categoryName: req.body.categoryName }, function (err, category) {
                                if (err) return next(err);
                                console.log(category);
                                if(category.length==0){
                                    console.log("category error");
                                    res.status(400).json();
                                }
                                else{
                                    var myquery = {categoryName: req.params.categoryName};
                                    var up=category.no_acts+1;
                                    var newvalues = {$set: {no_acts: up}};
                                    Category.updateOne(myquery,newvalues,function(err,res){
                                        if(err)
                                            throw err;
                                    });            
                                    //res.status(200).json()
                                }
                            });
                                res.status(201).json();
                            }
                        })
            
                    }
                });
        }

        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
};
};

exports.act_delete = function (req, res,next) {
    if(crashed==true) res.status(500).send();
    else {
    log_update(req,res,next);
     Act.findOne({ actid: req.params.actid }, function (err, act){
        if(!act){
            res.status(400).json();
        }
        else{
            Act.remove({ actid: req.params.actid }, function (err, something) {
                    console.log('inside Delete', something);
                if (err) return next(err);
                res.status(200).send();}
)
        }
     })
     };
 };

exports.all_act_detail=function(req,res,next){
    if(crashed==true) res.status(500).send();
    else {
    log_update(req,res,next);
        Act.find({}, function(err, acts){
       if(err){
           console.log(err);
       } else {
       	  console.log(acts.length);
          res.json({
            message : "all acts",
            data: acts
          });
       }
});
};}

exports.all_act_count=function(req,res,next){
    if(crashed==true) res.status(500).send();
    else {
    log_update(req,res,next);
        Act.find({}, function(err, acts){
       if(err){
       	   console.log("hid");
           //console.log(err);
       } else {
       	  var l = acts.length;
          res.status(200).send([l]);
       }
});
};
};

exports.all_act_category_detail=function(req,res,next){
    if(crashed==true) res.status(500).send();
    else {
    log_update(req,res,next);
        console.log(req.query, req.params);

        const {
            start,
            end,
        } = req.query;

        const buildQuery = start && end && start-end<=100 ? 
        {
            categoryName: req.params.categoryName,
            actid: {
                $gt: start,
                $lt: end,
            },
        } : 
        {
            categoryName: req.params.categoryName,   
        };
    
        Act.find(buildQuery, function(err, acts){
       if(err){
           console.log(err);
       } else {
          if(acts.length == 0){
            res.status(204).json();
          }
          else{
            var acts_rev = acts.reverse();
            res.status(200).send(acts_rev);
          }
          
       }
});
};
};

exports.all_act_category_size=function(req,res,next){
    if(crashed==true) res.status(500).send();
    else {
    log_update(req,res,next);
        Act.find({categoryName: req.params.categoryName}, function(err, acts){
       if(err){
           console.log(err);
       } else {
          res.send([acts.length]);
       }
});
};
};

exports.act_upvote = function (req, res,next) {
    if(crashed==true) res.status(500).send();
    else {
    log_update(req,res,next);
     Act.find({ actid: req.body[0] }, function (err, act) {
        if (err) return next(err);
        console.log(act);
        if(act.length==0){
            res.status(400).json();
        }
        else{
            var myquery = {actid: req.body[0]};
            var up=act[0].upvotes+1;
            var newvalues = {$set: {upvotes: up}};
            Act.updateOne(myquery,newvalues,function(err,res){
                if(err)
                    throw err;
            });            
            res.status(200).json()
        }
    });
};
};

