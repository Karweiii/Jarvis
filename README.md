This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## RAG (Retrieval Augmented Generation) Setup

The project uses RAG to provide accurate course information responses. Here's how to set up the RAG component:

### Prerequisites

1. Install required packages:
   ```bash
   pip install langchain-google-genai langchain faiss-cpu python-dotenv
   ```

2. Set up environment variables in `.env`:
   ```
   GEMINI_API_TOKEN=your_gemini_api_key
   LANGCHAIN_API_KEY=your_langchain_api_key
   ```

### RAG Components

The RAG system consists of three main files:

1. `createvdb.py` - Creates the vector database from course data
2. `chatbot.py` - Implements the RAG-powered chatbot
3. `app.py` - FastAPI server for handling chat requests

### Setup Steps

1. **Prepare the Course Data**
   - Place your course information in `courses.csv`
   - CSV should contain columns: course_name, category, level, description, etc.

2. **Create Vector Database**
   ```bash
   python RAG/createvdb.py
   ```
   This will:
   - Load course data from CSV
   - Split content into chunks
   - Create embeddings using Google's Generative AI
   - Save vector database locally as "course_vdb"

3. **Start the Chat Server**
   ```bash
   python RAG/app.py
   ```
   The server will run on `http://localhost:8000`

### RAG Architecture

```
┌─────────────────┐
│   courses.csv   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Vector DB    │
│    (FAISS)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Chatbot     │
│   (Gemini AI)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   FastAPI      │
│    Server      │
└─────────────────┘
```


## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat&logo=tailwind-css)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)

### AI/ML
![LangChain](https://img.shields.io/badge/LangChain-🦜-white?style=flat)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-Pro-blue?style=flat&logo=google)
![FAISS](https://img.shields.io/badge/FAISS-Vector_DB-red?style=flat)

### Development
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=flat&logo=visual-studio-code)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel)

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **UI Components**: 
  - shadcn/ui
  - Radix UI primitives
- **State Management**: React Hooks
- **TypeScript**: For type safety

### Backend
- **API Server**: FastAPI
- **AI/ML**:
  - LangChain for RAG implementation
  - Google Gemini Pro for text generation
  - FAISS for vector storage
- **Python Libraries**:
  - langchain-google-genai
  - python-dotenv
  - uvicorn

### AI Components
- **Vector Database**: FAISS
- **Embeddings**: Google Generative AI Embeddings
- **LLM**: Gemini-1.5-pro
- **Framework**: LangChain

### Development Tools
- **Version Control**: Git
- **Package Manager**: 
  - npm (Frontend)
  - pip (Backend)
- **Editor**: VS Code
- **API Testing**: Postman

### Infrastructure
- **Development**: Local development server
- **Production**: Vercel (Frontend), Cloud VM (Backend)
- **Environment**: Python 3.8+, Node.js 18+

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
