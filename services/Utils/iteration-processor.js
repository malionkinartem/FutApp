module.exports = {
    process: function (action, count, minDelay, maxDelay) {
        var index = 1;
        var callback = function () {
            index++;
            var timeout = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;

            setTimeout(function () {

                if (count === undefined || index < count) {
                    action(callback);
                }
                
            }, timeout);
        }

        action(callback);
    }
}