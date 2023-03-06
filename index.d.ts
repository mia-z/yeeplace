import { Container, Sprite } from "pixi.js"

declare module "*.png" {
	const value: any;
	export = value;
}

declare global {
    type Tile = {
        x: number,
        y: number,
        emote: "YEE" | "PEPE" | "BLANK",
        container: Container
        sprite: Sprite
    }

    type TilePayload = {
        x: number,
        y: number,
        Team: "YEE" | "PEPE",
        LastUpdated?: string
    }

    type DggUser = {
        createdDate: string,
        nick: string,
        subscription: boolean | null,
        team: "YEE" | "PEPE" | null,
        userId: string,
        userStatus: string,
        username: string
    }
}
