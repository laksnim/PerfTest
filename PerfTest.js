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

    $("body").append('<div id="perfBox" style="right:0;padding-left:20px;position: fixed;width:600px;margin: 0;top: 0;z-index: 900;background: rgba(255, 255, 255, 0.95);color: #555;font-size: 20px;max-height: 500px;overflow-y:scroll;resize: both"></div>');

    var perfBox = $('#perfBox');

    var contentTable = "<table id='myContent' style='width:100%'><thead><tr><th>URL</th><th>Duration</th><th>DNS</th><th>TCP</th><th>Waiting</th><th>Content</th><th>Network Duration</th></tr></thead><tbody></tbody></table>";
    perfBox.append('<p>'+'Page Load Time:'+pageloadtime+'</p>');
    perfBox.append('<p>'+'DNS:'+dns+'</p>');
    perfBox.append('<p>'+'TCP:'+tcp+'</p>');
    perfBox.append('<p>'+'TTFB:'+ttfb+'</p>');

    perfBox.append(contentTable);

    // Resource Timing
    var r = performance.getEntriesByType("resource");
//        console.log(r);
    for(var i=0;i<=r.length;i++){
        var dnsR=r[i].domainLookupEnd - r[i].domainLookupStart;
        var tcpR=r[i].connectEnd - r[i].connectStart;
        var waitingR=r[i].responseStart - r[i].startTime;
        var contentR = r[i].responseEnd - r[i].responseStart;
        var networkDuration = dnsR+tcpR+waitingR+contentR;

        var resUrl = r[i].name.split('/');
        var urlLength = resUrl.length;
        var shortenedUrl= resUrl[0]+resUrl[1]+resUrl[2]+"..."+(resUrl[urlLength-1].split('?'))[0];

        $('#myContent tbody').append("<tr><td style='color:orange;margin-top: 11px;'>"+shortenedUrl+"</td><td>"+r[i].duration+"</td><td>"+dnsR+"</td><td>"+tcpR+"</td><td>"+waitingR+"</td><td>"+contentR+"</td><td>"+networkDuration+"</td></tr>");
//        contentBody.append("<tr></tr>");

    }
}


//dns = r.domainLookupEnd - r.domainLookupStart;
//tcp = r.connectEnd - r.connectStart; // includes ssl negotiation
//waiting = r.responseStart - r.requestStart;
//content = r.responseEnd - r.responseStart;
//networkDuration = dns + tcp + waiting + content;
