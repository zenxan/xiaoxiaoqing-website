document.addEventListener('DOMContentLoaded', () => {
    // 音乐列表数据
    const musicList = [
        {
            url: 'http://music.163.com/song/media/outer/url?id=1398663411.mp3',  // 晴天
            title: '晴天',
            artist: '周杰伦',
            cover: 'https://y.qq.com/music/photo_new/T002R300x300M000000MkMni19ClKG_3.jpg'
        },
        {
            url: 'http://music.163.com/song/media/outer/url?id=1824045032.mp3',   // 滥俗的歌
            title: '滥俗的歌',
            artist: '汉堡黄',
            cover: 'http://p2.music.126.net/uOvEut2NG6enWVM1s_lJZQ==/109951167656922852.jpg?param=130y130'
        },
        {
            url: 'http://music.163.com/song/media/outer/url?id=186016.mp3',   // 反方向的钟
            title: '反方向的钟',
            artist: '周杰伦',
            cover: 'https://y.qq.com/music/photo_new/T002R300x300M000000I5jJB3blWeN_1.jpg'
        }
    ];

    const musicContainer = document.querySelector('.music-list');

    // 渲染音乐列表
    function renderMusicList() {
        musicContainer.innerHTML = musicList.map(music => `
            <div class="music-item">
                <img src="${music.cover}" class="music-cover" alt="${music.title}">
                <div class="music-info">
                    <h3 class="music-title">${music.title}</h3>
                    <p class="music-artist">${music.artist}</p>
                    <div class="player-wrapper">
                        <iframe 
                            frameborder="no" 
                            border="0" 
                            marginwidth="0" 
                            marginheight="0" 
                            width=330 
                            height=86 
                            src="//music.163.com/outchain/player?type=2&id=${music.url.split('id=')[1].split('.')[0]}&auto=0&height=66">
                        </iframe>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 初始化
    renderMusicList();
}); 