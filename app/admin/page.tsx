"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

// Adjust these paths depending on where your file is!
import { db } from "../../config/firebase";
import { useAuth } from "../context/AuthContext";

// Define the shape of our user data
type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  creationTime: string;
};

export default function AdminDashboard() {
  // --- AUTH & ROLE STATE ---
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  // --- DATA STATE ---
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // 1. Verify Admin Role
  useEffect(() => {
    const verifyAdmin = async () => {
      // 1. If no user object exists at all, kick to login
      if (!user) {
        console.log("Bouncer: No user logged in. Kicking to /login");
        return;
      }

      // 2. HERE IS THE NEW LINE! We create a bulletproof ID.
      // (It checks for uid first, and if that is empty, grabs id)
      const userId = user.uid || user.id;
      console.log("Bouncer: Bulletproof ID is:", userId);

      // 3. Now we safely ask Firestore for the document
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        
        console.log("Bouncer: Does the database document exist?", userDoc.exists());
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Bouncer: The user's role in the database is:", userData.role);
          
          if (userData.role === "admin") {
            console.log("Bouncer: Access Granted! Opening doors...");
            setIsAdmin(true);
          } else {
            console.log("Bouncer: Access Denied! Role is not 'admin'. Kicking to /");
            router.push("/");
          }
        } else {
          console.log("Bouncer: Access Denied! Could not find a document for this user. Kicking to /");
          router.push("/");
        }
      } catch (error) {
        console.error("Bouncer: CRITICAL ERROR fetching from Firestore:", error);
        router.push("/");
      } finally {
        setCheckingRole(false);
      }
    };

    verifyAdmin();
  }, [user, router]);

  // 2. Fetch the Data (ONLY if they are confirmed as an Admin)
  useEffect(() => {
    // If they aren't an admin, don't bother fetching the data
    if (!isAdmin) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        
        if (response.ok) {
          setUsers(data.users); 
        } else {
          console.error("Failed to fetch:", data.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isAdmin]); // This useEffect triggers as soon as isAdmin becomes true!

  // 3. Render the Bouncer Loading Screen
  if (checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
        <p className="text-xl font-bold animate-pulse">Verifying Admin Access...</p>
      </div>
    );
  }

  // 4. Render Nothing if being redirected (prevents dashboard flash)
  if (!isAdmin) return null;

const handleDeleteUser = async (userIdToDelete) => {
    // Add a safety check so you don't accidentally click it!
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userIdToDelete }),
      });

      if (response.ok) {
        // Update the screen instantly by filtering the deleted user out of your state
        setUsers(users.filter((u) => u.uid !== userIdToDelete));
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user. Check console for details.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // 5. Render the actual Admin Dashboard
  return (
    <div className="p-8 min-h-screen bg-gray-50 text-black">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard: User Management</h1>

      {loadingUsers ? (
        <p>Loading users...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b bg-gray-800 text-white font-medium">
              <tr>
                <th className="px-6 py-4">UID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{u.uid}</td>
                  <td className="px-6 py-4 font-semibold">{u.displayName}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{new Date(u.creationTime).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDeleteUser(u.uid)}
                      className="text-red-500 hover:text-red-700 font-bold transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <p className="p-6 text-center text-gray-500">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}