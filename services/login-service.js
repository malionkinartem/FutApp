var agentsKeeper = require('../services/agents-keeper');

function mapLoginData(agent) {
    return {
        id: agent.id, password: agent.password,
        secretKey: agent.secretkey, platform: agent.platform
    };
}

module.exports = {
    loginAll: function () {
        var agents = agentsKeeper.getAllAgents();

        agents.forEach(function (agent) {
            var loginData = mapLoginData(agent);

            agent.client.requestLogin(loginData, function (response) {
                if (response) {
                    agentsKeeper.loginAgent(loginData.id);
                }
            })
        });
    },
    login: function (data) {

        var agent = agentsKeeper.getAgent(data.loginId);
        var loginData = mapLoginData(agent);
        loginData.code = data.passCode;

        agent.client.requestLogin(loginData, function(response){
                if (response) {
                    agentsKeeper.loginAgent(loginData.id);
                }
        });
    },



}