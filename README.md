# AlgoRYTMUS pre jednotlivcov

Toto je fork [Stankovho](https://github.com/Stanko2) [rytmového editora](https://github.com/Stanko2/rhythm-editor), ktorý je upravený na použite pre jednotlivcov.

## Zmeny oproti pôvodnému editoru

- Možnosť ľubovoľne zapínať a vypínať upgrady
- Možnosť používať editor bez prihlásenia
- Možnosť hrať level znova po dokončení
- Zobrazovanie histogramu presnosti po dokončení levelu (treba refreshnúť stránku)
- Plánované sú aj ďalšie funkcie

## Návod na spustenie

Server funguje iba na Linuxe, resp. cez WSL 

1. Nainštalujem potrebné veci na spustenie:
    - [Bun](https://bun.sh)
    - [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)
      - Možno bude potrebné redis manuálne spustiť: `systemctl start redis`
      
2. Nainštalujem potrebné knižnice

```bash
bun install
```

3. Načítam si userov z `users.json`

```bash
bun run index.ts loadUsers
```

4. Vytvorím priečínky na submity

```bash
python3 makeSubmitFolders.py
```

5. Spustím server

```bash
bun run index.ts
```

Ak všetko fungovalo uvidím editor na http://localhost:3000