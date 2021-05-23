# Kokinejo

Kokinejo to platforma z grami, dzieki której można grać wraz z innymi użytkownikami.

## Identyfikacja zagadnienia biznesowego

W dziesiejszych czasach praktycznie każdy nastolatek spędza czas wolny grając. Dodatkowo pandemia sprawiła, że nie można już sie widywać "na żywo" co sprawia że wszelkiego rodzaju czynności, które można wykonywac online wraz z innymi zyskują na popularności.

Nasza aplikacja ma na celu zapewnić dostęp do gier wieloosobowych, dzięki którym będzie można łatwo i przyjemnie spędzić czas ze znajomymi na odległość. Dodatkowo dostępne gry będą dobrze znanymi grami, w które chętnie zagra osoba także nie poświęcająca tego rodzaju hobby wiele czasu.

![image](https://user-images.githubusercontent.com/50954577/117581655-52aa3400-b0fe-11eb-816f-f48d3f2e3238.png)

(źródło: bankier.pl)

![image](https://user-images.githubusercontent.com/50954577/117581931-e2041700-b0ff-11eb-9da1-9dd7cdec69be.png)

(źródło: [similarweb.com](https://www.similarweb.com/website/kurnik.pl/))

### CELE

1. Stworzenie platformy umożliwiającej spedzanie czasu ze znajomymi lub osobami tam poznanymi.
2. Implementacja kilku podstawowych, znanych gier wieloosobowych.

## Wymagania systemowe i funkcjonalne

Serwer napisany będzie z użyciem Node.js i frameworku Express.
Nasza aplikacja będzie realizowana w sposób modułowy. Główna część serwera będzie odpowiadać za wyświetlenie strony początkowej, załadowanie kodu klienta oraz za autentykację użytkowników, a następnie żądania będą przekazywane do osobnych modułów - konkretnych gier.
Taki podział ułatwi tworzenie aplikacji oraz jej przyszłą rozbudowę.
Pozowoli on też na realizację różnych gier niezależnie od siebie.

Klient zostanie utworzony jako tzw. Single Page Application - z wykorzystaniem HTMLa i CSSa, a reakcję na działania użytkownika zapewniać będzie framework Vue.js.
Taki wybór, wraz z dostępnymi narzędziami, pozwoli podzielić funkcjonalność klienta na konkretne moduły - odpowiadające grom.
Dzięki temu kod będzie ładował się szybciej, a sama aplikacja będzie działać wydajniej, co wpłynie pozytywnie na postrzeganie aplikacji przez końcowych użytkowników.
Ze względu na rodzaj aplikacji - dynamiczne gry - nie planujemy wspierać przeglądarek, które nie obsługują JavaScriptu. Ze względu na ograniczony czas realizacji projektu, aplikacja nie będzie też wspierać przeglądarek innych niż Google Chrome i Firefox oraz ich starszych wersji.
Komunikacja pomiędzy klientami i serwerem będzie odbywać się w stylu REST, co jest wystarczające w przypadku prostych gier planszowych.

Stan konkretnych gier oraz informacje o użytkownikach przechowywane będą w bazie SQLite.
Serwer będzie obciążony głównie weryfikacją reguł gry, baza ta nie będzie stanowiła więc ograniczenia dla jednowątkowego serwera Node.js.
Pozwoli to także łatwo przełączyć serwer na osobną bazę SQL, w przypadku konieczności przyszłego skalowania poziomego aplikacji.

--------------------

## Harmonogram prac i zespół projektowy

1. Stworzenie dokumentacji projektu na potrzeby implementacji

    Zadanie | Czas realizacji
    --------|----------------
    spisanie i opisanie pełnej funkcjonalności projektu        | 10h
    stworzenie przypadków użycia                               | 10h

    _Data_: 30.05.21

    _Efekt końcowy_: Będzie stworzona pełna dokumentacja projektu, okreslająca dokładnie funkcjonalność jaką należy zaimplementować i w jaki sposób ma działać.

2. Stworzenie backendu aplikacji

    Zadanie | Czas realizacji
    --------|----------------
    szkielet backendu (utworzenie projektu, połączenie z bazą) | 10h
    autentykacja użytkowników                                  | 4h
    stworzenie testowego modułu (kółko i krzyżyk)              | 5h

    _Data_: 07.06.21

    _Efekt końcowy_: Będzie utworzony szkielet aplikacji backendowej, do którego będą w przyszłości dołączane kolejne moduły z grami.

3. Stworzenie frontendu aplikacji zawierającego podstawową funkcjonalność (bez gier)

    Zadanie | Czas realizacji
    --------|----------------
    szkielet frontendu (utworzenie projektu, połączenie z backendem) | 10h
    utworzenie ekranów logowania/rejestracji                         | 5h
    stworzenie testowego modułu (kółko i krzyżyk)                    | 5h

    _Data_: 07.06.21

    _Efekt końcowy_: Będzie utworzony szkielet aplikacji frontendowej, ekran rejestracji/logowania. Szkielet będzie rozszerzany o kolejne moduły z grami.

4. Dodanie gier do istniejącej części aplikacji

    Zadanie | Czas realizacji
    --------|----------------
    gra „Człowieku nie irytuj się” | 30h
    gra „statki” | 30h
    gra „pasjans” | 25h
    ... | ...h

    _Data_: 29.06.21

    _Efekt końcowy_: Można grać w gry

## Analiza zagadnienia i jego modelowanie

DO 24.05

[ max. 2str. A4 ] Należy określić modele aplikacji wynikające przeprowadzonej analizy funkcjonalnej i biznesowejnp.:  -metody obiektowe: diagramy klas, diagramy interakcji obiektów, -definicje:  klas,  pól  danych  złożonych  i  elementarnych oraz  metod-metody strukturalne:  diagramy  związków  encji  (dla  baz  danych),  diagram,  przepływów danych, diagramy przejść,  -definicje:  encji,  atrybutów, procesów,przepływów  danych,  danych  złożonych  i elementarnych.

## Implementacja i testowanie

Do dnia 07.06 (najpóźniej) przygotowanie  wstępnych  elementów implementacjii umieszczenie ich w repozytorium GitHub.

## Podsumowanie

Do dnia 30.06 zakończenie prac nad aplikacją i prezentacja.
