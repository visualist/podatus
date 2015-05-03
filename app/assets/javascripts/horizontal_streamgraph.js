
/*
 * Create mappping between book-data and DOM real estate.
 *   book-data: referenced by a book id
 *   dom: CSS selector of the graph-area to be used
 * Example:
 *   x = new HorizontalStreamgraph({book: 1, selection: "#book-1"});
 * later..
 *   x.render_chapter(19)
 */

function HorizontalStreamgraph(options) {
    this.options = $.extend({}, this.default_options, options);
}

HorizontalStreamgraph.prototype = {
    default_options: {
        book: 1, //default only
        selection: "body", //default only
        peer_chapter_selection: ".chapter p", //default only
        start_chapter: 1,
        width: 660,
        height: 90,
        xwidth: 100
    },
    render_chapter: function(chapter_id) {
        var book = this.options.book;
        streamgraph(book, chapter_id);
    }
}

