import { pipeline } from '@xenova/transformers';

// Initialize the pipeline
let translator: any = null;

export async function initializeTranslator() {
  if (!translator) {
    translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M');
  }
  return translator;
}

export async function translateToArabic(text: string): Promise<string> {
  const translator = await initializeTranslator();
  const result = await translator(text, {
    src_lang: 'eng_Latn',
    tgt_lang: 'ara_Arab'
  });
  return result[0].translation_text;
}