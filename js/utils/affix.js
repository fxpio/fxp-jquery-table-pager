/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Get the position relative to the affix target.
 *
 * @param {jQuery} $affixTarget The affix target
 * @param {jQuery} $element     The element
 *
 * @typedef {TablePager} Event.data The table pager instance
 */
export function getPositionTop($affixTarget, $element) {
    let isWindow = $affixTarget.get(0) === $(window).get(0),
        affixTop = isWindow ? $affixTarget.scrollTop() : $affixTarget.offset().top;

    return $affixTarget.scrollTop() + $element.offset().top - affixTop;
}

/**
 * Action on scroll of target.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {TablePager} Event.data The table pager instance
 */
export function onAffixScrollAction(event) {
    let self = event.data,
        isWindow = self.$affixTarget.get(0) === $(window).get(0),
        affixClass = self.options.affixClass,
        affixMinHeight = self.options.affixMinHeight,
        affixTop = isWindow ? 0 : self.$affixTarget.offset().top,
        minHeight = affixMinHeight > 0 && affixMinHeight <= 1 ? (self.$affixTarget.height() * affixMinHeight) : affixMinHeight,
        isOver = self.$table.height() >= minHeight,
        offsetBottom = self.$table.offset().top + self.$table.outerHeight() - affixTop - self.$element.outerHeight();

    if (undefined !== self.affixDelay) {
        window.clearTimeout(self.affixDelay);
    }

    if (!self.$element.is(':visible')) {
        isOver = false;
    }

    // first init offset top only if element is visible
    if (isOver && null === self.offsetTop) {
        self.offsetTop = getPositionTop(self.$affixTarget, self.$element);
    }

    if (isOver && self.$affixTarget.scrollTop() > self.offsetTop && offsetBottom >= 0) {
        if (!self.$element.hasClass(affixClass)) {
            self.affixDelay = window.setTimeout(function () {
                $('body').addClass(self.options.affixBodyClass);
                self.$mock.css('height', self.$element.outerHeight(true));
                self.$element.addClass(affixClass);
                self.$element.before(self.$mock);

                delete self.affixDelay;
            }, 50);
        }
    } else if (self.$element.hasClass(affixClass)) {
        self.$element.removeClass(affixClass);
        self.$mock.detach();
        self.$mock.css('height', '');
        $('body').removeClass(self.options.affixBodyClass);
    }
}
