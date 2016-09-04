/*
   See License / Disclaimer https://raw.githubusercontent.com/DynamicTyped/Griddle/master/LICENSE
*/
var React = require('react');
var GridRow = require('./gridRow');
var ColumnProperties = require('./columnProperties');
var _ = require('underscore');
var assign = require('object-assign');

function traverseChildren(parent, parentId = 0, level = 0, childIndex = 0) {
  var result = [];

  parent = assign({$$id: `${parentId}.${childIndex}`, $$parentId: parentId === 0 ? void 0 : parentId, $$level: level}, parent)
  result.push(parent);

  if (Array.isArray(parent.children) && parent.children.length > 0) {
    result = parent.children.reduce(function (acc, child, childIndex) {
      return acc.concat(traverseChildren(child, parent.$$id, level + 1, childIndex));
    }, result);
  }

  return result;
}

var GridRowContainer = React.createClass({
    getDefaultProps: function(){
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
    getInitialState: function(){
      return {
        data: {},
        showChildren: [],
      }
    },
    componentWillReceiveProps: function(props){
      this.setState({
        showChildren: [],
      });
    },
    toggleChildren: function (parentId) {
      var {showChildren, traversedData} = this.state;
      if (showChildren.indexOf(parentId) >= 0) {
        var idFromShouldBeDeleted = new RegExp('^'+parentId+'.*');
        this.setShowChildren(showChildren.map(function(el) {
          el = el.replace(idFromShouldBeDeleted, '');
          return el;
        }).filter(function(el){
          return el && el.length > 0;
        })
      );
      } else {
        this.setShowChildren(showChildren.concat([parentId]));
      }
    },
    setShowChildren: function(visible){
      this.setState({
        showChildren: visible
      });
    },
    verifyProps: function(){
      if(this.props.columnSettings === null){
        console.error("gridRowContainer: The columnSettings prop is null and it shouldn't be");
      }
    },
    rowHasChildren: function (row) {
      return row.children && row.children.length > 0;
    },
    rowHasShownChildren: function (row) {
      return this.state.showChildren.indexOf(row.$$id) >= 0;
    },
    render: function() {
      this.verifyProps();

      if(typeof this.props.data === "undefined"){return (<tbody></tbody>);}
      var arr = traverseChildren(this.props.data)
        .filter((row) => typeof row.$$parentId === 'undefined' || this.state.showChildren.indexOf(row.$$parentId) >= 0)
        .map((row, index) => {
          return <GridRow key={index} useGriddleStyles={this.props.useGriddleStyles} data={row} columnSettings={this.props.columnSettings}
            rowSettings={this.props.rowSettings} hasChildren={this.rowHasChildren(row)} toggleChildren={this.toggleChildren.bind(this, row.$$id)}
            isChildRow={!!row.$$parentId} showChildren={this.rowHasShownChildren(row)} useGriddleIcons={this.props.useGriddleIcons}
            parentRowExpandedClassName={this.props.parentRowExpandedClassName} parentRowCollapsedClassName={this.props.parentRowCollapsedClassName}
            parentRowExpandedComponent={this.props.parentRowExpandedComponent} parentRowCollapsedComponent={this.props.parentRowCollapsedComponent}
            simpleRowComponent={this.props.simpleRowComponent}
            paddingHeight={this.props.paddingHeight} rowHeight={this.props.rowHeight} onRowClick={this.props.onRowClick} />
        });

      return <tbody>{arr}</tbody>
    }
});

module.exports = GridRowContainer;
