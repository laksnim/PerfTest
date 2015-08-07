(function () {

    var perfTiming = performance.timing;
    var pageloadtime = perfTiming.loadEventStart - perfTiming.navigationStart;
    var dns = perfTiming.domainLookupEnd - perfTiming.domainLookupStart;
    var tcp = perfTiming.connectEnd - perfTiming.connectStart;
    var ttfb = perfTiming.responseStart - perfTiming.navigationStart;



    PerfTest.Data = {
        getPageLoadTime: function () {
            return pageloadtime;
        },
        getBadProtocolCounts: function () {

        }
    };
}());