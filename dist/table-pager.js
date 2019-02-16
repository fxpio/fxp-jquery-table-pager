var FxpTablePager = (function (exports, $$1) {
  'use strict';

  $$1 = $$1 && $$1.hasOwnProperty('default') ? $$1['default'] : $$1;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
      set = Reflect.set;
    } else {
      set = function set(target, property, value, receiver) {
        var base = _superPropBase(target, property);

        var desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
          if (!desc.writable) {
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set(target, property, value, receiver);
  }

  function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);

    if (!s && isStrict) {
      throw new Error('failed to set property');
    }

    return value;
  }

  /**
   * Define the class as Jquery plugin.
   *
   * @param {String}      pluginName  The name of jquery plugin defined in $.fn
   * @param {String}      dataName    The key name of jquery data
   * @param {function}    ClassName   The class name
   * @param {boolean}     [shorthand] Check if the shorthand of jquery plugin must be added
   * @param {String|null} dataApiAttr The DOM data attribute selector name to init the jquery plugin with Data API, NULL to disable
   * @param {String}      removeName  The method name to remove the plugin data
   */

  function pluginify (pluginName, dataName, ClassName) {
    var shorthand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var dataApiAttr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var removeName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'destroy';
    var old = $$1.fn[pluginName];

    $$1.fn[pluginName] = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var resFunc, resList;
      resList = this.each(function (i, element) {
        var $this = $$1(element),
            data = $this.data(dataName);

        if (!data) {
          data = new ClassName(element, _typeof(options) === 'object' ? options : {});
          $this.data(dataName, data);
        }

        if (typeof options === 'string' && data) {
          if (data[options]) {
            resFunc = data[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          } else if (data.constructor[options]) {
            resFunc = data.constructor[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          }

          if (options === removeName) {
            $this.removeData(dataName);
          }
        }
      });
      return 1 === resList.length && undefined !== resFunc ? resFunc : resList;
    };

    $$1.fn[pluginName].Constructor = ClassName; // Shorthand

    if (shorthand) {
      $$1[pluginName] = function (options) {
        return $$1({})[pluginName](options);
      };
    } // No conflict


    $$1.fn[pluginName].noConflict = function () {
      return $$1.fn[pluginName] = old;
    }; // Data API


    if (null !== dataApiAttr) {
      $$1(window).on('load', function () {
        $$1(dataApiAttr).each(function () {
          var $this = $$1(this);
          $$1.fn[pluginName].call($this, $this.data());
        });
      });
    }
  }

  var DEFAULT_OPTIONS = {};
  /**
   * Base class for plugin.
   */

  var BasePlugin =
  /*#__PURE__*/
  function () {
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function BasePlugin(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, BasePlugin);

      this.guid = $$1.guid;
      this.options = $$1.extend(true, {}, this.constructor.defaultOptions, options);
      this.$element = $$1(element);
    }
    /**
     * Destroy the instance.
     */


    _createClass(BasePlugin, [{
      key: "destroy",
      value: function destroy() {
        var self = this;
        Object.keys(self).forEach(function (key) {
          delete self[key];
        });
      }
      /**
       * Set the default options.
       * The new values are merged with the existing values.
       *
       * @param {object} options
       */

    }], [{
      key: "defaultOptions",
      set: function set(options) {
        DEFAULT_OPTIONS[this.name] = $$1.extend(true, {}, DEFAULT_OPTIONS[this.name], options);
      }
      /**
       * Get the default options.
       *
       * @return {object}
       */
      ,
      get: function get() {
        if (undefined === DEFAULT_OPTIONS[this.name]) {
          DEFAULT_OPTIONS[this.name] = {};
        }

        return DEFAULT_OPTIONS[this.name];
      }
    }]);

    return BasePlugin;
  }();

  var LOCALES = {};
  var globalLocale;
  /**
   * Base class for i18n plugin.
   */

  var BaseI18nPlugin =
  /*#__PURE__*/
  function (_BasePlugin) {
    _inherits(BaseI18nPlugin, _BasePlugin);

    function BaseI18nPlugin() {
      _classCallCheck(this, BaseI18nPlugin);

      return _possibleConstructorReturn(this, _getPrototypeOf(BaseI18nPlugin).apply(this, arguments));
    }

    _createClass(BaseI18nPlugin, [{
      key: "locale",

      /**
       * Get the language configuration.
       *
       * @param {string} [locale] The ISO code of language
       *
       * @returns {object} The language configuration
       */
      value: function locale(_locale) {
        return this.constructor.locales[this.getLocale(_locale)];
      }
      /**
       * Get the valid available locale.
       *
       * @param {string} [locale] The ISO code of language
       *
       * @returns {object} The language configuration
       */

    }, {
      key: "getLocale",
      value: function getLocale(locale) {
        locale = locale ? locale : this.options.locale;

        if (this.constructor.locales[locale]) {
          return locale;
        }

        if (!locale) {
          if (undefined === globalLocale) {
            var metaLang = document.querySelector('head > meta[http-equiv="Content-Language"]');
            globalLocale = metaLang && metaLang.content ? metaLang.content : null;
          }

          if (undefined === globalLocale) {
            var lang = document.querySelector('html').lang;
            globalLocale = lang ? lang : null;
          }

          locale = globalLocale;
        }

        if (typeof locale === 'string') {
          locale = locale.toLowerCase().replace('-', '_');

          if (locale.indexOf('_') >= 0 && undefined === this.constructor.locales[locale]) {
            locale = locale.substr(0, locale.indexOf('_'));
          }
        }

        if (undefined === this.constructor.locales[locale]) {
          var localeKeys = Object.keys(this.constructor.locales);
          locale = localeKeys.length > 0 ? localeKeys[0] : 'en';
        }

        this.options.locale = locale;
        return locale;
      }
      /**
       * Get the map of locales.
       * The map consists of the key containing the ISO code of the language
       * and an object containing the translations for each ISO code.
       *
       * Example:
       * {
       *     'en': {
       *         'foo.bar': 'My message'
       *     }
       * }
       *
       * @param {object} translations The translations map defined in a language ISO code key
       */

    }], [{
      key: "locales",
      set: function set$$1(translations) {
        var keys, i, val; // Force the initialisation of i18n options

        this.defaultOptions = {};

        if (_typeof(translations) === 'object') {
          keys = Object.keys(translations);

          for (i = 0; i < keys.length; ++i) {
            val = translations[keys[i]];

            if (_typeof(val) === 'object') {
              if (undefined === LOCALES[this.name]) {
                LOCALES[this.name] = {};
              }

              LOCALES[this.name][keys[i]] = val;
            }
          }
        }
      }
      /**
       * Get the map of locales.
       * The map consists of the key containing the ISO code of the language
       * and an object containing the translations for each ISO code.
       *
       * @returns {object}
       */
      ,
      get: function get$$1() {
        if (undefined === LOCALES[this.name]) {
          LOCALES[this.name] = {};
        }

        return LOCALES[this.name];
      }
      /**
       * @inheritDoc
       */

    }, {
      key: "defaultOptions",
      get: function get$$1() {
        return _get(_getPrototypeOf(BaseI18nPlugin), "defaultOptions", this);
      }
      /**
       * @inheritDoc
       */
      ,
      set: function set$$1(options) {
        if (undefined === options.locale) {
          options.locale = null;
        }

        _set(_getPrototypeOf(BaseI18nPlugin), "defaultOptions", options, this, true);
      }
    }]);

    return BaseI18nPlugin;
  }(BasePlugin);

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
   */

  function onAffixScrollAction(event) {
    var self = event.data,
        isWindow = self.$affixTarget.get(0) === $(window).get(0),
        affixClass = self.options.affixClass,
        affixMinHeight = self.options.affixMinHeight,
        affixTop = isWindow ? 0 : self.$affixTarget.offset().top,
        minHeight = affixMinHeight > 0 && affixMinHeight <= 1 ? self.$affixTarget.height() * affixMinHeight : affixMinHeight,
        isOver = self.$table.height() >= minHeight,
        offsetBottom = self.$table.offset().top + self.$table.outerHeight() - affixTop - self.$element.outerHeight();

    if (undefined !== self.affixDelay) {
      window.clearTimeout(self.affixDelay);
    }

    if (!self.$element.is(':visible')) {
      isOver = false;
    } // first init offset top only if element is visible


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
    oldDirection = undefined === direction ? 'asc' : direction;

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

  function onPageSizeAction(event) {
    event.data.setPageSize($(event.target).prop('value'));
  }
  /**
   * Action on click to start page button.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {TablePager} Event.data The table pager instance
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
   */

  function onRefreshAction(event) {
    event.data.refresh();
  }

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
   */

  function removeLoadingInfo(self) {
    self.$loadingInfo.remove();
    delete self.$loadingInfo;
  }

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
  function addSortDef(self, sortDefinitions, sortOrderItem) {
    var $ths = self.$table.find(self.options.selectors.sortable + '[data-table-sort]'),
        $items = self.$sortMenu.find(self.options.selectors.listSortable + '[data-table-sort]'),
        $th = $ths.filter('[data-col-name=' + sortOrderItem + ']'),
        $item = $items.filter('[data-col-name=' + sortOrderItem + ']'),
        value;

    if (undefined !== $th.attr('data-table-sort')) {
      value = {
        name: sortOrderItem,
        sort: $th.attr('data-table-sort')
      };
    }

    if (undefined !== $item.attr('data-table-sort')) {
      value = {
        name: sortOrderItem,
        sort: $item.attr('data-table-sort')
      };
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

  function getSortColumns(self) {
    var sortDef = [],
        i;

    for (i = 0; i < self.sortOrder.length; i += 1) {
      addSortDef(self, sortDef, self.sortOrder[i]);
    }

    return sortDef;
  }

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
   * Refresh the column headers.
   *
   * @param {TablePager} self The table pager instance
   */

  function refreshEmptySelector(self) {
    if (null !== self.options.emptySelector) {
      if (0 === self.size) {
        $(self.options.emptySelector).addClass(self.options.emptyClass);
      } else {
        $(self.options.emptySelector).removeClass(self.options.emptyClass);
      }
    }
  }

  /**
   * Table Pager class.
   */

  var TablePager =
  /*#__PURE__*/
  function (_BaseI18nPlugin) {
    _inherits(TablePager, _BaseI18nPlugin);

    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function TablePager(element) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, TablePager);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TablePager).call(this, element, options));
      _this.$table = $$1('#' + _this.options.tableId);
      _this.$sortMenu = $$1(_this.options.selectors.listSortMenu, _this.$element);
      _this.sizeList = [];
      _this.pageSize = _this.options.pageSize;
      _this.pageNumber = _this.options.pageNumber;
      _this.size = _this.options.size || _this.getSizeInTable();
      _this.rows = [];
      _this.sortOrder = _this.options.sortOrder;

      _this.setMultiSortable(_this.options.multiSortable);

      _this.$affixTarget = _this.options.affixTarget !== false ? $$1(_this.options.affixTarget) : null;
      _this.$mock = null !== _this.$affixTarget ? $$1('<div class="table-pager-mock"></div>') : null;
      _this.offsetTop = null;

      if (null !== _this.$affixTarget) {
        _this.$affixTarget.on('scroll.fxp.tablepager', null, _assertThisInitialized(_this), onAffixScrollAction);
      }

      _this.$element.attr('data-size', _this.size);

      _this.$table.on('click.fxp.tablepager', _this.options.selectors.sortable, _assertThisInitialized(_this), onSortColumnAction);

      _this.$sortMenu.on('click.fxp.tablepager', _this.options.selectors.listSortable, _assertThisInitialized(_this), onSortColumnAction);

      _this.$element.on('change.fxp.tablepager', _this.options.selectors.sizeList, _assertThisInitialized(_this), onPageSizeAction).on('click.fxp.tablepager', _this.options.selectors.startPage, _assertThisInitialized(_this), onStartPageAction).on('click.fxp.tablepager', _this.options.selectors.previousPage, _assertThisInitialized(_this), onPreviousPageAction).on('change.fxp.tablepager', _this.options.selectors.pageNumber, _assertThisInitialized(_this), onPageNumberAction).on('click.fxp.tablepager', _this.options.selectors.nextPage, _assertThisInitialized(_this), onNextPageAction).on('click.fxp.tablepager', _this.options.selectors.endPage, _assertThisInitialized(_this), onEndPageAction).on('click.fxp.tablepager', _this.options.selectors.refresh, _assertThisInitialized(_this), onRefreshAction);

      var $cols = $$1(_this.options.selectors.sortable, _this.$table),
          $sorts = $$1(_this.options.selectors.listSortable, _this.$sortMenu),
          $icon,
          i;

      for (i = 0; i < $cols.length; i += 1) {
        $icon = $$1('> i.table-sort-icon', $cols.eq(i));

        if (0 === $icon.length) {
          $cols.eq(i).append(_this.options.sortIconTemplate);
        }
      }

      for (i = 0; i < $sorts.length; i += 1) {
        $icon = $$1('> i.table-sort-icon', $sorts.eq(i));

        if (0 === $icon.length) {
          $sorts.eq(i).append(_this.options.sortIconTemplate);
        }
      }

      _this.setSizeList(_this.options.sizeList);

      _this.refreshPager(true);

      if (_this.options.init) {
        _this.refresh();
      }

      return _this;
    }
    /**
     * Set multi sortable.
     *
     * @param {boolean} sortable
     */


    _createClass(TablePager, [{
      key: "setMultiSortable",
      value: function setMultiSortable(sortable) {
        this.multiSortable = sortable;
        this.$element.attr('data-multi-sortable', sortable ? 'true' : 'false');
      }
      /**
       * Check if pager is multi sortable.
       *
       * @returns {boolean}
       */

    }, {
      key: "isMultiSortable",
      value: function isMultiSortable() {
        return this.multiSortable;
      }
      /**
       * Remove column allowed to sorting.
       *
       * @param {String}  column    The column name
       * @param {boolean} multiple  False if reset sort
       * @param {string}  direction The direction of sort (asc or desc)
       */

    }, {
      key: "sortColumn",
      value: function sortColumn(column, multiple, direction) {
        multiple = undefined === multiple ? false : multiple;
        multiple = multiple ? this.isMultiSortable() : multiple;
        var sortOrder, sortDef, i;

        if ('asc' !== direction && 'desc' !== direction) {
          direction = 'asc';
        }

        sortOrder = multiple ? this.sortOrder : [];
        sortDef = [];

        if (-1 === $$1.inArray(column, sortOrder)) {
          sortOrder.push(column);
        }

        for (i = 0; i < sortOrder.length; i += 1) {
          if (column === sortOrder[i]) {
            sortDef.push({
              name: column,
              sort: direction
            });
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

    }, {
      key: "setSizeList",
      value: function setSizeList(sizes) {
        var sizesList = [],
            i;

        for (i = 0; i < sizes.length; i += 1) {
          if ('object' === _typeof(sizes[i])) {
            sizesList.push({
              value: sizes[i].value,
              label: sizes[i].label
            });
          } else {
            sizesList.push({
              value: sizes[i],
              label: sizes[i]
            });
          }
        }

        if (this.options.addAllInSize) {
          sizesList.push({
            value: 0,
            label: this.locale().all
          });
        }

        this.sizeList = sizesList;
        this.$element.attr('data-size-list', JSON.stringify(sizesList));
      }
      /**
       * Get size list.
       *
       * @returns {Array.<number, string>} The list of object value/label
       */

    }, {
      key: "getSizeList",
      value: function getSizeList() {
        return this.sizeList;
      }
      /**
       * Set page size.
       *
       * @param {number} size The page size
       */

    }, {
      key: "setPageSize",
      value: function setPageSize(size) {
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

    }, {
      key: "getPageSize",
      value: function getPageSize() {
        return this.pageSize;
      }
      /**
       * Get start number.
       *
       * @returns {number}
       */

    }, {
      key: "getStart",
      value: function getStart() {
        return (this.getPageNumber() - 1) * this.getPageSize() + 1;
      }
      /**
       * Get end number.
       *
       * @returns {number}
       */

    }, {
      key: "getEnd",
      value: function getEnd() {
        return 0 === this.getPageSize() ? this.getSize() : Math.min(this.getSize(), this.getPageSize() * this.getPageNumber());
      }
      /**
       * Set page number.
       *
       * @param {number} page The page number
       */

    }, {
      key: "setPageNumber",
      value: function setPageNumber(page) {
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

    }, {
      key: "getPageNumber",
      value: function getPageNumber() {
        return this.pageNumber;
      }
      /**
       * Get page count.
       *
       * @returns {number}
       */

    }, {
      key: "getPageCount",
      value: function getPageCount() {
        return 0 === this.pageSize ? 1 : Math.ceil(this.size / this.pageSize);
      }
      /**
       * Get size.
       *
       * @returns {number}
       */

    }, {
      key: "getSize",
      value: function getSize() {
        return this.size;
      }
      /**
       * Get size in table.
       *
       * @returns {number}
       */

    }, {
      key: "getSizeInTable",
      value: function getSizeInTable() {
        return this.$table.find('> tbody > tr[data-row-id]').length;
      }
      /**
       * Get rows.
       *
       * @returns {Array.<number, object>}
       */

    }, {
      key: "getRows",
      value: function getRows() {
        return this.rows;
      }
      /**
       * Get item.
       *
       * @param {number} row The index of row
       *
       * @returns {object}
       */

    }, {
      key: "getItem",
      value: function getItem(row) {
        var rows = this.getRows();

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

    }, {
      key: "refreshPager",
      value: function refreshPager(rebuild) {
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

    }, {
      key: "refresh",
      value: function refresh() {
        if (undefined !== this.$loadingInfo) {
          return;
        }

        $$1(this.options.selectors.sizeList, this.$element).attr('disabled', 'disabled');
        $$1(this.options.selectors.startPage, this.$element).attr('disabled', 'disabled');
        $$1(this.options.selectors.previousPage, this.$element).attr('disabled', 'disabled');
        $$1(this.options.selectors.pageNumber, this.$element).attr('disabled', 'disabled');
        $$1(this.options.selectors.nextPage, this.$element).attr('disabled', 'disabled');
        $$1(this.options.selectors.endPage, this.$element).attr('disabled', 'disabled');
        $$1(this.options.selectors.listSortBtn, this.$element).attr('disabled', 'disabled');
        $$1(this.options.selectors.refresh, this.$element).attr('disabled', 'disabled');
        var self = this,
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
        this.$table.trigger($$1.Event('table-pager-refreshing', {
          'tablePager': this,
          'ajax': ajaxParams,
          ajaxData: data
        })); // scroll to the top of table

        if (null !== this.$affixTarget && self.$element.hasClass(self.options.affixClass)) {
          this.$affixTarget.animate({
            scrollTop: getPositionTop(self.$affixTarget, self.$mock) + 1
          }, this.options.affixScrollSpeed);
        }

        $$1.ajax(this.options.url, $$1.extend(true, {}, ajaxParams, {
          type: this.options.method,
          data: data,
          success: function success(data, textStatus, jqXHR) {
            var rowId = '_row_id',
                attrColumns = '_attr_columns',
                $body = $$1('> tbody', self.$table),
                $cols = $$1('> thead > tr:last', self.$table).eq(0).children(),
                rows = undefined === data.rows ? [] : data.rows,
                content = [],
                ret = {
              data: data,
              textStatus: textStatus,
              jqXHR: jqXHR
            },
                $tr,
                colName,
                $td,
                attrs,
                attr,
                i,
                j;
            self.$table.trigger($$1.Event('table-pager-pre-success', {
              'tablePager': self,
              'ret': ret
            }));

            for (i = 0; i < rows.length; i += 1) {
              $tr = $$1('<tr></tr>');

              if (undefined !== rows[i][rowId]) {
                $tr.attr('data-row-id', rows[i][rowId]);
              }

              for (j = 0; j < $cols.length; j += 1) {
                colName = $cols.eq(j).attr('data-col-name');
                $td = $$1('<td></td>');

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
              $tr = $$1('<tr></tr>');
              $td = $$1('<td></td>');
              $td.attr('colspan', $cols.length);
              $td.append($$1('<div />').html(self.options.emptyMessage).text());
              $tr.append($td);
              content.push($tr);
            }

            removeLoadingInfo(self);
            $body.empty();
            $body.append(content);
            self.pageNumber = data.pageNumber;
            self.pageSize = data.pageSize;
            self.size = data.size;
            self.$table.trigger($$1.Event('table-pager-post-success', {
              'tablePager': self,
              'ret': ret
            }));
            self.$table.trigger($$1.Event('table-pager-refreshed', {
              'tablePager': self,
              'ret': ret
            }));
            self.refreshPager();
          },
          error: function error(data, textStatus, jqXHR) {
            var ret = {
              data: data,
              textStatus: textStatus,
              jqXHR: jqXHR
            };
            removeLoadingInfo(self);
            self.$table.trigger($$1.Event('table-pager-error', {
              'tablePager': self,
              'ret': ret
            }));
            self.$table.trigger($$1.Event('table-pager-refreshed', {
              'tablePager': self,
              'ret': ret
            }));
            self.refreshPager();
          }
        }));
      }
      /**
       * Go to start page.
       */

    }, {
      key: "startPage",
      value: function startPage() {
        this.setPageNumber(1);
      }
      /**
       * Go to previous page.
       */

    }, {
      key: "previousPage",
      value: function previousPage() {
        this.setPageNumber(this.getPageNumber() - 1);
      }
      /**
       * Go to next page.
       */

    }, {
      key: "nextPage",
      value: function nextPage() {
        this.setPageNumber(this.getPageNumber() + 1);
      }
      /**
       * Go to end page.
       */

    }, {
      key: "endPage",
      value: function endPage() {
        this.setPageNumber(this.getPageCount());
      }
      /**
       * Destroy the instance.
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this.$table.off('click.fxp.tablepager', this.options.selectors.sortable, onSortColumnAction);
        this.$sortMenu.off('click.fxp.tablepager', this.options.selectors.listSortable, onSortColumnAction);

        if (null !== this.$affixTarget) {
          this.$affixTarget.off('scroll.fxp.tablepager', null, onAffixScrollAction);
        }

        if (null !== this.$mock) {
          this.$mock.remove();
        }

        this.$element.removeClass(this.options.affixClass);
        this.$mock.detach();
        this.$mock.css('height', '');
        $$1('body').removeClass(this.options.affixBodyClass);
        this.$element.off('change.fxp.tablepager', this.options.selectors.sizeList, onPageSizeAction).off('click.fxp.tablepager', this.options.selectors.startPage, onStartPageAction).off('click.fxp.tablepager', this.options.selectors.previousPage, onPreviousPageAction).off('change.fxp.tablepager', this.options.selectors.pageNumber, onPageNumberAction).off('click.fxp.tablepager', this.options.selectors.nextPage, onNextPageAction).off('click.fxp.tablepager', this.options.selectors.endPage, onEndPageAction).off('click.fxp.tablepager', this.options.selectors.refresh, onRefreshAction);

        _get(_getPrototypeOf(TablePager.prototype), "destroy", this).call(this);
      }
    }]);

    return TablePager;
  }(BaseI18nPlugin);
  TablePager.defaultOptions = {
    tableId: null,
    pageSize: 100,
    pageNumber: 1,
    addAllInSize: false,
    sizeList: [2, 5, 10, 25, 50, 100, 150, 200],
    url: null,
    method: 'get',
    ajaxId: null,
    parameters: {},
    multiSortable: false,
    sortOrder: [],
    init: false,
    affixTarget: window,
    affixMinHeight: 300,
    affixClass: 'affix',
    affixBodyClass: 'table-pager-affixed',
    affixScrollSpeed: 300,
    loadingTemplate: '<caption class="default-loading-icon"><i class="fa fa-spin"></i></caption>',
    sortIconTemplate: '<i class="table-sort-icon fa"></i>',
    emptyMessage: null,
    emptySelector: null,
    emptyClass: 'table-empty',
    selectors: {
      sizeList: 'select.table-pager-size-list',
      startPage: 'button.table-pager-start-page',
      previousPage: 'button.table-pager-previous-page',
      pageNumber: 'input.table-pager-page-number',
      nextPage: 'button.table-pager-next-page',
      endPage: 'button.table-pager-end-page',
      refresh: 'button.table-pager-refresh',
      listSortBtn: 'button.table-pager-list-sort',
      listSortMenu: 'ul.table-pager-list-sort-menu',
      listSortable: '> li > a[data-table-pager-sortable=true]',
      sortable: '> thead > tr:last > th[data-table-pager-sortable=true]'
    }
  };
  TablePager.locales = {
    'en': {
      all: 'All'
    }
  };
  pluginify('tablePager', 'fxp.tablepager', TablePager, true, '[data-table-pager="true"]');

  exports.default = TablePager;

  return exports;

}({}, jQuery));
