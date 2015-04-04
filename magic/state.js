// Game state

// Each State has 4 main functions:
// - create, where the resources are loaded
// - update, where the game logic happens
// - render, where the stuff is printed on the screen

// TODO: add destroy(), destroyUpdate(), destroyRender(), 
// createUpdate(), createRender() to the functions of each state
    
function State( update, render) {
    this.update = update;
    this.render = render;
}

State.prototype.update = function( dt ) {};
State.prototype.render = function( context ) {};

