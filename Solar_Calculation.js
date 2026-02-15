export default defineComponent({
  async run({ steps, $ }) {
 
    const avgKWh = steps.Transform_kWh?.['$return_value']?.kwh_average;

    console.log('Extracted kWh Average:', avgKWh);

    if (!avgKWh || typeof avgKWh !== "number") {
      throw new Error("Missing or invalid kWh average from OpenAI_Operation step.");
    }

    let pricePerkWp;
    const yieldPerkWp = 1350;

    if (avgKWh <= 301) {
      pricePerkWp = 1031.25;
    } else if (avgKWh <= 751) {
      pricePerkWp = 984.37;
    } else {
      pricePerkWp = 937.50;
    }

    const annualKWh = avgKWh * 12;
    const systemSizekWp = annualKWh / yieldPerkWp;
    const investment = systemSizekWp * pricePerkWp;

    console.log('Calculated Investment:', investment);

    return `$${investment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },
});