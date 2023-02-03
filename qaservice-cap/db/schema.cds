namespace qa;
using { managed } from '@sap/cds/common';

entity Questions : managed {
    key ID     : UUID;
    text       : String;
    answer     : String;
    difficulty : Association to Difficulties;
    topic      : Association to Topics;
    group      : Association to Groups;
}

entity Groups : managed {
    key ID    : UUID;
    name      : String;
    topic     : Association to Topics;
    questions : Association to many Questions on questions.group = $self;
}

entity Difficulties : managed {
    key ID    : UUID;
    name      : String;
    numeric   : Integer;
    questions : Association to many Questions on questions.difficulty = $self;
}

entity Topics : managed {
    key ID    : UUID;
    name      : String;
    groups    : Association to many Groups on groups.topic = $self;
    questions : Association to many Questions on questions.topic = $self;
}