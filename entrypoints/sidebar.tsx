import React, {useState} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {IoMdCloseCircle} from "react-icons/io";
import {IoIosSettings} from "react-icons/io";
import {RiDashboardFill} from "react-icons/ri";
import {BookOpen, Network, FolderOpen, X, Home, Folder, Settings, History} from "lucide-react";
import {BrowsingMode} from "@/lib/mode-manager.ts";
import {cn} from "@/lib/utils";

export enum SidebarType {
    'home' = 'home',
    'sessions' = 'sessions',
    'settings' = 'settings'
}

const Sidebar = (
    {sideNav, closeContent, currentMode, activeSidebarType}: {
        sideNav: (sidebarType: SidebarType) => void,
        closeContent?: () => void,
        currentMode?: BrowsingMode,
        activeSidebarType: SidebarType
    }) => {
    return (
        <div className="flex items-center justify-between px-6 py-4 bg-background">
            {/* Left: Branding */}
            <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Montaga, serif' }}>RabbitHole</span>
            </div>

            {/* Center: Navigation */}
            <nav className="flex items-center gap-1">
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => sideNav(SidebarType.home)}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-9 w-9",
                                    activeSidebarType === SidebarType.home 
                                        ? "bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600" 
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                <Home className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Home</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => sideNav(SidebarType.sessions)}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-9 w-9",
                                    activeSidebarType === SidebarType.sessions 
                                        ? "bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600" 
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                <History className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>History</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => sideNav(SidebarType.settings)}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-9 w-9",
                                    activeSidebarType === SidebarType.settings 
                                        ? "bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600" 
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Settings</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>

            {/* Right: Close button */}
            {closeContent && (
                <Button
                    onClick={closeContent}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
};

export default Sidebar;


