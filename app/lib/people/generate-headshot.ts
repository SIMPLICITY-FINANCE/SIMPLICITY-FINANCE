import { fal } from "@fal-ai/client";
import * as fs from "node:fs";
import * as path from "node:path";

export function configureFal() {
  fal.config({
    credentials: process.env.FAL_KEY!,
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createHeadshotPrompt(person: {
  name: string;
  title?: string;
}): string {
  let prompt =
    "Professional business headshot portrait photograph, " +
    "studio lighting, soft shadows, neutral gray background, " +
    "business professional attire, confident expression, " +
    "looking directly at camera, sharp focus, high detail, ";

  if (person.title) {
    const t = person.title.toLowerCase();
    if (t.includes("founder") || t.includes("ceo") || t.includes("executive")) {
      prompt += "executive presence, suit and tie, mature professional, ";
    } else if (t.includes("professor") || t.includes("economist") || t.includes("phd")) {
      prompt += "intellectual, glasses, academic professional, ";
    } else if (t.includes("analyst") || t.includes("researcher")) {
      prompt += "analytical professional, business casual, ";
    } else if (t.includes("trader") || t.includes("investor")) {
      prompt += "financial professional, sharp dresser, ";
    } else if (t.includes("host") || t.includes("podcast")) {
      prompt += "media personality, approachable, smart casual, ";
    } else {
      prompt += "professional, ";
    }
  } else {
    prompt += "professional, ";
  }

  prompt +=
    "8k resolution, professional photography, corporate headshot style, " +
    "photorealistic, natural skin tones, proper color grading";

  return prompt;
}

async function downloadAndStore(
  imageUrl: string,
  personSlug: string
): Promise<string> {
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const dir = path.join(process.cwd(), "public", "headshots");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filename = `${personSlug}.png`;
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, buffer);

  return `/headshots/${filename}`;
}

export async function generateHeadshot(person: {
  name: string;
  slug: string;
  title?: string;
}): Promise<string> {
  const prompt = createHeadshotPrompt(person);
  console.log(`  Prompt: ${prompt.substring(0, 120)}...`);

  const result = (await fal.subscribe("fal-ai/flux/schnell", {
    input: {
      prompt,
      image_size: "square_hd",
      num_inference_steps: 4,
      num_images: 1,
      enable_safety_checker: true,
    },
  })) as { images: Array<{ url: string }> };

  const imageUrl = result.images?.[0]?.url;
  if (!imageUrl) {
    throw new Error("No image URL returned from Fal.ai");
  }

  const storedUrl = await downloadAndStore(imageUrl, person.slug);
  return storedUrl;
}
