function downloadPdf(type) {
    let { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let pageWidth = doc.internal.pageSize.getWidth() - 20; // 10-unit margins on each side
    let pageHeight = doc.internal.pageSize.getHeight() - 20; // Leave room at bottom
    let yPosition = 20; // Starting y-coordinate
    const lineHeight = 7; // Consistent line spacing

    // Helper function to add text with proper indentation and handle page overflow
    function addTextWithIndent(text, indentLevel, xBase) {
        // Sanitize special characters
        text = text
            .replace(/├──/g, "+--")
            .replace(/└──/g, "`--")
            .replace(/│/g, "|")
            .replace(/```/g, "")
            .replace(/[^\x00-\x7F]/g, "");

        let indent = indentLevel * 5; // 5 units per indent level
        let lines = doc.splitTextToSize(text, pageWidth - indent);

        lines.forEach(line => {
            // Check if we need a new page
            if (yPosition + lineHeight > pageHeight) {
                doc.addPage();
                yPosition = 20; // Reset yPosition for new page
            }
            doc.text(line, xBase + indent, yPosition);
            yPosition += lineHeight;
        });
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
                yPosition += lineHeight; // Extra spacing for empty lines
                return;
            }
            if (line.match(/^\s*\+--/)) addTextWithIndent(line.replace("+--", "+--"), 1, 10);
            else if (line.match(/^\s*\|.*`--/)) addTextWithIndent(line.replace("|   `--", "| `--"), 2, 10);
            else if (line.match(/^\s*\|.*\+--/)) addTextWithIndent(line.replace("|   +--", "| +--"), 2, 10);
            else if (trimmedLine.match(/^\d+\./)) addTextWithIndent(trimmedLine, 0, 10); // Numbered list
            else if (trimmedLine.startsWith("-")) addTextWithIndent(trimmedLine, 1, 10); // Bullet point
            else addTextWithIndent(trimmedLine, 0, 10); // Regular text
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
                yPosition += lineHeight;
                return;
            }
            if (trimmedLine.match(/^\d+\./)) addTextWithIndent(trimmedLine, 0, 10);
            else if (trimmedLine.startsWith("-")) addTextWithIndent(trimmedLine, 1, 10);
            else addTextWithIndent(trimmedLine, 0, 10);
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
                yPosition += lineHeight; // Extra spacing for empty lines
                return;
            }
            if (trimmedLine.match(/^\d+\./)) {
                addTextWithIndent(trimmedLine, 0, 10); // Numbered list (e.g., "1. Content Type")
            } else if (trimmedLine.startsWith("-")) {
                addTextWithIndent(trimmedLine, 1, 10); // Bullet point under numbered list
            } else {
                addTextWithIndent(trimmedLine, 0, 10); // Regular text
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
                yPosition += lineHeight;
                return;
            }
            if (line.match(/^\s*\+--/)) addTextWithIndent(line.replace("+--", "+--"), 1, 10);
            else if (line.match(/^\s*\|.*`--/)) addTextWithIndent(line.replace("|   `--", "| `--"), 2, 10);
            else if (line.match(/^\s*\|.*\+--/)) addTextWithIndent(line.replace("|   +--", "| +--"), 2, 10);
            else if (trimmedLine.match(/^\d+\./)) addTextWithIndent(trimmedLine, 0, 10);
            else if (trimmedLine.startsWith("-")) addTextWithIndent(trimmedLine, 1, 10);
            else addTextWithIndent(trimmedLine, 0, 10);
        });
        doc.save("Architecture_Discovery_Result.pdf");
    }
}

// Rest of the code (analyzeRepo, analyzeImage, analyzeDiscover, analyzeDiagram, showPage) remains unchanged
