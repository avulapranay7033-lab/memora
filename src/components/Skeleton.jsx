import "./Skeleton.css";

function Skeleton({ width = "100%", height = "20px", radius = "8px", className = "" }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-row">
        <Skeleton width="44px" height="44px" radius="50%" />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height="16px" />
          <div style={{ height: 8 }} />
          <Skeleton width="40%" height="12px" />
        </div>
      </div>
    </div>
  );
}

function SkeletonStat() {
  return (
    <div className="skeleton-stat">
      <Skeleton width="50px" height="28px" radius="8px" />
      <Skeleton width="70px" height="14px" radius="6px" />
    </div>
  );
}

export { SkeletonCard, SkeletonStat };
export default Skeleton;
