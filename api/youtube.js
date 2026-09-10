const fallbackVideos = [
  { videoId: '28gF2wVUeBM', title: 'Bito Screen 1', category: 'Food & Beverage / Content', image: 'https://i.ytimg.com/vi/28gF2wVUeBM/hqdefault.jpg' },
  { videoId: 'YIVEPAa7FWQ', title: 'Bito Screen 2', category: 'Food & Beverage / Content', image: 'https://i.ytimg.com/vi/YIVEPAa7FWQ/hqdefault.jpg' },
  { videoId: 'nHarODajKSU', title: 'VYZORA Showcased as a Super Car', category: 'Creative Production / Short', image: 'https://i.ytimg.com/vi/nHarODajKSU/hqdefault.jpg' },
  { videoId: 'MiNuuXdDjWg', title: '10 September 2026', category: 'Creative Production / Short', image: 'https://i.ytimg.com/vi/MiNuuXdDjWg/hqdefault.jpg' },
  { videoId: 'urAsTqWD0Qg', title: 'Sakoon Perfume CGI ad 2', category: 'Perfume / CGI / Short', image: 'https://i.ytimg.com/vi/urAsTqWD0Qg/hqdefault.jpg' },
  { videoId: 'N2c59hdhyFI', title: 'Sakoon-Perfume CGI ad', category: 'Perfume / CGI / Short', image: 'https://i.ytimg.com/vi/N2c59hdhyFI/hqdefault.jpg' },
  { videoId: 'AMY_-uERE3E', title: 'CGI ad-Beauty Brands Editions', category: 'Beauty / CGI / Short', image: 'https://i.ytimg.com/vi/AMY_-uERE3E/hqdefault.jpg' },
  { videoId: 'Mwct32P7F-8', title: 'EMPEROR-Energy Drink CGI ad', category: 'Energy Drink / CGI / Short', image: 'https://i.ytimg.com/vi/Mwct32P7F-8/hqdefault.jpg' },
  { videoId: 'kDh1X1IvjNY', title: 'EMPEROR Perfume-CGI ad', category: 'Perfume / CGI / Short', image: 'https://i.ytimg.com/vi/kDh1X1IvjNY/hqdefault.jpg' },
  { videoId: 'gM9uw0oeHdE', title: '2 September 2026', category: 'Creative Production / Short', image: 'https://i.ytimg.com/vi/gM9uw0oeHdE/hqdefault.jpg' },
  { videoId: 'Q_WILFZENhk', title: 'AURELUME Petal Drop Tint — AI Avatar Ad', category: 'Beauty / AI Avatar / Short', image: 'https://i.ytimg.com/vi/Q_WILFZENhk/hqdefault.jpg' },
  { videoId: 'ZMX_ifL0C9Y', title: 'AURELUME Luma Renew Mask — AI Avatar Ad', category: 'Beauty / AI Avatar / Short', image: 'https://i.ytimg.com/vi/ZMX_ifL0C9Y/hqdefault.jpg' }
];

module.exports = async (req, res) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCk55ZFuzsQyXNspRBso5eBg';
  const maxResults = Number(process.env.YOUTUBE_MAX_RESULTS || 50);

  function send(payload) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.statusCode = 200;
    res.end(JSON.stringify(payload));
  }

  if (!apiKey) {
    return send({ videos: fallbackVideos });
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&maxResults=${maxResults}&order=date&type=video&key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];

    const videos = items.map((item) => {
      const snippet = item.snippet || {};
      const thumb = snippet.thumbnails?.high || snippet.thumbnails?.medium || snippet.thumbnails?.default || {};
      const videoId = item.id?.videoId || '';

      return {
        videoId,
        title: snippet.title || 'YouTube video',
        category: snippet.channelTitle || 'Creative Content',
        image: thumb.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      };
    }).filter((video) => video.videoId);

    if (!videos.length) {
      return send({ videos: fallbackVideos });
    }

    return send({ videos });
  } catch (error) {
    return send({ videos: fallbackVideos });
  }
};
