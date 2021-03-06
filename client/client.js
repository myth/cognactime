/*
  Created by 'myth' on June 30. 2015

  CognacTime is licenced under the MIT licence.
*/

var DEBUG = false

var util = require('./util')
var gen = require('./generator')

var client = (function () {
    /* Private fields */
    var ACTIVE_FILTER, PRELOAD_READY

    var host =  location.protocol + '//' + location.hostname +
                (location.port ? ':' + location.port : '')
    var socket

    // Cached selectors
    var options, quickFilters, optionsToggle, searchField, runTime,
    scienceButton, natureButton, historyButton, titleRuntime, userCount,
    results, loading

    /* Private methods */

    var cacheSelectors = function () {
      options = $('#options')
      optionsToggle = $('#options-toggle')
      quickFilters = $('.quickfilter')
      runTime = $('#filter-runtime')
      searchField = $('#filter-search')
      scienceButton = $('#filter-science')
      natureButton = $('#filter-nature')
      historyButton = $('#filter-history')
      spaceButton = $('#filter-space')
      titleRuntime = $('#title-runtime')
      userCount = $('#stats-users')
      results = $('#results')
      loading = $('#loading')
    }

    var connectToServer = function () {
      socket = io.connect(host)
      socket.on('connect', function () {
        console.log('Connected to server')
        loading.fadeOut(200, function () {
          results.hide().html('<h2 class="center">Soon ™</h2>').fadeIn(200)
        })
      })

      // Fetch and register event handlers from events module
      require('./events')(client)
    }

    var bindActions = function () {
      optionsToggle.on('click', function (e) {
        e.preventDefault()
        options.slideToggle(200)
        optionsToggle.toggleClass('active')
      })

      runTime.on('input', function (e) {
        e.preventDefault()
        titleRuntime.text('RUNTIME > ' + $(this).val() + 'm')
      })
      runTime.on('change', function (e) {
        e.preventDefault()
        client.fetch()
      })

      quickFilters.on('click', function (e) {
        e.preventDefault()
        ACTIVE_FILTER = $(this).attr('id').replace('filter-', '')
        client.fetch()
      })

      searchField.on('keyup', function (e) {
        if (e.keyCode === 13) {
          ACTIVE_FILTER = searchField.val()
          client.fetch()
        }
      })

      $(window).on('scroll', function (e) {
        var offset = $(window).scrollTop()
        var threshold = $(document).height() - $(window).height() * 2
        if (!loading.is(':visible') && PRELOAD_READY) {
          if (offset > threshold) {
            client.next()
            PRELOAD_READY = false
          }
        }
      })
    }

    // Fetches the current state of the DOM as a Options object
    var getOptions = function (query) {
      return {
        runtime: runTime.val(),
        torrents: false,
        query: (query === null || query === undefined) ? null : query
      }
    }

    /* Public methods */
    return {
      init: function () {
        console.log('Initializing CognacTime')

        var script = document.createElement('script')
        script.src = '/socket.io/socket.io.js'
        document.body.appendChild(script)

        script.onload = connectToServer

        cacheSelectors()
        bindActions()

        PRELOAD_READY = true
      },

      fetch: function () {
        results.html('')
        loading.fadeIn(100)
        gen.createRow()
        socket.emit('fetch', getOptions(ACTIVE_FILTER))
      },

      next: function () {
        var opts = getOptions(ACTIVE_FILTER)
        opts.next = true
        socket.emit('fetch', opts)
      },

      registerEventHandler: function (e, callback) {
        socket.on(e, callback)
      },

      setPreloadReady: function () {
        PRELOAD_READY = true
      },

      updateUserCount: function (count) {
        userCount.text(count)
      },

      // Client flags
      DEBUG: DEBUG,
    }
})()

client.init()
