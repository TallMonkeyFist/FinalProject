/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
"use strict";

function Path(grid, xform)
{
    this.mGrid = grid;
    this.path = null;
    this.pathLines = []; 
    this.showPath = true;
    this.xform = xform;
}

Path.prototype.setGrid = function(grid)
{
    this.mGrid = grid;
};

gEngine.Core.inheritPrototype(Path, GameObject);

Path.prototype.findPath = function(start, end)
{
    console.log(start);
    console.log(end);
    var result = this.mGrid.search(start, end);
    this.path = result;
    this._makePathLines(this.mGrid);
};

Path.prototype.findPathLines = function(start, end)
{
    var result = this.mGrid.search(start, end);
    this.path = result;
    this._makePathLines(this.mGrid);
    this.path = null;
};

Path.prototype.update = function()
{
    if(this.path !== null && this.path.length > 0)
    {
        var node = this.path.splice(0,1);
        this.pathLines.splice(0, 1);
        this.mGrid.moveObject(this.xform, [node[0].x, node[0].y]);
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

Path.prototype.draw = function(mCamera)
{
    if (this.showPath)
        this._drawPath(mCamera);
};

Path.prototype._drawPath = function(mCamera) 
{
  var i = 0; 
  for (i = 0; i < this.pathLines.length; i++) {
      this.pathLines[i].draw(mCamera);
  }   
};

Path.prototype._makePathLines = function() {
    this.pathLines = [];
    if (this.path !== null && this.path.length !== 0) {
        var i = 0; 
        var firstStep = this.mGrid.gridToWC([this.path[0].x, this.path[0].y]);
        tempLine = new LineRenderable(
                this.xform.getPosition()[0],
                this.xform.getPosition()[1],
                firstStep[0], 
                firstStep[1]);
        tempLine.setColor([1, 0, 0, 1]);
        this.pathLines.push(tempLine); 
        for(i = 0; i < this.path.length - 1; i++) {
            var startNode = this.mGrid.gridToWC([this.path[i].x, this.path[i].y]);
            var endNode = this.mGrid.gridToWC([this.path[i + 1].x, this.path[i + 1].y]);
            var tempLine = new LineRenderable(
                    startNode[0], 
                    startNode[1], 
                    endNode[0], 
                    endNode[1]);
            tempLine.setColor([1, 0, 0, 1]);
            this.pathLines.push(tempLine); 
        }    
    }
};

Path.prototype._arrived = function()
{
    return (this.path.length === 0);
};