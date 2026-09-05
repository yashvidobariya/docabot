import { FilePlus, FileArchive, FileText, Image as ImageIcon, FileOutput, Scissors, RotateCw, FileSpreadsheet } from 'lucide-react';

export interface ToolConfig {
  slug: string;
  name: string;
  description: string;
  icon: any;
  route: string;
  category: string;
  supportedFormats: string[];
  seoTitle: string;
  seoDescription: string;
}

export const TOOLS: ToolConfig[] = [
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document.',
    icon: FilePlus,
    route: '/merge-pdf',
    category: 'Organize',
    supportedFormats: ['application/pdf'],
    seoTitle: 'Merge PDF Files Online | Docabot',
    seoDescription: 'Combine multiple PDF files into a single document with Docabot. Upload your files, arrange them in the desired order, and create an optimized PDF.',
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining readability and visual quality.',
    icon: FileArchive,
    route: '/compress-pdf',
    category: 'Optimize',
    supportedFormats: ['application/pdf'],
    seoTitle: 'Compress PDF Online | Docabot',
    seoDescription: 'Reduce your PDF file size online while maintaining quality. Fast, secure, and free PDF compressor by Docabot.',
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF documents into editable Word files.',
    icon: FileText,
    route: '/pdf-to-word',
    category: 'Convert from PDF',
    supportedFormats: ['application/pdf'],
    seoTitle: 'Convert PDF to Word Online | Docabot',
    seoDescription: 'Easily convert your PDF documents to editable Microsoft Word files (DOCX) online with Docabot.',
  },
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Word documents into PDF format.',
    icon: FileOutput,
    route: '/word-to-pdf',
    category: 'Convert to PDF',
    supportedFormats: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    seoTitle: 'Convert Word to PDF Online | Docabot',
    seoDescription: 'Convert Microsoft Word documents (DOC and DOCX) to PDF format easily and securely with Docabot.',
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert PDF pages into JPG images.',
    icon: ImageIcon,
    route: '/pdf-to-jpg',
    category: 'Convert from PDF',
    supportedFormats: ['application/pdf'],
    seoTitle: 'Convert PDF to JPG Online | Docabot',
    seoDescription: 'Extract pages or images from your PDF files and convert them to high-quality JPG images online.',
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images into PDF documents.',
    icon: FileOutput,
    route: '/jpg-to-pdf',
    category: 'Convert to PDF',
    supportedFormats: ['image/jpeg', 'image/jpg'],
    seoTitle: 'Convert JPG to PDF Online | Docabot',
    seoDescription: 'Convert JPG images into a single PDF document. Easily adjust orientation and margins.',
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract selected pages from a PDF.',
    icon: Scissors,
    route: '/split-pdf',
    category: 'Organize',
    supportedFormats: ['application/pdf'],
    seoTitle: 'Split PDF Files Online | Docabot',
    seoDescription: 'Separate one page or a whole set for easy conversion into independent PDF files.',
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages and save the updated document.',
    icon: RotateCw,
    route: '/rotate-pdf',
    category: 'Organize',
    supportedFormats: ['application/pdf'],
    seoTitle: 'Rotate PDF Pages Online | Docabot',
    seoDescription: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
  }
];
