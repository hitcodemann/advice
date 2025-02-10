function getAdvice() {
    let country = document.getElementById("country").value;
    if (!country) {
        alert("Please enter a country!");
        return;
    }

    // Call AWS API Gateway endpoint (Replace with your real API URL)
    fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice" + country)
        .then(response => response.json())
        .then(data => {
            document.getElementById("advice").innerText = data.advice;
        })
        .catch(error => {
            console.error("Error fetching advice:", error);
            document.getElementById("advice").innerText = "Error fetching advice. Try again.";
        });
}
