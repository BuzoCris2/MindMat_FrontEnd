document.getElementById('download-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Agregar título
    doc.setFontSize(20);
    doc.text("Achievements", 10, 10);

    // Obtener la información de los achievements
    const achievements = [
        { title: "Achievement 1", description: "Description of achievement 1" },
        { title: "Achievement 2", description: "Description of achievement 2" },
        { title: "Achievement 3", description: "Description of achievement 3" },
    ];

    // Agregar contenido al PDF
    let y = 20; // Coordenada vertical inicial
    achievements.forEach((achievement, index) => {
        doc.setFontSize(14);
        doc.text(`${index + 1}. ${achievement.title}`, 10, y);
        y += 10;
        doc.setFontSize(12);
        doc.text(achievement.description, 10, y);
        y += 10;
    });

    // Descargar el PDF
    doc.save("achievements.pdf");
});
