import { Application, Container, Graphics, Rectangle, DisplayObject, Sprite, Texture } from "pixi.js";
import { Viewport } from "pixi-viewport";
import socket from "./SignalRService";
import YEE from "../assets/YEE.png";
import PEPE from "../assets/PEPE.png";

const WORLD_WIDTH = 1250
const WORLD_HEIGHT = 1250

let app: Application;
let viewport: Viewport;
let tileContainer: Container;
let tiles: Tile[] = [];

let user: DggUser;

let isDragging: boolean = false;

const initPlace = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            app = new Application({ 
                height: window.innerHeight, 
                width: window.innerWidth, 
                backgroundColor: 0x1f1f1f,
                antialias: true,
                autoDensity: true,
                resolution: devicePixelRatio
            });
            //@ts-ignore
            document.getElementById("main").appendChild(app.view);
        
            //@ts-ignore
            viewport = new Viewport({
                screenHeight: window.innerHeight,
                screenWidth: window.innerWidth,
                worldHeight: WORLD_HEIGHT,
                worldWidth: WORLD_WIDTH,
                //@ts-ignore
                interaction: app.renderer.plugins.interaction,
            })
                .drag()
                .pinch({ percent: 2 })
                .wheel()
                .decelerate();
        
            viewport.clamp({
                direction: "all",
            });
        
            viewport.clampZoom({
                minWidth: null,
                minHeight: null,
                maxWidth: null,
                maxHeight: 1250,
                minScale: null,
                maxScale: null,
            });
        
            viewport.on("drag-start", () => {
                isDragging = true;
            });
        
            viewport.on("drag-end", () => {
                isDragging = false;
            });
        
            app.stage.addChild(viewport);
        
            tileContainer = new Container();
            tileContainer.width = WORLD_WIDTH - 250;
            tileContainer.height = WORLD_HEIGHT - 250;
        
            viewport.addChild(tileContainer);
            viewport.fit();
            viewport.moveCenter(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
        
            for (let y = 0; y < 40; y++) {
                for (let x = 0; x < 40; x++) {
                    const tileInner = new Container();
                    tileInner.x = (x*25) + 125;
                    tileInner.y = (y*25) + 125;
                    tileInner.height = 25;
                    tileInner.width = 25;

                    tileContainer.addChild(tileInner);

                    let graphicBg = new Graphics();
                    graphicBg.beginFill(0x3f3f3f);
                    graphicBg.drawRect(-12.5, -12.5, 25, 25);
                    tileInner.addChild(graphicBg);

                    const sprite = Sprite.from(Texture.WHITE);
                    sprite.tint = 0x3f3f3f;
                    sprite.buttonMode = true;
                    sprite.interactive = true;
                    sprite.height = 25;
                    sprite.width = 25;
                    sprite.anchor.set(0.5);
                    sprite.on("mouseover", () => {
                        sprite.height = 32;
                        sprite.width = 32;
                    });
                    sprite.on("mouseout", () => {
                        sprite.height = 25;
                        sprite.width = 25;
                    });
                    sprite.on("mousedown", () => {
                        if (!isDragging) {
                            sprite.height = 25;
                            sprite.width = 25;
                        }
                    });
                    sprite.on("mouseup", () => {
                        if (!isDragging) {
                            sprite.scale.set(1, 1);
                            console.log(user.team)
                            socket.sendTileUpdate({ x: x, y: y, Team: user.team });
                        }
                    });
                    tileInner.addChild(sprite);

                    tiles.push({ x, y, emote: "BLANK", container: tileInner, sprite: sprite });
                }
            }
            resolve();
        } catch (e) {
            reject("Couldnt build graphics");
        }
    });
}

const updateTile = (data: TilePayload) => {
    const tileToUpdate = tiles.find(tile => tile.x === data.x && tile.y === data.y);
    if (!tileToUpdate) {
        console.log("tile doesnt exist ???");
    } else {
        let index = tiles.indexOf(tileToUpdate);
        tiles[index].emote = data.Team;
        tiles[index].sprite.tint = 0xffffff;
        switch (tiles[index].emote) {
            case "YEE": {
                tiles[index].sprite.texture = Texture.from(YEE); break;
            }
            case "PEPE": {
                tiles[index].sprite.texture = Texture.from(PEPE); break;
            }
        }
    }
}

const setUser = (acc: DggUser) => {
    user = acc;
}

export default {
    build: initPlace,
    updateTile,
    setUser
}