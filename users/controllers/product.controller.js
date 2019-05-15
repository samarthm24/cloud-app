const User = require('../models/userModel');
const Act = require('../models/actModel');
const Category = require('../models/categoryModel');


var requests=0;
let log_update=function(req,res,next)
{  
    requests+=1;
}
exports.count_get=function(req,res,next){
 res.status(200).send([requests]);
}
exports.count_reset=function(req,res,next){
    requests=0;
    res.status(200).json({   
    });
}


exports.user_create = function (req, res,next){
    log_update();
    var regex = /\b[0-9a-f]{5,40}\b/;
    if(!req.body.password.match(regex)){
        console.log("b64") ;
        res.status(400).json();                           
    }
    let user = new User(
        {
            username: req.body.username,
            password: req.body.password
        }
    );

    user.save(function (err) {
        if (err) {
            res.status(400).send();
        }
        else{
            res.status(201).send();
        }
        
    })
};

exports.user_details = function (req, res,next) {
    log_update();
    User.find({username:req.params.username}, function (err, user) {
        console.log(req.params.username);        
        if (err) {
            res.status(400).json({
                message: "Username does not exist",
                status: 400 
            });
        }
        else{
            if(user.length==0){
                res.status(400).json({
                    message: "Username does not exist",
                    status: 400 
                });
            }
            else{
                res.status(201).json({
                    status: 201,
                    message: "welcome",
                    data: user
                });
            }
            
        }
        
    })
};

exports.user_delete = function (req, res,next) {
    log_update();
     User.find({username:req.params.username}, function (err, user){
        if(user.length==0){
                res.status(400).json()
            }
        else{
            User.remove({ username: req.params.username }, function (err, something) {
                    console.log('inside Delete', something);
                if (err) return next(err);
                res.status(200).json();}
)
        }
     })
};

exports.user_login = function (req, res,next) {
    log_update();
     User.find({ username: req.body.username }, function (err, user) {
                console.log(req.body);
                if (err) return next(err);
                if(user.length==0){

                    res.status(401).json({
                        message: "username does not exist",
                        status: 401
                    })
                }
                else{
                    if(user[0].password==req.body.password){
                        res.status(200).send(user);
                    }
                    else{
                        res.status(401).json({
                            message: "invalid password",
                            status: 401
                       })
                    }
                }
                console.log(user);
        }
)};


exports.all_user_detail=function(req,res,next){
    log_update();
        var all_users = []; 
        User.find({}, function(err, users){
       if(err){
           console.log(err);
           res.status(400);
       } else {
          // res.send(
          //    users
          // );
            for(i=0;i<users.length;i++){
                all_users.push(users[i]["username"]);
            }
            res.status(200).send(all_users);
       }
})
}


