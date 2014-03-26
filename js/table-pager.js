/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

+function ($) {
    'use strict';

    // TABLE PAGER CLASS DEFINITION
    // ============================

    /**
     * @constructor
     *
     * @param htmlString|Element|Array|jQuery element
     * @param Array                           options
     *
     * @this
     */
    var TablePager = function (element, options) {
        this.guid          = jQuery.guid;
        this.options       = $.extend({}, TablePager.DEFAULTS, options);
        this.$element      = $(element);
        this.$table        = this.$element.parents('table:first');
        this.sizeList      = new Array();
        this.pageSize      = this.options.pageSize;
        this.pageNumber    = this.options.pageNumber;
        this.size          = this.options.size || this.getSizeInTable();
        this.rows          = new Array();
        this.multiSortable = this.options.multiSortable;
        this.sortOrder     = this.options.sortOrder;

        this.$table
            .on('change.st.tablepager', this.options.selectors.sizeList, $.proxy(onPageSizeAction, this))
            .on('click.st.tablepager', this.options.selectors.startPage, $.proxy(onStartPageAction, this))
            .on('click.st.tablepager', this.options.selectors.previousPage, $.proxy(onPreviousPageAction, this))
            .on('change.st.tablepager', this.options.selectors.pageNumber, $.proxy(onPageNumberAction, this))
            .on('click.st.tablepager', this.options.selectors.nextPage, $.proxy(onNextPageAction, this))
            .on('click.st.tablepager', this.options.selectors.endPage, $.proxy(onEndPageAction, this))
            .on('click.st.tablepager', this.options.selectors.refresh, $.proxy(onRefreshAction, this))
            .on('click.st.tablepager', this.options.selectors.sortable, $.proxy(onSortColumnAction, this))
        ;

        var $cols = $(this.options.selectors.sortable, this.$table);

        for (var i = 0; i < $cols.size(); i++) {
            var $icon = $('> i.table-sort-icon', $cols.eq(i));

            if (0 == $icon.size()) {
                $cols.eq(i).append(this.options.sortIconTemplate);
            }
        }

        this.setSizeList(this.options.sizeList);
        this.refreshPager(true);
    };

    /**
     * Defaults options.
     *
     * @type Array
     */
    TablePager.DEFAULTS = {
        locale:           'en',
        pageSize:         100,
        pageNumber:       1,
        addAllInSize:     false,
        sizeList:         [2, 5, 10, 25, 50, 100, 150, 200],
        url:              null,
        method:           'post',
        ajaxId:           null,
        parameters:       {},
        multiSortable:    false,
        sortOrder:        new Array(),
        loadingTemplate:  '<caption><i class="fa fa-spin"></i></caption>',
        sortIconTemplate: '<i class="table-sort-icon fa"></i>',
        selectors:        {
            sizeList:     '> thead select.table-pager-size-list',
            startPage:    '> thead button.table-pager-start-page',
            previousPage: '> thead button.table-pager-previous-page',
            pageNumber:   '> thead input.table-pager-page-number',
            nextPage:     '> thead button.table-pager-next-page',
            endPage:      '> thead button.table-pager-end-page',
            refresh:      '> thead button.table-pager-refresh',
            sortable:     '> thead > tr:last > th[data-table-pager-sortable=true]'
        }
    };

    /**
     * Defaults languages.
     *
     * @type Array
     */
    TablePager.LANGUAGES = {
        en: {
            all: 'All'
        }
    };

    /**
     * Set multi sortable.
     *
     * @param Boolean sortable
     *
     * @this
     */
    TablePager.prototype.setMultiSortable = function (sortable) {
        this.multiSortable = sortable;
    };

    /**
     * Check if pager is multi sortable.
     *
     * @return Boolean
     *
     * @this
     */
    TablePager.prototype.isMultiSortable = function () {
        return this.multiSortable;
    };

    /**
     * Add column allowed to sorting.
     *
     * @param String column The column name
     * @param String sort   The direction of order (asc , desc)
     *
     * @this
     */
    TablePager.prototype.addSortable = function (column, sort) {
        var $col = $('> thead > tr:last > th[data-col-name=' + column + ']', this.$table);

        $col.attr('data-table-pager-sortable', 'true');

        if ('asc' === sort || 'desc' === sort) {
            $col.attr('data-table-sort', sort);
        }

        if (0 == $col.find('> i.table-sort-icon').size()) {
            $col.append(this.options.sortIconTemplate);
        }
    };

    /**
     * Remove column allowed to sorting.
     *
     * @param String column
     *
     * @this
     */
    TablePager.prototype.removeSortable = function (column) {
        var $col = $('> thead > tr:last > th[data-col-name=' + column + ']', this.$table);

        $col.find('> i.table-sort-icon').remove();
        $col
            .removeAttr('data-table-pager-sortable')
            .removeAttr('data-table-sort')
        ;
    };

    /**
     * Remove column allowed to sorting.
     *
     * @param String  column    The column name
     * @param Boolean multiple  False if reset sort
     * @param String  direction The direction of sort
     *
     * @this
     */
    TablePager.prototype.sortColumn = function (column, multiple, direction) {
        multiple = undefined == multiple ? false : multiple;
        multiple = multiple ? this.isMultiSortable() : multiple;
        var oldDirection = undefined == direction ? 'asc' : direction;

        if (undefined == direction || 'desc' == direction) {
            direction = 'asc';
        } else if ('asc' == direction) {
            direction = 'desc';
        }

        if (!multiple && this.sortOrder.length > 1) {
            direction = oldDirection;
        }

        var sortOrder = multiple ? this.sortOrder : new Array();
        var sortDef = new Array();

        if (-1 == $.inArray(column, sortOrder)) {
            sortOrder.push(column);
        }

        for (var i = 0; i < sortOrder.length; i++) {
            if (column == sortOrder[i]) {
                sortDef.push({name: column, sort: direction});
            } else {
                var $th = this.$table.find('> thead >tr:last > th[data-col-name=' + sortOrder[i] + ']');

                if (undefined != $th.attr('data-table-sort')) {
                    sortDef.push({name: sortOrder[i], sort: $th.attr('data-table-sort')});
                }
            }
        }

        $.proxy(refreshColumnHeaders, this)(sortDef);
        this.refresh();
    };

    /**
     * Set size list.
     *
     * @param Array sizes The list of size list
     *
     * @this
     */
    TablePager.prototype.setSizeList = function (sizes) {
        var sizesList = new Array();

        for (var i = 0; i < sizes.length; i++) {
            if ('object' === typeof sizes[i]) {
                sizesList.push({value: sizes[i].value, label: sizes[i].label});
                continue;
            }

            sizesList.push({value: sizes[i], label: sizes[i]});
        }

        if (this.options.addAllInSize) {
            sizesList.push({value: 0, label: this.langData().all});
        }

        this.sizeList = sizesList;
    };

    /**
     * Get size list.
     *
     * @return Array The list of object value/label
     *
     * @this
     */
    TablePager.prototype.getSizeList = function () {
        return this.sizeList;
    };

    /**
     * Set page size.
     *
     * @param Number size The page size
     *
     * @this
     */
    TablePager.prototype.setPageSize = function (size) {
        this.pageSize = parseInt(size);
        this.pageNumber = 1;
        this.refresh();
    };

    /**
     * Get page size.
     *
     * @return Number
     *
     * @this
     */
    TablePager.prototype.getPageSize = function () {
        return this.pageSize;
    };

    /**
     * Get start number.
     *
     * @return Number
     *
     * @this
     */
    TablePager.prototype.getStart = function () {
        return (this.getPageNumber() - 1) * this.getPageSize() + 1;
    };

    /**
     * Get end number.
     *
     * @return Number
     *
     * @this
     */
    TablePager.prototype.getEnd = function () {
        return 0 == this.getPageSize() ? this.getSize() : Math.min(this.getSize(), this.getPageSize() * this.getPageNumber());
    };

    /**
     * Set page number.
     *
     * @param Number page The page number
     *
     * @this
     */
    TablePager.prototype.setPageNumber = function (page) {
        this.pageNumber = Math.min(page, this.getPageCount());
        this.pageNumber = Math.max(this.pageNumber, 1);
        this.refresh();
    };

    /**
     * Get page number.
     *
     * @return Number
     *
     * @this
     */
    TablePager.prototype.getPageNumber = function () {
        return this.pageNumber;
    };

    /**
     * Get page count.
     *
     * @return Number
     *
     * @this
     */
    TablePager.prototype.getPageCount = function () {
        return 0 == this.pageSize ? 1 : Math.ceil(this.size / this.pageSize);
    };

    /**
     * Get size.
     *
     * @return Number
     *
     * @this
     */
    TablePager.prototype.getSize = function () {
        return this.size;
    };

    /**
     * Get size in table.
     *
     * @return Number
     *
     * @this
     */
    TablePager.prototype.getSizeInTable = function () {
        return this.$table.find('> tbody > tr[data-row-id]').size();
    };

    /**
     * Get rows.
     *
     * @return Array
     *
     * @this
     */
    TablePager.prototype.getRows = function () {
        return this.rows;
    };

    /**
     * Get item.
     *
     * @param Number row
     *
     * @return Object
     *
     * @this
     */
    TablePager.prototype.getItem = function (row) {
        if (undefined == this.rows[row]) {
            return null;
        }

        return this.rows[row];
    };

    /**
     * Refresh pager.
     *
     * @param Boolean rebuild
     *
     * @this
     */
    TablePager.prototype.refreshPager = function (rebuild) {
        $.proxy(refreshSizeList, this)(rebuild);
        $.proxy(refreshPageNumber, this)();
        $.proxy(refreshPageButtons, this)();
        $.proxy(refreshPageElements, this)();
    };

    /**
     * Refresh data.
     *
     * @this
     */
    TablePager.prototype.refresh = function () {
        if (undefined != this.$loadingInfo) {
            return;
        }

        $(this.options.selectors.sizeList, this.$table).attr('disabled', 'disabled');
        $(this.options.selectors.startPage, this.$table).attr('disabled', 'disabled');
        $(this.options.selectors.previousPage, this.$table).attr('disabled', 'disabled');
        $(this.options.selectors.pageNumber, this.$table).attr('disabled', 'disabled');
        $(this.options.selectors.nextPage, this.$table).attr('disabled', 'disabled');
        $(this.options.selectors.endPage, this.$table).attr('disabled', 'disabled');
        $(this.options.selectors.refresh, this.$table).attr('disabled', 'disabled');

        var self = this;
        var event = $.Event('table-pager-refreshing', {'tablePager': this});
        var data = {};
            data['ajax_id'] = this.options.ajaxId;
            data[this.options.ajaxId + '_ps'] = this.getPageSize();
            data[this.options.ajaxId + '_pn'] = this.getPageNumber();
            data[this.options.ajaxId + '_p'] = this.options.parameters;
            data[this.options.ajaxId + '_sc'] = getSortColumns.apply(this);

        createLoadingInfo.apply(this);
        this.$element.trigger(event);

        $.ajax( this.options.url, {
            type: this.options.method,
            data: data,
            success: function (data, textStatus, jqXHR) {
                var $body = $('> tbody', self.$table);
                var $cols = $('> thead > tr:last', self.$table).children();
                var content = new Array();
                var ret = {
                    data:       data,
                    textStatus: textStatus,
                    jqXHR:      jqXHR
                };
                var event = $.Event('table-pager-refreshed', {'tablePager': self, 'ret': ret});

                for (var i = 0; i < data.rows.length; i++) {;
                    var $tr = $('<tr></tr>');

                    if (undefined != data.rows[i]['_row_id']) {
                        $tr.attr('data-row-id', data.rows[i]['_row_id']);
                    }

                    for (var j = 0; j < $cols.size(); j++) {
                        var colName = $cols.eq(j).attr('data-col-name');
                        var $td = $('<td></td>');

                        if (undefined != data.rows[i]['_attr_columns'] && data.rows[i]['_attr_columns'][colName]) {
                            var attrs = data.rows[i]['_attr_columns'][colName];

                            for (var attr in attrs) {
                                $td.attr(attr, attrs[attr]);
                            }
                        }

                        if (undefined != data.rows[i][colName]) {
                            $td.append(data.rows[i][colName]);
                        }

                        $td.attr('data-col-name', colName);
                        $tr.append($td);
                    }

                    content.push($tr);
                }

                removeLoadingInfo.apply(self);
                $body.empty();
                $body.append(content);
                self.pageNumber = data.pageNumber;
                self.pageSize = data.pageSize;
                self.size = data.size;
                $.proxy(refreshColumnHeaders, self)(data.sortColumns);
                self.$element.trigger(event);
                self.refreshPager();
            },
            error: function (data, textStatus, jqXHR) {
                var ret = {
                    data:       data,
                    textStatus: textStatus,
                    jqXHR:      jqXHR
                };
                var event = $.Event('table-pager-refreshed', {'tablePager': self, 'ret': ret});

                removeLoadingInfo.apply(self);
                self.$element.trigger(event);
                self.refreshPager();
            }
        });
    };

    /**
     * Go to start page.
     *
     * @this
     */
    TablePager.prototype.startPage = function () {
        this.setPageNumber(1);
    };

    /**
     * Go to previous page.
     *
     * @this
     */
    TablePager.prototype.previousPage = function () {
        this.setPageNumber(this.getPageNumber() - 1);
    };

    /**
     * Go to next page.
     *
     * @this
     */
    TablePager.prototype.nextPage = function () {
        this.setPageNumber(this.getPageNumber() + 1);
    };

    /**
     * Go to end page.
     *
     * @this
     */
    TablePager.prototype.endPage = function () {
        this.setPageNumber(this.getPageCount());
    };

    /**
     * Get the language configuration.
     *
     * @param String locale The ISO code of language
     *
     * @return Array The language configuration
     *
     * @this
     */
    TablePager.prototype.langData = function (locale) {
        if (undefined == locale) {
            locale = this.options.locale;
        }

        if (undefined == TablePager.LANGUAGES[locale]) {
            locale = 'en';
        }

        return TablePager.LANGUAGES[locale];
    };

    /**
     * Destroy instance.
     *
     * @this
     */
    TablePager.prototype.destroy = function () {
        this.$table
            .off('change.st.tablepager', this.options.selectors.sizeList, $.proxy(onPageSizeAction, this))
            .off('click.st.tablepager', this.options.selectors.startPage, $.proxy(onStartPageAction, this))
            .off('click.st.tablepager', this.options.selectors.previousPage, $.proxy(onPreviousPageAction, this))
            .off('change.st.tablepager', this.options.selectors.pageNumber, $.proxy(onPageNumberAction, this))
            .off('click.st.tablepager', this.options.selectors.nextPage, $.proxy(onNextPageAction, this))
            .off('click.st.tablepager', this.options.selectors.endPage, $.proxy(onEndPageAction, this))
            .off('click.st.tablepager', this.options.selectors.refresh, $.proxy(onRefreshAction, this))
            .off('click.st.tablepager', this.options.selectors.sortable, $.proxy(onSortColumnAction, this))
        ;

        this.$element.$element.removeData('st.tablepager');
    };

    /**
     * Refresh the size list of pager.
     *
     * @this
     * @private
     */
    function refreshSizeList (rebuild) {
        var $sizeList = $(this.options.selectors.sizeList, this.$table);

        $sizeList.attr('disabled', 'disabled');

        if (rebuild) {
            $sizeList.empty();

            for (var i = 0; i < this.sizeList.length; i++) {
                var $opt = $('<option value="' + this.sizeList[i]['value'] + '">' + this.sizeList[i]['label'] + '</option>');

                if (this.sizeList[i]['value'] == this.pageSize) {
                    $opt.prop('selected', 'selected');
                }

                $sizeList.append($opt);
            }
        }

        if (this.sizeList.length > 1) {
            $sizeList.removeAttr('disabled');
        }
    }

    /**
     * Refresh the page number of pager.
     *
     * @this
     * @private
     */
    function refreshPageNumber () {
        var $pageNumber = $(this.options.selectors.pageNumber, this.$table);
        var $pageCount = $('> thead span.table-pager-page-count', this.$table);

        $pageNumber.attr('disabled', 'disabled');
        $pageNumber.prop('value', this.getPageNumber());
        $pageCount.text(this.getPageCount());

        if (this.getPageCount() > 1) {
            $pageNumber.removeAttr('disabled');
        }
    }

    /**
     * Refresh the page buttons.
     *
     * @this
     * @private
     */
    function refreshPageButtons () {
        var $start = $(this.options.selectors.startPage, this.$table);
        var $previous = $(this.options.selectors.previousPage, this.$table);
        var $next = $(this.options.selectors.nextPage, this.$table);
        var $end = $(this.options.selectors.endPage, this.$table);
        var $refresh = $(this.options.selectors.refresh, this.$table);

        $start.attr('disabled', 'disabled');
        $previous.attr('disabled', 'disabled');
        $next.attr('disabled', 'disabled');
        $end.attr('disabled', 'disabled');
        $refresh.removeAttr('disabled');

        if (this.pageNumber > 1) {
            $start.removeAttr('disabled');
            $previous.removeAttr('disabled');
        }

        if (this.pageNumber < this.getPageCount()) {
            $next.removeAttr('disabled');
            $end.removeAttr('disabled');
        }
    }

    /**
     * Refresh the page elements.
     *
     * @this
     * @private
     */
    function refreshPageElements () {
        var $elements = $('> thead div.table-pager-elements', this.$table);

        $('> span.table-pager-start', $elements).text(this.getStart());
        $('> span.table-pager-end', $elements).text(this.getEnd());
        $('> span.table-pager-size', $elements).text(this.getSize());
    }

    /**
     * Refresh the column headers.
     *
     * @param Array sortDefinitions The sort column definitions
     *
     * @this
     * @private
     */
    function refreshColumnHeaders (sortDefinitions) {
        this.sortOrder = new Array();
        var $ths = this.$table.find('> thead > tr:last > th[data-table-sort]');
        $ths.removeAttr('data-table-sort');

        for (var i = 0; i < sortDefinitions.length; i++) {
            var $th = this.$table.find('> thead >tr:last > th[data-col-name=' + sortDefinitions[i]['name'] + ']');

            $th.attr('data-table-sort', sortDefinitions[i]['sort']);
            this.sortOrder.push(sortDefinitions[i]['name']);
        }
    }

    /**
     * Get the sort column definitions.
     *
     * @this
     * @private
     */
    function getSortColumns () {
        var sortDef = new Array();

        for (var i = 0; i < this.sortOrder.length; i++) {
            var $th = this.$table.find('> thead >tr:last > th[data-col-name=' + this.sortOrder[i] + ']');

            if (undefined != $th.attr('data-table-sort')) {
                sortDef.push({name: this.sortOrder[i], sort: $th.attr('data-table-sort')});
            }
        }

        return sortDef;
    }

    /**
     * Action on click to refresh button.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onPageSizeAction (event) {
        this.setPageSize($(event.target).prop('value'));
    }

    /**
     * Action on click to start page button.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onStartPageAction (event) {
        this.startPage();
    }

    /**
     * Action on click to previous page button.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onPreviousPageAction (event) {
        this.previousPage();
    }

    /**
     * Action on change page number input.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onPageNumberAction (event) {
        this.setPageNumber($(event.target).prop('value'));
    }

    /**
     * Action on click to next page button.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onNextPageAction (event) {
        this.nextPage();
    }

    /**
     * Action on click to end page button.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onEndPageAction (event) {
        this.endPage();
    }

    /**
     * Action on click to refresh button.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onRefreshAction (event) {
        this.refresh();
    }

    /**
     * Action on click to sortable column header.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onSortColumnAction (event) {
        var $col = $(event.target);
        this.sortColumn($col.attr('data-col-name'), event.ctrlKey, $col.attr('data-table-sort'));
    }

    /**
     * Creates the loading info hover the table.
     *
     * @this
     * @private
     */
    function createLoadingInfo () {
        var $parent = this.$table.parents('.table-responsive:first');
        var marginTop = $('> thead', this.$table).outerHeight();
        var width = $parent.size() > 0 ? $parent.outerWidth() : this.$table.outerWidth();
        var height = $('> tbody', this.$table).outerHeight() + marginTop;

        this.$loadingInfo = $(this.options.loadingTemplate);
        this.$loadingInfo.attr('data-table-pager-loading-info', 'true');
        this.$loadingInfo.css('margin-top', -marginTop);
        this.$loadingInfo.css('padding-top', height / 3);
        this.$loadingInfo.css('width', width);
        this.$loadingInfo.css('height', height);
        this.$table.prepend(this.$loadingInfo);
    }

    /**
     * Removes the loading info hover the table.
     *
     * @this
     * @private
     */
    function removeLoadingInfo () {
        this.$loadingInfo.remove();
        delete this.$loadingInfo;
    }


    // TABLE PAGER PLUGIN DEFINITION
    // =============================

    var old = $.fn.tablePager;

    $.fn.tablePager = function (option, _relatedTarget) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('st.tablepager');
            var options = typeof option == 'object' && option;

            if (!data && option == 'destroy') {
                return;
            }

            if (!data) {
                $this.data('st.tablepager', (data = new TablePager(this, options)));
            }

            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

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
            $this.tablePager($this.data());
        });
    });

}(jQuery);
