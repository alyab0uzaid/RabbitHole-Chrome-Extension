import React from 'react';
import { useTree } from '@/lib/tree-context';
import { BrowsingMode } from '@/lib/mode-manager';
import TreeView from '@/components/tree/TreeView';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Network, FolderOpen, BookOpen } from 'lucide-react';
import { browser } from 'wxt/browser';
import { MessageType } from '@/entrypoints/types';

// Utility function for better time formatting
const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

interface AdaptiveHomeProps {
  currentMode: BrowsingMode;
  onNavigateToSessions: () => void;
}

export function AdaptiveHome({ currentMode, onNavigateToSessions }: AdaptiveHomeProps) {
  const { treeNodes, savedTrees } = useTree();
  

  // Show tree if actively tracking or has nodes
  if (currentMode === BrowsingMode.TRACKING || (treeNodes && treeNodes.length > 0)) {
    return (
      <div className="flex flex-col h-full">
        <TreeView 
          onNodeClick={async (nodeId, nodeData) => {
            console.log('[AdaptiveHome] Tree node clicked, navigating to:', nodeData.url);

            // Ask background script to navigate to this URL in the tracked Wikipedia tab
            try {
              await browser.runtime.sendMessage({
                messageType: MessageType.navigateToWikipedia,
                articleUrl: nodeData.url
              });
            } catch (error) {
              console.error('[AdaptiveHome] Failed to navigate Wikipedia tab:', error);
              // Fallback: create new tab
              await browser.tabs.create({ url: nodeData.url, active: true });
            }
          }}
        />
      </div>
    );
  }

  // Show welcome/empty state
  return (
    <div className="flex flex-col h-full">
      {/* Compact welcome section at top */}
      <div className="flex flex-col items-center px-6 py-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-4">
          <Network className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Start exploring
        </h1>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Highlight any text to look it up on Wikipedia, or browse Wikipedia directly to start tracking your journey.
        </p>
        <Button 
          onClick={() => {
            browser.tabs.create({ url: 'https://en.wikipedia.org/wiki/Main_Page' });
          }}
          size="lg"
          className="w-full max-w-sm"
        >
          Browse Wikipedia
        </Button>
      </div>

      {/* Scrollable sidebar-style list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Rabbit Holes</h3>
            {savedTrees && savedTrees.length > 0 && (
              <button 
                onClick={onNavigateToSessions}
                className="text-xs text-primary hover:underline font-medium"
              >
                View All
              </button>
            )}
          </div>
          
          {savedTrees && savedTrees.length > 0 ? (
            <div className="space-y-3">
              {savedTrees.slice(0, 4).map((session) => (
                <div 
                  key={session.id}
                  className="bg-card border border-border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors shadow-sm"
                  onClick={() => {
                    browser.runtime.sendMessage({
                      messageType: 'loadTreeIntoCurrentTab',
                      treeId: session.id,
                      treeNodes: session.nodes,
                      treeName: session.name,
                      lastVisitedNodeUrl: session.nodes[0]?.url,
                      lastVisitedNodeId: session.nodes[0]?.id
                    });
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate mb-1">
                        {session.name}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          {session.nodes.length} Nodes
                        </span>
                        <span>
                          {formatTimeAgo(session.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-sm text-muted-foreground mb-1">
                No recent rabbit holes yet
              </div>
              <div className="text-xs text-muted-foreground">
                Start exploring to create your first tree
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
