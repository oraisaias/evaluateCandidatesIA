const fs = require('fs');
const pdfjsLib = require('pdfjs-dist');

const OLLAMA_API_URL = "http://localhost:11434/api/generate";  // API de Ollama
const PROMPT_FILE = "./prompt.txt";  // Archivo con la instrucción personalizada
const VACANTE_FILE = "./vacante.txt";  // Archivo con la descripción de la vacante
const RESULT_FILE = "resultado.txt";  // Archivo de salida con el análisis

// Función para leer un archivo de texto y devolver su contenido
function loadTextFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8').trim();
    } catch (error) {
        console.warn(`⚠️ No se encontró '${filePath}', usando texto vacío.`);
        return "";
    }
}

// Función para extraer texto del PDF
async function extractTextFromPDF(pdfPath) {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });

    const pdf = await loadingTask.promise;
    let extractedText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        extractedText += `\n--- Página ${i} ---\n${pageText}\n`;
    }

    return extractedText;
}

// Función para enviar el texto a DeepSeek en Ollama con el prompt y la vacante
async function sendToOllama(cvText, customPrompt, jobDescription) {
    const fullPrompt = `${customPrompt}\n\n${cvText}\n\nBasado en la descripción de la vacante a continuación, evalúa si este candidato cumple con el perfil:\n\n${jobDescription}\n\nGenera una respuesta con los puntos más importantes y finaliza con un veredicto en formato simple: 'Sí' o 'No'.`;

    const response = await fetch(OLLAMA_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "deepseek-r1:7b",  // Modelo en Ollama
            prompt: fullPrompt,
            stream: false  // Desactiva streaming para recibir la respuesta completa
        })
    });

    const data = await response.json();
    return data.response || "No response from DeepSeek in Ollama";
}

// Función principal
async function processPDF(pdfPath) {
    try {
        console.log("📄 Extrayendo texto del CV en PDF...");
        const cvText = await extractTextFromPDF(pdfPath);

        console.log("📜 Cargando prompt personalizado...");
        const customPrompt = loadTextFile(PROMPT_FILE);

        console.log("📝 Cargando descripción de la vacante...");
        const jobDescription = loadTextFile(VACANTE_FILE);

        console.log("🧠 Enviando información a DeepSeek en Ollama...");
        const analysis = await sendToOllama(cvText, customPrompt, jobDescription);

        console.log("\n📜 Guardando el resultado en 'resultado.txt'...");
        fs.writeFileSync(RESULT_FILE, analysis);

        console.log("\n✅ Análisis completado. Revisa 'resultado.txt'.");
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

// Ruta del CV en PDF a analizar
const pdfPath = "./IsaiasChavez_CV_ReactNativeDeveloper.pdf";  // Cambia esto por el archivo real
processPDF(pdfPath);
