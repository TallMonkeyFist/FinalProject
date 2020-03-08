/*
 * File: SceneFile_Parse.js 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, console: false, Camera: false, vec2: false, Renderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SceneFileParser(sceneFilePath) {
    this.filePath = sceneFilePath;
    this.mSceneXml = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
}

SceneFileParser.prototype._getElm = function (tagElm) {
    var theElm = this.mSceneXml.getElementsByTagName(tagElm);
    if (theElm.length === 0) {
        console.error("Warning: Level element:[" + tagElm + "]: is not found!");
    }
    return theElm;
};

SceneFileParser.prototype.parseCamera = function (fileType) {
    var camElm;
    var cx;
    var cy ;
    var w;
    var viewport;
    var bgColor;
    if(fileType === gEngine.TextFileLoader.eTextFileType.eTextFile)
    {
        var jsonString = gEngine.ResourceMap.retrieveAsset(this.filePath);
        var sceneInfo = JSON.parse(jsonString);
        camElm = sceneInfo.Camera;
        cx = Number(camElm.Center[0]);
        cy = Number(camElm.Center[1]);
        w = Number(camElm.Width);
        viewport = camElm.Viewport;
        bgColor = camElm.BgColor;
        
    }
    else
    {
        camElm = this._getElm("Camera");
        cx = Number(camElm[0].getAttribute("CenterX"));
        cy = Number(camElm[0].getAttribute("CenterY"));
        w = Number(camElm[0].getAttribute("Width"));
        viewport = camElm[0].getAttribute("Viewport").split(" ");
        bgColor = camElm[0].getAttribute("BgColor").split(" ");
        // make sure viewport and color are number
        var j;
        for (j = 0; j < 4; j++) {
            bgColor[j] = Number(bgColor[j]);
            viewport[j] = Number(viewport[j]);
        }
    }

    var cam = new Camera(
        vec2.fromValues(cx, cy),  // position of the camera
        w,                        // width of camera
        viewport                  // viewport (orgX, orgY, width, height)
        );
    cam.setBackgroundColor(bgColor);
    return cam;
};

SceneFileParser.prototype.parseSquares = function (sqSet, fileType) {
    if(fileType === gEngine.TextFileLoader.eTextFileType.eTextFile)
    {
        var jsonString = gEngine.ResourceMap.retrieveAsset(this.filePath);
        var sceneInfo = JSON.parse(jsonString);
        var elm = sceneInfo.Square;
        var i, j, x, y, w, h, r, c, sq;
        for (i = 0; i < 6; i++) {
            x = Number(elm[i].Pos[0]);
            y = Number(elm[i].Pos[1]);
            w = Number(elm[i].Width);
            h = Number(elm[i].Height);
            r = Number(elm[i].Rotation);
            c = elm[i].Color;
            sq = new Renderable(gEngine.DefaultResources.getConstColorShader());
            sq.setColor(c);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }
    }
    else
    {
        var elm = this._getElm("Square");
        var i, j, x, y, w, h, r, c, sq;
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            w = Number(elm.item(i).attributes.getNamedItem("Width").value);
            h = Number(elm.item(i).attributes.getNamedItem("Height").value);
            r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
            c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
            sq = new Renderable(gEngine.DefaultResources.getConstColorShader());
            // make sure color array contains numbers
            for (j = 0; j < 4; j++) {
                c[j] = Number(c[j]);
            }
            sq.setColor(c);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }
    }
};

SceneFileParser.prototype.parseTextureSquares = function (sqSet, fileType) {
    if(fileType === gEngine.TextFileLoader.eTextFileType.eTextFile)
    {
        var jsonString = gEngine.ResourceMap.retrieveAsset(this.filePath);
        var sceneInfo = JSON.parse(jsonString);
        var elm = sceneInfo.TextureSquare;
        var i, j, x, y, w, h, r, c, t, sq, i;
        for (i = 0; i < elm.length; i++) {
            x = Number(elm[i].Pos[0]);
            y = Number(elm[i].Pos[1]);
            w = Number(elm[i].Width);
            h = Number(elm[i].Height);
            r = Number(elm[i].Rotation);
            c = elm[i].Color;
            t = elm[i].Texture;
            sq = new TextureRenderable(t);
            sq.setColor(c);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }
    }
    else
    {
        var elm = this._getElm("TextureSquare");
        var i, j, x, y, w, h, r, c, t, sq, i;
        for (i = 0; i < elm.length; i++) {
            x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
            y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
            w = Number(elm.item(i).attributes.getNamedItem("Width").value);
            h = Number(elm.item(i).attributes.getNamedItem("Height").value);
            r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
            c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
            t = elm.item(i).attributes.getNamedItem("Texture").value;
            sq = new TextureRenderable(t);
            // make sure color array contains numbers
            for (j = 0; j < 4; j++)
                c[j] = Number(c[j]);
            sq.setColor(c);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
    }
    }
};