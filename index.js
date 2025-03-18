// Agent chat state
let agentChatHistory = [];
let lastRepoAnalyzed = null;

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
            console.log("Fetch response received:", response.status);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Fetch data received:", data);
            let resultText = data.imageAnalysis || "No analysis result returned.";
            document.getElementById("imageAnalysisResult").innerHTML = `<pre>${resultText}</pre>`;
            document.getElementById("downloadImagePdf").style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching image analysis:", error);
            document.getElementById("imageAnalysisResult").innerText = "Error fetching image analysis: " + error.message;
        })
        .finally(() => {
            console.log("Fetch completed, hiding spinner");
            loadingSpinner.style.display = "none";
        });
    };

    reader.onerror = function (error) {
        console.error("Error converting image:", error);
        alert("Failed to process image. Try again.");
        loadingSpinner.style.display = "none";
    };
}

function sendAgentMessage(suggestion = null) {
    console.log("sendAgentMessage called with suggestion:", suggestion);
    const queryInput = document.getElementById("agentQuery");
    const query = suggestion || queryInput.value.trim();
    const loadingSpinner = document.getElementById("agentLoading");
    const messagesContainer = document.getElementById("agentMessages");

    if (!query) {
        alert("Please enter a query!");
        return;
    }

    // Add user message to chat history and display it
    agentChatHistory.push({ role: "user", content: query });
    displayAgentMessages();

    // Clear input and suggestions, show typing indicator
    if (!suggestion) queryInput.value = "";
    clearSuggestions();
    loadingSpinner.style.display = "block";
    agentChatHistory.push({ role: "agent", content: "Bot is typing...", isTyping: true });
    displayAgentMessages();

    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            type: "agent",
            query: query
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        // Remove typing indicator
        agentChatHistory = agentChatHistory.filter(msg => !msg.isTyping);
        const resultText = data.agentResponse || "No response returned.";
        agentChatHistory.push({ role: "agent", content: resultText });
        displayAgentMessages();
        updateSuggestions(query, resultText);
    })
    .catch(error => {
        console.error("Error fetching agent response:", error);
        agentChatHistory = agentChatHistory.filter(msg => !msg.isTyping);
        agentChatHistory.push({ role: "agent", content: "Error fetching response: " + error.message });
        displayAgentMessages();
    })
    .finally(() => {
        loadingSpinner.style.display = "none";
    });
}

function displayAgentMessages() {
    const messagesContainer = document.getElementById("agentMessages");
    messagesContainer.innerHTML = ""; // Clear existing messages

    agentChatHistory.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${message.role} ${message.isTyping ? 'typing' : ''}`;
        messageDiv.innerHTML = `<pre>${message.content}</pre>`;
        messagesContainer.appendChild(messageDiv);
    });

    // Scroll to the bottom of the chat
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateSuggestions(query, response) {
    const suggestionsContainer = document.getElementById("agentSuggestions");
    suggestionsContainer.innerHTML = "";

    // Simple logic to determine dynamic suggestions
    if (query.toLowerCase().includes("hi") || query.toLowerCase().includes("hello")) {
        addSuggestion("Analyze a GitHub repository", "Can you analyze a GitHub repository for me?");
        addSuggestion("Tell me about AWS Lambda", "What is AWS Lambda and how does it work?");
    } else if (query.toLowerCase().includes("analyze") && query.includes("github.com")) {
        lastRepoAnalyzed = query.match(/github\.com\/[^\s]+/)?.[0];
        addSuggestion("Cost Estimation", `What is the exact cost estimation for ${lastRepoAnalyzed}?`);
        addSuggestion("Code Quality", `How is the code quality of ${lastRepoAnalyzed}?`);
        addSuggestion("Security Analysis", `Are there any security issues in ${lastRepoAnalyzed}?`);
    } else if (response.toLowerCase().includes("cost")) {
        addSuggestion("More Details", "Can you provide more details on the cost breakdown?");
        addSuggestion("Effort Estimation", "How much effort would it take to implement this?");
    }

    function addSuggestion(label, query) {
        const button = document.createElement("button");
        button.className = "suggestion-btn";
        button.innerText = label;
        button.onclick = () => sendAgentMessage(query);
        suggestionsContainer.appendChild(button);
    }
}

function clearSuggestions() {
    const suggestionsContainer = document.getElementById("agentSuggestions");
    suggestionsContainer.innerHTML = "";
}

function resetAgentChat() {
    agentChatHistory = [];
    lastRepoAnalyzed = null;
    const messagesContainer = document.getElementById("agentMessages");
    const suggestionsContainer = document.getElementById("agentSuggestions");
    if (messagesContainer) messagesContainer.innerHTML = "";
    if (suggestionsContainer) suggestionsContainer.innerHTML = "";
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

    console.log("Disabling buttons and showing spinner");
    analyzeButtons.forEach(button => {
        button.disabled = true;
        button.style.opacity = "0.5";
    });
    loadingSpinner.style.display = "block";
    document.getElementById("discoverResult").innerHTML = "";

    let analysisQuery;
    switch (category) {
        case "codeQuality":
            analysisQuery = `You are analyzing a GitHub repository for Travelers Corporation, a leading insurance company. Please explain the current code quality and maintainability of the repository at ${githubUrl}. Focus on aspects critical to Travelers, such as scalability for handling large claims datasets, readability for compliance audits, and modularity for integrating with insurance underwriting systems. Suggest key improvements tailored to Travelers' needs in the insurance domain.`;
            break;
        case "costEffort":
            analysisQuery = `Analyze the GitHub repository at ${githubUrl} for Travelers Corporation, an insurance company. Estimate the cost and effort required to refactor the application, considering Travelers' priorities: optimizing claims processing workflows, ensuring regulatory compliance (e.g., HIPAA, GDPR), and integrating with existing Travelers systems like policy management or actuarial models. Provide a breakdown in terms of developer hours and potential cost savings for Travelers.`;
            break;
        case "security":
            analysisQuery = `Analyze the GitHub repository at ${githubUrl} for Travelers Corporation, an insurance provider. Identify potential security and vulnerability risks relevant to Travelers, such as exposed PII (Personally Identifiable Information) in claims data, outdated libraries affecting policy processing, or unsafe practices that could violate insurance regulations. Include file names, snippets, and mitigation advice tailored to Travelers' need for data privacy and regulatory compliance.`;
            break;
        case "technicalDebt":
            analysisQuery = `Analyze the GitHub repository at ${githubUrl} for Travelers Corporation. Travelers wants to migrate this application to AWS Lambda to enhance scalability for real-time claims processing and reduce operational costs. Assess the technical debt and estimate the time and effort (in weeks and developer hours) to refactor the application for AWS Lambda, considering Travelers' requirements for high availability, integration with insurance APIs, and compliance with industry standards.`;
            break;
        default:
            alert("Invalid category!");
            loadingSpinner.style.display = "none";
            analyzeButtons.forEach(button => {
                button.disabled = false;
                button.style.opacity = "1";
            });
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
        console.log("Fetch response received for discover:", response.status);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("Fetch data received for discover:", data);
        let resultText = data.analysis || "No result returned.";
        document.getElementById("discoverResult").innerHTML = `<pre>${resultText}</pre>`;
        document.getElementById("downloadDiscoverPdf").style.display = "block";
    })
    .catch(error => {
        console.error("Error fetching analysis for discover:", error);
        document.getElementById("discoverResult").innerText = "Error fetching analysis: " + error.message;
    })
    .finally(() => {
        console.log("Fetch completed for discover, hiding spinner and re-enabling buttons");
        loadingSpinner.style.display = "none";
        analyzeButtons.forEach(button => {
            button.disabled = false;
            button.style.opacity = "1";
        });
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

    console.log("Disabling discover button and showing spinner");
    discoverButton.disabled = true;
    discoverButton.style.opacity = "0.5";
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
            console.log("Fetch response received for diagram:", response.status);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Fetch data received for diagram:", data);
            let resultText = data.imageAnalysis || "No analysis result returned.";
            document.getElementById("diagramResult").innerHTML = `<pre>${resultText}</pre>`;
            document.getElementById("downloadDiagramPdf").style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching diagram analysis:", error);
            document.getElementById("diagramResult").innerText = "Error fetching diagram analysis: " + error.message;
        })
        .finally(() => {
            console.log("Fetch completed for diagram, hiding spinner and re-enabling button");
            loadingSpinner.style.display = "none";
            discoverButton.disabled = false;
            discoverButton.style.opacity = "1";
        });
    };

    reader.onerror = function (error) {
        console.error("Error converting diagram:", error);
        alert("Failed to process diagram. Try again.");
        loadingSpinner.style.display = "none";
        discoverButton.disabled = false;
        discoverButton.style.opacity = "1";
    };
}

function downloadPdf(type) {
    let { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let pageWidth = doc.internal.pageSize.getWidth() - 20;
    let pageHeight = doc.internal.pageSize.getHeight() - 20;
    let yPosition = 20;
    const lineHeight = 7;

    function addTextWithIndent(text, indentLevel, xBase) {
        text = text
            .replace(/├──/g, "+--")
            .replace(/└──/g, "`--")
            .replace(/│/g, "|")
            .replace(/```/g, "")
            .replace(/[^\x00-\x7F]/g, "");

        let indent = indentLevel * 5;
        let lines = doc.splitTextToSize(text, pageWidth - indent);

        lines.forEach(line => {
            if (yPosition + lineHeight > pageHeight) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, xBase + indent, yPosition);
            yPosition += lineHeight;
        });
    }

    doc.setFont("Courier");
    doc.setFontSize(10);

    if (type === "image") {
        let resultElement = document.getElementById("imageAnalysisResult").querySelector("pre");
        let resultText = resultElement ? resultElement.innerText : "No result available.";
        doc.text("Image Analysis Result", 10, 10);
        yPosition = 20;

        let lines = resultText.split("\n");
        lines.forEach(line => {
            let trimmedLine = line.trim();
            if (!trimmedLine) { yPosition += lineHeight; return; }
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
            if (!trimmedLine) { yPosition += lineHeight; return; }
            if (trimmedLine.match(/^\d+\./)) addTextWithIndent(trimmedLine, 0, 10);
            else if (trimmedLine.startsWith("-")) addTextWithIndent(trimmedLine, 1, 10);
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
            if (!trimmedLine) { yPosition += lineHeight; return; }
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

function showPage(pageId) {
    console.log("showPage called with:", pageId);
    if (pageId === "landingPage" && document.getElementById("agentPage").style.display === "block") {
        resetAgentChat();
    }
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("chaosMeshPage").style.display = "none";
    document.getElementById("appPage").style.display = "none";
    document.getElementById("imageAnalysisPage").style.display = "none";
    document.getElementById("discoveryWizardPage").style.display = "none";
    document.getElementById("discoverPage").style.display = "none";
    document.getElementById("migratePage").style.display = "none";
    document.getElementById("agentPage").style.display = "none";

    document.getElementById(pageId).style.display = "block";
}

document.addEventListener("DOMContentLoaded", function() {
    showPage("landingPage");
    const agentQueryInput = document.getElementById("agentQuery");
    if (agentQueryInput) {
        agentQueryInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                sendAgentMessage();
            }
        });
    }
});
