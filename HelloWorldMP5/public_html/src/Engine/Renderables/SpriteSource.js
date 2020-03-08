function SpriteSource(myTexture)
{
    TextureRenderable.call(this, myTexture);
    this.squares = [];
    this.outline = [];
    var x = Renderable.prototype.getXform.call(this);
    var i;
    for(i = 0; i < 4; i++)
    {
        this.squares[i] = new Renderable;
        this.squares[i].getXform().setSize(4, 4);
        this.outline[i] = new Renderable;
        this.outline[i].getXform().setSize(1, 1);
        this.outline[i].setColor([0, 0, 0, 1]);
    }
    
}

gEngine.Core.inheritPrototype(SpriteSource, TextureRenderable);

SpriteSource.prototype.draw = function (vpMatrix) {
    // activate the texture
    gEngine.Textures.activateTexture(this.mTexture);
    this._setUp();
    var i;
    TextureRenderable.prototype.draw.call(this, vpMatrix);
    for(i = 0; i < 4; i++)
    {
        this.outline[i].draw(vpMatrix);
    }
    for(i = 0; i < 4; i++)
    {
        this.squares[i].draw(vpMatrix);
    }
};

SpriteSource.prototype._setUp = function()
{
    this.squares[0].setColor([1, 0, 0, 1]);
    this.squares[1].setColor([0, 1, 0, 1]);
    this.squares[2].setColor([0, 0, 1, 1]);
    this.squares[3].setColor([1, 1, 0, 1]);
    var xform = this.getXform();
    var mid = xform.getPosition();
    this.squares[0].getXform().setPosition(mid[0] - xform.getWidth()/2, mid[1] - xform.getHeight()/2);
    this.squares[1].getXform().setPosition(mid[0] + xform.getWidth()/2, mid[1] - xform.getHeight()/2);
    this.squares[2].getXform().setPosition(mid[0] + xform.getWidth()/2, mid[1] + xform.getHeight()/2);
    this.squares[3].getXform().setPosition(mid[0] - xform.getWidth()/2, mid[1] + xform.getHeight()/2);
    
    this.outline[0].getXform().setPosition(mid[0] - xform.getWidth()/2, mid[1]);
    this.outline[1].getXform().setPosition(mid[0] + xform.getWidth()/2, mid[1]);
    this.outline[2].getXform().setPosition(mid[0], mid[1] + xform.getHeight()/2);
    this.outline[3].getXform().setPosition(mid[0], mid[1] - xform.getHeight()/2);
    this.outline[2].getXform().setSize(xform.getWidth(), .5);
    this.outline[3].getXform().setSize(xform.getWidth(), .5);
    this.outline[0].getXform().setSize(.5, xform.getHeight());
    this.outline[1].getXform().setSize(.5, xform.getHeight());
};