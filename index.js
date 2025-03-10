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
        let analysisText = data.analysis || "No result returned.";

        // Display text in UI
        document.getElementById("analysisResult").innerText = analysisText;

        // Generate PDF for download
        let pdf = new jsPDF();
        pdf.text(20, 20, "GitHub Analysis Result:");
        pdf.text(20, 30, analysisText);
        let pdfBlob = pdf.output("blob");

        // Create download link
        let downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = "GitHub_Analysis_Result.pdf";
        downloadLink.innerText = "Download Result as PDF";
        downloadLink.className = "primary-btn";

        // Append download link
        let resultContainer = document.getElementById("analysisResultContainer");
        resultContainer.innerHTML = "";  // Clear old content
        resultContainer.appendChild(downloadLink);
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
            let analysisText = data.imageAnalysis || "No analysis result returned.";

            // Display text in UI
            document.getElementById("imageAnalysisResult").innerText = analysisText;

            // Generate PDF for download
            let pdf = new jsPDF();
            pdf.text(20, 20, "Image Analysis Result:");
            pdf.text(20, 30, analysisText);
            let pdfBlob = pdf.output("blob");

            // Create download link
            let downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(pdfBlob);
            downloadLink.download = "Image_Analysis_Result.pdf";
            downloadLink.innerText = "Download Result as PDF";
            downloadLink.className = "primary-btn";

            // Append download link
            let resultContainer = document.getElementById("imageAnalysisResultContainer");
            resultContainer.innerHTML = "";  // Clear old content
            resultContainer.appendChild(downloadLink);
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

function showPage(pageId) {
    console.log("showPage called with:", pageId);
    document.getElementById("homePage").style.display = "none";
    document.getElementById("githubAnalysisPage").style.display = "none";
    document.getElementById("investmentPage").style.display = "none";
    document.getElementById("imageAnalysisPage").style.display = "none";

    document.getElementById(pageId).style.display = "block";
}
