export default defineComponent({
  async run({ steps }) {
    const rawText = steps.GoogleAI_API.$return_value.raw_text;

    if (!rawText || typeof rawText !== 'string') {
      throw new Error("raw_text is undefined or not a string");
    }

    // LOGIC 1
    const validMonths = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    const lines = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const results = [];
    let validMonthCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const match = line.match(/^([A-Za-zÁÉÍÓÚáéíóú]{3})[-\s]?(\d{2,4})$/);
      if (match) {
        const month = match[1].slice(0, 3);
        const year = match[2];

        if (!validMonths.includes(month)) continue;

        validMonthCount++;

        let kwh = null;
        const maxLinesToCheck = 6;
        for (let j = 1; j <= maxLinesToCheck; j++) {
          const candidateLine = lines[i + j];
          if (!candidateLine) continue;

          const cleaned = candidateLine.trim();

          if (/^\d{3,5}$/.test(cleaned)) {
            kwh = parseInt(cleaned, 10);
            break;
          }
        }

        if (kwh !== null) {
          results.push({ month, year, kwh });
        }
      }
    }

    if (results.length >= 5) {
      const monthOrder = {
        'Ene': 1, 'Feb': 2, 'Mar': 3, 'Abr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Ago': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dic': 12,
      };

      results.sort((a, b) => {
        const yearDiff = parseInt(b.year) - parseInt(a.year);
        if (yearDiff !== 0) return yearDiff;
        return monthOrder[b.month] - monthOrder[a.month];
      });

      const last12 = results.slice(0, 12);

      const formatted_kwh = last12.map(p => `${p.month}-${p.year}: ${p.kwh}`).join(', ') + '.';
      const kwh_average = Math.round(last12.reduce((sum, p) => sum + p.kwh, 0) / last12.length || 0);

      return { formatted_kwh, kwh_average };
    }

    // LOGIC 2
    const lowerText = rawText.toLowerCase();
    const startIndex = lowerText.indexOf("mes de facturación");
    const endIndex = lowerText.indexOf("subsidios y descuentos");

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const section = rawText.slice(startIndex, endIndex);
      const kwhMatches = section.match(/\b\d{3,5}\b/g) || [];
      const kwhValues = kwhMatches.map(Number);

      if (kwhValues.length > 0) {
        const formatted_kwh = kwhValues.join(', ') + '.';
        const kwh_average = Math.round(
          kwhValues.reduce((sum, val) => sum + val, 0) / kwhValues.length
        );

        return { formatted_kwh, kwh_average };
      }
    }

    // LOGIC 3
    const monthNames = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

    const correctedText = rawText.replace(/B/g, '8').replace(/I/g, '1').replace(/Z/g, '2');

    const historialPattern = /(\d{2}\/\d{2}\/\d{4})\s+([2][8-9]|30|31)\s+(\d{3,4})/g;

    let historialMatches = [];
    let match;
    while ((match = historialPattern.exec(correctedText)) !== null) {
      const [ , dateStr, , kwhStr ] = match;
      const [day, month, year] = dateStr.split('/');
      const monthIdx = parseInt(month, 10) - 1;
      const monthName = monthNames[monthIdx] || month;
      const yearShort = year.slice(-2);
      const kwh = parseInt(kwhStr, 10);

      historialMatches.push({ month: monthName, yearShort, kwh, date: new Date(`${year}-${month}-${day}`) });
    }

    if (historialMatches.length >= 12) {
      historialMatches.sort((a, b) => b.date - a.date); 
      const last12 = historialMatches.slice(0, 12);

      const formatted_kwh = last12.map(p => `${p.month}-${p.yearShort}: ${p.kwh}`).join(', ') + '.';
      const kwh_average = Math.round(last12.reduce((sum, p) => sum + p.kwh, 0) / last12.length);

      return { formatted_kwh, kwh_average };
    }

    throw new Error("Could not extract kWh values using any of the three logics");
  },
});