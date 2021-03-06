
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

  $(css_selector).empty();

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

var streamgraph = function(book, chapter) {
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

var keycode_functions = function(keycode, prev_chapter,
                                 first_chapter, last_chapter) {
    //console.log('keycode='+prev_chapter);
    var chapter = null,
        min = first_chapter,
        max = last_chapter;
    switch (keycode) {
      case 37: // left-arrow
      case 40: // down-arrow
      case 74: // j (vi down)
      case 80: // p (previous)
          chapter = prev_chapter - 1;
          if (chapter < min) {
            chapter = min;
          }
              break;
      case 39: // right-arup-arrowrow
      case 38: // up-arrow
      case 75: // k (vi up)
      case 78: // n (next)
          chapter = prev_chapter + 1;
          if (chapter > max) {
            chapter = max;
          }
          break;
      case 48: // 0
      case 76: // l (last)
            chapter = max;
            break;

      case 77: // m (middle)
            chapter = Math.floor((min + max) / 2);
            break;

      case 49: chapter = 1; break; // 1
      case 50: chapter = 2; break; // 2
      case 51: chapter = 3; break; // 3
      case 52: chapter = 4; break; // 4
      case 53: chapter = 5; break; // 5
      case 54: chapter = 6; break; // 6
      case 55: chapter = 7; break; // 7
      case 56: chapter = 8; break; // 8
      case 57: chapter = 9; break; // 9
    }
    return chapter;
}

// add jquery function for toggling click events (books-index page)
$.fn.clicktoggle = function(a, b) {
    return this.each(function() {
        var clicked = false;
        $(this).on('click', function() {
            if (clicked) {
                clicked = false;
                //console.log('B apply')
                return b.apply(this, arguments);
            }
            clicked = true;
            //console.log('A apply')
            return a.apply(this, arguments);
        });
    });
};

