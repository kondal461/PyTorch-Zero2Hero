import React from 'react';
import { CURRICULUM } from '../constants';
import { Topic, Difficulty } from '../types';
import { BookOpen, ChevronRight, Layers, Brain, Network, Zap } from 'lucide-react';

interface SidebarProps {
  currentTopic: Topic | null;
  onSelectTopic: (topic: Topic) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTopic, onSelectTopic, isOpen }) => {
  // Helper to get icon based on difficulty
  const getIcon = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.BASICS: return <Layers size={16} />;
      case Difficulty.INTERMEDIATE: return <Network size={16} />;
      case Difficulty.ADVANCED: return <Brain size={16} />;
      case Difficulty.EXPERT: return <Zap size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-dark-900 border-r border-gray-800 w-72 transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:shrink-0`}
    >
      <div className="p-6 flex items-center space-x-3 border-b border-gray-800 bg-dark-900/95 sticky top-0 z-10 backdrop-blur">
        <div className="w-8 h-8 bg-gradient-to-br from-torch-500 to-torch-700 rounded-lg flex items-center justify-center shadow-lg shadow-torch-500/20">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          TorchMaster
        </span>
      </div>

      <div className="p-4 space-y-8">
        {CURRICULUM.map((module, moduleIdx) => (
          <div key={moduleIdx}>
            <h3 className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center space-x-2">
              {getIcon(module.difficulty)}
              <span>{module.difficulty}</span>
            </h3>
            <ul className="space-y-1">
              {module.topics.map((topic) => {
                const isActive = currentTopic?.id === topic.id;
                return (
                  <li key={topic.id}>
                    <button
                      onClick={() => onSelectTopic(topic)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${
                        isActive
                          ? 'bg-torch-600/20 text-torch-400 border border-torch-600/20'
                          : 'text-gray-400 hover:bg-[#2d2d2d] hover:text-gray-200'
                      }`}
                    >
                      <span className="truncate">{topic.title}</span>
                      {isActive && <ChevronRight size={14} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="p-4 mt-4 border-t border-gray-800 text-xs text-gray-600 text-center">
        Powered by Gemini 2.5 Flash
      </div>
    </aside>
  );
};

export default Sidebar;