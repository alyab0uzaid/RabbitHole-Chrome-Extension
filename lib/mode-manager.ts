/**
 * Mode Manager - Determines Lookup Mode vs Tracking Mode
 *
 * Lookup Mode: User on non-Wikipedia pages (research assistant)
 * Tracking Mode: User on Wikipedia pages (navigation tracker)
 */

export enum BrowsingMode {
  LOOKUP = 'lookup',
  TRACKING = 'tracking'
}

/**
 * Check if a URL is a Wikipedia page
 * Supports all language versions (en, fr, es, etc.)
 */
export function isWikipediaUrl(url: string): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    // Match *.wikipedia.org (any subdomain)
    const isWikipedia = /^[a-z]{2,3}\.wikipedia\.org$/i.test(urlObj.hostname) ||
                        /^[a-z]{2,3}\.m\.wikipedia\.org$/i.test(urlObj.hostname);

    // Only consider article pages (not search, talk, special pages)
    const isArticlePage = urlObj.pathname.startsWith('/wiki/') &&
                          !urlObj.pathname.includes(':');

    return isWikipedia && isArticlePage;
  } catch (e) {
    return false;
  }
}

/**
 * Determine the browsing mode based on URL
 */
export function getModeForUrl(url: string): BrowsingMode {
  return isWikipediaUrl(url) ? BrowsingMode.TRACKING : BrowsingMode.LOOKUP;
}

/**
 * Extract article title from Wikipedia URL
 */
export function getWikipediaArticleTitle(url: string): string | null {
  if (!isWikipediaUrl(url)) return null;

  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/wiki\/([^#?]+)/);
    if (match) {
      return decodeURIComponent(match[1].replace(/_/g, ' '));
    }
  } catch (e) {
    // Invalid URL
  }

  return null;
}

/**
 * Check if navigation is a Wikipedia → Wikipedia navigation
 */
export function isWikipediaToWikipedia(fromUrl: string, toUrl: string): boolean {
  return isWikipediaUrl(fromUrl) && isWikipediaUrl(toUrl);
}

/**
 * Check if this is a transition out of Wikipedia
 */
export function isLeavingWikipedia(fromUrl: string, toUrl: string): boolean {
  return isWikipediaUrl(fromUrl) && !isWikipediaUrl(toUrl);
}

/**
 * Check if this is a transition into Wikipedia
 */
export function isEnteringWikipedia(fromUrl: string, toUrl: string): boolean {
  return !isWikipediaUrl(fromUrl) && isWikipediaUrl(toUrl);
}
