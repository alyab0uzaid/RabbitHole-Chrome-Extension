import React, { useState } from 'react';
import { useTree } from '@/lib/tree-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Play, Calendar, FileText } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface SessionsPageProps {
  onSwitchToTree?: () => void;
}

export function SessionsPage({ onSwitchToTree }: SessionsPageProps) {
  const { savedTrees, loadTree, deleteSavedTree } = useTree();

  const handleLoadSession = (treeId: string) => {
    console.log('[Sessions] Loading tree:', treeId);

    // Load the tree and switch to tree view
    loadTree(treeId, () => {
      console.log('[Sessions] Switching to tree view');
      if (onSwitchToTree) {
        onSwitchToTree();
      }
    });
  };

  const handleDeleteSession = (treeId: string) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this session? This cannot be undone.'
    );
    if (!confirm) return;

    deleteSavedTree(treeId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Saved Sessions</h2>
        <p className="text-sm text-muted-foreground">
          Load and manage your Wikipedia exploration journeys
        </p>
      </div>

      {/* Saved Sessions List */}
      <div>

        {savedTrees.length === 0 ? (
          <Alert className="border-dashed">
            <FileText className="h-4 w-4" />
            <p className="text-sm ml-2">
              No saved sessions yet. Save your current research to revisit it later!
            </p>
          </Alert>
        ) : (
          <div className="space-y-3">
            {savedTrees.map((tree) => (
              <Card key={tree.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{tree.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {tree.nodes.length} {tree.nodes.length === 1 ? 'node' : 'nodes'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(tree.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleLoadSession(tree.id)}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <Play className="h-3 w-3" />
                      Load
                    </Button>
                    <Button
                      onClick={() => handleDeleteSession(tree.id)}
                      size="sm"
                      variant="outline"
                      className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
