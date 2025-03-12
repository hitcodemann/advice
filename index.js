function downloadPdf(type) {
    let { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let pageWidth = doc.internal.pageSize.getWidth() - 20; // 10-unit margins on each side
    let yPosition = 20; // Starting y-coordinate

    // Helper function to add text with proper indentation and sanitize special characters
    function addTextWithIndent(text, indentLevel, xBase) {
        // Replace special Unicode characters with simpler ASCII equivalents
        text = text
            .replace(/├──/g, "+--") // Replace tree-like characters
            .replace(/└──/g, "`--")
            .replace(/│/g, "|")
            .replace(/```/g, "") // Remove code block markers
            .replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII characters if necessary

        let indent = indentLevel * 5; // 5 units per indent level
        let lines = doc.splitTextToSize(text, pageWidth - indent);
        doc.text(lines, xBase + indent, yPosition);
        yPosition += lines.length * 7; // Line spacing
    }

    // Set font for better readability
    doc.setFont("Courier"); // Monospace font to mimic <pre> tag
    doc.setFontSize(10);

    if (type === "github") {
        let resultElement = document.getElementById("analysisResult").querySelector("pre");
        let resultText = resultElement ? resultElement.innerText : "No result available.";
        doc.text("GitHub Repository Analysis Result", 10, 10);
        yPosition = 20;

        let lines = resultText.split("\n");
        lines.forEach(line => {
            let trimmedLine = line.trim();
            if (!trimmedLine) {
                yPosition += 7; // Extra spacing for empty lines
                return;
            }
            if (line.match(/^\s*\+--/)) {
                addTextWithIndent(line.replace("+--", "+--"), 1, 10); // Level 1 indent
            } else if (line.match(/^\s*\|.*`--/)) {
                addTextWithIndent(line.replace("|   `--", "| `--"), 2, 10); // Level 2 indent
            } else if (line.match(/^\s*\|.*\+--/)) {
                addTextWithIndent(line.replace("|   +--", "| +--"), 2, 10); // Level 2 indent
            } else if (trimmedLine.startsWith("-") || trimmedLine.match(/^\d+\./)) {
                addTextWithIndent(`• ${trimmedLine.substring(trimmedLine.indexOf(" ") + 1)}`, 0, 10); // Bullet points
            } else {
                addTextWithIndent(trimmedLine, 0, 10); // No indent for regular text
            }
        });
        doc.save("GitHub_Analysis_Result.pdf");
    } else if (type === "image") {
        let resultElement = document.getElementById("imageAnalysisResult").querySelector("pre");
        let resultText = resultElement ? resultElement.innerText : "No result available.";
        doc.text("Image Analysis Result", 10, 10);
        yPosition = 20;

        let lines = resultText.split("\n");
        lines.forEach(line => {
            let trimmedLine = line.trim();
            if (!trimmedLine) {
                yPosition += 7;
                return;
            }
            if (trimmedLine.startsWith("-") || trimmedLine.match(/^\d+\./)) {
                addTextWithIndent(`• ${trimmedLine.substring(trimmedLine.indexOf(" ") + 1)}`, 0, 10);
            } else {
                addTextWithIndent(trimmedLine, 0, 10);
            }
        });
        doc.save("Image_Analysis_Result.pdf");
    } else if (type === "discover") {
        let resultElement = document.getElementById("discoverResult").querySelector("pre");
        let resultText = resultElement ? resultElement.innerText : "No result available.";
        doc.text("Discover Analysis Result", 10, 10);
        yPosition = 20;

        let lines = resultText.split("\n");
        lines.forEach(line => {
            let trimmedLine = line.trim();
            if (!trimmedLine) {
                yPosition += 7;
                return;
            }
            if (trimmedLine.startsWith("-") || trimmedLine.match(/^\d+\./)) {
                addTextWithIndent(`• ${trimmedLine.substring(trimmedLine.indexOf(" ") + 1)}`, 0, 10);
            } else {
                addTextWithIndent(trimmedLine, 0, 10);
            }
        });
        doc.save("Discover_Analysis_Result.pdf");
    } else if (type === "diagram") {
        let resultElement = document.getElementById("diagramResult").querySelector("pre");
        let resultText = resultElement ? resultElement.innerText : "No result available.";
        doc.text("Architecture Discovery Result", 10, 10);
        yPosition = 20;

        let lines = resultText.split("\n");
        lines.forEach(line => {
            let trimmedLine = line.trim();
            if (!trimmedLine) {
                yPosition += 7;
                return;
            }
            if (line.match(/^\s*\+--/)) {
                addTextWithIndent(line.replace("+--", "+--"), 1, 10); // Level 1 indent
            } else if (line.match(/^\s*\|.*`--/)) {
                addTextWithIndent(line.replace("|   `--", "| `--"), 2, 10); // Level 2 indent
            } else if (line.match(/^\s*\|.*\+--/)) {
                addTextWithIndent(line.replace("|   +--", "| +--"), 2, 10); // Level 2 indent
            } else if (trimmedLine.startsWith("-") || trimmedLine.match(/^\d+\./)) {
                addTextWithIndent(`• ${trimmedLine.substring(trimmedLine.indexOf(" ") + 1)}`, 0, 10);
            } else {
                addTextWithIndent(trimmedLine, 0, 10);
            }
        });
        doc.save("Architecture_Discovery_Result.pdf");
    }
}

// Rest of the code (analyzeRepo, analyzeImage, analyzeDiscover, analyzeDiagram, showPage) remains unchanged
