import fs from "fs";
import axios from "axios";
import fetch from "node-fetch";
import path from "path";

export default defineComponent({
  props: {
    CLOUDCONVERT_API_KEY: { type: "string", secret: true },
  },

  async run({ steps, $ }) {
    const pdfUrl = steps.trigger.event["Energy Bill"];
    if (!pdfUrl) {
      throw new Error("PDF URL not found in trigger.");
    }

    const head = await axios.head(pdfUrl);
    const size = parseInt(head.headers["content-length"] || "0", 10);
    if (size > 5 * 1024 * 1024) {
      throw new Error("PDF too large (>5MB). Please upload a smaller file.");
    }

    const { data: pdfBuffer } = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
    });
    const tmpPath = `/tmp/${path.basename(pdfUrl)}`;
    fs.writeFileSync(tmpPath, pdfBuffer);

    const jobResponse = await fetch("https://api.cloudconvert.com/v2/jobs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.CLOUDCONVERT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tasks: {
          import_pdf: {
            operation: "import/url",
            url: pdfUrl,
          },
          convert_image: {
            operation: "convert",
            input: "import_pdf",
            input_format: "pdf",
            output_format: "jpg",
            pages: "1-2",   
            fit: "max",
            width: 800,
            quality: 80,
          },
          export_result: {
            operation: "export/url",
            input: "convert_image",
          },
        },
      }),
    });

    const job = await jobResponse.json();

    if (!job?.data?.id) {
      const errorMsg = job?.message || job?.error || "No job ID returned.";
      throw new Error("CloudConvert job creation failed: " + errorMsg);
    }

    const jobId = job.data.id;

    let jobStatus;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      jobStatus = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${this.CLOUDCONVERT_API_KEY}` },
      }).then((r) => r.json());

      if (jobStatus?.data?.status === "finished") break;
    }

    if (!jobStatus?.data?.status || jobStatus.data.status !== "finished") {
      throw new Error("CloudConvert job did not finish in time.");
    }

    const exportTask = jobStatus.data.tasks.find((t) => t.name === "export_result");
    const files = exportTask?.result?.files || [];

    if (files.length === 0) {
      throw new Error("Failed to retrieve converted files from CloudConvert.");
    }

    const images = await Promise.all(
      files.map(async (file) => {
        const imgBuffer = await axios.get(file.url, { responseType: "arraybuffer" }).then((r) => r.data);
        return Buffer.from(imgBuffer).toString("base64");
      })
    );

    return {
      base64Images: images,  
      convertedSizes: images.map((img) => img.length),
      originalSize: size,
    };
  },
});