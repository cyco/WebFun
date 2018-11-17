{CompositeDisposable, Point, Range} = require 'atom'
{BrowserWindow} = require('electron').remote

module.exports = AtomWebFun =
  subs: null
  asts: {}
  pkgs: {}
  config: {}
  browserWindow: null

  activate: (state) ->
    @subs = new CompositeDisposable
    @subs.add atom.commands.add 'atom-workspace', 'webfun:run': => @run()
    @subs.add atom.commands.add 'atom-workspace', 'webfun:build': => @build()
    @subs.add atom.commands.add 'atom-workspace', 'webfun:test': => @test()

  deactivate: ->
    if @browserWindow
        @browserWindow.close()
    @subs.dispose()

  run: ->
    if @browserWindow && !@browserWindow.isDestroyed()
        @browserWindow.webContents.executeJavaScript('window.location.reload()');
        @browserWindow.openDevTools({ mode: 'detach' })
        @browserWindow.show()
        return

    @browserWindow = new BrowserWindow({
        width: 534,
        height: 364,
        resizable: false,
        webPreferences: {
            backgroundThrottling: false
        }
    })
    @browserWindow.on('closed', -> @browserWindow = null)
    @browserWindow.loadURL("http://localhost:8080")
    @browserWindow.show()
    @browserWindow.openDevTools({ mode: 'detach' })

  build: ->
    if @buildTerminal
        return

  test: ->
    if @testTerminal
        return
