(function () {

    // local vars/methods
    var Data = PerfTest.Data;

    PerfTest.BadProtocols = {
        id: "BadProtocols",
        name: "Bad Protocols",
        index: 3,
        $detailPanel: null,

        createDetailView: function (params) {
            $('<div>bad protocols</div>').appendTo(params.element);
        },
        createDashboardView: function (params) {
            var html = [];
            var totalLoadTime = PerfTest.Data.getPageLoadTime();

            html.push('<div>');
            html.push('  <div>bad protocols dash view</div>');
            html.push('</div>');

            $(html.join('\n')).appendTo(params.element);
        }
    };

}());