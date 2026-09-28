export const success = (res, data, status = 200) =>
  res.status(status).json({ success: true, data, error: null });

export const failure = (res, status, error) =>
  res.status(status).json({ success: false, data: null, error });

export function errorHandler(error, _req, res, _next) {
  const status =
    error.statusCode ||
    (error.code === "23505" ? 409 : error.code === "23503" ? 400 : 500);
  return failure(
    res,
    status,
    status === 500
      ? "Unexpected server error"
      : error.code === "23505"
        ? "A record with that unique value already exists"
        : "Related record does not exist",
  );
}