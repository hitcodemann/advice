function analyzeRepo() {
    console.log("analyzeRepo clicked");
    let githubUrl = document.getElementById("githubUrl").value;
    let analysisQuery = document.getElementById("analysisQuery").value;

    if (!githubUrl || !analysisQuery) {
        alert("Please enter both GitHub URL and an analysis request!");
        return;
    }

    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            type: "github",
            githubUrl: githubUrl, 
            analysisQuery: analysisQuery 
        }) 
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        let resultText = data.analysis || "No result returned.";
        document.getElementById("analysisResult").innerHTML = `<pre>${resultText}</pre>`;
        document.getElementById("downloadGithubPdf").style.display = "block"; // Show download button
    })
    .catch(error => {
        console.error("Error fetching analysis:", error);
        document.getElementById("analysisResult").innerText = "Error fetching analysis: " + error.message;
    });
}

function analyzeImage() {
    console.log("analyzeImage clicked");
    let imageUpload = document.getElementById("imageUpload").files[0];
    let imageAnalysisQuery = document.getElementById("imageAnalysisQuery").value;

    if (!imageUpload) {
        alert("Please upload an image!");
        return;
    }

    if (!imageAnalysisQuery) {
        alert("Please enter an analysis prompt!");
        return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(imageUpload);
    
    reader.onload = function () {
        let base64String = reader.result.split(",")[1];
        let filename = imageUpload.name;

        console.log("Sending image:", filename, "Base64 length:", base64String.length);

        fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                type: "imageUpload",
                filename: filename,
                image: base64String,
                analysisQuery: imageAnalysisQuery  
            }) 
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            let resultText = data.imageAnalysis || "No analysis result returned.";
            document.getElementById("imageAnalysisResult").innerHTML = `<pre>${resultText}</pre>`;
            document.getElementById("downloadImagePdf").style.display = "block"; // Show download button
        })
        .catch(error => {
            console.error("Error fetching image analysis:", error);
            document.getElementById("imageAnalysisResult").innerText = "Error fetching image analysis: " + error.message;
        });
    };

    reader.onerror = function (error) {
        console.error("Error converting image:", error);
        alert("Failed to process image. Try again.");
    };
}

function downloadPdf(type) {
    let { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let pageWidth = doc.internal.pageSize.getWidth() - 20; // 10-unit margins on each side
    let yPosition = 20; // Starting y-coordinate

    // Helper function to add text with proper indentation
    function addTextWithIndent(text, indentLevel, xBase) {
        let indent = indentLevel * 5; // 5 units per indent level
        let lines = doc.splitTextToSize(text, pageWidth - indent);
        doc.text(lines, xBase + indent, yPosition);
        yPosition += lines.length * 7; // Line spacing
    }

    if (type === "github") {
        let resultElement = document.getElementById("analysisResult").querySelector("pre");
        let resultText = resultElement ? resultElement.innerText : "No result available.";
        doc.text("GitHub Repository Analysis Result", 10, 10);

        // Split into lines and process each line
        let lines = resultText.split("\n");
        lines.forEach(line => {
            let trimmedLine = line.trim();
            if (!trimmedLine) {
                yPosition += 7; // Extra spacing for empty lines
                return;
            }

            if (trimmedLine.startsWith("```")) {
                // Skip code block markers (handled by indentation)
                return;
            } else if (line.match(/^\s*├──/)) {
                addTextWithIndent(line.replace("├──", "├─"), 1, 10); // Level 1 indent
            } else if (line.match(/^\s*│\s*└──/)) {
                addTextWithIndent(line.replace("│   └──", "│ └─"), 2, 10); // Level 2 indent
            } else if (line.match(/^\s*│\s*├──/)) {
                addTextWithIndent(line.replace("│   ├──", "│ ├─"), 2, 10); // Level 2 indent
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

        // Split into lines and process each line
        let lines = resultText.split("\n");
        lines.forEach(line => {
            let trimmedLine = line.trim();
            if (!trimmedLine) {
                yPosition += 7; // Extra spacing for empty lines
                return;
            }

            if (trimmedLine.startsWith("-") || trimmedLine.match(/^\d+\./)) {
                addTextWithIndent(`• ${trimmedLine.substring(trimmedLine.indexOf(" ") + 1)}`, 0, 10); // Bullet points
            } else {
                addTextWithIndent(trimmedLine, 0, 10); // No indent for regular text
            }
        });
        doc.save("Image_Analysis_Result.pdf");
    }
}

function showPage(pageId) {
    console.log("showPage called with:", pageId);
    // Hide all pages
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("appPage").style.display = "none";
    document.getElementById("githubAnalysisPage").style.display = "none";
    document.getElementById("investmentPage").style.display = "none";
    document.getElementById("imageAnalysisPage").style.display = "none";

    // Show the selected page
    document.getElementById(pageId).style.display = "block";
}

// Ensure landing page is visible on load
document.addEventListener("DOMContentLoaded", function() {
    showPage("landingPage");
});
