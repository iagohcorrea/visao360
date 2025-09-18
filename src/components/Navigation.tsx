'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/chat', label: 'Falar com IA' }
  ];

  return (
    <nav>
      <ul className="flex space-x-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`
                  font-inter text-lg md:text-xl font-medium transition-colors duration-200 relative
                  ${isActive 
                    ? 'text-[#1e3a8a] font-semibold' 
                    : 'text-gray-700 hover:text-[#1e3a8a]'
                  }
                `}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#1e3a8a] rounded-full"></span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
