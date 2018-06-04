/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global define*/
/*global jQuery*/

/**
 * @param {jQuery} $
 *
 * @typedef {object} define.amd
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', '../table-pager'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    // TABLE PAGER CLASS DEFINITION
    // ============================

    $.fn.tablePager.Constructor.LANGUAGES = $.extend(true, {}, $.fn.tablePager.Constructor.LANGUAGES, {
        fr: {
            all: 'Tout'
        }
    });

}));
