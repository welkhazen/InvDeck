/* Pure arithmetic. No display rounding, network or persistent state. */
(() => {
  'use strict';

  function summarizeFunding(scenario) {
    const total = scenario.allocations.reduce((sum, item) => sum + item.amount, 0);
    const reserve = scenario.allocations
      .filter(item => item.reserve)
      .reduce((sum, item) => sum + item.amount, 0);
    const operatingBudget = total - reserve;
    return {
      total,
      reserve,
      operatingBudget,
      averageMonthlyOperatingSpend: operatingBudget / scenario.months
    };
  }

  function parseMarket(draft) {
    const errors = {};
    const value = {population: 5340000};
    for (const [key, maximum] of [['joinPct', 100], ['payerPct', 100], ['annualSpend', 1000]]) {
      const raw = String(draft[key] ?? '').trim();
      const number = Number(raw);
      if (!raw || !Number.isFinite(number) || number < 0 || number > maximum) {
        errors[key] = `Enter a number from 0 to ${maximum}.`;
      } else {
        value[key] = number;
      }
    }
    return Object.keys(errors).length ? {ok: false, errors} : {ok: true, value};
  }

  function calculateMarket(inputs) {
    const members = inputs.population * inputs.joinPct / 100;
    const payers = members * inputs.payerPct / 100;
    return {members, payers, grossAnnualRevenue: payers * inputs.annualSpend};
  }

  globalThis.RawMath = Object.freeze({summarizeFunding, parseMarket, calculateMarket});
})();
