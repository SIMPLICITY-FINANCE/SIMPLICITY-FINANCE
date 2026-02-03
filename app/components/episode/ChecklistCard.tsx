"use client";

import { useState, ReactNode } from "react";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistCardProps {
  icon: ReactNode;
  title: string;
  items: ChecklistItem[];
}

export function ChecklistCard({ icon, title, items }: ChecklistCardProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-5 h-5 flex items-center justify-center text-gray-700">
          {icon}
        </div>
        <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <input
              type="checkbox"
              checked={checkedItems.has(item.id)}
              onChange={() => toggleItem(item.id)}
              className="mt-0.5 flex-shrink-0 w-3.5 h-3.5 rounded border-gray-300"
              id={`item-${item.id}`}
            />
            <label
              htmlFor={`item-${item.id}`}
              className="text-[11px] text-gray-900 leading-snug cursor-pointer"
            >
              {item.text}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
