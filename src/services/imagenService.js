import { GoogleGenerativeAI } from "@google/generative-ai";



const systemPrompt = {
	"role_definition": {
		"identity": "Senior Art Director & AI Prompt Engineer",
		"specialization": "Commercial product photography, visual aesthetics, and Stable Diffusion prompting.",
		"tone": "Technical, precise, and creative."
	},
	"mission": {
		"primary_goal": "Analyze user images and generate high-fidelity prompts specifically optimized for the 'Nano Banana' model architecture.",
		"target_model": "Nano Banana (Stable Diffusion based workflow)"
	},
	"process_workflow": {
		"step_1_analysis": "Analyze subject details (texture, lighting, form) ignoring input defects.",
		"step_2_concept": "Define a commercially appealing environment.",
		"step_3_tokenization": "Convert concepts into specific 'tags' (keywords) rather than full sentences.",
		"step_4_formatting": "Apply syntax (brackets for emphasis) suitable for the model."
	},
	"prompt_construction_guidelines": {
		"structure": "Start with quality tags, then subject, surroundings, lighting, and finally camera specs. Use commas to separate.",
		"emphasis_technique": "Use (parentheses:1.2) for emphasizing key features.",
		"quality_boosters": "Always include: (masterpiece, best quality, ultra-detailed, 8k, unity 8k wallpaper).",
		"subject_def": "Precise object tags (e.g., 'red leather bag' instead of 'a bag that is red').",
		"lighting_camera": "Technical tags (e.g., ray tracing, subsurface scattering, f/1.8, depth of field)."
	},
	"output_structure_json": {
		"product_analysis": "Short analysis of the product.",
		"suggested_concept": "Description of the mood.",
		"positive_prompt": "The final comma-separated English keywords string.",
		"negative_prompt": "Crucial exclusion tags (e.g., (worst quality, low quality:1.4), watermark, text, blurry, deformed, ugly, bad anatomy).",
		"lora_trigger_suggestion": "If applicable, suggest a trigger word (optional)."
	},
	"example_scenarios": [
		{
		"input_image_type": "A sneaker taken on a table with bad lighting",
		"output_concept": "Energetic, urban running theme",
		"positive_prompt": "(masterpiece, best quality), product photography, 1shoe, dynamic running sneaker, floating in air, (urban street background:1.1), neon city lights, motion blur, rim lighting, 8k uhd, sharp focus, highly detailed",
		"negative_prompt": "(low quality, worst quality:1.4), human, hands, fingers, text, logo, watermark, distorted, noise, grain"
		}
	]
}

export async function generateImage(promptText, file) {
	console.log(promptText, file)
	const prompt = await aiPromptGenFun(promptText, file[0]?.file);
	const image = await aiImageGenFun(prompt, file[0]?.file);
	console.log(image)
	return image
}

function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onloadend = () => resolve(r.result);
		r.onerror = reject;
		r.readAsDataURL(file);
	});
}

const aiPromptGenFun = async (promptText, file) =>{
	const apikey = window.apikey;

    // const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    const genAI = new GoogleGenerativeAI(apikey);

	const model = genAI.getGenerativeModel({
		model: "gemini-2.5-flash-lite",
	});
	let text = {
		systemPrompt: systemPrompt,
		userPrompt: promptText
	}
	let parts = [{ text: JSON.stringify(text)}];

	if (file) {
		const base64 = await fileToBase64(file);

		parts.push({
			inlineData: {
				mimeType: file.type,
				data: base64.split(",")[1],
			},
		});
	}

	const result = await model.generateContent(parts);

	const response = result.response.candidates[0].content.parts[0].text;

	return JSON.parse(response.replace(/```json|```/g, '').trim());
}

const aiImageGenFun = async (promptText, file) =>{
	const apikey = window.apikey;

    // const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    const genAI = new GoogleGenerativeAI(apikey);

	const model = genAI.getGenerativeModel({
		model: "gemini-2.5-flash-image",
	});
	systemPrompt.role = "definitely generate pictures"
	let text = {
		systemPrompt: systemPrompt,
		userPrompt: promptText
	}
	let parts = [{ text: JSON.stringify(text)}];

	if (file) {
		const base64 = await fileToBase64(file);

		parts.push({
			inlineData: {
				mimeType: file.type,
				data: base64.split(",")[1],
			},
		});
	}

	const result = await model.generateContent(parts);

	const img = result.response.candidates[0].content.parts.find(p => p.inlineData);

	if (!img) throw new Error("Model bir resim üretmedi.");

	return `data:image/png;base64,${img.inlineData.data}`;
}