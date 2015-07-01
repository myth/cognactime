/*
  Created by 'myth' on June 30. 2015

  CognacTime is licenced under the MIT licence.
*/

var fs =            require('fs')
,   express =       require('express')
,   expresshbs =    require('express-handlebars')
,   log =           require('./logging')
,   pkg =           require('../package.json')
,   config =        require('../config.json')
,   routes =        require('../routes/core')

ct = express()

// Set logging middleware
ct.use(require('morgan')('combined', {'stream': log.stream}))

// Set static
ct.use('/static', express.static('public'))

// Set view engine
ct.engine('hbs', expresshbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
ct.set('views', './views')
ct.set('view engine', 'hbs')

// Set core routes
ct.use('/', routes)

// Lets drink some Cognac and watch documentaries...
server = ct.listen(config.port, config.host, function () {

  var host = server.address().address
  var port = server.address().port

  log.info("CognacTime v%s running at %s:%s", pkg.version, host, port)

})
