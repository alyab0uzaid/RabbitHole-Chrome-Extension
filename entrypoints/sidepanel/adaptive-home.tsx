import React from 'react';
import { useTree } from '@/lib/tree-context';
import { BrowsingMode } from '@/lib/mode-manager';
import TreeView from '@/components/tree/TreeView';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Network, FolderOpen, BookOpen } from 'lucide-react';
import { browser } from 'wxt/browser';
import { MessageType } from '@/entrypoints/types';

interface AdaptiveHomeProps {
  currentMode: BrowsingMode;
  onNavigateToSessions: () => void;
}

export function AdaptiveHome({ currentMode, onNavigateToSessions }: AdaptiveHomeProps) {
  const { treeNodes, savedSessions } = useTree();

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
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Network className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-foreground">
          Welcome to RabbitHole
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Start exploring Wikipedia and watch your knowledge tree grow as you dive deeper into topics that interest you.
        </p>
      </div>

      <div className="space-y-4 w-full max-w-sm">
        <Card className="p-6 border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Start Exploring</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Navigate to any Wikipedia page to begin building your knowledge tree
          </p>
        </Card>

        {savedSessions && savedSessions.length > 0 && (
          <Button 
            onClick={onNavigateToSessions}
            variant="outline" 
            className="w-full"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            View Saved Rabbit Holes ({savedSessions.length})
          </Button>
        )}
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        <p>💡 <strong>Tip:</strong> Each Wikipedia tab maintains its own separate tree</p>
      </div>
    </div>
  );
}
