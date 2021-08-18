// const Cards = require('./Cards');
const emptyStates = require('./emptyStates');

let id1 = "118ad8";
let id2 = "2as2f5";

let state = emptyStates.crazyEight();
console.log(state);
state.playersHands[id1] = [];
state.playersHands[id2] = [];
for (let i = 0; i < 5; i++) {
    state.playersHands[id1].push(state.stockPile.pop());
}
for (let i = 0; i < 5; i++) {
    state.playersHands[id2].push(state.stockPile.pop());
}
console.log('=============', state.playersHands);
