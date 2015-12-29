* Summary of set up
=======

```
git clone git@gitlab.com:luchobenitez/rs.git
cd rs
npm install
npm install bower -g
bower install
sh env
```

* Configuration

```
vim src/config/config.yml
```

### Configuration

```
vim src/config/config.yml
```

* Dependencies

```
    "dependencies": {
      "body-parser": "latest",
      "chai": "latest",
      "cookie-parser": "latest",
      "crypto": "latest",
      "debug": "latest",
      "express": "latest",
      "express-handlebars": "latest",
      "express-session": "latest",
      "html-minifier": "latest",
      "js-yaml": "latest",
      "lodash": "latest",
      "mongoose": "latest",
      "mocha": "latest",
      "morgan": "latest",
      "passport": "latest",
      "passport-local": "latest",
      "passport-local-mongoose": "latest",
      "serve-favicon": "latest",
      "should": "latest",
      "stylus": "latest",
      "nib": "latest"
    }
```

* Database configuration
=======

This project use an ORM (sequelize), this means that everything is independent from the database. You should create an env variable like:

for Postgres
```
export DATABASE_URL = postgres://user:passwd@host:port/database
```
for MariaDB
```
export DATABASE_URL = mariadb://user:passwd@host:port/database
```
for SQLite  
```
export DATABASE_URL = sqlite://:@:/
```

For development you could use sqlite3.

We have tested with mariadb on Centos 7.x

** Database creation for mariadb
=======

You have to install mariadb

```
mysql
CREATE DATABASE radiosoo;
CREATE USER 'radiosoo'@'localhost' IDENTIFIED BY 'radiosoopass';
USE radiosoo;
GRANT ALL ON radiosoo to 'radiosoo'@'localhost';
FLUSH PRIVILEGES;
export DATABASE_URL = mariadb://radiosoo:radiosoopass@localhost:3306/radiosoo
npm start
```

* How to run tests

This didn't work yet
```
make test
```

* Deployment instructions

```
grunt start
```

or

```
grunt restart
```

you can see the logs with

```
grunt logs
```

to stop services

```
grunt stop
```
