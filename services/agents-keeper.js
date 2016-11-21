var agents = new Array();

module.exports = {
    getAllAgents: function () {
        return agents;
    },

    addAgent: function (agent) {
        var existAgent = this.getAgent(agent.Id);

        if (!existAgent) {
            agents.push({ Id: agent.Id, futClient: agent.client, loggedIn: false });
        }
    },

    addAgents: function (agents) {
        agents.forEach(function (agent) {
            addAgent(agent);
        })
    },

    loginAgent: function (agentId) {
        var agent = agents.find(function (agent) {
            return agent.Id === agentId;
        });

        if (agent != undefined) {
            agent.loggedIn = true;
        }
    },

    loggedInAgents: function () {
        return agents.filter(function (agent) { return agent.loggedIn });
    },

    getAgent: function (agentId) {
        return agents.find(function (agent) { return agent.Id === agentId; })
    }
}