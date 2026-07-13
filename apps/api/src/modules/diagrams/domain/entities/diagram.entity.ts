import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('diagrams')
export class Diagram {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image_url', length: 500 })
  imageUrl: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'study_set_id', nullable: true })
  studySetId: string;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  copyCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('diagram_labels')
export class DiagramLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Diagram, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'diagram_id' })
  diagram: Diagram;

  @Column({ name: 'diagram_id' })
  diagramId: string;

  @Column({ name: 'x_position', type: 'decimal', precision: 5, scale: 2 })
  xPosition: number;

  @Column({ name: 'y_position', type: 'decimal', precision: 5, scale: 2 })
  yPosition: number;

  @Column({ length: 255 })
  term: string;

  @Column({ type: 'text' })
  definition: string;

  @Column({ type: 'text', nullable: true })
  hint: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
