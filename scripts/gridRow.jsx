/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var _ = require('underscore');
var ColumnProperties = require('./columnProperties');
var assign = require('object-assign');

var GridRow = React.createClass({
    getDefaultProps: function(){
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
      }
    },
    handleClick: function(e){
        if(this.props.onRowClick !== null && _.isFunction(this.props.onRowClick) ){
            this.props.onRowClick(this, e);
        }
    },
    handleRowExpandToggle: function () {
      if (this.props.hasChildren) {
        this.props.toggleChildren();
      }
    },
    verifyProps: function(){
        if(this.props.columnSettings === null){
           console.error("gridRow: The columnSettings prop is null and it shouldn't be");
        }
    },
    render: function() {
        this.verifyProps();
        var that = this;
        var initialColumnStyle = null;

        if (this.props.useGriddleStyles) {
          initialColumnStyle = {
            margin: "0",
            padding: that.props.paddingHeight + "px 5px " + that.props.paddingHeight + "px 5px",
            height: that.props.rowHeight? this.props.rowHeight - that.props.paddingHeight * 2 + "px" : null,
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

        var nodes = data.map((col, index) => {
            var returnValue = null;
            var meta = this.props.columnSettings.getColumnMetadataByName(col[0]);
            var columnStyle = assign({}, initialColumnStyle);

            var firstColAppend;
            var paddingNodes = [];

            if (index === 0 && this.props.isChildRow) {
              for (let i = 0; i < dataView.$$level; i++) {
                //paddingNodes.push(this.props.simpleRowComponent);
                paddingNodes.push(<div key={i} style={{display: 'inline-block', height: 16, width: 16, verticalAlign: 'top', position: 'relative', lineHeight: 0}}></div>)
              }
            }

            if (index === 0 && this.props.hasChildren && this.props.showChildren === false && this.props.useGriddleIcons) {
              firstColAppend = <span style={this.props.useGriddleStyles ? {fontSize: "10px", marginRight:"5px"} : null} onClick={this.handleRowExpandToggle}>
                  {paddingNodes}
                  {this.props.parentRowCollapsedComponent}
                </span>
            } else if (index === 0 && this.props.hasChildren && this.props.showChildren && this.props.useGriddleIcons) {
              firstColAppend = <span style={this.props.useGriddleStyles ? {fontSize: "10px"} : null} onClick={this.handleRowExpandToggle}>
                  {paddingNodes}
                  {this.props.parentRowExpandedComponent}
                </span>
            } else if (index === 0) {
              firstColAppend = <span style={this.props.useGriddleStyles ? {fontSize: "10px"} : null}>
                {paddingNodes}
                {this.props.simpleRowComponent}
              </span>
            }

            if (this.props.columnSettings.hasColumnMetadata() && typeof meta !== "undefined") {
              var colData = (typeof meta.customComponent === 'undefined' || meta.customComponent === null) ? col[1] : <meta.customComponent data={col[1]} rowData={dataView} metadata={meta} />;
              returnValue = (meta == null ? returnValue : <td onClick={this.handleClick} className={meta.cssClassName} key={index} style={columnStyle}>{firstColAppend}{colData}</td>);
            }

            return returnValue || (<td onClick={this.handleClick} key={index} style={columnStyle}>{firstColAppend}{col[1]}</td>);
        });

        //Get the row from the row settings.
        var className = that.props.rowSettings && that.props.rowSettings.getBodyRowMetadataClass(that.props.data) || "standard-row";

        if(that.props.isChildRow){
            className = "child-row";
        } else if (that.props.hasChildren){
            className = that.props.showChildren ? this.props.parentRowExpandedClassName : this.props.parentRowCollapsedClassName;
        }
        return (<tr className={className}>{nodes}</tr>);
    }
});

module.exports = GridRow;
