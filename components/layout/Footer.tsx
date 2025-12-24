import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left: Copyright */}
          <div className="text-sm text-gray-600">
            <p>© {currentYear} 廃棄物見える化システム. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-1">
              Demo Version - For Internal Use Only
            </p>
          </div>

          {/* Center: Links */}
          <div className="flex space-x-6 text-sm">
            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              使い方ガイド
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              データ出力
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              お問い合わせ
            </a>
          </div>

          {/* Right: Version Info */}
          <div className="text-sm text-gray-500">
            <p className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium">
                v1.0.0-demo
              </span>
              <span>Next.js 15 + Prisma</span>
            </p>
          </div>
        </div>

        {/* Bottom: Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span>📊 データ更新: {new Date().toLocaleString('ja-JP')}</span>
            <span className="hidden sm:inline">|</span>
            <span>🔒 セキュアな環境で運用中</span>
            <span className="hidden sm:inline">|</span>
            <span>🤖 AI最適化ログ: vibelogger</span>
          </div>
        </div>
      </div>
    </footer>
  );
};