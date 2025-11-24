import "./InstagramFeed.css";

function SkeletonCard() {
  return (
    <div className="ig-card ig-skeleton" aria-hidden="true">
      <div className="ig-card-header" />
      <div className="ig-skel-media" />
      <div className="ig-card-footer" />
    </div>
  );
}

function truncate(text, max = 120) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

export default function InstagramFeedLite({
  media = [],
  limit = 3,
  columns = { base: 2, md: 3, lg: 3 },
  className = "",
  loading = false,
  username = "cafepoiesis",
  profileUrl = "https://www.instagram.com/cafepoiesis/",
}) {
  const list = media.slice(0, limit);

  const gridStyle = {
    "--ig-cols-base": columns.base ?? 2,
    "--ig-cols-md": columns.md ?? columns.base ?? 2,
    "--ig-cols-lg": columns.lg ?? columns.md ?? columns.base ?? 2,
  };

  return (
    <section
      className={`ig-wrap ${className}`}
      style={gridStyle}
      aria-label="Instagram"
    >
      {loading && list.length === 0 &&
        Array.from({ length: Math.min(limit, 6) }).map((_, i) => (
          <SkeletonCard key={`skel-${i}`} />
        ))}

      {!loading && list.length === 0 && (
        <p className="ig-empty">No hay publicaciones para mostrar.</p>
      )}

      {list.map((item) => {
        const isVideo = item.mediaType === "VIDEO";
        const thumb = item.thumbnailUrl || item.mediaUrl;
        const caption = truncate(item.caption);

        return (
          <article className="ig-card" key={item.id}>
            <header className="ig-card-header">
              <div className="ig-avatar">
                <span>
                  <img
                    src="/logo-cafepoiesis.jpg"
                    alt="Logo Café Poiesis"
                    width="30"
                    height="30"
                    className="me-2 rounded-circle"
                  />
                </span>
              </div>
              <div className="ig-header-text">
                <span className="ig-username">{username}</span>
              </div>
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                className="ig-btn-profile"
              >
                Ver perfil
              </a>
            </header>

            {isVideo ? (
              // 👉 VIDEO: sin <a>, solo se reproduce
              <div className="ig-media-link">
                <div className="ig-media-wrapper">
                  <video
                    className="ig-video"
                    src={item.mediaUrl}
                    poster={item.thumbnailUrl || undefined}
                    playsInline
                    muted
                    loop
                    controls
                  />
                  <span className="ig-badge-play">▶</span>
                </div>
              </div>
            ) : (
              // 👉 IMAGEN: mantiene el link a Instagram
              <a
                href={item.permalink}
                target="_blank"
                rel="noreferrer"
                className="ig-media-link"
              >
                <div className="ig-media-wrapper">
                  <img
                    src={item.mediaUrl}
                    alt={item.caption || "Publicación de Instagram"}
                    loading="lazy"
                  />
                </div>
              </a>
            )}

            <footer className="ig-card-footer">
              <a
                href={item.permalink}
                target="_blank"
                rel="noreferrer"
                className="ig-link-post"
              >
                Ver en Instagram
              </a>

              {caption && (
                <p className="ig-caption">
                  <span className="ig-caption-user">{username}</span>{" "}
                  {caption}
                </p>
              )}
            </footer>
          </article>
        );
      })}
    </section>
  );
}