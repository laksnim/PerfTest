(function () {

    // local vars/methods
    var Data = PerfTest.Data;

    PerfTest.TopOffenders = {
        id: "TopOffenders",
        name: "Top Offenders",
        index: 2,
        $detailPanel: null,


        createDetailView: function (params) {
            $('<div>Top offenders detail view</div>').appendTo(params.element);
        },

        createDashboardView: function (params) {
            var html = [];
            var totalLoadTime = PerfTest.Data.getPageLoadTime();
            var topOffenders = PerfTest.Data.getSlowResources();
            var maxItems = Math.min(topOffenders.length, 5);
            var i;

            console.log("slow stuff", topOffenders)
            html.push('<div>');
            html.push('  <h3>Very slow items: ' + topOffenders.length + '</h3>');
            html.push('  <ul>');
            for (i = 0; i < maxItems; i += 1) {
                html.push('    <li>');
                html.push('      <span class="TopOffenders-ratio">' + Math.round((topOffenders[i].duration/totalLoadTime)*100) + '%</span>');
                html.push('      <span class="TopOffenders-url">' + topOffenders[i].name + '</span>');
                html.push('    </li>');
            }
            html.push('  <ul>');
            html.push('</div>');

            $(html.join('\n')).appendTo(params.element);
        }
    };

}());
