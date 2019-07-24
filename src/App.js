import React, { useState, useEffect } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import './App.css';

const TABLE_SIZE = 20;

const colors = [
  'yellow',
  'red', 
  'green', 
  'blue'
];

const colorsRGBA = [
  'rgba(128,128,128, 1)',
  'rgba(255,50,50, 0.25)',
  'rgba(50,255,50, 0.25)',
  'rgba(50,50,255, 0.25)'
];

const RuleButton = ({row, col, updateRules}) => {
  const [colorIdx, setColorIdx] = useState(1);
  
  const cycleColor = () => {
    if(colorIdx === colors.length - 1 ) {
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
      className={`ruleButton ${colors[colorIdx]}`}
      onClick={cycleColor}
    ></button>
  )
  
}

const RuleInput = ({size, rules, setRules}) => {
  const [ruleSource, setRuleSource] = useState([]);

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
    result.push(<div key={rows} className="buttonRow">{colTemp}</div>);
  }
  
  useEffect(() => {
    if(ruleSource.length === 0) {
      setRuleSource(createTable(size));
    }
  });
  
  return(result);
}

const ResultButton = ({row, col, parseNeighbors, table, setTable}) => {
  let [colorIdx, changeColorIdx] = useState(0);

  const solveCell = () => {
    const possible = parseNeighbors(row, col, table);
    const newColorIdx = Math.floor(Math.random() * possible.length);
    changeColorIdx(possible[newColorIdx]);
    const newTable = table;
    newTable[row][col] = possible[newColorIdx];
    setTable(newTable);
  }
     
  return(
  <button
    className={`resultButton ${colors[colorIdx]}`}
    onClick={solveCell}
    ></button>
    )
}

const resultCanvas = ( res ) => {
  let table = [];
  let pinned = [];
  res.setup = () => {
    res.createCanvas(TABLE_SIZE*20, TABLE_SIZE*20);   
  }

  res.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    table = props.table;
    pinned = props.pinned;
  }
  
  res.drawPossible = (row, col, xPx = 20, yPx = 20) => {
    let possible = table[row][col];
    if(possible && !Array.isArray(possible)){
      possible = [possible];
    }
    /* This is the fill function I want - commented out for performance testing
    if(possible && possible.length > 0){
      for(const value of possible) {
        res.fill(colorsRGBA[value]);
        res.rect(col*xPx, row*yPx, xPx, yPx);
        if(pinned[row][col]){
          res.rect(col*xPx+xPx/2, row*yPx+yPx/2, 2, 2,);
        }
      }
    }
    */
    if(possible && possible.length === 1){
      res.fill(colorsRGBA[possible[0]]);
      res.rect(col*xPx, row*yPx, xPx, yPx);
    }
    else {
      res.fill('magenta');
      res.rect(col*xPx, row*yPx, xPx, yPx);
    }
  }

  res.draw = (props) => {
    for(let x = 0; x < table.length; x++){
      for(let y = 0; y < table[x].length; y++){
        res.drawPossible(x, y);
      }
    }
  }
}

const ResultOutput = ({rules}) => {
  const [table, setTable] = useState([]);
  const [pinned, setPinned] = useState([]);
  const [nextMoves, setNextMoves] = useState([]);
  const [loop, setLoop] = useState(false);
  const [history, setHistory] = useState([]);
  
  const createTable = ( size ) => {
    const newTable = [];
    for(let x = 0; x < size; x++){
      const cols = []
      for(let y = 0; y < size; y++){
        cols.push([1,2,3]);
      }
      newTable.push(cols);
    }
    return newTable;
  }

  const parseRules = (cellA, cellB, dir) => {
    //console.log(`cellA: ${cellA} cellB: ${cellB} dir: ${dir}`);
    const allowed = [];
    if(!Array.isArray(cellB)){
      cellB = [cellB];
    }
    for(const rule of rules){
      if(rule.dir === dir && cellB.includes(rule.dest)){
        allowed.push(rule.source);
      }
    }
    return allowed;
  }

  //Examine the neighbors of table[row][col] to see what values I can be based on their values.
  const parseNeighbors = (row, col, table) => {
    const totalAllowed = []; 
    (table[row-1] && table[row-1][col] && totalAllowed.push(parseRules(table[row][col], table[row-1][col], 'u')));
    (table[row+1] && table[row+1][col] && totalAllowed.push(parseRules(table[row][col], table[row+1][col], 'd')));
    (table[row][col-1] && totalAllowed.push(parseRules(table[row][col], table[row][col-1], 'l')));
    (table[row][col+1] && totalAllowed.push(parseRules(table[row][col], table[row][col+1], 'r')));
    //reduce the totalAllowed down to a single array of unique allowed values
    const result = totalAllowed.length > 0 ? totalAllowed.reduce((acc, curr) => {
      if(acc){
        const newAcc = [];
        for(const value of acc) {
          if(curr.includes(value) && !newAcc.includes(value)) {
             newAcc.push(value);
             }
        }
        return newAcc;
      }
      return [];
    })
    : [];
    
    return result;
  }
  
  const resetTable = () => {
    setLoop(false);
    setTable(createTable(TABLE_SIZE));
    let newPinned = [];
      for(let x = 0; x < TABLE_SIZE; x++){
        let cols = []
        for(let y = 0; y < TABLE_SIZE; y++){
          cols.push(false);
        }
        newPinned.push(cols);
      }
    setPinned(newPinned);
  }
  
  const patternStep = () => {
    let tempTable = JSON.parse(JSON.stringify(table));
    let possibleTable = JSON.parse(JSON.stringify(table));
    let tempNextMoves = nextMoves;
    let tempHistory = history;
    
    let newPinned = JSON.parse(JSON.stringify(pinned));
      for(let x = 0; x < TABLE_SIZE; x++){
        let cols = []
        for(let y = 0; y < TABLE_SIZE; y++){
          cols.push(false);
        }
        newPinned.push(cols);
      }
      
    //pick a random start position
    let row, col;
    let possible = [];
    
    const findNextMoves = () => {
      let tempNextMoves = [];
      for(let x = 0; x < TABLE_SIZE; x++){
        for(let y = 0; y < TABLE_SIZE; y++){
          if (newPinned[x][y] === true){
            if(table[x-1] && table[x-1][y] && !newPinned[x-1][y])
              tempNextMoves.push([x-1, y]);
            if(table[x+1] && table[x+1][y] && !newPinned[x+1][y])
              tempNextMoves.push([x+1, y]);
            if(table[x][y-1] && !newPinned[x][y-1])
              tempNextMoves.push([x, y-1]);
            if(table[x][y+1] && !newPinned[x][y+1])
              tempNextMoves.push([x, y+1]);
          }
        }
      }
      return tempNextMoves;
    }
    
    if(tempNextMoves.length === 0){
      row = Math.floor(Math.random() * TABLE_SIZE);
      col = Math.floor(Math.random() * TABLE_SIZE);
      possible = parseNeighbors(row, col, tempTable);
    }
    else {

      while(possible.length === 0 && tempNextMoves.length > 0){
        //pick a random valid move to pin next
        const randIdx = Math.floor(Math.random() * tempNextMoves.length);
        let chosenMove = tempNextMoves[randIdx];
        row = chosenMove[0];
        col = chosenMove[1];
        possible = parseNeighbors(row, col, tempTable);
        if(possible.length === 0) {
          console.count('backtracking!');
          let [prevRow, prevCol] = tempHistory.length-1;
          tempTable[prevRow][prevCol] = parseNeighbors(prevRow, prevCol, tempTable);
          newPinned[prevRow][prevCol] = false;
          tempHistory.shift();
          tempNextMoves = findNextMoves();
        }
      }
    }
    
    //if our currently selected cell is unpinned, pin it.
    if(!newPinned[row][col]) {
      const newColorIdx = Math.floor(Math.random() * possible.length);
      tempTable[row][col] = possible[newColorIdx];
      newPinned[row][col] = true;
      
      //evaluate what possibilities our neighbors have left.
      let newPins = false;
      do{
        newPins = false;
        for(let x = 0; x < TABLE_SIZE; x++){
          for(let y = 0; y < TABLE_SIZE; y++){
            if(!newPinned[x][y]){
              possibleTable[x][y] = parseNeighbors(x, y, tempTable);
              if(possibleTable[x][y].length === 1){
                newPinned[x][y] = true;
                newPins = true;
              }
            }
            else {
              possibleTable[x][y] = tempTable[x][y];
            }
          }
        }
        tempTable = possibleTable;
      }while(newPins);
      
      
      //add adjacent cells to the list of potential next moves.
      tempNextMoves = findNextMoves();
    }    
    
    //done with step; set our state to the result.
    setHistory(history.concat([row, col]));
    setTable(tempTable);
    setPinned(newPinned);
    setNextMoves(tempNextMoves);
  }
  
  const generatePattern = () => {
    patternStep();
    setLoop(true);
  }
  
  useEffect(() => {
    let nextStep;
    if(table.length === 0){
      setTable(createTable(TABLE_SIZE));
      let newTable = [];
      for(let x = 0; x < TABLE_SIZE; x++){
        let cols = []
        for(let y = 0; y < TABLE_SIZE; y++){
          cols.push(false);
        }
        newTable.push(cols);
      }
      setPinned(newTable);
    }
    if(nextMoves.length > 0 && loop) {
      patternStep();
    }
    else{
      setLoop(false);
    }
    
  });
  
  let result = []
  for(let rows = 0; rows < TABLE_SIZE; rows++){
    let colTemp = []
    for(let cols = 0; cols < TABLE_SIZE; cols++){
      colTemp.push(<ResultButton key={cols} row={rows} col={cols} parseNeighbors={parseNeighbors} table={table} setTable={setTable} />)
    }
    result.push(<div key={rows} className="buttonRow">{colTemp}</div>);
  }

  return(
    <div>
      <button
      onClick={resetTable}
      >Reset Pattern</button>
      <button
      onClick={generatePattern}
      >Generate Pattern</button>
      <button
        onClick={patternStep}
      >Step Forward</button>
      <P5Wrapper sketch={resultCanvas} table={table} pinned={pinned} />
    </div>
    );
}

const App = () => {
  
  const [rules, setRules] = useState([]);
  
  return (
    <div className="App">
      <h2>Rules</h2>
      <RuleInput size={4} rules={rules} setRules={setRules} />
      <h2>Result</h2>
      <ResultOutput rules={rules}/>
    </div>
  );
}

export default App;
