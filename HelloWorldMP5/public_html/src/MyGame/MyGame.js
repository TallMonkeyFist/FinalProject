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

function MyGame() {
    // The camera to view the scene
    this.mCamera = null;
    this.kSpriteSheet = "assets/SpriteSheet.png";
    this.kSceneFile = "assets/scene.json";
    this.mGrid = null;
    this.player = null;
    this.enemies = []; 
    this.walls = null;
    this.sceneParser = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    // Loads in sprite sheet
    gEngine.Textures.loadTexture(this.kSpriteSheet);
    
    // Loads in Json file
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kSpriteSheet);
};

MyGame.prototype.initialize = function () {
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
    this.mGrid = new Grid(100, 100, this.mCamera);
    var center = this.mCamera.getWCCenter();
    this.mGrid.setPosition(center[0], center[1]);
    this.mGrid.setWidth(this.mCamera.getWCWidth() + 100);
    this.mGrid.setHeight(this.mCamera.getWCHeight() + 50);
    this.player = new Player(this.mGrid);
    this.player.getXform().setPosition(250, 1125/14 + 50);
    this.player.getXform().setSize(10, 10);
  
    this.walls = new GameObjectSet();
    this._makeWalls();
    
    this.enemies = []; 
    var enemy = new Enemy(this.mGrid);
    enemy.getXform().setPosition(30, 1125/14 + 50);
    enemy.getXform().setSize(5, 5);
    var wayPoints = [[20, 25], [20, 150], [200, 150], [200, 25]];
    enemy.setWayPoints(wayPoints); 
    
    this.enemies.push(enemy);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.walls.draw(this.mCamera);
    this.mGrid.draw(this.mCamera);
    this.player.draw(this.mCamera);
    
    var i; 
    for (i = 0; i < this.enemies.length; i++) {
        this.enemies[i].draw(this.mCamera);
    }

};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () 
{
    // Shows Player Paths 
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) 
    {
        this.player.showPath = !this.player.showPath;
    }
    
    // Shows Enemy Paths
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) 
    {
        for (i = 0; i < this.enemies.length; i++) {
            this.enemies[i].showPath = !this.enemies[i].showPath;
        }
    }
    this.player.update(this.mGrid, this.mCamera);  
    this.mGrid.update(this.mCamera); 
    
    var i; 
    for (i = 0; i < this.enemies.length; i++) {
        this.enemies[i].update(this.mGrid, this.mCamera);
    }

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
    this.mCamera.update();
};

MyGame.prototype._makeWalls = function()
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