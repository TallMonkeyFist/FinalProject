"use strict"

function Grid(numXCells, numYCells)
{
    this.mXform = new Transform();
    this.xCell = numXCells;
    this.yCell = numYCells;
    this.squares = null;
    this.objects = [];
    this._calibrate();
    this.gridLines = []; 
    this.mGraph = null;
    this._initGrid();
    this.showGrid = false; 
}

Grid.prototype.setPosition = function(x, y)
{
    this.mXform.setPosition(x, y);
    this._initGrid();
    this._calibrate();
};

Grid.prototype.setSize = function(x, y)
{
    this.mXform.setWidth(x);
    this.mXform.setHeight(y);
    this._initGrid();
    this._calibrate();
};

Grid.prototype.setWidth = function(x)
{
    this.mXform.setWidth(x);
    this._initGrid();
    this._calibrate();
};

Grid.prototype.setHeight = function(y)
{
    this.mXform.setHeight(y);
    this._initGrid();
    this._calibrate();
};

Grid.prototype.getCellCount = function()
{
    return [this.xCell, this.yCell];
};

Grid.prototype.getSize = function()
{
    return [this.mXform.getWidth(), this.mXform.getHeight()];
};

Grid.prototype.addStatic = function(object)
{
    if (!this._isValid(object))
    {
        console.log("not valid");
        return;
    }
    this._addToGrid(object);
    this.objects.push(object);
};

Grid.prototype.removeStatic = function(object)
{
    if (!this._isValid(object))
    {
        console.log("Not valid");
        return;
    }
    this._removeFromGrid(object);
};

Grid.prototype.search = function(start, end)
{
    var startGrid = this._wcToGrid(start);
    var s = this.mGraph.grid[startGrid[0]][startGrid[1]];
    var endGrid = this._wcToGrid(end);
    var e = this.mGraph.grid[endGrid[0]][endGrid[1]];
    if (this.squares[endGrid[0]][endGrid[1]] === 0)
    {
        gUpdateFrame("Can't move into a wall");
        return [];
    }
    gUpdateFrame("Moving to cell: " + endGrid[0] + ", " + endGrid[1]);
    var result = astar.search(this.mGraph   , s, e, {heuristic: astar.heuristics.diagonal });
    return result;
};

Grid.prototype._isValid = function (object)
{
    //If the object has no transform, don't add the object to the grid
    if((typeof object.getXform) !== "function")
    {
        console.log("No xform");
        return false;
    }
    var xform = object.getXform();
    //If center position is not in the grid, don't add the object to the grid   
    if(xform.getPosition()[0] < this.minX || xform.getPosition()[0] > this.maxX)
    {
        return false;
    }
    if(xform.getPosition()[1] < this.minY || xform.getPosition()[1] > this.maxY)
    {
        return false;
    }
    return true;
};

Grid.prototype._calibrate = function()
{
    this.minX = this.mXform.getPosition()[0] - this.mXform.getWidth()/2;
    this.maxX = this.mXform.getPosition()[0] + this.mXform.getWidth()/2;
    this.minY = this.mXform.getPosition()[1] - this.mXform.getHeight()/2;
    this.maxY = this.mXform.getPosition()[1] + this.mXform.getHeight()/2;
};

Grid.prototype._addToGrid = function (object)
{
    var xform = object.getXform();
    var pos = xform.getPosition();
    var minX, minY, maxX, maxY;
    minX = pos[0] - xform.getWidth()/2;
    maxX = pos[0] + xform.getWidth()/2;
    minY = pos[1] - xform.getHeight()/2;
    maxY = pos[1] + xform.getHeight()/2;
    var start = this._wcToGrid([minX, minY]);
    var end = this._wcToGrid([maxX, maxY]);
    var i;
    for (i = start[0]; i <= end[0]; i++)
    {
        var j;
        for (j = start[1]; j <= end[1];  j++)
        {
            this.squares[i][j] = 0;
        }
    }
    this.mGraph = null;
    this.mGraph = new Graph(this.squares, { diagonal: true });
};

Grid.prototype._removeFromGrid = function (object)
{
    var collided = [];
    var boundingBox = object.getBBox();
    var i;
    for (i = 0; i < this.objects.length; i++)
    {
        if (boundingBox.intersectsBound(this.objects[i].getBBox()))
            collided.push(this.objects[i]);
    }
    var xform = object.getXform();
    var pos = xform.getPosition();
    var minX, minY, maxX, maxY;
    minX = pos[0] - xform.getWidth()/2;
    maxX = pos[0] + xform.getWidth()/2;
    minY = pos[1] - xform.getHeight()/2;
    maxY = pos[1] + xform.getHeight()/2;
    var start = this._wcToGrid([minX, minY]);
    var end = this._wcToGrid([maxX, maxY]);
    
    for (i = start[0]; i <= end[0]; i++)
    {
        var j;
        for (j = start[1]; j <= end[1];  j++)
        {
            this.squares[i][j] = 1;
        }
    }
    
    for(i = 0; i < collided.length; i++)
    {
        if(collided[i] === object)
        {
            console.log("Found");
        }
        else
        {
            this._addToGrid(collided[i]);
        }
    }
    this.mGraph = null;
    this.mGraph = new Graph(this.squares, { diagonal: true });
};

Grid.prototype.setStatic = function(x, y)
{
    this.squares[x][y] = 0;
};

Grid.prototype.getXform = function()
{
    return this.mXform;
};

Grid.prototype._wcToGrid = function(position)
{
    var x = this.xCell * ((position[0] - this.minX)/this.mXform.getWidth());
    var y = this.yCell * ((position[1] - this.minY)/this.mXform.getHeight());
    if (x < 0 || y < 0 || x > this.xCell || y > this.yCell)
    {
        console.log("Outside of grid");
    }
    console.log(x, y);
    return [Math.floor(x),Math.floor(y)];
};

Grid.prototype.gridToWC = function(position)
{
    var x = ((position[0]/this.xCell)*this.mXform.getWidth()) + this.minX;
    var y = ((position[1]/this.yCell)*this.mXform.getHeight()) + this.minY;
    return [x, y];
};

Grid.prototype._initGrid = function()
{
    this.squares = null;
    this.squares = new Array(this.xCell);
    this.gridLines = [];
    var i;
    for (i = 0; i < this.xCell; i++)
    {
        this.squares[i] = new Array(this.yCell);
    }
    
    for (i = 0; i < this.xCell; i++)
    {
        var j;
        for(j = 0; j < this.yCell; j++)
        {
            this.squares[i][j] = 1;
        }
    }
    
    this.mGraph = new Graph(this.squares, { diagonal: true });
    
    var xStart = this.mXform.getPosition()[0] - this.mXform.getWidth() / 2; 
    var xEnd = this.mXform.getPosition()[0] + this.mXform.getWidth() / 2; 
    var deltaX = (xEnd - xStart) / this.xCell; 
    
    var yStart = this.mXform.getPosition()[1] - this.mXform.getHeight() / 2; 
    var yEnd = this.mXform.getPosition()[1] + this.mXform.getHeight() / 2; 
    var deltaY = (yEnd - yStart) / this.yCell; 
    
    var tempLine;
    for (i = xStart; i <= xEnd; i = i + deltaX) {
        tempLine = new LineRenderable(i, yStart, i, yEnd); 
        this.gridLines.push(tempLine);
    }
    for (i = yStart; i <= yEnd + 1; i = i + deltaY) {
        tempLine = new LineRenderable(xStart, i, xEnd, i); 
        this.gridLines.push(tempLine);        
    }
};

Grid.prototype.draw = function(mCamera) {
    if (this.showGrid) {
        var i;
        for (i = 0; i < this.gridLines.length; i++) {
            this.gridLines[i].draw(mCamera); 
        }
    }
};

Grid.prototype.update = function(mCamera) {
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.G))
    {
        this.showGrid = !this.showGrid; 
    }
};