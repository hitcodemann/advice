function analyzeRepo() {
    let githubUrl = document.getElementById("githubUrl").value;
    let analysisQuery = document.getElementById("analysisQuery").value;

    if (!githubUrl || !analysisQuery) {
        alert("Please enter both GitHub URL and an analysis request!");
        return;
    }

    fetch("https://YOUR_API_GATEWAY_URL/dev/travel-advice", { // Use the same API Gateway URL
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            type: "github", // This tells Lambda to process a GitHub request
            githubUrl: githubUrl, 
            analysisQuery: analysisQuery 
        }) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("analysisResult").innerText = data.analysis;
    })
    .catch(error => {
        console.error("Error fetching analysis:", error);
        document.getElementById("analysisResult").innerText = "Error fetching analysis. Try again.";
    });
}

function getAdvice() {
    let country = document.getElementById("country").value;
    if (!country) {
        alert("Please enter a country!");
        return;
    }

    fetch("https://YOUR_API_GATEWAY_URL/dev/travel-advice", { // Use the same API Gateway URL
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            type: "travel", // This tells Lambda to process a travel request
            country: country 
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("advice").innerText = data.advice;
    })
    .catch(error => {
        console.error("Error fetching advice:", error);
        document.getElementById("advice").innerText = "Error fetching advice. Try again.";
    });
}
