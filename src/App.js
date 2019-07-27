import React, { useState } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import ruleDisplay from './resultCanvas.js';
import './App.css';
import RuleInput  from './RuleInput.js';
import ResultOutput from './ResultOutput.js';

// ******* The Main App ******
const App = () => {
  
  const [rules, setRules] = useState([]);
  //let debugRules = [{"source":3,"dest":1,"dir":"d"},{"source":3,"dest":3,"dir":"r"},{"source":3,"dest":3,"dir":"d"},{"source":3,"dest":3,"dir":"l"},{"source":1,"dest":3,"dir":"u"},{"source":1,"dest":1,"dir":"d"},{"source":1,"dest":3,"dir":"r"},{"source":3,"dest":3,"dir":"u"},{"source":3,"dest":1,"dir":"l"},{"source":3,"dest":1,"dir":"r"},{"source":1,"dest":2,"dir":"d"},{"source":1,"dest":3,"dir":"l"},{"source":1,"dest":1,"dir":"r"},{"source":1,"dest":1,"dir":"l"},{"source":1,"dest":1,"dir":"u"},{"source":1,"dest":2,"dir":"r"},{"source":2,"dest":1,"dir":"u"},{"source":2,"dest":2,"dir":"d"},{"source":2,"dest":1,"dir":"l"},{"source":2,"dest":1,"dir":"r"},{"source":1,"dest":2,"dir":"l"},{"source":2,"dest":2,"dir":"r"},{"source":2,"dest":2,"dir":"l"},{"source":2,"dest":2,"dir":"u"}];
  return (
    <div className="App">
      <div className="column-container">
        <RuleInput size={4} rules={rules} setRules={setRules} />
        <ResultOutput rules={rules}/>
      </div>
      <div className="column-container">
        <h2>Rule Display</h2>
        <P5Wrapper sketch={ruleDisplay} rules={rules}/>
      </div>
    </div>
  );
}

export default App;
