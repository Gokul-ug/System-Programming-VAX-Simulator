// common.js

// Logs
function logMessage(panelId, msg) {
    const panel = document.getElementById(panelId);
    panel.textContent += msg + "\n";
    panel.scrollTop = panel.scrollHeight;
}

// Clear panels
function clearPanel(panelId) {
    document.getElementById(panelId).textContent = "";
}

// Update memory map
function updateMemory(memoryMapId, memoryObj) {
    const panel = document.getElementById(memoryMapId);
    panel.textContent = "";
    for (const addr in memoryObj) {
        panel.textContent += `${addr} : ${memoryObj[addr]}\n`;
    }
}

// Update symbol table
function updateSymbols(symbolTableId, symbols) {
    const panel = document.getElementById(symbolTableId);
    panel.textContent = "";
    for (const sym in symbols) {
        panel.textContent += `${sym} : ${symbols[sym]}\n`;
    }
}

// Highlight current step
function highlightLine(preId, lineIndex) {
    const pre = document.getElementById(preId);
    const lines = pre.textContent.split("\n");
    for (let i = 0; i < lines.length; i++) {
        if (i === lineIndex) lines[i] = "➡ " + lines[i];
        else lines[i] = lines[i].replace(/^➡ /, "");
    }
    pre.textContent = lines.join("\n");
}
