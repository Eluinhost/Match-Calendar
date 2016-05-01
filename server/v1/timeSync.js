module.exports = function timeSync(req, res) {
    res.json({ time: Date.now() });
};
