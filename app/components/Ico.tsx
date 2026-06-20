interface IcoProps {
  name: string;
  size?: number;
  stroke?: number;
}

export default function Ico({ name, size = 18, stroke = 1.8 }: IcoProps) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "sun":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
          <line x1="4.9" y1="4.9" x2="7" y2="7" />
          <line x1="17" y1="17" x2="19.1" y2="19.1" />
          <line x1="4.9" y1="19.1" x2="7" y2="17" />
          <line x1="17" y1="7" x2="19.1" y2="4.9" />
        </svg>
      );
    case "moon":
      return (
        <svg {...p}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      );
    case "menu":
      return (
        <svg {...p}>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      );
    case "close":
      return (
        <svg {...p}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case "play":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <polygon points="6 4 20 12 6 20 6 4" />
        </svg>
      );
    case "pause":
      return (
        <svg {...p}>
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      );
    case "exit":
      return (
        <svg {...p}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...p}>
          <path d="M6 4h12v4a6 6 0 0 1-12 0V4z" />
          <path d="M6 6H4a2 2 0 0 0 0 4h2" />
          <path d="M18 6h2a2 2 0 0 1 0 4h-2" />
          <line x1="12" y1="14" x2="12" y2="18" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
      );
    case "grid":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "chevL":
      return (
        <svg {...p}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      );
    case "google":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 10.2v3.9h5.4c-.24 1.4-1.7 4.1-5.4 4.1-3.25 0-5.9-2.7-5.9-6s2.65-6 5.9-6c1.85 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.6 12 2.6 6.9 2.6 2.8 6.7 2.8 12s4.1 9.4 9.2 9.4c5.3 0 8.8-3.7 8.8-9 0-.6-.06-1-.15-1.5z"
          />
        </svg>
      );
    case "github":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.9c-2.78.62-3.37-1.2-3.37-1.2-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.92-2.34 4.79-4.57 5.04.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
        </svg>
      );
    default:
      return null;
  }
}
