/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Creates the loading info hover the table.
 *
 * @param {TablePager} self The table pager instance
 *
 * @typedef {jQuery} self.$loadingInfo The jQuery instance of loading info
 */
export function createLoadingInfo(self) {
    self.$loadingInfo = $(self.options.loadingTemplate);
    self.$loadingInfo.attr('data-table-pager-loading-info', 'true');
    self.$table.append(self.$loadingInfo);
}

/**
 * Removes the loading info hover the table.
 *
 * @param {TablePager} self The table pager instance
 *
 * @typedef {jQuery} self.$loadingInfo The jQuery instance of loading info
 */
export function removeLoadingInfo(self) {
    self.$loadingInfo.remove();
    delete self.$loadingInfo;
}
