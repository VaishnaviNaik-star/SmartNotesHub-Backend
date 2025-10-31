const Note = require("./models/Note");

const seedDemoNotes = async () => {
  try {
    console.log("🧹 Clearing old demo notes...");
    await Note.deleteMany();

    console.log("🌱 Seeding new demo notes...");
    await Note.insertMany([
      {
        title: "Software Engineering - Unit 1 Notes",
        subject: "Software Engineering",
        fileUrl: "http://localhost:5000/uploads/Unit%201%20SE%20Notes.pdf",
        uploadedBy: "Admin"
      },
      {
        title: "Software Engineering - Unit 2 Notes",
        subject: "Software Engineering",
        fileUrl: "http://localhost:5000/uploads/Unit%202%20SE%20Notes.pdf",
        uploadedBy: "Admin"
      }
    ]);

    console.log("✅ Demo notes refreshed successfully!");
  } catch (err) {
    console.error("❌ Error seeding demo notes:", err);
  }
};

module.exports = seedDemoNotes;
