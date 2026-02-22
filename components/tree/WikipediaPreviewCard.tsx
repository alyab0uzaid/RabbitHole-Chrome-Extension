import { useEffect, useState } from 'react';
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

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchPreview = async () => {
      try {
        const titleParam = encodeURIComponent(title.replace(/ /g, '_'));
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${titleParam}`);
        if (cancelled) return;
        if (!res.ok) {
          setError('No article found');
          return;
        }
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

  const hasImage = !!pageData.thumbnail;
  const thumb = pageData.thumbnail;
  const isWider = thumb && thumb.width > thumb.height;
  const isSideways = hasImage && !isWider;

  const cardStyle = isSideways
    ? { width: 450, height: 250 }
    : { width: 320, maxHeight: 320 };

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
          <div
            className="flex-shrink-0 overflow-hidden self-stretch"
            style={{ width: 203 }}
          >
            <img
              src={thumb!.source}
              alt=""
              className="w-full h-full min-h-[250px] object-cover object-center"
            />
          </div>
        )}
        <div className={isSideways ? 'flex-1 p-4 flex items-start min-w-0' : ''}>
          <p className={`text-[0.9rem] text-[#202122] leading-[1.5] text-left overflow-hidden min-w-0 ${isSideways ? '' : 'line-clamp-6'}`}>
            {pageData.extract}
          </p>
        </div>
      </div>
    </div>
  );
}
