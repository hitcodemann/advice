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

function analyzeImage() {
    let imageUpload = document.getElementById("imageUpload").files[0];

    if (!imageUpload) {
        alert("Please upload an image!");
        return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(imageUpload);
    
    reader.onload = function () {
        let base64String = reader.result.split(",")[1]; // Remove "data:image/png;base64," part
        let filename = imageUpload.name;

        fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                type: "imageUpload",
                filename: filename,
                image: base64String
            }) 
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("imageAnalysisResult").innerText = data.imageLabels ? data.imageLabels.join(", ") : "No labels detected.";
        })
        .catch(error => {
            console.error("Error fetching image analysis:", error);
            document.getElementById("imageAnalysisResult").innerText = "Error fetching image analysis. Try again.";
        });
    };

    reader.onerror = function (error) {
        console.error("Error converting image:", error);
        alert("Failed to process image. Try again.");
    };
}

function showPage(pageId) {
    document.getElementById("homePage").style.display = "none";
    document.getElementById("githubAnalysisPage").style.display = "none";
    document.getElementById("investmentPage").style.display = "none";
    document.getElementById("imageAnalysisPage").style.display = "none";

    document.getElementById(pageId).style.display = "block";
}
