module.exports = (req, res, next) => {
  const timestamp = new Date().toLocaleString('fr-CA', { timeZone: 'America/Toronto' });

  res.on('finish', () => {
    const status = res.statusCode;
    if (status === 304) return; // ignore
    const statusType = status >= 400 ? 'ERROR' : 'OK';

    console.log(`[${timestamp}] ${statusType} ${req.method} ${req.originalUrl} [${status}]`, req.body); 
  });

  next();
};
