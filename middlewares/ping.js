const ping = (req, res, next) => {
   try {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${req.method} ${req.url} - server pinged`);
      return res.status(200).send('OK');
   } catch (error) {
      next(new Error('error in pinging server'));
   }
};

module.exports = ping;
