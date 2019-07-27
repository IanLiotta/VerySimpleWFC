import React, { useState, useEffect } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import resultCanvas from './resultCanvas.js';
const config = require('./config.js');

const ResultOutput = ({rules}) => {
    const [table, setTable] = useState([]);
    //const [nextMoves, setNextMoves] = useState([]);
    const [loop, setLoop] = useState(false);
  
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
      setTable(createTable(config.TABLE_SIZE));

      /* Failure state testing data
      setTable([[[3,1,2],[3,1,2],[],[],[],[3],[3],[3],[3],[3],[3],[3,1],[3],[3],[3,1],[3],[3],[3],[3],[3,1]],[[1,3,2],[],[],[],[],[3],[3],[3],[3],[3],[3],[1,3],[3],[3],[1,3],[3],[3],[3],[3],[1]],[[],[],[],[],[],[],[3],[3],[3],[3],[3],[1],[3],[3],[1],[3],[3],[3],[3],[1]],[[],[],[],[],[],[],[],[3],[3],[3],[3],[1],[1,3],[3],[1],[3],[3],[3],[3],[1]],[[],[],[],[],[],[],[],[3],[3],[3],[3],[1],[1],[1,3],[1],[3],[3],[3],[3],[1]],[[],[],[],[],[],[],[],[],[],[3],[3],[1],[1,2],[1],[1],[3],[3],[3],[3],[1]],[[],[],[],[],[],[],[1],[],[],[3],[3],[1],[2],[1],[1],[3],[3],[3],[1,3],[1]],[[],[],[],[],[],[],[1],[1],[1],[3],[3],[1],[2],[1],[1],[3],[3],[3],[1],[1,2]],[[],[],[],[],[],[],[1],[1],[1],[3],[1,3],[1],[2],[1],[1],[3],[3],[3],[1],[2]],[[],[],[],[],[],[1],[1],[1],[1],[3],[1,3],[1],[2],[1],[1],[3],[3],[3],[1],[2]],[[],[],[],[],[],[],[],[1],[1],[3],[1,3],[1],[2],[1],[1],[3],[3],[3],[1],[2]],[[],[],[],[],[],[],[],[1],[1],[3],[1],[1],[2],[1],[1],[3],[3],[3],[1],[2]],[[],[],[],[],[],[1],[2],[1],[1],[3],[1],[1],[2],[1,2],[1],[3],[3],[3],[1],[2]],[[],[],[],[],[],[],[2],[1],[1],[3],[1],[1],[2],[1,2],[1],[1,3],[3],[3],[1],[2]],[[],[],[],[],[],[],[2],[1],[1],[3],[1],[1],[2],[2],[1],[1,3],[3],[3],[1],[2]],[[],[],[],[],[],[],[2],[1,2],[1],3,[1],[1],[2],[2],[1],[1],[3],[3],[1],[2]],[[],[],[],[],[],[],[2],[1,2],[1,2],[1,3],[1],[1],[2],[2],[1],[1],[3],[3],[1],[2]],[[],[],[],[],[],[1],[2],[2],[1,2],[1],[1],[1],[2],[2],[1,2],[1],3,[3],[1],[2]],[[],[],[],[],[],[],[2],[2],[1,2],[1,2],[1,2],[1],[2],[2],[1,2],[1],[3],[1,3],[1],[2]],[[],[],[],[],[],[],[],[2],[2],[1,2],[1,2],[1,2],[2],[2],[2],[1],[1,3],[1],[1,2],[2]]]);
      setHistory([[18,15],[18,16],[13,15],[1,14],[13,17],[10,13],[14,15],[15,17],[12,13],[7,18],[6,18],[19,16],[7,19],[16,17],[1,19],[0,19],[13,13],[5,13],[4,13],[10,12],[18,17],[18,14],[5,12],[16,14],[3,12],[18,11],[19,17],[19,18],[10,10],[19,11],[0,14],[14,10],[0,11],[19,10],[12,9],[4,11],[1,11],[5,8],[18,10],[17,14],[6,8],[5,7],[5,6],[6,7],[7,10],[19,9],[18,9],[11,7],[10,6],[15,9],[11,6],[16,9],[15,7],[8,10],[19,7],[2,6],[3,6],[14,5],[16,7],[18,5],[10,5],[8,5],[16,8],[19,8],[9,4],[12,4],[18,8],[17,4],[7,5],[17,16],[15,9]]);
      setPinned([[false,false,false,false,false,true,true,true,true,true,true,false,true,true,false,true,true,true,true,false],[false,false,false,false,false,true,true,true,true,true,true,false,true,true,false,true,true,true,true,true],[false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true],[false,false,false,false,false,false,false,true,true,true,true,true,false,true,true,true,true,true,true,true],[false,false,false,false,false,false,false,true,true,true,true,true,true,false,true,true,true,true,true,true],[false,false,false,false,false,false,false,false,false,true,true,true,false,true,true,true,true,true,true,true],[false,false,false,false,false,false,true,false,false,true,true,true,true,true,true,true,true,true,false,true],[false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false],[false,false,false,false,false,false,true,true,true,true,false,true,true,true,true,true,true,true,true,true],[false,false,false,false,false,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true],[false,false,false,false,false,false,false,true,true,true,false,true,true,true,true,true,true,true,true,true],[false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true],[false,false,false,false,false,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true],[false,false,false,false,false,false,true,true,true,true,true,true,true,false,true,false,true,true,true,true],[false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,false,true,true,true,true],[false,false,false,false,false,false,true,false,true,true,true,true,true,true,true,true,true,true,true,true],[false,false,false,false,false,false,true,false,false,false,true,true,true,true,true,true,true,true,true,true],[false,false,false,false,false,true,true,true,false,true,true,true,true,true,false,true,true,true,true,true],[false,false,false,false,false,false,true,true,false,false,false,true,true,true,false,true,true,false,true,true],[false,false,false,false,false,false,false,true,true,false,false,false,true,true,true,true,false,true,false,true]]);
  
      */
    }
    
    const patternStep = () => {
      let tempTable = JSON.parse(JSON.stringify(table));
      let possibleTable = createTable(config.TABLE_SIZE);        
      //pick a random start position
      let row, col;
      let possible = [];
      
      const findNextMoves = () => {
        let tempNextMoves = [];
        for(let x = 0; x < config.TABLE_SIZE; x++){
          for(let y = 0; y < config.TABLE_SIZE; y++){
            if (table[x][y].includes(0)){
              if(table[x-1] && table[x-1][y] && !table[x-1][y].includes(0))
                tempNextMoves.push([x-1, y]);
              if(table[x+1] && table[x+1][y] && !table[x+1][y].includes(0))
                tempNextMoves.push([x+1, y]);
              if(table[x][y-1] && !table[x][y-1].includes(0))
                tempNextMoves.push([x, y-1]);
              if(table[x][y+1] && !table[x][y+1].includes(0))
                tempNextMoves.push([x, y+1]);
            }
          }
        }
        console.log('next moves: ', tempNextMoves);
        return tempNextMoves;
      }

      let nextMoves = findNextMoves();
      if(nextMoves.length === 0) {setLoop(false);}
  
      if(nextMoves.length === 0){
        row = Math.floor(Math.random() * config.TABLE_SIZE);
        col = Math.floor(Math.random() * config.TABLE_SIZE);
        possible = parseNeighbors(row, col, tempTable);
      }
      else {
        
        while(possible.length === 0 && nextMoves.length > 0){
          //pick a random valid move to pin next
          const randIdx = Math.floor(Math.random() * nextMoves.length);
          let chosenMove = nextMoves[randIdx];
          row = chosenMove[0];
          col = chosenMove[1];
          possible = parseNeighbors(row, col, tempTable);
          nextMoves = nextMoves.slice(0, randIdx).concat(nextMoves.slice(randIdx+1));
        }
      }
      
      //if our currently selected cell is unpinned, pin it.
      if(!table[row][col].includes(0)) {
        const newColorIdx = Math.floor(Math.random() * possible.length);
        tempTable[row][col] = [possible[newColorIdx]];
        tempTable[row][col].push(0);
        //evaluate what possibilities our neighbors have left (brute force propagation.)
        let newPins = false;
        do{
            newPins = false;
            for(let x = 0; x < config.TABLE_SIZE; x++){
                for(let y = 0; y < config.TABLE_SIZE; y++){
                    if(tempTable[x][y].includes(0)){
                        possibleTable[x][y] = tempTable[x][y];
                    }
                    else {
                        possibleTable[x][y] = parseNeighbors(x, y, tempTable);
                        if(possibleTable[x][y].length === 1){
                            possibleTable[x][y].push(0);
                            newPins = true;
                        }
                    }
                }
            }
            tempTable = possibleTable;
        }while(newPins === true);
        }
      //done with step; set our state to the result.
      setTable(tempTable);
    }
    
    const generatePattern = () => {
        setLoop(false);
        setTable(createTable(config.TABLE_SIZE));
        patternStep();
        setLoop(true);
    }
    
    useEffect(() => {
      if(table.length === 0){
        setTable(createTable(config.TABLE_SIZE));
      }
      if(loop) {
        patternStep();
      }
    });
  
    return(
      <div>
        <button
        onClick={generatePattern}
        >Generate Pattern</button>
        <button
        onClick={resetTable}
        >Reset Pattern</button>
        <button
        onClick={patternStep}
        >Step Forward</button>
        <P5Wrapper sketch={resultCanvas} table={table} />
      </div>
      );
  }

  export default ResultOutput;