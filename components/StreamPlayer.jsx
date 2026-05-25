'use client';

import { useState, useEffect, useRef } from 'react';
import { Maximize, RefreshCw, AlertCircle, ShieldAlert, Shield, ShieldOff, Cpu, Play, Pause, Volume2, Volume1, VolumeX } from 'lucide-react';

export default function StreamPlayer({ streamUrl, channels, matchTitle, matchStatus }) {
  const isUpcoming = matchStatus === 'upcoming';
  const [activeChannel, setActiveChannel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [streamStatus, setStreamStatus] = useState('loading');
  const [loadTimeout, setLoadTimeout] = useState(null);
  
  // Custom video state hooks
  const [hlsLoaded, setHlsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [sandboxShield, setSandboxShield] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const iframeRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const hlsInstanceRef = useRef(null);

  const allChannels = channels && channels.length > 0 ? channels : [{ name: 'Stream 1', url: streamUrl, proxiedUrl: streamUrl }];
  const currentUrl = allChannels[activeChannel]?.proxiedUrl || allChannels[activeChannel]?.url || streamUrl;

  // Auto-detect direct stream sources like .m3u8, .mpd, .mp4
  const isDirectHls = currentUrl && (
    currentUrl.includes('.m3u8') || 
    currentUrl.includes('.mpd') || 
    currentUrl.includes('/hls/') || 
    currentUrl.includes('.mp4')
  );

  const handleLoad = () => {
    setIsLoading(false);
    setStreamStatus('active');
    if (loadTimeout) clearTimeout(loadTimeout);
  };

  const handleError = () => {
    setIsLoading(false);
    setStreamStatus('error');
    if (loadTimeout) clearTimeout(loadTimeout);
  };

  // Dynamically load hls.js from highly-resilient CDN if an HLS stream is loaded
  useEffect(() => {
    if (!isDirectHls) return;
    if (window.Hls) {
      setHlsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.0/dist/hls.min.js';
    script.async = true;
    script.onload = () => {
      setHlsLoaded(true);
    };
    script.onerror = () => {
      setStreamStatus('error');
    };
    document.body.appendChild(script);
  }, [isDirectHls]);

  // Video element binding effect
  useEffect(() => {
    if (!isDirectHls || !hlsLoaded || !videoRef.current) return;

    const video = videoRef.current;
    
    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
      hlsInstanceRef.current = null;
    }

    setIsLoading(true);
    setStreamStatus('loading');
    setIsPlaying(true);

    // Safari / iOS Native HLS support
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = currentUrl;
      const onLoadedMetadata = () => {
        setIsLoading(false);
        setStreamStatus('active');
        video.play().catch(() => {});
      };
      const onNativeError = () => {
        setStreamStatus('error');
      };
      
      video.addEventListener('loadedmetadata', onLoadedMetadata);
      video.addEventListener('error', onNativeError);
      
      return () => {
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.removeEventListener('error', onNativeError);
      };
    } else if (window.Hls) {
      // Chrome/Firefox Hls.js setup
      const hls = new window.Hls({
        maxBufferSize: 20 * 1024 * 1024, // 20MB Max buffer
        maxBufferLength: 20, // 20s
        liveSyncDuration: 3, // Live delay
      });
      hlsInstanceRef.current = hls;

      hls.loadSource(currentUrl);
      hls.attachMedia(video);

      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        setStreamStatus('active');
        video.play().catch(() => {});
      });

      hls.on(window.Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case window.Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Fatal network error, trying to recover HLS stream...');
              hls.startLoad();
              break;
            case window.Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Fatal media error, attempting error recovery...');
              hls.recoverMediaError();
              break;
            default:
              setStreamStatus('error');
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        if (hlsInstanceRef.current) {
          hlsInstanceRef.current.destroy();
          hlsInstanceRef.current = null;
        }
      };
    }
  }, [currentUrl, isDirectHls, hlsLoaded]);

  // General connection timeouts
  useEffect(() => {
    if (isDirectHls) return;
    setIsLoading(true);
    setStreamStatus('loading');
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setStreamStatus('offline');
    }, 10000);
    setLoadTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [currentUrl, isDirectHls]);

  const tryNextSource = () => {
    if (activeChannel < allChannels.length - 1) {
      setActiveChannel(prev => prev + 1);
    } else {
      setActiveChannel(0);
    }
  };

  const reloadStream = () => {
    setIsLoading(true);
    setStreamStatus('loading');
    if (isDirectHls) {
      if (videoRef.current) {
        const video = videoRef.current;
        if (hlsInstanceRef.current) {
          hlsInstanceRef.current.loadSource(currentUrl);
          hlsInstanceRef.current.startLoad();
        } else {
          video.src = '';
          video.src = currentUrl;
          video.load();
        }
      }
    } else {
      if (iframeRef.current) {
        iframeRef.current.src = currentUrl;
      }
    }
  };

  const toggleFullscreen = () => {
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (el.requestFullscreen) {
      el.requestFullscreen();
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
      if (nextMute) {
        setVolume(0);
      } else {
        setVolume(0.8);
        videoRef.current.volume = 0.8;
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Player window container */}
      <div 
        ref={playerRef} 
        className={`relative overflow-hidden bg-black shadow-2xl transition-all duration-500 ease-out group ${
          isTheaterMode 
            ? 'w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] rounded-none border-y border-zinc-800 h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh]' 
            : 'w-full rounded-2xl border border-zinc-800'
        }`}
        style={isTheaterMode ? undefined : { aspectRatio: '16/9' }}
      >
        {/* Loading Spinner Screen */}
        {isLoading && streamStatus !== 'error' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050508]">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />
              <Cpu className="absolute h-5 w-5 text-violet-400 animate-pulse" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Connecting Secure Stream...</p>
            <p className="mt-1 text-[11px] text-zinc-500">
              {isDirectHls ? 'Initializing HLS player engine' : 'Resolving cryptographic tokens'}
            </p>
          </div>
        )}

        {/* Stream Load Error Screen */}
        {streamStatus === 'error' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050508]/98 px-6 text-center">
            <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-sm font-bold text-white">Stream Embedding Restrained</p>
            <p className="mt-1.5 text-xs text-zinc-500 max-w-sm">
              The external stream server blocks raw iframe embeds or is currently offline.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                onClick={tryNextSource}
                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20"
              >
                Switch Server
              </button>
              <button
                onClick={reloadStream}
                className="rounded-lg bg-zinc-900 border border-zinc-850 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
              >
                Retry Source
              </button>
            </div>
          </div>
        )}

        {/* Timeout Screen */}
        {streamStatus === 'offline' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050508]/98 px-6 text-center">
            <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-6 w-6 text-amber-400" />
            </div>
            <p className="text-sm font-bold text-white">Stream Source Connection Timeout</p>
            <p className="mt-1.5 text-xs text-zinc-500 max-w-sm">
              The response from the provider took too long. Try switching servers.
            </p>
            <button
              onClick={tryNextSource}
              className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/20"
            >
              Switch Server
            </button>
          </div>
        )}

        {/* Video Player or Sandboxed Iframe Embed */}
        {isDirectHls ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-contain bg-black cursor-pointer"
            playsInline
            onClick={handlePlayPause}
          />
        ) : sandboxShield ? (
          <iframe
            key={`${currentUrl}-secured`}
            ref={iframeRef}
            src={currentUrl}
            className="absolute inset-0 h-full w-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            onLoad={handleLoad}
            onError={handleError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
          />
        ) : (
          <iframe
            key={`${currentUrl}-compat`}
            ref={iframeRef}
            src={currentUrl}
            className="absolute inset-0 h-full w-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}

        {/* Play Icon Center Overlay (When Paused) */}
        {isDirectHls && !isPlaying && streamStatus === 'active' && (
          <div 
            onClick={handlePlayPause}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1.5px] cursor-pointer animate-fade-in"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/90 text-white shadow-[0_0_30px_rgba(124,58,237,0.6)] border border-violet-400/20 transform scale-100 hover:scale-110 active:scale-95 transition-all duration-300">
              <Play className="h-7 w-7 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Upcoming Status Banner overlay */}
        {isUpcoming && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 px-6 text-center">
            <ShieldAlert className="h-10 w-10 text-violet-400 mb-3" />
            <p className="text-sm font-bold text-white">Fixture Has Not Started Yet</p>
            <p className="mt-1 text-xs text-zinc-500 max-w-xs">
              Live streams will be generated by our provider strategy registry close to kickoff.
            </p>
          </div>
        )}

        {/* Floating details overlay (Top left) */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-none">
          <span className="rounded-full bg-black/75 backdrop-blur-md border border-zinc-800/80 px-3 py-1 text-xs font-bold text-white">
            {matchTitle}
          </span>
          {streamStatus === 'active' && matchStatus === 'live' && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-600/90 border border-red-500/30 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Live Stream
            </span>
          )}
        </div>

        {/* CUSTOM VIDEO CONTROLS OVERLAY (Only for Direct HLS Video) */}
        {isDirectHls && streamStatus === 'active' && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2.5">
            
            {/* Live timeline indicator */}
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 rounded-full bg-zinc-800/80 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-red-500 tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                Live
              </span>
            </div>

            {/* Custom Control Buttons Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {/* Play/Pause Button */}
                <button
                  onClick={handlePlayPause}
                  className="rounded-lg bg-white/10 hover:bg-white/20 p-2 text-white transition-all active:scale-90"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white" />}
                </button>

                {/* Volume / Mute slider control */}
                <div className="flex items-center gap-2 group/volume">
                  <button
                    onClick={handleMuteToggle}
                    className="rounded-lg bg-white/10 hover:bg-white/20 p-2 text-white transition-all active:scale-90"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4 text-zinc-450" /> : volume < 0.4 ? <Volume1 className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/volume:w-20 focus:w-20 transition-all duration-300 h-1 appearance-none rounded-full bg-zinc-800 accent-violet-500 cursor-pointer outline-none"
                  />
                </div>

                {/* Status Indicator */}
                <span className="inline-flex items-center gap-1.5 rounded-md bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-violet-400">
                  Native Player (Ad-Free)
                </span>
              </div>

              {/* Right panel controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={reloadStream}
                  className="rounded-lg bg-white/10 hover:bg-white/20 p-2 text-zinc-200 hover:text-white transition-all active:scale-90"
                  title="Reload Server Connection"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="rounded-lg bg-white/10 hover:bg-white/20 p-2 text-zinc-200 hover:text-white transition-all active:scale-90"
                  title="Toggle Fullscreen"
                >
                  <Maximize className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Dynamic Security/Compatibility Hint Alert Ribbon */}
      {!isDirectHls && sandboxShield && (
        <div className="bg-violet-50 dark:bg-violet-950/15 border border-violet-200 dark:border-violet-500/20 rounded-xl p-4 text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed animate-fade-in space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 text-violet-700 dark:text-violet-400 font-bold">
            <Shield className="h-4 w-4 text-violet-600 dark:text-violet-500" />
            <span>Ad-Shield Active (Intrusive Ad & Popup Blocker)</span>
          </div>
          <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 leading-normal">
            <strong>What this does:</strong> The stream is loaded inside a secure sandbox that strictly blocks malicious scripts, auto-downloads, tracking cookies, and aggressive popup advertisement redirects.
          </p>
          <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 leading-normal">
            <strong>What could happen:</strong> Some external stream hosts detect sandboxing and will block playback with an <strong>"Embed Blocked"</strong> or black screen.
          </p>
          <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 leading-normal">
            <strong>Why it happens:</strong> These third-party stream hosts make revenue through aggressive ad redirects. They block sandboxed players to force you to view their popups. Turn Ad-Shield <strong>OFF</strong> below if the stream refuses to load.
          </p>
        </div>
      )}

      {/* Dynamic Action Toolbar (Refresh, Theater, Fullscreen, Ad-Shield Toggle) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel p-4 rounded-xl shadow-md">
        
        {/* Left Side: Security Warning or Ad-Shield Toggle */}
        {!isDirectHls ? (
          <div className="flex items-center gap-3 bg-zinc-200/60 dark:bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-300/40 dark:border-zinc-900/60 w-full lg:w-auto shadow-inner">
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${sandboxShield ? 'bg-green-500' : 'bg-red-400 animate-pulse'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Ad-Shield {sandboxShield ? 'ON' : 'OFF'}
                </span>
              </div>
              <span className="text-[9px] text-zinc-500 dark:text-zinc-500 mt-0.5 leading-none block">
                {sandboxShield ? "Blocking redirects & popups" : "⚠ Protection disabled"}
              </span>
            </div>
            <button
              onClick={() => setSandboxShield(!sandboxShield)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ml-auto lg:ml-2 ${
                sandboxShield ? 'bg-green-600' : 'bg-zinc-300 dark:bg-zinc-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  sandboxShield ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-left bg-zinc-200/40 dark:bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-300/40 dark:border-zinc-900/60 w-full lg:w-auto shadow-inner">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Native Player Active
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-0.5 leading-none block">
                Direct HLS decoder runs inside native media sandbox.
              </span>
            </div>
          </div>
        )}

        {/* Right Side: Viewport Controls Group */}
        <div className="flex items-center gap-2 bg-zinc-200/60 dark:bg-zinc-950/60 p-1.5 rounded-lg border border-zinc-300/40 dark:border-zinc-900/60 w-full lg:w-auto justify-end shadow-inner">
          {/* Refresh button */}
          <button
            onClick={reloadStream}
            className="rounded-md bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3 py-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold border border-zinc-300 dark:border-zinc-950 shadow-sm cursor-pointer"
            title="Reload Stream Connection"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Theater Mode Toggle button */}
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className={`rounded-md px-3 py-1.5 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold border cursor-pointer ${
              isTheaterMode 
                ? 'border-violet-500/45 bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600/20 shadow-sm' 
                : 'border-zinc-300 dark:border-zinc-950 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white shadow-sm'
            }`}
            title={isTheaterMode ? "Exit Theater Mode" : "Enter Theater Mode"}
          >
            <Cpu className={`h-3.5 w-3.5 ${isTheaterMode ? 'animate-pulse' : ''}`} />
            <span>{isTheaterMode ? "Normal Mode" : "Theater"}</span>
          </button>

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="rounded-md bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3 py-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold border border-zinc-300 dark:border-zinc-950 shadow-sm cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize className="h-3.5 w-3.5" />
            <span>Fullscreen</span>
          </button>
        </div>

      </div>

      {/* Dedicated Servers Selection Panel */}
      <div className="glass-panel p-4 rounded-xl shadow-md">
        {allChannels.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-400">
                Available Stream Channels ({allChannels.length})
              </span>
              <span className="text-[9px] text-zinc-500 dark:text-zinc-500 font-semibold leading-none normal-case">
                Quality Range: <span className="text-zinc-700 dark:text-zinc-400 font-bold">SD (480p/576p Standard Definition)</span> &middot; <span className="text-green-600 dark:text-green-400 font-bold">HD (720p/1080p High Definition)</span>
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {allChannels.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveChannel(idx); }}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeChannel === idx
                      ? 'border-violet-500/40 bg-violet-600/10 text-violet-600 dark:text-violet-400 shadow-sm dark:shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                      : 'border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-300'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${activeChannel === idx ? 'bg-violet-500 dark:bg-violet-400' : 'bg-zinc-400 dark:bg-zinc-700'}`} />
                  <span>Server {idx + 1}</span>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-900 ${ch.quality === 'HD' || ch.quality === 'FHD' || ch.quality === '1080p' ? 'text-green-600 border-green-200 dark:text-green-400 dark:border-green-950' : 'text-zinc-500 dark:text-zinc-500'}`}>
                    {ch.quality === 'FHD' || ch.quality === '1080p' ? 'HD' : (ch.quality || 'SD')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <span className="text-xs text-zinc-500 font-semibold">Resolving fallback stream feeds...</span>
        )}
      </div>

    </div>
  );
}
