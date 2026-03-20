import { db } from "@/lib/firebaseAdmin";

// GET USERS
export async function getUsers() {
  try {
    const snapshot = await db.collection("users").get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      status: 200,
      data: users
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: error.message }
    };
  }
}

// CREATE USER
export async function createUser(req) {
  try {
    const body = await req.json();

    const docRef = await db.collection("users").add({
      name: body.name,
      createdAt: new Date()
    });

    return {
      status: 201,
      data: {
        id: docRef.id,
        name: body.name
      }
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: error.message }
    };
  }
}