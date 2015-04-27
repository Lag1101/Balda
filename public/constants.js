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
var ACTION_SWAPPING = 8;
var ACTION_CHANGED = 9;

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
var TXT_ANOTHER_WORD = "Это слово уже было, придумайте другое!";
var TXT_TURN_END = "Для передачи хода повторно нажмите отправку.";
var TXT_NO_MANA = "Не хватает маны! У вас:";
var TXT_SUCCESS = "Слово засчитано. У вас ";
var TXT_SPELL_TIME = " манны. Выберите на клавиатуре стоимость способности (или нажмите любую клавишу для отмены)";
var TXT_OPPONENT_TURN = "Ход соперника. Ожидайте ...";
var TXT_SWAP = "Выберите 2 поля, которые вы хотите обменять местами!";
var TXT_CHANGE_LETTER = "Выберите букву, которую желаете изменить!";

var TXT_FREEZ_LETTER = "Выбран спелл Заморозка буквы. Выберите букву!";
var TXT_FREEZ_EMPTY = "Выбран спелл Заморозка поля. Выберите локацию!";

//перевод времени
var TIME_TO_MINUTS = 60;
var SECOND = 1000;








