(function () {
    PerfTest.MainView = {
        render: function () {
            var $container,
                html = [];

            html.push('<div id="PerfTest">');
            html.push('  <nav>');
            html.push('    <ul>');
            // todo: li's should be generated dynamically from registered modules (using names/ids of modules)
            html.push('       <li class="active" data-module-id="Main">Overview</li>');
            html.push('       <li data-module-id="TopOffenders">Top Offenders</li>');
//            html.push('       <li data-module-id="BadProtocols">Bad Protocol</li>');
            html.push('    </ul>');
            html.push('    <span class="close">&#x274c;</span>');
            html.push('  </nav>');
            html.push('  <div class="PerfTest-Content"></div>');
            html.push('</div>');

            $container = $(html.join("\n")).appendTo("body");

            return $container
        }
    };
}());