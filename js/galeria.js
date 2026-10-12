import { db } from "./firebase.js";
import { collection, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const gridGaleria = document.querySelector(".galeria-grid");

// Escuta alterações em tempo real
onSnapshot(
  collection(db, "galeria"),
  (snapshot) => {
    gridGaleria.innerHTML = "";

    if (snapshot.empty) {
      gridGaleria.innerHTML = `
        <div class="card-galeria">
          <div class="placeholder-conteudo">
            <div class="camera">📷</div>
            <h3>Em breve</h3>
            <p>Novos trabalhos serão publicados aqui.</p>
          </div>
        </div>
      `;
      return;
    }

    const fotos = snapshot.docs.map(doc => doc.data());
    fotos.reverse();

    fotos.forEach(foto => {
      gridGaleria.innerHTML += `
        <div class="card-galeria">
          <img src="${foto.imagem}" alt="${foto.titulo}" style="width:100%; height:100%; object-fit:cover; border-radius:20px;">
        </div>
      `;
    });
  },
  (erro) => {
    console.error("Erro ao carregar galeria:", erro);
    gridGaleria.innerHTML = `<p style="text-align:center;color:#D4AF37;">Não foi possível carregar as fotos.</p>`;
  }
);