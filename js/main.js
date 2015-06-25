var latestArticlesComponent = (function(){

  // Mustache template
  var articlesItemTemplate = $('#articles__item').html();
  Mustache.parse(articlesItemTemplate); 


  // API config
  var API = {
    sections: ['football', 'travel', 'uk-news'],
    url: 'http://content.guardianapis.com/search?api-key=9wur7sdh84azzazdt3ye54k4&show-fields=all&page-size=5&section='
  }


  // Callbacks for JSON requests
  // sectionUpdate and requestFail will be immediately 
  // invoked, closure binding the `section` variable 
  // to the callback functions
  var sectionUpdate = function(section) {
    return function(data, textStatus, jqXHR) {
      var items = [];
      articles = data.response.results;
      $.each( articles, function( i, article ) {
        articleHtml = Mustache.render(articlesItemTemplate, article);
        items.push( articleHtml );
      });
      $('#latest-'+section+'-articles').html( items.join( "" ) );
    };
  };

  var requestFail = function(section) {
    return function( r, textStatus, error ) {
      console.log( "Request Failed for " + section + ": " + textStatus + ", " + error );
    };
  }


  // Get content for 3 sections
  for(var i = API.sections.length - 1; i >= 0; i--) {
    var section = API.sections[i],
        sectionUrl = API.url + section,
        latestNewsRequest = $.getJSON( sectionUrl );

    // Bind Callbacks
    latestNewsRequest
      .done(sectionUpdate(section))
      .fail(requestFail(section));
  };


  // Tabbed nav
  $('.tabbed-nav__link').click(function(e){
    e.preventDefault();

    // Highlight menu item
    $('.tabbed-nav__item').removeClass('tabbed-nav__item--current');
    $(this).parent().addClass('tabbed-nav__item--current');

    // Show the linked to articles list
    $('.articles__list').removeClass('articles__list--current');
    $(e.target.hash).addClass('articles__list--current');
  });
})();