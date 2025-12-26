// assembler.js

let memory = {}; // address: instruction
let symbols = {}; // symbol: address
let assemblyCode = [];
let currentStep = 0;

function runAssembler() {
    const code = document.getElementById("codeInput").value.split("\n");
    memory = {};
    symbols = {};
    assemblyCode = [];
    currentStep = 0;
    clearPanel("assemblyCode");
    clearPanel("symbolTable");
    clearPanel("memoryMap");
    clearPanel("logs");

    let address = 1000; // starting memory
    for (let line of code) {
        line = line.trim();
        if (line === "") continue;
        let parts = line.split(" ");
        if (parts[0].endsWith(":")) {
            const sym = parts[0].replace(":", "");
            symbols[sym] = address;
            logMessage("logs", `Symbol ${sym} at address ${address}`);
            parts.shift();
        }
        const instr = parts.join(" ");
        memory[address] = instr;
        assemblyCode.push(`${address} : ${instr}`);
        address += 3;
    }

    updateSymbols("symbolTable", symbols);
    updateMemory("memoryMap", memory);
    document.getElementById("assemblyCode").textContent = assemblyCode.join("\n");
    logMessage("logs", "Assembly generation completed.");
}

function stepAssembler() {
    if (currentStep >= assemblyCode.length) {
        logMessage("logs", "Execution finished.");
        return;
    }
    highlightLine("assemblyCode", currentStep);
    const addr = Object.keys(memory)[currentStep];
    logMessage("logs", `Executing: ${memory[addr]} at ${addr}`);
    currentStep += 1;
}

function resetAssembler() {
    document.getElementById("codeInput").value = "";
    clearPanel("assemblyCode");
    clearPanel("symbolTable");
    clearPanel("memoryMap");
    clearPanel("logs");
    memory = {};
    symbols = {};
    assemblyCode = [];
    currentStep = 0;
}
