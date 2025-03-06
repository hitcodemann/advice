const API_URL = "https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice";

function analyzeRepo() {
    let githubUrl = document.getElementById("githubUrl").value;
    let analysisQuery = document.getElementById("analysisQuery").value;
    let language = document.getElementById("language").value;

    if (!githubUrl || !analysisQuery || !language) {
        alert("Please enter GitHub URL, Language, and an Analysis Query!");
        return;
    }

    fetch(API_URL, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    .catch(error => console.error("Error:", error));
}

function getInvestmentAdvice() {
    let name = document.getElementById("name").value;
    let salary = document.getElementById("salary").value;
    let investmentType = document.getElementById("investmentType").value;

    if (!name || !salary || !investmentType) {
        alert("Please fill out all fields!");
        return;
    }

    fetch(API_URL, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    .catch(error => console.error("Error:", error));
}

function analyzeImage() {
    let imageFile = document.getElementById("imageUpload").files[0];
    if (!imageFile) {
        alert("Please upload an image!");
        return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = function () {
        let base64Image = reader.result.split(',')[1]; // Extract Base64 part

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "imageUpload",
                filename: imageFile.name,
                image: base64Image
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("imageResult").innerText = data.imageDescription;
        })
        .catch(error => console.error("Error:", error));
    };

    reader.onerror = function (error) {
        console.error("Error converting image to Base64:", error);
    };
}

function showPage(pageId) {
    document.querySelectorAll(".container").forEach(container => container.style.display = "none");
    document.getElementById(pageId).style.display = "block";
}
