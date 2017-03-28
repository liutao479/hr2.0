var express = require('express'),
  fs = require('fs'),
  bodyParser = require('body-parser');

var app = express();
/**
 * Allow cross domain request
 * Allow Customer Header
 * */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization, Auth");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTION, PUT, PATCH");
  res.type('json');
  next();
});

app.use(bodyParser.urlencoded({ extention: true }));

app.all('/mock/*', function(req, res) {
  var path = api = req.params[0].replace(/\//g, '.'),
      method = req.method.toLowerCase();
  if(method === 'options') {return res.sendStatus(200);}
  path = __dirname + '/' + method + '/' + path + '.json';
  console.log('****params');
  console.log(req.params);
  console.log('****query');
  console.log(req.query);
  console.log('****body');
  console.log(req.body);

  var $param = req.query,
      $data = req.body;

  if(($param && $param.sleep) || ($data && $data.sleep)) {
    setTimeout(function() {
      console.log('请求信息：\n{\n api: ' + api + ', \n file: ' + path + ', \n method: '+req.method+'\n}');
      if(fs.existsSync(path)) {
        var content = fs.readFileSync(path, {encoding: "UTF-8"});
        res.json(JSON.parse(content));
      } else {
        res.json({code: 404, msg: 'can not find the mock data file'});
      }
    }, $param.sleep || $data.sleep);
  } else {
    console.log('请求信息：\n{\n api: ' + api + ', \n file: ' + path + ', \n method: ' + req.method + '\n}');
    if (fs.existsSync(path)) {
      var content = fs.readFileSync(path, {encoding: "UTF-8"});
      res.json(JSON.parse(content));
    } else {
      res.json({code: 404, msg: 'can not find the mock data file'});
    }
  }
});

app.listen(8083);