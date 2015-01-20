/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global jQuery*/

/**
 * @param {jQuery} $
 */
(function ($) {
    'use strict';

    // TABLE PAGER CLASS DEFINITION
    // ============================

    $.fn.tablePager.Constructor.LANGUAGES = $.extend(true, {}, $.fn.tablePager.Constructor.LANGUAGES, {
        fr: {
            all: 'Tout'
        }
    });

}(jQuery));
