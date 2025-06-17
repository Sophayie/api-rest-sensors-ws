/*  js/inscription.js  */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formInscription');
  if (!form) {
    console.error('#formInscription introuvable');
    return;
  }
  console.log('Formulaire trouvé');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Formulaire soumis');

    const formData = {
      firstName: document.getElementById('firstName').value,
      lastName:  document.getElementById('lastName').value,
      email:     document.getElementById('email').value,
      motdepasse:document.getElementById('motdepasse').value
    };

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Inscription réussie !');
        localStorage.setItem("userId", data._id);
        localStorage.setItem("firstname", data.firstName);
        localStorage.setItem("lastname", data.lastName);
        localStorage.setItem("email", data.email);
        window.location.href = 'index.html'; // Redirection après succès
      } else {
        alert('Erreur : ' + (data.message || data.error));
      }
    } catch (err) {
      console.error('Erreur fetch :', err);
      alert('Erreur de connexion au serveur');
    }
  });
});
