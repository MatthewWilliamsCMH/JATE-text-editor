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

// TODO: Add logic to a method that accepts some content and adds it to the database; adapted and annotated from activity 24
export const putDb = async (content) => console.error('putDb not implemented'); //do i need to add the key "id" here as a parameter or remove it from the content below? For now, I'll remove id.
console.log('PUT to the database');
const jateDb = await openDB('jate', 1); //opens or creates the database "jate" for reading and writing and assigns the instance to jateDb
const tx = jateDb.transaction('jate', 'readwrite'); //starts a transaction on the jate objectStore (table)
const store = tx.objectStore('jate'); //accesses the table called "jate" within the transaction
// const request = store.put({ id: id, jate: content }); //insert data for the keys id and jate into the objectStore; removed id
const request = store.put({ jate: content }); //insert data for the keys id and jate into the objectStore
const result = await request;
console.log('Data saved to the database', result);

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => console.error('getDb not implemented');
const jateDb = await openDB('jate'); //do I need a "2" here for the version?
const tx = jateDb.transaction('jate', 'readonly');
const store = tx.objectStore('jate');
const request = store.get({ jate: content});
const result = await request;
console.log('Data retrieved from the database', result);

initdb();


