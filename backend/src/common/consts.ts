export const CHUNK_DURATION = 0.6;
export const m3u8PREFIX = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:${CHUNK_DURATION}
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD\n`;
export const HLS_DIRECTORY = '../upload/hls';
export const PLAYLIST_NAME = 'playlist.m3u8';
export const DELETE_CHUNK_AFTER_MILLIS = 1000 * 60;

export const AUTHENTICATION_DATA_REQUEST_KEY = 'authenticationData';