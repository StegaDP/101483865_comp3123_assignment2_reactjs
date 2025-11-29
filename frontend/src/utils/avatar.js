export const buildAvatarUrl = (imageId) => {
  if (!imageId) {
    return "";
  }
  return `/api/v1/img/${imageId}`;
};

export const getInitials = (firstName = "", lastName = "", fallback = "") => {
  const safeFirst = (firstName || "").trim();
  const safeLast = (lastName || "").trim();

  if (safeFirst || safeLast) {
    return `${safeFirst.slice(0, 1)}${safeLast.slice(0, 1)}`
      .trim()
      .toUpperCase();
  }

  return (fallback || "").split("@")[0].slice(0, 2).toUpperCase() || "??";
};
