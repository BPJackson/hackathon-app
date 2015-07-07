var routes = require('routes')(),
    fs = require('fs'),
    db = require('monk')('localhost/motivate'),
    bands = db.get('bands'),
    qs = require('qs'),
    view = require('mustache'),
    mime = require('mime')

// install fs monk qs mustache mime
routes.addRoute('/home', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
      if (err) res.end('404')
        var file = fs.readFileSync('templates/counter.html')
        res.end(file)
      }
    })
routes.addRoute('/counter', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
      if (err) res.end('404')
        var file = fs.readFileSync('templates/data.html')
        res.end(file)
      }
    })
routes.addRoute('/data', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
      if (err) res.end('404')
        var file = fs.readFileSync('templates/data.html')
        res.end(file)
      }
    })
routes.addRoute('/events', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    counter.find({}, function(err, docs) {
      if (err) res.end('404')
      var template = ''
      counter.find({}, function (err, docs) {
        var file = fs.readFileSync('templates/index.html')
        var template = view.render(file.toString(), { events: docs})
        res.end(template)
      })
    })
  }
routes.addRoute('/public/*', (req, res, url) => {
  res.setHeader('Content-Type', mime.lookup(req.url))
  fs.readFile('./' + req.url, function (err, file) {
   if (err) {
     res.setHeader('Content-Type', 'text/html')
     res.end('404')
     }
     res.end(file)
  })
})
module.exports = routes
