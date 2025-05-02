export async function ImageClient(api, imageFile) {
    const serverUrl = import.meta.env.VITE_CORE_SERVER_URL;

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const response = await fetch(`${serverUrl}/${api}`, {
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
