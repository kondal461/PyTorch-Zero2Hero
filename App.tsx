import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MarkdownRenderer from './components/MarkdownRenderer';
import ChatAssistant from './components/ChatAssistant';
import { CURRICULUM } from './constants';
import { Topic, GenerateContentStatus } from './types';
import { generateTutorialContent } from './services/gemini';
import { Menu, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<Topic>(CURRICULUM[0].topics[0]);
  const [content, setContent] = useState<string>('');
  const [status, setStatus] = useState<GenerateContentStatus>('idle');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
        setApiKeyMissing(true);
        return;
    }

    const fetchContent = async () => {
      setStatus('loading');
      setContent(''); // Clear previous content
      
      try {
        const generatedText = await generateTutorialContent(currentTopic.prompt);
        setContent(generatedText);
        setStatus('success');
      } catch (error) {
        console.error("Failed to fetch content", error);
        setStatus('error');
      }
    };

    fetchContent();
  }, [currentTopic]);

  if (apiKeyMissing) {
      return (
          <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white p-4">
              <div className="max-w-md text-center">
                  <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
                  <p className="text-gray-400">
                      Missing <code>process.env.API_KEY</code>. Please configure your environment with a valid Google Gemini API key to use this application.
                  </p>
              </div>
          </div>
      )
  }

  return (
    <div className="flex min-h-screen bg-[#121212]">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 w-full bg-dark-900 z-30 border-b border-gray-800 flex items-center p-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white mr-4">
          <Menu size={24} />
        </button>
        <span className="font-bold text-white">TorchMaster</span>
      </div>

      {/* Sidebar */}
      <Sidebar 
        currentTopic={currentTopic} 
        onSelectTopic={(t) => {
          setCurrentTopic(t);
          setSidebarOpen(false);
          window.scrollTo(0,0);
        }} 
        isOpen={sidebarOpen}
      />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:ml-0 pt-16 lg:pt-0 px-4 lg:px-12 py-8 lg:py-12 max-w-5xl mx-auto transition-all duration-300">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span className="uppercase tracking-wider font-semibold">{currentTopic.difficulty}</span>
          <span>/</span>
          <span className="text-torch-400">{currentTopic.title}</span>
        </div>

        {/* Header */}
        <header className="mb-10 border-b border-gray-800 pb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {currentTopic.title}
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Master this concept with AI-generated explanations and live code examples.
          </p>
        </header>

        {/* Content Loading State */}
        {status === 'loading' && (
          <div className="space-y-6 animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
            <div className="h-64 bg-gray-800 rounded mt-8 border border-gray-700"></div>
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center">
                    <Flame size={48} className="text-torch-500 animate-bounce mb-4" />
                    <span className="text-gray-500">Generating personalized tutorial...</span>
                </div>
            </div>
          </div>
        )}

        {/* Content Error State */}
        {status === 'error' && (
          <div className="bg-red-900/20 border border-red-900 p-6 rounded-lg text-center">
            <p className="text-red-400 mb-2">Failed to load content.</p>
            <button 
              onClick={() => setCurrentTopic({...currentTopic})} 
              className="text-sm text-white bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content Success State */}
        {status === 'success' && (
          <div className="prose prose-invert max-w-none">
            <MarkdownRenderer content={content} />
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-20 pt-8 border-t border-gray-800 flex justify-between">
            {/* Logic to find prev/next topic could go here for "Next Lesson" button */}
            <div className="text-gray-500 text-sm">
                TorchMaster &copy; {new Date().getFullYear()}
            </div>
        </div>
      </main>

      <ChatAssistant />
    </div>
  );
};

export default App;