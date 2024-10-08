document.addEventListener("DOMContentLoaded", () => {
    const PropertyForm = document.getElementById("PropertyCase");

    PropertyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const FirstName = formData.get("FirstName");
        const SecondName = formData.get("SecondName");
        const Age = formData.get("Age");
        const Residence = formData.get("Residence");
        const landSerial = formData.get("landSerial");
        const TitleSerial = formData.get("TitleSerial");
        const hectares = formData.get("hectares");
        const GPS = formData.get("GPS");
        const FirstName2 = formData.get("FirstName2");''
        const SecondName2 = formData.get("SecondName2");
        const Residence2 = formData.get("Residence2");
        const Occupation = formData.get("Occupation");
        const brief = formData.get("brief");

        try {
            const response = await fetch("http://localhost:7000/land", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ FirstName, SecondName, Age, Residence, landSerial, TitleSerial,hectares, GPS, FirstName2, SecondName2, Residence2, Occupation, brief })
            });

            if (response.ok) {
                alert("successful");
                window.location.href = "/constitution.html"; // Redirect after success
            } else {
                const data = await response.json();
                alert("failed failed: ");
            }
        } catch (error) {
            console.error("Error during filing :" + { error });
            alert("filing data failed failed due to an error");
        }
    });
});