import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-white border-t pt-16 mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-12 pb-12">
          {/* Brand & About */}
          <div className="md:w-3/5 lg:w-1/3">
            <img src={assets.logo} className="mb-6 w-32" alt="VERVIX Logo" />
            <p className="text-gray-600 max-w-md leading-relaxed text-sm mb-5">
              <span className="font-bold text-gray-800">VERVIX</span> is a contemporary clothing brand redefining everyday fashion. Our passion is creating styles that empower, inspire, and leave an impression — because you deserve to stand out every day.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-4">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                {/* Instagram */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5v.001"/></svg>
              </a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                {/* Twitter/X */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors">
                {/* Facebook */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 2.1a3.1 3.1 0 013.1 3.1v13.6a3.1 3.1 0 01-3.1 3.1H7A3.1 3.1 0 013.9 18.8V5.2A3.1 3.1 0 017 2.1h10z"/><path d="M16 8.3h-1.6a.6.6 0 00-.6.6v1.6h2.1l-.3 2.4h-1.8V20h-2.5v-7.1h-1.1v-2.4h1.1V8.9A2.4 2.4 0 0115.1 6.8c.4 0 .7 0 0 0h.9V8.3z"/></svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col gap-8 md:flex-row md:justify-end md:items-start">
            <div>
              <p className="text-base font-semibold mb-4 uppercase tracking-wider text-slate-800">Company</p>
              <ul className="flex flex-col gap-2 text-gray-600 text-sm">
                <li><a href="/" className="hover:text-orange-500 transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-orange-500 transition-colors">About Us</a></li>
                <li><a href="/delivery" className="hover:text-orange-500 transition-colors">Delivery</a></li>
                <li><a href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-orange-500 transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <p className="text-base font-semibold mb-4 uppercase tracking-wider text-slate-800">Get In Touch</p>
              <ul className="flex flex-col gap-2 text-gray-600 text-sm">
                <li>
                  <a href="tel:+12124567890" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.82 19.82 0 013 5.16 2 2 0 015 3h3a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.18l-1.27 1.28a16 16 0 006.29 6.29l1.28-1.27a2 2 0 012.18-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z"/></svg>
                    +1-212-456-7890
                  </a>
                </li>
                <li>
                  <a href="mailto:contact@vervix.com" className="hover:text-orange-500 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><polyline points="22,6 12,13 2,6" /></svg>
                    contact@vervix.com
                  </a>
                </li>
                <li className="flex gap-2 text-emerald-800 font-semibold">
                  <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  100% Original Fashion
                </li>
                <li className="flex gap-2 text-emerald-800 font-semibold">
                  <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  Hassle-free Returns
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr />
        {/* Bottom Copyright */}
        <div className="py-5 text-xs text-slate-500 text-center flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <span>
            © 2024 <span className="font-bold text-orange-500 tracking-wide">VERVIX</span> — All Rights Reserved.
          </span>
          <span className="italic">Crafted by Syxd Matheen <span className="text-orange-500">♥</span>.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
