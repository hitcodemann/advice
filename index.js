window.onload = function () {
    document.querySelectorAll('.container').forEach(div => div.classList.add('hidden'));
    showPage('githubAnalysisPage'); // Show GitHub Analysis by default
};

function showPage(pageId) {
    document.querySelectorAll('.container').forEach(div => div.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

function analyzeRepo() {
    let githubUrl = document.getElementById("githubUrl").value.trim();
    let analysisQuery = document.getElementById("analysisQuery").value.trim();

    if (!githubUrl || !analysisQuery) {
        alert("Please enter both GitHub URL and Analysis Query.");
        return;
    }

    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "github", url: githubUrl, query: analysisQuery })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("analysisResult").innerText = data.result || "No result found.";
    })
    .catch(error => {
        console.error("Error analyzing GitHub repository:", error);
        document.getElementById("analysisResult").innerText = "Error analyzing repository.";
    });
}

function getInvestmentAdvice() {
    let name = document.getElementById("name").value.trim();
    let salary = document.getElementById("salary").value.trim();
    let investmentType = document.getElementById("investmentType").value;

    if (!name || !salary || !investmentType) {
        alert("Please fill in all fields.");
        return;
    }

    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/investment-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, salary, investmentType })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("investmentResult").innerText = data.advice || "No advice available.";
    })
    .catch(error => {
        console.error("Error getting investment advice:", error);
        document.getElementById("investmentResult").innerText = "Error retrieving investment advice.";
    });
}

function analyzeImage() {
    let imageFile = document.getElementById("imageUpload").files[0];

    if (!imageFile) {
        alert("Please select an image to analyze.");
        return;
    }

    let formData = new FormData();
    formData.append("image", imageFile);

    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/image-analysis", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("imageAnalysisResult").innerText = data.description || "No description available.";
    })
    .catch(error => {
        console.error("Error analyzing image:", error);
        document.getElementById("imageAnalysisResult").innerText = "Error analyzing image.";
    });
}
