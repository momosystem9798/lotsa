/* Lotsa – inbyggd exempeldata.
   Allt här är fiktivt: tillverkare, produkter, telefonnummer och siffror.
   Exempeldatan visas direkt från sidan och skrivs aldrig till databasen;
   databasen innehåller bara det som läggs till eller ändras i appen. */
(function () {
  const P = (n, text) => ({ n, text: text.replace(/^\n+|\s+$/g, '') });

  /* ---------- 1. Infusionspump (svenska) ---------- */
  const flowPages = [
    P(1, `
Demovia Flow 300
Volymetrisk infusionspump
Bruksanvisning, Rev D

EXEMPELMANUAL. Produkten och tillverkaren är påhittade och texten är skriven för demonstration.

Innehåll
1 Avsedd användning och säkerhet, sida 2
2 Översikt, sida 3
3 Uppstart, sida 4
4 Under infusion, sida 5
5 Larm och felsökning, sida 6
6 Rengöring och desinfektion, sida 9
7 Underhåll och tekniska data, sida 10`),
    P(2, `
1 Avsedd användning och säkerhet

Demovia Flow 300 är avsedd för kontrollerad tillförsel av infusionsvätskor till vuxna och barn via infusionsaggregat av typen Demovia DF. Pumpen får endast användas av utbildad vårdpersonal.

VARNING: Kontrollera alltid inställd hastighet och volym mot ordinationen före start.
VARNING: Använd endast infusionsaggregat typ DF. Andra aggregat kan ge felaktig tillförsel.
VARNING: Pumpen ersätter inte tillsyn av patienten. Kontrollera infarten regelbundet enligt lokal rutin.
OBS: Pumpen får inte användas i MR-miljö eller i närheten av brandfarliga anestesigaser.`),
    P(3, `
2 Översikt

Knappar
PÅ/AV: startar och stänger av pumpen.
START/STOPP: startar eller pausar infusionen.
TYSTA LARM: tystar ljudsignalen i 2 minuter. Larmtexten står kvar på displayen.
PILKNAPPAR och OK: ändrar och bekräftar värden.
PRIMA: fyller aggregatet med vätska.

Statuslampa
Grön blinkande: infusion pågår.
Gul: larm med låg eller medelhög prioritet.
Röd: larm med hög prioritet. Infusionen har stoppats.

Luckan på pumpens framsida skyddar slangspåret, luftdetektorn och trycksensorerna.`),
    P(4, `
3 Uppstart

3.1 Före användning
Kontrollera att pumpen är rengjord, att nätkabeln är hel och att etiketten för säkerhetskontroll inte har passerat datum.

3.2 Starta pumpen
1. Anslut nätkabeln och kontrollera att nätlampan lyser.
2. Tryck på PÅ/AV i en sekund. Pumpen gör ett självtest i cirka 10 sekunder: alla lampor tänds och en ljudsignal hörs.
3. Kontrollera att displayen visar SJÄLVTEST OK.
4. Öppna luckan, lägg slangen i slangspåret uppifrån och ned och stäng luckan tills det klickar.
5. Fyll aggregatet: välj PRIMA och håll OK intryckt tills slangen är fri från luft. Aggregatet får inte vara anslutet till patienten under primning.
6. Ange hastighet (ml/h) och volym (ml) enligt ordination och bekräfta med OK.
7. Öppna rullklämman och tryck på START. Den gröna lampan blinkar under infusionen.`),
    P(5, `
4 Under infusion

4.1 Ändra hastighet
Tryck på en pilknapp, ange ny hastighet och bekräfta med OK inom 10 sekunder. Infusionen behöver inte stoppas.

4.2 Pausa
Tryck på START/STOPP. Efter 2 minuter i paus påminner pumpen med en ljudsignal.

4.3 Knapplås
Håll OK intryckt i 3 sekunder för att låsa knapparna. Lås upp på samma sätt. TYSTA LARM fungerar även när knapparna är låsta.

4.4 Batteridrift
Fulladdat batteri räcker cirka 6 timmar vid 125 ml/h. Full laddning tar 4 timmar. Låt pumpen stå ansluten till elnätet när den inte används.`),
    P(6, `
5 Larm och felsökning

Larm visas med larmkod och larmtext på displayen.

Hög prioritet: röd lampa och upprepad ljudsignal. Infusionen stoppas.
Medelhög prioritet: gul blinkande lampa. Infusionen fortsätter.
Låg prioritet: gul fast lampa.

Gör så här vid larm
1. Läs larmkod och larmtext.
2. Tryck på TYSTA LARM om ljudet behöver tystas. Ljudet återkommer efter 2 minuter om orsaken finns kvar.
3. Åtgärda orsaken enligt tabellen på sidorna 7 och 8.
4. Tryck på START för att fortsätta infusionen.`),
    P(7, `
5.1 Larmkoder

E-07 LUFT I SLANG (hög prioritet)
Orsak: Luftbubblor passerar luftdetektorn eller aggregatet är ofullständigt fyllt.
Åtgärd: 1. Stäng rullklämman. 2. Koppla bort aggregatet från patienten enligt lokal rutin och fyll om det via PRIMA. 3. Lägg tillbaka slangen, stäng luckan och tryck på START.

E-12 LUCKA ÖPPEN (hög prioritet)
Orsak: Luckan är inte helt stängd eller slangen ligger fel i spåret.
Åtgärd: Lägg slangen rakt i slangspåret och stäng luckan tills det klickar.

E-23 OCKLUSION NEDSTRÖMS (hög prioritet)
Orsak: Stängd rullklämma, vikt slang, stängd trevägskran eller tilltäppt infart mellan pumpen och patienten.
Åtgärd: 1. Tryck på TYSTA LARM. 2. Följ slangen från pumpen till patienten och kontrollera klämmor, kranar och veck. 3. Åtgärda hindret. Pumpen avlastar trycket automatiskt. 4. Tryck på START. Om larmet återkommer utan synligt hinder: avbryt infusionen och kontrollera infarten enligt lokal rutin.`),
    P(8, `
5.1 Larmkoder, fortsättning

E-24 OCKLUSION UPPSTRÖMS (hög prioritet)
Orsak: Tom behållare, oluftad glasflaska eller stängd klämma ovanför pumpen.
Åtgärd: Kontrollera behållaren, luftningen och klämman ovanför pumpen. Tryck på START.

E-31 BATTERI SVAGT (medelhög prioritet)
Orsak: Mindre än 30 minuters drifttid återstår.
Åtgärd: Anslut nätkabeln. Infusionen fortsätter.

E-32 BATTERI SLUT (hög prioritet)
Orsak: Batteriet är urladdat och pumpen har stoppat.
Åtgärd: Anslut nätkabeln omedelbart och tryck på START.

E-40 INFUSION KLAR (låg prioritet)
Orsak: Inställd volym är given. Pumpen fortsätter med håll-öppet-hastighet.
Åtgärd: Byt behållare eller avsluta infusionen enligt ordination.

E-90 till E-99 TEKNISKT FEL (hög prioritet)
Orsak: Pumpen har upptäckt ett internt fel vid självtest eller under drift.
Åtgärd: Anteckna koden, ta pumpen ur drift, märk den och kontakta medicinteknik. Starta inte om pumpen på patient.`),
    P(9, `
6 Rengöring och desinfektion

Rengör pumpen mellan varje patient och vid synlig förorening.

1. Stäng av pumpen och dra ur nätkabeln.
2. Torka alla ytor med en mjuk duk fuktad med milt rengöringsmedel.
3. Desinfektera med alkoholbaserat ytdesinfektionsmedel, högst 70 % etanol eller isopropanol.
4. Torka luckans insida och slangspåret med en fuktad bomullspinne.
5. Låt pumpen torka i minst 10 minuter med luckan öppen innan den används igen.

Använd inte klorbaserade medel på displayen, aceton eller slipande medel. Spreja aldrig direkt på pumpen. Pumpen får inte autoklaveras eller sänkas ned i vätska.`),
    P(10, `
7 Underhåll och tekniska data

Säkerhetskontroll ska utföras var 24:e månad av behörig tekniker. Batteriet byts vart tredje år.

Tekniska data
Hastighet: 0,1 till 1 200 ml/h
Noggrannhet: ± 5 %
Ocklusionstryck: tre nivåer, ställs in i servicemenyn
Vikt: 2,1 kg
Kapslingsklass: IP33

Tillverkare: Demovia Medical AB (påhittat företag)
Support: support@demovia.example`)
  ];

  /* ---------- 2. Patientmonitor (engelska) ---------- */
  const vistaPages = [
    P(1, `
Exempla Vista M5
Patient Monitor
Instructions for Use, Rev 3.2

SAMPLE MANUAL. The product and the manufacturer are fictional and the text is written for demonstration.

Contents
1 Intended use and safety, page 2
2 Overview, page 3
3 Getting started, page 4
4 Monitoring, page 5
5 Alarms, page 6
6 Cleaning and disinfection, page 9
7 Maintenance and technical data, page 10`),
    P(2, `
1 Intended use and safety

The Exempla Vista M5 is intended for monitoring ECG, SpO2, non-invasive blood pressure (NIBP) and temperature in adult and pediatric patients. It is to be used by trained healthcare staff only.

WARNING: The monitor does not replace clinical observation of the patient.
WARNING: Verify the alarm limits for every patient according to your hospital protocol.
WARNING: Do not use the monitor in an MR environment.
CAUTION: Use only Exempla accessories. Other sensors may give incorrect readings.`),
    P(3, `
2 Overview

Front panel
Power key: switches the monitor on and off.
Alarm Pause key: pauses the alarm sound for 2 minutes. The alarm message stays on the screen.
NIBP Start/Stop key: starts or stops a blood pressure measurement.
Main Menu key and rotary knob: open and navigate the menus.

Connectors are colour coded: ECG green, SpO2 blue, NIBP grey, temperature yellow.

The alarm lamp on top of the monitor flashes red for high priority alarms and yellow for medium priority alarms.`),
    P(4, `
3 Getting started

3.1 Before use
Inspect the monitor, cables and sensors for damage. Check that the battery symbol shows at least two bars if the monitor will be used on battery.

3.2 Switching on
1. Connect the power cord. The AC indicator lights green.
2. Press and hold the Power key for 2 seconds.
3. Wait for the self-test, about 20 seconds. The alarm lamp flashes red, then yellow, and a tone sounds.
4. Select New Patient or Continue Patient with the rotary knob.
5. Select the patient category: Adult or Pediatric.
6. Connect the sensors: ECG leads, SpO2 sensor and NIBP cuff.
7. Check that waveforms and values appear and that the alarm limits shown are those required by your protocol.`),
    P(5, `
4 Monitoring

4.1 NIBP
Press NIBP Start/Stop for a single measurement. Automatic intervals are set under Main Menu > NIBP > Interval.

4.2 SpO2
Place the sensor on a finger with good circulation. Do not place it on the same limb as the NIBP cuff.

4.3 Standby
Select Main Menu > Standby to pause monitoring when the patient is temporarily disconnected. Alarms are off in standby.

4.4 Battery operation
A fully charged battery lasts about 3 hours. Charging takes 5 hours with the monitor switched off.`),
    P(6, `
5 Alarms

5.1 Alarm priorities
High priority: red flashing lamp and repeated tone sequence.
Medium priority: yellow flashing lamp.
Low priority: yellow steady lamp.

Physiological alarms relate to the patient's measured values. Technical alarms relate to the monitor and its accessories and are shown with a code in the message area.

At every alarm: check the patient first. Then read the alarm message and correct the cause. Press Alarm Pause if the sound needs to be paused. The sound returns after 2 minutes if the cause remains.`),
    P(7, `
5.2 Technical alarm codes

T-101 ECG LEADS OFF (medium priority)
Cause: One or more electrodes have come loose or dried out.
Action: Check each electrode and lead wire. Replace electrodes that have dried out. Check that the trunk cable is fully inserted in the green connector.

T-110 SPO2 SENSOR OFF (medium priority)
Cause: The sensor has come off the patient or the cable is disconnected.
Action: Reattach the sensor and check the blue connector.

T-112 SPO2 LOW PERFUSION (low priority)
Cause: Weak signal, cold extremity or a sensor that sits too tight.
Action: Move the sensor to another site. Make sure it is not on the same limb as the NIBP cuff.

T-120 NIBP CUFF LEAK (medium priority)
Cause: The cuff or hose is not connected, or the cuff is leaking.
Action: Check the hose connection. Replace the cuff if it is damaged. Press NIBP Start/Stop to repeat the measurement.`),
    P(8, `
5.2 Technical alarm codes, continued

T-121 NIBP OVERPRESSURE (high priority)
Cause: The hose is kinked or the cuff is too small.
Action: The cuff deflates automatically. Remove the cuff from the patient, check the hose for kinks and select the correct cuff size before repeating the measurement.

T-130 BATTERY LOW (medium priority)
Cause: Less than 20 minutes of battery time remains.
Action: Connect the power cord.

T-201 SELF-TEST FAILED (high priority)
Cause: An internal fault was detected at start-up.
Action: Do not use the monitor. Label it and contact biomedical engineering.

T-205 SPEAKER FAULT (high priority)
Cause: The alarm speaker test failed. Alarms may be silent.
Action: Take the monitor out of use immediately and contact biomedical engineering.`),
    P(9, `
6 Cleaning and disinfection

Clean the monitor and its cables between patients.

1. Switch off the monitor and disconnect the power cord and all patient cables.
2. Wipe the housing and the screen with a soft cloth dampened with mild detergent.
3. Disinfect with 70 % isopropyl alcohol or approved quaternary ammonium wipes.
4. Wipe cables from the monitor end towards the patient end.
5. Let all parts dry completely before use.

Do not use acetone, abrasive cleaners or bleach stronger than 0.5 %. Never immerse the monitor or the sensors in liquid. Do not autoclave any part. Reusable SpO2 sensors are wiped with 70 % isopropyl alcohol.`),
    P(10, `
7 Maintenance and technical data

A safety inspection must be performed every 12 months by a qualified engineer. Replace the battery every 2 years.

Technical data
Screen: 12.1 inch colour display
Battery time: about 3 hours
Weight: 3.8 kg
Ingress protection: IPX1

Manufacturer: Exempla Care Ltd (fictional company)
Support: service@exempla.example`)
  ];

  /* ---------- 3. Sug (svenska) ---------- */
  const vacPages = [
    P(1, `
Modellia Vac 20
Mobil sugenhet
Bruksanvisning, Utgåva 2

EXEMPELMANUAL. Produkten och tillverkaren är påhittade och texten är skriven för demonstration.

Innehåll
1 Avsedd användning och säkerhet, sida 2
2 Översikt, sida 3
3 Uppstart och funktionskontroll, sida 4
4 Användning, sida 5
5 Felsökning och felkoder, sida 6
6 Rengöring och desinfektion, sida 7
7 Underhåll och tekniska data, sida 8`),
    P(2, `
1 Avsedd användning och säkerhet

Modellia Vac 20 är en mobil sugenhet för sugning av sekret från luftvägarna. Enheten får endast användas av utbildad vårdpersonal.

VARNING: Använd alltid bakteriefilter mellan uppsamlingskärlet och pumpen.
VARNING: Använd inte enheten i närheten av brandfarliga gaser eller vätskor.
OBS: Sugstyrkan ställs in enligt lokal rutin. Bruksanvisningen anger inga kliniska rekommendationer.`),
    P(3, `
2 Översikt

Strömbrytare med grön driftlampa.
Vakuumregulator: vred som ställer in sugstyrkan.
Manometer: visar aktuellt vakuum i kPa.
Uppsamlingskärl 1 000 ml med lock och flottör som stänger suget när kärlet är fullt.
Bakteriefilter: sitter mellan kärlets port märkt VAKUUM och pumpen.
Patientslang: ansluts till porten märkt PATIENT.
Statuslampa: gul eller röd lampa tillsammans med felkod på displayen.`),
    P(4, `
3 Uppstart och funktionskontroll

Gör funktionskontrollen före varje användning och efter rengöring.

1. Kontrollera att uppsamlingskärlet är tomt och helt och att locket sitter tätt.
2. Kontrollera att bakteriefiltret är torrt och sitter mellan kärlet och pumpen.
3. Anslut patientslangen till porten märkt PATIENT.
4. Slå på strömbrytaren. Den gröna lampan tänds.
5. Täpp till patientslangen med tummen och vrid regulatorn till max. Manometern ska nå minst 75 kPa inom 10 sekunder.
6. Ställ in sugstyrkan med regulatorn enligt lokal rutin.
7. Anslut sugkatetern.

Når manometern inte 75 kPa: se felkod F1 på sidan 6.`),
    P(5, `
4 Användning

Byt uppsamlingskärl när nivån når markeringen 800 ml. Om kärlet blir fullt stänger flottören suget och felkod F3 visas.

Batteridrift
Fulladdat batteri räcker cirka 45 minuter. Full laddning tar 6 timmar. Förvara enheten ansluten till laddaren så att den alltid är klar att använda.

Efter användning
Stäng av enheten, kassera engångsartiklar och rengör enligt avsnitt 6.`),
    P(6, `
5 Felsökning och felkoder

F1 LÅGT VAKUUM (gul lampa)
Orsak: Läckage vid lock, slang eller kärl, eller felmonterat filter.
Åtgärd: 1. Tryck fast locket. 2. Kontrollera att slangarna sitter på rätt port. 3. Gör om funktionskontrollen enligt avsnitt 3.

F2 FILTER BLOCKERAT (gul lampa)
Orsak: Bakteriefiltret är fuktigt eller igensatt.
Åtgärd: Byt bakteriefilter. Ett fuktigt filter får aldrig återanvändas.

F3 KÄRL FULLT (gul lampa)
Orsak: Flottören har stängt suget.
Åtgärd: Stäng av enheten, byt uppsamlingskärl, kontrollera filtret och starta igen.

F4 BATTERI SVAGT (gul blinkande lampa)
Orsak: Mindre än 10 minuters drifttid återstår.
Åtgärd: Anslut laddaren. Enheten kan användas under laddning.

F5 MOTORFEL (röd lampa)
Orsak: Motorn är överhettad eller vätska har nått pumpen.
Åtgärd: Stäng av enheten omedelbart, använd reservsug, märk enheten och kontakta medicinteknik. Starta inte om enheten.`),
    P(7, `
6 Rengöring och desinfektion

1. Stäng av enheten och dra ur laddaren.
2. Kassera engångskärl, patientslang och sugkateter.
3. Byt bakteriefilter efter varje patient och alltid om det har blivit fuktigt.
4. Torka höljet med ytdesinfektionsmedel, alkohol 70 % eller oxiderande medel.
5. Flergångskärl töms och körs i diskdesinfektor, 90 °C.
6. Låt alla delar torka och gör funktionskontrollen enligt avsnitt 3.

Spola aldrig vätska in i pumpen. Enheten får inte sänkas ned i vätska.`),
    P(8, `
7 Underhåll och tekniska data

Service ska utföras var 12:e månad av behörig tekniker.

Tekniska data
Maximalt vakuum: 85 kPa
Flöde: 26 liter per minut
Vikt: 4,6 kg
Batteritid: cirka 45 minuter

Tillverkare: Modellia Medical AB (påhittat företag)
Support: service@modellia.example`)
  ];

  /* ---------- 4. Diatermi (engelska) ---------- */
  const arcPages = [
    P(1, `
Fikta Arc 200
Electrosurgical Unit
User Manual, Edition B

SAMPLE MANUAL. The product and the manufacturer are fictional and the text is written for demonstration.

Contents
1 Intended use and safety, page 2
2 Overview, page 3
3 Set-up and start, page 4
4 During use, page 5
5 Error messages, page 6
6 Cleaning and disinfection, page 8
7 Maintenance and technical data, page 9`),
    P(2, `
1 Intended use and safety

The Fikta Arc 200 is an electrosurgical unit for cutting and coagulation of tissue during surgery. It is to be used by trained operating room staff only.

WARNING: Risk of fire. Do not activate the unit in the presence of flammable skin preparations that have not dried, or in oxygen-enriched atmospheres.
WARNING: Always use a split neutral electrode with monopolar modes. Apply it according to the electrode's own instructions.
WARNING: For patients with pacemakers or other active implants, follow your hospital protocol.
CAUTION: Power settings are selected as instructed by the surgeon. This manual gives no clinical recommendations.`),
    P(3, `
2 Overview

Front panel
Mains switch.
CUT display with up and down keys, and mode keys Pure Cut and Blend.
COAG display with up and down keys, and mode keys Soft Coag and Forced Coag.
Monopolar sockets 1 and 2.
Bipolar socket.
Neutral electrode socket with REM indicator: green when contact is approved, red when contact is insufficient.

Rear panel
Footswitch connectors, volume control and mains inlet.`),
    P(4, `
3 Set-up and start

1. Place the unit on its trolley with the ventilation openings unobstructed and connect the mains cable.
2. Switch on the mains switch. The self-test takes about 8 seconds. All displays light up and PASS is shown.
3. Apply the split neutral electrode to the patient and connect it. The REM indicator must turn green.
4. Connect the handpiece to monopolar socket 1, or the forceps to the bipolar socket.
5. Connect the footswitch if one is used.
6. Select mode and power settings as instructed by the surgeon.
7. Check that the activation tone is clearly audible. Adjust the volume on the rear panel.`),
    P(5, `
4 During use

The unit recalls the settings used before it was last switched off. Verify the settings before every procedure.

Activation tones: a high tone for CUT and a low tone for COAG.

If the usual power setting seems insufficient, check the neutral electrode contact and all cables before increasing the power.

Standby: press the mains switch briefly. Settings are kept for the next start.`),
    P(6, `
5 Error messages

Errors are shown as Err and a number in the CUT display.

Err 11 NEUTRAL ELECTRODE (red REM indicator, output blocked)
Cause: The neutral electrode is not connected, has poor skin contact or the cable is damaged.
Action: 1. Check the plug in the neutral electrode socket. 2. Check that the whole electrode surface adheres to the skin. Replace the electrode if it has lifted. Do not reposition a used electrode. 3. Wait for the green REM indicator.

Err 20 ACTIVATION AT POWER-ON
Cause: A handpiece key or the footswitch was pressed during the self-test, or a key is stuck.
Action: Release all keys and restart the unit. Replace the handpiece if the error returns.

Err 22 ACTIVATION TIMEOUT
Cause: Continuous activation for more than 60 seconds.
Action: Release the key or footswitch. Output is available again after release.

Err 31 OVERTEMPERATURE
Cause: Blocked ventilation openings or prolonged use at high power.
Action: Release activation, clear the ventilation openings and wait until the message disappears, about 3 minutes.`),
    P(7, `
5 Error messages, continued

Err 40 OUTPUT FAULT
Cause: Internal fault in the generator.
Action: Stop using the unit and switch it off. Use the backup unit and contact biomedical engineering. Do not reset the unit repeatedly.

Err 45 FOOTSWITCH FAULT
Cause: The footswitch or its cable is damaged or wet.
Action: Disconnect the footswitch and use hand activation. Replace the footswitch.

Err 50 to Err 59 SYSTEM ERROR
Cause: Internal system error.
Action: Note the code and switch the unit off and on once. If the error returns, take the unit out of use and contact biomedical engineering.`),
    P(8, `
6 Cleaning and disinfection

1. Switch off the unit and disconnect the mains cable.
2. Disconnect and remove all accessories.
3. Wipe all surfaces with a cloth dampened with mild detergent or an alcohol-based surface disinfectant.
4. Wipe the footswitch and its cable. Do not immerse the footswitch.
5. Let the unit dry completely before it is switched on. Flammable disinfectants must have evaporated.

Do not spray liquids on the unit and do not let liquid enter sockets or ventilation openings. Reusable cables and handpieces are reprocessed according to their own instructions.`),
    P(9, `
7 Maintenance and technical data

A safety inspection must be performed every 12 months by a qualified engineer.

Technical data
Maximum power CUT: 200 W
Maximum power COAG: 120 W
Bipolar: 80 W
Weight: 6.5 kg

Manufacturer: Fikta Surgical GmbH (fictional company)
Support: service@fikta.example`)
  ];

  /* ---------- 5. Ventilator (svenska) ---------- */
  const aerPages = [
    P(1, `
Testura Aer 5
Ventilator för intensivvård
Bruksanvisning, Version 2.1

EXEMPELMANUAL. Produkten och tillverkaren är påhittade och texten är skriven för demonstration.

Innehåll
1 Avsedd användning och säkerhet, sida 2
2 Översikt, sida 3
3 Uppstart och kontroll före användning, sida 4
4 Under drift, sida 5
5 Larm, sida 6
6 Rengöring och desinfektion, sida 9
7 Underhåll och tekniska data, sida 10`),
    P(2, `
1 Avsedd användning och säkerhet

Testura Aer 5 är avsedd för ventilation av vuxna och barn över 10 kg inom intensivvård. Ventilatorn får endast användas av utbildad personal och enligt läkares ordination.

VARNING: En handventilationsblåsa ska alltid finnas tillgänglig vid ventilatorn.
VARNING: Ventilationsinställningar och larmgränser ställs in för varje patient enligt ordination. Bruksanvisningen anger inga kliniska rekommendationer.
VARNING: Täck inte över ventilatorns luftintag på baksidan.
OBS: Gör alltid kontroll före användning efter byte av slangsystem.`),
    P(3, `
2 Översikt

Framsida
Pekskärm och vridratt för inställningar.
Knappen TYSTA LARM: tystar ljudsignalen i 2 minuter.
Knappen PÅ/STANDBY.
Inspirationsport och exspirationsport för patientslangar.
Flödessensor vid exspirationsporten.

Baksida
Gasanslutningar för syrgas och luft, nätanslutning, luftintag med filter och fack för reservbatteri.

Larmlampan överst lyser rött, gult eller turkost beroende på larmets prioritet.`),
    P(4, `
3 Uppstart och kontroll före användning

1. Anslut nätkabeln och gasslangarna för syrgas och luft. Kontrollera att tillförseltrycket visas i grönt område.
2. Montera patientslangar, bakteriefilter och fuktvärmeväxlare eller befuktare enligt märkningen på ventilatorn.
3. Tryck på PÅ/STANDBY.
4. Välj Kontroll före användning och följ anvisningarna på skärmen. Täpp till Y-stycket när skärmen ber om det.
5. Testet tar cirka 3 minuter och kontrollerar läckage, flödessensor, syrgascell och larm. Alla delmoment ska visa GODKÄND.
6. Välj patientkategori. Ventilationsinställningar och larmgränser anges enligt ordination.
7. Ventilatorn står i standby tills START VENTILATION bekräftas.

Visar något delmoment UNDERKÄND: se avsnitt 5.3 på sidan 8.`),
    P(5, `
4 Under drift

4.1 Standby
Tryck på PÅ/STANDBY och bekräfta på skärmen. I standby ges ingen ventilation och larmen är avstängda.

4.2 Skärmlås
Tryck på låssymbolen i 2 sekunder för att låsa skärmen. TYSTA LARM fungerar även när skärmen är låst.

4.3 Batteridrift
Det inbyggda batteriet räcker cirka 90 minuter. Reservbatteriet ger ytterligare cirka 90 minuter. Ventilatorn växlar automatiskt till batteri vid strömavbrott och larm V-230 visas.`),
    P(6, `
5 Larm

5.1 Prioritet
Hög prioritet: röd lampa och upprepad ljudsignal.
Medelhög prioritet: gul blinkande lampa.
Låg prioritet: turkos fast lampa.

Vid alla larm: kontrollera patienten först. Kan orsaken inte åtgärdas omedelbart: ventilera manuellt med handventilationsblåsan och tillkalla hjälp enligt lokal rutin.

Tekniska larm visas med kod och text i larmfältet överst på skärmen. Larmloggen öppnas via Meny > Larmlogg.`),
    P(7, `
5.2 Tekniska larm

V-201 SYRGASTILLFÖRSEL LÅG (hög prioritet)
Orsak: Syrgasslangen sitter löst, vägguttaget är stängt eller trycket i centralgasen är lågt.
Åtgärd: 1. Kontrollera att syrgasslangen sitter fast i vägguttaget. 2. Byt till ett annat uttag eller till gasflaska. 3. Kvarstår larmet: kontakta medicinteknik.

V-204 LUFTTILLFÖRSEL LÅG (medelhög prioritet)
Orsak: Luftslangen sitter löst eller trycket i centralgasen är lågt.
Åtgärd: Kontrollera luftslangen och vägguttaget. Ventilatorn fortsätter med enbart syrgas tills lufttillförseln är återställd.

V-210 LÄCKAGE I SLANGSYSTEM (medelhög prioritet)
Orsak: Lös koppling, otät befuktarkammare eller skadad slang.
Åtgärd: Kontrollera alla kopplingar från ventilatorn till Y-stycket. Byt slangset om en slang är skadad.

V-215 FLÖDESSENSOR FEL (medelhög prioritet)
Orsak: Fukt eller sekret i flödessensorn, eller felmonterad sensor.
Åtgärd: Byt flödessensor eller kalibrera den via Meny > Kalibrering > Flödessensor.`),
    P(8, `
5.2 Tekniska larm, fortsättning

V-220 SYRGASCELL BEHÖVER KALIBRERAS (låg prioritet)
Orsak: Syrgascellens mätvärde avviker.
Åtgärd: Kalibrera via Meny > Kalibrering > Syrgascell. Kalibreringen tar cirka 2 minuter.

V-230 BATTERIDRIFT (låg prioritet)
Orsak: Ventilatorn drivs av batteri.
Åtgärd: Anslut nätkabeln när det är möjligt.

V-231 BATTERI SVAGT (hög prioritet)
Orsak: Mindre än 15 minuters drifttid återstår.
Åtgärd: Anslut nätkabeln omedelbart eller byt till reservbatteriet.

V-290 TEKNISKT FEL (hög prioritet)
Orsak: Ventilatorn har upptäckt ett internt fel.
Åtgärd: Ventilera patienten manuellt, byt ventilator, märk enheten UR DRIFT och kontakta medicinteknik. Enheten får inte användas förrän den har kontrollerats.

5.3 Underkänd kontroll före användning
Kontrollera slangar och kopplingar och gör om testet en gång. Är testet fortfarande underkänt: använd inte ventilatorn och kontakta medicinteknik.`),
    P(9, `
6 Rengöring och desinfektion

1. Ställ ventilatorn i standby, stäng av den och koppla bort patientslangarna.
2. Kassera engångsslangar, bakteriefilter och fuktvärmeväxlare.
3. Torka ventilatorns ytor med ytdesinfektionsmedel med tensid. Torka skärmen med en fuktad duk, spreja inte.
4. Ta loss exspirationskassetten och kör den i diskdesinfektor, 90 °C.
5. Flödessensor för flergångsbruk läggs i 70 % etanol i 60 minuter och får lufttorka i 30 minuter. Blås inte med tryckluft.
6. Montera rena delar och gör kontroll före användning enligt avsnitt 3.

Exspirationskassetten kan autoklaveras vid 134 °C, högst 50 gånger.`),
    P(10, `
7 Underhåll och tekniska data

Förebyggande underhåll ska utföras var 12:e månad av behörig tekniker. Syrgascellen byts vartannat år och batterierna vart tredje år.

Tekniska data
Gastillförsel: 2,8 till 6,0 bar
Batteritid: cirka 90 minuter, 180 minuter med reservbatteri
Vikt: 9,4 kg
Kapslingsklass: IP21

Tillverkare: Testura Respiratory AB (påhittat företag)
Support: support@testura.example`)
  ];

  const mtJour = { name: 'MT-jour, Demosjukhuset', phone: '08-465 004 10', hours: 'Dygnet runt' };

  const devices = [
    { id: 'flow300', name: 'Infusionspump Flow 300', manufacturer: 'Demovia Medical', model: 'Flow 300', category: 'infusion', dept: 'Avdelning 24', inventoryNo: 'MT-10482', manualId: 'm-flow300',
      contacts: { mt: mtJour, support: { name: 'Demovia support', phone: '08-465 004 31', email: 'support@demovia.example', hours: 'Vardagar 8–17' } } },
    { id: 'vistam5', name: 'Patientmonitor Vista M5', manufacturer: 'Exempla Care', model: 'Vista M5', category: 'monitor', dept: 'IVA', inventoryNo: 'MT-20915', manualId: 'm-vistam5',
      contacts: { mt: mtJour, support: { name: 'Exempla service', phone: '031-390 06 14', email: 'service@exempla.example', hours: 'Vardagar 8–16.30' } } },
    { id: 'vac20', name: 'Sugenhet Vac 20', manufacturer: 'Modellia Medical', model: 'Vac 20', category: 'suction', dept: 'Akutmottagning', inventoryNo: 'MT-08377', manualId: 'm-vac20',
      contacts: { mt: mtJour, support: { name: 'Modellia service', phone: '040-628 04 22', email: 'service@modellia.example', hours: 'Vardagar 8–16' } } },
    { id: 'arc200', name: 'Diatermi Arc 200', manufacturer: 'Fikta Surgical', model: 'Arc 200', category: 'diathermy', dept: 'Operation', inventoryNo: 'MT-15260', manualId: 'm-arc200',
      contacts: { mt: mtJour, support: { name: 'Fikta service', phone: '08-465 004 47', email: 'service@fikta.example', hours: 'Vardagar 7–17' } } },
    { id: 'aer5', name: 'Ventilator Aer 5', manufacturer: 'Testura Respiratory', model: 'Aer 5', category: 'ventilator', dept: 'IVA', inventoryNo: 'MT-23104', manualId: 'm-aer5',
      contacts: { mt: mtJour, support: { name: 'Testura support', phone: '031-390 06 52', email: 'support@testura.example', hours: 'Dygnet runt för IVA-kunder' } } },
    { id: 'cardio12', name: 'EKG-apparat Cardio 12', manufacturer: 'Exempla Care', model: 'Cardio 12', category: 'ecg', dept: 'Akutmottagning', inventoryNo: 'MT-19033', manualId: null,
      contacts: { mt: mtJour, support: { name: 'Exempla service', phone: '031-390 06 14', email: 'service@exempla.example', hours: 'Vardagar 8–16.30' } } }
  ];

  const manuals = [
    {
      id: 'm-flow300', deviceId: 'flow300', title: 'Demovia Flow 300, bruksanvisning', fileName: 'Flow300_bruksanvisning_RevD.pdf',
      version: 'Rev D', issued: '2025-03-14', lang: 'sv', uploadedRel: { da: 41, hm: '10:20' }, pages: flowPages,
      history: [{ version: 'Rev C', issued: '2022-06-01', replacedRel: { da: 41, hm: '10:20' }, note: 'Nya larmkoder i Rev D: E-40. Borttagna: inga.' }],
      alarms: {
        'E-07': { label: 'LUFT I SLANG', prio: 'hög', betyder: 'Pumpen har upptäckt luft i slangen och har stoppat infusionen.', orsak: 'Luftbubblor passerar luftdetektorn eller aggregatet är ofullständigt fyllt.', atgard: ['Stäng rullklämman.', 'Koppla bort aggregatet från patienten enligt lokal rutin och fyll om det via PRIMA.', 'Lägg tillbaka slangen, stäng luckan och tryck på START.'], sida: 7, mt: false },
        'E-12': { label: 'LUCKA ÖPPEN', prio: 'hög', betyder: 'Luckan är inte stängd. Infusionen har stoppats.', orsak: 'Luckan är inte helt stängd eller slangen ligger fel i spåret.', atgard: ['Lägg slangen rakt i slangspåret.', 'Stäng luckan tills det klickar.'], sida: 7, mt: false },
        'E-23': { label: 'OCKLUSION NEDSTRÖMS', prio: 'hög', betyder: 'Det är stopp i slangen mellan pumpen och patienten. Infusionen har stoppats.', orsak: 'Stängd rullklämma, vikt slang, stängd trevägskran eller tilltäppt infart mellan pumpen och patienten.', atgard: ['Tryck på TYSTA LARM.', 'Följ slangen från pumpen till patienten och kontrollera klämmor, kranar och veck.', 'Åtgärda hindret. Pumpen avlastar trycket automatiskt.', 'Tryck på START.', 'Om larmet återkommer utan synligt hinder: avbryt infusionen och kontrollera infarten enligt lokal rutin.'], sida: 7, mt: false },
        'E-24': { label: 'OCKLUSION UPPSTRÖMS', prio: 'hög', betyder: 'Det kommer ingen vätska till pumpen.', orsak: 'Tom behållare, oluftad glasflaska eller stängd klämma ovanför pumpen.', atgard: ['Kontrollera behållaren, luftningen och klämman ovanför pumpen.', 'Tryck på START.'], sida: 8, mt: false },
        'E-31': { label: 'BATTERI SVAGT', prio: 'medel', betyder: 'Batteriet är nästan slut. Infusionen fortsätter.', orsak: 'Mindre än 30 minuters drifttid återstår.', atgard: ['Anslut nätkabeln.'], sida: 8, mt: false },
        'E-32': { label: 'BATTERI SLUT', prio: 'hög', betyder: 'Batteriet är urladdat och pumpen har stoppat.', orsak: 'Batteriet är urladdat.', atgard: ['Anslut nätkabeln omedelbart.', 'Tryck på START.'], sida: 8, mt: false },
        'E-40': { label: 'INFUSION KLAR', prio: 'låg', betyder: 'Inställd volym är given. Pumpen fortsätter med håll-öppet-hastighet.', orsak: 'Inställd volym är given.', atgard: ['Byt behållare eller avsluta infusionen enligt ordination.'], sida: 8, mt: false },
        'E-90–E-99': { label: 'TEKNISKT FEL', prio: 'hög', range: ['E', 90, 99], rad: 'E-90 till E-99', betyder: 'Pumpen har upptäckt ett internt fel.', orsak: 'Internt fel vid självtest eller under drift.', atgard: ['Anteckna koden.', 'Ta pumpen ur drift och märk den.', 'Kontakta medicinteknik.', 'Starta inte om pumpen på patient.'], sida: 8, mt: true }
      },
      card: {
        status: 'approved', version: 'Rev D', madeRel: { da: 40, hm: '09:05' }, approvedRel: { da: 39, hm: '13:40' },
        uppstart: { sida: 4, avsnitt: '3.2 Starta pumpen', citat: 'Öppna luckan, lägg slangen i slangspåret uppifrån och ned och stäng luckan tills det klickar.', steg: ['Anslut nätkabeln. Nätlampan ska lysa.', 'Tryck på PÅ/AV i en sekund och vänta på SJÄLVTEST OK (cirka 10 sekunder).', 'Öppna luckan, lägg slangen uppifrån och ned och stäng tills det klickar.', 'Välj PRIMA och håll OK tills slangen är luftfri. Aggregatet får inte vara anslutet till patienten.', 'Ange hastighet och volym enligt ordination. Bekräfta med OK.', 'Öppna rullklämman och tryck på START.'] },
        larm: [
          { kod: 'E-23', betyder: 'Stopp mellan pump och patient', gor: 'Kontrollera klämmor, kranar och veck. Tryck på START.' },
          { kod: 'E-07', betyder: 'Luft i slangen', gor: 'Stäng klämman, koppla bort och fyll om via PRIMA.' },
          { kod: 'E-24', betyder: 'Ingen vätska till pumpen', gor: 'Kontrollera behållare, luftning och klämma ovanför pumpen.' },
          { kod: 'E-90 till E-99', betyder: 'Tekniskt fel', gor: 'Ta pumpen ur drift och kontakta MT.' }
        ],
        rengoring: { sida: 9, avsnitt: '6 Rengöring och desinfektion', citat: 'Desinfektera med alkoholbaserat ytdesinfektionsmedel, högst 70 % etanol eller isopropanol.', steg: ['Stäng av och dra ur nätkabeln.', 'Torka med mjuk duk och milt rengöringsmedel.', 'Desinfektera med alkoholbaserat medel, högst 70 %.', 'Torka luckans insida och slangspåret med fuktad bomullspinne.', 'Låt torka minst 10 minuter med luckan öppen.'] },
        viktigt: ['Använd endast infusionsaggregat typ DF.', 'Inget klor på displayen. Spreja aldrig direkt på pumpen.']
      }
    },
    {
      id: 'm-vistam5', deviceId: 'vistam5', title: 'Exempla Vista M5, Instructions for Use', fileName: 'VistaM5_IFU_3-2_EN.pdf',
      version: 'Rev 3.2', issued: '2024-11-05', lang: 'en', uploadedRel: { da: 96, hm: '14:02' }, pages: vistaPages, history: [],
      alarms: {
        'T-101': { label: 'ECG LEADS OFF', prio: 'medel', betyder: 'En eller flera EKG-elektroder har tappat kontakten.', orsak: 'Elektroder har lossnat eller torkat ut.', atgard: ['Kontrollera varje elektrod och avledningskabel.', 'Byt elektroder som har torkat ut.', 'Kontrollera att stamkabeln sitter helt i den gröna kontakten.'], sida: 7, mt: false },
        'T-110': { label: 'SPO2 SENSOR OFF', prio: 'medel', betyder: 'SpO2-sensorn har lossnat.', orsak: 'Sensorn har lossnat från patienten eller kabeln är urkopplad.', atgard: ['Sätt tillbaka sensorn.', 'Kontrollera den blå kontakten.'], sida: 7, mt: false },
        'T-112': { label: 'SPO2 LOW PERFUSION', prio: 'låg', betyder: 'Signalen från SpO2-sensorn är svag.', orsak: 'Svag signal, kall extremitet eller en sensor som sitter för hårt.', atgard: ['Flytta sensorn till ett annat ställe.', 'Kontrollera att den inte sitter på samma arm som blodtrycksmanschetten.'], sida: 7, mt: false },
        'T-120': { label: 'NIBP CUFF LEAK', prio: 'medel', betyder: 'Blodtrycksmanschetten läcker eller är inte ansluten.', orsak: 'Manschett eller slang är inte ansluten, eller manschetten läcker.', atgard: ['Kontrollera slanganslutningen.', 'Byt manschetten om den är skadad.', 'Tryck på NIBP Start/Stop för att mäta igen.'], sida: 7, mt: false },
        'T-121': { label: 'NIBP OVERPRESSURE', prio: 'hög', betyder: 'Trycket i manschetten blev för högt. Manschetten töms automatiskt.', orsak: 'Slangen är vikt eller manschetten är för liten.', atgard: ['Ta av manschetten från patienten.', 'Kontrollera att slangen inte är vikt.', 'Välj rätt manschettstorlek och mät igen.'], sida: 8, mt: false },
        'T-130': { label: 'BATTERY LOW', prio: 'medel', betyder: 'Batteriet är nästan slut.', orsak: 'Mindre än 20 minuters batteritid återstår.', atgard: ['Anslut nätkabeln.'], sida: 8, mt: false },
        'T-201': { label: 'SELF-TEST FAILED', prio: 'hög', betyder: 'Monitorn har hittat ett internt fel vid start.', orsak: 'Internt fel upptäckt vid självtestet.', atgard: ['Använd inte monitorn.', 'Märk den och kontakta medicinteknik.'], sida: 8, mt: true },
        'T-205': { label: 'SPEAKER FAULT', prio: 'hög', betyder: 'Larmhögtalaren fungerar inte. Larm kan vara tysta.', orsak: 'Test av larmhögtalaren misslyckades.', atgard: ['Ta monitorn ur drift omedelbart.', 'Kontakta medicinteknik.'], sida: 8, mt: true }
      },
      card: {
        status: 'approved', version: 'Rev 3.2', madeRel: { da: 95, hm: '08:30' }, approvedRel: { da: 94, hm: '11:15' },
        uppstart: { sida: 4, avsnitt: '3.2 Switching on', citat: 'Press and hold the Power key for 2 seconds.', steg: ['Anslut nätkabeln. AC-lampan lyser grönt.', 'Håll in Power i 2 sekunder och vänta på självtestet (cirka 20 sekunder).', 'Välj New Patient eller Continue Patient med vridratten.', 'Välj patientkategori: Adult eller Pediatric.', 'Anslut EKG-kablar, SpO2-sensor och blodtrycksmanschett.', 'Kontrollera att kurvor och värden visas och att larmgränserna stämmer med er rutin.'] },
        larm: [
          { kod: 'T-101', betyder: 'EKG-elektrod har lossnat', gor: 'Kontrollera elektroder och kabel, byt torra elektroder.' },
          { kod: 'T-112', betyder: 'Svag SpO2-signal', gor: 'Flytta sensorn, inte samma arm som manschetten.' },
          { kod: 'T-120', betyder: 'Manschetten läcker', gor: 'Kontrollera slangen, byt skadad manschett.' },
          { kod: 'T-205', betyder: 'Larmhögtalaren fungerar inte', gor: 'Ta ur drift direkt och kontakta MT.' }
        ],
        rengoring: { sida: 9, avsnitt: '6 Cleaning and disinfection', citat: 'Disinfect with 70 % isopropyl alcohol or approved quaternary ammonium wipes.', steg: ['Stäng av och koppla ur nätkabel och patientkablar.', 'Torka hölje och skärm med mjuk duk och milt rengöringsmedel.', 'Desinfektera med 70 % isopropanol eller godkända kvartära ammoniumdukar.', 'Torka kablarna från monitorn mot patientänden.', 'Låt allt torka helt före användning.'] },
        viktigt: ['Ingen aceton och inget blekmedel starkare än 0,5 %.', 'Sänk aldrig ned monitor eller sensorer i vätska.']
      }
    },
    {
      id: 'm-vac20', deviceId: 'vac20', title: 'Modellia Vac 20, bruksanvisning', fileName: 'Vac20_bruksanvisning_utg2.pdf',
      version: 'Utgåva 2', issued: '2023-01-20', lang: 'sv', uploadedRel: { da: 210, hm: '09:44' }, pages: vacPages, history: [],
      alarms: {
        'F1': { label: 'LÅGT VAKUUM', prio: 'medel', betyder: 'Sugenheten når inte tillräckligt vakuum.', orsak: 'Läckage vid lock, slang eller kärl, eller felmonterat filter.', atgard: ['Tryck fast locket.', 'Kontrollera att slangarna sitter på rätt port.', 'Gör om funktionskontrollen enligt avsnitt 3.'], sida: 6, mt: false },
        'F2': { label: 'FILTER BLOCKERAT', prio: 'medel', betyder: 'Bakteriefiltret släpper inte igenom luft.', orsak: 'Bakteriefiltret är fuktigt eller igensatt.', atgard: ['Byt bakteriefilter.', 'Ett fuktigt filter får aldrig återanvändas.'], sida: 6, mt: false },
        'F3': { label: 'KÄRL FULLT', prio: 'medel', betyder: 'Uppsamlingskärlet är fullt och flottören har stängt suget.', orsak: 'Flottören har stängt suget.', atgard: ['Stäng av enheten.', 'Byt uppsamlingskärl.', 'Kontrollera filtret och starta igen.'], sida: 6, mt: false },
        'F4': { label: 'BATTERI SVAGT', prio: 'medel', betyder: 'Batteriet är nästan slut.', orsak: 'Mindre än 10 minuters drifttid återstår.', atgard: ['Anslut laddaren. Enheten kan användas under laddning.'], sida: 6, mt: false },
        'F5': { label: 'MOTORFEL', prio: 'hög', betyder: 'Motorn är överhettad eller vätska har nått pumpen.', orsak: 'Motorn är överhettad eller vätska har nått pumpen.', atgard: ['Stäng av enheten omedelbart.', 'Använd reservsug.', 'Märk enheten och kontakta medicinteknik.', 'Starta inte om enheten.'], sida: 6, mt: true }
      },
      card: {
        status: 'approved', version: 'Utgåva 2', madeRel: { da: 200, hm: '15:10' }, approvedRel: { da: 199, hm: '08:20' },
        uppstart: { sida: 4, avsnitt: '3 Uppstart och funktionskontroll', citat: 'Manometern ska nå minst 75 kPa inom 10 sekunder.', steg: ['Kontrollera att kärlet är tomt och helt och att locket sitter tätt.', 'Kontrollera att bakteriefiltret är torrt och sitter mellan kärl och pump.', 'Anslut patientslangen till porten PATIENT.', 'Slå på strömbrytaren. Grön lampa tänds.', 'Täpp till slangen och vrid till max: minst 75 kPa inom 10 sekunder.', 'Ställ in sugstyrkan enligt lokal rutin och anslut sugkatetern.'] },
        larm: [
          { kod: 'F1', betyder: 'Lågt vakuum', gor: 'Tryck fast locket, kontrollera slangar, gör funktionskontroll.' },
          { kod: 'F2', betyder: 'Filtret är blockerat', gor: 'Byt bakteriefilter.' },
          { kod: 'F3', betyder: 'Kärlet är fullt', gor: 'Stäng av, byt kärl, kontrollera filtret.' },
          { kod: 'F5', betyder: 'Motorfel', gor: 'Stäng av, använd reservsug, kontakta MT.' }
        ],
        rengoring: { sida: 7, avsnitt: '6 Rengöring och desinfektion', citat: 'Byt bakteriefilter efter varje patient och alltid om det har blivit fuktigt.', steg: ['Stäng av och dra ur laddaren.', 'Kassera engångskärl, patientslang och sugkateter.', 'Byt bakteriefilter efter varje patient.', 'Torka höljet med ytdesinfektionsmedel.', 'Låt torka och gör funktionskontrollen.'] },
        viktigt: ['Använd alltid bakteriefilter.', 'Ett fuktigt filter får aldrig återanvändas.']
      }
    },
    {
      id: 'm-arc200', deviceId: 'arc200', title: 'Fikta Arc 200, User Manual', fileName: 'Arc200_UserManual_EdB.pdf',
      version: 'Edition B', issued: '2021-05-10', lang: 'en', uploadedRel: { da: 320, hm: '11:30' }, pages: arcPages, history: [],
      alarms: {
        'ERR 11': { label: 'NEUTRAL ELECTRODE', prio: 'hög', rad: 'Err 11', betyder: 'Neutralelektroden har inte godkänd kontakt. Uteffekten är spärrad.', orsak: 'Neutralelektroden är inte ansluten, har dålig hudkontakt eller kabeln är skadad.', atgard: ['Kontrollera kontakten i uttaget för neutralelektrod.', 'Kontrollera att hela elektrodytan ligger an mot huden. Byt elektrod om den har lyft. Flytta inte en använd elektrod.', 'Vänta på grön REM-indikator.'], sida: 6, mt: false },
        'ERR 20': { label: 'ACTIVATION AT POWER-ON', prio: 'medel', rad: 'Err 20', betyder: 'En knapp eller fotpedalen var intryckt under självtestet.', orsak: 'Handtagets knapp eller fotpedalen var intryckt under självtestet, eller en knapp har fastnat.', atgard: ['Släpp alla knappar och starta om enheten.', 'Byt handtag om felet återkommer.'], sida: 6, mt: false },
        'ERR 22': { label: 'ACTIVATION TIMEOUT', prio: 'låg', rad: 'Err 22', betyder: 'Aktiveringen har pågått för länge.', orsak: 'Kontinuerlig aktivering i mer än 60 sekunder.', atgard: ['Släpp knappen eller fotpedalen. Uteffekten är tillgänglig igen direkt.'], sida: 6, mt: false },
        'ERR 31': { label: 'OVERTEMPERATURE', prio: 'medel', rad: 'Err 31', betyder: 'Enheten är för varm.', orsak: 'Blockerade ventilationsöppningar eller långvarig användning på hög effekt.', atgard: ['Släpp aktiveringen.', 'Frilägg ventilationsöppningarna.', 'Vänta tills meddelandet försvinner, cirka 3 minuter.'], sida: 6, mt: false },
        'ERR 40': { label: 'OUTPUT FAULT', prio: 'hög', rad: 'Err 40', betyder: 'Internt fel i generatorn.', orsak: 'Internt fel i generatorn.', atgard: ['Sluta använda enheten och stäng av den.', 'Använd reservenheten.', 'Kontakta medicinteknik. Återställ inte enheten upprepade gånger.'], sida: 7, mt: true },
        'ERR 45': { label: 'FOOTSWITCH FAULT', prio: 'medel', rad: 'Err 45', betyder: 'Fotpedalen fungerar inte.', orsak: 'Fotpedalen eller dess kabel är skadad eller blöt.', atgard: ['Koppla ur fotpedalen och använd handaktivering.', 'Byt fotpedal.'], sida: 7, mt: false },
        'ERR 50–ERR 59': { label: 'SYSTEM ERROR', prio: 'hög', range: ['ERR', 50, 59], rad: 'Err 50 to Err 59', betyder: 'Internt systemfel.', orsak: 'Internt systemfel.', atgard: ['Anteckna koden.', 'Stäng av och slå på enheten en gång.', 'Om felet återkommer: ta enheten ur drift och kontakta medicinteknik.'], sida: 7, mt: true }
      },
      card: {
        status: 'draft', version: 'Edition B', madeRel: { da: 2, hm: '16:45' },
        uppstart: { sida: 4, avsnitt: '3 Set-up and start', citat: 'The REM indicator must turn green.', steg: ['Ställ enheten på vagnen med fria ventilationsöppningar och anslut nätkabeln.', 'Slå på huvudströmbrytaren och vänta på PASS (cirka 8 sekunder).', 'Sätt delad neutralelektrod på patienten och anslut den. REM-indikatorn ska lysa grönt.', 'Anslut handtag till monopolärt uttag 1, eller pincett till bipolärt uttag.', 'Anslut fotpedalen om den används.', 'Välj läge och effekt enligt operatörens anvisning. Kontrollera att aktiveringstonen hörs.'] },
        larm: [
          { kod: 'Err 11', betyder: 'Neutralelektroden har dålig kontakt', gor: 'Kontrollera kontakt och hudkontakt, byt elektrod som har lyft.' },
          { kod: 'Err 31', betyder: 'Övertemperatur', gor: 'Släpp aktiveringen, frilägg ventilationen, vänta cirka 3 minuter.' },
          { kod: 'Err 45', betyder: 'Fel på fotpedalen', gor: 'Koppla ur pedalen, använd handaktivering.' },
          { kod: 'Err 40', betyder: 'Fel i generatorn', gor: 'Stäng av, använd reservenhet, kontakta MT.' }
        ],
        rengoring: { sida: 8, avsnitt: '6 Cleaning and disinfection', citat: 'Flammable disinfectants must have evaporated.', steg: ['Stäng av och dra ur nätkabeln.', 'Koppla loss alla tillbehör.', 'Torka ytorna med milt rengöringsmedel eller alkoholbaserat ytdesinfektionsmedel.', 'Torka fotpedalen och kabeln. Sänk inte ned pedalen.', 'Låt enheten torka helt. Brandfarliga medel ska ha avdunstat före start.'] },
        viktigt: ['Brandrisk: aktivera aldrig nära brandfarliga medel som inte har torkat.', 'Kontrollera inställningarna före varje ingrepp.']
      }
    },
    {
      id: 'm-aer5', deviceId: 'aer5', title: 'Testura Aer 5, bruksanvisning', fileName: 'Aer5_bruksanvisning_v2-1.pdf',
      version: 'Version 2.1', issued: '2026-02-02', lang: 'sv', uploadedRel: { da: 12, hm: '13:15' }, pages: aerPages,
      history: [{ version: 'Version 2.0', issued: '2024-04-18', replacedRel: { da: 12, hm: '13:15' }, note: 'Nya larmkoder i Version 2.1: V-204, V-220. Borttagna: inga.' }],
      alarms: {
        'V-201': { label: 'SYRGASTILLFÖRSEL LÅG', prio: 'hög', betyder: 'Ventilatorn får för lågt syrgastryck.', orsak: 'Syrgasslangen sitter löst, vägguttaget är stängt eller trycket i centralgasen är lågt.', atgard: ['Kontrollera att syrgasslangen sitter fast i vägguttaget.', 'Byt till ett annat uttag eller till gasflaska.', 'Kvarstår larmet: kontakta medicinteknik.'], sida: 7, mt: true },
        'V-204': { label: 'LUFTTILLFÖRSEL LÅG', prio: 'medel', betyder: 'Ventilatorn får för lågt lufttryck och fortsätter med enbart syrgas.', orsak: 'Luftslangen sitter löst eller trycket i centralgasen är lågt.', atgard: ['Kontrollera luftslangen och vägguttaget.'], sida: 7, mt: false },
        'V-210': { label: 'LÄCKAGE I SLANGSYSTEM', prio: 'medel', betyder: 'Det läcker någonstans i slangsystemet.', orsak: 'Lös koppling, otät befuktarkammare eller skadad slang.', atgard: ['Kontrollera alla kopplingar från ventilatorn till Y-stycket.', 'Byt slangset om en slang är skadad.'], sida: 7, mt: false },
        'V-215': { label: 'FLÖDESSENSOR FEL', prio: 'medel', betyder: 'Flödessensorn mäter inte korrekt.', orsak: 'Fukt eller sekret i flödessensorn, eller felmonterad sensor.', atgard: ['Byt flödessensor, eller', 'kalibrera den via Meny > Kalibrering > Flödessensor.'], sida: 7, mt: false },
        'V-220': { label: 'SYRGASCELL BEHÖVER KALIBRERAS', prio: 'låg', betyder: 'Syrgascellens mätvärde avviker.', orsak: 'Syrgascellens mätvärde avviker.', atgard: ['Kalibrera via Meny > Kalibrering > Syrgascell. Det tar cirka 2 minuter.'], sida: 8, mt: false },
        'V-230': { label: 'BATTERIDRIFT', prio: 'låg', betyder: 'Ventilatorn drivs av batteri.', orsak: 'Nätspänning saknas.', atgard: ['Anslut nätkabeln när det är möjligt.'], sida: 8, mt: false },
        'V-231': { label: 'BATTERI SVAGT', prio: 'hög', betyder: 'Mindre än 15 minuters drifttid återstår.', orsak: 'Batteriet är nästan urladdat.', atgard: ['Anslut nätkabeln omedelbart eller byt till reservbatteriet.'], sida: 8, mt: false },
        'V-290': { label: 'TEKNISKT FEL', prio: 'hög', betyder: 'Ventilatorn har upptäckt ett internt fel.', orsak: 'Internt fel.', atgard: ['Ventilera patienten manuellt.', 'Byt ventilator.', 'Märk enheten UR DRIFT och kontakta medicinteknik.', 'Enheten får inte användas förrän den har kontrollerats.'], sida: 8, mt: true }
      },
      card: {
        status: 'approved', version: 'Version 2.1', madeRel: { da: 11, hm: '10:00' }, approvedRel: { da: 9, hm: '14:25' },
        uppstart: { sida: 4, avsnitt: '3 Uppstart och kontroll före användning', citat: 'Alla delmoment ska visa GODKÄND.', steg: ['Anslut nätkabel och gasslangar. Tillförseltrycket ska visas i grönt område.', 'Montera patientslangar, bakteriefilter och fuktvärmeväxlare eller befuktare.', 'Tryck på PÅ/STANDBY.', 'Välj Kontroll före användning och följ skärmen. Täpp till Y-stycket när skärmen ber om det.', 'Vänta cirka 3 minuter. Alla delmoment ska visa GODKÄND.', 'Välj patientkategori. Inställningar och larmgränser anges enligt ordination.'] },
        larm: [
          { kod: 'V-210', betyder: 'Läckage i slangsystemet', gor: 'Kontrollera kopplingarna fram till Y-stycket.' },
          { kod: 'V-215', betyder: 'Fel på flödessensorn', gor: 'Byt eller kalibrera flödessensorn.' },
          { kod: 'V-201', betyder: 'Lågt syrgastryck', gor: 'Kontrollera slang och uttag, byt uttag eller gasflaska.' },
          { kod: 'V-290', betyder: 'Tekniskt fel', gor: 'Ventilera manuellt, byt ventilator, kontakta MT.' }
        ],
        rengoring: { sida: 9, avsnitt: '6 Rengöring och desinfektion', citat: 'Ta loss exspirationskassetten och kör den i diskdesinfektor, 90 °C.', steg: ['Stäng av och koppla bort patientslangarna.', 'Kassera engångsslangar, bakteriefilter och fuktvärmeväxlare.', 'Torka ytorna med ytdesinfektionsmedel med tensid. Spreja inte på skärmen.', 'Kör exspirationskassetten i diskdesinfektor, 90 °C.', 'Montera rena delar och gör kontroll före användning.'] },
        viktigt: ['En handventilationsblåsa ska alltid finnas vid ventilatorn.', 'Vid larm: kontrollera patienten först.']
      }
    }
  ];

  const tips = [
    { id: 't-flow-1', deviceId: 'flow300', status: 'approved', rel: { da: 34, hm: '14:10' }, decidedRel: { da: 33, hm: '08:05' }, text: 'Reservaggregat typ DF finns i läkemedelsrummet, skåp 3, hylla 2.' },
    { id: 't-flow-2', deviceId: 'flow300', status: 'approved', rel: { da: 20, hm: '22:40' }, decidedRel: { da: 19, hm: '09:30' }, text: 'Pumpar som inte används ska stå på laddning i laddstationen i korridoren.' },
    { id: 't-flow-3', deviceId: 'flow300', status: 'pending', rel: { da: 1, hm: '03:25' }, text: 'Kommer E-23 direkt vid start: kontrollera trevägskranen närmast infarten. Det är oftast den som är stängd.' },
    { id: 't-vista-1', deviceId: 'vistam5', status: 'approved', rel: { da: 60, hm: '10:15' }, decidedRel: { da: 59, hm: '13:00' }, text: 'EKG-elektroder och barnmanschetter finns i IVA-förrådet, låda B4.' },
    { id: 't-vac-1', deviceId: 'vac20', status: 'approved', rel: { da: 45, hm: '07:50' }, decidedRel: { da: 44, hm: '10:20' }, text: 'Extra bakteriefilter ligger i akutvagnens nedersta låda. Säg till samordnaren när du tar det sista.' },
    { id: 't-vac-2', deviceId: 'vac20', status: 'pending', rel: { da: 0, hm: '04:05' }, text: 'Funktionskontrollen görs av nattpersonalen varje natt och signeras på listan i sköljen.' },
    { id: 't-arc-1', deviceId: 'arc200', status: 'approved', rel: { da: 80, hm: '15:30' }, decidedRel: { da: 79, hm: '07:45' }, text: 'Fotpedalen till sal 3 förvaras på vagnens nedre hylla. Häng upp kabeln på kroken efter rengöring.' },
    { id: 't-aer-1', deviceId: 'aer5', status: 'approved', rel: { da: 10, hm: '11:20' }, decidedRel: { da: 9, hm: '14:30' }, text: 'Testlunga och reservslangset finns i apparatrummet på IVA, hylla V.' }
  ];

  const flags = [
    { id: 'f-vista-1', deviceId: 'vistam5', status: 'open', rel: { da: 2, hm: '21:15' }, reason: 'Otydligt eller ofullständigt', q: 'Kan jag torka skärmen med klorin?', a: 'Manualen anger att blekmedel starkare än 0,5 % inte får användas på monitorn. [1]', note: 'Oklart om vår klorlösning är starkare än 0,5 %. Behöver ett lokalt förtydligande.', version: 'Rev 3.2', sida: 9 },
    { id: 'f-arc-1', deviceId: 'arc200', status: 'resolved', rel: { da: 9, hm: '13:40' }, decidedRel: { da: 3, hm: '09:10' }, reason: 'Otydligt eller ofullständigt', q: 'Hur byter jag säkring?', a: 'Det står inte i manualen.', note: 'Svaret borde hänvisa tydligare till MT.', resolution: 'Säkringsbyte görs endast av MT. Svaret är korrekt, manualen saknar avsnittet.', version: 'Edition B' }
  ];

  const reports = [
    { id: 'r-vac-1', deviceId: 'vac20', status: 'open', rel: { da: 0, hm: '03:12' }, code: 'F5', what: 'Röd lampa tändes och enheten slutade suga mitt under användning.', tried: ['Stängt av enheten', 'Bytt till reservsug', 'Märkt enheten'], outOfService: true },
    { id: 'r-flow-1', deviceId: 'flow300', status: 'closed', rel: { da: 7, hm: '19:48' }, decidedRel: { da: 6, hm: '08:30' }, code: 'E-94', what: 'Tekniskt fel direkt efter självtestet.', tried: ['Antecknat koden', 'Tagit pumpen ur drift'], outOfService: true, resolution: 'Pumpen hämtad för service. Lånepump utlämnad till avdelningen.' }
  ];

  /* Frågestatistik för de senaste 30 dagarna. Antal per frågemall; övriga summor räknas fram ur dessa. */
  const questions = [
    { d: 'flow300', k: 'alarm', n: 46, a: 1, q: 'Vad betyder E-23 och vad gör jag?' },
    { d: 'flow300', k: 'start', n: 31, a: 1, q: 'Hur fyller jag aggregatet?' },
    { d: 'flow300', k: 'clean', n: 22, a: 1, q: 'Hur rengör jag pumpen mellan patienter?' },
    { d: 'flow300', k: 'alarm', n: 19, a: 1, q: 'Vad gör jag vid luft i slangen?' },
    { d: 'flow300', k: 'other', n: 12, a: 1, q: 'Hur låser jag knapparna?' },
    { d: 'flow300', k: 'other', n: 9, a: 1, q: 'Hur länge räcker batteriet?' },
    { d: 'vistam5', k: 'start', n: 28, a: 1, q: 'Hur startar jag en ny patient?' },
    { d: 'vistam5', k: 'clean', n: 21, a: 1, q: 'Vilket medel får jag torka skärmen med?' },
    { d: 'vistam5', k: 'alarm', n: 17, a: 1, q: 'Vad betyder T-112?' },
    { d: 'vistam5', k: 'alarm', n: 14, a: 1, q: 'Varför larmar blodtrycket för läckage?' },
    { d: 'vistam5', k: 'other', n: 6, a: 0, q: 'Hur kopplar jag in en extern skärm?' },
    { d: 'vac20', k: 'start', n: 24, a: 1, q: 'Hur gör jag funktionskontrollen?' },
    { d: 'vac20', k: 'alarm', n: 18, a: 1, q: 'Lågt vakuum, vad kontrollerar jag?' },
    { d: 'vac20', k: 'clean', n: 16, a: 1, q: 'Hur ofta byts bakteriefiltret?' },
    { d: 'vac20', k: 'other', n: 7, a: 0, q: 'Var beställer jag nya uppsamlingskärl?' },
    { d: 'arc200', k: 'alarm', n: 23, a: 1, q: 'Varför lyser REM-indikatorn rött?' },
    { d: 'arc200', k: 'start', n: 13, a: 1, q: 'Hur kopplar jag in fotpedalen?' },
    { d: 'arc200', k: 'clean', n: 12, a: 1, q: 'Hur rengör jag enheten efter operation?' },
    { d: 'arc200', k: 'other', n: 5, a: 0, q: 'Hur byter jag säkring?' },
    { d: 'aer5', k: 'start', n: 27, a: 1, q: 'Hur gör jag kontroll före användning?' },
    { d: 'aer5', k: 'alarm', n: 15, a: 1, q: 'Vad betyder V-215?' },
    { d: 'aer5', k: 'other', n: 11, a: 1, q: 'Hur kalibrerar jag syrgascellen?' },
    { d: 'aer5', k: 'clean', n: 10, a: 1, q: 'Hur rengör jag exspirationskassetten?' },
    { d: 'aer5', k: 'other', n: 6, a: 0, q: 'Vilket slangset passar barn under 10 kg?' }
  ];

  const stats = {
    questions,
    /* Slumpvariation per dag (äldst först) och fördelning över dygnets timmar. */
    jitter: [0.92, 1.08, 0.85, 1.12, 0.97, 1.03, 0.9, 1.15, 0.95, 1.02, 0.88, 1.1, 1.0, 0.93, 1.07, 0.96, 1.13, 0.89, 1.04, 0.98, 1.09, 0.91, 1.05, 1.0, 0.94, 1.12, 0.97, 1.06, 0.9, 1.08],
    weekday: [0.78, 1.1, 1.14, 1.08, 1.12, 1.05, 0.73], /* sön, mån ... lör */
    hours: [14, 16, 19, 22, 15, 12, 17, 27, 24, 18, 15, 13, 11, 14, 19, 16, 13, 12, 14, 17, 19, 23, 22, 20],
    fbUp: 187, fbDown: 9, mtEscalated: 21,
    recent: [
      { da: 0, hm: '03:14', d: 'vac20', k: 'alarm', st: 'ok', q: 'Vad betyder F5?', fb: 1, mt: 1 },
      { da: 0, hm: '02:41', d: 'flow300', k: 'alarm', st: 'ok', q: 'E-23', fb: 1 },
      { da: 0, hm: '01:07', d: 'aer5', k: 'other', st: 'ok', q: 'Hur kalibrerar jag syrgascellen?', fb: 0 },
      { da: 1, hm: '23:52', d: 'vistam5', k: 'clean', st: 'ok', q: 'Vilket medel får jag torka skärmen med?', fb: 1 },
      { da: 1, hm: '22:18', d: 'flow300', k: 'other', st: 'avvisad', q: 'Vilken hastighet ska jag ställa in?', fb: 0 },
      { da: 1, hm: '16:30', d: 'arc200', k: 'other', st: 'saknas', q: 'Hur byter jag säkring?', fb: -1 },
      { da: 1, hm: '14:05', d: 'vac20', k: 'start', st: 'ok', q: 'Hur gör jag funktionskontrollen?', fb: 1 },
      { da: 1, hm: '07:22', d: 'aer5', k: 'start', st: 'ok', q: 'Hur gör jag kontroll före användning?', fb: 1 },
      { da: 2, hm: '21:15', d: 'vistam5', k: 'clean', st: 'ok', q: 'Kan jag torka skärmen med klorin?', fb: -1 },
      { da: 2, hm: '19:40', d: 'flow300', k: 'start', st: 'ok', q: 'Hur fyller jag aggregatet?', fb: 1 },
      { da: 2, hm: '04:33', d: 'vistam5', k: 'alarm', st: 'ok', q: 'T-112', fb: 0 },
      { da: 3, hm: '15:12', d: 'aer5', k: 'other', st: 'saknas', q: 'Vilket slangset passar barn under 10 kg?', fb: 0 },
      { da: 3, hm: '11:48', d: 'arc200', k: 'alarm', st: 'ok', q: 'Varför lyser REM-indikatorn rött?', fb: 1 },
      { da: 4, hm: '02:05', d: 'vac20', k: 'other', st: 'saknas', q: 'Var beställer jag nya uppsamlingskärl?', fb: 0 },
      { da: 4, hm: '09:30', d: 'vistam5', k: 'other', st: 'saknas', q: 'Hur kopplar jag in en extern skärm?', fb: 0 }
    ],
    audit: [
      { da: 0, hm: '03:12', type: 'report', d: 'vac20', text: 'Felanmälan skapad, felkod F5. Enheten tagen ur drift.' },
      { da: 2, hm: '16:45', type: 'card', d: 'arc200', text: 'Snabbkort skapat från Edition B. Väntar på granskning.' },
      { da: 3, hm: '09:10', type: 'flag', d: 'arc200', text: 'Flaggat svar åtgärdat av ansvarig.' },
      { da: 6, hm: '08:30', type: 'report', d: 'flow300', text: 'Felanmälan avslutad. Lånepump utlämnad.' },
      { da: 9, hm: '14:30', type: 'tip', d: 'aer5', text: 'Lokalt tips godkänt.' },
      { da: 9, hm: '14:25', type: 'card', d: 'aer5', text: 'Snabbkort godkänt för utskrift.' },
      { da: 12, hm: '13:15', type: 'manual', d: 'aer5', text: 'Ny manualversion: Version 2.1 ersätter Version 2.0. Larmregister och snabbkort nollställda.' },
      { da: 41, hm: '10:20', type: 'manual', d: 'flow300', text: 'Ny manualversion: Rev D ersätter Rev C.' }
    ]
  };

  window.LOTSA_DEMO = { devices, manuals, tips, flags, reports, stats };
})();
