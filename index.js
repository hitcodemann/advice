function getAnalysis() {
    let githubUrl = document.getElementById("githubUrl").value;
    let query = document.getElementById("query").value;

    if (!githubUrl || !query) {
        alert("Please enter both the GitHub URL and your analysis query!");
        return;
    }

    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", { // Keep the same API URL
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            type: "github",  // Important! Make sure this is included
            github_url: githubUrl,
            query: query
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("analysisResult").innerText = data.analysis || "No analysis found.";
    })
    .catch(error => {
        console.error("Error fetching analysis:", error);
        document.getElementById("analysisResult").innerText = "Error fetching analysis. Try again.";
    });
}
