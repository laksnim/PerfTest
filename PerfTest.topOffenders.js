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
            html.push('<div>top offenders module here</div>');
            //            params = {
            //                width: 0,
            //                height: 0
            //            }

//            var Data.getLongestResources(25);
            return $(html.join('\n'));
        }
    };

}());