import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsg8LsN-pzRWDLEItPR1ckpS0QST_lm4E",
  authDomain: "chadebebe-angel-osny.firebaseapp.com",
  projectId: "chadebebe-angel-osny",
  storageBucket: "chadebebe-angel-osny.appspot.com",
  messagingSenderId: "879653744309",
  appId: "1:879653744309:web:022f602ba03a591b8698fc"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

console.log("JS carregado com sucesso");

window.confirmar = async function () {

  try {

    const nomeSelect = document.getElementById("nome");

    const nome = nomeSelect.value;

    const resultado = document.getElementById("resultado");

    console.log("Botão clicado:", nome);

    // VALIDAÇÃO
    if (!nome) {

      resultado.innerText = "Selecione seu nome!";

      return;
    }

    // VERIFICAR DUPLICIDADE
    const q = query(
      collection(db, "confirmacoes"),
      where("nome", "==", nome)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {

      resultado.innerText =
        `${nome}, sua presença já foi confirmada.`;

      return;
    }

    // PEGAR PRESENTES
    const querySnapshot =
      await getDocs(collection(db, "presentes"));

    let candidatos = [];

    querySnapshot.forEach((item) => {

      const data = item.data();

      if ((data.quantidade ?? 0) > 0) {

        candidatos.push({
          id: item.id,
          nome: data.nome,
          quantidade: data.quantidade
        });
      }
    });

    // SEM PRESENTES
    if (candidatos.length === 0) {

      resultado.innerText =
        "Não há mais presentes disponíveis!";

      return;
    }

    // SORTEIO
    const escolhido =
      candidatos[Math.floor(Math.random() * candidatos.length)];

    // SALVAR CONFIRMAÇÃO
    await addDoc(collection(db, "confirmacoes"), {

      nome: nome,

      presente: escolhido.nome,

      criadoEm: serverTimestamp()
    });

    // DIMINUIR QUANTIDADE
    const novoValor = escolhido.quantidade - 1;

    if (novoValor > 0) {

      await updateDoc(
        doc(db, "presentes", escolhido.id),
        {
          quantidade: novoValor
        }
      );

    } else {

      await deleteDoc(
        doc(db, "presentes", escolhido.id)
      );
    }

    // RESULTADO
    resultado.innerHTML = `
      ${nome}, você deve levar:<br>
      <strong>${escolhido.nome}</strong>
    `;

  } catch (err) {

    console.error("Erro no confirmar:", err);

    document.getElementById("resultado").innerText =
      "Erro ao processar. Veja o console.";
  }
};