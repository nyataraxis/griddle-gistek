(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "_"], factory);
	else if(typeof exports === 'object')
		exports["Griddle"] = factory(require("React"), require("_"));
	else
		root["Griddle"] = factory(root["React"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	'use strict';

	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var assign = __webpack_require__(13);

	var GridTable = __webpack_require__(4);
	var GridFilter = __webpack_require__(5);
	var GridPagination = __webpack_require__(6);
	var GridSettings = __webpack_require__(7);
	var GridNoData = __webpack_require__(8);
	var CustomRowComponentContainer = __webpack_require__(9);
	var CustomPaginationContainer = __webpack_require__(10);
	var ColumnProperties = __webpack_require__(11);
	var RowProperties = __webpack_require__(12);

	var Griddle = React.createClass({
	    displayName: 'Griddle',

	    columnSettings: null,
	    rowSettings: null,
	    getDefaultProps: function getDefaultProps() {
	        return {
	            columns: [],
	            columnMetadata: [],
	            rowMetadata: null,
	            resultsPerPage: 5,
	            results: [], // Used if all results are already loaded.
	            initialSort: '',
	            initialSortAscending: true,
	            gridClassName: '',
	            tableClassName: '',
	            customRowComponentClassName: '',
	            settingsText: 'Settings',
	            filterPlaceholderText: 'Filter Results',
	            nextText: 'Next',
	            previousText: 'Previous',
	            maxRowsText: 'Rows per page',
	            enableCustomFormatText: 'Enable Custom Formatting',
	            //this column will determine which column holds subgrid data
	            //it will be passed through with the data object but will not be rendered
	            childrenColumnName: 'children',
	            //Any column in this list will be treated as metadata and will be passed through with the data but won't be rendered
	            metadataColumns: [],
	            showFilter: false,
	            showSettings: false,
	            useCustomRowComponent: false,
	            useCustomGridComponent: false,
	            useCustomPagerComponent: false,
	            useGriddleStyles: true,
	            useGriddleIcons: true,
	            customRowComponent: null,
	            customGridComponent: null,
	            customPagerComponent: {},
	            enableToggleCustom: false,
	            noDataMessage: 'There is no data to display.',
	            noDataClassName: 'griddle-nodata',
	            customNoDataComponent: null,
	            showTableHeading: true,
	            showPager: true,
	            useFixedHeader: false,
	            useExternal: false,
	            externalSetPage: null,
	            externalChangeSort: null,
	            externalSetFilter: null,
	            externalSetPageSize: null,
	            externalMaxPage: null,
	            externalCurrentPage: null,
	            externalSortColumn: null,
	            externalSortAscending: true,
	            externalLoadingComponent: null,
	            externalIsLoading: false,
	            enableInfiniteScroll: false,
	            bodyHeight: null,
	            paddingHeight: 5,
	            rowHeight: 25,
	            infiniteScrollLoadTreshold: 50,
	            useFixedLayout: true,
	            isSubGriddle: false,
	            enableSort: true,
	            onRowClick: null,
	            /* css class names */
	            sortAscendingClassName: 'sort-ascending',
	            sortDescendingClassName: 'sort-descending',
	            parentRowCollapsedClassName: 'parent-row',
	            parentRowExpandedClassName: 'parent-row expanded',
	            settingsToggleClassName: 'settings',
	            nextClassName: 'griddle-next',
	            previousClassName: 'griddle-previous',
	            headerStyles: {},
	            /* icon components */
	            sortAscendingComponent: ' ▲',
	            sortDescendingComponent: ' ▼',
	            parentRowCollapsedComponent: '▶',
	            parentRowExpandedComponent: '▼',
	            settingsIconComponent: '',
	            nextIconComponent: '',
	            previousIconComponent: ''
	        };
	    },
	    /* if we have a filter display the max page and results accordingly */
	    setFilter: function setFilter(filter) {
	        if (this.props.useExternal) {
	            this.props.externalSetFilter(filter);
	            return;
	        }

	        var that = this,
	            updatedState = {
	            page: 0,
	            filter: filter
	        };

	        // Obtain the state results.
	        updatedState.filteredResults = _.filter(this.props.results, function (item) {
	            var arr = _.values(item);
	            for (var i = 0; i < arr.length; i++) {
	                if ((arr[i] || '').toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
	                    return true;
	                }
	            }

	            return false;
	        });

	        // Update the max page.
	        updatedState.maxPage = that.getMaxPage(updatedState.filteredResults);

	        //if filter is null or undefined reset the filter.
	        if (_.isUndefined(filter) || _.isNull(filter) || _.isEmpty(filter)) {
	            updatedState.filter = filter;
	            updatedState.filteredResults = null;
	        }

	        // Set the state.
	        that.setState(updatedState);
	    },
	    setPageSize: function setPageSize(size) {
	        if (this.props.useExternal) {
	            this.props.externalSetPageSize(size);
	            return;
	        }

	        //make this better.
	        this.props.resultsPerPage = size;
	        this.setMaxPage();
	    },
	    toggleColumnChooser: function toggleColumnChooser() {
	        this.setState({
	            showColumnChooser: !this.state.showColumnChooser
	        });
	    },
	    toggleCustomComponent: function toggleCustomComponent() {
	        if (this.state.customComponentType === 'grid') {
	            this.setProps({
	                useCustomGridComponent: !this.props.useCustomGridComponent
	            });
	        } else if (this.state.customComponentType === 'row') {
	            this.setProps({
	                useCustomRowComponent: !this.props.useCustomRowComponent
	            });
	        }
	    },
	    getMaxPage: function getMaxPage(results, totalResults) {
	        if (this.props.useExternal) {
	            return this.props.externalMaxPage;
	        }

	        if (!totalResults) {
	            totalResults = (results || this.getCurrentResults()).length;
	        }
	        var maxPage = Math.ceil(totalResults / this.props.resultsPerPage);
	        return maxPage;
	    },
	    getMaxPageState: function getMaxPageState(results) {
	        var maxPage = this.getMaxPage(results);
	        if (!this.state || this.state.maxPage !== maxPage) {
	            return { page: 0, maxPage: maxPage, filteredColumns: this.columnSettings.filteredColumns };
	        }
	    },
	    setMaxPage: function setMaxPage(results) {
	        this.setState(this.getMaxPageState(results));
	    },
	    setPage: function setPage(number) {
	        if (this.props.useExternal) {
	            this.props.externalSetPage(number);
	            return;
	        }

	        //check page size and move the filteredResults to pageSize * pageNumber
	        if (number * this.props.resultsPerPage <= this.props.resultsPerPage * this.state.maxPage) {
	            var that = this,
	                state = {
	                page: number
	            };

	            that.setState(state);
	        }
	    },
	    setColumns: function setColumns(columns) {
	        this.columnSettings.filteredColumns = _.isArray(columns) ? columns : [columns];

	        this.setState({
	            filteredColumns: this.columnSettings.filteredColumns
	        });
	    },
	    nextPage: function nextPage() {
	        var currentPage = this.getCurrentPage();
	        if (currentPage < this.getCurrentMaxPage() - 1) {
	            this.setPage(currentPage + 1);
	        }
	    },
	    previousPage: function previousPage() {
	        var currentPage = this.getCurrentPage();
	        if (currentPage > 0) {
	            this.setPage(currentPage - 1);
	        }
	    },
	    changeSort: function changeSort(sort) {
	        if (this.props.enableSort === false) {
	            return;
	        }
	        if (this.props.useExternal) {
	            this.props.externalChangeSort(sort, this.props.externalSortColumn === sort ? !this.props.externalSortAscending : true);
	            return;
	        }

	        var that = this,
	            state = {
	            page: 0,
	            sortColumn: sort,
	            sortAscending: true
	        };

	        // If this is the same column, reverse the sort.
	        if (this.state.sortColumn == sort) {
	            state.sortAscending = !this.state.sortAscending;
	        }

	        this.setState(state);
	    },
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	        this.setMaxPage(nextProps.results);
	    },
	    getInitialState: function getInitialState() {
	        this.verifyExternal();
	        this.verifyCustom();

	        this.columnSettings = new ColumnProperties(this.props.results.length > 0 ? _.keys(this.props.results[0]) : [], this.props.columns, this.props.childrenColumnName, this.props.columnMetadata, this.props.metadataColumns);

	        this.rowSettings = new RowProperties(this.props.rowMetadata);

	        var maxPageState = this.getMaxPageState();

	        var otherState;

	        if (this.props.useCustomGridComponent === true) {
	            otherState = {
	                customComponentType: 'grid'
	            };
	        } else if (this.props.useCustomRowComponent === true) {
	            otherState = {
	                customComponentType: 'row'
	            };
	        } else {
	            otherState = {
	                filteredColumns: this.columnSettings.filteredColumns
	            };
	        }

	        var state = {
	            maxPage: 0,
	            page: 0,
	            filteredResults: null,
	            filteredColumns: [],
	            filter: '',
	            sortColumn: this.props.initialSort,
	            sortAscending: this.props.initialSortAscending,
	            showColumnChooser: false
	        };

	        return assign(state, maxPageState, otherState);
	    },
	    //todo: clean these verify methods up
	    verifyExternal: function verifyExternal() {
	        if (this.props.useExternal === true) {
	            //hooray for big ugly nested if
	            if (this.props.externalSetPage === null) {
	                console.error('useExternal is set to true but there is no externalSetPage function specified.');
	            }

	            if (this.props.externalChangeSort === null) {
	                console.error('useExternal is set to true but there is no externalChangeSort function specified.');
	            }

	            if (this.props.externalSetFilter === null) {
	                console.error('useExternal is set to true but there is no externalSetFilter function specified.');
	            }

	            if (this.props.externalSetPageSize === null) {
	                console.error('useExternal is set to true but there is no externalSetPageSize function specified.');
	            }

	            if (this.props.externalMaxPage === null) {
	                console.error('useExternal is set to true but externalMaxPage is not set.');
	            }

	            if (this.props.externalCurrentPage === null) {
	                console.error('useExternal is set to true but externalCurrentPage is not set. Griddle will not page correctly without that property when using external data.');
	            }
	        }
	    },
	    verifyCustom: function verifyCustom() {
	        if (this.props.useCustomGridComponent === true && this.props.customGridComponent === null) {
	            console.error('useCustomGridComponent is set to true but no custom component was specified.');
	        }
	        if (this.props.useCustomRowComponent === true && this.props.customRowComponent === null) {
	            console.error('useCustomRowComponent is set to true but no custom component was specified.');
	        }
	        if (this.props.useCustomGridComponent === true && this.props.useCustomRowComponent === true) {
	            console.error('Cannot currently use both customGridComponent and customRowComponent.');
	        }
	    },
	    getDataForRender: function getDataForRender(data, cols, pageList) {
	        var that = this;
	        //get the correct page size
	        if (this.state.sortColumn !== '' || this.props.initialSort !== '') {
	            var sortProperty = _.where(this.props.columnMetadata, { columnName: this.state.sortColumn });
	            sortProperty = sortProperty.length > 0 && sortProperty[0].hasOwnProperty('sortProperty') && sortProperty[0].sortProperty || null;

	            data = _.sortBy(data, function (item) {
	                return sortProperty ? item[that.state.sortColumn || that.props.initialSort][sortProperty] : item[that.state.sortColumn || that.props.initialSort];
	            });

	            if (this.state.sortAscending === false) {
	                data.reverse();
	            }
	        }

	        var currentPage = this.getCurrentPage();

	        if (!this.props.useExternal && pageList && this.props.resultsPerPage * (currentPage + 1) <= this.props.resultsPerPage * this.state.maxPage && currentPage >= 0) {
	            if (this.isInfiniteScrollEnabled()) {
	                // If we're doing infinite scroll, grab all results up to the current page.
	                data = _.first(data, (currentPage + 1) * this.props.resultsPerPage);
	            } else {
	                //the 'rest' is grabbing the whole array from index on and the 'initial' is getting the first n results
	                var rest = _.rest(data, currentPage * this.props.resultsPerPage);
	                data = _.initial(rest, rest.length - this.props.resultsPerPage);
	            }
	        }

	        var meta = this.columnSettings.getMetadataColumns;

	        var transformedData = [];

	        for (var i = 0; i < data.length; i++) {
	            var mappedData = data[i];

	            if (typeof mappedData[that.props.childrenColumnName] !== 'undefined' && mappedData[that.props.childrenColumnName].length > 0) {
	                //internally we're going to use children instead of whatever it is so we don't have to pass the custom name around
	                mappedData.children = that.getDataForRender(mappedData[that.props.childrenColumnName], cols, false);

	                if (that.props.childrenColumnName !== 'children') {
	                    delete mappedData[that.props.childrenColumnName];
	                }
	            }

	            transformedData.push(mappedData);
	        }
	        return transformedData;
	    },
	    //this is the current results
	    getCurrentResults: function getCurrentResults() {
	        return this.state && this.state.filteredResults || this.props.results;
	    },
	    getCurrentPage: function getCurrentPage() {
	        return this.props.externalCurrentPage || this.state.page;
	    },
	    getCurrentSort: function getCurrentSort() {
	        return this.props.useExternal ? this.props.externalSortColumn : this.state.sortColumn;
	    },
	    getCurrentSortAscending: function getCurrentSortAscending() {
	        return this.props.useExternal ? this.props.externalSortAscending : this.state.sortAscending;
	    },
	    getCurrentMaxPage: function getCurrentMaxPage() {
	        return this.props.useExternal ? this.props.externalMaxPage : this.state.maxPage;
	    },
	    //This takes the props relating to sort and puts them in one object
	    getSortObject: function getSortObject() {
	        return {
	            enableSort: this.props.enableSort,
	            changeSort: this.changeSort,
	            sortColumn: this.getCurrentSort(),
	            sortAscending: this.getCurrentSortAscending(),
	            sortAscendingClassName: this.props.sortAscendingClassName,
	            sortDescendingClassName: this.props.sortDescendingClassName,
	            sortAscendingComponent: this.props.sortAscendingComponent,
	            sortDescendingComponent: this.props.sortDescendingComponent
	        };
	    },
	    isInfiniteScrollEnabled: function isInfiniteScrollEnabled() {
	        // If a custom pager is included, don't allow for infinite scrolling.
	        if (this.props.useCustomPagerComponent) {
	            return false;
	        }

	        // Otherwise, send back the property.
	        return this.props.enableInfiniteScroll;
	    },
	    getClearFixStyles: function getClearFixStyles() {
	        return {
	            clear: 'both',
	            display: 'table',
	            width: '100%'
	        };
	    },
	    getSettingsStyles: function getSettingsStyles() {
	        return {
	            float: 'left',
	            width: '50%',
	            textAlign: 'right'
	        };
	    },
	    getFilterStyles: function getFilterStyles() {
	        return {
	            float: 'left',
	            width: '50%',
	            textAlign: 'left',
	            color: '#222',
	            minHeight: '1px'
	        };
	    },
	    getFilter: function getFilter() {
	        return this.props.showFilter && this.props.useCustomGridComponent === false ? React.createElement(GridFilter, { changeFilter: this.setFilter, placeholderText: this.props.filterPlaceholderText }) : '';
	    },
	    getSettings: function getSettings() {
	        return this.props.showSettings ? React.createElement(
	            'button',
	            { type: 'button', className: this.props.settingsToggleClassName, onClick: this.toggleColumnChooser,
	                style: this.props.useGriddleStyles ? { background: 'none', border: 'none', padding: 0, margin: 0, fontSize: 14 } : null },
	            this.props.settingsText,
	            this.props.settingsIconComponent
	        ) : '';
	    },
	    getTopSection: function getTopSection(filter, settings) {
	        if (this.props.showFilter === false && this.props.showSettings === false) {
	            return '';
	        }

	        var filterStyles = null,
	            settingsStyles = null,
	            topContainerStyles = null;

	        if (this.props.useGriddleStyles) {
	            filterStyles = this.getFilterStyles();
	            settingsStyles = this.getSettingsStyles();

	            topContainerStyles = this.getClearFixStyles();
	        }

	        return React.createElement(
	            'div',
	            { className: 'top-section', style: topContainerStyles },
	            React.createElement(
	                'div',
	                { className: 'griddle-filter', style: filterStyles },
	                filter
	            ),
	            React.createElement(
	                'div',
	                { className: 'griddle-settings-toggle', style: settingsStyles },
	                settings
	            )
	        );
	    },
	    getPagingSection: function getPagingSection(currentPage, maxPage) {
	        if ((this.props.showPager && !this.isInfiniteScrollEnabled() && !this.props.useCustomGridComponent) === false) {
	            return '';
	        }

	        return React.createElement(
	            'div',
	            { className: 'griddle-footer' },
	            this.props.useCustomPagerComponent ? React.createElement(CustomPaginationContainer, { next: this.nextPage, previous: this.previousPage, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText, customPagerComponent: this.props.customPagerComponent }) : React.createElement(GridPagination, { useGriddleStyles: this.props.useGriddleStyles, next: this.nextPage, previous: this.previousPage, nextClassName: this.props.nextClassName, nextIconComponent: this.props.nextIconComponent, previousClassName: this.props.previousClassName, previousIconComponent: this.props.previousIconComponent, currentPage: currentPage, maxPage: maxPage, setPage: this.setPage, nextText: this.props.nextText, previousText: this.props.previousText })
	        );
	    },
	    getColumnSelectorSection: function getColumnSelectorSection(keys, cols) {
	        return this.state.showColumnChooser ? React.createElement(GridSettings, { columns: keys, selectedColumns: cols, setColumns: this.setColumns, settingsText: this.props.settingsText,
	            settingsIconComponent: this.props.settingsIconComponent, maxRowsText: this.props.maxRowsText, setPageSize: this.setPageSize,
	            showSetPageSize: !this.props.useCustomGridComponent, resultsPerPage: this.props.resultsPerPage, enableToggleCustom: this.props.enableToggleCustom,
	            toggleCustomComponent: this.toggleCustomComponent, useCustomComponent: this.props.useCustomRowComponent || this.props.useCustomGridComponent,
	            useGriddleStyles: this.props.useGriddleStyles, enableCustomFormatText: this.props.enableCustomFormatText, columnMetadata: this.props.columnMetadata }) : '';
	    },
	    getCustomGridSection: function getCustomGridSection() {
	        return React.createElement(this.props.customGridComponent, { data: this.props.results, className: this.props.customGridComponentClassName });
	    },
	    getCustomRowSection: function getCustomRowSection(data, cols, meta, pagingContent) {
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(CustomRowComponentContainer, { data: data, columns: cols, metadataColumns: meta,
	                className: this.props.customRowComponentClassName, customComponent: this.props.customRowComponent,
	                style: this.getClearFixStyles() }),
	            this.props.showPager && pagingContent
	        );
	    },
	    getStandardGridSection: function getStandardGridSection(data, cols, meta, pagingContent, hasMorePages) {
	        var sortProperties = this.getSortObject();

	        return React.createElement(
	            'div',
	            { className: 'griddle-body' },
	            React.createElement(GridTable, { useGriddleStyles: this.props.useGriddleStyles,
	                columnSettings: this.columnSettings,
	                rowSettings: this.rowSettings,
	                sortSettings: sortProperties,
	                isSubGriddle: this.props.isSubGriddle,
	                useGriddleIcons: this.props.useGriddleIcons,
	                useFixedLayout: this.props.useFixedLayout,
	                showPager: this.props.showPager,
	                pagingContent: pagingContent,
	                data: data,
	                className: this.props.tableClassName,
	                enableInfiniteScroll: this.isInfiniteScrollEnabled(),
	                nextPage: this.nextPage,
	                showTableHeading: this.props.showTableHeading,
	                useFixedHeader: this.props.useFixedHeader,
	                parentRowCollapsedClassName: this.props.parentRowCollapsedClassName,
	                parentRowExpandedClassName: this.props.parentRowExpandedClassName,
	                parentRowCollapsedComponent: this.props.parentRowCollapsedComponent,
	                parentRowExpandedComponent: this.props.parentRowExpandedComponent,
	                bodyHeight: this.props.bodyHeight,
	                paddingHeight: this.props.paddingHeight,
	                rowHeight: this.props.rowHeight,
	                infiniteScrollLoadTreshold: this.props.infiniteScrollLoadTreshold,
	                externalLoadingComponent: this.props.externalLoadingComponent,
	                externalIsLoading: this.props.externalIsLoading,
	                hasMorePages: hasMorePages,
	                onRowClick: this.props.onRowClick })
	        );
	    },
	    getContentSection: function getContentSection(data, cols, meta, pagingContent, hasMorePages) {
	        if (this.props.useCustomGridComponent && this.props.customGridComponent !== null) {
	            return this.getCustomGridSection();
	        } else if (this.props.useCustomRowComponent) {
	            return this.getCustomRowSection(data, cols, meta, pagingContent);
	        } else {
	            return this.getStandardGridSection(data, cols, meta, pagingContent, hasMorePages);
	        }
	    },
	    getNoDataSection: function getNoDataSection(gridClassName, topSection) {
	        var myReturn = null;
	        if (this.props.customNoDataComponent != null) {
	            myReturn = React.createElement(
	                'div',
	                { className: gridClassName },
	                React.createElement(this.props.customNoDataComponent, null)
	            );

	            return myReturn;
	        }

	        myReturn = React.createElement(
	            'div',
	            { className: gridClassName },
	            topSection,
	            React.createElement(GridNoData, { noDataMessage: this.props.noDataMessage })
	        );
	        return myReturn;
	    },
	    shouldShowNoDataSection: function shouldShowNoDataSection(results) {
	        return this.props.useExternal === false && (typeof results === 'undefined' || results.length === 0) || this.props.useExternal === true && this.props.externalIsLoading === false && results.length === 0;
	    },
	    render: function render() {
	        var that = this,
	            results = this.getCurrentResults(); // Attempt to assign to the filtered results, if we have any.

	        var headerTableClassName = this.props.tableClassName + ' table-header';

	        //figure out if we want to show the filter section
	        var filter = this.getFilter();
	        var settings = this.getSettings();

	        //if we have neither filter or settings don't need to render this stuff
	        var topSection = this.getTopSection(filter, settings);

	        var keys = [];
	        var cols = this.columnSettings.getColumns();

	        //figure out which columns are displayed and show only those
	        var data = this.getDataForRender(results, cols, true);

	        var meta = this.columnSettings.getMetadataColumns();

	        // Grab the column keys from the first results
	        keys = _.keys(_.omit(results[0], meta));

	        // sort keys by order
	        keys = this.columnSettings.orderColumns(keys);

	        // Grab the current and max page values.
	        var currentPage = this.getCurrentPage();
	        var maxPage = this.getCurrentMaxPage();

	        // Determine if we need to enable infinite scrolling on the table.
	        var hasMorePages = currentPage + 1 < maxPage;

	        // Grab the paging content if it's to be displayed
	        var pagingContent = this.getPagingSection(currentPage, maxPage);

	        var resultContent = this.getContentSection(data, cols, meta, pagingContent, hasMorePages);

	        var columnSelector = this.getColumnSelectorSection(keys, cols);

	        var gridClassName = this.props.gridClassName.length > 0 ? 'griddle ' + this.props.gridClassName : 'griddle';
	        //add custom to the class name so we can style it differently
	        gridClassName += this.props.useCustomRowComponent ? ' griddle-custom' : '';

	        if (this.shouldShowNoDataSection(results)) {
	            gridClassName += this.props.noDataClassName && this.props.noDataClassName.length > 0 ? ' ' + this.props.noDataClassName : '';
	            return this.getNoDataSection(gridClassName, topSection);
	        }

	        return React.createElement(
	            'div',
	            { className: gridClassName },
	            topSection,
	            columnSelector,
	            React.createElement(
	                'div',
	                { className: 'griddle-container', style: this.props.useGriddleStyles && !this.props.isSubGriddle ? { border: '1px solid #DDD' } : null },
	                resultContent
	            )
	        );
	    }
	});

	module.exports = Griddle;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	'use strict';

	var React = __webpack_require__(2);
	var GridTitle = __webpack_require__(14);
	var GridRowContainer = __webpack_require__(15);
	var ColumnProperties = __webpack_require__(11);
	var RowProperties = __webpack_require__(12);
	var _ = __webpack_require__(3);

	var GridTable = React.createClass({
	  displayName: 'GridTable',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      data: [],
	      columnSettings: null,
	      rowSettings: null,
	      sortSettings: null,
	      className: '',
	      enableInfiniteScroll: false,
	      nextPage: null,
	      hasMorePages: false,
	      useFixedHeader: false,
	      useFixedLayout: true,
	      paddingHeight: null,
	      rowHeight: null,
	      infiniteScrollLoadTreshold: null,
	      bodyHeight: null,
	      tableHeading: '',
	      useGriddleStyles: true,
	      useGriddleIcons: true,
	      isSubGriddle: false,
	      parentRowCollapsedClassName: 'parent-row',
	      parentRowExpandedClassName: 'parent-row expanded',
	      parentRowCollapsedComponent: '▶',
	      parentRowExpandedComponent: '▼',
	      externalLoadingComponent: null,
	      externalIsLoading: false,
	      onRowClick: null
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      scrollTop: 0,
	      scrollHeight: this.props.bodyHeight,
	      clientHeight: this.props.bodyHeight
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    // After the initial render, see if we need to load additional pages.
	    this.gridScroll();
	  },
	  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	    // After the subsequent renders, see if we need to load additional pages.
	    this.gridScroll();
	  },
	  gridScroll: function gridScroll() {
	    if (this.props.enableInfiniteScroll && !this.props.externalIsLoading) {
	      // If the scroll height is greater than the current amount of rows displayed, update the page.
	      var scrollable = this.refs.scrollable.getDOMNode();
	      var scrollTop = scrollable.scrollTop;
	      var scrollHeight = scrollable.scrollHeight;
	      var clientHeight = scrollable.clientHeight;

	      // If the scroll position changed and the difference is greater than a row height
	      if (this.props.rowHeight !== null && this.state.scrollTop !== scrollTop && Math.abs(this.state.scrollTop - scrollTop) >= this.getAdjustedRowHeight()) {
	        var newState = {
	          scrollTop: scrollTop,
	          scrollHeight: scrollHeight,
	          clientHeight: clientHeight
	        };

	        // Set the state to the new state
	        this.setState(newState);
	      }

	      // Determine the diff by subtracting the amount scrolled by the total height, taking into consideratoin
	      // the spacer's height.
	      var scrollHeightDiff = scrollHeight - (scrollTop + clientHeight) - this.props.infiniteScrollLoadTreshold;

	      // Make sure that we load results a little before reaching the bottom.
	      var compareHeight = scrollHeightDiff * 0.6;

	      if (compareHeight <= this.props.infiniteScrollLoadTreshold) {
	        this.props.nextPage();
	      }
	    }
	  },
	  verifyProps: function verifyProps() {
	    if (this.props.columnSettings === null) {
	      console.error('gridTable: The columnSettings prop is null and it shouldn\'t be');
	    }
	    if (this.props.rowSettings === null) {
	      console.error('gridTable: The rowSettings prop is null and it shouldn\'t be');
	    }
	  },
	  getAdjustedRowHeight: function getAdjustedRowHeight() {
	    return this.props.rowHeight + this.props.paddingHeight * 2; // account for padding.
	  },
	  getNodeContent: function getNodeContent() {
	    this.verifyProps();
	    var that = this;

	    //figure out if we need to wrap the group in one tbody or many
	    var anyHasChildren = false;

	    // If the data is still being loaded, don't build the nodes unless this is an infinite scroll table.
	    if (!this.props.externalIsLoading || this.props.enableInfiniteScroll) {
	      var nodeData = that.props.data;
	      var aboveSpacerRow = null;
	      var belowSpacerRow = null;
	      var usingDefault = false;

	      // If we have a row height specified, only render what's going to be visible.
	      if (this.props.enableInfiniteScroll && this.props.rowHeight !== null && this.refs.scrollable !== undefined) {
	        var adjustedHeight = that.getAdjustedRowHeight();
	        var visibleRecordCount = Math.ceil(that.state.clientHeight / adjustedHeight);

	        // Inspired by : http://jsfiddle.net/vjeux/KbWJ2/9/
	        var displayStart = Math.max(0, Math.floor(that.state.scrollTop / adjustedHeight) - visibleRecordCount * 0.25);
	        var displayEnd = Math.min(displayStart + visibleRecordCount * 1.25, this.props.data.length - 1);

	        // Split the amount of nodes.
	        nodeData = nodeData.slice(displayStart, displayEnd + 1);

	        // Set the above and below nodes.
	        var aboveSpacerRowStyle = { height: displayStart * adjustedHeight + 'px' };
	        aboveSpacerRow = React.createElement('tr', { key: 'above-' + aboveSpacerRowStyle.height, style: aboveSpacerRowStyle });
	        var belowSpacerRowStyle = { height: (this.props.data.length - displayEnd) * adjustedHeight + 'px' };
	        belowSpacerRow = React.createElement('tr', { key: 'below-' + belowSpacerRowStyle.height, style: belowSpacerRowStyle });
	      }

	      var nodes = nodeData.map(function (row, index) {
	        var hasChildren = typeof row.children !== 'undefined' && row.children.length > 0;
	        var uniqueId = that.props.rowSettings.getRowKey(row);

	        //at least one item in the group has children.
	        if (hasChildren) {
	          anyHasChildren = hasChildren;
	        }

	        return React.createElement(GridRowContainer, { useGriddleStyles: that.props.useGriddleStyles, isSubGriddle: that.props.isSubGriddle,
	          parentRowExpandedClassName: that.props.parentRowExpandedClassName, parentRowCollapsedClassName: that.props.parentRowCollapsedClassName,
	          parentRowExpandedComponent: that.props.parentRowExpandedComponent, parentRowCollapsedComponent: that.props.parentRowCollapsedComponent,
	          data: row, key: uniqueId + '-container', uniqueId: uniqueId, columnSettings: that.props.columnSettings, rowSettings: that.props.rowSettings, paddingHeight: that.props.paddingHeight,
	          rowHeight: that.props.rowHeight, hasChildren: hasChildren, tableClassName: that.props.className, onRowClick: that.props.onRowClick });
	      });

	      // Add the spacer rows for nodes we're not rendering.
	      if (aboveSpacerRow) {
	        nodes.unshift(aboveSpacerRow);
	      }
	      if (belowSpacerRow) {
	        nodes.push(belowSpacerRow);
	      }

	      // Send back the nodes.
	      return {
	        nodes: nodes,
	        anyHasChildren: anyHasChildren
	      };
	    } else {
	      return null;
	    }
	  },
	  render: function render() {
	    var that = this;
	    var nodes = [];

	    // for if we need to wrap the group in one tbody or many
	    var anyHasChildren = false;

	    // Grab the nodes to render
	    var nodeContent = this.getNodeContent();
	    if (nodeContent) {
	      nodes = nodeContent.nodes;
	      anyHasChildren = nodeContent.anyHasChildren;
	    }

	    var gridStyle = null;
	    var loadingContent = null;
	    var tableStyle = {
	      width: '100%'
	    };

	    if (this.props.useFixedLayout) {
	      tableStyle.tableLayout = 'fixed';
	    }

	    if (this.props.enableInfiniteScroll) {
	      // If we're enabling infinite scrolling, we'll want to include the max height of the grid body + allow scrolling.
	      gridStyle = {
	        position: 'relative',
	        overflowY: 'scroll',
	        height: this.props.bodyHeight + 'px',
	        width: '100%'
	      };
	    }

	    // If we're currently loading, populate the loading content
	    if (this.props.externalIsLoading) {
	      var defaultLoadingStyle = null;
	      var defaultColSpan = null;

	      if (this.props.useGriddleStyles) {
	        defaultLoadingStyle = {
	          textAlign: 'center',
	          paddingBottom: '40px'
	        };

	        defaultColSpan = this.props.columnSettings.getVisibleColumnCount();
	      }

	      var loadingComponent = this.props.externalLoadingComponent ? React.createElement(this.props.externalLoadingComponent, null) : React.createElement(
	        'div',
	        null,
	        'Loading...'
	      );

	      loadingContent = React.createElement(
	        'tbody',
	        null,
	        React.createElement(
	          'tr',
	          null,
	          React.createElement(
	            'td',
	            { style: defaultLoadingStyle, colSpan: defaultColSpan },
	            loadingComponent
	          )
	        )
	      );
	    }

	    //construct the table heading component
	    var tableHeading = this.props.showTableHeading ? React.createElement(GridTitle, { useGriddleStyles: this.props.useGriddleStyles, useGriddleIcons: this.props.useGriddleIcons,
	      sortSettings: this.props.sortSettings,
	      columnSettings: this.props.columnSettings,
	      rowSettings: this.props.rowSettings }) : '';

	    //check to see if any of the rows have children... if they don't wrap everything in a tbody so the browser doesn't auto do this
	    if (!anyHasChildren) {
	      nodes = React.createElement(
	        'tbody',
	        null,
	        nodes
	      );
	    }

	    var pagingContent = '';
	    if (this.props.showPager) {
	      var pagingStyles = this.props.useGriddleStyles ? {
	        padding: '0',
	        backgroundColor: '#EDEDED',
	        border: '0',
	        color: '#222'
	      } : null;
	      pagingContent = React.createElement(
	        'tbody',
	        null,
	        React.createElement(
	          'tr',
	          null,
	          React.createElement(
	            'td',
	            { colSpan: this.props.columnSettings.getVisibleColumnCount(), style: pagingStyles, className: 'footer-container' },
	            this.props.pagingContent
	          )
	        )
	      );
	    }

	    // If we have a fixed header, split into two tables.
	    if (this.props.useFixedHeader) {
	      if (this.props.useGriddleStyles) {
	        tableStyle.tableLayout = 'fixed';
	      }

	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'table',
	          { className: this.props.className, style: this.props.useGriddleStyles && tableStyle || null },
	          tableHeading
	        ),
	        React.createElement(
	          'div',
	          { ref: 'scrollable', onScroll: this.gridScroll, style: gridStyle },
	          React.createElement(
	            'table',
	            { className: this.props.className, style: this.props.useGriddleStyles && tableStyle || null },
	            nodes,
	            loadingContent,
	            pagingContent
	          )
	        )
	      );
	    }

	    return React.createElement(
	      'div',
	      { ref: 'scrollable', onScroll: this.gridScroll, style: gridStyle },
	      React.createElement(
	        'table',
	        { className: this.props.className, style: this.props.useGriddleStyles && tableStyle || null },
	        tableHeading,
	        nodes,
	        loadingContent,
	        pagingContent
	      )
	    );
	  }
	});

	module.exports = GridTable;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	"use strict";

	var React = __webpack_require__(2);

	var GridFilter = React.createClass({
	    displayName: "GridFilter",

	    getDefaultProps: function getDefaultProps() {
	        return {
	            placeholderText: ""
	        };
	    },
	    handleChange: function handleChange(event) {
	        this.props.changeFilter(event.target.value);
	    },
	    render: function render() {
	        return React.createElement(
	            "div",
	            { className: "filter-container" },
	            React.createElement("input", { type: "text", name: "filter", placeholder: this.props.placeholderText, className: "form-control", onChange: this.handleChange })
	        );
	    }
	});

	module.exports = GridFilter;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	'use strict';

	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);

	//needs props maxPage, currentPage, nextFunction, prevFunction
	var GridPagination = React.createClass({
	    displayName: 'GridPagination',

	    getDefaultProps: function getDefaultProps() {
	        return {
	            maxPage: 0,
	            nextText: '',
	            previousText: '',
	            currentPage: 0,
	            useGriddleStyles: true,
	            nextClassName: 'griddle-next',
	            previousClassName: 'griddle-previous',
	            nextIconComponent: null,
	            previousIconComponent: null
	        };
	    },
	    pageChange: function pageChange(event) {
	        this.props.setPage(parseInt(event.target.value, 10) - 1);
	    },
	    render: function render() {
	        var previous = '';
	        var next = '';

	        if (this.props.currentPage > 0) {
	            previous = React.createElement(
	                'button',
	                { type: 'button', onClick: this.props.previous, style: this.props.useGriddleStyles ? { color: '#222', border: 'none', background: 'none', margin: '0 0 0 10px' } : null },
	                this.props.previousIconComponent,
	                this.props.previousText
	            );
	        }

	        if (this.props.currentPage !== this.props.maxPage - 1) {
	            next = React.createElement(
	                'button',
	                { type: 'button', onClick: this.props.next, style: this.props.useGriddleStyles ? { color: '#222', border: 'none', background: 'none', margin: '0 10px 0 0' } : null },
	                this.props.nextText,
	                this.props.nextIconComponent
	            );
	        }

	        var leftStyle = null;
	        var middleStyle = null;
	        var rightStyle = null;

	        if (this.props.useGriddleStyles === true) {
	            var baseStyle = {
	                float: 'left',
	                minHeight: '1px',
	                marginTop: '5px'
	            };

	            rightStyle = _.extend({ textAlign: 'right', width: '34%' }, baseStyle);
	            middleStyle = _.extend({ textAlign: 'center', width: '33%' }, baseStyle);
	            leftStyle = _.extend({ width: '33%' }, baseStyle);
	        }

	        var options = [];

	        for (var i = 1; i <= this.props.maxPage; i++) {
	            options.push(React.createElement(
	                'option',
	                { value: i, key: i },
	                i
	            ));
	        }

	        return React.createElement(
	            'div',
	            { style: this.props.useGriddleStyles ? { minHeight: '35px' } : null },
	            React.createElement(
	                'div',
	                { className: this.props.previousClassName, style: leftStyle },
	                previous
	            ),
	            React.createElement(
	                'div',
	                { className: 'griddle-page', style: middleStyle },
	                React.createElement(
	                    'select',
	                    { value: this.props.currentPage + 1, onChange: this.pageChange },
	                    options
	                ),
	                ' / ',
	                this.props.maxPage
	            ),
	            React.createElement(
	                'div',
	                { className: this.props.nextClassName, style: rightStyle },
	                next
	            )
	        );
	    }
	});

	module.exports = GridPagination;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	'use strict';

	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);

	var GridSettings = React.createClass({
	    displayName: 'GridSettings',

	    getDefaultProps: function getDefaultProps() {
	        return {
	            columns: [],
	            columnMetadata: [],
	            selectedColumns: [],
	            settingsText: '',
	            maxRowsText: '',
	            resultsPerPage: 0,
	            enableToggleCustom: false,
	            useCustomComponent: false,
	            useGriddleStyles: true,
	            toggleCustomComponent: function toggleCustomComponent() {}
	        };
	    },
	    setPageSize: function setPageSize(event) {
	        var value = parseInt(event.target.value, 10);
	        this.props.setPageSize(value);
	    },
	    handleChange: function handleChange(event) {
	        if (event.target.checked === true && _.contains(this.props.selectedColumns, event.target.dataset.name) === false) {
	            this.props.selectedColumns.push(event.target.dataset.name);
	            this.props.setColumns(this.props.selectedColumns);
	        } else {
	            /* redraw with the selected columns minus the one just unchecked */
	            this.props.setColumns(_.without(this.props.selectedColumns, event.target.dataset.name));
	        }
	    },
	    render: function render() {
	        var that = this;

	        var nodes = [];
	        //don't show column selector if we're on a custom component
	        if (that.props.useCustomComponent === false) {
	            nodes = this.props.columns.map(function (col, index) {
	                var checked = _.contains(that.props.selectedColumns, col);
	                //check column metadata -- if this one is locked make it disabled and don't put an onChange event
	                var meta = _.findWhere(that.props.columnMetadata, { columnName: col });
	                var displayName = col;

	                if (typeof meta !== 'undefined' && typeof meta.displayName !== 'undefined' && meta.displayName != null) {
	                    displayName = meta.displayName;
	                }

	                if (typeof meta !== 'undefined' && meta != null && meta.locked) {
	                    return React.createElement(
	                        'div',
	                        { className: 'column checkbox' },
	                        React.createElement(
	                            'label',
	                            null,
	                            React.createElement('input', { type: 'checkbox', disabled: true, name: 'check', checked: checked, 'data-name': col }),
	                            displayName
	                        )
	                    );
	                } else if (typeof meta !== 'undefined' && meta != null && typeof meta.visible !== 'undefined' && meta.visible === false) {
	                    return null;
	                }
	                return React.createElement(
	                    'div',
	                    { className: 'griddle-column-selection checkbox', key: col, style: that.props.useGriddleStyles ? { float: 'left', width: '20%' } : null },
	                    React.createElement(
	                        'label',
	                        null,
	                        React.createElement('input', { type: 'checkbox', name: 'check', onChange: that.handleChange, checked: checked, 'data-name': col }),
	                        displayName
	                    )
	                );
	            });
	        }

	        var toggleCustom = that.props.enableToggleCustom ? React.createElement(
	            'div',
	            { className: 'form-group' },
	            React.createElement(
	                'label',
	                { htmlFor: 'maxRows' },
	                React.createElement('input', { type: 'checkbox', checked: this.props.useCustomComponent, onChange: this.props.toggleCustomComponent }),
	                ' ',
	                this.props.enableCustomFormatText
	            )
	        ) : '';

	        var setPageSize = this.props.showSetPageSize ? React.createElement(
	            'div',
	            null,
	            React.createElement(
	                'label',
	                { htmlFor: 'maxRows' },
	                this.props.maxRowsText,
	                ':',
	                React.createElement(
	                    'select',
	                    { onChange: this.setPageSize, value: this.props.resultsPerPage },
	                    React.createElement(
	                        'option',
	                        { value: '5' },
	                        '5'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '10' },
	                        '10'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '25' },
	                        '25'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '50' },
	                        '50'
	                    ),
	                    React.createElement(
	                        'option',
	                        { value: '100' },
	                        '100'
	                    )
	                )
	            )
	        ) : '';

	        return React.createElement(
	            'div',
	            { className: 'griddle-settings', style: this.props.useGriddleStyles ? { backgroundColor: '#FFF', border: '1px solid #DDD', color: '#222', padding: '10px', marginBottom: '10px' } : null },
	            React.createElement(
	                'h6',
	                null,
	                this.props.settingsText
	            ),
	            React.createElement(
	                'div',
	                { className: 'griddle-columns', style: this.props.useGriddleStyles ? { clear: 'both', display: 'table', width: '100%', borderBottom: '1px solid #EDEDED', marginBottom: '10px' } : null },
	                nodes
	            ),
	            setPageSize,
	            toggleCustom
	        );
	    }
	});

	module.exports = GridSettings;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	"use strict";

	var React = __webpack_require__(2);

	var GridNoData = React.createClass({
	    displayName: "GridNoData",

	    getDefaultProps: function getDefaultProps() {
	        return {
	            noDataMessage: "No Data"
	        };
	    },
	    render: function render() {
	        var that = this;

	        return React.createElement(
	            "div",
	            null,
	            this.props.noDataMessage
	        );
	    }
	});

	module.exports = GridNoData;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	"use strict";

	var React = __webpack_require__(2);

	var CustomRowComponentContainer = React.createClass({
	  displayName: "CustomRowComponentContainer",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      data: [],
	      metadataColumns: [],
	      className: "",
	      customComponent: {}
	    };
	  },
	  render: function render() {
	    var that = this;

	    if (typeof that.props.customComponent !== "function") {
	      console.log("Couldn't find valid template.");
	      return React.createElement("div", { className: this.props.className });
	    }

	    var nodes = this.props.data.map(function (row, index) {
	      return React.createElement(that.props.customComponent, { data: row, metadataColumns: that.props.metadataColumns, key: index });
	    });

	    var footer = this.props.showPager && this.props.pagingContent;
	    return React.createElement(
	      "div",
	      { className: this.props.className, style: this.props.style },
	      nodes
	    );
	  }
	});

	module.exports = CustomRowComponentContainer;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   Griddle - Simple Grid Component for React
	   https://github.com/DynamicTyped/Griddle
	   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	"use strict";

	var React = __webpack_require__(2);

	var CustomPaginationContainer = React.createClass({
	  displayName: "CustomPaginationContainer",

	  getDefaultProps: function getDefaultProps() {
	    return {
	      maxPage: 0,
	      nextText: "",
	      previousText: "",
	      currentPage: 0,
	      customPagerComponent: {}
	    };
	  },
	  render: function render() {
	    var that = this;

	    if (typeof that.props.customPagerComponent !== "function") {
	      console.log("Couldn't find valid template.");
	      return React.createElement("div", null);
	    }

	    return React.createElement(that.props.customPagerComponent, { maxPage: this.props.maxPage, nextText: this.props.nextText, previousText: this.props.previousText, currentPage: this.props.currentPage, setPage: this.props.setPage, previous: this.props.previous, next: this.props.next });
	  }
	});

	module.exports = CustomPaginationContainer;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _ = __webpack_require__(3);

	var ColumnProperties = (function () {
	  function ColumnProperties() {
	    var allColumns = arguments[0] === undefined ? [] : arguments[0];
	    var filteredColumns = arguments[1] === undefined ? [] : arguments[1];
	    var childrenColumnName = arguments[2] === undefined ? "children" : arguments[2];
	    var columnMetadata = arguments[3] === undefined ? [] : arguments[3];
	    var metadataColumns = arguments[4] === undefined ? [] : arguments[4];

	    _classCallCheck(this, ColumnProperties);

	    this.allColumns = allColumns;
	    this.filteredColumns = filteredColumns;
	    this.childrenColumnName = childrenColumnName;
	    this.columnMetadata = columnMetadata;
	    this.metadataColumns = metadataColumns;
	  }

	  _createClass(ColumnProperties, [{
	    key: "getMetadataColumns",
	    value: function getMetadataColumns() {
	      var meta = _.map(_.where(this.columnMetadata, { visible: false }), function (item) {
	        return item.columnName;
	      });
	      if (meta.indexOf(this.childrenColumnName) < 0) {
	        meta.push(this.childrenColumnName);
	      }
	      return meta.concat(this.metadataColumns);
	    }
	  }, {
	    key: "getVisibleColumnCount",
	    value: function getVisibleColumnCount() {
	      return this.getColumns().length;
	    }
	  }, {
	    key: "getColumnMetadataByName",
	    value: function getColumnMetadataByName(name) {
	      return _.findWhere(this.columnMetadata, { columnName: name });
	    }
	  }, {
	    key: "hasColumnMetadata",
	    value: function hasColumnMetadata() {
	      return this.columnMetadata !== null && this.columnMetadata.length > 0;
	    }
	  }, {
	    key: "getMetadataColumnProperty",
	    value: function getMetadataColumnProperty(columnName, propertyName, defaultValue) {
	      var meta = this.getColumnMetadataByName(columnName);

	      //send back the default value if meta isn't there
	      if (typeof meta === "undefined" || meta === null) {
	        return defaultValue;
	      }return meta.hasOwnProperty(propertyName) ? meta[propertyName] : defaultValue;
	    }
	  }, {
	    key: "orderColumns",
	    value: function orderColumns(cols) {
	      var _this = this;

	      var ORDER_MAX = 100;

	      var orderedColumns = _.sortBy(cols, function (item) {
	        var metaItem = _.findWhere(_this.columnMetadata, { columnName: item });

	        if (typeof metaItem === "undefined" || metaItem === null || isNaN(metaItem.order)) {
	          return ORDER_MAX;
	        }

	        return metaItem.order;
	      });

	      return orderedColumns;
	    }
	  }, {
	    key: "getColumns",
	    value: function getColumns() {
	      //if we didn't set default or filter
	      var filteredColumns = this.filteredColumns.length === 0 ? this.allColumns : this.filteredColumns;

	      filteredColumns = _.difference(filteredColumns, this.metadataColumns);

	      filteredColumns = this.orderColumns(filteredColumns);

	      return filteredColumns;
	    }
	  }]);

	  return ColumnProperties;
	})();

	module.exports = ColumnProperties;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _ = __webpack_require__(3);

	var RowProperties = (function () {
	  function RowProperties() {
	    var rowMetadata = arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, RowProperties);

	    this.rowMetadata = rowMetadata;
	  }

	  _createClass(RowProperties, [{
	    key: 'getRowKey',
	    value: function getRowKey(row) {
	      var uniqueId;

	      if (this.hasRowMetadataKey()) {
	        uniqueId = row[this.rowMetadata.key];
	      } else {
	        uniqueId = _.uniqueId('grid_row');
	      }

	      //todo: add error handling

	      return uniqueId;
	    }
	  }, {
	    key: 'hasRowMetadataKey',
	    value: function hasRowMetadataKey() {
	      return this.hasRowMetadata() && this.rowMetadata.key !== null && this.rowMetadata.key !== undefined;
	    }
	  }, {
	    key: 'getBodyRowMetadataClass',
	    value: function getBodyRowMetadataClass(rowData) {
	      if (this.hasRowMetadata() && this.rowMetadata.bodyCssClassName !== null && this.rowMetadata.bodyCssClassName !== undefined) {
	        if (typeof this.rowMetadata.bodyCssClassName === 'function') {
	          return this.rowMetadata.bodyCssClassName(rowData);
	        } else {
	          return this.rowMetadata.bodyCssClassName;
	        }
	      }
	      return null;
	    }
	  }, {
	    key: 'getHeaderRowMetadataClass',
	    value: function getHeaderRowMetadataClass() {
	      return this.hasRowMetadata() && this.rowMetadata.headerCssClassName !== null && this.rowMetadata.headerCssClassName !== undefined ? this.rowMetadata.headerCssClassName : null;
	    }
	  }, {
	    key: 'hasRowMetadata',
	    value: function hasRowMetadata() {
	      return this.rowMetadata !== null;
	    }
	  }]);

	  return RowProperties;
	})();

	module.exports = RowProperties;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	'use strict';

	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var ColumnProperties = __webpack_require__(11);

	var GridTitle = React.createClass({
	    displayName: 'GridTitle',

	    getDefaultProps: function getDefaultProps() {
	        return {
	            columnSettings: null,
	            rowSettings: null,
	            sortSettings: null,
	            headerStyle: null,
	            useGriddleStyles: true,
	            useGriddleIcons: true,
	            headerStyles: {} };
	    },
	    componentWillMount: function componentWillMount() {
	        this.verifyProps();
	    },
	    sort: function sort(event) {
	        this.props.sortSettings.changeSort(event.target.dataset.title || event.target.parentElement.dataset.title);
	    },
	    verifyProps: function verifyProps() {
	        if (this.props.columnSettings === null) {
	            console.error('gridTitle: The columnSettings prop is null and it shouldn\'t be');
	        }

	        if (this.props.sortSettings === null) {
	            console.error('gridTitle: The sortSettings prop is null and it shouldn\'t be');
	        }
	    },
	    render: function render() {
	        this.verifyProps();
	        var that = this;

	        var nodes = this.props.columnSettings.getColumns().map(function (col, index) {
	            var columnSort = '';
	            var sortComponent = null;
	            var titleStyles = null;

	            if (that.props.sortSettings.sortColumn == col && that.props.sortSettings.sortAscending) {
	                columnSort = that.props.sortSettings.sortAscendingClassName;
	                sortComponent = that.props.useGriddleIcons && that.props.sortSettings.sortAscendingComponent;
	            } else if (that.props.sortSettings.sortColumn == col && that.props.sortSettings.sortAscending === false) {
	                columnSort += that.props.sortSettings.sortDescendingClassName;
	                sortComponent = that.props.useGriddleIcons && that.props.sortSettings.sortDescendingComponent;
	            }

	            var meta = that.props.columnSettings.getColumnMetadataByName(col);
	            var columnIsSortable = that.props.columnSettings.getMetadataColumnProperty(col, 'sortable', true);
	            var displayName = that.props.columnSettings.getMetadataColumnProperty(col, 'displayName', col);

	            columnSort = meta == null ? columnSort : (columnSort && columnSort + ' ' || columnSort) + that.props.columnSettings.getMetadataColumnProperty(col, 'cssClassName', '');

	            if (that.props.useGriddleStyles) {
	                titleStyles = {
	                    backgroundColor: '#EDEDEF',
	                    border: '0',
	                    borderBottom: '1px solid #DDD',
	                    color: '#222',
	                    padding: '5px',
	                    cursor: columnIsSortable ? 'pointer' : 'default'
	                };
	            }

	            return React.createElement(
	                'th',
	                { onClick: columnIsSortable ? that.sort : null, 'data-title': col, className: columnSort, key: displayName, style: titleStyles },
	                displayName,
	                sortComponent
	            );
	        });

	        //Get the row from the row settings.
	        var className = that.props.rowSettings && that.props.rowSettings.getHeaderRowMetadataClass() || null;

	        return React.createElement(
	            'thead',
	            null,
	            React.createElement(
	                'tr',
	                {
	                    className: className,
	                    style: this.props.headerStyles },
	                nodes
	            )
	        );
	    }
	});

	module.exports = GridTitle;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	'use strict';

	var React = __webpack_require__(2);
	var GridRow = __webpack_require__(16);
	var ColumnProperties = __webpack_require__(11);
	var _ = __webpack_require__(3);
	var assign = __webpack_require__(13);

	function traverseChildren(root) {
	  var rootId = arguments[1] === undefined ? 0 : arguments[1];
	  var level = arguments[2] === undefined ? 0 : arguments[2];

	  var result = [];

	  root = assign({ $$id: rootId + 1, $$parentId: rootId === 0 ? void 0 : rootId, $$level: level }, root);
	  result.push(root);

	  if (Array.isArray(root.children) && root.children.length > 0) {
	    result = root.children.reduce(function (acc, child) {
	      return acc.concat(traverseChildren(child, root.$$id, level + 1));
	    }, result);
	  }

	  return result;
	}

	var GridRowContainer = React.createClass({
	  displayName: 'GridRowContainer',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      useGriddleStyles: true,
	      useGriddleIcons: true,
	      isSubGriddle: false,
	      columnSettings: null,
	      rowSettings: null,
	      paddingHeight: null,
	      rowHeight: null,
	      parentRowCollapsedClassName: 'parent-row',
	      parentRowExpandedClassName: 'parent-row expanded',
	      parentRowCollapsedComponent: '▶',
	      parentRowExpandedComponent: '▼',
	      onRowClick: null
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      data: {},
	      showChildren: []
	    };
	  },
	  componentWillReceiveProps: function componentWillReceiveProps() {
	    this.setShowChildren([]);
	  },
	  toggleChildren: function toggleChildren(parentId) {
	    console.log('TOGGLING', parentId);
	    var showChildren = this.state.showChildren;

	    if (showChildren.indexOf(parentId) >= 0) {
	      this.setShowChildren(_.without(showChildren, parentId));
	    } else {
	      this.setShowChildren(showChildren.concat([parentId]));
	    }
	  },
	  setShowChildren: function setShowChildren(visible) {
	    this.setState({
	      showChildren: visible
	    });
	  },
	  verifyProps: function verifyProps() {
	    if (this.props.columnSettings === null) {
	      console.error('gridRowContainer: The columnSettings prop is null and it shouldn\'t be');
	    }
	  },
	  rowHasChildren: function rowHasChildren(row) {
	    return row.children && row.children.length > 0;
	  },
	  rowHasShownChildren: function rowHasShownChildren(row) {
	    return this.state.showChildren.indexOf(row.$$id) >= 0;
	  },
	  render: function render() {
	    var _this = this;

	    this.verifyProps();

	    if (typeof this.props.data === 'undefined') {
	      return React.createElement('tbody', null);
	    }
	    var arr = traverseChildren(this.props.data).filter(function (row) {
	      return typeof row.$$parentId === 'undefined' || _this.state.showChildren.indexOf(row.$$parentId) >= 0;
	    }).map(function (row) {
	      console.log(row, _this.rowHasChildren(row));
	      return React.createElement(GridRow, { useGriddleStyles: _this.props.useGriddleStyles, data: row, columnSettings: _this.props.columnSettings,
	        rowSettings: _this.props.rowSettings, hasChildren: _this.rowHasChildren(row), toggleChildren: _this.toggleChildren.bind(_this, row.$$id),
	        isChildRow: !!row.$$parentId, showChildren: _this.rowHasShownChildren(row), useGriddleIcons: _this.props.useGriddleIcons,
	        parentRowExpandedClassName: _this.props.parentRowExpandedClassName, parentRowCollapsedClassName: _this.props.parentRowCollapsedClassName,
	        parentRowExpandedComponent: _this.props.parentRowExpandedComponent, parentRowCollapsedComponent: _this.props.parentRowCollapsedComponent,
	        paddingHeight: _this.props.paddingHeight, rowHeight: _this.props.rowHeight, onRowClick: _this.props.onRowClick });
	    });

	    return React.createElement(
	      'tbody',
	      null,
	      arr
	    );
	  }
	});

	module.exports = GridRowContainer;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*
	   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
	*/
	'use strict';

	var React = __webpack_require__(2);
	var _ = __webpack_require__(3);
	var ColumnProperties = __webpack_require__(11);
	var assign = __webpack_require__(13);

	var GridRow = React.createClass({
	  displayName: 'GridRow',

	  getDefaultProps: function getDefaultProps() {
	    return {
	      isChildRow: false,
	      showChildren: false,
	      data: {},
	      columnSettings: null,
	      rowSettings: null,
	      hasChildren: false,
	      useGriddleStyles: true,
	      useGriddleIcons: true,
	      isSubGriddle: false,
	      paddingHeight: null,
	      rowHeight: null,
	      parentRowCollapsedClassName: 'parent-row',
	      parentRowExpandedClassName: 'parent-row expanded',
	      parentRowCollapsedComponent: '▶',
	      parentRowExpandedComponent: '▼',
	      onRowClick: null
	    };
	  },
	  handleClick: function handleClick(e) {
	    if (this.props.onRowClick !== null && _.isFunction(this.props.onRowClick)) {
	      this.props.onRowClick(this, e);
	    }
	  },
	  handleRowExpandToggle: function handleRowExpandToggle() {
	    if (this.props.hasChildren) {
	      this.props.toggleChildren();
	    }
	  },
	  verifyProps: function verifyProps() {
	    if (this.props.columnSettings === null) {
	      console.error('gridRow: The columnSettings prop is null and it shouldn\'t be');
	    }
	  },
	  render: function render() {
	    var _this = this;

	    this.verifyProps();
	    var that = this;
	    var initialColumnStyle = null;

	    if (this.props.useGriddleStyles) {
	      initialColumnStyle = {
	        margin: '0',
	        padding: that.props.paddingHeight + 'px 5px ' + that.props.paddingHeight + 'px 5px',
	        height: that.props.rowHeight ? this.props.rowHeight - that.props.paddingHeight * 2 + 'px' : null,
	        backgroundColor: '#FFF',
	        borderTopColor: '#DDD',
	        color: '#222'
	      };
	    }

	    var columns = this.props.columnSettings.getColumns();

	    // make sure that all the columns we need have default empty values
	    // otherwise they will get clipped
	    var defaults = _.object(columns, []);

	    // creates a 'view' on top the data so we will not alter the original data but will allow us to add default values to missing columns
	    var dataView = Object.create(this.props.data);

	    _.defaults(dataView, defaults);

	    var data = _.pairs(_.pick(dataView, columns));

	    var nodes = data.map(function (col, index) {
	      var returnValue = null;
	      var meta = _this.props.columnSettings.getColumnMetadataByName(col[0]);
	      var columnStyle = assign({}, initialColumnStyle);

	      var firstColAppend;

	      if (index === 0 && _this.props.hasChildren && _this.props.showChildren === false && _this.props.useGriddleIcons) {
	        firstColAppend = React.createElement(
	          'span',
	          { style: _this.props.useGriddleStyles ? { fontSize: '10px', marginRight: '5px' } : null, onClick: _this.handleRowExpandToggle },
	          _this.props.parentRowCollapsedComponent
	        );
	      } else if (index === 0 && _this.props.hasChildren && _this.props.showChildren && _this.props.useGriddleIcons) {
	        firstColAppend = React.createElement(
	          'span',
	          { style: _this.props.useGriddleStyles ? { fontSize: '10px' } : null, onClick: _this.handleRowExpandToggle },
	          _this.props.parentRowExpandedComponent
	        );
	      }

	      if (index === 0 && _this.props.isChildRow) {
	        assign(columnStyle, { paddingLeft: 15 * dataView.$$level });
	      }

	      if (_this.props.columnSettings.hasColumnMetadata() && typeof meta !== 'undefined') {
	        var colData = typeof meta.customComponent === 'undefined' || meta.customComponent === null ? col[1] : React.createElement(meta.customComponent, { data: col[1], rowData: dataView, metadata: meta });
	        returnValue = meta == null ? returnValue : React.createElement(
	          'td',
	          { onClick: _this.props.hasChildren && _this.handleClick, className: meta.cssClassName, key: index, style: columnStyle },
	          firstColAppend,
	          colData
	        );
	      }

	      return returnValue || React.createElement(
	        'td',
	        { onClick: _this.handleClick, key: index, style: columnStyle },
	        firstColAppend,
	        col[1]
	      );
	    });

	    //Get the row from the row settings.
	    var className = that.props.rowSettings && that.props.rowSettings.getBodyRowMetadataClass(that.props.data) || 'standard-row';

	    if (that.props.isChildRow) {
	      className = 'child-row';
	    } else if (that.props.hasChildren) {
	      className = that.props.showChildren ? this.props.parentRowExpandedClassName : this.props.parentRowCollapsedClassName;
	    }
	    return React.createElement(
	      'tr',
	      { className: className },
	      nodes
	    );
	  }
	});

	module.exports = GridRow;

/***/ }
/******/ ])
});
;