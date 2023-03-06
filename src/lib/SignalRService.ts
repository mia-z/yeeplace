import * as signalR from "@microsoft/signalr";
import state from "./PlaceService";


let events: signalR.HubConnection;

const buildConnection = () => {
    events = new signalR.HubConnectionBuilder()
    .withUrl("https://yeeserver.miaz.xyz/place")
    .build();

    events.on("update-tile", (data: string) => {
        const parsedData = JSON.parse(data) as TilePayload;
        state.updateTile(parsedData);
    });

    events.on("initial-data", (data: string) => {
        const parsedData = JSON.parse(data) as TilePayload[];
        parsedData.forEach(tile => {
            state.updateTile(tile);
        });
    });

    events.on("error", (data) => {
        console.log("GOT ERROR: " + data);
    })
}

const startConnection = async () => {
    await events.start();
}

const sendTileUpdate = (data: TilePayload) => {
    events.invoke("UpdateTile", data);
}

export default {
    buildConnection,
    startConnection,
    sendTileUpdate
}