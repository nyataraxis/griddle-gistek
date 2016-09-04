/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
'use strict';

var React = require('react');
var GridRow = require('./gridRow');
var ColumnProperties = require('./columnProperties');
var _ = require('underscore');
var assign = require('object-assign');

function traverseChildren(parent) {
  var parentId = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var level = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var childIndex = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

  var result = [];

  parent = assign({ $$id: parentId + '.' + childIndex, $$parentId: parentId === 0 ? void 0 : parentId, $$level: level }, parent);
  result.push(parent);

  if (Array.isArray(parent.children) && parent.children.length > 0) {
    result = parent.children.reduce(function (acc, child, childIndex) {
      return acc.concat(traverseChildren(child, parent.$$id, level + 1, childIndex));
    }, result);
  }

  return result;
}

var GridRowContainer = React.createClass({
  displayName: 'GridRowContainer',

  getDefaultProps: function getDefaultProps() {
    return {
      "useGriddleStyles": true,
      "useGriddleIcons": true,
      "isSubGriddle": false,
      "columnSettings": null,
      "rowSettings": null,
      "paddingHeight": null,
      "rowHeight": null,
      "parentRowCollapsedClassName": "parent-row",
      "parentRowExpandedClassName": "parent-row expanded",
      "parentRowCollapsedComponent": "▶",
      "parentRowExpandedComponent": "▼",
      "simpleRowComponent": " ",
      "onRowClick": null
    };
  },
  getInitialState: function getInitialState() {
    return {
      data: {},
      showChildren: []
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(props) {
    this.setState({
      showChildren: []
    });
  },
  toggleChildren: function toggleChildren(parentId) {
    var _state = this.state;
    var showChildren = _state.showChildren;
    var traversedData = _state.traversedData;

    if (showChildren.indexOf(parentId) >= 0) {
      var idFromShouldBeDeleted = new RegExp('^' + parentId + '.*');
      this.setShowChildren(showChildren.map(function (el) {
        el = el.replace(idFromShouldBeDeleted, '');
        return el;
      }).filter(function (el) {
        return el && el.length > 0;
      }));
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
      console.error("gridRowContainer: The columnSettings prop is null and it shouldn't be");
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

    if (typeof this.props.data === "undefined") {
      return React.createElement('tbody', null);
    }
    var arr = traverseChildren(this.props.data).filter(function (row) {
      return typeof row.$$parentId === 'undefined' || _this.state.showChildren.indexOf(row.$$parentId) >= 0;
    }).map(function (row, index) {
      return React.createElement(GridRow, { key: index, useGriddleStyles: _this.props.useGriddleStyles, data: row, columnSettings: _this.props.columnSettings,
        rowSettings: _this.props.rowSettings, hasChildren: _this.rowHasChildren(row), toggleChildren: _this.toggleChildren.bind(_this, row.$$id),
        isChildRow: !!row.$$parentId, showChildren: _this.rowHasShownChildren(row), useGriddleIcons: _this.props.useGriddleIcons,
        parentRowExpandedClassName: _this.props.parentRowExpandedClassName, parentRowCollapsedClassName: _this.props.parentRowCollapsedClassName,
        parentRowExpandedComponent: _this.props.parentRowExpandedComponent, parentRowCollapsedComponent: _this.props.parentRowCollapsedComponent,
        simpleRowComponent: _this.props.simpleRowComponent,
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