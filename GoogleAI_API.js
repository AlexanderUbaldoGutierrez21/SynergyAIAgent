import vision from "@google-cloud/vision";

export default defineComponent({
  props: {
    GOOGLE_APPLICATION_CREDENTIALS: {
      type: "string",
      secret: true,
    },
  },

  async run({ steps, $ }) {
    const base64Images = steps["Extract_Data"]?.$return_value?.base64Images;

    if (!base64Images || base64Images.length === 0) {
      throw new Error("No base64Images found. Check previous step output.");
    }

    const client = new vision.ImageAnnotatorClient({
      credentials: JSON.parse(this.GOOGLE_APPLICATION_CREDENTIALS),
    });

    let allTexts = [];

    for (const base64Image of base64Images) {
      const imageBuffer = Buffer.from(base64Image, "base64");
      const [result] = await client.textDetection({ image: { content: imageBuffer } });
      const detections = result.textAnnotations;
      const fullText = detections?.[0]?.description || "";
      allTexts.push(fullText.trim());
    }

    return {
      raw_text: allTexts.join(" ").trim() || "No OCR text extracted.",
    };
  },
});