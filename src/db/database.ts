import { MongoClient } from "mongodb"
import * as dotenv from "dotenv"

dotenv.config()
const uri =
  "mongodb+srv://widholmtim:<db_password>@grademaster.kvgxi.mongodb.net/?retryWrites=true&w=majority&appName=grademaster" // Deine MongoDB-Verbindungs-URL
const client = new MongoClient(uri)

export const connectToDatabase = async (dbName: string) => {
  try {
    await client.connect()
    console.log("Erfolgreich mit MongoDB verbunden")
    const db = client.db(dbName)
    return db
  } catch (error) {
    console.error("Fehler beim Verbinden mit MongoDB:", error)
    throw error
  }
}

export const disconnectDatabase = async () => {
  try {
    await client.close()
    console.log("Verbindung zu MongoDB geschlossen")
  } catch (error) {
    console.error("Fehler beim Schließen der Verbindung:", error)
    throw error
  }
}
