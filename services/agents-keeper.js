var FutService = require('../services/futservice');
// var FutService = require('../services/mocks/fut-service-mock')

var agents = new Array();
agents = [
{
    id: "coinsup87@bk.ru",
    password: "Asdfg99Asdfg",
    platform: "ps4",
    secretkey: "gerrard",
    client: new FutService("coinsup87@bk.ru")
}
,
{
    id: "coinsup88@bk.ru",
    password: "Asdfg99Asdfg",
    platform: "ps4",
    secretkey: "gerrard",
    client: new FutService("coinsup88@bk.ru")
}
];

module.exports = {
    getAllAgents: function () {
        return agents;
    },

    addAgent: function (agent) {
        var existAgent = this.getAgent(agent.id);

        if (!existAgent) {
            agents.push({ id: agent.id, futClient: agent.client, loggedIn: false, enabled: false });
        }
    },

    addAgents: function (agents) {
        agents.forEach(function (agent) {
            addAgent(agent);
        })
    },

    loginAgent: function (agentId) {
        var agent = agents.find(function (item) {
            return item.id === agentId;
        });

        if (agent != undefined) {
            agent.loggedIn = true;
        }
    },

    enable: function (agentId) {
        var agent = agents.find(function (agent) {
            return agent.id === agentId;
        });

        if (agent != undefined) {
            agent.enabled = true;
        }
    },

    enableAll: function () {
        agents.forEach(function (agent) {
            agent.enabled = true;
        })
    },
    disableAll: function () {
        agents.forEach(function (agent) {
            agent.enabled = false;
        })
    },
    loggedInAgents: function () {
        return agents.filter(function (agent) { return agent.loggedIn });
    },

    getAgent: function (agentId) {
        return agents.find(function (agent) { return agent.id === agentId; })
    }
}