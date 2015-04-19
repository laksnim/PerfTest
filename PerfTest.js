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
    console.log(t);
    $("body").append('<div id="perfBox" style="right:0;padding-left:20px;position: fixed;width:600px;margin: 0;top: 0;z-index: 900;background: rgba(255, 255, 255, 0.95);color: #555;font-size: 20px;max-height: 500px;overflow-y:scroll;resize: both"></div>');
    var perfBox = $('#perfBox');
    var contentTable = "<table id='myContent' style='width:100%'><thead><tr><th>URL</th><th>Duration</th><th>DNS</th><th>TCP</th><th>TTFB</th></tr></thead><tbody></tbody></table>";
    var contentsInTable = $('#myContent tbody')
    contentsInTable.append('<p>'+'Page Load Time:'+pageloadtime+'</p>');
    contentsInTable.append('<p>'+'DNS:'+dns+'</p>');
    contentsInTable.append('<p>'+'TCP:'+tcp+'</p>');
    contentsInTable.append('<p>'+'TTFB:'+ttfb+'</p>');
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
