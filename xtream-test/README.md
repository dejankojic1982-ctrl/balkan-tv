# Balkan TV Xtream test server

Kontrolisani Xtream API za testiranje TiviMate-a sa kanalima koji su vec potvrdeni da rade.

## Start

```bash
docker compose up -d --build
```

TiviMate:
- Server: `http://SERVER_IP:8090`
- Username: `test_user`
- Password: `test_pass`

Browser provjera:
```
http://SERVER_IP:8090/player_api.php?username=test_user&password=test_pass
```

Ako browser vrati JSON sa `"auth":1`, server radi.
