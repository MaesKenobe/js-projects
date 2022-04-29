'use strict';

(function ($) {
    $(document).ready(function () {

      $('.slick-slider_index ul.slider-container').slick(
        {
          dots: true,
          mobileFirst: true,
          adaptiveHeight: true,
          arrows: false,
          responsive: [
            {
              breakpoint: 1280,
              settings: {
                arrows: true
              }
            }
          ]
        }
      );

      $('#slick-slider_example ul.slider-container').slick(
        {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          mobileFirst: true
        }
      );

      $(window).on('resize orientationChange', function (event) {
      });
    });
})($);

