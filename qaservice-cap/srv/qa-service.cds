using { qa as qaSchema } from '../db/schema';

service QAService {
    entity Questions @(restrict : [
        {
            grant: ['READ', 'UPDATE'],
            to: ['QAViewer']
        },
        {
            grant: ['*'],
            to: ['QAManager']
        }
    ]) as projection on qaSchema.Questions;

    entity Groups @(restrict : [
       {
            grant: ['READ'],
            to: ['QAViewer']
       },
       {
            grant: ['*'],
            to: ['QAManager']
       }
    ]) as projection on qaSchema.Groups;

    entity Difficulties @(restrict : [
       {
            grant: ['READ'],
            to: ['QAViewer']
       },
       {
            grant: ['*'],
            to: ['QAManager']
       }
    ]) as projection on qaSchema.Difficulties;

    entity Topics @(restrict : [
       {
            grant: ['READ'],
            to: ['QAViewer']
       },
       {
            grant: ['*'],
            to: ['QAManager']
       }
    ]) as projection on qaSchema.Topics;
}