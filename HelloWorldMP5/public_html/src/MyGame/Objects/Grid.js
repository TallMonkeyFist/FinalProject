
function Grid(numXCells, numYCells)
{
    this.mXform = new Transform();
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
    this.mGraph = new Graph(this.squares);
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
    var wcPos = this._gridToWC(gridPosition);
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
    var i;
    for (i = Math.floor(pos[0] - xform.getWidth()/2); 
            i < pos[0] + xform.getWidth()/2; i++)
    {
        var j;
        for (j = Math.floor(pos[1] - xform.getHeight()/2);
            j < pos[1] + xform.getHeight()/2; j++)
        {
            console.log(i);
            this.squares[i][j] = 0;
        }
    }
    this.mGraph = null;
    this.mGraph = new Graph(this.squares);
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

Grid.prototype._gridToWC = function(position)
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
    
//    xStart = 
//    xEnd = 
//    deltaX =
//    
//    yStart = 
//    yEnd = 
//    deltaY = 
    
    tempLine = new LineRenderable(100, 110, 1125/14, 1125/14 + 10);
    this.gridLines.push(tempLine);
    tempLine = new LineRenderable(100, 150, 1125/14, 1125/14 + 10);
    this.gridLines.push(tempLine);
};

Grid.prototype.draw = function(mCamera) {
    
    for (i = 0; i < this.gridLines.length; i++) {
        this.gridLines[i].draw(mCamera); 
    }
};