
"use strict"

function Player()
{
    this.square = new Renderable();
    this.square.setColor([1, 0, 0, 1]);
    this.path = null;
    this.pathLines = []; 
    GameObject.call(this, this.square);
}

gEngine.Core.inheritPrototype(Player, GameObject);

Player.prototype.update = function(mGrid, camera)
{
    if(camera.isMouseInViewport() && gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left))
    {
        var result = mGrid.search(this.getXform().getPosition(), [camera.mouseWCX(), camera.mouseWCY()]);
        this.path = result;
        this._makePathLines(mGrid);
    }
    
    if(camera.isMouseInViewport() && gEngine.Input.isKeyClicked(gEngine.Input.keys.A)) 
    {
        var result = mGrid.search(this.getXform().getPosition(), [camera.mouseWCX(), camera.mouseWCY()]);
        this.path = result;
        this._makePathLines(mGrid);
        this.path = null; 
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
    {
        var result = mGrid.search(this.getXform().getPosition(), [77, 50]);
        this.path = result;
        this._makePathLines(mGrid);
 
    }
    
    if(this.path !== null && this.path.length > 0)
    {
        var node = this.path.splice(0,1);
        this.pathLines.splice(0, 1);
        mGrid.moveObject(this, [node[0].x, node[0].y]);
        if(this._arrived())
        {
            this.path = null;
        }
    }
    if (this.path !== null && this.path.length === 0)
    {
        this.path = null;
    }
};

Player.prototype._arrived = function()
{
    return (this.path.length === 0 );
};

Player.prototype.draw = function(mCamera) 
{
  this.square.draw(mCamera);
};

Player.prototype.drawPath = function(mCamera) 
{
  var i = 0; 
  for (i = 0; i < this.pathLines.length; i++) {
      this.pathLines[i].draw(mCamera);
  }   
};

Player.prototype._makePathLines = function(mGrid) {
    this.pathLines = [];
    var i = 0; 
    for(i = 0; i < this.path.length - 2; i++) {
        var startNode = mGrid.gridToWC([this.path[i].x, this.path[i].y]);
        var endNode = mGrid.gridToWC([this.path[i + 1].x, this.path[i].y + 1]);
        var tempLine = new LineRenderable(
                startNode[0], 
                startNode[1], 
                endNode[0], 
                endNode[1]);
        tempLine.setColor([1, 0, 0, 1]);
        this.pathLines.push(tempLine); 
    }    
};