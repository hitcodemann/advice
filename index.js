// Global variable to store PDF data
let pdfData = { github: null, image: null };

function analyzeRepo() {
    console.log("analyzeRepo clicked");
    let githubUrl = document.getElementById("githubUrl").value;
    let analysisQuery = document.getElementById("analysisQuery").value;

    if (!githubUrl || !analysisQuery) {
        alert("Please enter both GitHub URL and an analysis request!");
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
        document.getElementById("analysisResult").innerText = data.analysis || "No result returned.";
        pdfData.github = data.pdf; // Store PDF base64 string
        document.getElementById("downloadGithubPdf").style.display = pdfData.github ? "inline-block" : "none";
    })
    .catch(error => {
        console.error("Error fetching analysis:", error);
        document.getElementById("analysisResult").innerText = "Error fetching analysis: " + error.message;
    });
}

function analyzeImage() {
    console.log("analyzeImage clicked");
    let imageUpload = document.getElementById("imageUpload").files[0];
    let imageAnalysisQuery = document.getElementById("imageAnalysisQuery").value;

    if (!imageUpload) {
        alert("Please upload an image!");
        return;
    }

    if (!imageAnalysisQuery) {
        alert("Please enter an analysis prompt!");
        return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(imageUpload);
    
    reader.onload = function () {
        let base64String = reader.result.split(",")[1];
        let filename = imageUpload.name;

        console.log("Sending image:", filename, "Base64 length:", base64String.length);

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
            document.getElementById("imageAnalysisResult").innerText = data.imageAnalysis || "No analysis result returned.";
            pdfData.image = data.pdf; // Store PDF base64 string
            document.getElementById("downloadImagePdf").style.display = pdfData.image ? "inline-block" : "none";
        })
        .catch(error => {
            console.error("Error fetching image analysis:", error);
            document.getElementById("imageAnalysisResult").innerText = "Error fetching image analysis: " + error.message;
        });
    };

    reader.onerror = function (error) {
        console.error("Error converting image:", error);
        alert("Failed to process image. Try again.");
    };
}

function downloadPdf(type) {
    const pdfBase64 = type === "github" ? pdfData.github : pdfData.image;
    if (!pdfBase64) {
        alert("No PDF available to download!");
        return;
    }

    const linkSource = `data:application/pdf;base64,${pdfBase64}`;
    const downloadLink = document.createElement("a");
    const fileName = `${type}_analysis_${new Date().toISOString().split('T')[0]}.pdf`;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

// Existing showPage function remains unchanged
function showPage(pageId) {
    console.log("showPage called with:", pageId);
    document.getElementById("homePage").style.display = "none";
    document.getElementById("githubAnalysisPage").style.display = "none";
    document.getElementById("investmentPage").style.display = "none";
    document.getElementById("imageAnalysisPage").style.display = "none";

    document.getElementById(pageId).style.display = "block";
}
