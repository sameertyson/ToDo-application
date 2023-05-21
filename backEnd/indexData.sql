--Sqlite
CREATE TABLE user(
id TEXT NOT NULL PRIMARY KEY,
username TEXT NOT NULL,
password TEXT NOT NULL
);

PRAGMA foriegn_keys=ON;

CREATE TABLE todos(
id TEXT NOT NULL PRIMARY KEY,
title TEXT NOT NULL,
progress TEXT NOT NULL,
description TEXT NOT NULL,
date DATE NOT NULL,
userid TEXT NOT NULL,
FOREIGN KEY(userid) REFERENCES user(id)
);