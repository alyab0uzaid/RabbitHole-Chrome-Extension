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
                <span className="text-lg font-semibold text-foreground" style={{ fontFamily: 'Montaga, serif' }}>RabbitHole</span>
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
                                    "h-9 w-9 transition-all duration-300",
                                    activeSidebarType === SidebarType.home 
                                        ? "bg-[#598ad9]/10 text-[#598ad9] hover:bg-[#598ad9]/10 hover:text-[#598ad9]" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-white hover:shadow-md dark:hover:bg-white/10"
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
                                    "h-9 w-9 transition-all duration-300",
                                    activeSidebarType === SidebarType.sessions 
                                        ? "bg-[#598ad9]/10 text-[#598ad9] hover:bg-[#598ad9]/10 hover:text-[#598ad9]" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-white hover:shadow-md dark:hover:bg-white/10"
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
                                    "h-9 w-9 transition-all duration-300",
                                    activeSidebarType === SidebarType.settings 
                                        ? "bg-[#598ad9]/10 text-[#598ad9] hover:bg-[#598ad9]/10 hover:text-[#598ad9]" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-white hover:shadow-md dark:hover:bg-white/10"
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


