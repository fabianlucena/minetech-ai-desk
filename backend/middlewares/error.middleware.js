export default async function errorMiddleware(err, req, res, next) {
  res.json({ error: err.message });
}