import { MCPTool } from "mcp-framework";
import { z } from "zod";
class TemplatedImageTool extends MCPTool {
    name = "templated-image-generator";
    description = "Generates an image based on a template, given text and an image URL";
    schema = {
        templateId: {
            type: z.string(),
            description: "ID of the Templated.io template to use"
        },
        text: {
            type: z.string(),
            description: "Text content to render on the image"
        },
        imageUrl: {
            type: z.string().url(),
            description: "URL of an image to include in the template"
        }
    };
    async execute({ templateId, text, imageUrl }) {
        // Prepare the payload for Templated API
        const payload = {
            template: templateId,
            layers: {
                "text-1": {
                    text: text
                    // You could include "color" or "background" here if your template expects them
                },
                "image-1": {
                    image_url: imageUrl
                }
            }
        };
        try {
            const response = await this.fetch("https://api.templated.io/v1/render", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.TEMPLATED_API_KEY}`
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                // If the HTTP status is not 200/202, throw an error with details
                const errorText = await response.text();
                throw new Error(`Templated API error: ${response.status} - ${errorText}`);
            }
            const resultData = await response.json();
            return resultData;
        }
        catch (error) {
            // Handle network errors or other exceptions
            console.error("Error calling Templated API:", error);
            throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
export default TemplatedImageTool;
