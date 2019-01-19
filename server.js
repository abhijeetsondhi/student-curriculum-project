var express = require('express');
var app = express();
var mongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const upload = require('express-fileupload');
app.use(bodyParser.json());
var mkdirp = require('mkdirp');
var fs = require('fs');
app.use(upload({
    createParentPath:true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
var url = "mongodb://localhost:27017/";
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var subjects = [];

app.listen("4495",function(){
        console.log("On port" + "4495");
    });

    app.post('/send',function(req,resp){
        console.log(req.body);
        insertDb(req).then(function(f){
            if(f)
            {
                resp.send("Done");
            }

        });
        
    });

tmp = function(req, res, next){
        fs.mkdirSync('./upload/',{recursive:true},function(err,re){
            if(err)
            {
                console.log(err);
            }
            else
            {
             
            }
        });
};

app.get('/notes/:sub',function(req,res){
    retNotes(req).then(function(f){
        if(f)
        {
            res.json(f);
        }
    }).catch(function(e){
        res.json(null);
    })

});
app.get('/checkHwk/:sub/:name/:usr',function(req,res){
    checkUpload(req).then(function(f){
        if(f)
        {
            res.send(f);
        }

    }).catch(function(e){
        if(e)
        {
            res.send(false);
        }
    })
});

function checkUpload(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err)
            }
            else{
                var dbo = db.db("app_users");
                dbo.collection("uploads").find({subject:req.params.sub}).toArray(function(err,re){
                    var ans = false;
                    if(re.length >= 1)
                    {
                        var x = re[0].submit;
                        
                        for(let y in x)
                        {
                            if(x[y].name === req.params.usr && x[y].upload === req.params.name)
                            {
                                ans = true;
                                break;
                            }
                        }
                        resolve(ans);
                    }
                    else
                    {
                        resolve(ans);
                    }
                })
            }
            })

    })
}

app.post('/updateTheScore',function(req,res){
updateTheScore(req).then(function(f){
    if(f)
    {
        res.send(true);
    }
})
})

function updateTheScore(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err)
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("scores").find({subject:req.body.subjectname}).toArray(function(er,result){
                    if(er)
                    {
                        reject(er);
                    }
                    else
                    {
                        for(var t = 0;t<result[0].test.length;t++)
                        {
                            if(result[0].test[t].testName === req.body.testName)
                            {
                                var x = [];
                                for(let y of req.body.scores)
                                {
                                    let z = {
                                        student:y.student,
                                        score:y.score,
                                        outOf:y.outOf
                                    }
                                    x.push(z);
                                }
                                let q = {
                                    testName:req.body.testName,
                                    marks:x
                                }
                                result[0].test[t] = q;
                                break;
                            }
                        }
                    }
                
            var myquery = {subject:req.body.subjectname};
            var newvalues = { $set: {subject:req.body.subjectname, test:result[0].test} };
            dbo.collection("scores").updateOne(myquery,newvalues,function(er,resp){
                if(er)
                {
                    reject(er);
                }
                else
                {
                    resolve(true);
                }
        });
    });
            }
    
        });
    });
    
}

app.get('/viewSubmit/:sub',function(req,res){
    getSubmit(req).then(function(f){
        if(f)
        {
            console.log(f);
            res.json(f);
        }
    }).catch(function(e){
        if(e)
        {
            res.json(null);
        }
    })

});



function getSubmit(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err)
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("uploads").find({subject:req.params.sub}).toArray(function(er,data){
                    if(er)
                    {
                        console.log(er);
                        reject(er);
                    }
                    else if(data.length >= 1)
                    {
                     var x=[];
                     var y = data[0].submit
                     console.log(y);
                     for(let q in y)
                     {
                         if(!x.includes(y[q].name))
                         {
                             x.push(y[q].name);
                         }
                     }
                     console.log(x);
                     resolve(x);
                    } 
                    else{
                        reject(null);
                    }  
                })
            }

        });

    });
}

app.post('/uploadHwk/:sub/:name',function(req,res){
    var file = req.files.file;
    var filename = file.name;
    var extn = filename.split('.');
    var ext = extn[extn.length-1];
    var fst = (req.params.name).concat(".").concat(ext)
    checkDeadLine(req,new Date()).then(function(ans)
    {
        console.log(ans);
        if(ans)
        {
        submitHwk(req,fst).then(function(f){
        if(f)
        {
            mkdirp('./public/teacher/'+req.params.sub+'/'+req.body.usr +'/'+req.params.name,function(err) { 
                if(!err)
                {
                    file.mv('./public/teacher/'+req.params.sub+'/'+req.body.usr +'/'+req.params.name+'/'+fst,function(err,resP){
                        if(err)
                        {
                            console.log(err);
                            res.send(false);
                        }
                        else
                        {
                            res.send(true);
                        }       
                    })
                }
            })
        }
    })
}
else
{
    res.send(false);
}
})
});

function checkDeadLine(req,dates)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err)
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("hw").find({subject:req.params.sub}).toArray(function(er,data){
                    if(er)
                    {
                        reject(er);
                    }
                    else if(data.length >= 1)
                    {
                     var x=[];
                     var ans;
                     var y = data[0].hwk
                     for(let q of y)
                     {
                         let s = q.name.split(".")[0];
                         if(s === req.params.name)
                         {
                            ans = q.date;
                            break;
                         }
                     }

                     console.log(dates);
                     console.log(ans);
                     console.log(typeof(dates));
                     console.log(typeof(ans));
                     console.log(dates > ans);
                     if(dates > ans)
                     {
                         resolve(false);
                     }
                     else
                     {
                        resolve(true);
                     }
                    } 
                    else{
                        reject(null);
                    }  
                })
            }

        });
    })
}

app.get('/viewSpecific/:sub/:name',function(req,res){
    let ans = [];
    getSpecific(req).then(function(f){
        if(f)
        {
            console.log(f);
            res.json(f);
        }
    }).catch(function(e){
        if(e)
        {
            res.json(null);
        }

    });
})


function getSpecific(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err)
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("uploads").find({subject:req.params.sub}).toArray(function(er,data){
                    if(er)
                    {
                        reject(er);
                    }
                    else if(data.length >= 1)
                    {
                     var x=[];
                     var y = data[0].submit
                     for(let q in y)
                     {
                         if(y[q].name === req.params.name)
                         {
                             x.push(y[q]);
                         }
                     }
                     resolve(x);
                    } 
                    else{
                        reject(null);
                    }  
                })
            }

        });

    });
}

function submitHwk(req,fst)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err)
            }
            else{
                var dbo = db.db("app_users");
                dbo.collection("uploads").find({subject:req.params.sub}).toArray(function(err,re){
                    if(err)
                    {
                        reject(err);
                    }
                    else{
                        if(re.length == 0)
                        {
                            var x=[];
                            let y = fst.split(".");
                            y = y[0];
                            x.push({
                                name:req.body.usr,
                                upload:y,
                                file:fst
                            })
                            dbo.collection("uploads").insertOne({subject:req.params.sub,submit:x},function(er,resp){
                                    if(er)
                                    {
                                        reject(er);
                                    }
                                    else
                                    {
                                        resolve(true);
                                    }
                            })
                        }
                        else
                        {
                            var x = re[0].submit;
                            let y = fst.split(".");
                            y = y[0];
                            x.push({
                                name:req.body.usr,
                                upload:y,
                                file:fst
                            })
                            var myquery = {subject:req.params.sub};
                            var newvalues = { $set: {subject:req.params.sub, submit:x} };
                            dbo.collection("uploads").updateOne(myquery,newvalues,function(er,resp){
                                if(er)
                                {
                                    reject(er);
                                }
                                else
                                {
                                    resolve(true);
                                }
                        });
                        }
                    }
                })
            }
        })
    })
}

app.get('/getScoreHeader/:sub',function(req,res){
    console.log(req.params);
    getScoreHeader(req).then(function(f){
        console.log(f);
        if(f)
        {
            res.json(f);
        }
    }).catch(function(e){
        res.json(false);
    })

});

function getScoreHeader(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err);
            }
            else
            {
                var dbse = db.db("app_users");
                dbse.collection("scores").find({subject:req.params.sub}).toArray(function(errs,resp){
                    if(errs)
                    {
                        reject(errs);
                    }
                    else
                    {
                        console.log(resp);
                        if(resp.length >=1 )
                        {
                            var x = [];
                            var y = resp[0].test;
                            for(let z of y)
                            {
                                x.push(z.testName);
                            }
                            console.log(x);
                            resolve(x);
                        }
                        else
                        {
                            reject(null);
                        }
                    }
                })
            }
        });
    });
}
app.get('/hwOption/:sub/:usr',function(req,res){
    console.log(req.params);
    retHomework(req).then(function(f){
        if(f)
        {
            mkdirp('./public/teacher/'+req.params.sub+'/'+req.params.usr +'/',function(err) { 
                if(!err)
                {
                    res.json(f);
                }
            })
        }
    }).catch(function(e){
        console.log(e);
        res.json(null);
    })

});
function retHomework(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err)
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("hw").find({subject:req.params.sub}).toArray(function(er,data){
                    if(er)
                    {
                        reject(er);
                    }
                    else if(data.length >= 1)
                    {
                        resolve(data[0].hwk);
                        console.log(data[0].hwk);
                    } 
                    else{
                        reject(null);
                    }  
                })
            }

        });

    });
}


function retNotes(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err)
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("homeworks").find({subject:req.params.sub}).toArray(function(er,data){
                    if(er)
                    {
                        reject(er);
                    }
                    else if(data.length >= 1)
                    {
                        resolve(data[0].files);
                    } 
                    else{
                        reject(null);
                    }  
                })
            }

        });

    });
}

app.post('/hwUpload',function(req,res){
    console.log(req.files);
    console.log(req.body);
    var file = req.files.file;
    var filename = file.name;
    var extn = filename.split('.');
    var ext = extn[extn.length-1];
    var fst = req.body.filename.concat(".").concat(ext)
    addHomework(req,fst).then(function(f){
        if(f)
        {
        file.mv('./public/subject/'+req.body.subjectName+"/"+fst,function(err,resP){
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.send("True");
            }       
        })
    }
    })
})


function addHomework(req,file)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err)
            }
            else{
                var dbo = db.db("app_users");
                dbo.collection("homeworks").find({subject:req.body.subjectName}).toArray(function(err,re){
                    if(err)
                    {
                        reject(err);
                    }
                    else{
                        if(re.length == 0)
                        {
                            var x=[];
                            x.push(file);
                            dbo.collection("homeworks").insertOne({subject:req.body.subjectName,files:x},function(er,resp){
                                    if(er)
                                    {
                                        reject(er);
                                    }
                                    else
                                    {
                                        resolve(true);
                                    }
                            })
                        }
                        else
                        {
                            var x = re[0].files;
                            x.push(file);
                            var myquery = {subject:req.body.subjectName};
                            var newvalues = { $set: {subject:req.body.subjectName, files:x} };
                            dbo.collection("homeworks").updateOne(myquery,newvalues,function(er,resp){
                                if(er)
                                {
                                    reject(er);
                                }
                                else
                                {
                                    resolve(true);
                                }
                        });
                        }
                    }
                })
            }
        })
    })
}



app.post('/login',function(req,res){
    login(req).then(function(result){
        if(result !== null)
        {
            console.log(result);
            res.send(result);
        } 
    }).catch((e) => {
        res.send(e);
    });

});
app.post('/addScore',function(req,res){
    console.log(req.body);
    addScore(req).then(function(f){
        if(f)
        {
            res.send("True");
        }
    })
});

app.post('/homework',function(req,res){
        console.log(typeof(req.body.date));
        var dte = new Date(req.body.date);
        console.log(dte);
        console.log(typeof(dte));
        console.log(req.body);
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        var extn = filename.split('.');
        var ext = extn[extn.length-1];
        var fst = (req.body.filename).concat(".").concat(ext)
        addHw(req,fst,dte).then(function(f){
        if(f)
        {
        file.mv('./public/homework/'+req.body.subjectName+"/"+fst,function(err,resP){
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.send("True");
            }       
        })
    }
});
});

function addHw(req,fst,dte)
{
        return new Promise(function(resolve,reject){
            mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
                if(err)
                {
                    reject(err);
                }
                else
                {
                    var dbo = db.db("app_users");
                    dbo.collection("hw").find({subject:req.body.subjectName}).toArray(function(err,data){
                        if(err)
                        {
                            reject(err);
                        }
                        else
                        {
                            if(data.length == 0)
                            {
                                
                                let x = [];
                                let y = {
                                name:fst,
                                date:dte
                                }
                                x.push(y);
                                dbo.collection("hw").insertOne({subject:req.body.subjectName,hwk:x},function(er,resp){
                                    if(er)
                                    {
                                        reject(er);
                                    }
                                    else
                                    {
                                        resolve(true);
                                    }
                                })
                            }
                            else
                            {
                                var myquery = {subject:req.body.subjectName};
                                var temps = data[0].hwk;
                                let w = {
                                    name:fst,
                                    date:dte
                                };
                                temps.push(w);
                                console.log(temps);
                                var newvalues = { $set: {subject:req.body.subjectName, hwk:temps} };
                                dbo.collection("hw").updateOne(myquery,newvalues,function(e,re){
                                    if(e)
                                    {
                                        reject(e);
                                        console.log(e);
                                    }
                                    else
                                    {
                                        resolve(true);
                                    }
                                })
                            }                        
                        }
    
                    });
                }
            })
    
        });
}
function addScore(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err);
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("scores").find({subject:req.body.subjectname}).toArray(function(err,data){
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        if(data.length == 0)
                        {
                            let x = []
                            x.push({
                                testName:req.body.testName,
                                marks:req.body.scores
                            })
                            dbo.collection("scores").insertOne({subject:req.body.subjectname,test:x},function(er,resp){
                                if(er)
                                {
                                    reject(er);
                                }
                                else
                                {
                                    resolve(true);
                                }
                            })
                        }
                        else
                        {
                            var myquery = {subject:req.body.subjectname};
                            var temps = data[0].test;
                            let w = {
                                testName:req.body.testName,
                                marks:req.body.scores
                            };
                            temps.push(w);
                            var newvalues = { $set: {subject:req.body.subjectname, test:temps} };
                            dbo.collection("scores").updateOne(myquery,newvalues,function(e,re){
                                if(e)
                                {
                                    reject(e);
                                }
                                else
                                {
                                    resolve(true);
                                }
                            })
                        }                        
                    }

                });
            }
        })

    });
}

app.get('/viewScore/:student/:sub',function(req,res){
    viewScore(req.params.student,req.params.sub).then(function(f){
        console.log(f);
        res.json(f);
    }).catch(function(e){
        res.json(null);
    })

});

function viewScore(student,sub){
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err);
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("scores").find({subject:sub}).toArray(function(err,data){
                    if(err)
                    {
                        reject(err);
                    }
                    else if(data.length == 0)
                    {
                        reject(null);
                    }
                    else
                    {
                        var result = [];
                        var dat = data[0].test;
                        for(let x in dat)
                        {
                            for(let y in dat[x].marks)
                            {
                                if(dat[x].marks[y].student === student)
                                {
                                    let re = {
                                        testname:dat[x].testName,
                                        score:dat[x].marks[y].score,
                                        outOf:dat[x].marks[y].outOf
                                    }
                                    result.push(re);
                                }

                            }
                        }
                        if(result.length >= 1)
                        {
                        resolve(result);
                        }
                        else
                        {
                            reject(null);
                        }

                    }

                });
            }
        })

    });
}
app.get('/scores/:sub',function(req,res){
    allStudents(req).then(function(f){
        if(f)
        {
            var result = [];
            for(var x in f)
            {
                result.push(f[x].firstName);
            }
            res.json(result);
        }
    })
});


function allStudents(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err);
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("login").find({$and:[{designation:"student"},{subject:{$in:[req.params.sub]}}]}).toArray(function(err,data){
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        resolve(data);
                    }

                });
            }
        })

    });
}
app.get('/allScores/:sub/:name',function(req,res){
    allStudentsScore(req).then(function(f){
        if(f)
        {
            res.json(f);
        }
    })
});


function allStudentsScore(req)
{
    console.log(req.params.name);
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err);
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("scores").aggregate([
                    {
                    
                        $match : {"subject" : req.params.sub}
                    }, 
                    {
                        $unwind : "$test"
                    }, 
                    {
                        $match : { "test.testName" : req.params.name}
                    }, 
                    {
                        $group : {
                                  _id : "$subject", 
                                  testScore : {$addToSet : "$test"}
                    }
                    }])
                    .toArray(function(err,data){
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        console.log(data);
                        resolve(data);
                    }

                });
            }
        })

    });
}


app.get('/allProf',function(req,res){
    allProfessor().then(function(f){
        if(f)
        {
            subjects = [];
            for(let x in f)
            {
	            for(let y in f[x].subject)
                {
                    let l = f[x].subject[y].concat (" ").concat("by").concat(" ").concat(f[x].firstName);
                    subjects.push(f[x].subject[y] + " " + "by" + " " + f[x].firstName);
                    mkdirp('./public/teacher/'+l, function(err) { 
                    })
                }
            }
            console.log(subjects);
            res.json(subjects);
        }
    })
});


app.post('/post',function(req,res){
    createPost(req).then(function(f){
        if(f)
        {
            console.log(f);
            res.json(f);
        }
    });
});

app.get('/postSubject/:subject',function(req,res){
    getPost(req).then(function(f){
        if(f)
        {
            console.log(f);
            res.json(f);
        }
    }).catch(function(c){
        res.json(null);
    });
})

function getPost(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err);
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("posts").find({subject:req.params.subject}).toArray(function(err,resp){
                    if(err)
                    {
                        reject(err);
                    }
                    else if(resp.length === undefined)
                    {
                        reject(null);
                    }
                    else
                    {
                        console.log(resp[0].announcement);
                        resolve(resp[0].announcement);
                    }
                })
            }
    })
})
}

function createPost(req)
{
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err);
            }
            else
            {
                var dbo = db.db("app_users");
                dbo.collection("posts").find({subject:req.body.subjectName}).toArray(function(err,resp){
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        if(resp.length == 0)
                        {
                            let temps = [];
                            temps.push(req.body.post);
                            dbo.collection("posts").insertOne({subject:req.body.subjectName,announcement:temps},function(er,re){
                                if(er)
                                {
                                    reject(er);
                                }
                                else{
                                    resolve(temps);
                                }

                            })
                        }
                        else
                        {
                            var myquery = {subject:req.body.subjectName};
                            let temps = resp[0].announcement;
                            temps.push(req.body.post);
                            var newvalues = { $set: {subject:req.body.subjectName, announcement:temps} };
                            dbo.collection("posts").updateOne(myquery,newvalues,function(e,r){
                                if(e)
                                {
                                    reject(e);
                                }
                                else{
                                    resolve(temps);
                                }
                            })
                        }
                    }

                })
            }

        });

    });
}

function allProfessor(){
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err);
            }
            else
            {
                var dbse = db.db("app_users");
                dbse.collection("login").find({designation:"prof"}).toArray(function(errs,resp){
                    if(errs)
                    {
                        reject(errs);
                    }
                    else
                    {
                        if(resp.length >=1 )
                        {
                            console.log(resp);
                            resolve(resp);
                        }
                        else
                        {
                            reject(null);
                        }
                    }
                })
            }
        });
    });
}

function login(req){
    return new Promise(function(resolve,reject){
        mongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err)
            {
                reject(err);
            }
            else
            {
                var dbse = db.db("app_users");
                dbse.collection("login").find({$and:[{firstName:req.body.username},{password:req.body.password}]}).toArray(function(errs,resp){
                    if(errs)
                    {
                        reject(errs);
                    }
                    else
                    {
                        if(resp.length >=1 )
                        {
                            console.log(resp);
                            resolve(resp);
                        }
                        else if(resp.length === 0)
                        {
                            reject(null);
                        }
                    }
                    dbse.comm
                })
            }
        });

    });
}



    function insertDb(req)
    {
        return new Promise( function(resolve,reject){
            mongoClient.connect(url,{ useNewUrlParser: true },function(err,db){
                if(err)
                {
                    reject(err);
                    console.log("Chutiya katta");
                }
                else
                {
                    var dbo = db.db("app_users");
                    dbo.collection("login").insertOne({firstName:req.body.username,password:req.body.password,designation:req.body.designation,subject:req.body.subject},function(errs,res){
                        if(errs)
                        {
                            reject(errs);
                        }
                        else
                        {
                            resolve("Done!");
                        }
                        db.close();
                    });
                }
            });

        });
    }