/*
   Griddle - Simple Grid Component for React
   https://github.com/DynamicTyped/Griddle
   Copyright (c) 2014 Ryan Lanciaux | DynamicTyped

   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
'use strict';

var React = require('react');
var _ = require('underscore');
var assign = require('object-assign');

var GridTable = require('./gridTable');
var GridFilter = require('./gridFilter');
var GridPagination = require('./gridPagination');
var GridSettings = require('./gridSettings');
var GridNoData = require('./gridNoData');
var CustomRowComponentContainer = require('./customRowComponentContainer');
var CustomPaginationContainer = require('./customPaginationContainer');
var ColumnProperties = require('./columnProperties');
var RowProperties = require('./rowProperties');

var Griddle = React.createClass({
    displayName: 'Griddle',

    columnSettings: null,
    rowSettings: null,
    getDefaultProps: function getDefaultProps() {
        return {
            "columns": [],
            "columnMetadata": [],
            "rowMetadata": null,
            "resultsPerPage": 5,
            "results": [], // Used if all results are already loaded.
            "initialSort": "",
            "initialSortAscending": true,
            "gridClassName": "",
            "tableClassName": "",
            "customRowComponentClassName": "",
            "settingsText": "Settings",
            "filterPlaceholderText": "Filter Results",
            "nextText": "Next",
            "previousText": "Previous",
            "maxRowsText": "Rows per page",
            "enableCustomFormatText": "Enable Custom Formatting",
            //this column will determine which column holds subgrid data
            //it will be passed through with the data object but will not be rendered
            "childrenColumnName": "children",
            //Any column in this list will be treated as metadata and will be passed through with the data but won't be rendered
            "metadataColumns": [],
            "showFilter": false,
            "showSettings": false,
            "useCustomRowComponent": false,
            "useCustomGridComponent": false,
            "useCustomPagerComponent": false,
            "useGriddleStyles": true,
            "useGriddleIcons": true,
            "customRowComponent": null,
            "customGridComponent": null,
            "customPagerComponent": {},
            "enableToggleCustom": false,
            "noDataMessage": "There is no data to display.",
            "noDataClassName": "griddle-nodata",
            "customNoDataComponent": null,
            "showTableHeading": true,
            "showPager": true,
            "useFixedHeader": false,
            "useExternal": false,
            "externalSetPage": null,
            "externalChangeSort": null,
            "externalSetFilter": null,
            "externalSetPageSize": null,
            "externalMaxPage": null,
            "externalCurrentPage": null,
            "externalSortColumn": null,
            "externalSortAscending": true,
            "externalLoadingComponent": null,
            "externalIsLoading": false,
            "enableInfiniteScroll": false,
            "bodyHeight": null,
            "paddingHeight": 5,
            "rowHeight": 25,
            "infiniteScrollLoadTreshold": 50,
            "useFixedLayout": true,
            "isSubGriddle": false,
            "enableSort": true,
            "onRowClick": null,
            /* css class names */
            "sortAscendingClassName": "sort-ascending",
            "sortDescendingClassName": "sort-descending",
            "parentRowCollapsedClassName": "parent-row",
            "parentRowExpandedClassName": "parent-row expanded",
            "settingsToggleClassName": "settings",
            "nextClassName": "griddle-next",
            "previousClassName": "griddle-previous",
            "headerStyles": {},
            /* icon components */
            "sortAscendingComponent": " ▲",
            "sortDescendingComponent": " ▼",
            "parentRowCollapsedComponent": "▶",
            "parentRowExpandedComponent": "▼",
            "simpleRowComponent": " ",
            "settingsIconComponent": "",
            "nextIconComponent": "",
            "previousIconComponent": ""
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
                if ((arr[i] || "").toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
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
        if (this.state.customComponentType === "grid") {
            this.setProps({
                useCustomGridComponent: !this.props.useCustomGridComponent
            });
        } else if (this.state.customComponentType === "row") {
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
        var maxPageState = this.getMaxPageState(results);
        if (maxPageState) {
            this.setState(maxPageState);
        }
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
        // if(this.props.useExternal) {
        //     this.props.externalChangeSort(sort, this.props.externalSortColumn === sort ? !this.props.externalSortAscending : true);
        //     return;
        // }

        //externalChangeSort now just returns current sort state
        if (this.props.onSortChange) {
            this.props.onSortChange(sort, this.props.externalSortColumn === sort ? !this.props.externalSortAscending : true);
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
    getInitialState: function getInitialState() {
        this.verifyExternal();
        this.verifyCustom();

        this.columnSettings = new ColumnProperties(this.props.results.length > 0 ? _.keys(this.props.results[0]) : [], this.props.columns, this.props.childrenColumnName, this.props.columnMetadata, this.props.metadataColumns);

        this.rowSettings = new RowProperties(this.props.rowMetadata);

        var maxPageState = this.getMaxPageState();

        var otherState;

        if (this.props.useCustomGridComponent === true) {
            otherState = {
                customComponentType: "grid"
            };
        } else if (this.props.useCustomRowComponent === true) {
            otherState = {
                customComponentType: "row"
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
            filter: "",
            sortColumn: this.props.initialSort,
            sortAscending: this.props.initialSortAscending,
            showColumnChooser: false
        };

        return assign(state, maxPageState, otherState);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.columnSettings = new ColumnProperties(nextProps.results.length > 0 ? _.keys(nextProps.results[0]) : [], nextProps.columns, nextProps.childrenColumnName, nextProps.columnMetadata, nextProps.metadataColumns);

        this.rowSettings = new RowProperties(nextProps.rowMetadata);

        this.setMaxPage(nextProps.results);
    },
    //todo: clean these verify methods up
    verifyExternal: function verifyExternal() {
        if (this.props.useExternal === true) {
            //hooray for big ugly nested if
            if (this.props.externalSetPage === null) {
                console.error("useExternal is set to true but there is no externalSetPage function specified.");
            }

            if (this.props.externalChangeSort === null) {
                console.error("useExternal is set to true but there is no externalChangeSort function specified.");
            }

            if (this.props.externalSetFilter === null) {
                console.error("useExternal is set to true but there is no externalSetFilter function specified.");
            }

            if (this.props.externalSetPageSize === null) {
                console.error("useExternal is set to true but there is no externalSetPageSize function specified.");
            }

            if (this.props.externalMaxPage === null) {
                console.error("useExternal is set to true but externalMaxPage is not set.");
            }

            if (this.props.externalCurrentPage === null) {
                console.error("useExternal is set to true but externalCurrentPage is not set. Griddle will not page correctly without that property when using external data.");
            }
        }
    },
    verifyCustom: function verifyCustom() {
        if (this.props.useCustomGridComponent === true && this.props.customGridComponent === null) {
            console.error("useCustomGridComponent is set to true but no custom component was specified.");
        }
        if (this.props.useCustomRowComponent === true && this.props.customRowComponent === null) {
            console.error("useCustomRowComponent is set to true but no custom component was specified.");
        }
        if (this.props.useCustomGridComponent === true && this.props.useCustomRowComponent === true) {
            console.error("Cannot currently use both customGridComponent and customRowComponent.");
        }
    },
    getDataForRender: function getDataForRender(data, cols, pageList) {
        var that = this;
        //get the correct page size
        if (this.state.sortColumn !== "" || this.props.initialSort !== "") {
            var sortProperty = _.where(this.props.columnMetadata, { columnName: this.state.sortColumn });
            sortProperty = sortProperty.length > 0 && sortProperty[0].hasOwnProperty("sortProperty") && sortProperty[0]["sortProperty"] || null;

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

            if (typeof mappedData[that.props.childrenColumnName] !== "undefined" && mappedData[that.props.childrenColumnName].length > 0) {
                //internally we're going to use children instead of whatever it is so we don't have to pass the custom name around
                mappedData["children"] = that.getDataForRender(mappedData[that.props.childrenColumnName], cols, false);

                if (that.props.childrenColumnName !== "children") {
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
        return this.props.externalSortColumn ? this.props.externalSortColumn : this.state.sortColumn;
    },
    getCurrentSortAscending: function getCurrentSortAscending() {
        return typeof this.props.externalSortAscending !== 'undefined' ? this.props.externalSortAscending : this.state.sortAscending;
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
            clear: "both",
            display: "table",
            width: "100%"
        };
    },
    getSettingsStyles: function getSettingsStyles() {
        return {
            "float": "left",
            width: "50%",
            textAlign: "right"
        };
    },
    getFilterStyles: function getFilterStyles() {
        return {
            "float": "left",
            width: "50%",
            textAlign: "left",
            color: "#222",
            minHeight: "1px"
        };
    },
    getFilter: function getFilter() {
        return this.props.showFilter && this.props.useCustomGridComponent === false ? React.createElement(GridFilter, { changeFilter: this.setFilter, placeholderText: this.props.filterPlaceholderText }) : "";
    },
    getSettings: function getSettings() {
        return this.props.showSettings ? React.createElement(
            'button',
            { type: 'button', className: this.props.settingsToggleClassName, onClick: this.toggleColumnChooser,
                style: this.props.useGriddleStyles ? { background: "none", border: "none", padding: 0, margin: 0, fontSize: 14 } : null },
            this.props.settingsText,
            this.props.settingsIconComponent
        ) : "";
    },
    getTopSection: function getTopSection(filter, settings) {
        if (this.props.showFilter === false && this.props.showSettings === false) {
            return "";
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
            return "";
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
            useGriddleStyles: this.props.useGriddleStyles, enableCustomFormatText: this.props.enableCustomFormatText, columnMetadata: this.props.columnMetadata }) : "";
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
            React.createElement(GridTable, {
                useGriddleStyles: this.props.useGriddleStyles,
                customHeaderComponent: this.props.useCustomHeaderComponent ? this.props.customHeaderComponent : null,
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
                simpleRowComponent: this.props.simpleRowComponent,
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

        var headerTableClassName = this.props.tableClassName + " table-header";

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

        var gridClassName = this.props.gridClassName.length > 0 ? "griddle " + this.props.gridClassName : "griddle";
        //add custom to the class name so we can style it differently
        gridClassName += this.props.useCustomRowComponent ? " griddle-custom" : "";

        if (this.shouldShowNoDataSection(results)) {
            gridClassName += this.props.noDataClassName && this.props.noDataClassName.length > 0 ? " " + this.props.noDataClassName : "";
            return this.getNoDataSection(gridClassName, topSection);
        }

        return React.createElement(
            'div',
            { className: gridClassName },
            topSection,
            columnSelector,
            React.createElement(
                'div',
                { className: 'griddle-container', style: this.props.useGriddleStyles && !this.props.isSubGriddle ? { border: "1px solid #DDD" } : null },
                resultContent
            )
        );
    }
});

module.exports = Griddle;