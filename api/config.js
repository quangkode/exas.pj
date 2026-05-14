module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ mapboxToken: process.env.MAPBOX_TOKEN || '' });
};
