-- Загрузка в YouTube: у видео появляется description (title уже есть), у
-- джоба — приватность публикации. Дефолт private не случаен: до прохождения
-- аудита API-проекта YouTube принудительно ограничивает залитое через API,
-- и private-заливка — единственный честный режим.
alter table video add column description text;

alter table video_job add column privacy text not null default 'private'
  check (privacy in ('private', 'unlisted', 'public'));
