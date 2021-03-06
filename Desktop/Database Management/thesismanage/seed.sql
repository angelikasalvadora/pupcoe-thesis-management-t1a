CREATE TYPE user_type AS ENUM ('student', 'faculty', 'guest');

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(80) NOT NULL,
  "password" VARCHAR(80) NOT NULL,
  "first_name" VARCHAR(80),
  "last_name" VARCHAR(80) NOT NULL,
  "student_number" VARCHAR(20),
  "phone" VARCHAR(80),
  "image_url" VARCHAR(200),
  "user_type" user_type default 'student' NOT NULL,
  "is_admin" boolean default 'f' NOT NULL
);

INSERT INTO users(first_name, last_name, email, password, phone, image_url, user_type, is_admin)
  VALUES (
    'Gino',
    'Tria',
    'gino.tr14@gmail.com',
    '1234',
    '',
    'https://pbs.twimg.com/profile_images/479664129171410944/_MIQYioo_400x400.jpeg',
    'faculty',
    't'
  );


CREATE TABLE "classes" (
  "id" SERIAL PRIMARY KEY,
  "batch" VARCHAR(4) NOT NULL,
  "section" VARCHAR(2) NOT NULL,
  "adviser" INT REFERENCES users(id)
);

CREATE TABLE "classStudents" (
  "id" SERIAL PRIMARY KEY,
  "class_id" INT REFERENCES classes(id),
  "student_id" INT REFERENCES users(id)
);
