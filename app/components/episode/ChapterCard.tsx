"use client";

import { Clock } from "lucide-react";
import { useState } from "react";

interface ChapterBullet {
  id: string;
  text: string;
}

interface ChapterCardProps {
  id: string;
  time: string;
  title: string;
  bullets: ChapterBullet[];
}

export function ChapterCard({ id, time, title, bullets }: ChapterCardProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (bulletId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(bulletId)) {
      newChecked.delete(bulletId);
    } else {
      newChecked.add(bulletId);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Clock size={14} />
          <span className="text-[11px] font-medium">{time}</span>
        </div>
        <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-2.5">
        {bullets.map((bullet) => (
          <div key={bullet.id} className="flex gap-3">
            <input
              type="checkbox"
              checked={checkedItems.has(bullet.id)}
              onChange={() => toggleItem(bullet.id)}
              className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded border-gray-300"
              id={`chapter-${id}-bullet-${bullet.id}`}
            />
            <label
              htmlFor={`chapter-${id}-bullet-${bullet.id}`}
              className="text-[11px] text-gray-900 leading-snug cursor-pointer"
            >
              {bullet.text}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
