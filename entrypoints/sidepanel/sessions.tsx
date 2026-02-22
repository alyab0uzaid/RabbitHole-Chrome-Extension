import React, { useState, useRef, useCallback } from 'react';
import { useTree } from '@/lib/tree-context';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Trash2, ChevronUp, ChevronDown, Search, MoreVertical, Edit, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SavedTree } from "@/lib/tree-types";
import TreePreviewFlow from "@/components/tree/TreePreviewFlow";

interface SessionsPageProps {
  onSwitchToTree?: () => void;
}

export function SessionsPage({ onSwitchToTree }: SessionsPageProps) {
  const { savedTrees, loadTree, deleteSavedTree, renameTree } = useTree();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [treeToDelete, setTreeToDelete] = useState<string | null>(null);
  const [treeToDeleteName, setTreeToDeleteName] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'nodes' | 'rootNode'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTrees, setSelectedTrees] = useState<Set<string>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  const [bulkDeleteNames, setBulkDeleteNames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [treeToRename, setTreeToRename] = useState<string | null>(null);
  const [newTreeName, setNewTreeName] = useState('');

  // Cursor-following preview
  const [hoveredTree, setHoveredTree] = useState<SavedTree | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewTopRef = useRef(0);
  const targetXRef = useRef(0);
  const currentXRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const animateLerp = useCallback(() => {
    const diff = targetXRef.current - currentXRef.current;
    if (Math.abs(diff) < 0.15) {
      currentXRef.current = targetXRef.current;
      rafRef.current = null;
    } else {
      currentXRef.current += diff * 0.12;
      rafRef.current = requestAnimationFrame(animateLerp);
    }
    if (previewRef.current) {
      previewRef.current.style.transform = `translateX(calc(${currentXRef.current}px - 50%))`;
    }
  }, []);

  const handleRowMouseEnter = useCallback((e: React.MouseEvent<HTMLTableRowElement>, tree: SavedTree) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const previewHeight = 160;
    const gap = 8;
    const hasSpaceAbove = rect.top > previewHeight + gap;
    previewTopRef.current = hasSpaceAbove ? rect.top - previewHeight - gap : rect.bottom + gap;
    targetXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    setHoveredTree(tree);
  }, []);

  const handleRowMouseMove = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    targetXRef.current = e.clientX;
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(animateLerp);
    }
  }, [animateLerp]);

  const handleRowMouseLeave = useCallback(() => {
    stopRaf();
    setHoveredTree(null);
  }, [stopRaf]);

  const handleLoadSession = (treeId: string) => {
    console.log('[Rabbit Holes] Loading tree:', treeId);

    // Load the tree and switch to tree view
    loadTree(treeId, () => {
      console.log('[Rabbit Holes] Switching to tree view');
      if (onSwitchToTree) {
        onSwitchToTree();
      }
    });
  };

  const handleDeleteSession = (treeId: string, treeName: string) => {
    console.log('[Sessions] Delete clicked for:', treeName);
    setTreeToDelete(treeId);
    setTreeToDeleteName(treeName);
    setIsBulkDelete(false);
    setDeleteDialogOpen(true);
    console.log('[Sessions] Dialog state set to true');
  };

  const handleRenameSession = (treeId: string, currentName: string) => {
    setTreeToRename(treeId);
    setNewTreeName(currentName);
    setRenameDialogOpen(true);
  };

  const handleConfirmRename = () => {
    if (treeToRename && newTreeName.trim()) {
      console.log('Renaming tree:', treeToRename, 'to:', newTreeName);
      renameTree(treeToRename, newTreeName.trim());
      setRenameDialogOpen(false);
      setTreeToRename(null);
      setNewTreeName('');
    }
  };

  const confirmDelete = () => {
    if (treeToDelete) {
      deleteSavedTree(treeToDelete);
      // Reset all dialog state
      setTreeToDelete(null);
      setTreeToDeleteName('');
      setDeleteDialogOpen(false);
    }
  };

  const handleSort = (column: 'date' | 'nodes' | 'rootNode') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder(column === 'rootNode' ? 'asc' : 'desc');
    }
  };

  const handleSelectTree = (treeId: string, checked: boolean) => {
    setSelectedTrees(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(treeId);
      } else {
        newSet.delete(treeId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTrees(new Set(filteredAndSortedTrees.map(tree => tree.id)));
    } else {
      setSelectedTrees(new Set());
    }
  };

  const handleDeleteSelected = () => {
    if (selectedTrees.size === 0) return;
    
    setIsBulkDelete(true);
    setBulkDeleteCount(selectedTrees.size);
    
    // Get the names of selected trees
    const selectedTreeNames = filteredAndSortedTrees
      .filter(tree => selectedTrees.has(tree.id))
      .map(tree => tree.name);
    setBulkDeleteNames(selectedTreeNames);
    
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSelected = () => {
    selectedTrees.forEach(treeId => {
      deleteSavedTree(treeId);
    });
    setSelectedTrees(new Set());
    setDeleteDialogOpen(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      // Clear selections when exiting edit mode
      setSelectedTrees(new Set());
    }
  };

  const filteredAndSortedTrees = [...savedTrees]
    .filter(tree => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return tree.name.toLowerCase().includes(searchLower) || 
             tree.nodes[0]?.title?.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
      } else if (sortBy === 'nodes') {
        return sortOrder === 'desc' ? b.nodes.length - a.nodes.length : a.nodes.length - b.nodes.length;
      } else {
        const aTitle = a.nodes[0]?.title || '';
        const bTitle = b.nodes[0]?.title || '';
        return sortOrder === 'asc' ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
      }
    });

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-2 pb-3">
        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Montaga, serif' }}>History</h1>
      </div>
      {/* Saved Sessions List */}
      <div className="flex-1 overflow-y-auto px-6">
        {savedTrees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-8 text-center">
            <div className="text-6xl">📚</div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Rabbit Holes Yet</h3>
              <p className="text-sm">
                Your explorations will appear here once you start diving down Wikipedia rabbit holes.
                <br />
                Build a rabbit hole and it will be automatically saved!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-1 pb-6">
             {/* Search Bar */}
             <div className="relative mb-4">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
               <Input
                 placeholder="Search rabbit holes..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 bg-white border-border hover:border-border-hover focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200"
               />
                  </div>
                  
             {/* Results count and Select link */}
             <div className="flex items-center mb-4 relative">
             {/* Normal state */}
             {!isEditMode && (
               <div className="flex items-center gap-2">
                 <div className="text-sm text-text-muted">
                   {filteredAndSortedTrees.length} {filteredAndSortedTrees.length === 1 ? 'rabbit hole' : 'rabbit holes'}
                 </div>
                 <button
                   onClick={toggleEditMode}
                   className="text-sm text-primary underline hover:no-underline"
                 >
                   Select
                 </button>
               </div>
             )}
             
             {/* Edit controls - slides in from right */}
             {isEditMode && (
               <div className="flex items-center gap-4 animate-in slide-in-from-right-4 duration-300">
                 <span className="text-sm text-text-muted">
                   <span className="inline-block w-4 text-right font-mono text-base font-medium">{selectedTrees.size}</span> selected
                        </span>
                 <button
                   onClick={handleDeleteSelected}
                   className={`transition-colors ${selectedTrees.size > 0 ? 'text-text-dark hover:text-destructive' : 'text-text-light'}`}
                 >
                   <Trash2 className="h-4 w-4" />
                 </button>
               </div>
             )}
               
               {/* X button - slides in from left when entering, disappears instantly when exiting */}
               {isEditMode && (
                 <div className="absolute right-0 flex items-center animate-in slide-in-from-left-4 duration-300">
                   <button
                     onClick={toggleEditMode}
                     className="text-text-muted hover:text-foreground transition-colors"
                   >
                     <X className="h-4 w-4" />
                   </button>
                      </div>
               )}
                    </div>

            <div className="rounded-lg shadow-sm border border-border overflow-x-auto">
              <Table style={{tableLayout: 'fixed', width: '100%'}}>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="!h-auto py-2 overflow-hidden transition-[width,opacity,padding] duration-300 ease-in-out" style={{width: isEditMode ? '1.75rem' : '0', opacity: isEditMode ? 1 : 0, paddingLeft: isEditMode ? '0.5rem' : '0', paddingRight: '0'}}>
                      <div className="flex-shrink-0">
                        <Checkbox
                          checked={selectedTrees.size === filteredAndSortedTrees.length && filteredAndSortedTrees.length > 0}
                          onCheckedChange={handleSelectAll}
                          className="border-border"
                        />
                      </div>
                    </TableHead>
                    <TableHead className={`!h-auto py-2 ${!isEditMode ? 'pl-4' : ''}`} style={{width: '35%'}}>
                      <button 
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        Date
                        {sortBy === 'date' && (
                          sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="!h-auto py-2" style={{width: '45%'}}>
                      <button 
                        onClick={() => handleSort('rootNode')}
                        className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        Name
                        {sortBy === 'rootNode' && (
                          sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="!h-auto py-2 pr-2 overflow-visible" style={{width: '10%', minWidth: '10%'}}>
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleSort('nodes')}
                          className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors whitespace-nowrap"
                        >
                        {sortBy === 'nodes' ? (
                          sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3" />
                        )}
                        Nodes
                        </button>
                      </div>
                    </TableHead>
                    <TableHead className="w-12 !h-auto py-2 px-2"></TableHead>
                  </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredAndSortedTrees.length > 0 ? (
                     filteredAndSortedTrees.map((tree) => (
                       <TableRow
                         key={tree.id}
                         className="hover:bg-table-header"
                         onMouseEnter={(e) => handleRowMouseEnter(e, tree)}
                         onMouseMove={handleRowMouseMove}
                         onMouseLeave={handleRowMouseLeave}
                       >
                        <TableCell className="py-2 overflow-hidden transition-[width,opacity,padding] duration-300 ease-in-out" style={{width: isEditMode ? '1.75rem' : '0', opacity: isEditMode ? 1 : 0, paddingLeft: isEditMode ? '0.5rem' : '0', paddingRight: '0'}}>
                          <div className="flex-shrink-0">
                            <Checkbox
                              checked={selectedTrees.has(tree.id)}
                              onCheckedChange={(checked) => handleSelectTree(tree.id, checked as boolean)}
                              onClick={(e) => e.stopPropagation()}
                              className="border-border"
                            />
                          </div>
                        </TableCell>
                        <TableCell
                          className={`cursor-pointer py-2 ${!isEditMode ? 'pl-4' : ''}`}
                          onClick={() => handleLoadSession(tree.id)}
                        >
                           <div className="text-sm text-muted-foreground truncate">
                             {new Date(tree.createdAt).toLocaleDateString('en-US', {
                               year: 'numeric',
                               month: '2-digit',
                               day: '2-digit',
                               hour: '2-digit',
                               minute: '2-digit'
                             }).replace(',', ' at')}
                           </div>
                         </TableCell>
                        <TableCell
                          className="cursor-pointer py-2"
                          onClick={() => handleLoadSession(tree.id)}
                        >
                          <div className="text-sm font-medium text-foreground truncate">
                            {tree.name || 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell
                          className="cursor-pointer py-2 pr-2 overflow-visible"
                          onClick={() => handleLoadSession(tree.id)}
                        >
                          <div className="flex justify-end">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {tree.nodes.length}
                            </span>
                          </div>
                        </TableCell>
                     <TableCell className="py-2 px-2" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-text-muted hover:text-foreground hover:bg-table-hover"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                      </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRenameSession(tree.id, tree.name || 'Unknown');
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSession(tree.id, tree.name || 'Unknown');
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                       </TableRow>
                     ))
                   ) : (
                     <TableRow>
                       <TableCell 
                         colSpan={isEditMode ? 5 : 4} 
                         className="h-24 text-center"
                       >
                         <div className="text-muted-foreground">
                           No results found.
                    </div>
                       </TableCell>
                     </TableRow>
                   )}
                 </TableBody>
              </Table>
                </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {isBulkDelete ? (
                <>
                  {bulkDeleteCount === 1 ? (
                    <>
                      This will permanently delete <span className="font-semibold text-foreground">"{bulkDeleteNames[0]}"</span>.
                      This action cannot be undone and you'll lose all your exploration history for this rabbit hole.
                    </>
                  ) : (
                    <>
                      This will permanently delete <span className="font-semibold text-foreground">{bulkDeleteCount} selected rabbit holes</span>.
                      This action cannot be undone and you'll lose all your exploration history for these rabbit holes.
                    </>
                  )}
                </>
              ) : (
                <>
              This will permanently delete <span className="font-semibold text-foreground">"{treeToDeleteName}"</span>.
              This action cannot be undone and you'll lose all your exploration history for this rabbit hole.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={isBulkDelete ? confirmDeleteSelected : confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="gap-2">
          <DialogHeader>
            <DialogTitle className="text-left">Rename Rabbit Hole</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={newTreeName}
              onChange={(e) => setNewTreeName(e.target.value)}
              placeholder="Enter rabbit hole name..."
              className="w-full bg-white hover:border-border-hover focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)} className="mt-2 sm:mt-0 bg-background hover:bg-muted">
              Cancel
            </Button>
            <Button onClick={handleConfirmRename} disabled={!newTreeName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cursor-following tree preview */}
      {hoveredTree && (
        <div
          ref={previewRef}
          style={{
            position: 'fixed',
            top: previewTopRef.current,
            left: 0,
            transform: `translateX(calc(${currentXRef.current}px - 50%))`,
            pointerEvents: 'none',
            zIndex: 9999,
            width: '16rem',
            height: '10rem',
          }}
          className="rounded-lg border border-border bg-background shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {hoveredTree.nodes.length > 0 ? (
            <TreePreviewFlow nodes={hoveredTree.nodes} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Empty</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
