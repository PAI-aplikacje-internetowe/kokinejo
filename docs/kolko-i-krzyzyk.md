# Kółko i krzyżyk

Dwuosobowa gra

Gracze obejmują pola na przemian dążąc do objęcia trzech pól w jednej linii, przy jednoczesnym uniemożliwieniu tego
samego przeciwnikowi. Pole może być objęte przez jednego gracza i nie zmienia swego właściciela przez cały przebieg gry.

Plansza składa się z dziewięciu pól ułożonych w kwadrat o boku trzech pól. Gracze na przemian wykonują swój ruch
wybierając pole - zostaje ono oznaczone symbolem gracza, kółkiem lub krzyżykiem. Gdy któryś z graczy stworzy linię z
trzech swoich symboli - wygrywa. Jeżeli wszystkie pola są zajęte i nie zostaje utworzona linia z trzech symboli -
następuje remis.

## API

Prefix gry: `kik/`

Wszystkie endpointy GET zgodne z ropziską w głównym README.

### POST `/kik/:id/make_move`

Przykład: wykonanie ruchu przez gracza z symbolem "x" na środkowym polu:

Żądanie (pole `playerId` tymczasowo, dopóki nie będzie autentykacji użytkowników):

```json
{
  "playerId": "id gracza wykonującego ruch",
  "move": {
    "x": 1,
    "y": 1
  }
}
```

Odpowiedź

```json
{
  "status": "ok",
  "game_state": {
    "currentPlayer": "id gracza który ma wykonać ruch",
    "players": ["id gracza 1", "id gracza 2"],
    "board": [
      [0, 1, 2],
      [0, 0, 0],
      [2, 0, 1]
    ]
  }
}
```

| Wartość `board` | symbol |
|-----------------|--------|
|        0        |   -    |
|        1        |  "o"   |
|        2        |  "x"   |

Co odpowiada poniższemu stanowi rozgrywki:

```
    +---+---+---+
    |   | o | x |
    +---+---+---+
 ^  |   |   |   |
 |  +---+---+---+
 |  | x |   | o |
 y  +---+---+---+
     x ---->
```
