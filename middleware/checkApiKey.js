function checkAPIKey(req, res, next) {
  const apiKey = req.headers["x-api-key"]; // Предположим, что API ключ передаётся в заголовке 'x-api-key'

  if (!apiKey) {
    return res
      .status(401)
      .json({ massage: "Необходим API ключ для доступа ресурсам." });
  }
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: "Неверный API ключ." });
  }

  next();
}

export default checkAPIKey;
