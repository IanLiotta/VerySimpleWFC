import React, { useState, useEffect } from 'react';
const config = require('./config.js');

const RuleButton = ({row, col, updateRules}) => {
    const [colorIdx, setColorIdx] = useState(1);
    
    const cycleColor = () => {
      if(colorIdx === config.colors.length - 1 ) {
        setColorIdx(1);
        updateRules(1, row, col);
      }
      else {
        setColorIdx(colorIdx + 1);
        updateRules( colorIdx + 1, row, col);
      }
    }
    
    return(
      <button
        className={`ruleButton ${config.colors[colorIdx]}`}
        onClick={cycleColor}
      ></button>
    )
    
  }

  const createTable = ( size ) => {
    const newTable = [];
    for(let x = 0; x < size; x++){
      const cols = []
      for(let y = 0; y < size; y++){
        cols.push(1);
      }
      newTable.push(cols);
    }
    return newTable;
  }

const RuleInput = ({size, rules, setRules}) => {
    const [ruleSource, setRuleSource] = useState(createTable(size));

      const ruleExists = (a, newRules) => {
      for(const b of newRules){
        if(a.source === b.source && a.dest === b.dest && a.dir === b.dir)
        return true;
      }
      return false;
    }
      
    const generateRules = () => {
      const newRules = [];
      for(let row = 0; row < size; row++){
        for(let col = 0; col < size; col++){
          if((ruleSource[row-1] && ruleSource[row-1][col])){
            let rule = {source:ruleSource[row][col], dest:ruleSource[row-1][col], dir:'u'};
            if(!ruleExists(rule, newRules)) {
              newRules.push(rule);
            }
          }
  
          if((ruleSource[row+1] && ruleSource[row+1][col])){
            let rule = {source:ruleSource[row][col], dest:ruleSource[row+1][col], dir:'d'};
            if(!ruleExists(rule, newRules)) {
              newRules.push(rule);
            }
          }
  
          if(ruleSource[row][col-1]){
            let rule = {source:ruleSource[row][col], dest:ruleSource[row][col-1], dir:'l'};
            if(!ruleExists(rule, newRules)) {
              newRules.push(rule);
            }
          }
  
          if(ruleSource[row][col+1]){
            let rule = {source:ruleSource[row][col], dest:ruleSource[row][col+1], dir:'r'};
            if(!ruleExists(rule, newRules)) {
              newRules.push(rule);
            }
          }
        }
      }
      setRules(newRules);
    }
    
    const updateRules = (colorIdx, row, col) => {
      const newRuleSource = ruleSource;
      newRuleSource[row][col] = colorIdx;
      setRuleSource(newRuleSource);
      generateRules();
    }
    
    let result = []
    for(let rows = 0; rows < size; rows++){
      let colTemp = []
      for(let cols = 0; cols < size; cols++){
        colTemp.push(<RuleButton key={cols} row={rows} col={cols} updateRules={updateRules} />)
      }
      result.push(<div key={rows} className="row-container">{colTemp}</div>);
    }
    
    useEffect(() => {
      if(ruleSource.length === 0) {
        generateRules();
      }
    });
    
    return(<div>
        <h2>Rule Input</h2>
        {result}
      </div>);
  }

  export default RuleInput;