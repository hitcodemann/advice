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
            // Display the Rekognition analysis result
            document.getElementById("imageAnalysisResult").innerText = data.imageAnalysis || "No analysis result returned.";
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

// Other functions (analyzeRepo, getInvestmentAdvice, showPage) remain unchanged
