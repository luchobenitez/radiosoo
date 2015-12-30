* Summary of set up
=======

```
git clone https://gitlab.com/luchobenitez/radiosoo.git
cd radiosoo
npm install
npm install bower -g
bower install
sh env
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

* Grunt commands

```
grunt analyze
grunt githooks
grunt test
grunt css
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
