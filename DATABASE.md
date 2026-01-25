## Что есть в системе (сущности):

Note - заметки
User — владелец результатов, автор, голосующий
Mresult — сам результат (может быть приватным или публичным)
Tag — метки (многие-ко-многим с Mresult)
Vote — голос пользователя за публичный результат (уникально: один пользователь → один голос на результат)
(опционально) Collection / Folder — папки/коллекции для организации
(опционально) MresultVersion — версии результата (история изменений)

## Ключевые правила:

* Публичность — это свойство Mresult (visibility)
* Голосовать можно только по публичным (проверяется на уровне приложения; можно усилить триггером/констрейнтом позже)
* Голос уникален: (userId, mresultId) — уникальный индекс

## Схема базы данных

* Note: id, ownerId -> User, title, createdAt
* User: id (cuid), email unique, name optional, createdAt
* Mresult: id, ownerId -> User, title, content, description optional, categoryId -> Category,
  visibility (PRIVATE|PUBLIC, default PRIVATE), createdAt, updatedAt, publishedAt nullable
* Vote: id, userId -> User, mresultId -> Mresult, value int default 1, createdAt
* Category: id, category
* Ограничение: один пользователь может проголосовать за mresult только один раз:
  UNIQUE(userId, mresultId)
* Индексы:
  Mresult(ownerId, updatedAt)
  Mresult(visibility, createdAt)
  Vote(mresultId)
  Vote(userId)
* onDelete: Cascade для связей
