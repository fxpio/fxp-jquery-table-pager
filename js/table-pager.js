/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global jQuery*/
/*global window*/
/*global TablePager*/

/**
 * @param {jQuery} $
 *
 * @typedef {TablePager} TablePager
 */
(function ($) {
    'use strict';

    /**
     * Refresh the size list of pager.
     *
     * @param {TablePager} self    The table pager instance
     * @param {boolean}    rebuild Rebuild the pager or not
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
            $refresh = $(self.options.selectors.refresh, self.$element);

        $start.attr('disabled', 'disabled');
        $previous.attr('disabled', 'disabled');
        $next.attr('disabled', 'disabled');
        $end.attr('disabled', 'disabled');
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

        var $ths = self.$table.find('> thead > tr:last > th[data-table-sort]'),
            $th,
            i;

        $ths.removeAttr('data-table-sort');

        for (i = 0; i < sortDefinitions.length; i += 1) {
            $th = self.$table.find('> thead >tr:last > th[data-col-name=' + sortDefinitions[i].name + ']');

            $th.attr('data-table-sort', sortDefinitions[i].sort);
            self.sortOrder.push(sortDefinitions[i].name);
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
            $th,
            i;

        for (i = 0; i < self.sortOrder.length; i += 1) {
            $th = self.$table.find('> thead >tr:last > th[data-col-name=' + self.sortOrder[i] + ']');

            if (undefined !== $th.attr('data-table-sort')) {
                sortDef.push({name: self.sortOrder[i], sort: $th.attr('data-table-sort')});
            }
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
        var $parent = self.$table.parents('.table-responsive:first'),
            marginTop = $('> thead', self.$table).outerHeight(),
            width = $parent.size() > 0 ? $parent.outerWidth() : self.$table.outerWidth(),
            height = $('> tbody', self.$table).outerHeight() + marginTop;

        self.$loadingInfo = $(self.options.loadingTemplate);
        self.$loadingInfo.attr('data-table-pager-loading-info', 'true');
        self.$loadingInfo.css('margin-top', -marginTop);
        self.$loadingInfo.css('padding-top', height / 3);
        self.$loadingInfo.css('width', width);
        self.$loadingInfo.css('height', height);
        self.$table.prepend(self.$loadingInfo);
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
            $col = $(event.target),
            multiple = event.ctrlKey ? self.isMultiSortable() : event.ctrlKey,
            direction = $col.attr('data-table-sort'),
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
        this.options       = $.extend({}, TablePager.DEFAULTS, options);
        this.$element      = $(element);
        this.$table        = $('#' + this.$element.attr('data-table-id'));
        this.sizeList      = [];
        this.pageSize      = this.options.pageSize;
        this.pageNumber    = this.options.pageNumber;
        this.size          = this.options.size || this.getSizeInTable();
        this.rows          = [];
        this.sortOrder     = this.options.sortOrder;
        this.setMultiSortable(this.options.multiSortable);

        this.$table
            .on('click.st.tablepager', this.options.selectors.sortable, this, onSortColumnAction);

        this.$element
            .on('change.st.tablepager', this.options.selectors.sizeList, this, onPageSizeAction)
            .on('click.st.tablepager', this.options.selectors.startPage, this, onStartPageAction)
            .on('click.st.tablepager', this.options.selectors.previousPage, this, onPreviousPageAction)
            .on('change.st.tablepager', this.options.selectors.pageNumber, this, onPageNumberAction)
            .on('click.st.tablepager', this.options.selectors.nextPage, this, onNextPageAction)
            .on('click.st.tablepager', this.options.selectors.endPage, this, onEndPageAction)
            .on('click.st.tablepager', this.options.selectors.refresh, this, onRefreshAction);

        var $cols = $(this.options.selectors.sortable, this.$table),
            $icon,
            i;

        for (i = 0; i < $cols.size(); i += 1) {
            $icon = $('> i.table-sort-icon', $cols.eq(i));

            if (0 === $icon.size()) {
                $cols.eq(i).append(this.options.sortIconTemplate);
            }
        }

        this.setSizeList(this.options.sizeList);
        this.refreshPager(true);
    },
        old;

    /**
     * Defaults options.
     *
     * @type {object}
     */
    TablePager.DEFAULTS = {
        locale:           'en',
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
        loadingTemplate:  '<caption><i class="fa fa-spin"></i></caption>',
        sortIconTemplate: '<i class="table-sort-icon fa"></i>',
        selectors:        {
            sizeList:     'select.table-pager-size-list',
            startPage:    'button.table-pager-start-page',
            previousPage: 'button.table-pager-previous-page',
            pageNumber:   'input.table-pager-page-number',
            nextPage:     'button.table-pager-next-page',
            endPage:      'button.table-pager-end-page',
            refresh:      'button.table-pager-refresh',
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
            $th,
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
                $th = this.$table.find('> thead >tr:last > th[data-col-name=' + sortOrder[i] + ']');

                if (undefined !== $th.attr('data-table-sort')) {
                    sortDef.push({name: sortOrder[i], sort: $th.attr('data-table-sort')});
                }
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
     * @param {boolean} rebuild
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
        $(this.options.selectors.refresh, this.$element).attr('disabled', 'disabled');

        var self = this,
            event = $.Event('table-pager-refreshing', {'tablePager': this}),
            data = {};

        data.ajax_id = this.options.ajaxId;
        data[this.options.ajaxId + '_ps'] = this.getPageSize();
        data[this.options.ajaxId + '_pn'] = this.getPageNumber();
        data[this.options.ajaxId + '_p'] = this.options.parameters;
        data[this.options.ajaxId + '_sc'] = getSortColumns(this);

        createLoadingInfo(this);
        this.$table.trigger(event);

        $.ajax(this.options.url, {
            type: this.options.method,
            data: data,
            success: function (data, textStatus, jqXHR) {
                var rowId = '_row_id',
                    attrColumns = '_attr_columns',
                    $body = $('> tbody', self.$table),
                    $cols = $('> thead > tr:last', self.$table).eq(0).children(),
                    content = [],
                    ret = {
                        data:       data,
                        textStatus: textStatus,
                        jqXHR:      jqXHR
                    },
                    event = $.Event('table-pager-refreshed', {'tablePager': self, 'ret': ret}),
                    $tr,
                    colName,
                    $td,
                    attrs,
                    attr,
                    i,
                    j;

                for (i = 0; i < data.rows.length; i += 1) {
                    $tr = $('<tr></tr>');

                    if (undefined !== data.rows[i][rowId]) {
                        $tr.attr('data-row-id', data.rows[i][rowId]);
                    }

                    for (j = 0; j < $cols.size(); j += 1) {
                        colName = $cols.eq(j).attr('data-col-name');
                        $td = $('<td></td>');

                        if (undefined !== data.rows[i][attrColumns] && data.rows[i][attrColumns][colName]) {
                            attrs = data.rows[i][attrColumns][colName];

                            for (attr in attrs) {
                                if (attrs.hasOwnProperty(attr)) {
                                    $td.attr(attr, attrs[attr]);
                                }
                            }
                        }

                        if (undefined !== data.rows[i][colName]) {
                            $td.append(data.rows[i][colName]);
                        }

                        $td.attr('data-col-name', colName);
                        $tr.append($td);
                    }

                    content.push($tr);
                }

                removeLoadingInfo(self);
                $body.empty();
                $body.append(content);
                self.pageNumber = data.pageNumber;
                self.pageSize = data.pageSize;
                self.size = data.size;
                refreshColumnHeaders(self, data.sortColumns);
                self.$table.trigger(event);
                self.refreshPager();
            },
            error: function (data, textStatus, jqXHR) {
                var ret = {
                    data:       data,
                    textStatus: textStatus,
                    jqXHR:      jqXHR
                },
                    event = $.Event('table-pager-refreshed', {'tablePager': self, 'ret': ret});

                removeLoadingInfo(self);
                self.$table.trigger(event);
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
     * @param {string} locale The ISO code of language
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

        this.$element
            .off('change.st.tablepager', this.options.selectors.sizeList, onPageSizeAction)
            .off('click.st.tablepager', this.options.selectors.startPage, onStartPageAction)
            .off('click.st.tablepager', this.options.selectors.previousPage, onPreviousPageAction)
            .off('change.st.tablepager', this.options.selectors.pageNumber, onPageNumberAction)
            .off('click.st.tablepager', this.options.selectors.nextPage, onNextPageAction)
            .off('click.st.tablepager', this.options.selectors.endPage, onEndPageAction)
            .off('click.st.tablepager', this.options.selectors.refresh, onRefreshAction);

        this.$element.$element.removeData('st.tablepager');
    };


    // TABLE PAGER PLUGIN DEFINITION
    // =============================

    function Plugin(option, value) {
        return this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.tablepager'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                $this.data('st.tablepager', (data = new TablePager(this, options)));
            }

            if (typeof option === 'string') {
                data[option](value);
            }
        });
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

}(jQuery));
