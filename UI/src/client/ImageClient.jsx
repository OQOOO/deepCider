export async function ImageClient(api, imageFile) {
    let backEndPort = "37777";

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const response = await fetch(`http://localhost:${backEndPort}/${api}`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Network response was not ok");

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
