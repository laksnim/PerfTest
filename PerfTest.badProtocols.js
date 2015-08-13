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
            var height = params.height * 0.8;
            var width = params.width;
            var counts = PerfTest.Data.getBadProtocolCounts();

            var data = [counts.good, counts.bad];

            $(params.element).append('<h3>' + counts.bad + ' bad protocols</h3>')

            var color = d3.scale.ordinal()
                .range(['#8dca2f','#c50200']);

            var canvas = d3.select(params.element)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            var group = canvas.append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(Math.min(width,height) * 0.5);

            var pie = d3.layout.pie()
                .value(function(d){return d;});

            var arcs = group.selectAll('.arc')
                .data(pie(data))
                .enter()
                .append('g')
                .attr('class','arc');

            arcs.append('path')
                .attr('d',arc)
                .attr('fill',function(d){return color(d.data)});
        }
    };

}());
