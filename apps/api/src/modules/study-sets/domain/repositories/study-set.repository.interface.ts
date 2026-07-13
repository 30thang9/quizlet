/**
 * StudySet Repository Interface - Domain Layer
 * Infrastructure layer will implement this interface
 */
import { StudySet } from '../entities/study-set';

export interface IStudySetRepository {
  findById(id: string): Promise<StudySet | null>;
  findByUserId(userId: string, page?: number, limit?: number): Promise<StudySet[]>;
  findPublic(page?: number, limit?: number): Promise<StudySet[]>;
  search(query: string, page?: number, limit?: number): Promise<StudySet[]>;
  save(studySet: StudySet): Promise<void>;
  update(studySet: StudySet): Promise<void>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  count(): Promise<number>;
}
