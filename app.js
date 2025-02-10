import { useState } from "react";

function App() {
    const [country, setCountry] = useState("");
    const [advice, setAdvice] = useState("");

    const getAdvice = async () => {
        const response = await fetch(
            "https://YOUR_API_GATEWAY_URL/travel-advice",
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
        <div style={{ textAlign: "center", marginTop: "50px" }}>
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
