
"use strict";

function Player(mGrid)
{
    this.square = new Renderable();
    this.square.setColor([1, 0, 0, 1]);
    this.path = null;
    this.pathLines = []; 
    GameObject.call(this, this.square);
    this.mPath = new Path(mGrid, this.getXform());
    this.wayPoints = [[50, 50], [150, 50], [20, 25]];
    this.currPathIndex = 0; 
    this.followWayPoints = true;
    this.mPath.setGrid(mGrid);
    this.mPath.setSpeed(150);
    this.mSpeed = 5;
}

gEngine.Core.inheritPrototype(Player, GameObject);

Player.prototype.update = function(mGrid, camera)
{    
    // Inputs
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

    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.W))
    {
        this.followWayPoints = !this.followWayPoints;
    }
 
//    if (this.followWayPoints) 
//    {
//        var destination = this.wayPoints[this.currPathIndex];
//        this.mPath.findPath(this.getXform().getPosition(), [destination[0], destination[1]]);
//        
//        if(this.path === null || this.path.length === 0) {
//            var destination = this.wayPoints[this.currPathIndex + 1];
//            this.mPath.findPath(this.getXform().getPosition(), [destination[0], destination[1]]);
//        }
//    }
    
    this.mPath.update(camera, this.mSpeed);
};

Player.prototype.draw = function(mCamera) 
{
  this.square.draw(mCamera);
  this.mPath.draw(mCamera);
};