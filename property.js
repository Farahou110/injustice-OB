document.addEventListener("DOMContentLoaded", () => {
    const PropertyForm = document.getElementById("PropertyCase");

    PropertyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const FirstName = formData.get("FirstName");
        const SecondName = formData.get("SecondName");
        const Age = formData.get("Age");
        const Residence = formData.get("Residence");
        const PropertyType = formData.get("Type");
        const Location = formData.get("Location");
        const worth = formData.get("worth");
        const GPS = formData.get("GPS");
        const FirstName2 = formData.get("FirstName2");''
        const SecondName2 = formData.get("SecondName2");
        const Residence2 = formData.get("Residence2");
        const Occupation = formData.get("Occupation");
        const brief = formData.get("brief");

        try {
            const response = await fetch("http://localhost:7000/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ FirstName, SecondName, Age, Residence, PropertyType, Location, worth, GPS, FirstName2, SecondName2, Residence2, Occupation, brief })
            });

            if (response.ok) {
                alert("successful");
                // window.location.href = "/expenses.html"; // Redirect after success
            } else {
                const data = await response.json();
                alert("failed failed: ");
            }
        } catch (error) {
            console.error("Error during registering :" + { error });
            alert("registering data failed failed due to an error");
        }
    });
});