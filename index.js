// function getAdvice() {
//     let country = document.getElementById("country").value;
//     if (!country) {
//         alert("Please enter a country!");
//         return;
//     }

//     // Call AWS API Gateway endpoint (Replace with your real API URL)
//     fetch("https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice" + country)
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById("advice").innerText = data.advice;
//         })
//         .catch(error => {
//             console.error("Error fetching advice:", error);
//             document.getElementById("advice").innerText = "Error fetching advice. Try again.";
//         });
// }
import { useState } from "react";

function App() {
    const [country, setCountry] = useState("");
    const [advice, setAdvice] = useState("");

    const getAdvice = async () => {
        const response = await fetch(
            "https://zekibdxnrk.execute-api.us-west-2.amazonaws.com/dev/travel-advice",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country }),
            }
        );
        const data = await response.json();
        setAdvice(data.advice);
    };

    return (
        <div>
            <h1>Travel Advice App</h1>
            <input
                type="text"
                placeholder="Enter country name"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
            />
            <button onClick={getAdvice}>Get Advice</button>
            <p>{advice}</p>
        </div>
    );
}

export default App;
