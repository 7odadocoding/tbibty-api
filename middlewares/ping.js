const ping = (req, res, next) => {
   const timestamp = new Date().toISOString();
   console.log(`[${timestamp}] ${req.method} ${req.url} - server pinged`);
   next();
};

module.exports = ping;
