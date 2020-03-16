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

SceneFileParser.prototype.parseSmallCamera = function (smallX, smallY) {
    var camElm = this.mScene.Camera;
    var cx = camElm.Center[0];
    var cy = camElm.Center[1];
    var w = camElm.Width;
    var viewport = camElm.Viewport;
    while((viewport[0] + smallX) < 0) {
        viewport[0] = viewport[0] + 640; 
    }
    while((viewport[1] + smallY) < 0) {
        viewport[1] = viewport[1] + 480; 
    }
    viewport[0] = (viewport[0] + smallX) % 640;
    viewport[1] = (viewport[1] + smallY) % 480;
    var bgColor = camElm.BgColor;
    // Step A: set up the cameras
    var cam = new Camera(
        vec2.fromValues(cx, cy),   // position of the camera
        w,                        // width of camera
        viewport         // viewport (orgX, orgY, width, height)
        );
    cam.setBackgroundColor(bgColor);
    return cam;    
};

SceneFileParser.prototype.parseSquares = function (sqSet, type, frame, cx, width) {
    if (type === "XML") {
        var elm = this._getElm("Square", "XML");
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
    if (type === "JSON") {
        var elm = this.mScene.Square;
        var i, j, x, y, w, h, r, c, sq;
        for (i = 0; i < elm.length; i++) {
            var data = elm[i];
            x = data.Pos[0];
            y = data.Pos[1];
            w = data.Width;
            h = data.Height;
            r = data.Rotation; 
            c = data.Color; 
            
            if (i === 1) {
                r = r + frame * (360.0 / 300.0);
            }
            if (i === 0) {
                x = x - frame * (20/180.0); 
                while (x < cx - width / 2) {
                    x = x + width;
                }
            }
            sq = new Renderable(gEngine.DefaultResources.getConstColorShader());
 
            sq.setColor(c);
            sq.getXform().setPosition(x, y);
            sq.getXform().setRotationInDegree(r); // In Degree
            sq.getXform().setSize(w, h);
            sqSet.push(sq);
        }
    }
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