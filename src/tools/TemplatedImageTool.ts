import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface ImageGenInput {
  templateId: string;
  photoBgImageUrl: string;
  bgYellowImageUrl: string;
  buildText: string;
}

class TemplatedImageTool extends MCPTool<ImageGenInput> {
  name = "templated-image-generator2";
  description = "Generates an image using Templated.io with a given template and dynamic assets.";

  schema = {
    templateId: {
      type: z.string(),
      description: "The Templated.io template ID to use."
    },
    photoBgImageUrl: {
      type: z.string().url(),
      description: "URL for the image to place in the 'photo-bg' layer."
    },
    bgYellowImageUrl: {
      type: z.string().url(),
      description: "URL for the image to place in the 'bg-yellow' layer."
    },
    buildText: {
      type: z.string(),
      description: "Text content for the 'build' text layer."
    }
  };

  public async execute(params: {
    templateId: string;
    photoBgImageUrl: string;
    bgYellowImageUrl: string;
    buildText: string;
  }): Promise<any> {
    const { templateId, photoBgImageUrl, bgYellowImageUrl, buildText } = params;

    // Construct the request payload with dynamic values
    const requestBody = {
      template: templateId,
      layers: {
        "photo-bg": {
          image_url: photoBgImageUrl
        },
        "bg-yellow": {
          image_url: bgYellowImageUrl
        },
        "build": {
          text: buildText,
          color: "rgb(0, 0, 0)"
        }
      }
    };

    // Send the POST request to Templated API
    const response = await fetch('https://api.templated.io/v1/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TEMPLATED_API_KEY}`  // Replace API_KEY with your actual API key
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorText = await response.text();
      throw new Error(`Templated API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Return the JSON result (contains fields like id, url, status, etc.)
    return await response.json();
  }
}

export default TemplatedImageTool;