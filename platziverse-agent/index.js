'use strict'

const debug = require('debug')('platziverse:agent')
const mqtt = require('mqtt')
const os = require('os')
const util = require('util')
const defaults = require('defaults')
const EventEmitter = require('events')
const { parsePayload } = require('./utils')
const uuid = require('uuid')

const options = {
    name: 'untitled',
    username: 'platzi',
    interval: '5000',
    mqtt: {
        host: 'mqtt://localhost'
    }
}

class PlatziverseAgent extends EventEmitter {
    constructor(opts) {
        super() // llamamos al constructor de la clase extendida
        this._options = defaults(opts, options)
        this._starterd = false
        this._timer = null
        this._client = null
        this._agentId = null
        this._metrics = new Map()
    }

    addMetric(type, fn) {
        this._metrics.set(type, fn)
    }
    removeMetric(type) {
        this._metrics.delete(type)
    }
    connect() {
        if (!this._starterd) {
            const opts = this._options
            this._client = mqtt.connect(opts.mqtt.host)
            this._starterd = true

            /* Subscribo al cliente a los mensajes que vamos a recibir*/

            this._client.subscribe('agent/message')
            this._client.subscribe('agent/connected')
            this._client.subscribe('agent/disconnected')

            this._client.on('connect', () => {
                this._agentId = uuid.v4()

                this.emit('connected')
                this._timer = setInterval(async () => {
                    if (this._metrics.size > 0) {
                        let message = {
                            agent: {
                                uuid: this._agentId,
                                username: opts.username,
                                name: opts.name,
                                hostname: os.hostname() || 'localhost',
                                pid: process.pid
                            },
                            metrics: [],
                            timestamp: new Date().getTime()
                        }
                    }
                    
                    for(let [ metric, fn ] of this._metrics){
                        if (fn.length == 1) {
                            fn = util.promisify(fn)
                        }

                        message.metrics.push({
                            type: metric,
                            value: await Promise.resolve(fn())
                        })
                    }
                    debug('Sending', message)

                    this._client.publish('agent/message', JSON.stringify(message))
                    this.emit('message', message)
                }, opts.interval)
            })

            this._client.on('message', (topic, payload) => {
                payload = parsePayload(payload)

                let broadcast = false

                switch (topic) {
                    case 'agent/connected':
                    case 'agent/disconnected':
                    case 'agent/message':
                        broadcast = payload && payload.agent && payload.agent.uuid != this._agentId
                }

                if (broadcast) {
                    this.emit(topic, payload)
                }
            })

            this._client.on('error', () => this.disconnect())

        }
    }
    disconnect() {
        if (this._starterd)  {
            clearInterval(this._timer)
            this._starterd = false
            this.emit('disconnected', this._agentId)
            this._client.end()
        }
    }

}

module.exports = PlatziverseAgent