import React, { useState } from 'react';
import { AdaptiveHome } from '../sidepanel/adaptive-home';
import { SessionsPage } from '../sidepanel/sessions';
import Sidebar, { SidebarType } from '../sidebar';
import { BrowsingMode } from '@/lib/mode-manager';

export default function App() {
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentMode = BrowsingMode.WIKIPEDIA;

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      <Sidebar
        sideNav={(type) => {
          if (type !== sidebarType) {
            setIsTransitioning(true);
            setTimeout(() => {
              setSidebarType(type);
              setTimeout(() => {
                setIsTransitioning(false);
              }, 50);
            }, 300);
          }
        }}
        currentMode={currentMode}
        activeSidebarType={sidebarType}
      />
      <main className="flex-1 overflow-auto">
        {sidebarType === SidebarType.home && (
          <div key="home" className={`h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100 animate-in fade-in-0 duration-700'}`}>
            <AdaptiveHome 
              currentMode={currentMode}
              onNavigateToSessions={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setSidebarType(SidebarType.sessions);
                  setTimeout(() => {
                    setIsTransitioning(false);
                  }, 50);
                }, 500);
              }}
            />
          </div>
        )}
        {sidebarType === SidebarType.sessions && (
          <div key="sessions" className={`h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100 animate-in fade-in-0 duration-700'}`}>
            <SessionsPage
              onSwitchToTree={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setSidebarType(SidebarType.home);
                  setTimeout(() => {
                    setIsTransitioning(false);
                  }, 50);
                }, 500);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

