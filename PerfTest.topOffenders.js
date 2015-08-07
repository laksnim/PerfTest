(function () {

    // local vars/methods
    var Data = PerfTest.Data;

    PerfTest.TopOffenders = {
        $detail: null,

        getDetailView: function (params) {
            if (!this.$detail) {
                this.$detail = $(PerfTest.TopOffendersView.getDetailHtml());
            }

            return this.$detail;
        },
        getDashboardView: function (params) {
            var html = [];
            var totalLoadTime = PerfTest.Data.getPageLoadTime();
            var topOffenders = PerfTest.Data.getSlowResources();
            var maxItems = Math.min(topOffenders.length, 5);
            var i;
            console.log("slow stuff", topOffenders)
            html.push('<div>');
            html.push('  <div>Very slow items: ' + topOffenders.length + '</div>');
            html.push('  <ul>');
            for (i = 0; i < maxItems; i += 1) {
                html.push('    <li>');
                html.push('      <span class="TopOffenders-ratio">' + Math.round((topOffenders[i].duration/totalLoadTime)*100) + '%</span>');
                html.push('      <span class="TopOffenders-url">' + topOffenders[i].name + '</span>');
                html.push('    </li>');
            }
            html.push('  <ul>');

            html.push('</div>');
            //            params = {
            //                width: 0,
            //                height: 0
            //            }

//            var Data.getLongestResources(25);
            return $(html.join('\n'));
        }
    };

}());