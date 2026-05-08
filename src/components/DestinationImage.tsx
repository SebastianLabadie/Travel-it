interface Props {
  slug: string;
  name: string;
  width: number;
  height: number;
}

/**
 * Renders a destination photo from /public/images/destinations/{slug}.jpg.
 * Lazy + async decode; bg color shows during load and as a fallback.
 */
export function DestinationImage({ slug, name, width, height }: Props) {
  return (
    <img
      src={`/images/destinations/${slug}.jpg`}
      alt={name}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={{
        width,
        height,
        objectFit: 'cover',
        flexShrink: 0,
        background: 'var(--color-bg-alt)',
        border: '1px solid var(--color-rule)',
        display: 'block',
      }}
    />
  );
}
