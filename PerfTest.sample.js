(function () {

    // local vars/methods
    var Data = PerfTest.Data;

    PerfTest.Sample = {
        /**
         * base fields for a module
         */
        id: "SampleId", // used to create class names
        name: "Page Summary", // displayed in lable
        index: 1, // must be unique, specifies tab/dashboard order
        $detailPanel: null, // reference added after createDetailView is called


        /**
         * base methods for a module. "Main" module does not provie a createDetailView. These methods are pass an
         * object with width, height and element properties. It is expected that this method will add it's own
         * html to the element
         *
         */
        createDetailView: function (params) {
            s('<div>Sample detail view</div>').appendTo(params.element);
        },
        createDashboardView: function (params) {
            var html = [];
            var totalLoadTime = PerfTest.Data.getPageLoadTime();

            html.push('<div>');
            html.push('  <div>Page load time: ' + totalLoadTime + '</div>');
            html.push('</div>');

            $(html.join('\n')).appendTo(params.element);
        }
    };

}());