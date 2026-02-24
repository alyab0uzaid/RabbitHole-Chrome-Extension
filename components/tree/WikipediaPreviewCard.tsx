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

interface TextMetrics {
  splitIdx: number;
  lineHeight: number;
}

function renderWithBold(text: string, title: string) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'i');
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === title.toLowerCase() ? <strong key={i}>{part}</strong> : part
  );
}

export function WikipediaPreviewCard({ title }: WikipediaPreviewCardProps) {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textMetrics, setTextMetrics] = useState<TextMetrics | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setTextMetrics(null);

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

  const hasImage = !!pageData?.thumbnail;
  const thumb = pageData?.thumbnail;
  const isWider = thumb && thumb.width > thumb.height;
  const isSideways = hasImage && !isWider;

  // After each render, measure exactly where line N ends so we can split the text.
  // Binary-search on char index: find the last char whose range still fits within
  // LINES_BEFORE * lineHeight pixels. Runs before browser paint (useLayoutEffect).
  useLayoutEffect(() => {
    const el = measureRef.current;
    const extract = pageData?.extract;
    if (!el || !extract) { setTextMetrics(null); return; }

    const textNode = el.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) { setTextMetrics(null); return; }

    const lh = parseFloat(window.getComputedStyle(el).lineHeight);
    if (isNaN(lh) || lh <= 0) { setTextMetrics(null); return; }

    const LINES_BEFORE = isSideways ? 17 : 5;
    const containerTop = el.getBoundingClientRect().top;
    const targetBottom = containerTop + LINES_BEFORE * lh + 0.5; // +0.5 for float precision

    const range = document.createRange();
    let lo = 0, hi = extract.length, result = 0;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      range.setStart(textNode, 0);
      range.setEnd(textNode, mid);
      if (range.getBoundingClientRect().bottom <= targetBottom) {
        result = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    // Snap backward to the nearest word boundary so we never split mid-word.
    const spacePos = extract.lastIndexOf(' ', result);
    const splitIdx = spacePos <= 0 ? 0 : spacePos + 1;

    setTextMetrics({ splitIdx, lineHeight: lh });
  }, [pageData?.extract, isSideways]);

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
  const LINES_BEFORE = isSideways ? 17 : 5;
  const lh = textMetrics?.lineHeight ?? 19.5; // text-xs leading-relaxed default
  const splitIdx = textMetrics?.splitIdx ?? null;

  const firstPart = splitIdx !== null ? extract.slice(0, splitIdx) : '';
  const lastPart  = splitIdx !== null ? extract.slice(splitIdx)  : extract;

  const cardStyle = isSideways
    ? { width: 450, height: 250 }
    : { width: 320, maxHeight: 320 };

  // The text block is shared between both layouts; only the wrapper differs.
  const textBlock = (
    <div style={{ position: 'relative' }}>
      {/* Invisible measurement node — same font/width as the real paragraphs.
          position:absolute keeps it out of flow; visibility:hidden lets Range
          measure it while keeping it off-screen. */}
      <div
        ref={measureRef}
        className="text-xs leading-relaxed text-[#202122]"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: 'none',
          whiteSpace: 'normal',
        }}
        aria-hidden
      >
        {extract}
      </div>

      {/* Lines 1–(N-1): normal wrapping, clipped to exact height */}
      <p
        className="text-xs text-[#202122] leading-relaxed text-left"
        style={{ height: `${LINES_BEFORE * lh}px`, overflow: 'hidden', margin: 0 }}
      >
        {firstPart ? renderWithBold(firstPart, title) : null}
      </p>

      {/* Line N: single non-wrapping line, clipped + faded on the right */}
      <div style={{ position: 'relative', overflow: 'hidden', height: `${lh}px` }}>
        <p
          className="text-xs text-[#202122] leading-relaxed text-left"
          style={{ whiteSpace: 'nowrap', margin: 0 }}
        >
          {lastPart ? renderWithBold(lastPart, title) : null}
        </p>
        {/* Gradient: opaque white on the right, transparent toward the left */}
        <div
          className="pointer-events-none bg-gradient-to-l from-white to-transparent"
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '8rem' }}
          aria-hidden
        />
      </div>
    </div>
  );

  return (
    <div
      className="overflow-hidden rounded border border-[#a2a9b1] shadow-[0_2px_4px_rgba(0,0,0,0.15)] bg-white"
      style={cardStyle}
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

      <div className={isSideways ? 'flex h-full' : 'p-3'}>
        {hasImage && !isWider && (
          <div className="flex-shrink-0 overflow-hidden self-stretch" style={{ width: 203 }}>
            <img
              src={thumb!.source}
              alt=""
              className="w-full h-full min-h-[250px] object-cover object-center"
            />
          </div>
        )}

        {isSideways ? (
          <div className="flex-1 p-4 overflow-hidden min-w-0">
            {textBlock}
          </div>
        ) : (
          textBlock
        )}
      </div>
    </div>
  );
}
