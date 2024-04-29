import { Injectable } from '@nestjs/common';
import { environment } from 'src/environment';
import { execSync } from 'child_process';
import { readdir, rm } from 'fs/promises';
import { HLS_DIRECTORY, DELETE_CHUNK_AFTER_MILLIS, PLAYLIST_NAME } from './consts';

@Injectable()
export class LiveStreamingService {
  private displayStateRepository: Repository<DisplayState>;
  private projectorLastUpdateService: ProjectorLastUpdateService;

  constructor() {
    setInterval(() => {
      this.clearOldChunks();
    }, 60_000);
  }

  getVideoDuration(inputPath) {
    try {
      const command = `${environment.FFPROBE_PATH} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`;
      const duration = execSync(command).toString().trim();
      console.log({ duration });
      return parseFloat(duration);
    } catch (e) {
      console.error('Error extracting video duration:', e);
      return null;
    }
  }

  async clearOldChunks() {
    try {
      const organizationIds = await readdir(HLS_DIRECTORY);
      organizationIds.forEach(async (organizationId) => {
        try {
          const chunkDirectory = this.getChunkDirectory(
            parseInt(organizationId),
          );
          const files = await readdir(chunkDirectory);
          const currentTime = new Date().getTime();
          files.forEach((file) => {
            const fileNameWithoutExtension = file.split('.')[0];
            const fileNumber = parseInt(fileNameWithoutExtension);
            if (currentTime - fileNumber > DELETE_CHUNK_AFTER_MILLIS) {
              rm(`${chunkDirectory}/${file}`);
            }
          });
        } catch (e) { }
      });
    } catch (e) { }
  }


  getPlaylistPath(organizationId: number) {
    return `${HLS_DIRECTORY}/${organizationId}/${PLAYLIST_NAME}`;
  }

  getChunkDirectory(organizationId: number) {
    return `${HLS_DIRECTORY}/${organizationId}/chunks`;
  }
}
