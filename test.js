import { db } from "./firebase.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const btn = document.getElementById("addBtn");

btn.addEventListener("click", async () => {
  console.log("KLIK FUNGUJE");

  await addDoc(collection(db, "tasks"), {
    text: "FUNKČNÍ TEST",
    createdAt: serverTimestamp()
  });

  console.log("ULOŽENO");
});
