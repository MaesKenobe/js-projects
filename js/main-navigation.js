/**
 * ------------------------------------------------------------------------
 * Navigation Desktop Menu
 * ------------------------------------------------------------------------
 */

(function ($) {

  $(document).ready(function () {

    /**
     * Mobile setup.
     */

    var mobyMenu = new Moby({
      breakpoint		 : 1280,
      enableEscape	 : true,
      menu             : $('.nav-items-primary-list'),
      menuClass		 : 'right-side',
      mobyTrigger		 : $(".nav-open-menu"),
      onClose          : false,
      onOpen           : false,
      overlay			 : true,
      overlayClass 	 : 'dark',
      subMenuOpenIcon  : '<span>&#x25BC;</span>',
      subMenuCloseIcon : '<span>&#x25B2;</span>',
      template         : '<div class="moby-wrap"><div class="moby-close"><span class="moby-close-icon"></span> Close Menu</div><div class="moby-menu"></div></div>'
    });


    /**
     * Desktop setup.
     */

    var $header = $('.header');
    var $mainNavigation = $header.find('.main-nav');
    var $navItemsSecondary = $mainNavigation.find('.nav-items-secondary-list');

    // Function to check if the secondary menu is inside the screen.
    var isInside = function (){

      var $navItemsSecondaryWidth = $navItemsSecondary.outerWidth();
      var $navItemsSecondaryOffset = $navItemsSecondary.offset().left;
      var $headerWidth = $('.header').innerWidth();

      // Check if the navigation width and offest is larger than the screen width
      if ($headerWidth <= $navItemsSecondaryWidth + $navItemsSecondaryOffset) {
        $navItemsSecondary.css({
          'left' : 'auto',
          'right' : '0',
        });
      }
      else {
        $navItemsSecondary.css({
          'left' : '0',
          'right' : 'auto',
        });
      }
    }

    isInside();

    $(window).on('resize', function(){
      isInside();
    });


  });

})($);