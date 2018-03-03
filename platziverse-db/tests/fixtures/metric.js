'use strict'

const agentFixtures = require('./agent')

const metric = {
    id: 1,
    agentId: 1,
    type: 'cpu',
    value: '55%',
    createdAt: new Date(),
    updatedAt: new Date(),
    agent: agentFixtures.byId(1)
}

const metrics = [
    metric,
    agentFixtures.extend(metric,{ id: 2, type: 'temperature', value: '45Cº' }),
    agentFixtures.extend(metric,{ id: 3, type: 'humidity', value: '23%' }),
    agentFixtures.extend(metric,{ id: 4, type: 'storage', value: '24kb/s' }),
    agentFixtures.extend(metric,{ id: 5, type: 'network', value: '320 bytes/s' })
]

module.exports = {
    single: metric,
    all: metrics,
    findByAgentUuid: metrics.filter(a => agent.uuid === a.uuid)
}