// loader.js

let memoryLoader = {};
let symbolsLoader = {};
let loadedCode = [];
let loaderStep = 0;

function runLoader() {
    const code = document.getElementById("loaderInput").value.split("\n");
    const baseAddressInput = document.getElementById("baseAddress").value;
    let baseAddress = parseInt(baseAddressInput);
    if (isNaN(baseAddress) || baseAddress < 0) baseAddress = 1000; // fallback

    memoryLoader = {};
    symbolsLoader = {};
    loadedCode = [];
    loaderStep = 0;

    clearPanel("symbolTable");
    clearPanel("memoryMap");
    clearPanel("loadedCode");
    clearPanel("logs");

    let currentAddress = baseAddress;

    for (let line of code) {
        line = line.trim();
        if (line === "" || line.toUpperCase() === "PROGRAM") continue;

        let parts = line.split(" ");
        if (parts[0].endsWith(":")) {
            const sym = parts[0].replace(":", "");
            symbolsLoader[sym] = currentAddress;
            logMessage("logs", `Symbol ${sym} relocated to ${currentAddress}`);
            parts.shift();
        }

        const instr = parts.join(" ");
        memoryLoader[currentAddress] = instr;
        loadedCode.push(`${currentAddress} : ${instr}`);
        currentAddress += 1;
    }

    updateSymbols("symbolTable", symbolsLoader);
    updateMemory("memoryMap", memoryLoader);
    document.getElementById("loadedCode").textContent = loadedCode.join("\n");
    logMessage("logs", `Programs loaded and relocated from base address ${baseAddress}.`);
}

function stepLoader() {
    if (loaderStep >= loadedCode.length) {
        logMessage("logs", "Execution finished.");
        return;
    }
    highlightLine("loadedCode", loaderStep);
    const addr = Object.keys(memoryLoader)[loaderStep];
    logMessage("logs", `Executing: ${memoryLoader[addr]} at ${addr}`);
    loaderStep += 1;
}

function resetLoader() {
    document.getElementById("loaderInput").value = "";
    document.getElementById("baseAddress").value = "1000";
    clearPanel("symbolTable");
    clearPanel("memoryMap");
    clearPanel("loadedCode");
    clearPanel("logs");
    memoryLoader = {};
    symbolsLoader = {};
    loadedCode = [];
    loaderStep = 0;
}
