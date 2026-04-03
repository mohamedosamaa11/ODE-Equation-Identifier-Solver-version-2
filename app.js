document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('equationForm');
    const equationInput = document.getElementById('equation');
    const depVarInput = document.getElementById('dependentVar');
    const indepVarInput = document.getElementById('independentVar');
    const resultsSection = document.getElementById('resultsSection');
    const displayEquation = document.getElementById('displayEquation');
    const equationType = document.getElementById('equationType');
    const solutionMethods = document.getElementById('solutionMethods');

    if (!form || !equationInput || !resultsSection || !displayEquation || !equationType || !solutionMethods) {
        console.error('Required UI elements are missing.');
        return;
    }

    function toDisplayNotation(text) {
        return String(text)
            .replace(/y''/g, 'd2y/dx2')
            .replace(/y'/g, 'dy/dx');
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function toReadableMathHtml(text) {
        let out = escapeHtml(toDisplayNotation(text));
        out = out.replace(/\*/g, ' × ');
        out = out.replace(/\+-/g, ' ± ');
        out = out.replace(/C([0-9]+)/g, 'C<sub>$1</sub>');
        out = out.replace(/([A-Za-z0-9)\]])\^\(([^)]+)\)/g, '$1<sup>($2)</sup>');
        out = out.replace(/([A-Za-z0-9)\]])\^([+-]?\d+(?:\.\d+)?)/g, '$1<sup>$2</sup>');
        out = out.replace(/\bint\b/g, '∫');
        out = out.replace(/\bln\b/g, 'ln');
        return out;
    }

    function showError(message) {
        displayEquation.textContent = '-';
        equationType.innerHTML = '<span class="badge">Error</span>';
        solutionMethods.innerHTML = '<p>' + message + '</p>';
        resultsSection.classList.remove('hidden');
    }

    function createMethodCard(type, method, solved, fallbackSolved) {
        const div = document.createElement('div');
        div.className = 'method-item';

        let html = '<h4>' + type + '</h4>';

        html += '<button type="button" class="method-button show-answer-btn">Show Answer</button>';
        html += '<div class="solution-panel inline-answer hidden"></div>';

        div.innerHTML = html;

        const button = div.querySelector('.show-answer-btn');
        const panel = div.querySelector('.inline-answer');

        if (button && panel) {
            button.addEventListener('click', function () {
                if (panel.classList.contains('hidden')) {
                    panel.classList.remove('hidden');
                    button.textContent = 'Hide Answer';

                    if (solved && solved.success) {
                        let answerHtml = '<p><strong>Final Answer:</strong></p>';
                        answerHtml += '<div class="solution-main"><code>' + toReadableMathHtml(solved.solution || '') + '</code></div>';
                        if (Array.isArray(solved.steps) && solved.steps.length > 0) {
                            answerHtml += '<p><strong>Key steps:</strong></p><ol>';
                            for (const step of solved.steps) {
                                answerHtml += '<li>' + toReadableMathHtml(step) + '</li>';
                            }
                            answerHtml += '</ol>';
                        }
                        panel.innerHTML = answerHtml;
                    } else {
                        const hasGeneralAnswer = fallbackSolved && fallbackSolved.success;
                        const hasMethodSteps = Array.isArray(method.steps) && method.steps.length > 0;

                        if (hasGeneralAnswer || hasMethodSteps) {
                            let fallbackHtml = '';
                            if (hasGeneralAnswer) {
                                fallbackHtml += '<p><strong>Final Answer:</strong></p>';
                                fallbackHtml += '<div class="solution-main"><code>' + toReadableMathHtml(fallbackSolved.solution || '') + '</code></div>';
                            }
                            if (hasMethodSteps) {
                                fallbackHtml += '<p><strong>General Steps:</strong></p><ol>';
                                for (const step of method.steps) {
                                    fallbackHtml += '<li>' + toReadableMathHtml(step) + '</li>';
                                }
                                fallbackHtml += '</ol>';
                            }
                            panel.innerHTML = fallbackHtml;
                        } else {
                            const reason = solved && solved.reason
                                ? solved.reason
                                : 'No solver available for this method yet.';
                            panel.innerHTML = '<p>' + escapeHtml(reason) + '</p>';
                        }
                    }
                } else {
                    panel.classList.add('hidden');
                    button.textContent = 'Show Answer';
                }
            });
        }

        return div;
    }

    function analyzeAndRender() {
        const equation = equationInput.value.trim();
        const depVar = (depVarInput.value || 'y').trim() || 'y';
        const indepVar = (indepVarInput.value || 'x').trim() || 'x';

        if (!equation) {
            showError('Please enter a differential equation.');
            return;
        }

        try {
            if (typeof ODEIdentifier === 'undefined' || typeof ODESolver === 'undefined') {
                showError('Application scripts failed to load. Refresh and try again.');
                return;
            }

            const identifier = new ODEIdentifier();
            const solver = new ODESolver();
            const result = identifier.analyze(equation, depVar, indepVar);

            if (!result || !result.success) {
                showError((result && result.error) ? result.error : 'Unable to analyze this equation.');
                return;
            }

            displayEquation.textContent = toDisplayNotation(result.equation);

            equationType.innerHTML = '';
            if (Array.isArray(result.types) && result.types.length > 0) {
                for (const type of result.types) {
                    const badge = document.createElement('span');
                    badge.className = 'badge';
                    badge.textContent = type;
                    equationType.appendChild(badge);
                }
            } else {
                const badge = document.createElement('span');
                badge.className = 'badge';
                badge.textContent = 'Unclassified';
                equationType.appendChild(badge);
            }

            solutionMethods.innerHTML = '';
            const types = Array.isArray(result.types) ? [...new Set(result.types)] : [];
            const methods = solver.getAllMethods(result.types || []);
            const solvedFallback = solver.solveEquation(result.equation, types);
            if (methods.length > 0) {
                for (const method of methods) {
                    const solved = solver.solveByType(result.equation, method.type, types);
                    solutionMethods.appendChild(createMethodCard(method.type, method, solved, solvedFallback));
                }
            } else {
                solutionMethods.appendChild(createMethodCard('General Method', { steps: [] }, solvedFallback, solvedFallback));
            }

            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
            console.error(err);
            showError('Unexpected error while analyzing the equation.');
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        analyzeAndRender();
    });

    document.addEventListener('click', function (e) {
        const example = e.target.closest('.example');
        if (!example) return;

        e.preventDefault();
        const sample = example.getAttribute('data-equation');
        if (!sample) return;

        equationInput.value = sample;
        analyzeAndRender();
    });
});
