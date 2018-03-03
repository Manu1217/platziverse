'use strict'

module.exports = function setupAgent (AgentModel) {
  async function createOrUpdate (agent) {
        // similar a los queries en base de datos
        // hace como join donde se cumpla ese where, obj de sequilize
    const cond = {
      where: {
        uuid: agent.uuid
      }
    }
        // findOne es la funcion del modelo definido
    const existingAgent = await AgentModel.findOne(cond)

    if (existingAgent) {
      const updated = await AgentModel.update(agent, cond)
      return updated ? AgentModel.findOne(cond) : existingAgent
    }

        // early return
    const result = await AgentModel.create(agent)
    return result.toJSON()
  }

  function findById (id) {
    return AgentModel.findById(id)
  }

  function findByUuid (uuid) {
    return AgentModel.findOne({
      where: {
        uuid
      }
    })
  }

  function findAll () {
    return AgentModel.findAll()
  }

  function findConnected () {
    return AgentModel.findAll({
      where: {
        connected: true
      }
    })
  }

  function findByUsername (username) {
    return AgentModel.findAll({
      where: {
        username,
        connected: true
      }
    })
  }
  return {
    findAll,
    findByUsername,
    findConnected,
    findByUuid,
    createOrUpdate,
    findById
  }
}
