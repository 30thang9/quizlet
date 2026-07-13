/**
 * StudySet Mapper - Infrastructure Layer
 * Maps between Domain StudySet and TypeORM StudySetEntity
 */
import { StudySet, StudySetProps, Visibility } from '../../../domain/entities/study-set';
import { StudySetEntity, Visibility as VisibilityEnum } from '../entities/study-set.entity';

export class StudySetMapper {
  static toDomain(entity: StudySetEntity): StudySet {
    const props: StudySetProps = {
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      visibility: entity.visibility as Visibility,
      passwordHash: entity.passwordHash,
      language: entity.language,
      subject: entity.subject,
      cardCount: entity.cardCount,
      viewCount: entity.viewCount,
      likeCount: entity.likeCount,
      copyCount: entity.copyCount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };

    return StudySet.fromExisting(entity.id, props);
  }

  static toEntity(domain: StudySet): StudySetEntity {
    const entity = new StudySetEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.visibility = domain.visibility as VisibilityEnum;
    entity.passwordHash = domain.propsCopy.passwordHash;
    entity.language = domain.language;
    entity.subject = domain.subject;
    entity.cardCount = domain.cardCount;
    entity.viewCount = domain.viewCount;
    entity.likeCount = domain.likeCount;
    entity.copyCount = domain.copyCount;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.propsCopy.deletedAt;
    return entity;
  }
}
