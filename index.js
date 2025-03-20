// Agent chat state
let agentChatHistory = [];
let lastRepoAnalyzed = null;

function sendAgentMessage(suggestion = null, displayText = null) {
    console.log("sendAgentMessage called with suggestion:", suggestion, "displayText:", displayText);
    const queryInput = document.getElementById("agentQuery");
    const query = suggestion || queryInput.value.trim();
    const loadingSpinner = document.getElementById("agentLoading");
    const messagesContainer = document.getElementById("agentMessages");

    if (!query) {
        alert("Please enter a query!");
        return;
    }

    const chatDisplayText = displayText || query;
    agentChatHistory.push({ role: "user", content: chatDisplayText });
    displayAgentMessages();

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
    messagesContainer.innerHTML = "";

    agentChatHistory.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${message.role} ${message.isTyping ? 'typing' : ''}`;
        messageDiv.innerHTML = `<pre>${message.content}</pre>`;
        messagesContainer.appendChild(messageDiv);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateSuggestions(query, response) {
    const suggestionsContainer = document.getElementById("agentSuggestions");
    suggestionsContainer.innerHTML = "";

    if (query.toLowerCase().includes("hi") || query.toLowerCase().includes("hello")) {
        addSuggestion("Analyze a GitHub repository", "Can you analyze a GitHub repository for me?", "Kindly tell me what information I should provide?");
    } else if (query.toLowerCase().includes("analyze") || query.includes("github.com")) {
        lastRepoAnalyzed = query.match(/github\.com\/[^\s]+/)?.[0];
        addSuggestion("Enterprise Guidelines", `Can you tell me the best practices that should be followed as per our enterprise guidelines?`, "Tell me about our enterprise guidelines");
        addSuggestion("Code Quality", `Analyze the repository at ${lastRepoAnalyzed} and evaluate code quality. Focus on readability, modularity, and standards adherence, providing examples with file names and improvement suggestions.`, "Analyzing code quality");
        addSuggestion("Security Analysis", `Analyze the GitHub repository at ${lastRepoAnalyzed} and identify potential security and vulnerability risks, such as exposed secrets, outdated libraries, or unsafe practices. Must adhere to OWASP standards. Include file names and snippets with mitigation advice.`, "Analyzing security");
        addSuggestion("Technical Debt", `Identify the technical debts in ${lastRepoAnalyzed}, such as shortcuts, outdated dependencies, or poorly structured code that could increase future maintenance costs. Provide specific examples with file names and code snippets, explaining why they represent technical debt.`, "Analyzing technical debt");
        addSuggestion("Code Refactoring", `Identify areas in ${lastRepoAnalyzed} where automation or refactoring could reduce development costs.`, "Analyzing code refactoring");
    } else if (query.toLowerCase().includes("effort")) {
        addSuggestion("More Details", "Can you provide more details on the github repository?", "More insights on the code repository!!");
        addSuggestion("JIRA", "Ask me about my scope of changes, any files that I am looking to modify as part of enhancement or is there a new module that requires development.", "Help me estimate my changes!!");
    }

    function addSuggestion(label, query, displayText) {
        const button = document.createElement("button");
        button.className = "suggestion-btn";
        button.innerText = label;
        button.onclick = () => sendAgentMessage(query, displayText);
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

function analyzeDiagram() {
    console.log("analyzeDiagram clicked");
    let diagramUpload = document.getElementById("diagramUpload").files[0];
    let githubUrl = document.getElementById("migrateGithubUrl").value;
    let currentCost = document.getElementById("currentCost").value;
    let migrationBudget = document.getElementById("migrationBudget").value;
    let timeFrame = document.getElementById("timeFrame").value;
    let currentCloud = document.getElementById("currentCloud").value;
    let futureState = document.getElementById("futureState").value;
    let loadingSpinner = document.getElementById("diagramLoading");
    let discoverButton = document.querySelector("#migratePage .primary-btn");

    if (!githubUrl || !currentCost || !migrationBudget || !timeFrame || !currentCloud || !futureState) {
        alert("Please fill in all fields!");
        return;
    }

    console.log("Disabling discover button and showing spinner");
    discoverButton.disabled = true;
    discoverButton.style.opacity = "0.5";
    loadingSpinner.style.display = "block";
    document.getElementById("diagramResult").innerHTML = "";

    if (!diagramUpload) {
        const combinedQuery = `
            You are a Solution Architect at a reputed insurance company. Your task is to analyze the given GitHub repository and accompanying architecture diagrams (HLD/LLD) to determine whether the application can be migrated to the target cloud platform within the specified budget and timeframe. Additionally, estimate costs based on the provided rate chart.

            Input Details:
            GitHub Repository URL: ${githubUrl}
            High-Level Design (HLD) Diagram: Not provided
            Low-Level Design (LLD) Diagram: Not provided
            Current Monthly Operating Cost: $${currentCost}
            Migration Budget: $${migrationBudget}
            Time Frame: ${timeFrame} months
            Current Cloud Platform: ${currentCloud}
            Target Cloud Platform: ${futureState}
            Cost Estimation Rate Chart:
            Business Analyst: $70/hour
            Manager: $60/hour
            Tech Lead: $50/hour
            Senior Developer: $45/hour
            Junior Developer: $20/hour
            DevOps Engineer: $35/hour
            Scrum Master: $25/hour
            QA Engineer: $30/hour

            Response Format:
            YES – Migration is feasible within the given budget and timeframe.
            NO – Migration is not possible under the current constraints.
            Justification (2 sentences max): Provide a brief explanation of why migration is or isn’t possible (e.g., budget shortfall, code complexity, dependencies, major refactoring required).

            Analysis Criteria:
            Repository Analysis:
            - Evaluate the complexity of the codebase in the GitHub repository.
            - Identify dependencies, infrastructure requirements, and refactoring efforts needed for migration.
            Architecture Review (HLD/LLD): (If provided)
            - Assess architectural feasibility for migration.
            - Identify gaps between the current and target cloud infrastructure.
            Budget & Timeframe Validation:
            - Estimate total effort hours required for migration.
            - Apply the rate chart to calculate total migration cost.
            - Compare the estimated cost with the provided budget.
            - Determine if migration can be completed within the allocated timeframe.
        `;

        fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "text",
                analysisQuery: combinedQuery
            })
        })
        .then(response => {
            console.log("Fetch response received for diagram:", response.status);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Fetch data received for diagram:", data);
            let resultText = data.analysis || "No analysis result returned.";
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
    } else {
        let reader = new FileReader();
        reader.readAsDataURL(diagramUpload);

        reader.onload = function () {
            let base64String = reader.result.split(",")[1];
            let filename = diagramUpload.name;

            const combinedQuery = `
                You are a Solution Architect at a reputed insurance company. Your task is to analyze the given GitHub repository and accompanying architecture diagrams (HLD/LLD) to determine whether the application can be migrated to the target cloud platform within the specified budget and timeframe. Additionally, estimate costs based on the provided rate chart.

                Input Details:
                GitHub Repository URL: ${githubUrl}
                High-Level Design (HLD) Diagram: ${filename} (Attached)
                Low-Level Design (LLD) Diagram: ${filename} (Attached - assuming same diagram for both unless specified)
                Current Monthly Operating Cost: $${currentCost}
                Migration Budget: $${migrationBudget}
                Time Frame: ${timeFrame} months
                Current Cloud Platform: ${currentCloud}
                Target Cloud Platform: ${futureState}
                Cost Estimation Rate Chart:
                Business Analyst: $70/hour
                Manager: $60/hour
                Tech Lead: $50/hour
                Senior Developer: $45/hour
                Junior Developer: $20/hour
                DevOps Engineer: $35/hour
                Scrum Master: $25/hour
                QA Engineer: $30/hour

                Response Format:
                YES – Migration is feasible within the given budget and timeframe.
                NO – Migration is not possible under the current constraints.
                Justification (2 sentences max): Provide a brief explanation of why migration is or isn’t possible (e.g., budget shortfall, code complexity, dependencies, major refactoring required).

                Analysis Criteria:
                Repository Analysis:
                - Evaluate the complexity of the codebase in the GitHub repository.
                - Identify dependencies, infrastructure requirements, and refactoring efforts needed for migration.
                Architecture Review (HLD/LLD): (If provided)
                - Assess architectural feasibility for migration.
                - Identify gaps between the current and target cloud infrastructure.
                Budget & Timeframe Validation:
                - Estimate total effort hours required for migration.
                - Apply the rate chart to calculate total migration cost.
                - Compare the estimated cost with the provided budget.
                - Determine if migration can be completed within the allocated timeframe.
            `;

            fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "imageUpload",
                    filename: filename,
                    image: base64String,
                    analysisQuery: combinedQuery
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
}

function analyzeUploadedDiagram() {
    console.log("analyzeUploadedDiagram clicked");
    const diagramUpload = document.getElementById("analyzeDiagramUpload").files[0];
    const loadingSpinner = document.getElementById("analyzeLoading");
    const analyzeButton = document.querySelector("#analyzeDiagramPage .primary-btn");

    if (!diagramUpload) {
        alert("Please upload an architectural diagram!");
        return;
    }

    console.log("Disabling analyze button and showing spinner");
    analyzeButton.disabled = true;
    analyzeButton.style.opacity = "0.5";
    loadingSpinner.style.display = "block";
    document.getElementById("analyzeResult").innerHTML = "";

    const reader = new FileReader();
    reader.readAsDataURL(diagramUpload);

    reader.onload = function () {
        const base64String = reader.result.split(",")[1];
        const filename = diagramUpload.name;

        const analysisPrompt = `
You are an expert Solution Architect specializing in cloud migration and architectural analysis. Your primary task is to analyze architectural diagrams (e.g., LLD or HLD images) provided by the user and deliver a concise summary of the architectural flow, identifying key components (e.g., API Gateway, serverless functions, databases) and their interactions. Based on this analysis, provide targeted recommendations to optimize the architecture for cloud deployment, adhering to security best practices (e.g., encryption, least privilege, secure APIs) and ensuring high availability (e.g., redundancy, load balancing, auto-scaling). Focus solely on cloud-relevant improvements, avoid generic or unrelated advice, and tailor suggestions to the specific components and structure in the supplied diagram. Assume a cloud-native serverless architecture (e.g., leveraging AWS Lambda, Azure Functions, or GCP Cloud Functions) unless otherwise specified. Provide clear, actionable steps for migration and enhancement, leveraging your knowledge of modern cloud platforms like AWS, Azure, or GCP. Deliver precise answers to the user’s query with concise explantions.
        `;

        fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "imageUpload",
                filename: filename,
                image: base64String,
                analysisQuery: analysisPrompt
            })
        })
        .then(response => {
            console.log("Fetch response received for analyze diagram:", response.status);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Fetch data received for analyze diagram:", data);
            const resultText = data.imageAnalysis || "No analysis result returned.";
            document.getElementById("analyzeResult").innerHTML = `<pre>${resultText}</pre>`;
            document.getElementById("downloadAnalyzePdf").style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching analyze diagram analysis:", error);
            document.getElementById("analyzeResult").innerText = "Error fetching analysis: " + error.message;
        })
        .finally(() => {
            console.log("Fetch completed for analyze diagram, hiding spinner and re-enabling button");
            loadingSpinner.style.display = "none";
            analyzeButton.disabled = false;
            analyzeButton.style.opacity = "1";
        });
    };

    reader.onerror = function (error) {
        console.error("Error converting diagram:", error);
        alert("Failed to process diagram. Try again.");
        loadingSpinner.style.display = "none";
        analyzeButton.disabled = false;
        analyzeButton.style.opacity = "1";
    };
}

function analyzeChaosMeshDiagram() {
    console.log("analyzeChaosMeshDiagram clicked");
    const diagramUpload = document.getElementById("chaosMeshDiagramUpload").files[0];
    const loadingSpinner = document.getElementById("chaosMeshLoading");
    const analyzeButton = document.querySelector("#chaosMeshDiagramPage .primary-btn");

    if (!diagramUpload) {
        alert("Please upload an architectural diagram!");
        return;
    }

    console.log("Disabling analyze button and showing spinner");
    analyzeButton.disabled = true;
    analyzeButton.style.opacity = "0.5";
    loadingSpinner.style.display = "block";
    document.getElementById("chaosMeshResult").innerHTML = "";

    const reader = new FileReader();
    reader.readAsDataURL(diagramUpload);

    reader.onload = function () {
        const base64String = reader.result.split(",")[1];
        const filename = diagramUpload.name;

        const analysisPrompt = `
You are a Chaos Mesh engineering expert built to support Site Reliability Engineers in testing and enhancing system resilience for live Kubernetes-based projects. Your role is to analyze user-provided architectural diagrams (e.g., LLD images) and recommend Chaos Mesh experiments to tackle specific reliability challenges in production or staging environments. Deliver precise responses to the user’s question, including a Chaos Mesh YAML configuration when relevant, a concise explanation of how the experiment tests or stresses the live system, and practical recommendations to improve fault tolerance based on the diagram’s components (e.g., API Gateway, microservices). Stay focused exclusively on Chaos Mesh engineering, avoid off-topic details, and tailor suggestions to the supplied architecture.
        `;

        fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "imageUpload",
                filename: filename,
                image: base64String,
                analysisQuery: analysisPrompt
            })
        })
        .then(response => {
            console.log("Fetch response received for chaos mesh diagram:", response.status);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("Fetch data received for chaos mesh diagram:", data);
            const resultText = data.imageAnalysis || "No analysis result returned.";
            document.getElementById("chaosMeshResult").innerHTML = `<pre>${resultText}</pre>`; // Ensure output is boxed
            document.getElementById("downloadChaosMeshPdf").style.display = "block";
        })
        .catch(error => {
            console.error("Error fetching chaos mesh diagram analysis:", error);
            document.getElementById("chaosMeshResult").innerHTML = `<pre>Error fetching analysis: ${error.message}</pre>`; // Box error message
        })
        .finally(() => {
            console.log("Fetch completed for chaos mesh diagram, hiding spinner and re-enabling button");
            loadingSpinner.style.display = "none";
            analyzeButton.disabled = false;
            analyzeButton.style.opacity = "1";
        });
    };

    reader.onerror = function (error) {
        console.error("Error converting diagram:", error);
        alert("Failed to process diagram. Try again.");
        loadingSpinner.style.display = "none";
        analyzeButton.disabled = false;
        analyzeButton.style.opacity = "1";
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

    if (type === "diagram") {
        let resultElement = document.getElementById("diagramResult").querySelector("pre");
        let resultText = resultElement ? resultElement.innerText : "No result available.";
        doc.text("Architecture Reflection Result", 10, 10);
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
        doc.save("Architecture_Reflection_Result.pdf");
    } else if (type === "analyze") {
        let resultElement = document.getElementById("analyzeResult").querySelector("pre");
        let resultText = resultElement ? resultElement.innerText : "No result available.";
        doc.text("Architectural Diagram Analysis Result", 10, 10);
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
        doc.save("Architectural_Diagram_Analysis_Result.pdf");
    } else if (type === "chaosMesh") {
        let resultElement = document.getElementById("chaosMeshResult").querySelector("pre");
        let resultText = resultElement ? resultElement.innerText : "No result available.";
        doc.text("Chaos Mesh Diagram Analysis Result", 10, 10);
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
        doc.save("Chaos_Mesh_Diagram_Analysis_Result.pdf");
    }
}

function showPage(pageId) {
    console.log("showPage called with:", pageId);
    if (pageId === "landingPage" && document.getElementById("agentPage").style.display === "block") {
        resetAgentChat();
    }
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("chaosMeshPage").style.display = "none";
    document.getElementById("migratePage").style.display = "none";
    document.getElementById("agentPage").style.display = "none";
    document.getElementById("discoveryWizardPage").style.display = "none";
    document.getElementById("analyzeDiagramPage").style.display = "none";
    document.getElementById("chaosMeshDiagramPage").style.display = "none";

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
