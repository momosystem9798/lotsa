# Lotsa – instruktioner för Claude

Den här filen läses automatiskt av Claude Code i början av varje session. Flera personer arbetar i repot, var och en med sin egen Claude. Det finns ingen annan kanal mellan oss än filerna i repot. **Därför är `ANDRINGSLOGG.md` och `README.md` det gemensamma minnet.**

## Gör alltid så här

**När du börjar en session:**
1. Läs `ANDRINGSLOGG.md`, åtminstone de senaste posterna och avsnittet "Öppna frågor och meddelanden".
2. Hämta senaste läget (`git fetch` och `git log --oneline -15 origin/main` plus aktuell gren) så att du ser ändringar som andra har gjort.
3. Finns det ett meddelande riktat till dig eller till "nästa Claude": ta hänsyn till det och svara i loggen när du har agerat.

**Varje gång du ändrar något i repot (innan du committar):**
1. Lägg till en ny post **överst** i `ANDRINGSLOGG.md` enligt mallen i filen. Ta med datum, gren, vad som ändrats, varför, hur det testats och vad som återstår.
2. Uppdatera `README.md` om ändringen påverkar hur man bygger, kör, testar eller använder appen, eller hur koden är uppdelad.
3. Uppdatera den här filen om arbetssätt eller konventioner ändras.
4. Flytta frågor som är lösta från "Öppna frågor och meddelanden" till posten där de löstes.
5. Committa loggen i samma commit som ändringen, så att den aldrig hamnar efter koden.

Skriv för en läsare som inte var med: en kollega eller en annan Claude utan tillgång till din konversation. Använd konkreta filnamn, inga "som vi pratade om".

## Projektet i korthet

- AI-stöd för vårdpersonal som har frågor om medicinteknisk utrustning. Svaren bygger enbart på tillverkarens bruksanvisning och varje citat kontrolleras mot manualtexten.
- Ren HTML, CSS och JavaScript utan ramverk. Källorna ligger i `src/`, och `node build.mjs` bygger en enda fil, `dist/index.html`.
- Appen körs på två sätt: som Claude-artefakt (`window.claude`) eller fristående (GitHub Pages och lokal fil) via `src/js/00-standalone.js`. Se README.
- All exempeldata i `src/demo.js` är påhittad.

## Konventioner

- All text i gränssnittet, kommentarer och dokumentation skrivs på svenska.
- Kör `node build.mjs` efter ändringar i `src/` och committa `dist/index.html`. Den används när man öppnar filen direkt.
- Kör testerna (`cd test && npm install && node run.mjs`) före commit. Ett enskilt test körs med `node run.mjs <namn>`. Lägg till eller uppdatera tester för ny funktionalitet.
- Ändringar som berör AI-anrop görs i `src/js/04-ai.js` (prompterna) och `src/js/00-standalone.js` (anropet till Anthropic API). Samma kod måste fungera både i artefakten och fristående.
- Skriv aldrig patientuppgifter, riktiga API-nycklar eller andra hemligheter i repot eller i loggen.
- Skriv inte modellidentifierare i commit-meddelanden.
