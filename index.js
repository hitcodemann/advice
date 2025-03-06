function showPage(pageId) {
    document.querySelectorAll('.container').forEach(div => div.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// GitHub Repository Analysis Function
function analyzeGitHubRepo() {
    let githubUrl = document.getElementById("githubUrl").value;
    let query = document.getElementById("query").value;

    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "github", url: githubUrl, query: query })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("githubAnalysisResult").innerText = data.result || "No result found.";
    })
    .catch(error => {
        console.error("Error analyzing GitHub repository:", error);
        document.getElementById("githubAnalysisResult").innerText = "Error analyzing repository.";
    });
}

// Investment Advice Function
function getInvestmentAdvice() {
    let name = document.getElementById("name").value;
    let salary = document.getElementById("salary").value;
    let investmentType = document.getElementById("investmentType").value;

    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "investment", name: name, salary: salary, investmentType: investmentType })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("investmentResult").innerText = data.advice || "No advice found.";
    })
    .catch(error => {
        console.error("Error fetching investment advice:", error);
        document.getElementById("investmentResult").innerText = "Error fetching investment advice.";
    });
}

// Image Analysis Function
function analyzeImage() {
    let imageInput = document.getElementById("imageInput").files[0];

    if (!imageInput) {
        alert("Please select an image to analyze!");
        return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(imageInput);
    reader.onloadend = function () {
        let base64Image = reader.result.split(",")[1];

        fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "image", imageData: base64Image })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("imageAnalysisResult").innerText = data.description || "No description found.";
        })
        .catch(error => {
            console.error("Error analyzing image:", error);
            document.getElementById("imageAnalysisResult").innerText = "Error analyzing image.";
        });
    };
}
