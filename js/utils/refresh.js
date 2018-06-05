/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Refresh the size list of pager.
 *
 * @param {TablePager} self      The table pager instance
 * @param {boolean}    [rebuild] Rebuild the pager or not
 */
export function refreshSizeList(self, rebuild) {
    let $sizeList = $(self.options.selectors.sizeList, self.$element),
        sizeList = self.getSizeList(),
        $opt,
        i;

    $sizeList.attr('disabled', 'disabled');

    if (rebuild) {
        $sizeList.empty();

        for (i = 0; i < sizeList.length; i += 1) {
            $opt = $('<option value="' + sizeList[i].value + '">' + sizeList[i].label + '</option>');

            if (sizeList[i].value === self.pageSize) {
                $opt.prop('selected', 'selected');
            }

            $sizeList.append($opt);
        }
    }

    if (sizeList.length > 1) {
        $sizeList.removeAttr('disabled');
    }
}

/**
 * Refresh the page number of pager.
 *
 * @param {TablePager} self The table pager instance
 */
export function refreshPageNumber(self) {
    let $pageNumber = $(self.options.selectors.pageNumber, self.$element),
        $pageCount = $('span.table-pager-page-count', self.$element);

    $pageNumber.attr('disabled', 'disabled');
    $pageNumber.prop('value', self.getPageNumber());
    $pageCount.text(self.getPageCount());

    if (self.getPageCount() > 1) {
        $pageNumber.removeAttr('disabled');
    }
}

/**
 * Refresh the page buttons.
 *
 * @param {TablePager} self The table pager instance
 */
export function refreshPageButtons(self) {
    let $start = $(self.options.selectors.startPage, self.$element),
        $previous = $(self.options.selectors.previousPage, self.$element),
        $next = $(self.options.selectors.nextPage, self.$element),
        $end = $(self.options.selectors.endPage, self.$element),
        $listSort = $(self.options.selectors.listSortBtn, self.$element),
        $refresh = $(self.options.selectors.refresh, self.$element);

    $start.attr('disabled', 'disabled');
    $previous.attr('disabled', 'disabled');
    $next.attr('disabled', 'disabled');
    $end.attr('disabled', 'disabled');
    $listSort.removeAttr('disabled');
    $refresh.removeAttr('disabled');

    if (self.pageNumber > 1) {
        $start.removeAttr('disabled');
        $previous.removeAttr('disabled');
    }

    if (self.pageNumber < self.getPageCount()) {
        $next.removeAttr('disabled');
        $end.removeAttr('disabled');
    }
}

/**
 * Refresh the page elements.
 *
 * @param {TablePager} self The table pager instance
 */
export function refreshPageElements(self) {
    let $elements = $('div.table-pager-elements', self.$element);

    $('> span.table-pager-start', $elements).text(self.getStart());
    $('> span.table-pager-end', $elements).text(self.getEnd());
    $('> span.table-pager-size', $elements).text(self.getSize());
}

/**
 * Refresh the column headers.
 *
 * @param {TablePager} self            The table pager instance
 * @param {Array}      sortDefinitions The sort column definitions
 *
 * @typedef {Array} self.sortOrder The sort order list
 */
export function refreshColumnHeaders(self, sortDefinitions) {
    self.sortOrder = [];

    let $ths = self.$table.find(self.options.selectors.sortable),
        $items = self.$sortMenu.find(self.options.selectors.listSortable),
        $th,
        $item,
        i;

    $ths.removeAttr('data-table-sort');
    $items.removeAttr('data-table-sort');

    for (i = 0; i < sortDefinitions.length; i += 1) {
        $th = $ths.filter('[data-col-name=' + sortDefinitions[i].name + ']');
        $item = $items.filter('[data-col-name=' + sortDefinitions[i].name + ']');

        $th.attr('data-table-sort', sortDefinitions[i].sort);
        $item.attr('data-table-sort', sortDefinitions[i].sort);

        self.sortOrder.push(sortDefinitions[i].name);
    }

    self.$element.attr('data-sort-order', JSON.stringify(self.sortOrder));
}

/**
 * Refresh the column headers.
 *
 * @param {TablePager} self The table pager instance
 */
export function refreshEmptySelector(self) {
    if (null !== self.options.emptySelector) {
        if (0 === self.size) {
            $(self.options.emptySelector).addClass(self.options.emptyClass);
        } else {
            $(self.options.emptySelector).removeClass(self.options.emptyClass);
        }
    }
}
