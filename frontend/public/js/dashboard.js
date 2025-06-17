function chargerNomCapteur(suffix = "") {
  const capteurId = localStorage.getItem(`capteurId${suffix}`);
  if (capteurId) {
    fetch(`http://localhost:3000/api/sensors/${capteurId}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            console.warn(`Capteur introuvable : ${capteurId} — suppression de localStorage`);
            localStorage.removeItem(`capteurId${suffix}`);
            afficherMessage("Capteur inexistant supprimé (local)", "red", suffix);
          }
          throw new Error(`Erreur HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data.name) {
          const champNom = document.getElementById(`champNomCapteur${suffix}`);
          const nomActuel = document.getElementById(`nomActuelCapteur${suffix}`);
          if (champNom) champNom.value = data.name;
          if (nomActuel) nomActuel.textContent = data.name;
        }
      })
      .catch(err => {
        console.error(`Erreur chargement nom capteur (${suffix}):`, err);
        afficherMessage("Erreur chargement nom.", "red", suffix);
      });
  }
}

async function modifierNomCapteur(type = "") {
  const capteurId = localStorage.getItem(`capteurId${type}`);
  if (!capteurId || capteurId === "undefined") return;
  const nouveauNom = document.getElementById(`champNomCapteur${type}`).value.trim();

  if (!capteurId) return afficherMessage("Aucun capteur sélectionné.", "red", type);
  if (!nouveauNom) return afficherMessage("Le nom ne peut pas être vide.", "red", type);

  try {
    const res = await fetch(`http://localhost:3000/api/sensors/${capteurId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nouveauNom }),
    });

    if (res.ok) {
      afficherMessage(" Nom mis à jour.", "white", type);
      document.getElementById(`nomActuelCapteur${type}`).textContent = nouveauNom;
    } else {
      const data = await res.json();
      afficherMessage(" Erreur : " + (data.message || data.error), "red", type);
    }
  } catch (err) {
    afficherMessage(" Erreur de connexion.", "red", type);
    console.error(err);
  }
}

function afficherMessage(text, color, type = "") {
  const msg = document.getElementById(`messageNomCapteur${type}`);
  if (msg) {
    msg.textContent = text;
    msg.style.color = color;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await chargerInfosUtilisateur();
  const nomUtilisateur = localStorage.getItem("firstname");
  if (nomUtilisateur) {
    document.getElementById("nomUtilisateur").textContent = nomUtilisateur;
    document.getElementById("bienvenueMessage").textContent = `Bienvenue ${nomUtilisateur}`;
  }

  // Vérifie les capteurs
  await verifierEtNettoyerCapteurId("");
  await verifierEtNettoyerCapteurId("Hum");
  await verifierEtNettoyerCapteurId("Move");

  // Ajout listeners sur les boutons
  const toggles = [
    { id: "btnToggleTableau", suffix: "", nom: "Température", unit: "°C", typeRequis: "temperature" },
    { id: "btnToggleHum", suffix: "Hum", nom: "Humidité", unit: "%", typeRequis: "humidity" },
    { id: "btnToggleMove", suffix: "Move", nom: "Mouvement", unit: "", typeRequis: "motion" },
  ];

  toggles.forEach(({ id, suffix, nom, unit, typeRequis }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => handleToggle(suffix, nom, unit, typeRequis));
    }
  });

  // Mise à jour régulière des mesures pour tous les capteurs
  setInterval(() => {
    ["", "Hum", "Move"].forEach(suffix => {
      const unit = suffix === "Hum" ? "%" : suffix === "" ? "°C" : "";
      const capteurId = localStorage.getItem(`capteurId${suffix}`);
      if (capteurId && capteurId !== "undefined") {
        chargerMesuresParCapteur(suffix, unit);
      }
    });
  }, 5000);

  // Mouvement : détection une seule fois par timestamp
  let dernierTimestampMouvement = null;
  setInterval(async () => {
    const suffix = "Move";
    const capteurId = localStorage.getItem(`capteurId${suffix}`);
    if (!capteurId || capteurId === "undefined") return;

    try {
      const res = await fetch(`http://localhost:3000/api/measurements/latest/sensorId/${capteurId}`);
      const mesure = await res.json();

      if (!mesure || typeof mesure !== "object" || mesure.message) {
        console.warn("Aucune mesure disponible :", mesure);
        return;
      }

      const dateBrute = mesure.takeAt || mesure.createdAt || mesure.date;
      const dateObj = new Date(dateBrute);
      if (isNaN(dateObj.getTime())) {
        console.warn("Date de mesure invalide :", dateBrute, mesure);
        return;
      }

      const dateMesure = dateObj.toISOString();
      if ((mesure.value === true || mesure.value === 1) && dateMesure !== dernierTimestampMouvement) {
        await chargerDerniereMesureParCapteur(suffix);
        console.log("Mouvement détecté !");
        dernierTimestampMouvement = dateMesure;
      }

    } catch (err) {
      console.error("Erreur vérification mouvement :", err);
    }
  }, 5000);

  // Déconnexion
  document.getElementById("btnDeconnexion").addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.clear();
      window.location.href = "index.html";
    }
  });

  // Onglets verticaux
  document.querySelectorAll('.tab-button-vertical').forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-tab');
      document.querySelectorAll('.tab-button-vertical').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  // Bouton graphique humidité
  document.getElementById("btnAfficherGraphHum").addEventListener("click", () => {
    window.open("graphique_humidite.html", "_blank");
  });
});
async function chargerMesuresParCapteur(suffix = "", unit = "") {
  const capteurId = localStorage.getItem(`capteurId${suffix}`);
  if (!capteurId) return;

  try {
    const res = await fetch(`http://localhost:3000/api/measurements/sensorId/${capteurId}`);
    let mesures = await res.json(); // 

    const effacementTimestamp = localStorage.getItem(`effacementTimestamp${suffix}`);
    if (effacementTimestamp) {
      mesures = mesures.filter(m =>
        new Date(m.takeAt || m.createdAt || m.date) > new Date(effacementTimestamp)
      );
    }
    console.log(`Mesures pour capteur ${suffix} :`, mesures);

    const tbody = document.querySelector(`#table-mesures-${suffix.toLowerCase() || "temp"} tbody`);
    if (!tbody) return;

    tbody.innerHTML = '';

    mesures.slice(-10).reverse().forEach(m => {
      const date = new Date(m.takeAt || m.createdAt || m.date).toLocaleString();
      let valeur = m.value;

      if (suffix === "Move") {
        valeur = valeur ? "Mouvement" : "Aucun";
      } else if (unit) {
        valeur += ` ${unit}`;
      }


  const row = document.createElement('tr');

  const tdDate = document.createElement('td');
  tdDate.textContent = date;

  const tdValeur = document.createElement('td');
  tdValeur.textContent = valeur;

  if (suffix === "Hum" && parseFloat(m.value) > 50) {
    tdValeur.style.color = "red";
  }

  row.appendChild(tdDate);
  row.appendChild(tdValeur);
  tbody.appendChild(row);
    });

  } catch (err) {
    console.error(`Erreur chargement mesures capteur ${suffix}:`, err);
  }
}



function effacerMesures(suffix = "") {
  const tableId = `table-mesures-${suffix.toLowerCase() || "temp"}`;
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (tbody) tbody.innerHTML = '';

  // Enregistre un timestamp pour filtrer les futures mesures
  const now = new Date().toISOString();
  localStorage.setItem(`effacementTimestamp${suffix}`, now);

  fetch('/effacer', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      console.log("Mesures effacées :", data);
    })
    .catch(err => console.error("Erreur effacement :", err));
}


async function handleToggle(suffix = "", nom = "Capteur", unite = "", typeRequis = "") {
  const contenu = document.getElementById(`contenuTableau${suffix}`);
  const bouton = document.getElementById(`btnToggle${suffix || "Tableau"}`);
  const estOuvert = !contenu.classList.contains("replié");

  const storageKey = `capteurId${suffix}`;
  let capteurId = localStorage.getItem(storageKey);

  // Nettoyage si capteurId invalide
  if (!capteurId || capteurId === "undefined" || capteurId.trim() === "") {
    capteurId = null;
    localStorage.removeItem(storageKey);
  }

  if (estOuvert) {
    contenu.classList.add("replié");
    bouton.textContent = `▼ Activer le capteur ${nom}`;
    await supprimerCapteur(suffix);
    return;
  }

  contenu.classList.remove("replié");
  bouton.textContent = "✕";

  const userId = localStorage.getItem("userId");
  if (!userId) {
    afficherMessage("Utilisateur non identifié. Veuillez vous reconnecter.", "red", suffix);
    return;
  }

  // Si capteur n'existe pas, le créer
  if (!capteurId) {
    const nomParDefaut = `Capteur ${nom}`;
    try {
      const payload = { name: nomParDefaut, type: typeRequis, userId };
      if (unite && unite.trim() !== "") payload.unit = unite;

      const res = await fetch("http://localhost:3000/api/sensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        capteurId = data._id;
        localStorage.setItem(storageKey, capteurId);
        document.getElementById(`nomActuelCapteur${suffix}`).textContent = data.name;
        document.getElementById(`champNomCapteur${suffix}`).value = data.name;
        afficherMessage("Capteur créé avec succès", "white", suffix);
      } else {
        afficherMessage("Erreur : " + (data.message || data.error), "red", suffix);
        return;
      }
    } catch (err) {
      console.error("Erreur création capteur :", err);
      afficherMessage("Erreur de connexion.", "red", suffix);
      return;
    }
  }

  // Charger les mesures uniquement si un capteurId est bien valide
  if (capteurId) {
    await chargerMesuresParCapteur(suffix, unite);
  }
}

async function supprimerCapteur(type = "") {
  const suffix = type || "";
  const capteurId = localStorage.getItem(`capteurId${suffix}`);
  if (!capteurId || capteurId === "undefined" || capteurId.trim() === "") {
    afficherMessage("Aucun capteur à supprimer.", "red", suffix);
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/sensors/${capteurId}`, {
      method: "DELETE"
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.removeItem(`capteurId${suffix}`);
      document.getElementById(`nomActuelCapteur${suffix}`).textContent = "–";
      document.getElementById(`champNomCapteur${suffix}`).value = "";
      afficherMessage(" Capteur supprimé avec succès", "white", suffix);
    } else {
      afficherMessage(" Erreur : " + (data.message || data.error), "red", suffix);
    }
  } catch (err) {
    console.error("Erreur suppression capteur :", err);
    afficherMessage(" Erreur de connexion.", "red", suffix);
  }
}
async function verifierEtNettoyerCapteurId(suffix = "") {
  const storageKey = `capteurId${suffix}`;
  const capteurId = localStorage.getItem(storageKey);

  if (!capteurId || capteurId === "undefined" || capteurId.trim() === "") {
    localStorage.removeItem(storageKey);
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/sensors/${capteurId}`);
    if (!res.ok) {
      // Capteur inexistant ou supprimé côté back
      localStorage.removeItem(storageKey);
      console.warn(`ID invalide supprimé du localStorage pour capteur${suffix}: ${capteurId}`);
    }
  } catch (err) {
    console.error("Erreur de connexion lors de la vérification du capteur :", err);
  }
}


async function chargerDerniereMesureParCapteur(suffix = "", unit = "") {
  const capteurId = localStorage.getItem(`capteurId${suffix}`);
  if (!capteurId) return;

  try {
    const res = await fetch(`http://localhost:3000/api/measurements/latest/sensorId/${capteurId}`);
    const mesure = await res.json();

    console.log(`Dernière mesure pour capteur ${suffix} :`, mesure);

    const tbody = document.querySelector(`#table-mesures-${suffix.toLowerCase() || "temp"} tbody`);
    if (!tbody) return;

    const date = new Date(mesure.takeAt || mesure.createdAt || mesure.date).toLocaleString();
    let valeur = mesure.value;

    if (suffix === "Move") {
      valeur = valeur ? "Mouvement" : "Aucun";
    } else if (unit) {
      valeur += ` ${unit}`;
    }

    const row = document.createElement('tr');
    row.innerHTML = `<td>${date}</td><td>${valeur}</td>`;
    // Ajoute en haut du tableau
    tbody.prepend(row);


    // Limite à 10 lignes
    while (tbody.rows.length > 10) {
      tbody.deleteRow(-1); // Supprime la dernière ligne si plus de 10
    }


  } catch (err) {
    console.error(`Erreur chargement dernière mesure capteur ${suffix}:`, err);
  }
}

document.querySelectorAll(".tab-button-vertical").forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-tab");

    // Enlever la classe active de tous les boutons et contenus
    document.querySelectorAll(".tab-button-vertical").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

    // Activer le bon onglet et le bon bouton
    button.classList.add("active");
    const target = document.getElementById(targetId);
    if (target) target.classList.add("active");
  });
});

async function chargerInfosUtilisateur() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    const res = await fetch(`http://localhost:3000/api/users/${userId}`);
    if (!res.ok) throw new Error("Utilisateur introuvable");

    const user = await res.json();

    // Injection dans le HTML (assure-toi que les IDs existent dans le HTML)
    if (document.getElementById("nomCompletUtilisateur"))
      document.getElementById("nomCompletUtilisateur").textContent = `${user.firstName} ${user.lastName}`;

    if (document.getElementById("emailUtilisateur"))
      document.getElementById("emailUtilisateur").textContent = user.email;

    // Optionnel : si tu veux garder le prénom uniquement
    if (document.getElementById("nomUtilisateur"))
      document.getElementById("nomUtilisateur").textContent = user.firstName;

  } catch (err) {
    console.error("Erreur lors du chargement des infos utilisateur :", err);
  }
}

