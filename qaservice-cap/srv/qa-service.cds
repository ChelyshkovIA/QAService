using { qa as qaSchema } from '../db/schema';

service QAService {
    entity Questions as projection on qaSchema.Questions;
    entity Groups as projection on qaSchema.Groups;
    entity Difficulties as projection on qaSchema.Difficulties;
    entity Topics as projection on qaSchema.Topics;
}