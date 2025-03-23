
# NoSQL Database with SQLite (Custom Implementation)

Bu proje, SQLite kullanarak basit bir **NoSQL tarzı veritabanı** sunar. MongoDB'ye benzer şekilde, veriler JSON formatında saklanır ve her veri benzersiz bir `_id` ile kaydedilir. Bu veritabanı, `insertOne`, `find`, `findOne`, `createCollection` gibi MongoDB tarzı temel işlevleri destekler.

## İçindekiler

- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
  - [Veritabanı Bağlantısı](#veritabanı-bağlantısı)
  - [Koleksiyon (Collection) Oluşturma](#koleksiyon-collection-olusturma)
  - [Veri Ekleme (insertOne)](#veri-ekleme-insertone)
  - [Veri Arama (find ve findOne)](#veri-arama-find-ve-findone)
  - [Veritabanını Kapatma (close)](#veritabani-kapatma-close)
- [API Fonksiyonları](#api-fonksiyonları)
  - [createCollection](#createcollection)
  - [insertOne](#insertone)
  - [find](#find)
  - [findOne](#findone)
  - [close](#close)
- [Test](#test)

## Kurulum

1. **Node.js'i Yükleyin**  
   Bu projeyi çalıştırmak için bilgisayarınızda [Node.js](https://nodejs.org/) yüklü olmalıdır. Node.js'i indirin ve kurun.

2. **Gerekli Paketleri Yükleyin**  
   Projenin kök dizininde terminal açarak aşağıdaki komutu çalıştırın:
   ```bash
   npm install
   ```

   Bu, gerekli tüm bağımlılıkları (SQLite3 ve UUID) yükleyecektir.

## Kullanım

### Veritabanı Bağlantısı

Veritabanına bağlantı kurmak için aşağıdaki kodu kullanabilirsiniz:

```javascript
const NoSQLDB = require("./database");
const db = new NoSQLDB();
```

Veritabanı başarıyla bağlanacak ve `"✅ Database connected."` mesajını terminalde göreceksiniz.

### Koleksiyon (Collection) Oluşturma

Yeni bir koleksiyon oluşturmak için:

```javascript
await db.createCollection("users");
```

Eğer koleksiyon zaten varsa, tekrar oluşturulmaz.

### Veri Ekleme (insertOne)

Yeni bir veri eklemek için `insertOne` fonksiyonunu kullanabilirsiniz:

```javascript
await db.insertOne("users", { name: "Ali", age: 25, gender: "M" });
```

Bu işlem veriye benzersiz bir `_id` ekler ve veriyi koleksiyona kaydeder.

### Veri Arama (find ve findOne)

- **Tüm verileri çekmek için:**

```javascript
const users = await db.find("users");
console.log(users); // Tüm kullanıcıları listele
```

- **Belirli bir veriyi aramak için:**

```javascript
const user = await db.findOne("users", { name: "Ali" });
console.log(user); // 'Ali' adındaki kullanıcıyı getir
```

`find` fonksiyonu tüm verileri dönerken, `findOne` sadece ilk eşleşen veriyi döner.

### Veritabanını Kapatma (close)

Veritabanını kapatmak için:

```javascript
db.close();
```

Bu fonksiyon veritabanı bağlantısını kapatır ve uygulamayı sonlandırır.

## API Fonksiyonları

### `createCollection(name)`
Yeni bir koleksiyon oluşturur.

- **Parametreler:**
  - `name` (String): Oluşturulacak koleksiyon adı.

- **Örnek:**
  ```javascript
  await db.createCollection("users");
  ```

### `insertOne(collection, data)`
Veri eklerken benzersiz bir `_id` oluşturur ve JSON verisini ekler.

- **Parametreler:**
  - `collection` (String): Veri eklenecek koleksiyon adı.
  - `data` (Object): Eklenecek JSON verisi.

- **Örnek:**
  ```javascript
  await db.insertOne("users", { name: "Ali", age: 25, gender: "M" });
  ```

- **Dönen Değer:**
  `{ _id, ...data }` : Ekleme işlemi sonrası yeni veriyi döner.

### `find(collection, filter)`
Bir koleksiyondaki tüm verileri arar. `filter` parametresi ile filtreleme yapılabilir.

- **Parametreler:**
  - `collection` (String): Veri aranacak koleksiyon adı.
  - `filter` (Object): Arama kriteri.

- **Örnek:**
  ```javascript
  const users = await db.find("users", { name: "Ali" });
  console.log(users); // Ali'yi bulur
  ```

- **Dönen Değer:**
  `Array`: Filtrelenen verilerin listesi.

### `findOne(collection, filter)`
Bir koleksiyondaki ilk veriyi arar.

- **Parametreler:**
  - `collection` (String): Veri aranacak koleksiyon adı.
  - `filter` (Object): Arama kriteri.

- **Örnek:**
  ```javascript
  const user = await db.findOne("users", { name: "Ali" });
  console.log(user); // Ali'yi bulur
  ```

- **Dönen Değer:**
  `Object`: İlk eşleşen veriyi döner.

### `close()`
Veritabanı bağlantısını kapatır ve uygulamayı sonlandırır.

- **Örnek:**
  ```javascript
  db.close();
  ```

## Test

Aşağıda, projeyi test etmek için örnek bir `index.js` dosyası verilmiştir:

```javascript
const NoSQLDB = require("./database");
const db = new NoSQLDB();

async function main() {
    console.log(await db.createCollection("users"));

    // Veriyi eklerken benzersiz _id'ler oluşturulacak
    console.log(await db.insertOne("users", { name: "Ali", age: 25, gender: "M" }));
    console.log(await db.insertOne("users", { name: "Veli", age: 30, gender: "M" }));
    console.log(await db.insertOne("users", { name: "Ayşe", age: 22, gender: "F" }));

    console.log("📜 Tüm kullanıcılar:", await db.find("users"));
    console.log("🔍 Ali'yi bul:", await db.findOne("users", { name: "Ali" }));

    db.close();
}

main();
```

---

### **Proje Hakkında**
Bu proje, SQLite tabanlı bir NoSQL veritabanı mimarisi sunar. MongoDB gibi NoSQL veritabanlarının esnekliğini arayanlar için ideal bir çözümdür. Veritabanına eklenen her veri benzersiz bir `_id` ile ilişkilendirilir ve JSON formatında saklanır.
