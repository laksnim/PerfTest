(function () {

    var perfTiming = performance.timing;
    var pageloadtime = perfTiming.loadEventStart - perfTiming.navigationStart;
    var dns = perfTiming.domainLookupEnd - perfTiming.domainLookupStart;
    var tcp = perfTiming.connectEnd - perfTiming.connectStart;
    var ttfb = perfTiming.responseStart - perfTiming.navigationStart;
    // Resource Timing
    var resources = performance.getEntriesByType("resource");



/*
    for(var i=0;i<=resources.length;i++){
        var resource= (sortedResources[i])[1];
        var dnsR=resource.domainLookupEnd - resource.domainLookupStart;
        var tcpR=resource.connectEnd - resource.connectStart;
        var waitingR=resource.responseStart - resource.startTime;
        var contentR = resource.responseEnd - resource.responseStart;
        var networkDuration = dnsR+tcpR+waitingR+contentR;

        var resUrl = resource.name.split('/');
        var urlLength = resUrl.length;
        var shortenedUrl= resUrl[0]+resUrl[1]+resUrl[2]+"..."+(resUrl[urlLength-1].split('?'))[0];

        var ratio= Math.round((resource.duration/pageloadtime)*100);

        $('#contentBody').append("<tr style='border-bottom: solid 1px orange'><td style='color:purple;text-align:center;margin-top: 11px;max-width: 550px;word-wrap: break-word;'>"+ratio+"</td><td style='color:orange;margin-top: 11px;max-width: 550px;word-wrap: break-word;'>"+shortenedUrl+"</td><td style='text-align: center'>"+Math.round(resource.duration)+"</td><td style='text-align: center'>"+Math.round(dnsR)+"</td><td style='text-align: center'>"+Math.round(tcpR)+"</td><td style='text-align: center'>"+Math.round(waitingR)+"</td><td style='text-align: center'>"+Math.round(contentR)+"</td><td style='text-align: center'>"+Math.round(networkDuration)+"</td></tr>");

    }
*/


    PerfTest.Data = {
        getPageLoadTime: function () {
            return pageloadtime;
        },
        getSlowResources: function () {
            var threshold = pageloadtime / 4;
            var filteredResources = PerfTest.ArrayUtils.objectFilter(resources, {
                matchType: "all",
                criteria: [
                    {field: "duration", value: threshold, operator: "greaterThan"}
                ]
            });

            return PerfTest.ArrayUtils.objectSort(filteredResources, [
                {field: "duration", direction: "desc", type: "number"}
            ]);
        },
        getBadProtocolCounts: function () {
            var thisProtocol = document.location.protocol;
            var good = 0;
            var bad = 0;
            var i = 0;
            var len = resources.length;

            for (i = 0; i < len; i += 1) {
                if (resources[i].name.indexOf(thisProtocol) === 0) {
                    good++;
                } else {
                    bad++;
                }
            }

            return {
                good: good,
                bad: bad
            }
        }
    };
}());