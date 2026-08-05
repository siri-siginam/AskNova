import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_FAQS } from './src/data/initialFaqs';
import { NLPMatchingEngine } from './src/server/nlpEngine';
import { generateGroundedAnswer } from './src/server/geminiService';
import { FAQItem, CreateFAQDTO, FAQStats } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory State Management
  let faqs: FAQItem[] = [...INITIAL_FAQS];
  const nlpEngine = new NLPMatchingEngine(faqs);

  let totalQueriesAnswered = 0;
  let helpfulCount = 0;
  let unhelpfulCount = 0;

  // --- API Routes ---

  // Healthcheck
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'Ask Nova', totalFaqs: faqs.length });
  });

  // Chat query matching endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { query, forceAiMode } = req.body;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Query parameter string is required' });
        return;
      }

      totalQueriesAnswered++;

      const matchResult = nlpEngine.findBestMatch(query);

      // Decide whether to use FAQ or Gemini
const shouldUseGemini =
  forceAiMode ||
  !matchResult.matchedFaq ||
  matchResult.isAiFallback ||
  matchResult.confidenceScore < 0.75;

if (shouldUseGemini) {
  const suggestedFaqs = matchResult.alternativeMatches.map((m) => ({
    question: m.faq.question,
    answer: m.faq.answer,
  }));

  const aiAnswer = await generateGroundedAnswer(
    query,
    matchResult.queryCategoryGuess,
    suggestedFaqs
  );

  matchResult.isAiFallback = true;
  matchResult.aiGroundedAnswer = aiAnswer;
}

      res.json({
        query,
        matchResult,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      res.status(500).json({ error: 'Failed to process chat query', message: err.message });
    }
  });

  // GET FAQs with search and category filtering
  app.get('/api/faqs', (req: Request, res: Response) => {
    const { category, subcategory, search } = req.query;
    let filtered = [...faqs];

    if (category && typeof category === 'string' && category !== 'All') {
      filtered = filtered.filter(f => f.category === category);
    }

    if (subcategory && typeof subcategory === 'string' && subcategory !== 'All') {
      filtered = filtered.filter(f => f.subcategory === subcategory);
    }

    if (search && typeof search === 'string') {
      const term = search.toLowerCase().trim();
      filtered = filtered.filter(
        f =>
          f.question.toLowerCase().includes(term) ||
          f.answer.toLowerCase().includes(term) ||
          f.tags.some(t => t.toLowerCase().includes(term)) ||
          f.subcategory.toLowerCase().includes(term)
      );
    }

    res.json({
      total: filtered.length,
      faqs: filtered
    });
  });

  // POST Add New FAQ
  app.post('/api/faqs', (req: Request, res: Response) => {
    try {
      const body: CreateFAQDTO = req.body;
      if (!body.question || !body.answer || !body.category) {
        res.status(400).json({ error: 'Question, Answer, and Category are required' });
        return;
      }

      const newId = `CUSTOM-${Date.now()}`;
      const newFaq: FAQItem = {
        id: newId,
        category: body.category,
        subcategory: body.subcategory || 'General',
        question: body.question,
        answer: body.answer,
        tags: body.tags || [body.category.toLowerCase()]
      };

      faqs.unshift(newFaq);
      nlpEngine.updateDataset(faqs);

      res.status(201).json({ message: 'FAQ created successfully', faq: newFaq });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create FAQ', message: err.message });
    }
  });

  // PUT Update FAQ
  app.put('/api/faqs/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = faqs.findIndex(f => f.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }

    const updatedFaq: FAQItem = {
      ...faqs[index],
      ...req.body,
      id // retain ID
    };

    faqs[index] = updatedFaq;
    nlpEngine.updateDataset(faqs);

    res.json({ message: 'FAQ updated successfully', faq: updatedFaq });
  });

  // DELETE FAQ
  app.delete('/api/faqs/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLength = faqs.length;
    faqs = faqs.filter(f => f.id !== id);

    if (faqs.length === initialLength) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }

    nlpEngine.updateDataset(faqs);
    res.json({ message: 'FAQ deleted successfully' });
  });

  // GET Categories list and counts
  app.get('/api/categories', (_req: Request, res: Response) => {
    const categoryCounts: Record<string, number> = {};
    for (const faq of faqs) {
      categoryCounts[faq.category] = (categoryCounts[faq.category] || 0) + 1;
    }
    res.json({ categoryCounts });
  });

  // POST Feedback
  app.post('/api/feedback', (req: Request, res: Response) => {
    const { feedback } = req.body;
    if (feedback === 'helpful') {
      helpfulCount++;
    } else if (feedback === 'unhelpful') {
      unhelpfulCount++;
    }
    res.json({ success: true, helpfulCount, unhelpfulCount });
  });

  // GET System Stats
  app.get('/api/stats', (_req: Request, res: Response) => {
    const categoryCounts: Record<string, number> = {};
    for (const faq of faqs) {
      categoryCounts[faq.category] = (categoryCounts[faq.category] || 0) + 1;
    }

    const stats: FAQStats = {
      totalFaqs: faqs.length,
      categoryCounts,
      totalQueriesAnswered,
      helpfulCount,
      unhelpfulCount
    };

    res.json(stats);
  });

  // --- Vite Middleware / Static File Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Ask Nova Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Ask Nova Server] Fatal Error starting server:', err);
});
