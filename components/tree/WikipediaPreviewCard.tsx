import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface WikipediaPreviewCardProps {
  title: string;
  url: string;
}

interface PageData {
  extract?: string;
  thumbnail?: { source: string; width: number; height: number };
}

function renderExtractWithBold(extract: string, title: string) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b(${escaped})\\b`, 'i');
  const parts = extract.split(regex);
  if (parts.length === 3) return <>{parts[0]}<strong>{parts[1]}</strong>{parts[2]}</>;
  return extract;
}

export function WikipediaPreviewCard({ title }: WikipediaPreviewCardProps) {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lineHeight, setLineHeight] = useState(19.5);
  const [lastLineEndsWithPeriod, setLastLineEndsWithPeriod] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const sidewaysClipRef = useRef<HTMLDivElement>(null);
  const tallClipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchPreview = async () => {
      try {
        const titleParam = encodeURIComponent(title.replace(/ /g, '_'));
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${titleParam}`);
        if (cancelled) return;
        if (!res.ok) { setError('No article found'); return; }
        const data = await res.json();
        if (cancelled) return;
        setPageData({
          extract: data.extract || undefined,
          thumbnail: data.thumbnail || undefined,
        });
      } catch {
        if (!cancelled) setError('Failed to load preview');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPreview();
    return () => { cancelled = true; };
  }, [title]);

  // Measure actual rendered line height from a hidden single-line div
  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const lh = parseFloat(window.getComputedStyle(measureRef.current).lineHeight);
    if (!isNaN(lh) && lh > 0) setLineHeight(lh);
  }, [pageData?.extract]);

  // Find last visible character (sideways or tall) to see if last line ends with a period
  useLayoutEffect(() => {
    const extract = pageData?.extract;
    if (!extract) return;
    const clip = sidewaysClipRef.current?.isConnected ? sidewaysClipRef.current : tallClipRef.current?.isConnected ? tallClipRef.current : null;
    if (!clip) return;
    const textEl = clip.querySelector('[data-measure]');
    if (!textEl) return;
    const textNode = textEl.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
    const containerRect = clip.getBoundingClientRect();
    const range = document.createRange();
    let lo = 0;
    let hi = extract.length;
    let lastVisible = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      range.setStart(textNode, 0);
      range.setEnd(textNode, mid);
      const rect = range.getBoundingClientRect();
      if (rect.bottom <= containerRect.bottom + 1) {
        lastVisible = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    const char = lastVisible > 0 ? extract[lastVisible - 1] : '';
    setLastLineEndsWithPeriod(char === '.');
  }, [pageData?.extract, lineHeight]);

  const hasImage = !!pageData?.thumbnail;
  const thumb = pageData?.thumbnail;
  const isWider = thumb && thumb.width > thumb.height;
  const isSideways = hasImage && !isWider;

  if (loading) {
    return (
      <div className="w-80 flex items-center justify-center py-12 bg-white rounded border border-[#a2a9b1] shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
        <Loader2 className="w-5 h-5 animate-spin text-[#54595d]" />
      </div>
    );
  }

  if (error || !pageData?.extract) {
    return (
      <div className="w-80 p-4 text-sm text-[#54595d] bg-white rounded border border-[#a2a9b1] shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
        {error || 'No preview available'}
      </div>
    );
  }

  const extract = pageData.extract;

  // Sideways card: match Wikipedia — 450×250, text left, image right 203×250, gradient at bottom of text
  if (isSideways) {
    const sidewaysLines = 16;
    const textHeight = sidewaysLines * lineHeight;

    return (
      <div
        className="overflow-hidden rounded border border-[#a2a9b1] shadow-[0_2px_4px_rgba(0,0,0,0.15)] bg-white flex flex-row h-[250px] w-[450px]"
      >
        {/* Text block — left side, flex-1 */}
        <div className="flex-1 min-w-0 flex flex-col p-4 overflow-hidden relative">
          <div
            ref={measureRef}
            className="text-xs leading-relaxed text-[#202122] absolute opacity-0 pointer-events-none select-none"
            style={{ whiteSpace: 'nowrap' }}
            aria-hidden
          >
            M
          </div>
          <div ref={sidewaysClipRef} style={{ height: textHeight, overflow: 'hidden', position: 'relative' }}>
            <p data-measure className="text-xs text-[#202122] leading-relaxed text-left m-0 absolute inset-0 invisible pointer-events-none" aria-hidden>
              {extract}
            </p>
            <p className="text-xs text-[#202122] leading-relaxed text-left m-0">
              {renderExtractWithBold(extract, title)}
            </p>
          </div>
          {/* Right-side gradient on the last line only — opaque so it’s visible */}
          {!lastLineEndsWithPeriod && (
            <div
              className="absolute right-0 pointer-events-none"
              style={{
                bottom: '1rem',
                height: lineHeight,
                width: '7rem',
                background: 'linear-gradient(to right, transparent 0%, transparent 40%, white 70%)',
                zIndex: 10,
              }}
              aria-hidden
            />
          )}
        </div>
        {/* Image — right side, fixed 203×250 */}
        <div className="w-[203px] h-[250px] flex-shrink-0 overflow-hidden bg-[#f8f9fa]">
          <img
            src={thumb!.source}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    );
  }

  // Tall card: image 190px on top, text below; no-image cards max 200px, same gradient behavior
  const TALL_CARD_WIDTH = 320;
  const TALL_IMAGE_HEIGHT = 190;
  const NO_IMAGE_MAX_HEIGHT = 200;
  const tallLines = hasImage && isWider ? 6 : 8;
  const tallTextHeight = tallLines * lineHeight;

  return (
    <div
      className="overflow-hidden rounded border border-[#a2a9b1] shadow-[0_2px_4px_rgba(0,0,0,0.15)] bg-white flex flex-col w-[320px]"
      style={!(hasImage && isWider) ? { maxHeight: NO_IMAGE_MAX_HEIGHT } : undefined}
    >
      {hasImage && isWider ? (
        <div
          className="w-full flex-shrink-0 overflow-hidden bg-[#f8f9fa]"
          style={{ height: TALL_IMAGE_HEIGHT }}
        >
          <img
            src={thumb!.source}
            alt=""
            className="w-full h-full object-cover object-center block"
          />
        </div>
      ) : null}

      <div
        className="flex flex-col p-4 relative flex-shrink-0"
        style={{
          minHeight: tallTextHeight,
          ...(!(hasImage && isWider) ? { maxHeight: NO_IMAGE_MAX_HEIGHT - 32 } : {}),
        }}
      >
        <div
          ref={measureRef}
          className="text-xs leading-relaxed text-[#202122] absolute opacity-0 pointer-events-none select-none"
          style={{ whiteSpace: 'nowrap' }}
          aria-hidden
        >
          M
        </div>
        <div ref={tallClipRef} style={{ height: tallTextHeight, overflow: 'hidden', position: 'relative' }}>
          <p data-measure className="text-xs text-[#202122] leading-relaxed text-left m-0 absolute inset-0 invisible pointer-events-none" aria-hidden>
            {extract}
          </p>
          <p className="text-xs text-[#202122] leading-relaxed text-left m-0">
            {renderExtractWithBold(extract, title)}
          </p>
        </div>
        {!lastLineEndsWithPeriod && (
          <div
            className="absolute right-0 pointer-events-none"
            style={{
              bottom: '1rem',
              height: lineHeight,
              width: '10rem',
              background: 'linear-gradient(to right, transparent 0%, transparent 40%, white 70%)',
              zIndex: 10,
            }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
