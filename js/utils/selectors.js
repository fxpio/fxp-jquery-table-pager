/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Action on click to sortable column header.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {TablePager} Event.data The table pager instance
 */
export function onSortColumnAction(event) {
    let self = event.data,
        $col = undefined === $(event.target).attr('data-col-name') ? $(event.target).parent() : $(event.target),
        multiple,
        direction,
        oldDirection;

    event.preventDefault();

    if (undefined === $col.attr('data-col-name')) {
        return;
    }

    multiple = event.ctrlKey ? self.isMultiSortable() : event.ctrlKey;
    direction = $col.attr('data-table-sort');
    oldDirection = (undefined === direction) ? 'asc' : direction;

    if (undefined === direction || 'desc' === direction) {
        direction = 'asc';
    } else if ('asc' === direction) {
        direction = 'desc';
    }

    if (!multiple && self.sortOrder.length > 1) {
        direction = oldDirection;
    }

    self.sortColumn($col.attr('data-col-name'), multiple, direction);
}

/**
 * Action on click to refresh button.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {TablePager} Event.data The table pager instance
 */
export function onPageSizeAction(event) {
    event.data.setPageSize($(event.target).prop('value'));
}

/**
 * Action on click to start page button.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {TablePager} Event.data The table pager instance
 */
export function onStartPageAction(event) {
    event.data.startPage();
}

/**
 * Action on click to previous page button.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {TablePager} Event.data The table pager instance
 */
export function onPreviousPageAction(event) {
    event.data.previousPage();
}

/**
 * Action on change page number input.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {TablePager} Event.data The table pager instance
 */
export function onPageNumberAction(event) {
    event.data.setPageNumber($(event.target).prop('value'));
}

/**
 * Action on click to next page button.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {TablePager} Event.data The table pager instance
 */
export function onNextPageAction(event) {
    event.data.nextPage();
}

/**
 * Action on click to end page button.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {TablePager} Event.data The table pager instance
 */
export function onEndPageAction(event) {
    event.data.endPage();
}

/**
 * Action on click to refresh button.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {TablePager} Event.data The table pager instance
 */
export function onRefreshAction(event) {
    event.data.refresh();
}
