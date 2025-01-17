from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import CSVLoader
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())
GOOGLE_API_KEY = os.getenv("GEMINI_API_TOKEN")
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Load the CSV file containing course information
csv_file = "courses.csv"
loader = CSVLoader(csv_file)
loaded_documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
csv_chunks = []

for doc in loaded_documents:
    # Split content into chunks
    chunks = text_splitter.split_text(doc.page_content)
    csv_chunks.extend(chunks)

# Vectorize the chunks using Google Generative AI Embeddings
gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
db = FAISS.from_texts(csv_chunks, gemini_embeddings)

# Save the vector database locally
db.save_local("course_vdb")
