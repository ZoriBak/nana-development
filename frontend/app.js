let childMode = false;

function toggleChildMode() {
  childMode = !childMode;

  if (childMode) {
    document.body.style.background = "#87CEEB";
  } else {
    document.body.style.background = "#1e1e1e";
  }
}

async function submitData() {
  const notes = document.getElementById('notes').value;

  await fetch('http://localhost:5000/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      spots: selectedParts,
      notes: notes
    })
  });

  alert('Saved!');
}

function goReports() {
  window.location.href = "reports.html";
}

function goDoctor() {
  window.location.href = "doctor.html";
}