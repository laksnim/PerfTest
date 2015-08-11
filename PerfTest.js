(function () {
    var STATE_NOT_LOADED = 'not_loaded';
    var STATE_LOADING = 'loading';
    var STATE_LOADED = 'loaded';

    if (typeof PerfTest == "undefined") {
        PerfTest = {
            state: STATE_NOT_LOADED,
            modules: [],

            config: {
                domain: '127.0.0.1:8887',
                // todo: concat all js files into one
                jsFiles: [
                    // utils
                    'PerfTest.arrayUtils.js',

                    // data provider
                    'PerfTest.data.js',

                    // main file
                    'PerfTest.main.js',

                    // modules
                    'PerfTest.pageSummary.js',
                    'PerfTest.topOffenders.js',
                    'PerfTest.badProtocols.js'
                ],
                cssFiles: ['PerfTest.css']
            }
        };
    }

    var fileCount = 0;

    var PerfBootstrap = {
        initialize: function () {
            var module;
            for (module in PerfTest) {
                // if looks like a module, add to array
                if (PerfTest.hasOwnProperty(module)) {
                    // todo: this check could be more robust (presence of id is rather weak duck type check)
                    if (PerfTest[module].id) {
                        PerfTest.modules[PerfTest[module].index] = PerfTest[module];
                    }
                }
            }
        },
        /**
         * start is called after all js is loaded
         */
        start: function () {
            PerfTest.Main.show();
        },
        loadCss: function (url) {
            var link = document.createElement("link");
            link.href = url;
            link.type = "text/css";
            link.rel = "stylesheet";
            link.media = "screen";
            document.getElementsByTagName("head")[0].appendChild(link);
        },
        loadJs: function (url) {
            var script = document.createElement( 'script' );
            fileCount++;
            script.src = url;
            script.onload = function () {
                if (--fileCount === 0) {
                    PerfTest.state = STATE_LOADED;
                    PerfBootstrap.initialize();
                    PerfBootstrap.start();
                }
            };
            document.body.appendChild(script);
        },
        loadAllFiles: function () {
            PerfTest.state = STATE_LOADING;
            // get css loading first to help avoid fouc
            PerfTest.config.cssFiles.forEach(function (fileName) {
                PerfBootstrap.loadCss('http://' + PerfTest.config.domain + '/' + fileName);
            });

            // load libs, if needed
            if (typeof jQuery == 'undefined') {
                PerfBootstrap.loadJs('http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
            }

            if (typeof d3 == 'undefined') {
                PerfBootstrap.loadJs('http://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js');
            }

            // load Perf js files
            PerfTest.config.jsFiles.forEach(function (fileName) {
                PerfBootstrap.loadJs('http://' + PerfTest.config.domain + '/' + fileName);
            });
        }
    };

    // this file may called several times on a page, check state to figure out what should be called
    if (PerfTest.state == STATE_NOT_LOADED) {
        // begin loading required css/js
        PerfBootstrap.loadAllFiles();
    } else if (PerfTest.state == STATE_LOADED) {
        // already loaded, show stuff
        PerfBootstrap.start();
    }
    // if in the middle of loading, do nothing

}());


/*

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


 $("body").append("<div id='perfBox' style='right:0;padding-left:20px;position: fixed;width:850px;margin: 0;top: 0;z-index: 900;background: rgba(255, 255, 255, 0.95);color: #555;font-size: 20px;max-height: 500px;overflow-y:scroll;resize: both'><table id='myContent' style='width:100%'><thead><tr><th style='padding: 15px;padding-bottom:10px;width: 500px;word-wrap: break-word;'>Ratio (%)</th><th style='padding: 15px;text-align:center;padding-bottom:10px;width: 500px;word-wrap: break-word;'>URL</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Duration (ms)</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>DNS (ms)</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>TCP (ms)</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Waiting (ms)</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Content (ms)</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Network Duration (ms)</th></tr></thead><tbody id='contentBody'></tbody></table></div>");

 var perfBox = $('#perfBox');

 perfBox.prepend('<p style="margin-top:20px"><span style="margin-right: 20px">'+'Page Load Time:'+pageloadtime+'ms'+'</span><span style="margin-right: 20px">'+'DNS:'+dns+'ms'+'</span><span style="margin-right: 20px">'+'TCP:'+tcp+'ms'+'</span><span style="margin-right: 20px">'+'TTFB:'+ttfb+'ms'+'</span></p>');

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

 var ratio= Math.round((resource.duration/pageloadtime)*100);

 $('#contentBody').append("<tr style='border-bottom: solid 1px orange'><td style='color:purple;text-align:center;margin-top: 11px;max-width: 550px;word-wrap: break-word;'>"+ratio+"</td><td style='color:orange;margin-top: 11px;max-width: 550px;word-wrap: break-word;'>"+shortenedUrl+"</td><td style='text-align: center'>"+Math.round(resource.duration)+"</td><td style='text-align: center'>"+Math.round(dnsR)+"</td><td style='text-align: center'>"+Math.round(tcpR)+"</td><td style='text-align: center'>"+Math.round(waitingR)+"</td><td style='text-align: center'>"+Math.round(contentR)+"</td><td style='text-align: center'>"+Math.round(networkDuration)+"</td></tr>");

 }
 }
 */
