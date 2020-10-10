const cp = require("child_process");
const config = require("./scriptcraft/config.json")
const socket = require("socket.io-client")(`ws://${config.server}:${config.port}/`);

socket.on("connect", function() {
    console.log("Connected!");
});

socket.on("msg", function(data) {
    scriptcraft.send(data);
});

socket.on("disconnect", function() {});

let scriptcraft = spawnScriptCraft();

function spawnScriptCraft() {
    sc = cp.fork("./scriptcraft/core/index.js");
    sc.on("message", function(message) {
        socket.emit("cmd", message + "\n");
    });
    return sc;
};

process.on("uncaughtException", async function(err) {
    console.error(err);
});