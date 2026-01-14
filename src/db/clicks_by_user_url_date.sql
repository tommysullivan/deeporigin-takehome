SELECT 
  u."userId",
  u.id AS url_id,
  u."shortURLSlug",
  u."originalURL",
  DATE(c.timestamp) AS click_date,
  COUNT(*) AS click_count
FROM urls u
INNER JOIN clicks c ON c.url_id = u.id
WHERE u."userId" IS NOT NULL
GROUP BY u."userId", u.id, u."shortURLSlug", u."originalURL", DATE(c.timestamp)
ORDER BY u."userId", u.id, click_date DESC;