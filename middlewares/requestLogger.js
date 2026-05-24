export function requestLogger(req, res, next) {
  const start = Date.now();
  console.log(`[api] hit ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    const ms = Date.now() - start;
    const contentLength = res.getHeader("content-length") || 0;
    console.log(`[api] done ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms - ${contentLength}B`);
  });
  next();
}
