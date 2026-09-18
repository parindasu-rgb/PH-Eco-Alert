import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI client safely on server-side
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
  });

  // Server-side AI Incident Analysis Endpoint
  app.post('/api/ai/analyze-incident', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is missing. AI analysis unavailable.',
        });
      }

      if (!ai) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }

      const { title, description, category, photoBase64 } = req.body;

      const promptParts: any[] = [];

      if (photoBase64 && typeof photoBase64 === 'string') {
        const matches = photoBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches) {
          promptParts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      }

      promptParts.push({
        text: `You are an expert Environmental Health & Safety (EHS) officer for a university in Thailand.
Analyze this reported environmental incident:
Title: ${title || 'N/A'}
User-selected Category: ${category || 'N/A'}
Description: ${description || 'N/A'}

Provide a helpful, professional assessment response in JSON format matching this schema:
{
  "suggestedCategory": "infrastructure_utilities | traffic | water | air | noise | odor | waste | vector | others",
  "urgency": "low | medium | high | critical",
  "recommendedDepartment": "string in Thai and English (e.g. 'Physical Plant & Sanitation / สำนักกายภาพและสิ่งแวดล้อม')",
  "initialSafetyAdvice": "Immediate action advice for student/staff safety (in Thai)",
  "initialSafetyAdviceEn": "Immediate action advice in English",
  "aiSummary": "1-2 sentence refined summary in Thai",
  "aiSummaryEn": "1-2 sentence refined summary in English"
}`
      });

      // Resilient model calling with fallback chain
      const candidateModels = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let parsedData: any = null;
      let lastError: any = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: promptParts },
            config: {
              responseMimeType: 'application/json',
            },
          });

          const rawText = response.text?.trim() || '{}';
          const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
          parsedData = JSON.parse(cleanedText);
          if (parsedData && (parsedData.initialSafetyAdvice || parsedData.suggestedCategory)) {
            break; // Successfully generated and parsed
          }
        } catch (callErr: any) {
          console.warn(`[Gemini API] Model ${modelName} encountered error, trying fallback if available:`, callErr?.message || callErr);
          lastError = callErr;
        }
      }

      // If all live API attempts fail due to temporary 503 high demand or connectivity, provide intelligent contextual EHS evaluation
      if (!parsedData) {
        console.warn('[Gemini API] Utilizing domain-expert fallback due to upstream unavailability:', lastError?.message);

        const textContent = `${title || ''} ${description || ''}`.toLowerCase();
        let fallbackCategory = category || 'others';
        let fallbackUrgency: 'low' | 'medium' | 'high' | 'critical' = 'medium';
        let fallbackDept = 'กองกายภาพและสิ่งแวดล้อม มหาวิทยาลัย (Physical Plant & Environment)';
        let safetyAdviceTh = 'หลีกเลี่ยงการสัมผัสหรือเข้าใกล้พื้นที่เกิดเหตุ รักษาระยะห่างเพื่อความปลอดภัย';
        let safetyAdviceEn = 'Avoid direct contact with the affected area and maintain a safe distance.';

        if (textContent.includes('งู') || textContent.includes('snake') || textContent.includes('ต่อ') || textContent.includes('แตน') || textContent.includes('ผึ้ง') || textContent.includes('สารเคมี') || textContent.includes('toxic') || textContent.includes('chemical')) {
          fallbackCategory = textContent.includes('สารเคมี') || textContent.includes('chemical') ? 'air' : 'vector';
          fallbackUrgency = 'critical';
          fallbackDept = 'ศูนย์ความปลอดภัยและป้องกันอัคคีภัย / หน่วยกู้ชีพฉุกเฉิน มหาวิทยาลัย';
          safetyAdviceTh = 'กั้นพื้นที่เกิดเหตุทันที ห้ามเข้าใกล้หรือรบกวนสัตว์มีพิษ/สารเคมีโดยเด็ดขาด และรอเจ้าหน้าที่ผู้เชี่ยวชาญเข้าปฏิบัติการ';
          safetyAdviceEn = 'Cordon off the area immediately. Do not approach hazardous creatures or chemicals. Await specialist responders.';
        } else if (category === 'infrastructure_utilities' || textContent.includes('ไฟดับ') || textContent.includes('ไฟฟ้า') || textContent.includes('อาคารชำรุด') || textContent.includes('ท่อแตก')) {
          fallbackCategory = 'infrastructure_utilities';
          fallbackDept = 'งานระบบสาธารณูปโภคและซ่อมบำรุงอาคาร คณะและมหาวิทยาลัย';
          safetyAdviceTh = 'ระวังอันตรายจากกระแสไฟฟ้ารั่วหรือเศษวัสดุตกหล่น หลีกเลี่ยงการใช้อุปกรณ์ที่ชำรุด';
          safetyAdviceEn = 'Beware of electrical hazards or falling debris. Do not touch damaged equipment.';
        } else if (category === 'traffic' || textContent.includes('รถติด') || textContent.includes('อุบัติเหตุ') || textContent.includes('สัญญาณไฟ')) {
          fallbackCategory = 'traffic';
          fallbackUrgency = textContent.includes('อุบัติเหตุ') ? 'critical' : 'medium';
          fallbackDept = 'หน่วยรักษาความปลอดภัยและจราจร มหาวิทยาลัยขอนแก่น';
          safetyAdviceTh = 'ชะลอความเร็ว ปฏิบัติตามสัญญาณเตือน และอำนวยความสะดวกให้ยานพาหนะฉุกเฉิน';
          safetyAdviceEn = 'Reduce speed, heed warning signs, and yield to emergency response vehicles.';
        } else if (category === 'water' || textContent.includes('น้ำ')) {
          fallbackCategory = 'water';
          fallbackDept = 'กองกายภาพและสิ่งแวดล้อม (งานระบบระบายน้ำและสุขาภิบาล)';
          safetyAdviceTh = 'ระมัดระวังพื้นลื่น และหลีกเลี่ยงการสัมผัสน้ำขังหรือน้ำเสียโดยตรง';
          safetyAdviceEn = 'Caution: Slippery surfaces. Avoid direct contact with stagnant or wastewater.';
        } else if (category === 'air' || textContent.includes('ฝุ่น') || textContent.includes('ควัน')) {
          fallbackCategory = 'air';
          fallbackDept = 'หน่วยอนามัยสิ่งแวดล้อมและอาชีวอนามัย มหาวิทยาลัย';
          safetyAdviceTh = 'สวมหน้ากากอนามัยป้องกันฝุ่นละออง/ควัน และหลีกเลี่ยงกิจกรรมกลางแจ้งในบริเวณดังกล่าว';
          safetyAdviceEn = 'Wear protective masks and avoid outdoor strenuous activities in the affected zone.';
        } else if (category === 'waste' || textContent.includes('ขยะ')) {
          fallbackCategory = 'waste';
          fallbackDept = 'งานจัดการขยะมูลฝอยและสิ่งแวดล้อม มหาวิทยาลัย';
          safetyAdviceTh = 'ทิ้งขยะในจุดที่จัดเตรียมไว้ หลีกเลี่ยงการสัมผัสขยะมีพิษหรือของมีคม';
          safetyAdviceEn = 'Dispose of waste in designated receptacles and avoid contact with sharp or hazardous items.';
        }

        parsedData = {
          suggestedCategory: fallbackCategory,
          urgency: fallbackUrgency,
          recommendedDepartment: fallbackDept,
          initialSafetyAdvice: safetyAdviceTh,
          initialSafetyAdviceEn: safetyAdviceEn,
          aiSummary: `รายงานได้รับการประเมินความปลอดภัยและส่งต่อให้ ${fallbackDept} ตรวจสอบ`,
          aiSummaryEn: `Report preliminarily screened and routed to ${fallbackDept} for operational response.`,
          isFallback: true,
        };
      }

      res.json({ success: true, analysis: parsedData });
    } catch (err: any) {
      console.error('Error analyzing incident:', err);
      res.status(500).json({ error: err.message || 'Failed to analyze incident with AI' });
    }
  });

  // Vite middleware for dev / static serving for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[U-Safe Envi] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
