const router = require("express").Router();
const Transaction = require("../models/transaction.js");


router.post("/api/transaction", ({body}, res) => {
  Transaction.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.post("/api/transaction/bulk", ({body}, res) => {
  Transaction.insertMany(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

router.get("/api/transaction", (req, res) => {
  Transaction.find({}).sort({date: -1})
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

const axios = require("axios");

// route to get response from Google Places API
router.get("/proxy/api/0/v1:link", function (req, res) {
  let url_1 = req.params.link.slice(7) + process.env.APIKey;
  console.log(url_1)
  axios.get(url_1)
    .then(function (response) {   
        // fixing CORS
        console.log(response.data);
        res.header('Access-Control-Allow-Origin', '*');
        res.send(response.data);     
    });

});
router.get("/api/proxy_envs", (req, res) => {  
  var host = req.headers.host;
  res.header('Access-Control-Allow-Origin', '*');
  if (host===process.env.CITE_NAME)
  res.send({
    apiKey:process.env.APIKEY,
    authDomain:process.env.AUTH_DOMAIN,
    databaseURL:process.env.DATABASE_URL,
    projectId:process.env.PROJECT_ID,
    storageBucket:process.env.STORAGE_BUCKET,
    messagingSenderId:process.env.MESSAGING_SENDER_ID,
    appId:process.env.APP_ID,
    cloudName:process.env.CLOUDNAME,
    cloudPreset:process.env.CLOUD_PRESET
  })
  else res.send({message: "Hello from the proxy server! "+host});
   
});
// route that gets the link to google picture by reference
router.get("/proxy/api/1/v1:link", function (req, res) {
  let url_1 = req.params.link.slice(7) + process.env.APIKey;
  fetch(url_1,{
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }).then(response=>{

      res.header('Access-Control-Allow-Origin', '*');
      res.send(response.url);
    }).catch(err => {
      console.log(err);
    });
});
// route to get information from spoonacular API
router.get("/proxy/api/key/:set/:link", function (req, res) {
  let url_1 = '';
  if (req.params.set === '0') {
    // url for the search results from spoonacular API 
    url_1 = "https://api.spoonacular.com/recipes/complexSearch?apiKey=" + process.env.APISpoon + req.params.link;
  }
  // url for recepies ingridients route
  else if (req.params.set === '1') { url_1 = `https://api.spoonacular.com/recipes/${req.params.link}/ingredientWidget.json?apiKey=` + process.env.APISpoon; }
  // url for recepies detailed route
  else if (req.params.set === '2') { url_1 = `https://api.spoonacular.com/recipes/${req.params.link}/analyzedInstructions?apiKey=` + process.env.APISpoon; }
  console.log(url_1)
  axios
    .get(url_1)
    .then(function (response) {
      // fixing CORS
      res.header('Access-Control-Allow-Origin', '*');
      res.send(response.data);
    });
});


module.exports = router;