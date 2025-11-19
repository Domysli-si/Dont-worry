# Dont-worry
## Uvod 
- Jedna se PWA  aplikaci, pro pomoc se psychologii a osobnimi zaznamy.
- Hlavni funkci je textovy editor s extra funkcemi. To rozepisu pozdeji.
- Projekt reaguje na rostoucí potřebu **digitálních řešení pro psychickou pohodu a sebeuvědomění**.  
- Spojením mood trackeru, gamifikovaného self-help systému a datové analýzy vznikne **komplexní platforma**, která uživateli pomůže nejen sledovat, ale i **pochopit** a **zlepšovat** svůj psychický stav.
## Hlavni funkce 
### Textovy editor
- Jedna se o hlavni cast projektu odsud se budou brat vsechna data. Muzeme i vytovirt variantu zalozenou jen na dotazniku a uzivatel si jen vybere co pro dany zaznam uprednostnuje. 
- Jeho funkce bude takove to klasicke (headery, body text, kursiva, ztucneni...).
- Jeho cilem je skrz nej nebo dotaznik ziskavat informace o:
	- nálada, spánek, stres, sociální interakce a další aktivity.
### Prace s daty
- Data se ukládají do lokální databáze (s možností synchronizace do cloudu).
- Dashboard vizualizuje dlouhodobé trendy pomocí grafů, heatmap a statistik.
- Díky PWA aplikace funguje **i offline**, a po připojení se data automaticky synchronizují.
###  Analýza dat a predikce (Data & ML)
- Python backend analyzuje historická data a hledá korelace mezi aktivitami a náladou.
- Prediktivní model (např. pomocí knihovny scikit-learn) odhaduje budoucí emoční stav a doporučuje vhodné aktivity.
- Výsledky jsou prezentovány ve vizuální podobě – grafy, trendy, predikční dashboard.

## Budouci funkce 
### Gamifikace 
- Odměny za pravidelné zapisování a plnění zdravých návyků (odznaky, úrovně, lišty pokroku).
- Interaktivní přehledy, připomínky a doporučení pro zlepšení rutiny.
- Gamifikace podporuje **dlouhodobé používání a budování pozitivních návyků**.
- PWA umožní posílat **notifikace** i mimo prohlížeč (např. připomínky k zápisu nálady).

## Technologické řešení

| Vrstva                 | Technologie                                          | Popis                                           |
| ---------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| **Frontend (PWA)**     | React + Vite (nebo Next.js) + `vite-plugin-pwa`      | Interaktivní UI, offline režim, push notifikace |
| **Backend (API)**      | FastAPI (Python)                                     | Komunikace, analýza dat, predikce nálady        |
| **Databáze**           | SQLite (lokální) + PostgreSQL (online synchronizace) | Ukládání záznamů a profilů uživatelů            |
| **ML / Data Analysis** | pandas, scikit-learn                                 | Analýza vzorců chování a predikce nálady        |
| **Hosting**            | Vercel (frontend) + Render/Railway (backend)         | Automatické nasazení s HTTPS                    |
| **Bezpečnost**         | JWT autentizace, šifrování dat                       | Ochrana citlivých údajů                         |
## UI
- Cilem je moderni design odpovidajicim trendum moderni doby. PLynule prechody, animace. S barevnou stylizaci budeme nejprve pracovat s motivy ohniveho krbu, podzimu a klidu. Nasledne se v budoucnu bude barva prizpusobovat uzivateli. 
