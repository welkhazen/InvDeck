/* Aggregate-likelihood demo adaptation. No diagnosis or accuracy guarantee. */
(() => {
  'use strict';

  function normalize(weights) {
    const sum = weights.reduce((total, weight) => total + weight, 0);
    if (!Number.isFinite(sum) || sum <= 0) throw new Error('Invalid model probabilities');
    return weights.map(weight => weight / sum);
  }

  function posterior(model, answers) {
    let probabilities = normalize(model.tribes.map(tribe => tribe.share));
    for (const answer of answers) {
      const question = model.questions.find(question => question.id === answer.questionId);
      if (!question || (answer.side !== 0 && answer.side !== 1)) throw new Error('Invalid answer');
      probabilities = normalize(probabilities.map((weight, index) => {
        const likelihood = answer.side === 0 ? question.pa[index] : 1 - question.pa[index];
        return weight * likelihood;
      }));
    }
    return probabilities;
  }

  function entropy(probabilities) {
    return -probabilities.reduce((sum, probability) => {
      return sum + (probability > 0 ? probability * Math.log(probability) : 0);
    }, 0);
  }

  function nextQuestion(model, state) {
    const used = new Set([
      ...state.answers.map(answer => answer.questionId),
      ...state.skippedIds
    ]);
    for (const group of model.policy?.sameQuestionGroups || []) {
      if (group.some(id => used.has(id))) group.forEach(id => used.add(id));
    }
    const probabilities = posterior(model, state.answers);
    let best = null;
    let bestScore = Infinity;
    for (const question of model.questions) {
      if (used.has(question.id)) continue;
      const probabilityA = question.pa.reduce((sum, likelihood, index) => {
        return sum + probabilities[index] * likelihood;
      }, 0);
      const posteriorA = normalize(probabilities.map((weight, index) => weight * question.pa[index]));
      const posteriorB = normalize(probabilities.map((weight, index) => weight * (1 - question.pa[index])));
      const expectedEntropy = probabilityA * entropy(posteriorA) + (1 - probabilityA) * entropy(posteriorB);
      const isThemed = (model.policy?.themedIds || []).includes(question.id);
      const bonus = isThemed ? model.policy.themeBonus || 0 : 0;
      const score = expectedEntropy - bonus;
      // Strict improvement preserves source fixture order for numerical ties.
      if (score < bestScore - 1e-12) {
        best = question;
        bestScore = score;
      }
    }
    return best;
  }

  function initialState(model) {
    const state = {
      answers: [], skippedIds: [], currentId: null,
      pendingSide: null, target: 5, finished: false
    };
    state.currentId = nextQuestion(model, state)?.id || null;
    state.finished = !state.currentId;
    return state;
  }

  function transition(model, previous, action) {
    if (action.type === 'reset') return initialState(model);
    const state = {
      ...previous,
      answers: [...previous.answers],
      skippedIds: [...previous.skippedIds]
    };
    if (action.type === 'select') {
      if (!state.finished && state.currentId && (action.side === 0 || action.side === 1)) {
        state.pendingSide = action.side;
      }
      return state;
    }
    if (action.type === 'finish') {
      state.finished = true;
      state.pendingSide = null;
      return state;
    }
    if (action.type === 'continue') {
      if (!state.finished || ![10, 23].includes(action.target) || action.target <= state.answers.length) return state;
      state.target = action.target;
      state.finished = false;
      state.pendingSide = null;
    } else if (action.type === 'submit') {
      const alreadyAnswered = state.answers.some(answer => answer.questionId === state.currentId);
      if (state.finished || !state.currentId || state.pendingSide === null || alreadyAnswered) return state;
      state.answers.push({questionId: state.currentId, side: state.pendingSide});
      state.pendingSide = null;
    } else if (action.type === 'skip') {
      if (state.finished || !state.currentId) return state;
      state.skippedIds.push(state.currentId);
      state.pendingSide = null;
    } else {
      return state;
    }
    if (state.answers.length >= state.target) {
      state.finished = true;
      state.currentId = null;
      return state;
    }
    state.currentId = nextQuestion(model, state)?.id || null;
    state.finished = !state.currentId;
    return state;
  }

  globalThis.RawModel = Object.freeze({posterior, nextQuestion, initialState, transition, entropy});
})();
