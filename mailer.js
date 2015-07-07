var nodemailer = require('nodemailer'),
    db = require('monk')('localhost/motivate'),
    events = db.get('events'),
    view = require('./view'),
    mustache = require('mustache')

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shanforsman.@gmail.com',
        pass: 'pa33word'
    }
})

events.find({}, function(err, docs) {

  console.log(docs)

  var template = view.render('email', {events: docs})

  var mailOptions = {
      from: 'Shannon :heavy_check_mark: <shanforsman@gmail.com>', // sender address
      to: 'sforsman1@gmail.com', // list of receivers
      subject: 'Hello :heavy_check_mark:', // Subject line
      text: 'Hello world :heavy_check_mark:', // plaintext body
      html: template // html body
  }

  transporter.sendMail(mailOptions, function(error, info) {
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);

  })

})
