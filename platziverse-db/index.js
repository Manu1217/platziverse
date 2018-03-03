'use strict'

const setupDatabase = require('./lib/db')
const setupAgenModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const defaults = require('defaults')
const setupAgent = require('./lib/agent')
const setupMetric = require('./lib/metric')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgenModel(config)
  const MetricModel = setupMetricModel(config)

  // define la relacion de las tablas
  // con funciones de Sequelize
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  // conecta a la bd para validar si esta bien
  // hace un query muy simple
  // es una promesa
  await sequelize.authenticate()

  if (config.setup) {
    // force:true -> si ya existe una bd, borrela y cree una nueva
    await sequelize.sync({force: true})
  }
  // toda la definicion de los modelos, si no existen en la bd
  // automaticamente las va a crear
  // lo vamos a implementar mas adelante
  // sequelize.sync()

  const Agent = setupAgent(AgentModel)
  const Metric = setupMetric(MetricModel, AgentModel)

  return {
    Agent,
    Metric
  }
}
