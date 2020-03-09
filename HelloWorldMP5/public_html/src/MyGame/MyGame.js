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
    this.mGrid = null;
    this.player = null;
    this.wall = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kSpriteSheet);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kSpriteSheet);
};

MyGame.prototype.initialize = function () {
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
    this.mGrid.setWidth(this.mCamera.getWCWidth());
    this.mGrid.setHeight(this.mCamera.getWCHeight());
    this.player = new Player();
    this.player.getXform().setPosition(150, 1125/14);
    this.player.getXform().setSize(10, 10);
    this.wall = new Renderable();
    this.wall.setColor([0, 1, .75, 1]);
    this.wall.getXform().setPosition(100, 1125/14);
    this.wall.getXform().setSize(10, 100);
    this.mGrid.addStatic(this.wall);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    this.player.draw(this.mCamera);
    this.wall.draw(this.mCamera);
    this.mGrid.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () 
{
    this.player.update(this.mGrid, this.mCamera);   
};