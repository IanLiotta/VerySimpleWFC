/* global createCanvas, mouseIsPressed, mousePressed, fill, mouseX, mouseY, ellipse, rect, noLoop, redraw, p5*/

const ruleSource = [
  [1,2,1],
  [1,2,1],
  [3,3,3]
];

const rules = [];

const ruleExists = (a) => {
  for(const b of rules){
    if(a.source === b.source && a.dest === b.dest && a.dir === b.dir)
    return true;
  }
  return false;
}

const generateRules = () => {
  for(let row = 0; row < 3; row++){
    for(let col = 0; col < 3; col++){
      if((ruleSource[row-1] && ruleSource[row-1][col])){
        let rule = {source:ruleSource[row][col], dest:ruleSource[row-1][col], dir:'u'};
        if(!ruleExists(rule)) {
          rules.push(rule);
        }
      }

      if((ruleSource[row+1] && ruleSource[row+1][col])){
        let rule = {source:ruleSource[row][col], dest:ruleSource[row+1][col], dir:'d'};
        if(!ruleExists(rule)) {
          rules.push(rule);
        }
      }

      if(ruleSource[row][col-1]){
        let rule = {source:ruleSource[row][col], dest:ruleSource[row][col-1], dir:'l'};
        if(!ruleExists(rule)) {
          rules.push(rule);
        }
      }

      if(ruleSource[row][col+1]){
        let rule = {source:ruleSource[row][col], dest:ruleSource[row][col+1], dir:'r'};
        if(!ruleExists(rule)) {
          rules.push(rule);
        }
      }
    }
  }
}

const table = [
  [[1,2,3],[1,2,3],[1,2,3]],
  [[1,2,3],[1,2,3],[1,2,3]],
  [[1,2,3],[1,2,3],[1,2,3]]
]

const parseRules = (cellA, cellB, dir) => {
  const allowed = [];
  for(const rule of rules){
    if(rule.dir === dir && cellB.includes(rule.dest)){
      allowed.push(rule.source);
    }
  }
  return allowed;
}

//Examine the neighbors of table[row][col] to see what values I can be based on their values.
const parseNeighbors = (row, col) => {
  const totalAllowed = []; 
  (table[row-1] && table[row-1][col] && totalAllowed.push(parseRules(table[row][col], table[row-1][col], 'u')));
  (table[row+1] && table[row+1][col] && totalAllowed.push(parseRules(table[row][col], table[row+1][col], 'd')));
  (table[row][col-1] && totalAllowed.push(parseRules(table[row][col], table[row][col-1], 'l')));
  (table[row][col+1] && totalAllowed.push(parseRules(table[row][col], table[row][col+1], 'r')));

  //reduce the totalAllowed down to a single array of unique allowed values
  const result = totalAllowed.reduce((acc, curr) => {
    if(acc){
      const newAcc = [];
      for(const value of acc) {
        if(curr.includes(value)) {
           newAcc.push(value);
           }
      }
      return newAcc;
    }
  });
  return result;
}

generateRules();
for(let x = 0; x < table.length; x++){
  for(let y = 0; y < table[x].length; y++){
    table[x][y] = parseNeighbors(x,y);
  }
}

const colors = [
  '0', 
  'rgba(255,0,0, 0.25)', 
  'rgba(0,255,0, 0.25)', 
  'rgba(0,0,255, 0.25)'
];
/*
const ruleCanvas = ( r ) => {
  r.setup = () => {
    r.createCanvas(201, 201);
    r.noLoop();
  }
  
  r.mouseClicked = (event) => {
  console.log(event);
  }
  
  r.draw = () => {

    for(let x = 0; x < ruleSource.length; x++){
      for(let y = 0; y < ruleSource[x].length; y++){
        r.fill(colors[ruleSource[x][y]]);
        r.rect(x*20, y*20, 20, 20);
      }
    }
  }
}
let myp5 = new p5(ruleCanvas, 'rules');
*/
const resultCanvas = ( res ) => {
  res.setup = () => {
    res.createCanvas(200, 200);
    res.noLoop();
    
  }

  res.drawPossible = (row, col, xPx = 20, yPx = 20) => {
    const possible = table[row][col];
    if(possible && possible.length > 0){
      for(const value of possible) {
        res.fill(colors[value]);
        res.rect(row*xPx, col*yPx, xPx, yPx);
      }
    }
    else {
      res.fill('red');
      res.rect(row*xPx, col*yPx, xPx, yPx);
    }
    
  }

  res.draw =() => {
    
    for(let x = 0; x < table.length; x++){
      for(let y = 0; y < table[x].length; y++){
        res.drawPossible(x, y);
      }
    }
  }
}
myp5 = new p5(resultCanvas, 'result');

