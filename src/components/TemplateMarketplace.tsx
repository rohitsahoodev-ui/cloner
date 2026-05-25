import React, { useState } from 'react';
import { 
  Search, 
  Flame, 
  Heart, 
  Download, 
  ExternalLink, 
  Compass, 
  Layers, 
  CheckCircle2, 
  Grid, 
  Share2, 
  Check 
} from 'lucide-react';
import { DiscordTemplate } from '../types';

interface TemplateMarketplaceProps {
  templates: DiscordTemplate[];
  onImportToClone: (template: DiscordTemplate) => void;
  onLikeTemplate: (id: string) => void;
}

export default function TemplateMarketplace({ templates, onImportToClone, onLikeTemplate }: TemplateMarketplaceProps) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Distinct tags
  const allTags = Array.from(new Set(templates.flatMap(t => t.tags || [])));

  // Filter pipeline
  const filtered = templates.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                        t.description.toLowerCase().includes(search.toLowerCase());
    const matchTag = selectedTag ? t.tags.includes(selectedTag) : true;
    return matchSearch && matchTag;
  });

  const handleShareLink = (id: string) => {
    const path = `${window.location.origin}/template/${id}`;
    navigator.clipboard.writeText(path).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn animate-duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#170e30] via-[#5865f2]/10 to-[#0e0921] p-6 rounded-2xl border border-[#231b4b] flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 rounded-full border border-amber-500/10 mb-2">
            <Flame className="h-3 w-3 fill-amber-400" />
            TRENDING COMMUNITY BLUEPRINTS
          </span>
          <h2 className="text-xl font-black text-white font-sans tracking-tight">Template Marketplace</h2>
          <p className="text-slate-400 text-xs mt-1">
            Browse and import layouts configured by developers for clean automated server builds.
          </p>
        </div>
        <Compass className="h-10 w-10 text-[#5865F2]/40" />
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0c0919] p-4 rounded-xl border border-[#1f1a3f]">
        
        {/* Search Field */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates, gaming tags..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#14102c] border border-[#231a4c] text-white placeholder-slate-500 focus:outline-none"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        </div>

        {/* Dynamic Tags filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 text-[11px] font-bold font-mono rounded-lg border cursor-pointer transition-all ${
              selectedTag === null 
                ? 'bg-[#5865F2] border-[#5865F2] text-white' 
                : 'bg-[#14102c] border-[#231a4c] text-slate-400 hover:text-white'
            }`}
          >
            All Blueprints
          </button>
          
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1.5 text-[11px] font-bold font-mono rounded-lg border cursor-pointer transition-all ${
                selectedTag === tag 
                  ? 'bg-[#5865F2] border-[#5865F2] text-white' 
                  : 'bg-[#14102c] border-[#231a4c] text-slate-400 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div 
            key={item.id} 
            className="flex flex-col justify-between border border-[#1f1a3f] bg-[#0c091a]/80 rounded-2xl overflow-hidden hover:border-[#5865F2]/45 transition-all relative group"
          >
            {/* Visual Header Image or Banner */}
            <div className="h-28 bg-[#181335] relative p-4 flex items-end">
              {item.bannerUrl ? (
                <img 
                  src={item.bannerUrl} 
                  alt={item.name} 
                  className="absolute inset-0 h-full w-full object-cover opacity-25 group-hover:scale-105 duration-500 transition-transform" 
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-[#5865F2]/10 to-[#bf55ec]/10 opacity-40" />
              )}
              
              <div className="flex items-center space-x-3.5 z-10">
                <img 
                  src={item.iconUrl || 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=100'} 
                  alt={item.name} 
                  className="h-10 w-10 rounded-xl object-cover ring-2 ring-[#5865F2]/30" 
                />
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-none font-sans group-hover:text-[#a2aaff] transition-colors">{item.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 font-semibold">by {item.creator}</p>
                </div>
              </div>
            </div>

            {/* Middle description / stats */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-slate-300 text-xs leading-relaxed font-sans line-clamp-3">
                {item.description}
              </p>

              {/* Counts mapping */}
              <div className="grid grid-cols-3 gap-2 bg-[#120e2a]/50 p-2.5 rounded-lg border border-[#1b1535]">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 font-mono font-bold uppercase">Categories</p>
                  <p className="text-xs font-semibold text-white mt-0.5">{item.categories.length}</p>
                </div>
                <div className="text-center border-x border-[#1b1535]">
                  <p className="text-[10px] text-slate-500 font-mono font-bold uppercase">Roles</p>
                  <p className="text-xs font-semibold text-[#bf55ec] mt-0.5">{item.roles.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 font-mono font-bold uppercase">Emojis</p>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">{item.emojis?.length || 0}</p>
                </div>
              </div>

              {/* Tags and Likes */}
              <div className="flex items-center justify-between pt-1 select-none">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(t => (
                    <span key={t} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1c1737] text-slate-400 border border-[#231d47]">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => onLikeTemplate(item.id)}
                    className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  >
                    <Heart className="h-3.5 w-3.5 fill-rose-500/10 hover:fill-rose-500" />
                    <span className="text-xs font-mono font-bold">{item.likes}</span>
                  </button>
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                    <span>{item.downloads}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="bg-[#0e0a22]/80 px-5 py-3 border-t border-[#1a1435] flex items-center justify-between select-none">
              <button
                onClick={() => handleShareLink(item.id)}
                className="text-[11px] font-mono font-bold text-[#a2aaff] hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Copy API URL</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onImportToClone(item)}
                className="px-4 py-1.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-sans font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-lg"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Import layout to Clone</span>
              </button>
            </div>
            
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 rounded-2xl border border-dashed border-[#231b4e] p-12 text-center text-slate-500 italic">
            No blueprints matching filter parameters. Check other tags or query terms.
          </div>
        )}
      </div>

    </div>
  );
}
