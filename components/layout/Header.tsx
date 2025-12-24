'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '全社ダッシュボード', icon: '🏢' },
    { href: '/branches', label: '部門一覧', icon: '🏪' },
    { href: '/sites', label: '現場一覧', icon: '🏗️' },
    { href: '/data', label: 'データ登録', icon: '📝' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                W
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                廃棄物見える化システム
              </h1>
              <p className="text-xs text-gray-500">Waste Management Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                              (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">環境管理部</p>
              <p className="text-xs text-gray-500">デモユーザー</p>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
              👤
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center px-3 py-1 text-xs transition-colors',
                  isActive
                    ? 'text-primary-700'
                    : 'text-gray-600'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="mt-1">{item.label.split('・')[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};