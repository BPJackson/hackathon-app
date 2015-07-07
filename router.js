var routes = require('routes')(),
  fs = require('fs'),
  db = require('monk')('localhost/motivate'),
  counter = db.get('counter'),
  events = db.get('events'),
  qs = require('qs'),
  view = require('./view'),
  mime = require('mime')

// install fs monk qs mustache mime
routes.addRoute('/home', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    var file = fs.readFile('templates/home.html', function (err, file) {
      if (err) res.end('404')
      res.end(file)
    })
  }
})
routes.addRoute('/counter', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'POST') {
    console.log(req.method)
    var data = ''
    req.on('data', function (chunk) {
      data += chunk
    })
    req.on('end', function () {
      var counters = qs.parse(data)
      console.log(counters)
      if (counters.isMotivated === 'true') {
        counter.update({}, {$inc: {isMotivated: 1}}, function(err, doc){
          if (err) res.end('404')
          res.writeHead(302, {'Location': '/data'})
            res.end()
        })
      }
      else {
        counter.update({}, {$inc: {notMotivated: 1}}, function(err, doc){
          if (err) res.end('404')
          res.writeHead(302, {'Location': '/data'})
          res.end()

        })
      }
    })
  }
})

routes.addRoute('/data', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    counter.find({}, function(err, docs) {
      console.log(docs)
     var template = view.render('data', {counter: docs, title: 'data'})

     res.end(template)
  })
}
})

routes.addRoute('/events/new', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  var file = fs.readFile('templates/new.html', function(err,file) {
    if (err) res.end('404')
    res.end(file)
  })
})
routes.addRoute('/events', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    events.find({}, function(err, docs) {
      if (err) res.end('404')
      var template = ''
      events.find({}, function (err, docs) {
        var file = fs.readFileSync('templates/events.html')
        var template = view.render('events', { events: docs})
        res.end(template)
        })
      })
    }
    if (req.method === 'POST') {
  var data = ''
  req.on('data', function (chunk) {
    data += chunk
    console.log(data)
  })
  req.on('end', function () {
    var evnt = qs.parse(data)
    var insertEvent = events.insert(evnt)
    insertEvent.on('success', function() {
      res.writeHead(302, {'Location': '/events'})
      res.end()
    })
  })
}
})
routes.addRoute('/events/:id', (req, res, url) => {
  console.log(req.url)
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    events.findOne({_id : url.params.id}, function(err, doc) {
      if (err) res.end('404')
        var template = view.render('show', doc)
        res.end(template)
    })
  }
})
routes.addRoute('/events/:id/delete', (req, res, url) => {
  if (req.method === 'POST') {
    events.remove({_id: url.params.id}, function(err, doc) {
      if (err) console.log(err)
      res.writeHead(302, {'Location': '/events'})
      res.end()
    })
  }
})
routes.addRoute('/events/:id/edit', (req, res, url) => {
  if (req.method === 'GET') {
    events.findOne({ _id: url.params.id }, function(err, doc) {
      if (err) console.log(err)
      var file = fs.readFileSync('templates/edit.html')
      var template = view.render('edit', doc)
      res.end(template)
      })
    }
  })
  routes.addRoute('/events/:id/update', (req, res, url) => {
  var data = ''
  req.on('data', function (chunk) {
    data += chunk
  })
  req.on('end', function () {
    var evnt = qs.parse(data)
    events.update({_id: url.params.id}, evnt, function(err, doc) {
      if (err) console.log(err)
      res.writeHead(302, {'Location': '/events'})
      res.end()
    })
  })
})
routes.addRoute('/public/*', (req, res, url) => {
  console.log('CSS')
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
