module.exports = function(app, db) {
    
app.route('/api/imagesearch/:searchtext')
.get(searchimages);

app.route('/api/latest/imagesearch')
.get(latestsearch);

app.route('/')
.get(function(req, res) {
  res.send('hello world');
});
    var Search = require("node-bing-api") ({ accKey: process.env.key })
    var coll = db.collection('searchHistory')
function searchimages(req,res){
    var term = req.params.searchtext
    //var searchurl = imageapi+term+"&mkt=en-us HTTP/1.1"
    var offset = req.query.offset || 0
    var noOfResults = 10
    Search.images(term, {top:noOfResults , skip:offset*noOfResults}, function (err,results,body){
        if (err) throw err
        save(term)
        res.send(JSON.stringify(body.d.results.map(returnList)))
    })
}

function save(term){
    coll.insertOne({"searchTerm" : term , "time": new Date()}, function (err, data){
        if (err) throw err
    })
}

function returnList(img){
    return {
        "image_url" : img.MediaUrl,
        "page_url" : img.SourceUrl
    }
}

function latestsearch(req,res){
    coll.find({},{"_id" : 0}).sort({"time": -1}).limit(10).toArray(function (err,data){
    if (err) throw err
    res.send(JSON.stringify(data))
  })
}
    
}