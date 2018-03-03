'use strict'

const EventEmitter = require('events')

class PlatziverseAgent extends EventEmitter {
    constructor(opts){
        super() // llamamos al constructor de la clase extendida
        this._options = opts
        this._starterd = false
        this._timer = null
        
    }
    connect() {
        if (!this._starterd){
            this._starterd = true
            
            this.emit('connected')
            const opts = this._options
            this._timer = setInterval(() => {
                this.emit('agent/message', 'this is a message')
            }, opts.interval)
        }
    }
    disconnect(){
        if(this._starterd) {
            clearInterval(this._timer)
            this._starterd = false
            this.emit('disconnected')
        }
    }

}

module.exports = PlatziverseAgent