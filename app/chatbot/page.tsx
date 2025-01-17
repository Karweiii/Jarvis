'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, User, Bot } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
}


export default function RAGChatbot() {

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const [userName, setUserName] = useState('') 
  const [preferredField, setPrefferedField] = useState('') 
  const [educationBg, setEducationBg] = useState('') 
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingSpeed = 10 // milliseconds per character
  const [sessionId, setSessionId] = useState<string>(() => {
    // Generate a session ID on component mount
    const sessionId = crypto.randomUUID();
    return sessionId;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking, isTyping])

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile'); // Assuming this is your API endpoint
        if (response.ok) {
          const profile = await response.json();
          console.log(profile.roleData[0]);
          setPrefferedField(profile.roleData[0].preferredField);
          setEducationBg(profile.roleData[0].educationBg);
          setUserName(profile.user.username);
          // Set initial message with the username
          setMessages([{
            role: 'assistant',
            content: `Hello ${profile.user.username}! I'm Jarvis, an AI course consultant chatbot. I can help you with everything about the university courses. How can I help you today?`,
            isTyping: true
          }]);
          await typeMessage(`Hello ${profile.user.username}! I'm Jarvis, an AI course consultant chatbot. I can help you with everything about the university courses. How can I help you today?`);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    fetchProfile();
  }, [preferredField]);


  const typeMessage = (message: string) => {
    return new Promise<void>((resolve) => {
      let i = 0
      const intervalId = setInterval(() => {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1]
          const updatedMessages = prev.slice(0, -1)
          return [
            ...updatedMessages,
            { ...lastMessage, content: message.slice(0, i), isTyping: true }
          ]
        })
        i++
        if (i > message.length) {
          clearInterval(intervalId)
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1]
            const updatedMessages = prev.slice(0, -1)
            return [
              ...updatedMessages,
              { ...lastMessage, isTyping: false }
            ]
          })
          setIsTyping(false)
          resolve()
        }
      }, typingSpeed)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId, // You might want to generate this dynamically
          user_input: input,
          user_name: userName,
          preferred_field: preferredField,
          qualifications:educationBg
          
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setIsThinking(false)
      setIsTyping(true)
      setMessages(prev => [...prev, { role: 'assistant', content: '', isTyping: true }])
      await typeMessage(data.response)
    } catch (error) {
      console.error('Error:', error)
      setIsThinking(false)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', isTyping: false }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-[92vh] bg-background">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold flex flex-row items-center"><Bot className='mx-2'/>AI Course Consultant Chatbot</h1>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Assistant" />
                  <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg px-3 py-2 max-w-[80%] ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted chat-message'}`}>
                {m.content}
                {m.isTyping && <span className="typing-animation" />}
              </div>
              {m.role === 'user' && (
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Assistant" />
                <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-3 py-2">
                <span className="thinking-animation">Thinking</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <footer className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isThinking || isTyping}
          />
          <Button type="submit" disabled={isThinking || isTyping}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </footer>
    </div>
  )
}