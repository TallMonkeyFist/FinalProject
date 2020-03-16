/*
 * File: SceneFile_Parse.js 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, console: false, Camera: false, vec2: false, Renderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SceneFileParser(sceneFilePath, type) {
    if (type === "XML") {
        this.mScene = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
    }
    if (type === "JSON") {
        var jsonString = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
        var sceneInfo = JSON.parse(jsonString);
        this.mScene = sceneInfo;
    }
    if (type === "SMALL") {
        var jsonString = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
        var sceneInfo = JSON.parse(jsonString);
        this.mScene = sceneInfo;  
    }
}

SceneFileParser.prototype._getElm = function (tagElm, type) {
    if (type === "XML") {
        var theElm = this.mScene.getElementsByTagName(tagElm);
        if (theElm.length === 0) {
            console.error("Warning: Level element:[" + tagElm + "]: is not found!");
        }
        return theElm;
    }
};

SceneFileParser.prototype.parseCamera = function (type, widthOffset, xOffset, yOffset) {
    if (type === "XML") {
        var camElm = this._getElm("Camera", "XML");
        var cx = Number(camElm[0].getAttribute("CenterX"));
        var cy = Number(camElm[0].getAttribute("CenterY"));
        var w = Number(camElm[0].getAttribute("Width"));
        var viewport = camElm[0].getAttribute("Viewport").split(" ");
        var bgColor = camElm[0].getAttribute("BgColor").split(" ");
        // make sure viewport and color are number
        var j;
        for (j = 0; j < 4; j++) {
            bgColor[j] = Number(bgColor[j]);
            viewport[j] = Number(viewport[j]);
        }
    }
    if (type === "JSON") {
        var camElm = this.mScene.Camera;
        var cx = camElm.Center[0];
        var cy = camElm.Center[1];
        var w = camElm.Width;
        var viewport = camElm.Viewport;
        var bgColor = camElm.BgColor;
        // make sure viewport and color are number
    }
    var cam = new Camera(
        vec2.fromValues(cx + xOffset, cy + yOffset),  // position of the camera
        w + widthOffset,                        // width of camera
        viewport                  // viewport (orgX, orgY, width, height)
        );
    cam.setBackgroundColor(bgColor);
    return cam;
};

SceneFileParser.prototype.parseWalls = function (type, walls, mGrid) {
    if (type === "JSON") {
        var i, c, x, y, w, h, wall; 
        var elm = this.mScene.Walls;
        for (i = 0; i < elm.length; i++) {
            var data = elm[i];
            c = data.Color;
            x = data.Pos[0];
            y = data.Pos[1];
            w = data.Width; 
            h = data.Height;
            
            var wall = new Renderable();
            wall.setColor(c);
            wall.getXform().setPosition(x, y);
            wall.getXform().setSize(w, h);
            walls.addToSet(wall);
            mGrid.addStatic(wall);
        }
    }
};