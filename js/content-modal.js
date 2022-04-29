(function ($) {

  /**
   * ------------------------------------------------------------------------
   * Modal
   * ------------------------------------------------------------------------
   */

  $( document ).ready(function () {
    $('.content-modal').each(function () {
      var $modal = $(this);
      var $trigger = $modal.find('.modal__trigger');
      var $modalWindowContainer = $modal.find('.modal__modal-window-container');
      var $modalWindow = $modalWindowContainer.find('.modal-window');
      var $modalCloseButton = $modalWindow.find('.modal-window__close');

      $trigger.on('click', function (e) {
        e.preventDefault();
        openModal();
      });

      $modalCloseButton.on('click', function (e) {
        e.preventDefault();
        closeModal();
      });

      function openModal () {
        $('body').addClass('no-scroll');
        $modalWindowContainer.addClass('show');
      }

      function closeModal () {
        $('body').removeClass('no-scroll');
        $modalWindowContainer.removeClass('show');
      }
    });
  });

  $(document).on('mouseup touchend', function (e) {
    // if the target of the click isn't the container nor a descendant of the container
    var $shownModal = $('.modal__modal-window-container.show');
    var $shownModalWindow = $shownModal.find('.modal-window');
    if ($shownModal.length !== 0 &&
        !$shownModalWindow.is(e.target) &&
        $shownModalWindow.has(e.target).length === 0
    ) {
      $('body').removeClass('no-scroll');
      $shownModal.removeClass('show');
    }
  });

})(jQuery);