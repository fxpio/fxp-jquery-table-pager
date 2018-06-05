/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Find and add the sort definition in the sort definitions array.
 *
 * @param {TablePager} self            The table pager instance
 * @param {Array}      sortDefinitions The sort definitions
 * @param {String}     sortOrderItem   The name of the sort order item
 */
export function addSortDef(self, sortDefinitions, sortOrderItem) {
    let $ths = self.$table.find(self.options.selectors.sortable + '[data-table-sort]'),
        $items = self.$sortMenu.find(self.options.selectors.listSortable + '[data-table-sort]'),
        $th = $ths.filter('[data-col-name=' + sortOrderItem + ']'),
        $item = $items.filter('[data-col-name=' + sortOrderItem + ']'),
        value;

    if (undefined !== $th.attr('data-table-sort')) {
        value = {name: sortOrderItem, sort: $th.attr('data-table-sort')};
    }

    if (undefined !== $item.attr('data-table-sort')) {
        value = {name: sortOrderItem, sort: $item.attr('data-table-sort')};
    }

    if (undefined !== value) {
        sortDefinitions.push(value);
    }
}

/**
 * Get the sort column definitions.
 *
 * @param {TablePager} self The table pager instance
 */
export function getSortColumns(self) {
    let sortDef = [],
        i;

    for (i = 0; i < self.sortOrder.length; i += 1) {
        addSortDef(self, sortDef, self.sortOrder[i]);
    }

    return sortDef;
}
