import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => { //do I need to add the key "id" here as a parameter as shown in activity 24 or remove it from the content below? For now, I'll remove id.
  console.log('PUT to the database');
  const jateDb = await openDB('jate', 1); //opens or creates database "jate" for reading and writing and assigns the instance to jateDb; do I increment this for future writes, or does IndexedDB do that automatically?
  const tx = jateDb.transaction('jate', 'readwrite'); //starts a transaction on the jate objectStore (table)
  const store = tx.objectStore('jate'); //accesses the table called "jate" within the transaction
  const request = store.add({ jate: content }); //insert data for the key "jate"into the objectStore; I had "id: 1", but that kept writing to the same ID and overwriting what was there
  const result = await request;
  console.log('Data saved to the database', result);
}

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const request = store.getAll();
  const result = await request;
  console.log('Data retrieved from the database', result);
}

initdb();