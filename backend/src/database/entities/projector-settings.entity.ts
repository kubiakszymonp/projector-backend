import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { BaseEntity } from './base-entity';
import { TextStrategy } from '../structures/text-strategy.enum';

@Entity()
export class ProjectorSettings extends BaseEntity {
  @Column()
  backgroundColor: string;

  @Column()
  fontColor: string;

  @Column()
  fontFamily: string;

  @Column()
  fontSize: string;

  @Column()
  textAlign: string;

  @Column()
  letterSpacing: string;

  @Column()
  marginInline: string;

  @Column()
  marginBlock: string;

  @Column()
  paddingTop: string;

  @Column()
  charactersInLine: number;

  @Column()
  linesOnPage: number;

  @Column()
  textVertically: string;

  @Column()
  screenWidth: number;

  @Column()
  screenHeight: number;

  @Column()
  lineHeight: string;

  @Column()
  textStrategy: TextStrategy;

  @OneToOne(() => Organization)
  @JoinColumn()
  organization: Organization;
}

export const defaultProjectorSettings: ProjectorSettings =
  new ProjectorSettings();

defaultProjectorSettings.backgroundColor = 'black';
defaultProjectorSettings.fontColor = 'white';
defaultProjectorSettings.fontFamily = 'Arial';
defaultProjectorSettings.fontSize = '24px';
defaultProjectorSettings.textAlign = 'center';
defaultProjectorSettings.letterSpacing = '0px';
defaultProjectorSettings.marginInline = '0px';
defaultProjectorSettings.marginBlock = '0px';
defaultProjectorSettings.paddingTop = '0px';
defaultProjectorSettings.textVertically = 'center';
defaultProjectorSettings.charactersInLine = 40;
defaultProjectorSettings.linesOnPage = 20;
defaultProjectorSettings.screenWidth = 1920;
defaultProjectorSettings.screenHeight = 1080;
defaultProjectorSettings.lineHeight = '1';
defaultProjectorSettings.textStrategy = TextStrategy.FIXED_LINES;
