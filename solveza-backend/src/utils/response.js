export const ok = (res, data = {}, status = 200) => res.status(status).json({ ok: true, data });
export const fail = (res, message = "Something went wrong", status = 400) =>
  res.status(status).json({ ok: false, message });
