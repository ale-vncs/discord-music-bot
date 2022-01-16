create table playlist
(
    playlist_id varchar(36)  not null,
    guild_id   varchar(255) not null,
    name        varchar(255) not null,
    created_by  varchar(255) not null,
    constraint pk_playlist primary key (playlist_id)
);

create table playlist_music
(
    music_id    varchar(36)  not null,
    playlist_id varchar(36)  not null,
    url         varchar(255) not null,
    url_type    varchar(20)  not null,
    `order`     int          not null,
    added_by    varchar(255) not null,
    constraint pk_playlist_music primary key (music_id),
    constraint fk_playlist_music_playlist_id foreign key (playlist_id) references playlist (playlist_id) on delete cascade,
    constraint uk_order_playlist_id unique (`order`, playlist_id)
);
