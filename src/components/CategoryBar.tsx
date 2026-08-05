import React from 'react';
import { CategoryName } from '../types';
import { 
  Globe, GraduationCap, Code, Building2, Cpu, ShoppingBag, HeartPulse, 
  Landmark, TrendingUp, Compass, Sprout, ShieldCheck, Bus, Plane, Utensils, 
  History as HistoryIcon, Music2, Trophy, Briefcase, Atom, HelpCircle 
} from 'lucide-react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectSampleQuestion?: (question: string) => void;
}

const CATEGORY_ITEMS: Array<{ name: CategoryName | 'All'; icon: React.FC<{ className?: string }>; sample: string }> = [
  { name: 'All', icon: HelpCircle, sample: 'What is the capital of France?' },
  { name: 'Geography', icon: Globe, sample: 'What is the capital of Japan?' },
  { name: 'Education', icon: GraduationCap, sample: 'What is the JEE exam in India?' },
  { name: 'Programming & Coding', icon: Code, sample: 'What is the difference between let, const, and var in JavaScript?' },
  { name: 'Universities & Schools', icon: Building2, sample: 'How is GPA calculated on a 4.0 scale?' },
  { name: 'Technology', icon: Cpu, sample: 'What is Machine Learning and how does it differ from AI?' },
  { name: 'Products & Shopping', icon: ShoppingBag, sample: 'What is a warranty and how does it differ from a guarantee?' },
  { name: 'Health & Fitness', icon: HeartPulse, sample: 'What is BMI and how is it calculated?' },
  { name: 'Banking & Finance', icon: Landmark, sample: 'What is a Credit Score and why is it important?' },
  { name: 'Stock Market & Investments', icon: TrendingUp, sample: 'What is a SIP in Mutual Funds?' },
  { name: 'Astrology', icon: Compass, sample: 'What is the difference between a Sun sign and a Moon sign?' },
  { name: 'Agriculture', icon: Sprout, sample: 'What is Drip Irrigation and why is it efficient?' },
  { name: 'Government Services', icon: ShieldCheck, sample: 'What documents are required to apply for a Passport?' },
  { name: 'Transportation', icon: Bus, sample: 'What are the main types of Electric Vehicle (EV) chargers?' },
  { name: 'Tourism', icon: Plane, sample: 'What is the best time to book international flight tickets?' },
  { name: 'Food', icon: Utensils, sample: 'What is the difference between Veganism and Vegetarianism?' },
  { name: 'History', icon: HistoryIcon, sample: 'Where was the Indus Valley Civilization located?' },
  { name: 'Culture', icon: Music2, sample: 'What is the most spoken language in the world by native speakers?' },
  { name: 'Sports', icon: Trophy, sample: 'What are the main formats of international cricket?' },
  { name: 'Business', icon: Briefcase, sample: 'What is an MVP in startup business?' },
  { name: 'Science', icon: Atom, sample: 'What is Photosynthesis and how does it work?' },
  { name: 'General Knowledge', icon: HelpCircle, sample: 'Why do leap years happen every four years?' },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectSampleQuestion,
}) => {
  return (
    <div id="ask-nova-category-bar" className="w-full bg-slate-900/60 border-b border-slate-800 py-2.5 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
      <div className="max-w-7xl mx-auto flex items-center space-x-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pr-2 whitespace-nowrap hidden sm:inline">
          Domains:
        </span>
        {CATEGORY_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isSelected = selectedCategory === item.name;
          return (
            <button
              key={item.name}
              id={`cat-chip-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => {
                onSelectCategory(item.name);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
