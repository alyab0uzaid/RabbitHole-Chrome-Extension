import React, { useEffect, useState } from 'react';
import { browser } from "wxt/browser";
import { Spinner } from "@/components/ui/spinner";

interface WikipediaState {
    loading: boolean;
    error: string | null;
    articleTitle: string | null;
}

export const WikipediaViewer: React.FC = () => {
    const [state, setState] = useState<WikipediaState>({
        loading: true,
        error: null,
        articleTitle: null
    });

    useEffect(() => {
        init();
    }, []);

    async function init() {
        try {
            const response = await browser.runtime.sendMessage({
                messageType: 'getSelectedText'
            });

            if (response && response.selectedText) {
                await loadWikipedia(response.selectedText);
            } else {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: 'No text selected. Please select text on a webpage and try again.'
                }));
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Error loading article: ' + (error as Error).message
            }));
        }
    }

    async function loadWikipedia(searchTerm: string) {
        setState(prev => ({
            ...prev,
            loading: true,
            error: null
        }));

        try {
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchTerm)}&limit=1&format=json&origin=*`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();

            if (!searchData[1] || searchData[1].length === 0) {
                throw new Error('No Wikipedia article found for this term');
            }

            const articleTitle = searchData[1][0];
            setState(prev => ({
                ...prev,
                loading: false,
                articleTitle
            }));

        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: (error as Error).message
            }));
        }
    }

    if (state.loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: '8px'
            }}>
                <Spinner />
                <span>Loading Wikipedia article...</span>
            </div>
        );
    }

    if (state.error) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: '20px',
                textAlign: 'center'
            }}>
                <div>
                    <p style={{ color: 'red', marginBottom: '10px' }}>{state.error}</p>
                    <button onClick={init}>Try Again</button>
                </div>
            </div>
        );
    }

    if (state.articleTitle) {
        return (
            <iframe
                src={`https://en.wikipedia.org/wiki/${encodeURIComponent(state.articleTitle.replace(/ /g, '_'))}`}
                style={{
                    width: '100%',
                    height: '100vh',
                    border: 'none',
                    margin: 0,
                    padding: 0
                }}
                title={`Wikipedia article: ${state.articleTitle}`}
            />

        );
    }

    return null;
};
