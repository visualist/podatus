
function render_vstream_graph(options, callback) {
  // TODO: provide sanity checking on options-params
  var request_url = "/book/" + options['book'] + "/chapter/" + options['chapter'] + ".json",
      css_selector = options['selector'],
      width = options['width'],
      height = options['height'],
      offset_type = options['offset_type'] || "silhouette";

  $(css_selector).empty();

  d3.json(request_url, function(err, data){

    var delta = 1; // hack- when the data shifts a column or so
    var z = data.sentences;
    var data1 = z.map(function(d){ return {x: +d[0], s: +d[3], c: +d[2] } });
    var data0 = [
          z.map(function(d){ return {x: +d[0], y:  +d[5+delta], n:d[5], pos: 'N' } }),
          z.map(function(d){ return {x: +d[0], y: +d[10+delta], n:d[5], pos: 'P' } }),

          z.map(function(d){ return {x: +d[0], y:  +d[6+delta], n:d[5], pos: 'V' } }),
          z.map(function(d){ return {x: +d[0], y:  +d[8+delta], n:d[5], pos: 'A' } }),

          z.map(function(d){ return {x: +d[0], y:  +d[7+delta], n:d[5], pos: 'J' } }),

          z.map(function(d){ return {x: +d[0], y:  +d[9+delta], n:d[5], pos: 'C' } }),
          z.map(function(d){ return {x: +d[0], y: +d[12+delta], n:d[5], pos: 'D' } })
          ];

    var stack = d3.layout.stack().offset(offset_type);
    window.layers0 = stack(data0);

    /* calc X and Y axis ranges */
    var xmin =  options['xmin'] || d3.min(layers0, function(layer) {
                    return d3.min(layer, function(d) { return d.x; });
                });
    var xrangewidth = false;
    var xwidth = options['xwidth'];

    if (xwidth > 0) {
        xrangewidth = xwidth + xmin;
    }

    window.xrange = [
        xmin,
        xrangewidth || options['xmax'] || d3.max(layers0, function(layer) {
            return d3.max(layer, function(d) { return d.x; });
        })
    ];

    window.yrange = [
        options['ymin'] || 0,
        options['ymax'] || d3.max(layers0, function(layer) {
            return d3.max(layer, function(d){return d.y0 + d.y; });
        })
    ];

    window.x = d3.scale.linear()
              .domain(xrange)
              .range([0, height]);

    window.y = d3.scale.linear()
              .domain(yrange)
              .range([width, 0]);

    // as if it were going to be horizontal..
    // but then, apply transform:translate+rotate
    var area = d3.svg.area()
                 .x(function(d) { return x(d.x); })
                 .y0(function(d) { return y(d.y0); })
                 .y1(function(d) { return y(d.y0 + d.y); });

    var svg = d3.select( css_selector ).append("svg")
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("version", "1.1")
                .attr("width", width)
                .attr("height", height);


    svg.selectAll("path")
        .data(layers0)
      .enter().append("path")
        .attr("transform", "translate("+width+", 0) rotate(90)")
        .attr("class", 'pos-hover')
        .attr("title", function(data) {
          var ch = data[0].pos;
          return POS.get_pos(ch);
        })
        .attr("data-pos", function(data) {
          var ch = data[0].pos;
          return POS.get_pos(ch);
        })
        .attr("d", area)
        .style("fill", function(data) {
          var pos = data[0].pos;
          return POS.get_pos_color(pos);
        });

    svg.selectAll("line")
        .data(data1)
      .enter().append("line")
        .attr("x1", 0)
        .attr("y1", function(d){return x(d.x)})
        .attr("x2", 160)
        .attr("y2", function(d){return x(d.x)})
        .attr("stroke", function(d) {
                          if (d.s===1) {
                            return "#808080";
                          } else {
                            return "#404040";
                          }
                        })
        .attr("stroke-width", "2")
        .attr("id", function(d){return "hline-" + d.x})
        .attr("class", function(d){
                         if (d.s===1) {
                           return "line-hover chapter-start"
                         } else {
                           return "line-hover"
                         }
                       })
        .attr("data-sn", function(d){return d.x})
        .attr("data-ch", function(d){
                          if (d.s===1) {
                             return d.c;
                           } else {
                             return null;
                           }
                         })
        .attr("opacity", function(d){
                          if (d.s===1) {
                             return ".8"
                          } else {
                             return ".03"
                          }
                         });

    var data2 = _.filter(data1, function(d) {return d.s===1});
    d3.select("#chapter-labels")
      .selectAll("div")
        .data(data2)
      .enter().append("div")
        .attr("height", "40px")
        .attr("width", "40px")
        .style("z-index", "1000")
        .style("color", "#808080")
        .style("background-color", "#202020")
        .style("padding", "0 2px")
        .style("position", "absolute")
        .style("left", "160px")
        .style("top", function(d){ return ((3 * d.x) - 22) + "px";})
        .html(function(d) {return "ch " + d.c;});

    callback();
  });
}

var vstreamgraph = function(book, chapter) {
    var selector = "#book-" + book;
    var options = { book: book, chapter: chapter,
                    selector: selector,
                    peer_chapter_selection: ".chapter p",
                    width: 660, height: 90,
                    xwidth: 100
                  };
    render_stream_graph(options);
    var psel = options['peer_chapter_selection'];
    var chapter_number_element = $(selector).parent().find(psel);
    //var chapter_number = parseInt(chapter_number_element.html());
    //chapter_number_element.data('book', book);
    chapter_number_element.html(chapter);
}

