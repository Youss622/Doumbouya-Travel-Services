const { Resend } = require("resend");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Requête invalide" }) };
  }

  // Honeypot anti-spam : si rempli, on fait semblant que ça a marché
  if (data["bot-field"]) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const { name, phone, email, service, message } = data;

  if (!name || !phone || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: "Champs requis manquants" }) };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: "DTS Site <onboarding@resend.dev>",
      to: "doumbouyatravelservices@gmail.com",
      replyTo: email,
      subject: `Nouvelle demande de contact — ${name}`,
      text: [
        `Nom: ${name}`,
        `Téléphone: ${phone}`,
        `Email: ${email}`,
        `Service: ${service || "Non précisé"}`,
        "",
        "Message:",
        message || "(aucun message)",
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return { statusCode: 500, body: JSON.stringify({ error: "Échec de l'envoi" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Échec de l'envoi" }) };
  }
};
