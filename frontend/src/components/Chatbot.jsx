import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: `Hello ${user?.name || 'Talent'}! I'm your Placeshala support assistant. How can I help you today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  if (user?.role === 'ADMIN') return null; // Hide for admin

  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return "Hello! Feel free to ask me about your resume, jobs, or interviews.";
    }
    if (lowerText.includes('resume') && (lowerText.includes('improve') || lowerText.includes('how'))) {
      return "To improve your resume, make sure you upload it in the 'My Profile' section. Our AI will analyze it and give you a score and specific suggestions for missing skills.";
    }
    if (lowerText.includes('job') || lowerText.includes('match') || lowerText.includes('recommend')) {
      return "Go to your Dashboard to see AI-recommended jobs based on your skills! Make sure your profile skills are fully updated for the best results.";
    }
    if (lowerText.includes('interview')) {
      return "You can see your scheduled interviews in the 'Interviews' tab. Also, check the Job Details page for AI-suggested interview questions for that specific role!";
    }
    if (lowerText.includes('skill')) {
      return "Add your technical skills (comma-separated) in your profile. The system compares them against job requirements to calculate your Match Percentage.";
    }
    
    return "I'm a simple support bot right now! Try asking me about 'resume layout', 'improving skills', 'finding jobs', or 'interview tips'.";
  };


  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate thinking
    setTimeout(() => {
      const botMessage = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: getBotResponse(userMessage.text) 
      };
      setMessages(prev => [...prev, botMessage]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-50 transition-transform transform hover:scale-105 active:scale-95"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 flex flex-col overflow-hidden animate-slideIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="font-bold text-sm">Placement Assistant</h3>
                <p className="text-xs text-indigo-100">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-sm' 
                      : 'bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 text-gray-800 dark:text-gray-200 shadow-sm rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
              className="flex-1 bg-gray-100 dark:bg-slate-900 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-gray-200"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
