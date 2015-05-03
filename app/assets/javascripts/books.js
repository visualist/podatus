
// TODO: refactor

var POS = function() {
  return {

    pos_map: {
        'N': {color: '#2e5299', pos: 'noun'},
        'P': {color: '#6381bc', pos: 'pronoun'},
        'V': {color: '#208d85', pos: 'verb'},
        'A': {color: '#54b1ab', pos: 'adverb'},
        'J': {color: '#ffd179', pos: 'adjective'},
        'C': {color: '#ffb379', pos: 'conjunction'},
        'D': {color: '#e68133', pos: 'determiner'},
        'O': {color: '#e0e0e0', pos: 'other'},
        '.': {color: '#e0e0e0', pos: ''}
    },

    get_pos: function(pos_char) {
        keys = Object.keys(this.pos_map);
        if (keys.indexOf(pos_char) < 0) {
            pos_char = '.';
        }
        var pos = this.pos_map[pos_char];
        return pos['pos'];
    },

    get_pos_color: function(pos_char) {
        keys = Object.keys(this.pos_map);
        if (keys.indexOf(pos_char) < 0) {
            pos_char = '.';
        }
        var pos = this.pos_map[pos_char];
        return pos['color'];
    }

  }
}();

function render_stream_graph(options) {
  // TODO: provide sanity checking on options-params
  var request_url = "/book/" + options['book'] + "/chapter/" + options['chapter'] + ".json",
      css_selector = options['selector'],
      width = options['width'],
      height = options['height'],
      offset_type = options['offset_type'] || "silhouette";

  d3.json(request_url, function(err, data){

    var delta = 1; // hack- when the data shifts a column or so
    var z = data.sentences;
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
    var layers0 = stack(data0);

    /* calc X and Y axis ranges */
    var xmin =  options['xmin'] || d3.min(layers0, function(layer) {
                    return d3.min(layer, function(d) { return d.x; });
                });
    var xrangewidth = false;
    var xwidth = options['xwidth'];

    if (xwidth > 0) {
        xrangewidth = xwidth + xmin;
    }

    var xrange = [
        xmin,
        xrangewidth || options['xmax'] || d3.max(layers0, function(layer) {
            return d3.max(layer, function(d) { return d.x; });
        })
    ];

    var yrange = [
        options['ymin'] || 0,
        options['ymax'] || d3.max(layers0, function(layer) {
            return d3.max(layer, function(d){return d.y0 + d.y; });
        })
    ];

    var x = d3.scale.linear()
              .domain(xrange)
              .range([0, width]);

    var y = d3.scale.linear()
              .domain(yrange)
              .range([height, 0]);

    /* graph */
    var area = d3.svg.area()
                 .x(function(d) { return x(d.x); })
                 .y0(function(d) { return y(d.y0); })
                 .y1(function(d) { return y(d.y0 + d.y); });

    var svg = d3.select( css_selector ).append("svg")
                .attr("width", width)
                .attr("height", height);

    svg.selectAll("path")
        .data(layers0)
      .enter().append("path")
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

  });
}

$(document).ready(function() {
  $(document).on("mouseenter", ".pos-hover", function(e) {
      var $this = $(this);
      $this.siblings(".pos-hover").css("opacity", 0.2);
      $this.css("opacity", 1);
      //var pos = $this.data('pos');
      // placeholder for tooltip ON
      //console.log(pos + '-on');

  }).on('mouseleave', '.pos-hover', function() {
      var $this = $(this);
      $this.siblings(".pos-hover").css("opacity", 1);
      //var pos = $this.data('pos');
      // placeholder for tooltip OFF
      //console.log(pos + '-off');
  });
});

