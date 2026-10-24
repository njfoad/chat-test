import { useState, useRef } from 'react';
import { AvayaChatWidget, ChatBridge, useChat } from 'chat-engine';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Reference to hook into the internal chat engine (optional, but good for boilerplate)
  const chatRef = useRef<ReturnType<typeof useChat> | null>(null);

  // Configure the headless Avaya Engine
  const chatConfig = {
    host: "core.showmeavayacom.ec.avayacloud.com",
    integrationId: "018d0110121b7db9c9edc75e55", // Replace with your actual integration ID
    displayName: "Guest User",
    attributes: {
      launchSource: "website_floating_icon",
      previousTranscript: ""
    },
    auth: {
      userId: "guest.user@email.com",
      userName: "Guest User"
    }
  };

  // Optional observers for monitoring chat activity
  const handleIncomingMessage = (latestMessage: any) => {
    const isAgent = latestMessage?.senderParticipant?.participantType === 'AGENT';
    if (isAgent) {
      const text = latestMessage?.body?.elementText?.text || '';
      console.log("[API Monitor]: Agent said:", text);
    }
  };

  const handleTypingChange = (isAgentTyping: boolean, participants: any[]) => {
    if (isAgentTyping) {
      console.log("[API Monitor]: An agent is typing...", participants);
    }
  };

  return (
    <div style={{ backgroundColor: '#F4F7F9', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: '40px' }}>
      
      {/* --- YOUR MAIN APPLICATION UI GOES HERE --- */}
      <main style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ border: '2px dashed #B0C4DE', padding: '60px 20px', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
          <h1 style={{ color: '#102A43', margin: '0 0 16px 0' }}>Your application goes in here</h1>
          <p style={{ color: '#5F7386', fontSize: '16px', marginBottom: '24px' }}>
            The Avaya Omni Chat Engine is loaded and ready. 
            Click the bubble in the bottom right to start chatting.
          </p>
          <button 
            onClick={() => setIsChatOpen(true)} 
            style={{ 
              backgroundColor: '#0033A0', color: 'white', border: 'none', 
              padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            Open Chat Programmatically
          </button>
        </div>
      </main>

      {/* --- AVAYA CHAT WIDGET --- */}
      <AvayaChatWidget 
        config={chatConfig} 
        showBubble={true} 
        isOpen={isChatOpen} 
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
      >
        <ChatBridge 
          chatRef={chatRef} 
          onMessage={handleIncomingMessage}
          onTypingChange={handleTypingChange}
        />
      </AvayaChatWidget>
      
    </div>
  );
}