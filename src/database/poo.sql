-- Active: 1676032686923@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

INSERT INTO
    users (id, name, email, password, role)
VALUES (
        "u001",
        "Nome1",
        "email1@email.com",
        "sdf45d",
        "admin"
    ), (
        "u002",
        "Nome2",
        "email2@email.com",
        "fghdf4",
        "user"
    ), (
        "u003",
        "Nome3",
        "email3@email.com",
        "h445r4h",
        "user"
    ), (
        "u004",
        "Nome4",
        "email4@email.com",
        "54j544rr",
        "user"
    );

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER NOT NULL,
        dislikes INTEGER NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id)
    );

INSERT INTO
    posts (
        id,
        creator_id,
        content,
        likes,
        dislikes
    )
VALUES (
        "p001",
        "u001",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        2,
        0
    ), (
        "p002",
        "u002",
        "Nam ut mauris imperdiet, mollis tellus eu, elementum velit.",
        3,
        1
    ), (
        "p003",
        "u003",
        "Mauris ac eros luctus, ullamcorper orci a, consequat odio.",
        4,
        9
    ), (
        "p004",
        "u004",
        "Nunc ipsum tortor, egestas ut dui sit amet, bibendum tincidunt purus.",
        0,
        0
    ), (
        "p005",
        "u001",
        "Phasellus eget leo nec elit feugiat sodales non eu justo.",
        2,
        0
    );

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        Foreign Key (user_id) REFERENCES users(id),
        Foreign Key (post_id) REFERENCES posts(id)
    );

INSERT INTO
    likes_dislikes (user_id, post_id, like)
VALUES ("u001", "p001", 4), ("u002", "p002", 5), ("u003", "p003", 6), ("u004", "p004", 0), ("u001", "p005", 3);

SELECT *
FROM likes_dislikes
    INNER JOIN posts ON post_id = user_id;

DROP TABLE likes_dislikes;
