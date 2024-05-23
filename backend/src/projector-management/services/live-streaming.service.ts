import { Injectable } from '@nestjs/common';
import { execSync } from 'child_process';
import { appendFile, mkdir, readdir, rm, stat, writeFile } from 'fs/promises';
import { DisplayTypeEnum } from 'src/projector-management/enums/display-type.enum';
import { Repository } from 'typeorm';
import { DisplayState } from '../entities/display-state.entity';
import { ENVIRONMENT } from 'src/environment';
import { DELETE_CHUNK_AFTER_MILLIS, HLS_DIRECTORY, PLAYLIST_NAME, m3u8PREFIX } from 'src/common/consts';

@Injectable()
export class LiveStreamingService {
  ;

  constructor(
    private displayStateRepository: Repository<DisplayState>
  ) {
    setInterval(() => {
      this.clearOldChunks();
    }, 60_000);
  }

  async stopStream(organizationId: number) {
    const displayState = await this.displayStateRepository.findOne({
      where: { organizationId },
    });

    const newDisplayState = this.displayStateRepository.create({
      ...displayState,
      emptyDisplay: true,
    });

    await this.displayStateRepository.save(newDisplayState);
  }

  async startStream(organizationId: number) {
    const displayState = await this.displayStateRepository.findOne({
      where: { organizationId },
    });

    const newDisplayState = this.displayStateRepository.create({
      ...displayState,
      displayType: DisplayTypeEnum.WEB_RTC,
      emptyDisplay: false
    });

    await this.displayStateRepository.save(newDisplayState);

    // check if directory exists
    try {
      const exists = await stat(this.getChunkDirectory(organizationId));
      if (!exists.isDirectory()) {
        await mkdir(this.getChunkDirectory(organizationId), {
          recursive: true,
        });
      }
    } catch (e) {
      await mkdir(this.getChunkDirectory(organizationId), {
        recursive: true,
      });
    }

    await writeFile(this.getPlaylistPath(organizationId), m3u8PREFIX);
  }

  getVideoDuration(inputPath) {
    try {
      const command = `${ENVIRONMENT.FFPROBE_PATH} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`;
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

  async uploadStreamChunk(fileBuffer: Buffer, organizationId: number) {
    const playlistPath = this.getPlaylistPath(organizationId);
    const chunkDirectory = this.getChunkDirectory(organizationId);
    const fileName = `${new Date().getTime().toString()}`;

    try {
      await appendFile(chunkDirectory + `/${fileName}.webm`, fileBuffer);

      const inputPath = chunkDirectory + `/${fileName}.webm`;
      const outputPath = chunkDirectory + `/${fileName}.ts`;

      execSync(
        `${ENVIRONMENT.FFMPEG_PATH} -i ${inputPath} -c:v libx264 -preset ultrafast -tune zerolatency -c:a aac -b:a 192k -f mpegts ${outputPath}`,
      );

      const duration = this.getVideoDuration(outputPath);

      appendFile(
        playlistPath,
        `#EXTINF:${duration},
      chunks/${fileName}.ts\n`,
      );

      rm(inputPath);
    } catch (e) {
      console.error(e);
    }
  }
}
