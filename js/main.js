var latestArticlesComponent = {

  // User Interface
  UI: {
    init: function() {
      // Bind handler to tabbed nav links
      $(document).on('click', '.tabbed-nav__link', this.tabbedNavHandler);
    },
    tabbedNavHandler: function(e) {
      e.preventDefault();

      // Highlight menu item
      $('.tabbed-nav__item').removeClass('tabbed-nav__item--current');
      $(this).parent().addClass('tabbed-nav__item--current');

      // Show the linked to articles list
      $('.articles__list').removeClass('articles__list--current');
      $(e.target.hash).addClass('articles__list--current');
    }
  },


  // Ajax requests
  AJAX: {

    // API config
    API: {
      sections: ['football', 'travel', 'uk-news'],
      url: 'http://content.guardianapis.com/search?api-key=9wur7sdh84azzazdt3ye54k4&show-fields=all&page-size=5&section='
    },

    init: function() {
      // Parse the Mustache template
      Mustache.parse(this.articlesItemTemplate);

      // Get content for 3 sections
      for(var i = this.API.sections.length - 1; i >= 0; i--) {
        var section = this.API.sections[i],
            sectionUrl = this.API.url + section,
            latestNewsRequest = $.getJSON( sectionUrl );

        // Bind Callbacks
        latestNewsRequest
          .done(this.sectionUpdate(section, this.articlesItemTemplate))
          .fail(this.requestFail(section));
      };
    },

    // Callbacks for JSON requests
    // sectionUpdate and requestFail will be immediately 
    // invoked, closure binding the `section` variable 
    // to the callback functions
    sectionUpdate: function(section, template) {
      return function(data, textStatus, jqXHR) {
        var items = [];
        articles = data.response.results;
        $.each( articles, function( i, article ) {
          articleHtml = Mustache.render(template, article);
          items.push( articleHtml );
        });
        $('#latest-'+section+'-articles').html( items.join( "" ) );
      };
    },

   requestFail: function(section) {
      return function( r, textStatus, error ) {
        console.log( "Request Failed for " + section + ": " + textStatus + ", " + error );
      };
    },

    // Mustache template
    articlesItemTemplate: $('#articles__item').html()

  }
};

// Start navigation
latestArticlesComponent.UI.init();

// Fetch new articles
latestArticlesComponent.AJAX.init();
