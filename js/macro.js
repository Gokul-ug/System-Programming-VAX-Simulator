// Refined Macro Processor Logic
let macroTable = {};       // Stores macro definitions
let memoryMap = {};        // Memory lines after expansion
let symbolTable = {};      // For variables or labels (optional)
let expandedCode = [];     // Full expanded code lines
let currentStep = 0;       // Step counter
let addresses = [];        // Address list for highlighting

// Utility: Clear panel content
function clearPanel(id) {
    document.getElementById(id).textContent = '';
}

// Utility: Log message
function logMessage(id, msg) {
    const panel = document.getElementById(id);
    panel.textContent += msg + "\n";
    panel.scrollTop = panel.scrollHeight;
}

// Utility: Highlight current line in a panel
function highlightLine(panelId, step) {
    const panel = document.getElementById(panelId);
    const lines = panel.textContent.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (i === step) lines[i] = `▶ ${lines[i]}`;
        else lines[i] = lines[i].replace(/^▶ /, '');
    }
    panel.textContent = lines.join("\n");
}

// Run full macro expansion
function runMacro() {
    const code = document.getElementById("macroInput").value.split("\n").map(l=>l.trim()).filter(l=>l!=="");
    macroTable = {};
    memoryMap = {};
    symbolTable = {};
    expandedCode = [];
    addresses = [];
    currentStep = 0;

    clearPanel("macroTable");
    clearPanel("symbolTable");
    clearPanel("memoryMap");
    clearPanel("expandedCode");
    clearPanel("logs");

    let address = 1000;
    let inMacro = false;
    let currentMacro = "";

    for (let line of code) {
        if (line.startsWith("MACRO")) {
            inMacro = true;
            currentMacro = line.split(" ")[1];
            macroTable[currentMacro] = [];
            logMessage("logs", `Defining macro: ${currentMacro}`);
            continue;
        }

        if (line === "MEND") {
            inMacro = false;
            currentMacro = "";
            continue;
        }

        if (inMacro) {
            macroTable[currentMacro].push(line);
            continue;
        }

        // Expand macro call
        const cmd = line.split(" ")[0];
        if (macroTable[cmd]) {
            logMessage("logs", `Expanding macro: ${cmd}`);
            for (let mLine of macroTable[cmd]) {
                memoryMap[address] = mLine;
                expandedCode.push(`${address} : ${mLine}`);
                addresses.push(address);
                address++;
            }
        } else {
            memoryMap[address] = line;
            expandedCode.push(`${address} : ${line}`);
            addresses.push(address);
            address++;
        }
    }

    // Display Macro Table
    const macroPanel = document.getElementById("macroTable");
    for (let m in macroTable) {
        macroPanel.textContent += `${m} : ${macroTable[m].join(", ")}\n`;
    }

    // Display Memory Map
    updateMemory();

    // Display Expanded Code
    document.getElementById("expandedCode").textContent = expandedCode.join("\n");

    // Display Symbol Table (if any)
    updateSymbols();

    logMessage("logs", "Macro expansion completed.");
}

// Step through the expanded code
function stepMacro() {
    if (currentStep >= expandedCode.length) {
        logMessage("logs", "Execution finished.");
        return;
    }
    highlightLine("expandedCode", currentStep);
    const addr = addresses[currentStep];
    logMessage("logs", `Executing: ${memoryMap[addr]} at address ${addr}`);
    currentStep++;
}

// Reset everything
function resetMacro() {
    document.getElementById("macroInput").value = "";
    clearPanel("macroTable");
    clearPanel("symbolTable");
    clearPanel("memoryMap");
    clearPanel("expandedCode");
    clearPanel("logs");

    macroTable = {};
    memoryMap = {};
    symbolTable = {};
    expandedCode = [];
    currentStep = 0;
    addresses = [];
}

// Update Memory Map display
function updateMemory() {
    let html = "";
    for (let addr in memoryMap) {
        html += `${addr} : ${memoryMap[addr]}\n`;
    }
    document.getElementById("memoryMap").textContent = html;
}

// Update Symbol Table display
function updateSymbols() {
    let html = "";
    for (let sym in symbolTable) {
        html += `${sym} : ${symbolTable[sym]}\n`;
    }
    document.getElementById("symbolTable").textContent = html;
}
