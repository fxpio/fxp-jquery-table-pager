/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global define*/
/*global jQuery*/
/*global window*/
/*global TablePager*/

/**
 * @param {jQuery} $
 *
 * @typedef {object}           define.amd
 * @typedef {jQuery|undefined} TablePager.$loadingInfo
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /**
     * Refresh the size list of pager.
     *
     * @param {TablePager} self      The table pager instance
     * @param {boolean}    [rebuild] Rebuild the pager or not
     *
     * @private
     */
    function refreshSizeList(self, rebuild) {
        var $sizeList = $(self.options.selectors.sizeList, self.$element),
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
     *
     * @private
     */
    function refreshPageNumber(self) {
        var $pageNumber = $(self.options.selectors.pageNumber, self.$element),
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
     *
     * @private
     */
    function refreshPageButtons(self) {
        var $start = $(self.options.selectors.startPage, self.$element),
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
     *
     * @private
     */
    function refreshPageElements(self) {
        var $elements = $('div.table-pager-elements', self.$element);

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
     *
     * @private
     */
    function refreshColumnHeaders(self, sortDefinitions) {
        self.sortOrder = [];

        var $ths = self.$table.find(self.options.selectors.sortable),
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
     * Find and add the sort definition in the sort definitions array.
     *
     * @param {TablePager} self            The table pager instance
     * @param {Array}      sortDefinitions The sort definitions
     * @param {String}     sortOrderItem   The name of the sort order item
     *
     * @private
     */
    function addSortDef(self, sortDefinitions, sortOrderItem) {
        var $ths = self.$table.find(self.options.selectors.sortable + '[data-table-sort]'),
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
     *
     * @private
     */
    function getSortColumns(self) {
        var sortDef = [],
            i;

        for (i = 0; i < self.sortOrder.length; i += 1) {
            addSortDef(self, sortDef, self.sortOrder[i]);
        }

        return sortDef;
    }

    /**
     * Creates the loading info hover the table.
     *
     * @param {TablePager} self The table pager instance
     *
     * @typedef {jQuery} self.$loadingInfo The jQuery instance of loading info
     *
     * @private
     */
    function createLoadingInfo(self) {
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
     *
     * @private
     */
    function removeLoadingInfo(self) {
        self.$loadingInfo.remove();
        delete self.$loadingInfo;
    }

    /**
     * Action on click to refresh button.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {TablePager} Event.data The table pager instance
     *
     * @private
     */
    function onPageSizeAction(event) {
        event.data.setPageSize($(event.target).prop('value'));
    }

    /**
     * Action on click to start page button.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {TablePager} Event.data The table pager instance
     *
     * @private
     */
    function onStartPageAction(event) {
        event.data.startPage();
    }

    /**
     * Action on click to previous page button.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {TablePager} Event.data The table pager instance
     *
     * @private
     */
    function onPreviousPageAction(event) {
        event.data.previousPage();
    }

    /**
     * Action on change page number input.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {TablePager} Event.data The table pager instance
     *
     * @private
     */
    function onPageNumberAction(event) {
        event.data.setPageNumber($(event.target).prop('value'));
    }

    /**
     * Action on click to next page button.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {TablePager} Event.data The table pager instance
     *
     * @private
     */
    function onNextPageAction(event) {
        event.data.nextPage();
    }

    /**
     * Action on click to end page button.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {TablePager} Event.data The table pager instance
     *
     * @private
     */
    function onEndPageAction(event) {
        event.data.endPage();
    }

    /**
     * Action on click to refresh button.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {TablePager} Event.data The table pager instance
     *
     * @private
     */
    function onRefreshAction(event) {
        event.data.refresh();
    }

    /**
     * Action on click to sortable column header.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {TablePager} Event.data The table pager instance
     *
     * @private
     */
    function onSortColumnAction(event) {
        var self = event.data,
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
     * Get the position relative to the affix target.
     *
     * @param {jQuery} $affixTarget The affix target
     * @param {jQuery} $element     The element
     *
     * @typedef {TablePager} Event.data The table pager instance
     *
     * @private
     */
    function getPositionTop($affixTarget, $element) {
        var isWindow = $affixTarget.get(0) === $(window).get(0),
            affixTop = isWindow ? $affixTarget.scrollTop() : $affixTarget.offset().top;

        return $affixTarget.scrollTop() + $element.offset().top - affixTop;
    }

    /**
     * Action on scroll of target.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {TablePager} Event.data The table pager instance
     *
     * @private
     */
    function onAffixScrollAction(event) {
        var self = event.data,
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

    // TABLE PAGER CLASS DEFINITION
    // ============================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this TablePager
     */
    var TablePager = function (element, options) {
        this.guid          = jQuery.guid;
        this.options       = $.extend(true, {}, TablePager.DEFAULTS, options);
        this.$element      = $(element);
        this.$table        = $('#' + this.options.tableId);
        this.$sortMenu     = $(this.options.selectors.listSortMenu, this.$element);
        this.sizeList      = [];
        this.pageSize      = this.options.pageSize;
        this.pageNumber    = this.options.pageNumber;
        this.size          = this.options.size || this.getSizeInTable();
        this.rows          = [];
        this.sortOrder     = this.options.sortOrder;
        this.setMultiSortable(this.options.multiSortable);
        this.$affixTarget  = this.options.affixTarget !== false ? $(this.options.affixTarget) : null;
        this.$mock         = null !== this.$affixTarget ? $('<div class="table-pager-mock"></div>') : null;
        this.offsetTop     = null;

        if (null !== this.$affixTarget) {
            this.$affixTarget.on('scroll.st.tablepager', null, this, onAffixScrollAction);
        }

        this.$element.attr('data-size', this.size);

        this.$table
            .on('click.st.tablepager', this.options.selectors.sortable, this, onSortColumnAction);

        this.$sortMenu
            .on('click.st.tablepager', this.options.selectors.listSortable, this, onSortColumnAction);

        this.$element
            .on('change.st.tablepager', this.options.selectors.sizeList, this, onPageSizeAction)
            .on('click.st.tablepager', this.options.selectors.startPage, this, onStartPageAction)
            .on('click.st.tablepager', this.options.selectors.previousPage, this, onPreviousPageAction)
            .on('change.st.tablepager', this.options.selectors.pageNumber, this, onPageNumberAction)
            .on('click.st.tablepager', this.options.selectors.nextPage, this, onNextPageAction)
            .on('click.st.tablepager', this.options.selectors.endPage, this, onEndPageAction)
            .on('click.st.tablepager', this.options.selectors.refresh, this, onRefreshAction);

        var $cols = $(this.options.selectors.sortable, this.$table),
            $sorts = $(this.options.selectors.listSortable, this.$sortMenu),
            $icon,
            i;

        for (i = 0; i < $cols.size(); i += 1) {
            $icon = $('> i.table-sort-icon', $cols.eq(i));

            if (0 === $icon.size()) {
                $cols.eq(i).append(this.options.sortIconTemplate);
            }
        }

        for (i = 0; i < $sorts.size(); i += 1) {
            $icon = $('> i.table-sort-icon', $sorts.eq(i));

            if (0 === $icon.size()) {
                $sorts.eq(i).append(this.options.sortIconTemplate);
            }
        }

        this.setSizeList(this.options.sizeList);
        this.refreshPager(true);

        if (this.options.init) {
            this.refresh();
        }
    },
        old;

    /**
     * Defaults options.
     *
     * @type {object}
     */
    TablePager.DEFAULTS = {
        locale:           'en',
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

    /**
     * Defaults languages.
     *
     * @type {object}
     */
    TablePager.LANGUAGES = {
        en: {
            all: 'All'
        }
    };

    /**
     * Set multi sortable.
     *
     * @param {boolean} sortable
     *
     * @this TablePager
     */
    TablePager.prototype.setMultiSortable = function (sortable) {
        this.multiSortable = sortable;
        this.$element.attr('data-multi-sortable', sortable ? 'true' : 'false');
    };

    /**
     * Check if pager is multi sortable.
     *
     * @returns {boolean}
     *
     * @this TablePager
     */
    TablePager.prototype.isMultiSortable = function () {
        return this.multiSortable;
    };

    /**
     * Remove column allowed to sorting.
     *
     * @param {String}  column    The column name
     * @param {boolean} multiple  False if reset sort
     * @param {string}  direction The direction of sort (asc or desc)
     *
     * @this TablePager
     */
    TablePager.prototype.sortColumn = function (column, multiple, direction) {
        multiple = undefined === multiple ? false : multiple;
        multiple = multiple ? this.isMultiSortable() : multiple;

        var sortOrder,
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
    };

    /**
     * Set size list.
     *
     * @param {Array.<number>} sizes The list of size list
     *
     * @this TablePager
     */
    TablePager.prototype.setSizeList = function (sizes) {
        var sizesList = [],
            i;

        for (i = 0; i < sizes.length; i += 1) {
            if ('object' === typeof sizes[i]) {
                sizesList.push({value: sizes[i].value, label: sizes[i].label});

            } else {
                sizesList.push({value: sizes[i], label: sizes[i]});
            }
        }

        if (this.options.addAllInSize) {
            sizesList.push({value: 0, label: this.langData().all});
        }

        this.sizeList = sizesList;
        this.$element.attr('data-size-list', JSON.stringify(sizesList));
    };

    /**
     * Get size list.
     *
     * @returns {Array.<number, string>} The list of object value/label
     *
     * @this TablePager
     */
    TablePager.prototype.getSizeList = function () {
        return this.sizeList;
    };

    /**
     * Set page size.
     *
     * @param {number} size The page size
     *
     * @this TablePager
     */
    TablePager.prototype.setPageSize = function (size) {
        this.pageSize = parseInt(size, 10);
        this.pageNumber = 1;
        this.$element.attr('data-page-size', this.pageSize);
        this.$element.attr('data-page-number', this.pageNumber);
        this.refresh();
    };

    /**
     * Get page size.
     *
     * @returns {number}
     *
     * @this TablePager
     */
    TablePager.prototype.getPageSize = function () {
        return this.pageSize;
    };

    /**
     * Get start number.
     *
     * @returns {number}
     *
     * @this TablePager
     */
    TablePager.prototype.getStart = function () {
        return (this.getPageNumber() - 1) * this.getPageSize() + 1;
    };

    /**
     * Get end number.
     *
     * @returns {number}
     *
     * @this TablePager
     */
    TablePager.prototype.getEnd = function () {
        return 0 === this.getPageSize() ? this.getSize() : Math.min(this.getSize(), this.getPageSize() * this.getPageNumber());
    };

    /**
     * Set page number.
     *
     * @param {number} page The page number
     *
     * @this TablePager
     */
    TablePager.prototype.setPageNumber = function (page) {
        this.pageNumber = Math.min(page, this.getPageCount());
        this.pageNumber = Math.max(this.pageNumber, 1);
        this.$element.attr('data-page-number', this.pageNumber);
        this.refresh();
    };

    /**
     * Get page number.
     *
     * @returns {number}
     *
     * @this TablePager
     */
    TablePager.prototype.getPageNumber = function () {
        return this.pageNumber;
    };

    /**
     * Get page count.
     *
     * @returns {number}
     *
     * @this TablePager
     */
    TablePager.prototype.getPageCount = function () {
        return 0 === this.pageSize ? 1 : Math.ceil(this.size / this.pageSize);
    };

    /**
     * Get size.
     *
     * @returns {number}
     *
     * @this TablePager
     */
    TablePager.prototype.getSize = function () {
        return this.size;
    };

    /**
     * Get size in table.
     *
     * @returns {number}
     *
     * @this TablePager
     */
    TablePager.prototype.getSizeInTable = function () {
        return this.$table.find('> tbody > tr[data-row-id]').size();
    };

    /**
     * Get rows.
     *
     * @returns {Array.<number, object>}
     *
     * @this TablePager
     */
    TablePager.prototype.getRows = function () {
        return this.rows;
    };

    /**
     * Get item.
     *
     * @param {number} row The index of row
     *
     * @returns {object}
     *
     * @this TablePager
     */
    TablePager.prototype.getItem = function (row) {
        var rows = this.getRows();

        if (undefined === rows[row]) {
            return null;
        }

        return rows[row];
    };

    /**
     * Refresh pager.
     *
     * @param {boolean} [rebuild]
     *
     * @this TablePager
     */
    TablePager.prototype.refreshPager = function (rebuild) {
        refreshSizeList(this, rebuild);
        refreshPageNumber(this);
        refreshPageButtons(this);
        refreshPageElements(this);
    };

    /**
     * Refresh data.
     *
     * @typedef {jQuery} TablePager.$loadingInfo The jQuery instance of loading info
     * @typedef {Array}  data.sortColumns
     *
     * @this TablePager
     */
    TablePager.prototype.refresh = function () {
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

        var self = this,
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
        this.$table.trigger($.Event('table-pager-refreshing', {'tablePager': this}));

        // scroll to the top of table
        if (null !== this.$affixTarget && self.$element.hasClass(self.options.affixClass)) {
            this.$affixTarget.animate({scrollTop: getPositionTop(self.$affixTarget, self.$mock) + 1}, this.options.affixScrollSpeed);
        }

        $.ajax(this.options.url, {
            type: this.options.method,
            data: data,
            success: function (data, textStatus, jqXHR) {
                var rowId = '_row_id',
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

                    for (j = 0; j < $cols.size(); j += 1) {
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
                    $td.attr('colspan', $cols.size());
                    $td.append(self.options.emptyMessage);
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
                var ret = {
                    data:       data,
                    textStatus: textStatus,
                    jqXHR:      jqXHR
                };

                removeLoadingInfo(self);
                self.$table.trigger($.Event('table-pager-error', {'tablePager': self, 'ret': ret}));
                self.$table.trigger($.Event('table-pager-refreshed', {'tablePager': self, 'ret': ret}));
                self.refreshPager();
            }
        });
    };

    /**
     * Go to start page.
     *
     * @this TablePager
     */
    TablePager.prototype.startPage = function () {
        this.setPageNumber(1);
    };

    /**
     * Go to previous page.
     *
     * @this TablePager
     */
    TablePager.prototype.previousPage = function () {
        this.setPageNumber(this.getPageNumber() - 1);
    };

    /**
     * Go to next page.
     *
     * @this TablePager
     */
    TablePager.prototype.nextPage = function () {
        this.setPageNumber(this.getPageNumber() + 1);
    };

    /**
     * Go to end page.
     *
     * @this TablePager
     */
    TablePager.prototype.endPage = function () {
        this.setPageNumber(this.getPageCount());
    };

    /**
     * Get the language configuration.
     *
     * @param {string} [locale] The ISO code of language
     *
     * @returns {object} The language configuration
     *
     * @this TablePager
     */
    TablePager.prototype.langData = function (locale) {
        if (undefined === locale) {
            locale = this.options.locale;
        }

        if (undefined === TablePager.LANGUAGES[locale]) {
            locale = 'en';
        }

        return TablePager.LANGUAGES[locale];
    };

    /**
     * Destroy instance.
     *
     * @this TablePager
     */
    TablePager.prototype.destroy = function () {
        this.$table
            .off('click.st.tablepager', this.options.selectors.sortable, onSortColumnAction);

        this.$sortMenu
            .off('click.st.tablepager', this.options.selectors.listSortable, onSortColumnAction);

        if (null !== this.$affixTarget) {
            this.$affixTarget.off('scroll.st.tablepager', null, onAffixScrollAction);
        }

        if (null !== this.$mock) {
            this.$mock.remove();
        }

        this.$element.removeClass(this.options.affixClass);
        this.$mock.detach();
        this.$mock.css('height', '');
        $('body').removeClass(this.options.affixBodyClass);

        this.$element
            .off('change.st.tablepager', this.options.selectors.sizeList, onPageSizeAction)
            .off('click.st.tablepager', this.options.selectors.startPage, onStartPageAction)
            .off('click.st.tablepager', this.options.selectors.previousPage, onPreviousPageAction)
            .off('change.st.tablepager', this.options.selectors.pageNumber, onPageNumberAction)
            .off('click.st.tablepager', this.options.selectors.nextPage, onNextPageAction)
            .off('click.st.tablepager', this.options.selectors.endPage, onEndPageAction)
            .off('click.st.tablepager', this.options.selectors.refresh, onRefreshAction)
            .removeData('st.tablepager');
    };


    // TABLE PAGER PLUGIN DEFINITION
    // =============================

    function Plugin(option, value) {
        var ret;

        this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.tablepager'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new TablePager(this, options);
                $this.data('st.tablepager', data);
            }

            if (typeof option === 'string') {
                ret = data[option](value);
            }
        });

        return undefined === ret ? this : ret;
    }

    old = $.fn.tablePager;

    $.fn.tablePager             = Plugin;
    $.fn.tablePager.Constructor = TablePager;


    // TABLE PAGER NO CONFLICT
    // =======================

    $.fn.tablePager.noConflict = function () {
        $.fn.tablePager = old;

        return this;
    };


    // TABLE PAGER DATA-API
    // ====================

    $(window).on('load', function () {
        $('[data-table-pager="true"]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));
