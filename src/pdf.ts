import { resolvePDFJS } from 'pdfjs-serverless';
import { HEURISTIC_ORDER, AGENT_PROFILES } from './agents';
import type { AgentName } from './agents';

export interface PdfProcessResult {
  title: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  _meta: {
    agent: string;
    attempts: number;
  };
}

export const processPdf = async (
  url: string,
  agent: AgentName = "heuristic"
): Promise<PdfProcessResult | null> => {
  if (agent === "heuristic") {
    return processPdfWithHeuristic(url);
  }

  return processPdfWithAgent(url, agent, 1);
};

async function processPdfWithHeuristic(url: string): Promise<PdfProcessResult | null> {
  let attempts = 0;

  for (const agentName of HEURISTIC_ORDER) {
    attempts++;
    console.log(`[heuristic-pdf] Trying agent: ${agentName}`);

    try {
      const result = await processPdfWithAgent(url, agentName, attempts);
      if (result && result.length > 0) {
        console.log(`[heuristic-pdf] Success with agent: ${agentName}`);
        return result;
      }
      console.log(`[heuristic-pdf] Agent ${agentName} got empty PDF`);
    } catch (error) {
      console.log(`[heuristic-pdf] Agent ${agentName} failed:`, error);
    }
  }

  console.log(`[heuristic-pdf] All agents failed after ${attempts} attempts`);
  return null;
}

async function processPdfWithAgent(
  url: string,
  agentName: string,
  attempts: number
): Promise<PdfProcessResult | null> {
  try {
    console.log(`Starting PDF processing for URL: ${url}`);

    const profile = AGENT_PROFILES[agentName];
    if (!profile) {
      throw new Error(`Unknown agent: ${agentName}`);
    }

    // Fetch the PDF file as binary
    console.log("Fetching PDF file...");
    const response = await fetch(url, {
      headers: profile.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    console.log("PDF fetch successful, converting to arrayBuffer...");
    const arrayBuffer = await response.arrayBuffer();
    console.log(`ArrayBuffer size: ${arrayBuffer.byteLength} bytes`);

    // Initialize PDF.js
    console.log("Initializing PDF.js...");
    const pdfjsLib = await resolvePDFJS();

    // Load the PDF document
    console.log("Loading PDF document...");
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });
    const pdfDocument = await loadingTask.promise;
    console.log(`PDF loaded successfully. Number of pages: ${pdfDocument.numPages}`);

    // Get metadata
    let title = '';
    try {
      console.log("Getting PDF metadata...");
      const metadata = await pdfDocument.getMetadata();
      const info = metadata.info as Record<string, any>;
      title = info?.Title || url.split('/').pop() || 'Untitled PDF';
      console.log(`PDF title: ${title}`);
    } catch (error) {
      console.error("Error getting metadata:", error);
      title = url.split('/').pop() || 'Untitled PDF';
    }

    // Extract text from all pages
    console.log("Extracting text from PDF...");
    let allText = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      console.log(`Processing page ${i} of ${pdfDocument.numPages}...`);
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      allText += pageText + '\n\n';
    }

    // Clean the text
    console.log("Cleaning extracted text...");
    const cleanedText = cleanString(allText);

    // Convert to markdown
    console.log("Converting to markdown...");
    const markdown = convertPdfTextToMarkdown(cleanedText, title);

    return {
      title,
      content: cleanedText,
      textContent: markdown,
      length: cleanedText.length,
      excerpt: cleanedText.substring(0, 150) + '...',
      _meta: {
        agent: agentName,
        attempts,
      },
    };
  } catch (e) {
    console.error('Error processing PDF:', e);
    if (e instanceof Error) {
      console.error(`Error name: ${e.name}, message: ${e.message}`);
      console.error(`Stack trace: ${e.stack}`);
    }
    throw e; // Re-throw for heuristic to catch
  }
}

const convertPdfTextToMarkdown = (text: string, title: string): string => {
  let markdown = `# ${title}\n\n`;
  const paragraphs = text.split(/\n\s*\n/);

  paragraphs.forEach(paragraph => {
    const trimmed = paragraph.trim();
    if (trimmed) {
      if (trimmed.length < 80 && trimmed === trimmed.toUpperCase()) {
        markdown += `\n## ${trimmed}\n\n`;
      } else {
        markdown += `${trimmed}\n\n`;
      }
    }
  });

  return markdown;
};

const cleanString = (str: string) =>
  str
    .replace(/[\s\t\u200B-\u200D\uFEFF]+/g, " ")
    .replace(/^\s+/gm, "")
    .replace(/\n+/g, "\n");
