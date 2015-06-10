if (performance ) {
 
        var t = performance.timing,
        pageloadtime = t.loadEventStart - t.navigationStart,
        dns = t.domainLookupEnd - t.domainLookupStart,
        tcp = t.connectEnd - t.connectStart,
        ttfb = t.responseStart - t.navigationStart;
  
  var loadtimeBucket ="unknown";
  
  if (pageloadtime<1000 && pageloadtime>100) {
   loadtimeBucket="[0.1-1]";
   } else if(pageloadtime>=1000 && pageloadtime<2000){
    loadtimeBucket="[1-2]";
   }else if(pageloadtime>=2000){
    loadtimeBucket="[2+]";
   };
  
  console.log(loadtimeBucket);
  
}   else {
 
console.log("browser not support w3c perf");
}
