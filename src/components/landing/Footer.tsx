import { Instagram, Facebook } from 'lucide-react';

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="py-12 bg-gray-100 text-gray-900">
      <div className="container max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="Heavenly Lash Studio Logo" 
              className="h-10 md:h-12 w-auto object-contain"
            />
            <span className="font-sans text-xl md:text-2xl font-medium">Heavenly Lash Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://www.instagram.com/heavenlylashstudio_zw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.tiktok.com/@heavenlylashstudio_zw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </a>
            <a 
              href="https://www.facebook.com/heavenlylashstudio_zw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 Heavenly Lash Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
