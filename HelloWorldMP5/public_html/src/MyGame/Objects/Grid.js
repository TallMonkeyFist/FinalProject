
function Grid(numXCells, numYCells)
{
    this.mXform = new Transform();
    this.xCell = numXCells;
    this.yCell = numYCells;
    this.squares = new Array(this.xCell);
    this._initGrid();
}

Grid.prototype.setStatic = function(x, y)
{
    this.squares[x][y] = 0;
};

Grid.prototype.removeStatic = function(x, y)
{
    this.squares[x][y] = 1;
};

Grid.prototype.getArray = function()
{
    return this.squares;
};

Grid.prototype.getXform = function()
{
    return this.mXform;
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
};