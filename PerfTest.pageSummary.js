(function () {

    // local vars/methods
    var Data = PerfTest.Data;

    PerfTest.PageSummary = {
        id: "PageSummary",
        name: "Page Summary",
        index: 1,
        $detailPanel: null,

        createDetailView: function (params) {
            $('<div>page summary detail view</div>').appendTo(params.element);
        },
        createDashboardView: function (params) {
            var totalLoadTime = PerfTest.Data.getPageLoadTime() / 1000;
            var maxLoadTime = 10;
            var percent = Math.min(totalLoadTime/maxLoadTime, 10);


            $(params.element).append('<h3>Load time: ' + totalLoadTime + '</h3>');

            var percToDeg = function(perc) {
                return perc * 360;
            };
            var percToRad = function(perc) {
                return degToRad(percToDeg(perc));
            };
            var degToRad = function(deg) {
                return deg * Math.PI / 180;
            };

            var width = params.width * 0.8;
            var height = width/2;
            var arcRadius = height;
            var needleBaseRadius = width/60;
            var arcThickness = width/20;
            var thetaRad = percToRad(percent/2);
            var cricleRadius = needleBaseRadius * 2;
            var arcRadius = height-cricleRadius;
            var centerX = 0;
            var centerY = 0;
            var topX = centerX - arcRadius* Math.cos(thetaRad);
            var topY = centerY - arcRadius * Math.sin(thetaRad);
            var leftX = centerX - needleBaseRadius * Math.cos(thetaRad - Math.PI / 2);
            var leftY = centerY - needleBaseRadius * Math.sin(thetaRad - Math.PI / 2);
            var rightX = centerX - needleBaseRadius* Math.cos(thetaRad + Math.PI / 2);
            var rightY = centerY - needleBaseRadius * Math.sin(thetaRad + Math.PI / 2);
            var endAngle = Math.PI * 2/2;
            var colors = d3.scale.ordinal()
                .range(['#dedede','#8dca2f','#fdc702','#ff7700','#c50200']);

            var data = [
                {startAngle: 0, endAngle: 0.2 * endAngle},
                {startAngle: 0.2 * endAngle, endAngle: 0.4 * endAngle},
                {startAngle: 0.4 * endAngle, endAngle: 0.6 * endAngle},
                {startAngle: 0.6 * endAngle, endAngle: 0.8 * endAngle},
                {startAngle: 0.8 * endAngle, endAngle: endAngle}
            ];

            var canvas = d3.select(params.element).append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("style", "background-color:#eeeeee")
                .attr('transform','translate(0,'+ -cricleRadius+')');

            var arc = d3.svg.arc()
                .innerRadius(arcRadius - arcThickness)
                .outerRadius(arcRadius);

            var meter = canvas.append("g")
                .attr('transform', 'rotate(270 ' + height + ',0)')
                .selectAll("arc")
                .data(data)
                .enter()
                .append("path")
                .attr("class", "arc")
                .attr("fill", function(d, i){return colors(i);})
                .attr("d", function(d, i){return arc(d, i)});
            var needle = canvas.append('g')
                .attr('transform', 'translate(' + width/2 + ',' + height + ')');

            needle.append('path')
            .attr('d', 'M ' + leftX + ',' + leftY + ', L ' + topX + ',' + topY + ', L ' + rightX + ',' + rightY + '')
                .style('fill', 'orange')

            needle.append('circle')
                .attr('cx', centerX)
                .attr('cy', 0)
                .attr('r', cricleRadius)
                .style('fill', 'orange')
                .append('g');
        }
    };

}());
