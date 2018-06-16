/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import pluginify from '@fxp/jquery-pluginify';
import BaseI18nPlugin from '@fxp/jquery-pluginify/js/i18n-plugin';
import $ from 'jquery';
import {getPositionTop, onAffixScrollAction} from "./utils/affix";
import {
    onEndPageAction,
    onNextPageAction,
    onPageNumberAction,
    onPageSizeAction,
    onPreviousPageAction, onRefreshAction,
    onSortColumnAction,
    onStartPageAction
} from "./utils/selectors";
import {createLoadingInfo, removeLoadingInfo} from "./utils/ajax";
import {addSortDef, getSortColumns} from "./utils/sort";
import {
    refreshColumnHeaders,
    refreshEmptySelector,
    refreshPageButtons,
    refreshPageElements,
    refreshPageNumber,
    refreshSizeList
} from "./utils/refresh";

/**
 * Table Pager class.
 */
export default class TablePager extends BaseI18nPlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        this.$table       = $('#' + this.options.tableId);
        this.$sortMenu    = $(this.options.selectors.listSortMenu, this.$element);
        this.sizeList     = [];
        this.pageSize     = this.options.pageSize;
        this.pageNumber   = this.options.pageNumber;
        this.size         = this.options.size || this.getSizeInTable();
        this.rows         = [];
        this.sortOrder    = this.options.sortOrder;
        this.setMultiSortable(this.options.multiSortable);
        this.$affixTarget = this.options.affixTarget !== false ? $(this.options.affixTarget) : null;
        this.$mock        = null !== this.$affixTarget ? $('<div class="table-pager-mock"></div>') : null;
        this.offsetTop    = null;

        if (null !== this.$affixTarget) {
            this.$affixTarget.on('scroll.fxp.tablepager', null, this, onAffixScrollAction);
        }

        this.$element.attr('data-size', this.size);

        this.$table
            .on('click.fxp.tablepager', this.options.selectors.sortable, this, onSortColumnAction);

        this.$sortMenu
            .on('click.fxp.tablepager', this.options.selectors.listSortable, this, onSortColumnAction);

        this.$element
            .on('change.fxp.tablepager', this.options.selectors.sizeList, this, onPageSizeAction)
            .on('click.fxp.tablepager', this.options.selectors.startPage, this, onStartPageAction)
            .on('click.fxp.tablepager', this.options.selectors.previousPage, this, onPreviousPageAction)
            .on('change.fxp.tablepager', this.options.selectors.pageNumber, this, onPageNumberAction)
            .on('click.fxp.tablepager', this.options.selectors.nextPage, this, onNextPageAction)
            .on('click.fxp.tablepager', this.options.selectors.endPage, this, onEndPageAction)
            .on('click.fxp.tablepager', this.options.selectors.refresh, this, onRefreshAction);

        let $cols = $(this.options.selectors.sortable, this.$table),
            $sorts = $(this.options.selectors.listSortable, this.$sortMenu),
            $icon,
            i;

        for (i = 0; i < $cols.length; i += 1) {
            $icon = $('> i.table-sort-icon', $cols.eq(i));

            if (0 === $icon.length) {
                $cols.eq(i).append(this.options.sortIconTemplate);
            }
        }

        for (i = 0; i < $sorts.length; i += 1) {
            $icon = $('> i.table-sort-icon', $sorts.eq(i));

            if (0 === $icon.length) {
                $sorts.eq(i).append(this.options.sortIconTemplate);
            }
        }

        this.setSizeList(this.options.sizeList);
        this.refreshPager(true);

        if (this.options.init) {
            this.refresh();
        }
    }

    /**
     * Set multi sortable.
     *
     * @param {boolean} sortable
     */
    setMultiSortable(sortable) {
        this.multiSortable = sortable;
        this.$element.attr('data-multi-sortable', sortable ? 'true' : 'false');
    }

    /**
     * Check if pager is multi sortable.
     *
     * @returns {boolean}
     */
    isMultiSortable() {
        return this.multiSortable;
    }

    /**
     * Remove column allowed to sorting.
     *
     * @param {String}  column    The column name
     * @param {boolean} multiple  False if reset sort
     * @param {string}  direction The direction of sort (asc or desc)
     */
    sortColumn(column, multiple, direction) {
        multiple = undefined === multiple ? false : multiple;
        multiple = multiple ? this.isMultiSortable() : multiple;

        let sortOrder,
            sortDef,
            i;

        if ('asc' !== direction && 'desc' !== direction) {
            direction = 'asc';
        }

        sortOrder = multiple ? this.sortOrder : [];
        sortDef = [];

        if (-1 === $.inArray(column, sortOrder)) {
            sortOrder.push(column);
        }

        for (i = 0; i < sortOrder.length; i += 1) {
            if (column === sortOrder[i]) {
                sortDef.push({name: column, sort: direction});
            } else {
                addSortDef(this, sortDef, sortOrder[i]);
            }
        }

        refreshColumnHeaders(this, sortDef);
        this.refresh();
    }

    /**
     * Set size list.
     *
     * @param {Array.<number>} sizes The list of size list
     */
    setSizeList(sizes) {
        let sizesList = [],
            i;

        for (i = 0; i < sizes.length; i += 1) {
            if ('object' === typeof sizes[i]) {
                sizesList.push({value: sizes[i].value, label: sizes[i].label});

            } else {
                sizesList.push({value: sizes[i], label: sizes[i]});
            }
        }

        if (this.options.addAllInSize) {
            sizesList.push({value: 0, label: this.locale().all});
        }

        this.sizeList = sizesList;
        this.$element.attr('data-size-list', JSON.stringify(sizesList));
    }

    /**
     * Get size list.
     *
     * @returns {Array.<number, string>} The list of object value/label
     */
    getSizeList() {
        return this.sizeList;
    }

    /**
     * Set page size.
     *
     * @param {number} size The page size
     */
    setPageSize(size) {
        this.pageSize = parseInt(size, 10);
        this.pageNumber = 1;
        this.$element.attr('data-page-size', this.pageSize);
        this.$element.attr('data-page-number', this.pageNumber);
        this.refresh();
    }

    /**
     * Get page size.
     *
     * @returns {number}
     */
    getPageSize() {
        return this.pageSize;
    }

    /**
     * Get start number.
     *
     * @returns {number}
     */
    getStart() {
        return (this.getPageNumber() - 1) * this.getPageSize() + 1;
    }

    /**
     * Get end number.
     *
     * @returns {number}
     */
    getEnd() {
        return 0 === this.getPageSize() ? this.getSize() : Math.min(this.getSize(), this.getPageSize() * this.getPageNumber());
    }

    /**
     * Set page number.
     *
     * @param {number} page The page number
     */
    setPageNumber(page) {
        this.pageNumber = Math.min(page, this.getPageCount());
        this.pageNumber = Math.max(this.pageNumber, 1);
        this.$element.attr('data-page-number', this.pageNumber);
        this.refresh();
    }

    /**
     * Get page number.
     *
     * @returns {number}
     */
    getPageNumber() {
        return this.pageNumber;
    }

    /**
     * Get page count.
     *
     * @returns {number}
     */
    getPageCount() {
        return 0 === this.pageSize ? 1 : Math.ceil(this.size / this.pageSize);
    }

    /**
     * Get size.
     *
     * @returns {number}
     */
    getSize() {
        return this.size;
    }

    /**
     * Get size in table.
     *
     * @returns {number}
     */
    getSizeInTable() {
        return this.$table.find('> tbody > tr[data-row-id]').length;
    }

    /**
     * Get rows.
     *
     * @returns {Array.<number, object>}
     */
    getRows() {
        return this.rows;
    }

    /**
     * Get item.
     *
     * @param {number} row The index of row
     *
     * @returns {object}
     */
    getItem(row) {
        let rows = this.getRows();

        if (undefined === rows[row]) {
            return null;
        }

        return rows[row];
    }

    /**
     * Refresh pager.
     *
     * @param {boolean} [rebuild]
     */
    refreshPager(rebuild) {
        refreshEmptySelector(this);
        refreshSizeList(this, rebuild);
        refreshPageNumber(this);
        refreshPageButtons(this);
        refreshPageElements(this);
    }

    /**
     * Refresh data.
     *
     * @typedef {Array} data.sortColumns
     */
    refresh() {
        if (undefined !== this.$loadingInfo) {
            return;
        }

        $(this.options.selectors.sizeList, this.$element).attr('disabled', 'disabled');
        $(this.options.selectors.startPage, this.$element).attr('disabled', 'disabled');
        $(this.options.selectors.previousPage, this.$element).attr('disabled', 'disabled');
        $(this.options.selectors.pageNumber, this.$element).attr('disabled', 'disabled');
        $(this.options.selectors.nextPage, this.$element).attr('disabled', 'disabled');
        $(this.options.selectors.endPage, this.$element).attr('disabled', 'disabled');
        $(this.options.selectors.listSortBtn, this.$element).attr('disabled', 'disabled');
        $(this.options.selectors.refresh, this.$element).attr('disabled', 'disabled');

        let self = this,
            ajaxParams = {},
            data = {},
            dataPrefix = '';

        if (null !== this.options.ajaxId && '' !== this.options.ajaxId) {
            data.ajax_id = this.options.ajaxId;
            dataPrefix = data.ajax_id + '_';
        }

        data[dataPrefix + 'ps'] = this.getPageSize();
        data[dataPrefix + 'pn'] = this.getPageNumber();
        data[dataPrefix + 'p'] = this.options.parameters;
        data[dataPrefix + 'sc'] = getSortColumns(this);

        createLoadingInfo(this);
        this.$table.trigger($.Event('table-pager-refreshing', {'tablePager': this, 'ajax': ajaxParams, ajaxData: data}));

        // scroll to the top of table
        if (null !== this.$affixTarget && self.$element.hasClass(self.options.affixClass)) {
            this.$affixTarget.animate({scrollTop: getPositionTop(self.$affixTarget, self.$mock) + 1}, this.options.affixScrollSpeed);
        }

        $.ajax(this.options.url, $.extend(true, {}, ajaxParams, {
            type: this.options.method,
            data: data,
            success: function (data, textStatus, jqXHR) {
                let rowId = '_row_id',
                    attrColumns = '_attr_columns',
                    $body = $('> tbody', self.$table),
                    $cols = $('> thead > tr:last', self.$table).eq(0).children(),
                    rows = undefined === data.rows ? [] : data.rows,
                    content = [],
                    ret = {
                        data:       data,
                        textStatus: textStatus,
                        jqXHR:      jqXHR
                    },
                    $tr,
                    colName,
                    $td,
                    attrs,
                    attr,
                    i,
                    j;

                self.$table.trigger($.Event('table-pager-pre-success', {'tablePager': self, 'ret': ret}));

                for (i = 0; i < rows.length; i += 1) {
                    $tr = $('<tr></tr>');

                    if (undefined !== rows[i][rowId]) {
                        $tr.attr('data-row-id', rows[i][rowId]);
                    }

                    for (j = 0; j < $cols.length; j += 1) {
                        colName = $cols.eq(j).attr('data-col-name');
                        $td = $('<td></td>');

                        if (undefined !== rows[i][attrColumns] && rows[i][attrColumns][colName]) {
                            attrs = rows[i][attrColumns][colName];

                            for (attr in attrs) {
                                if (attrs.hasOwnProperty(attr)) {
                                    $td.attr(attr, attrs[attr]);
                                }
                            }
                        }

                        if (undefined !== rows[i][colName]) {
                            $td.append(rows[i][colName]);
                        }

                        $td.attr('data-col-name', colName);
                        $tr.append($td);
                    }

                    content.push($tr);
                }

                if (0 === rows.length && null !== self.options.emptyMessage) {
                    $tr = $('<tr></tr>');
                    $td = $('<td></td>');
                    $td.attr('colspan', $cols.length);
                    $td.append($('<div />').html(self.options.emptyMessage).text());
                    $tr.append($td);
                    content.push($tr);
                }

                removeLoadingInfo(self);
                $body.empty();
                $body.append(content);
                self.pageNumber = data.pageNumber;
                self.pageSize = data.pageSize;
                self.size = data.size;
                self.$table.trigger($.Event('table-pager-post-success', {'tablePager': self, 'ret': ret}));
                self.$table.trigger($.Event('table-pager-refreshed', {'tablePager': self, 'ret': ret}));
                self.refreshPager();
            },
            error: function (data, textStatus, jqXHR) {
                let ret = {
                    data:       data,
                    textStatus: textStatus,
                    jqXHR:      jqXHR
                };

                removeLoadingInfo(self);
                self.$table.trigger($.Event('table-pager-error', {'tablePager': self, 'ret': ret}));
                self.$table.trigger($.Event('table-pager-refreshed', {'tablePager': self, 'ret': ret}));
                self.refreshPager();
            }
        }));
    }

    /**
     * Go to start page.
     */
    startPage() {
        this.setPageNumber(1);
    }

    /**
     * Go to previous page.
     */
    previousPage() {
        this.setPageNumber(this.getPageNumber() - 1);
    }

    /**
     * Go to next page.
     */
    nextPage() {
        this.setPageNumber(this.getPageNumber() + 1);
    }

    /**
     * Go to end page.
     */
    endPage() {
        this.setPageNumber(this.getPageCount());
    }

    /**
     * Destroy the instance.
     */
    destroy() {
        this.$table
            .off('click.fxp.tablepager', this.options.selectors.sortable, onSortColumnAction);

        this.$sortMenu
            .off('click.fxp.tablepager', this.options.selectors.listSortable, onSortColumnAction);

        if (null !== this.$affixTarget) {
            this.$affixTarget.off('scroll.fxp.tablepager', null, onAffixScrollAction);
        }

        if (null !== this.$mock) {
            this.$mock.remove();
        }

        this.$element.removeClass(this.options.affixClass);
        this.$mock.detach();
        this.$mock.css('height', '');
        $('body').removeClass(this.options.affixBodyClass);

        this.$element
            .off('change.fxp.tablepager', this.options.selectors.sizeList, onPageSizeAction)
            .off('click.fxp.tablepager', this.options.selectors.startPage, onStartPageAction)
            .off('click.fxp.tablepager', this.options.selectors.previousPage, onPreviousPageAction)
            .off('change.fxp.tablepager', this.options.selectors.pageNumber, onPageNumberAction)
            .off('click.fxp.tablepager', this.options.selectors.nextPage, onNextPageAction)
            .off('click.fxp.tablepager', this.options.selectors.endPage, onEndPageAction)
            .off('click.fxp.tablepager', this.options.selectors.refresh, onRefreshAction);

        super.destroy();
    }
}

/**
 * Defaults options.
 */
TablePager.defaultOptions = {
    tableId:          null,
    pageSize:         100,
    pageNumber:       1,
    addAllInSize:     false,
    sizeList:         [2, 5, 10, 25, 50, 100, 150, 200],
    url:              null,
    method:           'get',
    ajaxId:           null,
    parameters:       {},
    multiSortable:    false,
    sortOrder:        [],
    init:             false,
    affixTarget:      window,
    affixMinHeight:   300,
    affixClass:       'affix',
    affixBodyClass:   'table-pager-affixed',
    affixScrollSpeed: 300,
    loadingTemplate:  '<caption class="default-loading-icon"><i class="fa fa-spin"></i></caption>',
    sortIconTemplate: '<i class="table-sort-icon fa"></i>',
    emptyMessage:     null,
    emptySelector:    null,
    emptyClass:       'table-empty',
    selectors:        {
        sizeList:     'select.table-pager-size-list',
        startPage:    'button.table-pager-start-page',
        previousPage: 'button.table-pager-previous-page',
        pageNumber:   'input.table-pager-page-number',
        nextPage:     'button.table-pager-next-page',
        endPage:      'button.table-pager-end-page',
        refresh:      'button.table-pager-refresh',
        listSortBtn:  'button.table-pager-list-sort',
        listSortMenu: 'ul.table-pager-list-sort-menu',
        listSortable: '> li > a[data-table-pager-sortable=true]',
        sortable:     '> thead > tr:last > th[data-table-pager-sortable=true]'
    }
};

TablePager.locales = {
    'en': {
        all: 'All'
    }
};

pluginify('tablePager', 'fxp.tablepager', TablePager, true, '[data-table-pager="true"]');
