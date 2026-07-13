import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity('study_set_tags')
@Unique(['studySetId', 'tagId'])
@Index(['studySetId'])
@Index(['tagId'])
export class StudySetTag {
  @PrimaryColumn({ name: 'study_set_id' })
  studySetId: string;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: string;
}
