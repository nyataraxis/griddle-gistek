/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
'use strict';

var React = require('react');
var _ = require('underscore');
var ColumnProperties = require('./columnProperties');
var assign = require('object-assign');

var GridRow = React.createClass({
  displayName: 'GridRow',

  getDefaultProps: function getDefaultProps() {
    return {
      "isChildRow": false,
      "showChildren": false,
      "data": {},
      "columnSettings": null,
      "rowSettings": null,
      "hasChildren": false,
      "useGriddleStyles": true,
      "useGriddleIcons": true,
      "isSubGriddle": false,
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
      console.error("gridRow: The columnSettings prop is null and it shouldn't be");
    }
  },
  render: function render() {
    var _this = this;

    this.verifyProps();
    var that = this;
    var initialColumnStyle = null;

    if (this.props.useGriddleStyles) {
      initialColumnStyle = {
        margin: "0",
        padding: that.props.paddingHeight + "px 5px " + that.props.paddingHeight + "px 5px",
        height: that.props.rowHeight ? this.props.rowHeight - that.props.paddingHeight * 2 + "px" : null,
        backgroundColor: "#FFF",
        borderTopColor: "#DDD",
        color: "#222"
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
      var paddingNodes = [];

      if (index === 0 && _this.props.isChildRow) {
        for (var i = 0; i < dataView.$$level; i++) {
          //paddingNodes.push(this.props.simpleRowComponent);
          paddingNodes.push(React.createElement('div', { key: i, style: { display: 'inline-block', height: 16, width: 16, verticalAlign: 'top', position: 'relative', lineHeight: 0 } }));
        }
      }

      if (index === 0 && _this.props.hasChildren && _this.props.showChildren === false && _this.props.useGriddleIcons) {
        firstColAppend = React.createElement(
          'span',
          { style: _this.props.useGriddleStyles ? { fontSize: "10px", marginRight: "5px" } : null, onClick: _this.handleRowExpandToggle },
          paddingNodes,
          _this.props.parentRowCollapsedComponent
        );
      } else if (index === 0 && _this.props.hasChildren && _this.props.showChildren && _this.props.useGriddleIcons) {
        firstColAppend = React.createElement(
          'span',
          { style: _this.props.useGriddleStyles ? { fontSize: "10px" } : null, onClick: _this.handleRowExpandToggle },
          paddingNodes,
          _this.props.parentRowExpandedComponent
        );
      } else if (index === 0) {
        firstColAppend = React.createElement(
          'span',
          { style: _this.props.useGriddleStyles ? { fontSize: "10px" } : null },
          paddingNodes,
          _this.props.simpleRowComponent
        );
      }

      if (_this.props.columnSettings.hasColumnMetadata() && typeof meta !== "undefined") {
        var colData = typeof meta.customComponent === 'undefined' || meta.customComponent === null ? col[1] : React.createElement(meta.customComponent, { data: col[1], rowData: dataView, metadata: meta });
        returnValue = meta == null ? returnValue : React.createElement(
          'td',
          { onClick: _this.handleClick, className: meta.cssClassName, key: index, style: columnStyle },
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
    var className = that.props.rowSettings && that.props.rowSettings.getBodyRowMetadataClass(that.props.data) || "standard-row";

    if (that.props.isChildRow) {
      className = "child-row";
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