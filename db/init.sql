CREATE TABLE therapist (
    uuid TEXT NOT NULL,
    name TEXT NOT NULL,
    PRIMARY KEY(uuid)
);

CREATE TABLE therapist_specialism (
    uuid TEXT NOT NULL,
    therapist_uuid TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('addiction', 'ADHD', 'CBT', 'divorce', 'sexuality')),
    PRIMARY KEY(uuid),
    CONSTRAINT fk_therapist
      FOREIGN KEY(therapist_uuid) 
        REFERENCES therapist(uuid)
);
 
CREATE TABLE appointment (
    uuid TEXT NOT NULL,
    therapist_uuid TEXT NOT NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('oneoff', 'consultation')),
    PRIMARY KEY(uuid),
    CONSTRAINT fk_therapist
      FOREIGN KEY(therapist_uuid) 
        REFERENCES therapist(uuid)
);

COPY therapist FROM '/var/lib/postgresql/csvs/therapist.csv' DELIMITER ',' CSV;
COPY therapist_specialism FROM '/var/lib/postgresql/csvs/therapist_specialism.csv' DELIMITER ',' CSV;
COPY appointment FROM '/var/lib/postgresql/csvs/appointment.csv' DELIMITER ',' CSV;


