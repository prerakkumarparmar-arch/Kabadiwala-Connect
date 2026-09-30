import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

interface PriceItem {
  id: string;
  category: string;
  hindiName: string;
  marathiName: string;
  pricePerKg: number;
}

const mockPrices: PriceItem[] = [
  { id: '1', category: 'PCB Boards', hindiName: 'पी.सी.बी. बोर्ड (सर्किट)', marathiName: 'पीसीबी बोर्ड्स', pricePerKg: 180 },
  { id: '2', category: 'Copper Cables', hindiName: 'तांबे के तार (केबल)', marathiName: 'तांब्याची केबल', pricePerKg: 450 },
  { id: '3', category: 'Lithium Batteries', hindiName: 'लिथियम बैटरी', marathiName: 'लिथियम बॅटरी', pricePerKg: 300 },
  { id: '4', category: 'CRT / LCD Panels', hindiName: 'टीवी स्क्रीन / एलसीडी', marathiName: 'स्क्रीन / एलसीडी', pricePerKg: 40 },
];

export interface SpokenPriceBoardProps {
  initialLanguage?: 'hi' | 'mr' | 'en';
}

export function SpokenPriceBoard({ initialLanguage = 'hi' }: SpokenPriceBoardProps) {
  const [language, setLanguage] = useState<'hi' | 'mr' | 'en'>(initialLanguage);

  useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  const speakPrice = (item: PriceItem) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis not supported');
      return;
    }
    window.speechSynthesis.cancel();
    const text = language === 'hi' 
      ? `${item.hindiName} का भाव है ${item.pricePerKg} रुपये प्रति किलो।`
      : language === 'mr'
      ? `${item.marathiName} चा भाव ${item.pricePerKg} रुपये प्रति किलो आहे.`
      : `${item.category} price is ${item.pricePerKg} rupees per kg.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
          <span>📊</span> {language === 'hi' ? 'आज का बाज़ार भाव' : language === 'mr' ? 'आजचा बाजार भाव' : "Today's Market Rate"}
        </h3>
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
          <button 
            type="button"
            onClick={() => setLanguage('hi')} 
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${language === 'hi' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            हिंदी
          </button>
          <button 
            type="button"
            onClick={() => setLanguage('mr')} 
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${language === 'mr' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            मराठी
          </button>
          <button 
            type="button"
            onClick={() => setLanguage('en')} 
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${language === 'en' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            English
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {mockPrices.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <h4 className="font-bold text-slate-800 text-xs">
                {language === 'hi' ? item.hindiName : language === 'mr' ? item.marathiName : item.category}
              </h4>
              <p className="text-emerald-600 font-black text-sm">
                ₹{item.pricePerKg} <span className="text-[10px] font-normal text-slate-500">/ kg</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => speakPrice(item)}
              className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-2 rounded-xl font-bold text-xs hover:bg-emerald-200 transition-colors shadow-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'सुनें' : language === 'mr' ? 'ऐका' : 'Listen'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpokenPriceBoard;
