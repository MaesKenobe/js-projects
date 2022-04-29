'use strict';

(function ($) {
    $(document).ready(function () {
        const selector = $('.component-accordion');

        selector.each(function (index, item) {
            new Accordion('#' + item.id, {
                duration: 600, // animation duration in ms {number}
                itemNumber: 0, // item number which will be shown {number}
                aria: true, // add ARIA elements to the HTML structure {boolean}
                closeOthers: true, // show only one element at the same time {boolean}
                showItem: false, // always show element that has itemNumber number {boolean}
                elementClass: 'ac', // element class {string}
                questionClass: 'ac-q', // question class {string}
                answerClass: 'ac-a', // answer class {string}
                targetClass: 'ac-target' // target class {string}
            });
        });
    });
})($);
