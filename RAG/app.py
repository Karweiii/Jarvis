from fastapi import FastAPI, HTTPException
from chatbot import get_response
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    session_id: str
    user_input: str
    user_name: str
    preferred_field: str
    qualifications: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat",response_model=ChatResponse)
async def chat(request:ChatRequest):
    try:
        response=get_response(request.session_id,request.user_input,request.user_name,request.preferred_field,request.qualifications)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))

@app.on_event("shutdown")
def shutdown_event():
    print("Shutting down server...")

@app.post("/shutdown")
async def shutdown():
    # This will trigger the shutdown event
    raise SystemExit("Server is shutting down")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)