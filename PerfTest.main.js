(function () {
    var Main = {
        initialized: false,

        // references created during init
        $container: null,
        $nav: null,
        $content: null,

        // reference created when renderOverview is called
        $detail: null,

        // store reference to last content panel for easy removal
        $activeDetail: null,

        // sub views?
        $overview1: null,
        $overview2: null,
        $overview3: null,

        initialize: function () {
            Main.renderInterface();
            Main.appendHandlers();
            Main.initialized = true;
        },
        renderInterface: function () {
            Main.$container = PerfTest.MainView.render();
            Main.$content = Main.$container.find(".PerfTest-Content");
            Main.$nav = Main.$container.find("nav");
//            var html = PerfTest.TopOffenders.renderOverview();

//            $("body").append("<div id='perfBox' style='right:0;padding-left:20px;position: fixed;width:850px;margin: 0;top: 0;z-index: 900;background: rgba(255, 255, 255, 0.95);color: #555;font-size: 20px;max-height: 500px;overflow-y:scroll;resize: both'><table id='myContent' style='width:100%'><thead><tr><th style='padding: 15px;padding-bottom:10px;width: 500px;word-wrap: break-word;'>Ratio (%)</th><th style='padding: 15px;text-align:center;padding-bottom:10px;width: 500px;word-wrap: break-word;'>URL</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Duration (ms)</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>DNS (ms)</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>TCP (ms)</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Waiting (ms)</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Content (ms)</th><th style='text-align: center;padding: 15px;padding-bottom:10px;'>Network Duration (ms)</th></tr></thead><tbody id='contentBody'></tbody></table></div>");

        },
        appendHandlers: function () {
            Main.$nav.on("click", "li", function () {
                var moduleId = $(this).data("module-id");
                Main.showDetail(moduleId);
            });
            Main.$container.find(".close").on("click", function () {
                Main.hide();
            });
        },

        /**
         * standard module method which needs to return jquery reference for the Dashboard module
         * @method getDashboardView
         * @returns {jQuery}
         */
        getDashboardView: function () {
            var html = [];

            html.push('<div>the meter goes here</div>')

            return $(html.join('\n'));
        },
        /**
         * standard module method which needs to return jquery reference for the panel content
         * @method getDetailView
         * @returns {jQuery}
         */
        getDetailView: function () {
            var html = [];
            if (!Main.$detail) {
                html.push('<div class="PerfTest-Dashboard">');
                html.push('  <div class="PerfTest-Dashboard-Module PerfTest-Module-Main"></div>');
                html.push('  <div class="PerfTest-Dashboard-Module PerfTest-Module-TopOffenders"></div>');
                html.push('  <div class="PerfTest-Dashboard-Module PerfTest-Module-BadProtocols">Module 3</div>');
                html.push('</div>');
                Main.$detail = $(html.join('\n'));
                Main.$detail.find('.PerfTest-Module-Main').append(PerfTest.Main.getDashboardView());
                Main.$detail.find('.PerfTest-Module-TopOffenders').append(PerfTest.TopOffenders.getDashboardView());
//                Main.$detail.find('.PerfTest-Module-BadProtocols').append(PerfTest.BadProtocols.getDashboardView());
            }
            return Main.$detail;
        },

        /**
         * invoked by bootstrap
         * @method show
         */
        show: function () {
            if (!Main.initialized) {
                Main.initialize();
            }
            Main.showDetail("Main");
            Main.$container.addClass("show");
        },
        hide: function () {
            Main.$container.removeClass("show");
        },

        showDetail: function (moduleId) {
            var $newDetail = PerfTest[moduleId].getDetailView();
            if (Main.$activeDetail) {
                Main.$activeDetail.detach();
            }
            Main.$content.append($newDetail);
            Main.$activeDetail = $newDetail;
        }
    };

    PerfTest.Main = Main;
}());