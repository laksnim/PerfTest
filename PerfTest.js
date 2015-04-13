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
    var performance = {
  "onwebkitresourcetimingbufferfull": null,
  "memory": {
    "jsHeapSizeLimit": 793000000,
    "usedJSHeapSize": 11900000,
    "totalJSHeapSize": 24500000
  },
  "timing": {
    "loadEventEnd": 1428953827476,
    "loadEventStart": 1428953827472,
    "domComplete": 1428953827468,
    "domContentLoadedEventEnd": 1428953827046,
    "domContentLoadedEventStart": 1428953826999,
    "domInteractive": 1428953826999,
    "domLoading": 1428953825640,
    "responseEnd": 1428953825781,
    "responseStart": 1428953825625,
    "requestStart": 1428953825612,
    "secureConnectionStart": 0,
    "connectEnd": 1428953825608,
    "connectStart": 1428953825608,
    "domainLookupEnd": 1428953825608,
    "domainLookupStart": 1428953825608,
    "fetchStart": 1428953825608,
    "redirectEnd": 0,
    "redirectStart": 0,
    "unloadEventEnd": 1428953825632,
    "unloadEventStart": 1428953825629,
    "navigationStart": 1428953825608
  },
  "navigation": {
    "redirectCount": 0,
    "type": 1
  }
};
    var t = performance.timing,
        pageloadtime = t.loadEventStart - t.navigationStart,
        dns = t.domainLookupEnd - t.domainLookupStart,
        tcp = t.connectEnd - t.connectStart,
        ttfb = t.responseStart - t.navigationStart;
    console.log(t);
    $("body").append('<div id="perfBox" style="right:0;padding-left:20px;position: fixed;width:600px;margin: 0;top: 0;z-index: 900;background: rgba(255, 255, 255, 0.95);color: #555;font-size: 20px;max-height: 500px;overflow-y:scroll;resize: both"></div>');
    var perfBox = $('#perfBox');
    var contentTable = "<table id='myContent' style='width:100%'><thead><tr><th>URL</th><th>Duration</th><th>DNS</th><th>TCP</th><th>TTFB</th></tr></thead></table>";
    perfBox.append('<p>'+'Page Load Time:'+pageloadtime+'</p>');
    perfBox.append('<p>'+'DNS:'+dns+'</p>');
    perfBox.append('<p>'+'TCP:'+tcp+'</p>');
    perfBox.append('<p>'+'TTFB:'+ttfb+'</p>');
    perfBox.append(contentTable);
    contentTable = $('#myContent');
    var contentBody = contentTable.append('<tbody></tbody>');
//    var tableTr = $('#theRow');

    // Resource Timing
    var r = performance.getEntriesByType("resource");
//    perfBox.append('<table></table>');
    for(var i=0;i<=r.length;i++){

        var dnsR=r[i].domainLookupEnd - r[i].domainLookupStart,
            tcpR=r[i].connectEnd - r[i].connectStart,
            ttfbR=r[i].responseStart - r[i].startTime;

        resUrl = r[i].name.split('/');
        urlLength = resUrl.length;
        shortenedUrl= resUrl[0]+resUrl[1]+resUrl[2]+"..."+(resUrl[urlLength-1].split('?'))[0];
        contentBody.append('<tr id="row"+i></tr>');
        rowNumber=$('#row'+[i]);
        console.log(rowNumber);
//        tableTr.append('<td style="color:orange;margin-top: 11px;">'+shortenedUrl+'</td>');
//        tableTr.append('<td>loadtime:'+r[i].duration+'</td>');
//        tableTr.append('<td>dns:'+dnsR+'</td>');
//        tableTr.append('<td>tcp:'+tcpR+'</td>');
//        tableTr.append('<td>ttfb:'+ttfbR+'</td>');
//        perfBox.append('</tr>');
    }
//    perfBox.append('</table>');

}

$( ".perfBoxClose" ).click(function() {
    $( "#perfBox" ).remove();
});

//dns = r.domainLookupEnd - r.domainLookupStart;
//tcp = r.connectEnd - r.connectStart; // includes ssl negotiation
//waiting = r.responseStart - r.requestStart;
//content = r.responseEnd - r.responseStart;
//networkDuration = dns + tcp + waiting + content;
