/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Example2() {
    // The camera to view the scene
    this.mCamera = null;
    this.kSceneFile = "assets/scene.json";
    this.mGrid = null;
    this.players = []; 
    this.walls = null;
    this.sceneParser = null;
    this.currPlayer = 0; 
}
gEngine.Core.inheritPrototype(Example2, Scene);

Example2.prototype.loadScene = function () {
    
    // Loads in Json file
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile);
};

Example2.prototype.unloadScene = function () {
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    var nextLevel = new MyGame();  // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

Example2.prototype.initialize = function () {
    this.sceneParser = new SceneFileParser(this.kSceneFile, "JSON");
    // Step A: set up the cameras
    this.mCamera = new Camera(
        //I like to have the bottom left corner be (0,0)
        vec2.fromValues(150, 1125/14), // position of the camera
        300,                       // width of camera
        [0, 0, 1400, 750]           // viewport (orgX, orgY, width, height)
    );
    //1400/750 = 300/x
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    this.mGrid = new Grid(100, 100);
    var center = this.mCamera.getWCCenter();
    this.mGrid.setPosition(center[0], center[1]);
    this.mGrid.setWidth(this.mCamera.getWCWidth() + 100);
    this.mGrid.setHeight(this.mCamera.getWCHeight() + 50);
    
    //Creates player 1 
    var player1 = new Player(this.mGrid);
    player1.getXform().setPosition(250, 1125/14 + 50);
    player1.getXform().setSize(10, 10);
    player1.setActive(); 
    this.players.push(player1);
  
    //Creates player 2 
    var player2 = new Player(this.mGrid);
    player2.getXform().setPosition(220, 1125/14 + 50);
    player2.getXform().setSize(20, 20);
    player2.square.setColor([0, 0, 1, 1]);
    this.players.push(player2);
  
    //Creates player 3 
    var player2 = new Player(this.mGrid);
    player2.getXform().setPosition(220, 1125/14 + 30);
    player2.getXform().setSize(15, 15);
    player2.square.setColor([0, 1, 0, 1]);
    this.players.push(player2);
  
 
    this.walls = new GameObjectSet();
    this._makeWalls();
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
Example2.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.walls.draw(this.mCamera);
    this.mGrid.draw(this.mCamera);
    
    var i; 
    for (i = 0; i < this.players.length; i++) {
        this.players[i].draw(this.mCamera);
    }
    
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
Example2.prototype.update = function () 
{
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.K))
    {
        this.unloadScene();
    }
    // Shows Player Paths 
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) 
    {
        var i; 
        for (i = 0; i < this.players.length; i++) {
            this.players[i].showPath = !this.players[i].showPath;
        }
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        this.players[this.currPlayer].deActivate(); 
        this.currPlayer = this.currPlayer + 1; 
        if (this.currPlayer >= this.players.length) {
            this.currPlayer = 0; 
        }
        this.players[this.currPlayer].setActive(); 
    }
    
    gUpdatePlayer("Playing as: Player " + (this.currPlayer + 1).toString());
    
    var i; 
    for (i = 0; i < this.players.length; i++) {
        this.players[i].update(this.mGrid, this.mCamera); 
    }
    this.mGrid.update(this.mCamera); 
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Left))
    {
        this.mCamera.setWCCenter(this.mCamera.getWCCenter()[0] - 10, this.mCamera.getWCCenter()[1]);
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Right))
    {
        this.mCamera.setWCCenter(this.mCamera.getWCCenter()[0] + 10, this.mCamera.getWCCenter()[1]);
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Down))
    {
        this.mCamera.setWCCenter(this.mCamera.getWCCenter()[0], this.mCamera.getWCCenter()[1] - 10);
    }
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Up))
    {
        this.mCamera.setWCCenter(this.mCamera.getWCCenter()[0], this.mCamera.getWCCenter()[1] + 10);
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.P))
    {
        var temp = this.walls.mSet.splice(this.walls.mSet.length - 1, 1)[0];
        console.log(temp);
        this.mGrid.removeStatic(temp);
    }
    
    this.mCamera.update();
};

Example2.prototype._makeWalls = function()
{   
    this.sceneParser.parseWalls("JSON", this.walls, this.mGrid);
        
    var wall1 = new Renderable();
    wall1.setColor([0, 1, .75, 1]);
    wall1.getXform().setPosition(75, 32.5);
    wall1.getXform().setSize(50, 5);
    
    var wall2 = new Renderable();
    wall2.setColor([0, 1, .75, 1]);
    wall2.getXform().setPosition(100, 130);
    wall2.getXform().setSize(100, 5);
    
    var wall3 = new Renderable();
    wall3.setColor([0, 1, .75, 1]);
    wall3.getXform().setPosition(250, 35);
    wall3.getXform().setSize(10, 100);
//    
    this.walls.addToSet(wall1);
    this.walls.addToSet(wall2);
    this.walls.addToSet(wall3);
    this.mGrid.addStatic(wall1);
    this.mGrid.addStatic(wall2);
    this.mGrid.addStatic(wall3);
};