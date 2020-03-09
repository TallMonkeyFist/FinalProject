
"use strict"

function Player()
{
    this.square = new Renderable();
    this.square.setColor([1, 0, 0, 1]);
    this.path = [];
    GameObject.call(this, this.square);
}

gEngine.Core.inheritPrototype(Player, GameObject);

Player.prototype.update = function(mGrid)
{
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
    {
        var result = mGrid.search(this.getXform().getPosition(), [50, 80]);
        this.path = result;
    }
    
    if(this.path !== null && this.path.length > 0)
    {
        var node = this.path.splice(0,1);
        mGrid.moveObject(this, [node[0].x, node[0].y]);
    }
};

Player.prototype._arrived = function()
{
    return (this.path.length === 0 );
};