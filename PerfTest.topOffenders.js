(function () {

    // local vars/methods
    var Data = PerfTest.Data;

    PerfTest.TopOffenders = {
        $detail: null,

        renderOverview: function (params) {
            //            params = {
            //                width: 0,
            //                height: 0
            //            }

//            var Data.getLongestResources(25);
        },
        getDetailView: function (params) {
            console.log(PerfTest)
            if (!this.$detail) {
                this.$detail = $(PerfTest.TopOffendersView.getDetailHtml());
            }

            return this.$detail;
        }
    };

}());