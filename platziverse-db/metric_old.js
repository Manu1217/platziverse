'use strict'

module.exports = function setupMetric(MetricModel, AgentModel) {
    async function findByAgentUuid(uuid) {
        // arreglo que se le pasa a sqlize para que devuelva
        return MetricModel.findAll({
            attributes: ['type'],
            group: ['type'],
            include: [{
                attributes: [],
                model: AgentModel,
                where: {
                    uuid
                }
            }],
            raw: true
        })
    }

    async function findByTypeAgentUuid(type, uuid) {
        return MetricModel.findAll({
            // like select attribures
            attributes: ['id', 'type', 'value', 'createdAt'],
            where: {
                type
            },
            limit: 20,
            order: [['createdAt', 'DESC']],
            include: [{
                attribures: [],
                model: AgentModel, // con quien se hace el join
                where: {
                    uuid
                }
            }],
            raw: true
        })
    }
    async function create(uuid, metric) {
        const agent = await AgentModel.findOne({
            where: { uuid }
        })

        if (agent) {
            Object.assign(metric, { AgentId: agent.id })
            const result = await MetricModel.create(metric)

            return result.toJSON()
        }
    }

    return {
        create,
        findByAgentUuid,
        findByTypeAgentUuid
    }
}