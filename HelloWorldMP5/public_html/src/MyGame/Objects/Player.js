
"use strict"

function Player()
{
    this.square = new Renderable();
    this.square.setColor([1, 0, 0, 1]);
    this.path = [];
    this.pathLines = []; 
    GameObject.call(this, this.square);
}

gEngine.Core.inheritPrototype(Player, GameObject);

Player.prototype.update = function(mGrid)
{
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
    {
        var result = mGrid.search(this.getXform().getPosition(), [50, 80]);
        this.path = result;
        
        var i = 0; 
        for(i = 0; i < this.path.length - 2; i++) {
            var startNode = this.path[i];
//            console.log(startNode);
//            console.log(startNode.x); 
//            console.log(startNode.y);
            var endNode = this.path[i + 1];
//            console.log(endNode.x); 
//            console.log(endNode.y);
            var tempLine = new LineRenderable(startNode.x, 
                    startNode.y, 
                    endNode.x, 
                    endNode.y);
            this.pathLines.push(tempLine); 
        }  
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

Player.prototype.draw = function(mCamera) 
{
  this.square.draw(mCamera)
//  console.log(this.pathLines.length);
  var i = 0; 
  for (i = 0; i < this.pathLines.length; i++) {
      this.pathLines[i].draw(mCamera);
  }
};