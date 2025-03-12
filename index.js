function analyzeRepo() {
    console.log("analyzeRepo clicked");
    let githubUrl = document.getElementById("githubUrl").value;
    let analysisQuery = document.getElementById("analysisQuery").value;
    let loadingSpinner = document.getElementById("githubLoading");

    if (!githubUrl || !analysisQuery) {
        alert("Please enter both GitHub URL and an analysis request!");
        return;
    }

    loadingSpinner.style.display = "block";
    document.getElementById("analysisResult").innerHTML = "";

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
        document.getElementById("downloadGithubPdf").style.display = "block";
    })
    .catch(error => {
        console.error("Error fetching analysis:", error);
        document.getElementById("analysisResult").innerText = "Error fetching analysis: " + error.message;
    })
    .finally(() => {
        loadingSpinner.style.display = "none"; // Ensure spinner hides regardless of success or failure
    });
}

function analyzeImage() {
    console.log("analyzeImage clicked");
    let imageUpload = document.getElementById("imageUpload").files[0];
    let imageAnalysisQuery = document.getElementById("imageAnalysisQuery").value;
    let loadingSpinner = document.getElementById("imageLoading");

    if (!imageUpload) {
        alert("Please upload an image!");
        return;
    }

    if (!imageAnalysisQuery) {
        alert("Please enter an analysis prompt!");
        return;
    }

    loadingSpinner.style.display = "block";
    document.getElementById("imageAnalysisResult").innerHTML = "";

    let reader = new FileReader();
    reader.readAsDataURL(imageUpload);
    
    reader.onload = function () {
        let base64String = reader.result.split(",")[1];
        let filename = imageUpload.name;

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
            document.getElementById("downloadImagePdf").style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching image analysis:", error);
            document.getElementById("imageAnalysisResult").innerText = "Error fetching image analysis: " + error.message;
        })
        .finally(() => {
            loadingSpinner.style.display = "none"; // Ensure spinner hides
        });
    };

    reader.onerror = function (error) {
        console.error("Error converting image:", error);
        alert("Failed to process image. Try again.");
        loadingSpinner.style.display = "none";
    };
}

function analyzeDiscover(category) {
    console.log("analyzeDiscover clicked for:", category);
    let githubUrl = document.getElementById("discoverGithubUrl").value;
    let loadingSpinner = document.getElementById("discoverLoading");
    let analyzeButtons = document.querySelectorAll("#discoverPage .primary-btn");

    if (!githubUrl) {
        alert("Please enter a GitHub URL!");
        return;
    }

    // Disable buttons during fetch to prevent multiple clicks
    analyzeButtons.forEach(button => button.disabled = true);
    loadingSpinner.style.display = "block";
    document.getElementById("discoverResult").innerHTML = "";

    let analysisQuery;
    switch (category) {
        case "codeQuality":
            analysisQuery = "Please explain the current code quality and maintainability about the GitHub repo. Suggest key points on how it could be better in terms of code quality.";
            break;
        case "costEffort":
            analysisQuery = "Analyze the GitHub repository and estimate the cost and effort required to refactor the application.";
            break;
        case "security":
            analysisQuery = "Analyze the repo and identify potential security and vulnerability risks, such as exposed secrets, outdated libraries, or unsafe practices. Include file names and snippets with mitigation advice.";
            break;
        case "technicalDebt":
            analysisQuery = "Analyze the GitHub repository URL. I want to move the application to AWS Lambda. How much time and effort will it take?";
            break;
        default:
            alert("Invalid category!");
            loadingSpinner.style.display = "none";
            analyzeButtons.forEach(button => button.disabled = false);
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
        document.getElementById("discoverResult").innerHTML = `<pre>${resultText}</pre>`;
        document.getElementById("downloadDiscoverPdf").style.display = "block";
    })
    .catch(error => {
        console.error("Error fetching analysis:", error);
        document.getElementById("discoverResult").innerText = "Error fetching analysis: " + error.message;
    })
    .finally(() => {
        loadingSpinner.style.display = "none"; // Hide spinner
        analyzeButtons.forEach(button => button.disabled = false); // Re-enable buttons
    });
}

function analyzeDiagram() {
    console.log("analyzeDiagram clicked");
    let diagramUpload = document.getElementById("diagramUpload").files[0];
    let loadingSpinner = document.getElementById("diagramLoading");
    let discoverButton = document.querySelector("#migratePage .primary-btn");

    if (!diagramUpload) {
        alert("Please upload a diagram!");
        return;
    }

    discoverButton.disabled = true; // Disable button during fetch
    loadingSpinner.style.display = "block";
    document.getElementById("diagramResult").innerHTML = "";

    let reader = new FileReader();
    reader.readAsDataURL(diagramUpload);

    reader.onload = function () {
        let base64String = reader.result.split(",")[1];
        let filename = diagramUpload.name;

        fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "imageUpload",
                filename: filename,
                image: base64String,
                analysisQuery: "Consider yourself as a software architect and answer accordingly. I have a 3-tier application hosted on AWS. Kindly analyze the attached diagram. I got a task to convert this application to Lambda. Can you give me the architectural diagram of this app when using Lambda instead of EC2, adhering to all security best practices? I want the answer in this format: Architectural diagram, Components with short explanation, Challenges we may face."
            })
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            let resultText = data.imageAnalysis || "No analysis result returned.";
            document.getElementById("diagramResult").innerHTML = `<pre>${resultText}</pre>`;
            document.getElementById("downloadDiagramPdf").style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching diagram analysis:", error);
            document.getElementById("diagramResult").innerText = "Error fetching diagram analysis: " + error.message;
        })
        .finally(() => {
            loadingSpinner.style.display = "none"; // Hide spinner
            discoverButton.disabled = false; // Re-enable button
        });
    };

    reader.onerror = function (error) {
        console.error("Error converting diagram:", error);
        alert("Failed to process diagram. Try again.");
        loadingSpinner.style.display = "none";
        discoverButton.disabled = false;
    };
}

function downloadPdf(type) {
    let { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let pageWidth = doc.internal.pageSize.getWidth() - 20;
    let yPosition = 20;

    function addTextWithIndent(text, indentLevel, xBase) {
        text = text
            .replace(/├──/g, "+--")
            .replace(/└──/g, "`--")
            .replace(/│/g, "|")
            .replace(/```/g, "")
            .replace(/[^\x00-\x7F]/g, "");

        let indent = indentLevel * 5;
        let lines = doc.splitTextToSize(text, pageWidth - indent);
        doc.text(lines, xBase + indent, yPosition);
        yPosition += lines.length * 7;
    }

    doc.setFont("Courier");
    doc.setFontSize(10);

    if (type === "github") {
        let resultElement = document.getElementById("analysisResult").querySelector("pre");
        let resultText = resultElement ? resultElement.innerText : "No result available.";
        doc.text("GitHub Repository Analysis Result", 10, 10);
        yPosition = 20;

        let lines = resultText.split("\n");
        lines.forEach(line => {
            let trimmedLine = line.trim();
            if (!trimmedLine) { yPosition += 7; return; }
            if (line.match(/^\s*\+--/)) addTextWithIndent(line.replace("+--", "+--"), 1, 10);
            else if (line.match(/^\s*\|.*`--/)) addTextWithIndent(line.replace("|   `--", "| `--"), 2, 10);
            else if (line.match(/^\s*\|.*\+--/)) addTextWithIndent(line.replace("|   +--", "| +--"), 2, 10);
            else if (trimmedLine.startsWith("-") || trimmedLine.match(/^\d+\./)) addTextWithIndent(`• ${trimmedLine.substring(trimmedLine.indexOf(" ") + 1)}`, 0, 10);
            else addTextWithIndent(trimmedLine, 0, 10);
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
            if (!trimmedLine) { yPosition += 7; return; }
            if (trimmedLine.startsWith("-") || trimmedLine.match(/^\d+\./)) addTextWithIndent(`• ${trimmedLine.substring(trimmedLine.indexOf(" ") + 1)}`, 0, 10);
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
            if (!trimmedLine) { yPosition += 7; return; }
            if (trimmedLine.startsWith("-") || trimmedLine.match(/^\d+\./)) addTextWithIndent(`• ${trimmedLine.substring(trimmedLine.indexOf(" ") + 1)}`, 0, 10);
            else addTextWithIndent(trimmedLine, 0, 10);
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
            if (!trimmedLine) { yPosition += 7; return; }
            if (line.match(/^\s*\+--/)) addTextWithIndent(line.replace("+--", "+--"), 1, 10);
            else if (line.match(/^\s*\|.*`--/)) addTextWithIndent(line.replace("|   `--", "| `--"), 2, 10);
            else if (line.match(/^\s*\|.*\+--/)) addTextWithIndent(line.replace("|   +--", "| +--"), 2, 10);
            else if (trimmedLine.startsWith("-") || trimmedLine.match(/^\d+\./)) addTextWithIndent(`• ${trimmedLine.substring(trimmedLine.indexOf(" ") + 1)}`, 0, 10);
            else addTextWithIndent(trimmedLine, 0, 10);
        });
        doc.save("Architecture_Discovery_Result.pdf");
    }
}

function showPage(pageId) {
    console.log("showPage called with:", pageId);
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("chaosMeshPage").style.display = "none";
    document.getElementById("appPage").style.display = "none";
    document.getElementById("githubAnalysisPage").style.display = "none";
    document.getElementById("investmentPage").style.display = "none";
    document.getElementById("imageAnalysisPage").style.display = "none";
    document.getElementById("discoveryWizardPage").style.display = "none";
    document.getElementById("discoverPage").style.display = "none";
    document.getElementById("migratePage").style.display = "none";

    document.getElementById(pageId).style.display = "block";
}

document.addEventListener("DOMContentLoaded", function() {
    showPage("landingPage");
});
