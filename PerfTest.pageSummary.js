(function () {

    // local vars/methods
    var Data = PerfTest.Data;

    PerfTest.PageSummary = {
        id: "PageSummary",
        name: "Page Summary",
        index: 1,
        $detailPanel: null,

        createDetailView: function (params) {
            $('<div>page summary detail view hello</div>').appendTo(params.element);
        },
        createDashboardView: function (params) {
            console.log(params);
            var html = [];
            var totalLoadTime = PerfTest.Data.getPageLoadTime();

            html.push('<div>');
            html.push('  <div>Page load time: ' + hello totalLoadTime + '</div>');
            html.push('</div>');

            $(html.join('\n')).appendTo(params.element);
        }
    };

}());
