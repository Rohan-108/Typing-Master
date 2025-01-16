import myApp from "../app.js";
import { openDB } from "https://cdn.jsdelivr.net/npm/idb@8/+esm";
myApp.factory("DbService", [
  "toaster",
  function (toaster) {
    const DbService = {};
    const dbName = "typingDB";
    const version = 1;

    //open the database
    DbService.openDatabase = async function () {
      try {
        const db = await openDB(dbName, version, {
          upgrade(db) {
            if (!db.objectStoreNames.contains("users")) {
              const userStore = db.createObjectStore("users", {
                keyPath: "id",
                autoIncrement: true,
              });
              userStore.createIndex("email", "email", { unique: true });
            }
            if (!db.objectStoreNames.contains("analytics")) {
              const analytics = db.createObjectStore("analytics", {
                keyPath: "id",
                autoIncrement: true,
              });
              analytics.createIndex("email", "email", { unique: false });
            }
          },
        });
        return db;
      } catch (error) {
        toaster.pop("error", "Error", "Failed to open database");
        throw error;
      }
    };
    //add item to the database
    DbService.addItem = async function (storeName, data) {
      try {
        const db = await DbService.openDatabase();
        const tx = db.transaction(storeName, "readwrite");
        const id = await tx.store.add(data);
        await tx.done;
        db.close();
        return id;
      } catch (error) {
        toaster.pop("error", "Error", "Failed to add item");
        throw error;
      }
    };
    //get item from the database
    DbService.getItem = async function (storeName, id) {
      try {
        const db = await DbService.openDatabase();
        const tx = db.transaction(storeName, "readonly");
        const item = await tx.store.get(id);
        await tx.done;
        db.close();
        return item;
      } catch (error) {
        toaster.pop("error", "Error", "Failed to get item");
        throw error;
      }
    };
    //get all items from the database
    DbService.getAllItems = async function (storeName) {
      try {
        const db = await DbService.openDatabase();
        const tx = db.transaction(storeName, "readonly");
        const items = await tx.store.getAll();
        await tx.done;
        db.close();
        return items;
      } catch (error) {
        toaster.pop("error", "Error", "Failed to get all items");
        throw error;
      }
    };
    //delete item from the database
    DbService.deleteItem = async function (storeName, id) {
      try {
        const db = await DbService.openDatabase();
        const tx = db.transaction(storeName, "readwrite");
        await tx.store.delete(id);
        db.close();
        await tx.done;
      } catch (error) {
        toaster.pop("error", "Error", "Failed to delete item");
        throw error;
      }
    };
    //search item from the database using primay key
    DbService.searchItemByIndex = async function (storeName, indexName, key) {
      try {
        const db = await DbService.openDatabase();
        const tx = db.transaction(storeName, "readonly");
        const index = tx.store.index(indexName);
        const item = await index.get(key);
        await tx.done;
        db.close();
        return item;
      } catch (error) {
        toaster.pop("error", "Error", "Failed to search item");
        throw error;
      }
    };

    DbService.getAnalytics = async function (storeName, email, days) {
      try {
        const time = new Date().getTime() - days * 24 * 60 * 60 * 1000; //get the time of last seven days
        const db = await DbService.openDatabase();
        const tx = db.transaction(storeName, "readonly");
        const index = tx.store.index("email");
        const items = await index.getAll(email);
        const data = items.filter((record) => record.timestamp >= time); //filter the last seven days data
        await tx.done;
        db.close();
        return data;
      } catch (error) {
        toaster.pop(
          "error",
          "Error",
          `Failed to get last ${days} days analytics`
        );
        throw error;
      }
    };
    return DbService;
  },
]);
