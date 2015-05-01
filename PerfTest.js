if (!($ = window.jQuery)) { // typeof jQuery=='undefined' works too
    script = document.createElement( 'script' );
    script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
    script.onload = releaseCode;
    document.body.appendChild(script);
}
else {
    releaseCode();
}

function releaseCode() {
    var t = performance.timing,
        pageloadtime = t.loadEventStart - t.navigationStart,
        dns = t.domainLookupEnd - t.domainLookupStart,
        tcp = t.connectEnd - t.connectStart,
        ttfb = t.responseStart - t.navigationStart;


    $("body").append("<div id='perfBox' style='right:0;padding-left:20px;position: fixed;width:850px;margin: 0;top: 0;z-index: 900;background: rgba(255, 255, 255, 0.95);color: #555;font-size: 20px;max-height: 500px;overflow-y:scroll;resize: both'><table id='myContent' style='width:100%'><thead><tr><th style='padding: 15px;padding-bottom:10px;width: 500px;word-wrap: break-word;'>URL</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Duration</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>DNS</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>TCP</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Waiting</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Content</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Network Duration</th></tr></thead><tbody id='contentBody'></tbody></table></div>");

    var perfBox = $('#perfBox');

    perfBox.prepend('<p style="margin-top:20px"><span style="margin-right: 20px">'+'Page Load Time:'+pageloadtime+'</span><span style="margin-right: 20px">'+'DNS:'+dns+'</span><span style="margin-right: 20px">'+'TCP:'+tcp+'</span><span style="margin-right: 20px">'+'TTFB:'+ttfb+'</span></p>');

    // Resource Timing
    var r = performance.getEntriesByType("resource");


    function sortProperties(obj)
    {
        // convert object into array
        var sortable=[];
        for(var key in obj)
            if(obj.hasOwnProperty(key))
                sortable.push([key, obj[key]]); // each item is an array in format [key, value]

        // sort items by value
        sortable.sort(function(a, b)
        {
            var x=a[1].duration,
                y=b[1].duration;
            return x>y ? -1 : x<y ? 1 : 0;
        });
        return sortable;
    }

    var sortedResources=sortProperties(r);

    for(var i=0;i<=r.length;i++){
        var resource= (sortedResources[i])[1];
        var dnsR=resource.domainLookupEnd - resource.domainLookupStart;
        var tcpR=resource.connectEnd - resource.connectStart;
        var waitingR=resource.responseStart - resource.startTime;
        var contentR = resource.responseEnd - resource.responseStart;
        var networkDuration = dnsR+tcpR+waitingR+contentR;

        var resUrl = resource.name.split('/');
        var urlLength = resUrl.length;
        var shortenedUrl= resUrl[0]+resUrl[1]+resUrl[2]+"..."+(resUrl[urlLength-1].split('?'))[0];

        $('#contentBody').append("<tr style='border-bottom: solid 1px orange'><td style='color:orange;margin-top: 11px;max-width: 550px;word-wrap: break-word;'>"+shortenedUrl+"</td><td style='text-align: center'>"+Math.round(resource.duration)+"</td><td style='text-align: center'>"+Math.round(dnsR).toFixed(2)+"</td><td style='text-align: center'>"+Math.round(tcpR).toFixed(2)+"</td><td style='text-align: center'>"+Math.round(waitingR).toFixed(2)+"</td><td style='text-align: center'>"+Math.round(contentR).toFixed(2)+"</td><td style='text-align: center'>"+Math.round(networkDuration).toFixed(2)+"</td></tr>");

    }
}
