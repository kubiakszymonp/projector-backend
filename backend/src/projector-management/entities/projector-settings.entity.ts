import { AppBaseEntity } from '../../common/base-entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { TextStrategyEnum } from '../enums/text-strategy.enum';

@Entity()
export class ProjectorSettings extends AppBaseEntity {
  @Column({
    default: 'black',
  })
  backgroundColor: string;

  @Column({
    default: 'white',
  })
  fontColor: string;

  @Column({
    default: 'Arial',
  })
  fontFamily: string;

  @Column({
    default: '60px',
  })
  fontSize: string;

  @Column({
    default: 'center',
  })
  textAlign: string;

  @Column({
    default: '0px',
  })
  letterSpacing: string;

  @Column({
    default: '0px',
  })
  marginInline: string;

  @Column({
    default: '0px',
  })
  marginBlock: string;

  @Column({
    default: '0px',
  })
  paddingTop: string;

  @Column({
    default: 30,
  })
  charactersInLine: number;

  @Column({
    default: 6,
  })
  linesOnPage: number;

  @Column({
    default: 'center',
  })
  textVertically: string;

  @Column({
    default: 1920,
  })
  screenWidth: number;

  @Column({
    default: 1080,
  })
  screenHeight: number;

  @Column({
    default: '1',
  })
  lineHeight: string;

  @Column({
    default: TextStrategyEnum.AUTOMATIC,
  })
  textStrategy: TextStrategyEnum;

  @Column()
  organizationId: number;
}