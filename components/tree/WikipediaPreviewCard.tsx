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

export function WikipediaPreviewCard({ title }: WikipediaPreviewCardProps) {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lineHeight, setLineHeight] = useState(19.5);
  const [lastLineEndsWithPeriod, setLastLineEndsWithPeriod] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const sidewaysClipRef = useRef<HTMLDivElement>(null);

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

  // Sideways only: find last visible character to see if last line ends with a period
  useLayoutEffect(() => {
    const clip = sidewaysClipRef.current;
    const extract = pageData?.extract;
    if (!clip || !extract || !clip.isConnected) return;
    const textEl = clip.querySelector('p');
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
          <div ref={sidewaysClipRef} style={{ height: textHeight, overflow: 'hidden' }}>
            <p className="text-xs text-[#202122] leading-relaxed text-left m-0">
              {extract}
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

  // Tall card (image on top or no image)
  const totalLines = 5;
  const containerH = totalLines * lineHeight;

  const textContent = (
    <div style={{ position: 'relative', width: '100%', minWidth: 0 }}>
      <div
        ref={measureRef}
        className="text-xs leading-relaxed text-[#202122]"
        style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap', pointerEvents: 'none' }}
        aria-hidden
      >
        M
      </div>
      <div style={{ height: `${containerH}px`, overflow: 'hidden' }}>
        <p className="text-xs text-[#202122] leading-relaxed text-left m-0">
          {extract}
        </p>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          height: `${lineHeight}px`,
          width: '8rem',
          background: 'linear-gradient(to right, transparent, white)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        aria-hidden
      />
    </div>
  );

  return (
    <div
      className="overflow-hidden rounded border border-[#a2a9b1] shadow-[0_2px_4px_rgba(0,0,0,0.15)] bg-white w-80 max-h-80"
    >
      {hasImage && isWider ? (
        <div className="w-full overflow-hidden border-b border-[#c8ccd1]">
          <img
            src={thumb!.source}
            alt=""
            className="w-full h-auto block object-cover object-center"
            style={{ maxHeight: 160 }}
          />
        </div>
      ) : null}

      <div className="p-3">
        {textContent}
      </div>
    </div>
  );
}
