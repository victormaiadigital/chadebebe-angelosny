import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
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

const USUARIO_ADMIN = "victor";
const SENHA_ADMIN = "baconfrito";

const loginArea = document.getElementById("loginArea");
const painelArea = document.getElementById("painelArea");
const erroLogin = document.getElementById("erroLogin");

const btnLogin = document.getElementById("btnLogin");
const btnSair = document.getElementById("btnSair");
const btnAtualizar = document.getElementById("btnAtualizar");

// Sempre começa na tela de login
mostrarLogin();

btnLogin.addEventListener("click", fazerLogin);
btnSair.addEventListener("click", sair);
btnAtualizar.addEventListener("click", carregarConfirmados);

function mostrarLogin() {
  loginArea.style.display = "block";
  painelArea.style.display = "none";
  erroLogin.innerText = "";
}

function mostrarPainel() {
  loginArea.style.display = "none";
  painelArea.style.display = "block";
  carregarConfirmados();
}

function fazerLogin() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (usuario === USUARIO_ADMIN && senha === SENHA_ADMIN) {
    mostrarPainel();
  } else {
    erroLogin.innerText = "Usuário ou senha incorretos.";
  }
}

function sair() {
  localStorage.removeItem("adminLogado");
  sessionStorage.clear();

  document.getElementById("usuario").value = "";
  document.getElementById("senha").value = "";

  mostrarLogin();
}

async function carregarConfirmados() {
  const lista = document.getElementById("listaConfirmados");
  const total = document.getElementById("totalConfirmados");

  lista.innerHTML = "Carregando...";
  total.innerText = "Total: 0";

  try {
    const querySnapshot = await getDocs(collection(db, "confirmacoes"));

    if (querySnapshot.empty) {
      lista.innerHTML = "Nenhuma confirmação ainda.";
      total.innerText = "Total: 0";
      return;
    }

    let confirmados = [];

    querySnapshot.forEach((docItem) => {
      const data = docItem.data();

      confirmados.push({
        nome: data.nome || "Sem nome",
        presente: data.presente || "Sem presente"
      });
    });

    confirmados.sort((a, b) => a.nome.localeCompare(b.nome));

    total.innerText = `Total: ${confirmados.length}`;

    lista.innerHTML = confirmados.map((item) => `
      <div class="confirmado-card">
        <div class="nome">${item.nome}</div>
        <div class="presente">
          <strong>Vai levar:</strong> ${item.presente}
        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error("Erro ao carregar confirmados:", err);
    lista.innerHTML = "Erro ao carregar lista.";
  }
}