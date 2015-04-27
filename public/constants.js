// состояния хода
var ACTIVE_PLAYER = 1;
var PASSIVE_PLAYER = 0;

//состояния игры
var ACTION_NONE = 0;
var ACTION_GET_PLACE = 1;
var ACTION_LETTERS = 2;
var ACTION_USE_SPELL = 3;
var ACTION_ADDITIONAL_TURN = 4;
var ACTION_WAITING = 5;
var ACTION_FREEZ_LETTER = 6;
var ACTION_FREEZ_EMPTY = 7;

//возможность отправки
var SEND_READY = 1;
var SEND_NOT_READY = 0;

//состояния гексов
var PASSIVE_EMPTY = 0;
var ACTIVE_EMPTY = 1;


var ACTIVE_LETTER = 4;
var PASSIVE_LETTER = 5;
var NEW_LETTER_ACTIVE = 6;
var NEW_LETTER_PASSIVE = 7;
var PICKED_LETTER = 8;

var FROZEN_EMPTY = 9;
var SWAPED = 10;
var CHANGED = 11;
var FROZEN_LETTER = 12;
var BOOSTED = 13;

//текст статусов
var TXT_GET_FIELD = "Ваш ход. Выберите поле для новой буквы.";
var TXT_ERROR_WORD = "Такого слова нет, придумайте другое!";
var TXT_TURN_END = "Для передачи хода повторно нажмите отправку.";
var TXT_NO_MANA = "Не хватает маны! У вас:";
var TXT_SUCCESS = "Слово засчитано. У вас ";
var TXT_SPELL_TIME = " манны. Выберите на клавиатуре стоимость способности. 5 или 6 xD";
var TXT_OPPONENT_TURN = "Ход соперника. Ожидайте ...";

var TXT_FREEZ_LETTER = "Выбран спелл Заморозка буквы. Выберите букву!";
var TXT_FREEZ_EMPTY = "Выбран спелл Заморозка поля. Выберите локацию!";

//перевод времени
var TIME_TO_MINUTS = 60;
var SECOND = 1000;








