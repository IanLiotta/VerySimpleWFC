import React, { useState, useEffect } from 'react';
import P5Wrapper, { __esModule } from 'react-p5-wrapper';
import resultCanvas from './resultCanvas.js';
const config = require('./config.js');

const ResultOutput = ({rules, table, setTable, loop, setLoop}) => {
    const [nextMoves, setNextMoves] = useState([]);
    const [history, setHistory] = useState([]);
    const [firstMove, setFirstMove] = useState(true);

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
    
    const patternStep = () => {
      let tempTable = JSON.parse(JSON.stringify(table));
      let possibleTable = createTable(config.TABLE_SIZE);        
      let row, col;
      let possible = [];
      
      const findNextMoves = () => {
        let tempNextMoves = [];
        let result = [];
        for(let x = 0; x < config.TABLE_SIZE; x++){
            for(let y = 0; y < config.TABLE_SIZE; y++){
                if (tempTable[x][y].includes(0)){
                    if(tempTable[x-1] && tempTable[x-1][y] && !tempTable[x-1][y].includes(0))
                    tempNextMoves.push([x-1, y]);
                    if(tempTable[x+1] && tempTable[x+1][y] && !tempTable[x+1][y].includes(0))
                    tempNextMoves.push([x+1, y]);
                    if(tempTable[x][y-1] && !tempTable[x][y-1].includes(0))
                    tempNextMoves.push([x, y-1]);
                    if(tempTable[x][y+1] && !tempTable[x][y+1].includes(0))
                    tempNextMoves.push([x, y+1]);
                }
            }
        }
        for(const move of tempNextMoves) {
            const currentMoves = JSON.stringify(result);
            if(!currentMoves.includes(JSON.stringify(move))){
                result.push(move);
            }
        }
        return result;
      }
      if(nextMoves.length === 0 && firstMove){
        row = Math.floor(Math.random() * config.TABLE_SIZE);
        col = Math.floor(Math.random() * config.TABLE_SIZE);
        possible = parseNeighbors(row, col, tempTable);
        setFirstMove(false);
      }
      else if (nextMoves.length === 0 && !firstMove){
          setLoop(false);
          row = 0;
          col = 0;
      }
      else {
        let tempNextMoves = nextMoves;
        while(possible.length === 0 && tempNextMoves.length > 0){
            let backSteps = 1;
            //pick a random valid move to pin next
            const randIdx = Math.floor(Math.random() * tempNextMoves.length);
            let chosenMove = tempNextMoves[randIdx];
            row = chosenMove[0];
            col = chosenMove[1];
            possible = parseNeighbors(row, col, tempTable);
            tempNextMoves = (tempNextMoves.length > 1) ?
                tempNextMoves.slice(0, randIdx).concat(tempNextMoves.slice(randIdx+1))
                : [];
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
      setHistory(history.concat([tempTable]));
      setNextMoves(findNextMoves());
      setTable(tempTable);
    }

    useEffect(() => {
      if(table.length === 0){
        setTable(createTable(config.TABLE_SIZE));
      }
      if(loop) {
        patternStep();
      }
      else {
          setFirstMove(true);
          setNextMoves([]);
      }
    });
  
    return(
      <div>
        <P5Wrapper sketch={resultCanvas} table={table} />
      </div>
      );
  }

  export default ResultOutput;