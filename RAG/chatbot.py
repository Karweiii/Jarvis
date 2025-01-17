import os
from dotenv import load_dotenv, find_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import CSVLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# Load environment variables
load_dotenv(find_dotenv())
GOOGLE_API_KEY = os.getenv("GEMINI_API_TOKEN")
LANGCHAIN_API_KEY = os.getenv("LANGCHAIN_API_TOKEN")

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = LANGCHAIN_API_KEY
os.environ["LANGCHAIN_PROJECT"]="pr-wooden-croissant-43"
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

import warnings
warnings.filterwarnings('ignore')

# Create embeddings and retriever
gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

db = FAISS.load_local("course_vdb", gemini_embeddings,allow_dangerous_deserialization=True)
retriever = db.as_retriever()

# define model
model=ChatGoogleGenerativeAI(model="gemini-1.5-pro",convert_system_message_to_human=True)

# Define the system prompt
system_prompt = """
You are JARVIS, an AI course consultant specializing in personalized academic guidance for Sunway University students.
Respond to questions directly related to academic courses, course-related guidance, or specific course details.
If the query falls outside this scope, politely inform the user and provide examples of relevant queries.

When asked about specific course details such as fees, duration, requirements, etc.:
1. Search the provided course information carefully
2. If the exact information is found, provide it precisely as stated in the data
3. For fees, always specify both Malaysian and International student rates if available
4. Include any relevant additional context about the course

If a query falls outside this scope, politely inform the user that while you may know the answer but you specialize in course-related questions and provide examples of relevant queries.

User Profile:
- Name: {user_name}
- Preferred Field of Study: {preferred_field}
- Current Qualifications: {qualifications}

Available Course Information: {context}

When responding to queries about specific course details:
1. Be precise and quote exact figures/requirements from the course data
2. For fees, clearly state "The course fees are RM[amount] for Malaysian students and USD[amount] for international students"
3. Include other relevant details like duration, intake dates, or entry requirements if they're related to the query

For general course recommendations:
1. Consider the user's preferred field and qualifications
2. Provide up to 3 most relevant courses
3. Explain why each course might be suitable

Response Format:
- Clear and concise information
- Exact figures and requirements when available
- Contextual details when relevant
"""

# Create history-aware retriever
retriever_prompt = """
Given a chat history and the latest user question which might reference context in the chat history,
formulate a standalone question which can be understood without the chat history.
Do NOT answer the question, just reformulate it if needed and otherwise return it as is.
"""

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", retriever_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}")
    ]
)

history_aware_retriever = create_history_aware_retriever(model, retriever, contextualize_q_prompt)

# Create the question-answering chain
qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ]
)

question_answer_chain = create_stuff_documents_chain(model, qa_prompt)
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

# Create a conversational chain
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer"
)

def get_personalized_courses(preferred_field: str, qualifications: str, retriever, top_k: int = 5):
    """
    Retrieve courses based on user's preferred field and qualifications
    
    Args:
    - preferred_field: User's area of interest
    - qualifications: User's current educational background
    - retriever: Vector store retriever
    - top_k: Number of courses to retrieve
    
    Returns:
    List of most relevant course documents
    """
    # Create a query that combines user preferences
    query = f"Courses related to {preferred_field} suitable for someone with {qualifications}"
    
    # Perform similarity search
    similar_courses = retriever.invoke(query)
    
    return similar_courses


def get_response(session_id: str, user_input: str, user_name: str = "",preferred_field:str="",qualifications:str="") -> str:

    personalized_courses=get_personalized_courses(preferred_field,qualifications,retriever)

    context = "\n".join([
        f"Course: {course.page_content}" 
        for course in personalized_courses
    ])

    response = conversational_rag_chain.invoke(
        {"input": user_input,
         "user_name": user_name,
        "preferred_field": preferred_field,
        "qualifications": qualifications,
        "context": context
         },
        config={"configurable": {"session_id": session_id}}
    )["answer"]
    return response
