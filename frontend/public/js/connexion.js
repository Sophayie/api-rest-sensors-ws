document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formConnexion');
  if (!form) {
    console.error('#formConnexion introuvable');
    return;
  }
  console.log('Formulaire de connexion trouvé');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const motdepasse = document.getElementById('motdepasse').value;

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motdepasse })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userId', data._id);
        localStorage.setItem('firstname', data.firstName);
        alert('Connexion réussie !');
        window.location.href = 'dashboard.html'; // ← redirection ici
      } else {
        alert('Erreur : ' + (data.message || data.error));
      }
    } catch (err) {
      console.error(' Erreur de connexion :', err);
      alert('Erreur de connexion au serveur');
    }
  });
});
