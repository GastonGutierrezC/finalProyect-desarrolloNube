export const audioService = {
  async postAudio(file: File): Promise<string | undefined> {
    const url = "https://api.cloudinary.com/v1_1/dk2ycpyri/video/upload";
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "PostAudios-1"); 

    const entries = formData.entries();
    let entry = entries.next();
    while (!entry.done) {
      const [key, value] = entry.value;
      console.log(`formData key: ${key}, value:`, value);
      entry = entries.next();
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error en la subida: ${response.status} ${response.statusText} - ${errorBody}`);
        throw new Error(`Error en la subida: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Audio subido con éxito:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Error en postAudio:", error);
      return undefined;
    }
  },
};
