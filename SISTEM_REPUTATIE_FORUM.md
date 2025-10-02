# 🎣 Sistem de Reputație Fish Trophy Forum

## 📋 **OVERVIEW**
Sistem complex de reputație pentru Fish Trophy Forum, bazat pe respectul și ajutorul între pescari.

## 🏆 **SISTEMUL DE "RESPECT" (nu reputație)**

### **Denumire:** "RESPECT PESCAR" 
- **Pozitiv:** "Respect câștigat"
- **Negativ:** "Respect pierdut"
- **Acțiuni:** "Oferă respect" / "Retrage respect"

### **Iconițe:**
- 🎣 **Respect pozitiv** (verde)
- ⚓ **Respect negativ** (roșu)
- 🐟 **Respect neutru** (gri)

## 👥 **RANGURI BAZATE PE VECHIME (nu postări)**

### **5-10 Ranguri după vechime:**
1. 🆕 **Pescar Nou** - 0-1 lună
2. 🎣 **Pescar Activ** - 1-3 luni
3. 🐟 **Pescar Experimentat** - 3-6 luni
4. 🏆 **Pescar Veteran** - 6-12 luni
5. 👑 **Pescar Senior** - 1-2 ani
6. 🌟 **Pescar Elite** - 2-3 ani
7. 💎 **Maestru Pescar** - 3+ ani
8. 🔥 **Legendă** - 5+ ani (rang special)

### **Ranguri Speciale (nu se schimbă):**
- 🔴 **Administrator** - Fish Trophy Team
- 🟣 **Moderator** - Staff forum
- 🟡 **VIP Member** - Membru premium

## 🎯 **SISTEMUL DE RESPECT DETALIAT**

### **Reguli de Acordare:**
- **Utilizatori noi:** Nu pot da/lua respect până nu au:
  - ✅ Minim 1 punct respect pozitiv primit
  - ✅ Minim 10 postări pe forum
- **Utilizatori normali:** 1 punct respect per acțiune
- **Utilizatori cu respect mare (50+):** Pot da/lua 2-3 puncte
- **Moderatori:** Pot da/lua 5 puncte
- **Administrator:** Control total - poate modifica/anula orice

### **Puterea de Respect (bazată pe respectul acumulat):**
```
0-10 respect: 1 punct per acțiune
11-25 respect: 1 punct per acțiune  
26-50 respect: 2 puncte per acțiune
51-100 respect: 3 puncte per acțiune
100+ respect: 4 puncte per acțiune
Moderator: 5 puncte per acțiune
Administrator: Nelimitat
```

### **Comentarii la Respect:**
- **Obligatoriu** când dai/iei respect
- **Maxim 200 caractere**
- **Se afișează** pe profilul utilizatorului
- **Istoric complet** - cine, când, ce comentariu

## 🖼️ **DESIGN MESAJE (ca în SS3)**

### **Container Mesaje:**
- **Lățime:** Identică cu containerul forum homepage (1200px)
- **Chenar:** Border bine definit pentru fiecare mesaj
- **Spațiere:** Gap între mesaje pentru claritate

### **Layout Mesaj:**
```
┌─────────────────────────────────────────────────────┐
│ [Avatar] [Nume] [Rang Vechime]          [Data/Ora]  │
│          [Respect: +45] [Echipament ▼]              │
│                                                     │
│ Conținutul mesajului aici...                       │
│                                                     │
│ [🎣 +2] [⚓ -1] [💬 Răspunde] [📎 Citează]          │
└─────────────────────────────────────────────────────┘
```

### **Sub Avatar și Nume:**
1. **Rang vechime** (nu după postări)
2. **Respect total** (ex: "Respect: +45")
3. **Echipament preview** cu buton "Vezi mai mult ▼"
4. **Link la profil** complet

## 👀 **VIZUALIZATORI ACTIVI**

### **Bottom Page Display:**
```
📍 Vizualizează acest topic:
👤 PescarExpert (expert), CrapMaster (maestru), 
🔍 3 vizitatori anonimi
```

### **Logica:**
- **Membri conectați:** Nume + rang
- **Vizitatori:** Număr total anonim
- **Update real-time** (mock cu setTimeout)
- **Istoric vizualizări** pentru statistici

## 🗂️ **PROFIL UTILIZATOR COMPLET**

### **Secțiuni Profil:**
1. **Info Generale:**
   - Nume, avatar, rang vechime
   - Data înregistrării
   - Ultima activitate

2. **Statistici:**
   - Total postări
   - Respect total (+/-)
   - Topicuri create
   - Răspunsuri date

3. **Respect Primit:**
   - Lista cu cine a dat respect
   - Comentariile la respect
   - Grafic respect în timp

4. **Echipament:**
   - Lista text cu echipamentul
   - Poze echipament (opțional)
   - Review-uri echipament

5. **Recorduri Fish Trophy:**
   - Recorduri publice (dacă userul alege)
   - Capturile importante
   - Concursuri câștigate

## 🔧 **IMPLEMENTARE TEHNICĂ**

### **Database Schema Suplimentar:**
```sql
-- Tabel respect
CREATE TABLE forum_respect (
  id UUID PRIMARY KEY,
  from_user_id UUID REFERENCES auth.users(id),
  to_user_id UUID REFERENCES auth.users(id),
  points INTEGER, -- pozitiv sau negativ
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel echipament utilizatori
CREATE TABLE forum_user_equipment (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  equipment_list TEXT[], -- array cu echipament
  is_public BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel vizualizatori activi
CREATE TABLE forum_active_viewers (
  id UUID PRIMARY KEY,
  topic_id UUID REFERENCES forum_topics(id),
  user_id UUID REFERENCES auth.users(id), -- NULL pentru anonimi
  last_seen TIMESTAMP DEFAULT NOW()
);
```

### **Componente Noi de Creat:**
1. `RespectSystem.tsx` - Butoane +/- respect
2. `RespectModal.tsx` - Modal pentru comentariu
3. `UserProfile.tsx` - Profil complet utilizator
4. `ActiveViewers.tsx` - Cine vizualizează topic-ul
5. `EquipmentPreview.tsx` - Preview echipament utilizator
6. `MessageContainer.tsx` - Container mesaje cu design nou

## 🎨 **DESIGN SPECIFICAȚII**

### **Culori Respect:**
- **Pozitiv:** `#059669` (verde Fish Trophy)
- **Negativ:** `#dc2626` (roșu)
- **Neutru:** `#6b7280` (gri)

### **Iconițe Acțiuni:**
- 🎣 **Oferă respect** (hover: verde)
- ⚓ **Retrage respect** (hover: roșu)
- 💬 **Răspunde** (hover: albastru)
- 📎 **Citează** (hover: portocaliu)

### **Layout Responsive:**
- **Desktop:** Layout complet cu toate elementele
- **Mobile:** Layout simplificat, respect în dropdown
- **Tablet:** Layout intermediar

## 📊 **ALGORITM RESPECT**

### **Calculul Puterii de Respect:**
```javascript
function getRespectPower(userRespect, userRank) {
  if (userRank === 'administrator') return 10;
  if (userRank === 'moderator') return 5;
  
  if (userRespect >= 100) return 4;
  if (userRespect >= 51) return 3;
  if (userRespect >= 26) return 2;
  return 1;
}
```

### **Restricții:**
- **Același user:** Nu poate da respect la propriile postări
- **Cooldown:** 1 respect per user per zi pentru același target
- **Utilizatori noi:** Blocat până la 10 postări + 1 respect primit

## 🔮 **INTEGRARE VIITOARE CU FISH TROPHY**

### **Sincronizare Date:**
- **Auth unificat** - Același cont pentru site și forum
- **Recorduri publice** - Din baza de date Fish Trophy
- **Echipament sincronizat** - Cu profilul principal
- **Statistici comune** - Activitate cross-platform

### **API Endpoints:**
```
GET /api/user/equipment - Echipamentul utilizatorului
GET /api/user/records - Recordurile publice
POST /api/forum/respect - Acordă/retrage respect
GET /api/forum/active-viewers/:topicId - Vizualizatori activi
```

## 🚀 **PRIORITATEA IMPLEMENTĂRII**

### **Faza 1 (Urgent):**
1. ✅ Alinierea iconițelor și layout-ului
2. ✅ Container mesaje cu design nou
3. ✅ Sistem respect de bază
4. ✅ Vizualizatori activi

### **Faza 2 (Săptămâna viitoare):**
1. Modal respect cu comentarii
2. Profil utilizator complet
3. Echipament preview
4. Algoritm putere respect

### **Faza 3 (Luna viitoare):**
1. Integrare cu Fish Trophy
2. Recorduri sincronizate
3. Statistici avansate
4. API real cu Supabase

---

**📌 IMPORTANT:** Sistemul de respect e CORE pentru comunitate. Trebuie implementat cu atenție maximă la detalii și user experience.

**🎯 OBIECTIV:** Să creez cea mai bună experiență de forum pentru pescarii din România!


