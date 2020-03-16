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
    this.speed = 1;
    this.deltaX = 1;
    this.deltaY = 1;
    this.xRatio = 1;
    this.yRatio = 1;
    this.currentPosition = this.xform.getPosition();
    this.nextPosition = null;
}

gEngine.Core.inheritPrototype(Path, GameObject);

Path.prototype.setGrid = function(grid)
{
    this.mGrid = grid;
    var cells = grid.getCellSize();
    var wc = grid.getSize();
    this.xRatio = cells[0] / wc[0];
    this.yRatio = cells[1] / wc[1];
    this.setSpeed(this.speed);
};

Path.prototype.setSpeed = function(speed)
{
    this.speed = speed;
    this.deltaX = this.speed * this.xRatio / 60;
    this.deltaY = this.speed * this.yRatio / 60;
};


Path.prototype.findPath = function(start, end)
{
    console.log(start);
    console.log(end);
    var result = this.mGrid.search(start, end);
    this.path = result;
    this._makePathLines(this.mGrid);
};

Path.prototype.findMultiPath = function(start, waypoints)
{   
    var result = this.mGrid.search(start, waypoints[0]);
    this.path = result;
    var i; 
    for (i = 0; i < waypoints.length - 1; i++) {
        result = this.mGrid.search(waypoints[i], waypoints[i + 1]);
        this.path = this.path.concat(result);
    }
    result = this.mGrid.search(waypoints[waypoints.length - 1], waypoints[0]);
    this.path = this.path.concat(result);
    
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
        var next = this._checkNextNode();
        
        if(next[0] === 0 && next[1] === 0)
        {
            console.log(this.path[0]);
            if(this.path.length <= 1)
            {
                this.path = null;
                return;
            }
            this.path.splice(0,1);
            this.pathLines.splice(0, 1);
            next = this._checkNextNode();
        }
        
        this.xform.incXPosBy(next[0]);
        this.xform.incYPosBy(next[1]);
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

Path.prototype._checkNextNode = function()
{
    this.currentPos = this.xform.getPosition();
    var gridCoord = [this.path[0].x, this.path[0].y];
    this.nextPosition = this.mGrid.gridToWC(gridCoord);
  
    var nextUpdate = [0,0];
    if(this.xform.getXPos() > this.nextPosition[0] + this.deltaX - .001)
    {
        nextUpdate[0] = -this.deltaX;
    }
    else if (this.xform.getXPos() < this.nextPosition[0] - this.deltaX + .001)
    {
        nextUpdate[0] = this.deltaX;
    }
    if(this.xform.getYPos() > this.nextPosition[1] + this.deltaY - .001)
    {
        nextUpdate[1] = -this.deltaY;
    }
    else if (this.xform.getYPos() < this.nextPosition[1] - this.deltaY + .001)
    {
        nextUpdate[1] = this.deltaY;
    }
    return nextUpdate;
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
        var tempLine = new LineRenderable(
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