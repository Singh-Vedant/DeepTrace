/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnalysisResponse } from './types';
import { getAnalysisHistory } from './services/api';
import { Navbar, PageView } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScanlineOverlay } from './components/cyber/ScanlineOverlay';
import { AnalysisHistoryModal } from './components/history/AnalysisHistoryModal';
import { DashboardView } from './views/DashboardView';
import { AnalyzeView } from './views/AnalyzeView';
import { ResultsView } from './views/ResultsView';
import { SystemInfoView } from './views/SystemInfoView';
import { AboutView } from './views/AboutView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResponse | null>(null);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState<AnalysisResponse[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistoryList(getAnalysisHistory());
  }, []);

  const handleRefreshHistory = () => {
    setHistoryList(getAnalysisHistory());
  };

  const handleFileChange = (file: File | null, url: string | null) => {
    setSelectedFile(file);
    setPreviewUrl(url);
  };

  const handleAnalysisCompleted = (result: AnalysisResponse) => {
    setCurrentResult(result);
    setCurrentPage('results');
    handleRefreshHistory();
  };

  const handleResetAnalysis = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setCurrentResult(null);
    setCurrentPage('analyze');
  };

  const handleSelectSampleFromDashboard = (type: 'fake' | 'real') => {
    // Generate synthetic test blob
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, type === 'fake' ? '#290615' : '#052219');
      grad.addColorStop(1, '#0e0e17');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = type === 'fake' ? '#ff3366' : '#00ff88';
      ctx.lineWidth = 3;
      ctx.strokeRect(120, 100, 272, 320);

      ctx.beginPath();
      ctx.ellipse(256, 250, 110, 140, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = type === 'fake' ? 'rgba(255, 51, 102, 0.7)' : 'rgba(0, 255, 136, 0.7)';
      ctx.stroke();

      ctx.fillStyle = type === 'fake' ? '#ff3366' : '#00ff88';
      ctx.fillRect(200, 220, 30, 15);
      ctx.fillRect(282, 220, 30, 15);
      ctx.fillRect(220, 320, 72, 10);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(type === 'fake' ? 'SAMPLE_DEEPFAKE_FACE.PNG' : 'SAMPLE_AUTHENTIC_PORTRAIT.PNG', 60, 60);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleName = type === 'fake' ? 'sample_manipulated_face.png' : 'sample_authentic_portrait.png';
        const file = new File([blob], sampleName, { type: 'image/png' });
        const url = URL.createObjectURL(file);
        setSelectedFile(file);
        setPreviewUrl(url);
        setCurrentPage('analyze');
      }
    }, 'image/png');
  };

  const handleSelectHistoryItem = (item: AnalysisResponse) => {
    setCurrentResult(item);
    setCurrentPage('results');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] flex flex-col font-mono relative selection:bg-[#00ff88]/30 selection:text-[#00ff88]">
      {/* Visual Cyber Scanline Overlay */}
      <ScanlineOverlay enabled={scanlinesEnabled} />

      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        hasResult={currentResult !== null}
        onOpenHistory={() => setIsHistoryOpen(true)}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPage === 'dashboard' && (
          <DashboardView
            onNavigateToAnalyze={() => setCurrentPage('analyze')}
            onNavigateToSystem={() => setCurrentPage('system')}
            onSelectSample={handleSelectSampleFromDashboard}
            recentScansCount={historyList.length}
          />
        )}

        {currentPage === 'analyze' && (
          <AnalyzeView
            onAnalysisCompleted={handleAnalysisCompleted}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onSetFile={handleFileChange}
          />
        )}

        {currentPage === 'results' && (
          <ResultsView
            result={currentResult}
            history={historyList}
            onSelectHistoryResult={handleSelectHistoryItem}
            onRefreshHistory={handleRefreshHistory}
            onReset={handleResetAnalysis}
            onNavigateToAnalyze={() => setCurrentPage('analyze')}
            onNavigateToSystem={() => setCurrentPage('system')}
          />
        )}

        {currentPage === 'system' && <SystemInfoView />}

        {currentPage === 'about' && <AboutView />}
      </main>

      {/* System Footer */}
      <Footer />

      {/* History Modal */}
      <AnalysisHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={historyList}
        onSelectResult={handleSelectHistoryItem}
        onRefreshHistory={handleRefreshHistory}
      />
    </div>
  );
}

