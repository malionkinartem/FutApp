module.exports = {
    process: function (action, count, minDelay, maxDelay, finishCallback) {
        var index = 1;
        var repeatFunction = function (continueProcessing) {

            if (continueProcessing !== false) {

                index++;
                var timeout = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;

                setTimeout(function () {

                    if (count === undefined || index < count) {
                        action(repeatFunction);
                    }
                    else
                    {
                        finishCallback();
                    }

                }, timeout);
            }
        }

        action(repeatFunction);
    }
}