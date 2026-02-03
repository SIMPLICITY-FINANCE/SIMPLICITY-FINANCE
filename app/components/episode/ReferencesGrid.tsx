"use client";

import { Twitter, Youtube, Mail, Globe } from "lucide-react";

interface Link {
  type: "twitter" | "youtube" | "substack" | "website";
  label: string;
  url: string;
}

interface Reference {
  personName: string;
  personRole: string;
  links: Link[];
}

interface ReferencesGridProps {
  references: Reference[];
}

const iconMap = {
  twitter: Twitter,
  youtube: Youtube,
  substack: Mail,
  website: Globe,
};

export function ReferencesGrid({ references }: ReferencesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {references.map((ref, idx) => (
        <div key={idx}>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {ref.personName}
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            {ref.personRole}
          </p>
          <div className="space-y-2">
            {ref.links.map((link, linkIdx) => {
              const Icon = iconMap[link.type];
              return (
                <a
                  key={linkIdx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <Icon size={16} className="text-gray-700" />
                  <span className="text-xs font-medium text-gray-900">
                    {link.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
