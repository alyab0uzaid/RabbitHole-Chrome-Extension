// HomePage.js
import React from "react";
import {Card} from "@/components/ui/card.tsx";
import {useTranslation} from "react-i18next";
import {BookOpen, MousePointer} from "lucide-react";

export function Home() {
    const {t} = useTranslation();
    const references = [
        {
            name: "Wxt",
            url: "https://wxt.dev/"
        },
        {
            name: "React",
            url: "https://react.dev/"
        },
        {
            name: "Tailwind css",
            url: "https://tailwindcss.com/"
        },
        {
            name: "Shadcn Ui",
            url: "https://ui.shadcn.com/"
        }
    ]
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="text-left">
                <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <h3 className="font-semibold leading-none tracking-tight text-base flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        RabbitHole Wikipedia
                    </h3>
                    <p className="text-sm max-w-lg text-balance leading-relaxed">
                        Select any text on a webpage to instantly view its Wikipedia article in the sidebar. 
                        Perfect for quick research and learning!
                    </p>
                </div>
            </Card>
            
            <Card className="text-left">
                <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <h3 className="font-semibold leading-none tracking-tight text-base flex items-center gap-2">
                        <MousePointer className="h-4 w-4" />
                        How to Use
                    </h3>
                    <div className="text-sm space-y-2">
                        <p>1. Select any text on any webpage</p>
                        <p>2. Click "Open in Sidebar" in the preview card</p>
                        <p>3. View the Wikipedia article in the sidebar</p>
                        <p>4. Click the Wikipedia icon to access your last search</p>
                    </div>
                </div>
            </Card>

            <Card className="text-left">
                <div className="flex flex-col space-y-1.5 p-6 pb-3">
                    <h3 className="font-semibold leading-none tracking-tight text-base">{t("reference")}</h3>
                    <div className="flex flex-col gap-4 pt-2">
                        {
                            references.map((reference, index, array) => {
                                return (
                                    <div className="grid gap-1" key={index}>
                                        <p className="text-sm font-medium leading-none">
                                            {reference.name}
                                        </p>
                                        <a className="text-sm text-muted-foreground" href={reference.url}
                                           target="_blank">{reference.url}</a>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Card>
        </div>

    )
}
