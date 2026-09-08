import { Link } from 'react-router-dom'
import {
  Hotel,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Send,
  Music2,
  Linkedin,
} from 'lucide-react'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Rooms', to: '/rooms' },
  { label: 'Bookings', to: '/customer/bookings' },
  { label: 'About Us', href: '#' },
  { label: 'Contact', href: '#' },
]

const contactDetails = [
  { icon: MapPin, text: 'Phnom Penh, Cambodia' },
  { icon: Phone, text: '+855 978868689' },
  { icon: Mail, text: 'vanna@hotel.com' },
  { icon: Clock, text: '24/7 Customer Support' },
]

const socialLinks = [
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Telegram', icon: Send, href: '#' },
  { label: 'TikTok', icon: Music2, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Hotel Brand */}
          <div>
            <div className="flex items-center gap-2 text-white">
              <Hotel className="h-5 w-5 text-brand-300" />
              <span className="text-base font-semibold tracking-tight">Grandview Hotel</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Experience comfort, luxury, and exceptional hospitality during your stay.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="text-slate-400 transition-colors duration-150 hover:text-white">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-slate-400 transition-colors duration-150 hover:text-white">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              {contactDetails.map((detail) => (
                <li key={detail.text} className="flex items-start gap-2.5">
                  <detail.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  <span>{detail.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold text-white">Follow Us</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-colors duration-150 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {year} Grandview Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
