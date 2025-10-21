import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { browser } from "wxt/browser";
import { MessageType } from "@/entrypoints/types";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";

export function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const themes = [
        { value: "light", label: "Light", icon: Sun },
        { value: "dark", label: "Dark", icon: Moon }
    ];

    const handleThemeChange = async (newTheme: string) => {
        toggleTheme(newTheme);
        await browser.runtime.sendMessage({
            messageType: MessageType.changeTheme,
            content: newTheme
        });
        await browser.storage.local.set({ theme: newTheme });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-6 pb-4">
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            </div>
            
            <div className="flex-1 px-6 pb-6">
                <Card className="p-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">Appearance</h3>
                            <RadioGroup 
                                value={theme} 
                                onValueChange={handleThemeChange}
                                className="space-y-3"
                            >
                                {themes.map((themeOption) => {
                                    const Icon = themeOption.icon;
                                    return (
                                        <div 
                                            key={themeOption.value}
                                            className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                                            onClick={() => handleThemeChange(themeOption.value)}
                                        >
                                            <RadioGroupItem 
                                                value={themeOption.value} 
                                                id={themeOption.value}
                                                className="mt-0"
                                            />
                                            <Label 
                                                htmlFor={themeOption.value}
                                                className="flex items-center gap-3 cursor-pointer flex-1"
                                            >
                                                <Icon className="w-4 h-4" />
                                                {themeOption.label}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </RadioGroup>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

