CREATE TABLE events_tbl (
    id INT NOT NULL AUTO_INCREMENT, 
    title VARCHAR(150) NOT NULL, 
    img_url VARCHAR(150), 
    location VARCHAR(150), 
    event_date DATE, 
    PRIMARY KEY ( id )
);

CREATE TABLE people_tbl (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL, 
    img_url VARCHAR(150), 
    nickname VARCHAR(150), 
    email VARCHAR(150), 
    PRIMARY KEY ( id )
);

CREATE TABLE events_people (
    event_id INT NOT NULL, 
    person_id INT NOT NULL, 
    PRIMARY KEY ( event_id, person_id ), 
    FOREIGN KEY (event_id) REFERENCES events_tbl(id) ON UPDATE CASCADE, 
    FOREIGN KEY (person_id) REFERENCES people_tbl(id) ON UPDATE CASCADE
);

CREATE TABLE team_tbl (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY ( id ),
    FOREIGN KEY (id) REFERENCES people_tbl(id) ON UPDATE CASCADE
);