(function () {
    var Main = {
        id: "Main",
        name: "Overview",
        index: 0,
        $detailPanel: null,


        initialized: false,

        // references created during init
        $container: null,
        $nav: null,
        $content: null,

        initialize: function () {
            Main.renderInterface();
            Main.appendHandlers();
            Main.initialized = true;
        },
        renderInterface: function () {
            var $container;
            var html = [];
            var i;
            var modules = PerfTest.modules;

            html.push('<div id="PerfTest">');
            html.push('  <nav>');
            html.push('    <ul>');
            for (i = 0; i < modules.length; i += 1) {
                html.push('       <li class="active" data-module-id="' + modules[i].id + '">' + modules[i].name + '</li>');
            }
            html.push('    </ul>');
            html.push('    <span class="close">&#x274c;</span>');
            html.push('  </nav>');
            html.push('  <div class="PerfTest-Content">');
            for (i = 0; i < modules.length; i += 1) {
                html.push('    <div class="PerfTest-Content-Module PerfTest-Content-' + modules[i].id + '"></div>');
            }
            html.push('  </div>');
            html.push('</div>');

            $container = $(html.join("\n")).appendTo("body");

            Main.$container = $container;
            Main.$content = Main.$container.find(".PerfTest-Content");
            Main.$nav = Main.$container.find("nav");
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
         * standard module method which needs to return jquery reference for the panel content
         * @method createDetailView
         * @returns {jQuery}
         */
        createDetailView: function (params) {
            var html = [];
            var i;
            var $dashboard;
            var module;
            var $container;

            html.push('<div class="PerfTest-Dashboard">');
            for (i = 0; i < PerfTest.modules.length; i += 1) {
                module = PerfTest.modules[i];
                if (module.createDashboardView) {
                    html.push('  <div class="PerfTest-Dashboard-Module PerfTest-Module-' + PerfTest.modules[i].id + '"></div>');
                }
            }
            html.push('</div>');

            $dashboard = $(html.join('\n')).appendTo(params.element);

            for (i = 0; i < PerfTest.modules.length; i += 1) {
                module = PerfTest.modules[i];
                $container = $dashboard.find('.PerfTest-Module-' + PerfTest.modules[i].id);
                if (module.createDashboardView) {
                    console.log("width/height",$container.width(),$container.height())
                    PerfTest.modules[i].createDashboardView({
                        width: $container.width(),
                        height: $container.height(),
                        element: $container[0]
                    });
                }
            }
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
            var module = PerfTest[moduleId];
            var $panelContainer = this.$content.find(".PerfTest-Content-" + moduleId);
            if (!module.$detailPanel) {
                module.$detailPanel = $panelContainer;
                PerfTest[moduleId].createDetailView({
                    width: 0,
                    height: 0,
                    element: $panelContainer[0]
                });
            }

            // add/remove class
            this.$content.find(".PerfTest-Content-Module.active").removeClass("active");
            $panelContainer.addClass("active");
        }
    };

    PerfTest.Main = Main;
}());