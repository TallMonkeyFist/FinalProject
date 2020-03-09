
function Grid(numXCells, numYCells, mCamera)
{
    this.mXform = new Transform();
    this.mCamera = mCamera; 
    this.xCell = numXCells;
    this.yCell = numYCells;
    this.squares = new Array(this.xCell);
    this.object = [];
    this.minX = this.mXform.getPosition()[0] - this.mXform.getWidth()/2;
    this.maxX = this.mXform.getPosition()[0] + this.mXform.getWidth()/2;
    this.minY = this.mXform.getPosition()[1] - this.mXform.getHeight()/2;
    this.maxY = this.mXform.getPosition()[1] + this.mXform.getHeight()/2;
    this.gridLines = []; 
    
    this._initGrid();
    this.mGraph = new Graph(this.squares, { diagonal: true });
    this.showGrid = false; 
}

Grid.prototype._calibrate = function()
{
    this.minX = this.mXform.getPosition()[0] - this.mXform.getWidth()/2;
    this.maxX = this.mXform.getPosition()[0] + this.mXform.getWidth()/2;
    this.minY = this.mXform.getPosition()[1] - this.mXform.getHeight()/2;
    this.maxY = this.mXform.getPosition()[1] + this.mXform.getHeight()/2;
    console.log(this.minX);
    console.log(this.maxX);
    console.log(this.minY);
    console.log(this.maxY);
};

Grid.prototype.setPosition = function(x, y)
{
    this.mXform.setPosition(x, y);
    this._calibrate();
};

Grid.prototype.search = function(start, end)
{
    var startGrid = this._wcToGrid(start);
    var s = this.mGraph.grid[startGrid[0]][startGrid[1]];
    var endGrid = this._wcToGrid(end);
    var e = this.mGraph.grid[endGrid[0]][endGrid[1]];
    console.log(startGrid);
    console.log(endGrid);
    if (this.squares[endGrid[0]][endGrid[1]] === 0)
    {
        console.log("can't move into a wall");
        return [];
    }
    var result = astar.search(this.mGraph, s, e);
    console.log(result);
    return result;
};

Grid.prototype.setSize = function(x, y)
{
    this.mXform.setWidth(x);
    this.mXform.setHeight(y);
    this._calibrate();
};

Grid.prototype.setWidth = function(x)
{
    this.mXform.setWidth(x);
    this._calibrate();
};

Grid.prototype.setHeight = function(y)
{
    this.mXform.setHeight(y);
    this._calibrate();
};

Grid.prototype.addStatic = function(object)
{
    if (!this._isValid(object))
    {
        console.log("not valid");
        return;
    }
    this._addToGrid(object);
    this.object.push(object);
};

Grid.prototype.moveObject = function(object, gridPosition)
{
    var xform = object.getXform();
    var wcPos = this.gridToWC(gridPosition);
    xform.setPosition(wcPos[0], wcPos[1]);
};

Grid.prototype.removeStatic = function(object)
{
    if (!this._isValid(object))
    {
        return;
    }
    this._removeFromGrid(object);
};

Grid.prototype._isValid = function (object)
{
    //If the object has no transform, don't add the object to the grid
    if((typeof object.getXform) !== "function")
    {
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

Grid.prototype._addToGrid = function (object)
{
    var xform = object.getXform();
    var pos = xform.getPosition();
    var minX, minY, maxX, maxY;
    minX = pos[0] - xform.getWidth()/2;
    maxX = pos[0] + xform.getWidth()/2;
    minY = pos[1] - xform.getHeight()/2;
    maxY = pos[1] + xform.getHeight()/2;
    console.log(minX);
    console.log(maxX);
    var start = this._wcToGrid([minX, minY]);
    var end = this._wcToGrid([maxX, maxY]);
    console.log(start);
    console.log(end);
    var i;
    for (i = start[0]; i < end[0]; i++)
    {
        var j;
        for (j = start[1]; j < end[1];  j++)
        {
            this.squares[i][j] = 0;
        }
    }
    this.mGraph = null;
    this.mGraph = new Graph(this.squares, { diagonal: true });
};

Grid.prototype._removeFromGrid = function (object)
{
    var xform = object.getXform();
    var pos = xform.getPosition();
    var i;
    for (i = Math.floor(pos[0] - xform.getWidth()/2); 
            i < pos[0] + xform.getWidth()/2; i++)
    {
        var j;
        for (j = pos[1] - xform.getHeight()/2;
            j < pos[1] + xform.getHeight()/2; j++)
        {
            this.squares[i][j] = 1;
        }
    }
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
    
    xStart = this.mCamera.getWCCenter()[0] - this.mCamera.getWCWidth() / 2; 
    xEnd = this.mCamera.getWCCenter()[0] + this.mCamera.getWCWidth() / 2; 
    deltaX = (xEnd - xStart) / this.xCell; 
    
    yStart = this.mCamera.getWCCenter()[1] - this.mCamera.getWCHeight() / 2; 
    yEnd = this.mCamera.getWCCenter()[1] + this.mCamera.getWCHeight() / 2; 
    deltaY = (yEnd - yStart) / this.yCell; 
    
    for (i = xStart; i <= xEnd; i = i + deltaX) {
        tempLine = new LineRenderable(i, yStart, i, yEnd); 
        this.gridLines.push(tempLine);
    }
    
    for (i = yStart; i <= yEnd; i = i + deltaY) {
        tempLine = new LineRenderable(xStart, i, xEnd, i); 
        this.gridLines.push(tempLine);        
    }
};

Grid.prototype.draw = function(mCamera) {
    if (this.showGrid) {
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