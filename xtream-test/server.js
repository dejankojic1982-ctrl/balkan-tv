const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 8090;
const USER = process.env.XTREAM_USER || 'test_user';
const PASS = process.env.XTREAM_PASS || 'test_pass';

const channels = [
  { id: 1, name: 'BN TV', url: 'https://stream2.rtvbn.tv:8080/live_1935/bnstream/index.m3u8' },
  { id: 2, name: 'Pink TV', url: 'https://edge8.pink.rs/pinktv/index.m3u8' },
  { id: 3, name: 'BHRT', url: 'https://bhrtstream.bhtelecom.ba/hls13/bhrtportal_hd_1200.m3u8' },
  { id: 4, name: 'Narodna TV', url: 'https://edge8.pink.rs/narodnatv/playlist.m3u8' },
  { id: 5, name: 'Kurir TV', url: 'https://static.am.mediaoutcast.com/storage/nQJnjJkO/nQJnjJkO/stream/O68x4o8g/720p/720p.m3u8' },
  { id: 6, name: 'RTV 1', url: 'http://212.200.230.50:1935/RTV/rtv1/playlist.m3u8' },
  { id: 7, name: 'RTV 2', url: 'http://212.200.230.50:1935/RTV/rtv2/playlist.m3u8' },
  { id: 8, name: 'TVCG MNE', url: 'https://rtcg-live-open.morescreens.com/RTCG_1_004/playlist.m3u8' },
  { id: 9, name: 'RT Balkan', url: 'https://rt-srb.rttv.com/dvr/rtbalkan/playlist_4500Kb.m3u8' },
  { id: 10, name: 'RTV Zenica', url: 'https://stream.rtvze.ba/live/123/123.m3u8' },
  { id: 11, name: 'RTV Herceg-Bosne', url: 'https://prd-hometv-live-open.spectar.tv/ERO_1_083/playlist.m3u8' },
  { id: 12, name: 'CMC TV', url: 'https://stream.cmctv.hr:49998/cmc/live.m3u8' },
  { id: 13, name: 'Klape i Tambure TV', url: 'https://stream.cmctv.hr:49998/kit/live.m3u8' },
  { id: 14, name: 'TV Nova lokalna', url: 'https://stream.agatin.hr:3727/live/tvnovalive.m3u8' },
  { id: 15, name: 'Diadora TV', url: 'https://diadoratv.stream/live/diadora/playlist.m3u8' },
  { id: 16, name: 'TV Jadran', url: 'https://tvjadran.stream.agatin.hr:3412/live/tvjadranlive.m3u8' },
  { id: 17, name: 'Libertas TV', url: 'https://stream.luci.xyz/hls/LTV.m3u8' },
  { id: 18, name: 'SBTV', url: 'https://live.leveex.hr/hls/live.m3u8' },
  { id: 19, name: 'TV Hram', url: 'https://vod1.laki.eu/live/hram/index.m3u8' },
  { id: 20, name: 'RTV Novi Pazar', url: 'https://tv.rtvnp.rs/stream.m3u8' },
  { id: 21, name: 'TV Pi Kanal', url: 'https://stream.pikanal.rs/pikanal/pgm.m3u8' },
  { id: 22, name: 'STV Hrvatska', url: 'http://89.201.163.244:8080/hls/hdmi.m3u8' },
  { id: 23, name: 'Kanal Ri', url: 'https://live.kanal-ri.click/LiveApp/streams/B6HK3voDwNsRQoLm1124882102135504.m3u8' },
  { id: 24, name: 'Televizija 5', url: 'https://balkanmedia.dynu.net/hls/tv5web.m3u8' },
  { id: 25, name: 'Televizija M', url: 'https://live.tv-m.net/hls/stream.m3u8' }
];

function json(res, data, status=200) {
  const body = JSON.stringify(data);
  res.writeHead(status, {'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Content-Length':Buffer.byteLength(body)});
  res.end(body);
}

function serverInfo(req) {
  const host = req.headers.host || 'localhost:' + PORT;
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const idx = host.lastIndexOf(':');
  const hostname = idx > -1 ? host.slice(0, idx) : host;
  const port = idx > -1 ? host.slice(idx + 1) : (proto === 'https' ? '443' : '80');
  return {
    url: hostname,
    port,
    https_port: proto === 'https' ? port : '0',
    server_protocol: proto,
    rtmp_port: '1935',
    timezone: 'Europe/Sarajevo',
    timestamp_now: Math.floor(Date.now()/1000),
    time_now: new Date().toISOString().replace('T',' ').slice(0,19)
  };
}

const server = http.createServer((req,res) => {
  const base = 'http://' + (req.headers.host || 'localhost:' + PORT);
  const url = new URL(req.url, base);

  if (url.pathname === '/player_api.php') {
    const ok = url.searchParams.get('username') === USER && url.searchParams.get('password') === PASS;
    if (!ok) return json(res,{user_info:{auth:0,status:'Disabled',message:'Invalid credentials'}},401);

    const action = url.searchParams.get('action');
    if (action === 'get_live_categories') return json(res,[{category_id:'1',category_name:'Balkan TV',parent_id:0}]);
    if (action === 'get_live_streams') {
      return json(res, channels.map(c => ({
        num:c.id,name:c.name,stream_type:'live',stream_id:c.id,stream_icon:'',
        epg_channel_id:null,added:'0',category_id:'1',custom_sid:'',
        tv_archive:0,direct_source:'',tv_archive_duration:0
      })));
    }

    return json(res,{
      user_info:{
        username:USER,password:PASS,message:'Balkan TV test Xtream',auth:1,status:'Active',
        exp_date:'1999999999',is_trial:'0',active_cons:'0',created_at:'0',
        max_connections:'10',allowed_output_formats:['m3u8','ts']
      },
      server_info: serverInfo(req)
    });
  }

  const m = url.pathname.match(/^\/live\/([^/]+)\/([^/]+)\/(\d+)\.(m3u8|ts)$/);
  if (m) {
    const [,u,p,id] = m;
    if (u !== USER || p !== PASS) return json(res,{error:'Invalid credentials'},401);
    const ch = channels.find(c => c.id === Number(id));
    if (!ch) return json(res,{error:'Stream not found'},404);
    res.writeHead(302,{Location:ch.url});
    return res.end();
  }

  if (url.pathname === '/get.php') {
    const ok = url.searchParams.get('username') === USER && url.searchParams.get('password') === PASS;
    if (!ok) return res.writeHead(401).end('Invalid credentials');
    let body='#EXTM3U\n';
    for (const c of channels) body += `#EXTINF:-1 group-title="Balkan TV",${c.name}\n${base}/live/${USER}/${PASS}/${c.id}.m3u8\n`;
    res.writeHead(200,{'Content-Type':'application/x-mpegURL','Content-Length':Buffer.byteLength(body)});
    return res.end(body);
  }

  json(res,{ok:true,service:'Balkan TV Xtream test server'});
});

server.listen(PORT,'0.0.0.0',()=>console.log('Xtream test server listening on',PORT));
