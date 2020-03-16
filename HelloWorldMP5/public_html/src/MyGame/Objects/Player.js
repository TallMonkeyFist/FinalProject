
"use strict";

function Player(mGrid)
{
    this.square = new Renderable();
    this.square.setColor([1, 0, 0, 1]);
    this.path = null;
    this.pathLines = []; 
    GameObject.call(this, this.square);
    this.mPath = new Path(mGrid, this.getXform());
    this.mPath.setGrid(mGrid);
    this.mPath.setSpeed(150);
    this.mSpeed = 5;
}

gEngine.Core.inheritPrototype(Player, GameObject);

Player.prototype.update = function(mGrid, camera)
{
    if(camera.isMouseInViewport() && gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left))
    {
        this.mPath.findPath(this.getXform().getPosition(), [camera.mouseWCX(), camera.mouseWCY()]);
    }
    
    if(camera.isMouseInViewport() && gEngine.Input.isKeyClicked(gEngine.Input.keys.A)) 
    {
        this.mPath.findPathLines(this.getXform().getPosition(), [camera.mouseWCX(), camera.mouseWCY()]);
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
    {
        this.mPath.findPath(this.getXform().getPosition(), [77, 50]);
 
    }
    
    this.mPath.update(camera, this.mSpeed);
};

Player.prototype.draw = function(mCamera) 
{
  this.square.draw(mCamera);
  this.mPath.draw(mCamera);
};