const SOCIAL_LINKS = [
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/00000000000" },
  { id: "instagram", label: "Instagram", href: "https://instagram.com/" },
  { id: "facebook", label: "Facebook", href: "https://facebook.com/" },
  { id: "tiktok", label: "TikTok", href: "https://tiktok.com/@" },
] as const;

function SocialIcon({ id }: { id: string }) {
  switch (id) {
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.36a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.31-1.93 1.36-.5.05-.95.24-3.2-.68-2.7-1.1-4.44-3.86-4.58-4.04-.13-.18-1.1-1.46-1.1-2.78 0-1.32.7-1.97.94-2.24.24-.26.53-.33.7-.33.18 0 .35 0 .5.01.17.01.38-.06.6.45.24.55.8 1.9.87 2.04.07.14.12.3.02.48-.1.18-.15.29-.3.45-.15.16-.31.35-.44.47-.15.14-.3.3-.13.58.17.28.75 1.24 1.62 2.01 1.12.99 2.05 1.3 2.34 1.44.29.14.46.12.63-.07.17-.2.72-.83.91-1.12.19-.29.38-.24.63-.14.26.09 1.62.76 1.9.9.28.14.46.21.53.33.07.12.07.68-.17 1.36Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M13.5 21v-7.6h2.55l.38-3h-2.93V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.24C16.32 4.17 15.42 4.1 14.36 4.1c-2.2 0-3.7 1.34-3.7 3.8v2.5H8.1v3h2.56V21h2.84Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M16.6 5.82c-.9-.9-1.4-2.12-1.4-3.4h-3.1v13.44a2.6 2.6 0 1 1-2.6-2.6c.24 0 .48.03.7.09V10.2a5.7 5.7 0 0 0-.7-.04A5.72 5.72 0 1 0 15.1 15.9V9.03a7.6 7.6 0 0 0 4.4 1.4V7.36a4.7 4.7 0 0 1-2.9-1.54Z" />
        </svg>
      );
    default:
      return null;
  }
}

export function SocialFloatingBar() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.id}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
        >
          <SocialIcon id={social.id} />
        </a>
      ))}
    </div>
  );
}