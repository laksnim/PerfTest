(function () {
    var test = 2;
    PerfTest.TopOffendersView = {
        getDetailHtml: function () {
            var html = [];

            html.push('<div>Top offenders detail view</div>');
            return html.join("\n");
        }
    };
}());