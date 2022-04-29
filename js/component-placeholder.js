(function ($) {

  /**
   * ------------------------------------------------------------------------
   * Placeholder component
   * ------------------------------------------------------------------------
   */

  $( document ).ready(function () {

    $placeholderComponent = $('.content-placeholder');

    if ($placeholderComponent.length > 0) {
      $placeholderComponent.each(function () {
        var $placeholder = $(this);
        var $placeholderContent = $placeholder.find('.placeholder__content');
        var $backgroundColor = $placeholder.attr('data-background-color');
        var $fontColor = $placeholder.attr('data-font-color');
        var $sizeRatio = $placeholder.attr('data-size-ratio');

        if ( typeof $backgroundColor !== 'undefined' && $backgroundColor !== '' ) {
          $placeholderContent.css('background-color',$backgroundColor);
        }

        if ( typeof $fontColor !== 'undefined' && $fontColor !== '' ) {
          $placeholderContent.css('color',$fontColor);
        }

        var placeholderResize = function () {
          var $contentWidth = $placeholderContent.width();
          var $contentHeight;

          if ( typeof $sizeRatio !== 'undefined' && $sizeRatio !== '' ) {
            $contentHeight = $contentWidth * $sizeRatio;
          }
          else {
            // If it doesn't exist $sizeRatio variable, we setup a min-height of 66%.
            $contentHeight = $contentWidth * 0.666;
          }

          $placeholderContent.css('min-height', $contentHeight);
        };

        placeholderResize();

        $(window).on('resize', function(){
          placeholderResize();
        });

      });
    }
  });

})(jQuery);