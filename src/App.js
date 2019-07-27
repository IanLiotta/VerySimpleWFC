import React, { useState, useEffect } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import { ruleDisplay } from './resultCanvas.js';
import './App.css';
import RuleInput  from './RuleInput.js';
import ResultOutput from './ResultOutput.js';
const config = require('./config.js');

const App = () => {
  const [table, setTable] = useState([]);
  const [rules, setRules] = useState([{"source":1,"dest":1,"dir":"d"},{"source":1,"dest":1,"dir":"r"},{"source":1,"dest":1,"dir":"l"},{"source":1,"dest":1,"dir":"u"}]);
  const [loop, setLoop] = useState(false);
  //let debugRules = [{"source":3,"dest":1,"dir":"d"},{"source":3,"dest":3,"dir":"r"},{"source":3,"dest":3,"dir":"d"},{"source":3,"dest":3,"dir":"l"},{"source":1,"dest":3,"dir":"u"},{"source":1,"dest":1,"dir":"d"},{"source":1,"dest":3,"dir":"r"},{"source":3,"dest":3,"dir":"u"},{"source":3,"dest":1,"dir":"l"},{"source":3,"dest":1,"dir":"r"},{"source":1,"dest":2,"dir":"d"},{"source":1,"dest":3,"dir":"l"},{"source":1,"dest":1,"dir":"r"},{"source":1,"dest":1,"dir":"l"},{"source":1,"dest":1,"dir":"u"},{"source":1,"dest":2,"dir":"r"},{"source":2,"dest":1,"dir":"u"},{"source":2,"dest":2,"dir":"d"},{"source":2,"dest":1,"dir":"l"},{"source":2,"dest":1,"dir":"r"},{"source":1,"dest":2,"dir":"l"},{"source":2,"dest":2,"dir":"r"},{"source":2,"dest":2,"dir":"l"},{"source":2,"dest":2,"dir":"u"}];
  
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

  const generatePattern = () => {
    setTable(createTable(config.TABLE_SIZE));
    setLoop(true);
  }

  useEffect(() =>{
    if(table.length === 0) {
      setTable(createTable(config.TABLE_SIZE));
    }
  });
  
  return (
    <div className="App">
      <div className="column-container">
        <RuleInput size={4} rules={rules} setRules={setRules} />
        <div className="row-contaner">
          <button
            onClick={generatePattern}
          >Generate Pattern</button>
        </div>
        <ResultOutput rules={rules} table={table} setTable={setTable} loop={loop} setLoop={setLoop}/>
      </div>
      <div className="column-container">
        <h2>Rule Display</h2>
        <P5Wrapper sketch={ruleDisplay} rules={rules}/>
      </div>

    </div>
  );
}

export default App;
