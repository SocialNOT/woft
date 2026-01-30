
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { MASTER_REGISTRY } from "./registry";
import { CompassState, AttachedFile, CategoryType, Message } from "./types";

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioBuffer(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

export const translateToBengali = async (text: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          { text: `Translate the following text into Bengali (Bangla). Keep the translation natural and preserve any technical terms or formatting: \n\n${text}` }
        ]
      }]
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
};

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read with professional authority: ${text.substring(0, 1000)}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const generateImage = async (prompt: string, aspectRatio: string = "1:1") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: aspectRatio as any }
    }
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const callGemini = async (
  prompt: string, 
  compass: CompassState,
  personaId?: string, 
  frameworkId?: string,
  isWebGrounding: boolean = false,
  isDeepThink: boolean = true,
  isSymposium: boolean = false,
  isCritique: boolean = false,
  attachedFile?: AttachedFile,
  pinnedContext?: string
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const persona = MASTER_REGISTRY.find(i => i.id === personaId);
  const framework = MASTER_REGISTRY.find(i => i.id === frameworkId);
  
  let systemInstruction = "";

  if (isSymposium) {
    const symposiumPersonas = MASTER_REGISTRY.filter(i => i.category === CategoryType.PERSONA).slice(0, 3);
    systemInstruction = `
      SYMPOIUM MODE ACTIVE.
      Respond to the user prompt from THREE distinct perspectives:
      1. ${symposiumPersonas[0].name}: ${symposiumPersonas[0].description}
      2. ${symposiumPersonas[1].name}: ${symposiumPersonas[1].description}
      3. ${symposiumPersonas[2].name}: ${symposiumPersonas[2].description}

      ${pinnedContext ? `PINNED CONTEXT: Use this previous synthesis as absolute grounding: ${pinnedContext}` : ""}

      Return ONLY valid JSON.
      {
        "answer": "Summary of the debate",
        "promptDNA": "SYM_DEBATE_V1",
        "symposium": [
          {
            "persona": "${symposiumPersonas[0].name}",
            "personaId": "${symposiumPersonas[0].id}",
            "content": "Full response content",
            "dnaBreakdown": { "metrics": { "logicScore": 0.9, "entropyLevel": 0.2, "clarityIndex": 0.8 }, "logicPath": "Path A", "semanticWeight": "High", "structuralDensity": "Heavy" }
          },
          ... (repeat for all 3)
        ]
      }
    `;
  } else {
    systemInstruction = `
      IDENTITY: You are ${persona?.name}. ${persona?.systemPrompt || 'Expert Consultant.'}
      FRAMEWORK: Use ${framework?.name} logic: ${framework?.description}
      ${isCritique ? "RECURSIVE CRITIQUE: You must first draft, then internally critique for logic gaps, then produce the FINAL version." : ""}
      ${pinnedContext ? `PINNED CONTEXT (Ground Truth): ${pinnedContext}` : ""}
      
      RESPONSE REQUIREMENT:
      Return ONLY valid JSON.
      {
        "answer": "Main response content in Markdown format",
        "promptDNA": "A technical title (e.g., QUANTUM_SYNTHESIS_V1)",
        "imagePrompt": "A highly descriptive prompt for an image generator (DALL-E style) that visualizes the core concept.",
        "critique": "${isCritique ? 'Describe the logical flaws found in the internal draft and how they were fixed.' : ''}",
        "dnaBreakdown": {
          "logicPath": "Short reasoning steps",
          "semanticWeight": "Key concepts used",
          "structuralDensity": "Density note",
          "metrics": { "logicScore": 0.0-1.0, "entropyLevel": 0.0-1.0, "clarityIndex": 0.0-1.0 }
        }
      }
    `;
  }

  const config: any = {
    systemInstruction,
    temperature: compass.temperature,
    topP: compass.topP,
    topK: compass.topK,
    responseMimeType: "application/json"
  };

  if (isWebGrounding) config.tools = [{ googleSearch: {} }];
  
  const modelToUse = "gemini-3-flash-preview";
  
  if (isDeepThink) config.thinkingConfig = { thinkingBudget: compass.thinkingBudget };

  const contents: any[] = [{ parts: [{ text: prompt }] }];
  if (attachedFile) contents[0].parts.push({ inlineData: { mimeType: attachedFile.mimeType, data: attachedFile.data } });

  const response = await ai.models.generateContent({
    model: modelToUse,
    contents,
    config,
  });

  const raw = response.text || "{}";
  let result;
  try {
    result = JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch (e) {
    result = { answer: raw, promptDNA: "FALLBACK_SYNTHESIS" };
  }
  
  let thought = "";
  response.candidates?.[0]?.content?.parts?.forEach((p: any) => { if (p.thought) thought = p.thought; });
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return { ...result, thought, sources };
};
