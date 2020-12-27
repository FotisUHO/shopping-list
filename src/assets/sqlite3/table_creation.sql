--drop table item_group;
--drop table items;
--drop table colour;
--drop table list_type;
--drop table lists;
--drop table list_items;

create table if not exists item_group (
group_id integer primary key autoincrement,
group_name text not_null);

create table if not exists colour (
colour_id integer primary key autoincrement,
red integer not null,
green integer not null,
blue integer not null);

create table if not exists list_type (
type_id integer primary key autoincrement,
colour_id integer not null,
foreign key (colour_id)
references colour (colour_id));

create table if not exists items (
item_id integer primary key,
item_name text,
group_id integer not null,
foreign key (group_id)
references item_group (group_id));

create table if not exists lists (
list_id integer primary key autoincrement,
list_name text not null,
time_created datetime default current_timestamp,
time_due datetime,
type_id integer not null);

create table if not exists list_items(
list_item_id integer primary key autoincrement,
item_id integer not null,
list_id integer not null,
foreign key (item_id)
references item_group (item_id)
foreign key (list_id)
references item_group (item_id)
on delete cascade
on update no action);
