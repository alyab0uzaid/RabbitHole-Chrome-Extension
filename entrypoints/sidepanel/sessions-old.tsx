import React, { useState } from 'react';
import { useTree } from '@/lib/tree-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Trash2, Play, ChevronUp, ChevronDown, Search, MoreHorizontal, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type SavedTree = {
  id: string;
  name: string;
  nodes: any[];
  createdAt: number;
}

export const columns: ColumnDef<SavedTree>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ChevronUp className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-xs sm:text-sm text-muted-foreground">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(',', ' at')}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Root
          <ChevronUp className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const tree = row.original;
      return (
        <div className="text-xs sm:text-sm font-medium text-foreground truncate">
          {tree.nodes[0]?.title || 'Unknown'}
        </div>
      );
    },
  },
  {
    accessorKey: "nodes",
    header: () => <div className="text-right">Nodes</div>,
    cell: ({ row }) => {
      const tree = row.original;
      return (
        <div className="text-right text-xs sm:text-sm text-muted-foreground">
          {tree.nodes.length}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const tree = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                // Handle load session
                console.log('Load session:', tree.id);
              }}
            >
              <Play className="mr-2 h-4 w-4" />
              Dive In
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // Handle edit name
                console.log('Edit name:', tree.id);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Name
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Handle delete
                console.log('Delete:', tree.id);
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

// Component to render a tree minimap using the same layout algorithm as the main tree
const TreeMinimap: React.FC<{ nodes: any[] }> = ({ nodes }) => {
  if (nodes.length === 0) return null;

  const svgWidth = 120;
  const svgHeight = 80;
  const padding = 8;
  const nodeWidth = 12;  // Width of rectangle
  const nodeHeight = 8;  // Height of rectangle

  // Use the same positioning algorithm as the main tree
  const calculatePositions = () => {
    const positions: { [id: string]: { x: number; y: number } } = {};
    
    if (nodes.length === 0) return positions;

    const horizontalSpacing = 25; // Scaled down for minimap
    const verticalSpacing = 20;   // Scaled down for minimap

    // Build parent-children map
    const childrenMap: { [id: string]: any[] } = {};
    nodes.forEach(node => {
      if (node.parentId) {
        if (!childrenMap[node.parentId]) {
          childrenMap[node.parentId] = [];
        }
        childrenMap[node.parentId].push(node);
      }
    });

    // Find root node
    const rootNode = nodes.find(node => node.parentId === null);
    if (!rootNode) return positions;

    // Position root node at center
    positions[rootNode.id] = { 
      x: svgWidth / 2, 
      y: padding + verticalSpacing / 2 
    };

    // Calculate total width needed for the entire tree
    const calculateTreeWidth = (node: any): number => {
      const children = childrenMap[node.id] || [];
      if (children.length === 0) return 1;
      return children.reduce((sum, child) => sum + calculateTreeWidth(child), 0);
    };

    const totalTreeWidth = calculateTreeWidth(rootNode);
    const startX = (svgWidth - (totalTreeWidth - 1) * horizontalSpacing) / 2;
    
    // Position nodes recursively starting from root
    let currentX = startX;
    
    const positionSubtree = (node: any, depth: number): { minX: number; maxX: number } => {
      const children = childrenMap[node.id] || [];
      
      if (children.length === 0) {
        // Leaf node - position at current X
        const x = currentX;
        currentX += horizontalSpacing;
        positions[node.id] = { x, y: padding + depth * verticalSpacing };
        return { minX: x, maxX: x };
      }

      // Position all children first to get their range
      const childRanges = children.map(child => {
        const range = positionSubtree(child, depth + 1);
        return range;
      });

      // Calculate the range of all children
      const minChildX = Math.min(...childRanges.map(r => r.minX));
      const maxChildX = Math.max(...childRanges.map(r => r.maxX));
      
      // For non-root nodes, position parent at the center of its children
      if (node.id !== rootNode.id) {
        const x = (minChildX + maxChildX) / 2;
        positions[node.id] = { x, y: padding + depth * verticalSpacing };
      }
      
      return { minX: minChildX, maxX: maxChildX };
    };

    // Start positioning from root (root is already positioned at center)
    positionSubtree(rootNode, 0);

    return positions;
  };

  const nodePositions = calculatePositions();

  // Find bounds to center the tree
  const allPositions = Object.values(nodePositions);
  if (allPositions.length === 0) return null;

  const minX = Math.min(...allPositions.map(p => p.x));
  const maxX = Math.max(...allPositions.map(p => p.x));
  const minY = Math.min(...allPositions.map(p => p.y));
  const maxY = Math.max(...allPositions.map(p => p.y));

  const treeWidth = maxX - minX;
  const treeHeight = maxY - minY;
  const offsetX = (svgWidth - treeWidth) / 2 - minX;
  const offsetY = (svgHeight - treeHeight) / 2 - minY;

  return (
    <div className="w-32 h-full bg-muted/20 rounded-l-lg relative overflow-hidden flex items-center justify-center">
      <svg width={svgWidth} height={svgHeight} className="block">
        {/* Render edges first */}
        {nodes.map((node) => {
          if (node.parentId && nodePositions[node.parentId] && nodePositions[node.id]) {
            const parent = nodePositions[node.parentId];
            const child = nodePositions[node.id];
            return (
              <line
                key={`edge-${node.id}`}
                x1={parent.x + offsetX}
                y1={parent.y + offsetY}
                x2={child.x + offsetX}
                y2={child.y + offsetY}
                stroke="hsl(var(--muted-foreground) / 0.4)"
                strokeWidth="1.5"
              />
            );
          }
          return null;
        })}
        
        {/* Render nodes as rectangles */}
        {nodes.map((node) => {
          const pos = nodePositions[node.id];
          if (!pos) return null;
          
          return (
            <rect
              key={node.id}
              x={pos.x + offsetX - nodeWidth / 2}
              y={pos.y + offsetY - nodeHeight / 2}
              width={nodeWidth}
              height={nodeHeight}
              rx="2"
              fill="hsl(var(--card) / 0.3)"
              stroke={node.parentId === null ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
};

interface SessionsPageProps {
  onSwitchToTree?: () => void;
}

export function SessionsPage({ onSwitchToTree }: SessionsPageProps) {
  const { savedTrees, loadTree } = useTree();
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: savedTrees,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleLoadSession = (sessionId: string) => {
    loadTree(sessionId);
    onSwitchToTree();
  };

  const handleDeleteSession = (treeId: string, treeName: string) => {
    console.log('[Sessions] Delete clicked for:', treeName);
    setTreeToDelete(treeId);
    setTreeToDeleteName(treeName);
    setIsBulkDelete(false);
    setDeleteDialogOpen(true);
    console.log('[Sessions] Dialog state set to true');
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
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Montaga, serif' }}>History</h1>
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
                Build a tree and it will be automatically saved!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-1 pb-6">
            {/* Action Bar - Fixed height to prevent layout shifts */}
            <div className="flex items-center justify-between mb-4 h-10 relative">
              {/* View Mode - Always present but animated */}
              <div className={`flex items-center gap-4 w-full transition-all duration-200 ${isEditMode ? 'opacity-0 pointer-events-none -translate-x-4' : 'opacity-100 translate-x-0'}`}>
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search trees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleEditMode}
                  className="bg-transparent border-border shadow-sm hover:bg-[#e8e6dc] hover:shadow-lg transition-all duration-200"
                >
                  Edit
                </Button>
                  </div>
                  
              {/* Edit Mode - Always present but animated */}
              <div className={`absolute right-0 flex items-center gap-2 transition-all duration-200 ${isEditMode ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none translate-x-4'}`}>
                {selectedTrees.size > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleEditMode}
                  className="bg-transparent border-border shadow-sm hover:bg-[#e8e6dc] hover:shadow-lg transition-all duration-200"
                >
                  Done
                </Button>
                      </div>
                    </div>

            <div className="rounded-lg overflow-hidden shadow-sm border border-[#dad9d4]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#ede9de] hover:bg-[#ede9de]">
                    {isEditMode && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedTrees.size === filteredAndSortedTrees.length && filteredAndSortedTrees.length > 0}
                          onCheckedChange={handleSelectAll}
                          className="border-[#dad9d4]"
                        />
                      </TableHead>
                    )}
                    <TableHead>
                        <button 
                          onClick={() => handleSort('date')}
                          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-foreground hover:text-[#598ad9] transition-colors"
                        >
                        Date
                        {sortBy === 'date' && (
                          sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                        <button 
                          onClick={() => handleSort('rootNode')}
                          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-foreground hover:text-[#598ad9] transition-colors"
                        >
                        Root
                        {sortBy === 'rootNode' && (
                          sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">
                        <button 
                          onClick={() => handleSort('nodes')}
                          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-foreground hover:text-[#598ad9] transition-colors ml-auto"
                        >
                        Nodes
                        {sortBy === 'nodes' && (
                          sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedTrees.map((tree) => (
                    <TableRow key={tree.id} className="hover:bg-[#f3f1e9]">
                      {isEditMode && (
                        <TableCell>
                          <Checkbox
                            checked={selectedTrees.has(tree.id)}
                            onCheckedChange={(checked) => handleSelectTree(tree.id, checked as boolean)}
                            onClick={(e) => e.stopPropagation()}
                            className="border-[#dad9d4]"
                          />
                        </TableCell>
                      )}
                      <TableCell 
                        className="cursor-pointer"
                        onClick={() => handleLoadSession(tree.id)}
                      >
                        <span className="break-words text-xs sm:text-sm text-muted-foreground">
                          {new Date(tree.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).replace(',', ' at')}
                        </span>
                      </TableCell>
                      <TableCell 
                        className="cursor-pointer"
                        onClick={() => handleLoadSession(tree.id)}
                      >
                        <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {tree.nodes[0]?.title || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell 
                        className="text-right cursor-pointer"
                        onClick={() => handleLoadSession(tree.id)}
                      >
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {tree.nodes.length}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                      </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Name
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
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
    </div>
  );
}
