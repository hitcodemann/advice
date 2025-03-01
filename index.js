function analyzeRepo() {
    let githubUrl = document.getElementById("githubUrl").value;
    let analysisQuery = document.getElementById("analysisQuery").value;
    let language = document.getElementById("language").value;

    if (!githubUrl || !analysisQuery) {
        alert("Please enter both GitHub URL and an analysis request!");
        return;
    }

    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            type: "github",
            githubUrl: githubUrl, 
            language: language,
            analysisQuery: analysisQuery 
        }) 
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("analysisResult").innerText = data.analysis;
    })
    .catch(error => {
        console.error("Error fetching analysis:", error);
        document.getElementById("analysisResult").innerText = "Error fetching analysis. Try again.";
    });
}

function getInvestmentAdvice() {
    let name = document.getElementById("name").value;
    let salary = document.getElementById("salary").value;
    let investmentType = document.getElementById("investmentType").value;

    if (!name || !salary || !investmentType) {
        alert("Please fill out all fields!");
        return;
    }

    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            type: "investment",
            name: name,
            salary: salary,
            investmentType: investmentType 
        }) 
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("investmentResult").innerText = data.investmentAdvice;
    })
    .catch(error => {
        console.error("Error fetching investment advice:", error);
        document.getElementById("investmentResult").innerText = "Error fetching investment advice. Try again.";
    });
}

function showPage(pageId) {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("githubAnalysisPage").style.display = "none";
    document.getElementById("investmentPage").style.display = "none";

    document.getElementById(pageId).style.display = "block";
}

