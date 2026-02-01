interface NotificationBadgeProps {
  count: number;
  max?: number;
}

export function NotificationBadge({ count, max = 99 }: NotificationBadgeProps) {
  if (count === 0) return null;
  
  const displayCount = count > max ? `${max}+` : count;
  
  return (
    <div className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-md ring-1 ring-background">
      <span className="text-white text-[8px] font-bold px-0.5">
        {displayCount}
      </span>
    </div>
  );
}