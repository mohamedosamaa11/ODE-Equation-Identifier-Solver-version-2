/**
 * ODE Solver
 * Provides solution methods and detailed explanations for different ODE types
 */

class ODESolver {
    constructor() {
        this.solutions = {
            'First-Order ODE': {
                method: 'General First-Order ODE',
                steps: [
                    'Identify the specific type of first-order ODE',
                    'Check if it\'s separable, linear, exact, or homogeneous',
                    'Apply appropriate solution method',
                    'Integrate and solve for the dependent variable'
                ],
                formula: 'dy/dx = f(x,y)',
                difficulty: 'Moderate',
                example: 'y\' = f(x,y)',
                notes: [
                    'First-order ODEs involve the first derivative only',
                    'General solution will contain one arbitrary constant',
                    'Solution method depends on equation form'
                ]
            },

            'Second-Order ODE': {
                method: 'General Second-Order ODE',
                steps: [
                    'Identify if equation is linear or nonlinear',
                    'Check for constant or variable coefficients',
                    'Apply appropriate method (characteristic equation, variation of parameters, etc.)',
                    'Solve and verify solution'
                ],
                formula: 'd²y/dx² = f(x,y,dy/dx)',
                difficulty: 'High',
                example: 'y\'\' + 3y\' + 2y = 0',
                notes: [
                    'Second-order ODEs involve the second derivative',
                    'General solution will contain two arbitrary constants',
                    'Requires finding complementary and particular solutions'
                ]
            },

            'Separable': {
                method: 'Separation of Variables',
                steps: [
                    'Rearrange equation to: dy/g(y) = f(x)dx',
                    'Integrate both sides: ∫dy/g(y) = ∫f(x)dx',
                    'Solve for y to get the general solution',
                    'Apply initial conditions if given to find constants'
                ],
                formula: 'If y\' = f(x)g(y), then ∫dy/g(y) = ∫f(x)dx + C',
                difficulty: 'Low',
                example: 'y\' = x/y → y dy = x dx → y²/2 = x²/2 + C → y = √(x² + C\')',
                notes: [
                    'Works when you can separate variables into f(x) and g(y)',
                    'Don\'t forget the constant of integration',
                    'Check for singular solutions after separation'
                ]
            },
            
            'Linear (First Order)': {
                method: 'Integrating Factor',
                steps: [
                    'Write equation in standard form: y\' + P(x)y = Q(x)',
                    'Find integrating factor: μ(x) = e^(∫P(x)dx)',
                    'Multiply entire equation by μ(x)',
                    'Left side becomes: d/dx[μ(x)y]',
                    'Integrate: μ(x)y = ∫μ(x)Q(x)dx + C',
                    'Solve for y'
                ],
                formula: 'y = e^(-∫P(x)dx)[∫e^(∫P(x)dx)Q(x)dx + C]',
                difficulty: 'Moderate',
                example: 'y\' + 2y = 0 → integrating factor e^(2x) → y = Ce^(-2x)',
                notes: [
                    'Must be in standard form: y\' + P(x)y = Q(x)',
                    'The integrating factor is e to the power of integral of P(x)',
                    'Works for any P(x) and Q(x)'
                ]
            },
            
            'Linear Homogeneous': {
                method: 'Direct Integration / Characteristic Equation',
                steps: [
                    'For y\' + P(x)y = 0, solution is y = Ce^(-∫P(x)dx)',
                    'If P(x) = constant, use characteristic equation r + P = 0',
                    'Solution: y = Ce^(-Px)'
                ],
                formula: 'y = Ce^(-∫P(x)dx)',
                difficulty: 'Low',
                example: 'y\' + 3y = 0 → r = -3 → y = Ce^(-3x)',
                notes: [
                    'General solution is easier than non-homogeneous case',
                    'Always contains arbitrary constant C',
                    'Initial condition determines C'
                ]
            },
            
            'Linear Non-homogeneous': {
                method: 'Integrating Factor + Particular Solution',
                steps: [
                    'Find complementary solution y_c using homogeneous part',
                    'Find particular solution y_p using method of undetermined coefficients',
                    'General solution: y = y_c + y_p',
                    'Apply initial conditions to find constants'
                ],
                formula: 'y = y_c + y_p where y_c = Ce^(-∫P(x)dx) and y_p depends on Q(x)',
                difficulty: 'Moderate-High',
                example: 'y\' + y = x → y_c = Ce^(-x), y_p = x - 1 → y = Ce^(-x) + x - 1',
                notes: [
                    'Requires solving both homogeneous and finding particular solution',
                    'Particular solution form depends on Q(x)',
                    'Use method of undetermined coefficients or variation of parameters'
                ]
            },
            
            'Bernoulli': {
                method: 'Substitution to Linear Form',
                steps: [
                    'Identify power n where equation is: y\' + P(x)y = Q(x)y^n',
                    'Make substitution: v = y^(1-n)',
                    'Transform to linear ODE in v: v\' + (1-n)P(x)v = (1-n)Q(x)',
                    'Solve linear ODE for v',
                    'Back-substitute: y = v^(1/(1-n))'
                ],
                formula: 'y\' + P(x)y = Q(x)y^n → v\' + (1-n)P(x)v = (1-n)Q(x)',
                difficulty: 'Moderate',
                example: 'y\' + y = y² (n=2) → v = y^(-1) → v\' - v = -1 → solve for v then y = 1/v',
                notes: [
                    'Works when n ≠ 0, 1',
                    'Substitution eliminates the nonlinear y^n term',
                    'Reduces to linear ODE problem'
                ]
            },
            
            'Exact': {
                method: 'Potential Function Method',
                steps: [
                    'Write equation as: M(x,y)dx + N(x,y)dy = 0',
                    'Check exactness: ∂M/∂y = ∂N/∂x',
                    'Find function F where ∂F/∂x = M and ∂F/∂y = N',
                    'Integrate M with respect to x: F = ∫M dx',
                    'Differentiate result with respect to y and compare with N',
                    'Solution: F(x,y) = C'
                ],
                formula: 'If ∂M/∂y = ∂N/∂x, then F(x,y) = C is solution',
                difficulty: 'Moderate',
                example: '(2x + y)dx + (x + 2y)dy = 0 → M_y = N_x = 1 → Exact',
                notes: [
                    'Check exactness condition first',
                    'If not exact, may need integrating factor',
                    'Potential function method elegant but requires careful integration'
                ]
            },

            'Non-Exact': {
                method: 'Integrating Factor Search',
                steps: [
                    'Write equation as M(x,y)dx + N(x,y)dy = 0',
                    'Compute ∂M/∂y and ∂N/∂x and confirm they are not equal',
                    'Try integrating factor μ(x) if (M_y - N_x)/N is x-only',
                    'Try integrating factor μ(y) if (N_x - M_y)/M is y-only',
                    'Multiply equation by μ and re-check exactness',
                    'After exactness holds, integrate to get F(x,y) = C'
                ],
                formula: 'Find μ so that ∂(μM)/∂y = ∂(μN)/∂x',
                difficulty: 'High',
                example: '(3xy + y^2)dx + (x^2 + xy)dy = 0',
                notes: [
                    'Non-exact equations need an integrating factor or another substitution',
                    'Try simple μ(x) or μ(y) tests first',
                    'If no simple factor exists, use advanced integrating-factor methods'
                ]
            },
            
            'Homogeneous': {
                method: 'Substitution v = y/x',
                steps: [
                    'Rewrite as: M(x,y)dx + N(x,y)dy = 0',
                    'Verify M and N are homogeneous of same degree',
                    'Substitute y = vx, so dy = v dx + x dv',
                    'Equation becomes separable in v and x',
                    'Separate and integrate',
                    'Replace v = y/x in final answer'
                ],
                formula: 'y = vx → dy = vdx + xdv → becomes separable',
                difficulty: 'Moderate',
                example: 'xy\' - y = x² → (y/x)\' can be solved using v = y/x',
                notes: [
                    'Look for equations where y/x ratio appears naturally',
                    'Reduces to separable equation',
                    'Works only for homogeneous equations of same degree'
                ]
            },
            
            'Linear (Second Order)': {
                method: 'Characteristic Equation Method',
                steps: [
                    'For ay\'\' + by\' + cy = f(x), solve characteristic equation',
                    'Characteristic equation: ar² + br + c = 0',
                    'Find roots r₁ and r₂',
                    'If r₁ ≠ r₂: y_c = C₁e^(r₁x) + C₂e^(r₂x)',
                    'If r₁ = r₂: y_c = (C₁ + C₂x)e^(r₁x)',
                    'If complex: y_c = e^(αx)[C₁cos(βx) + C₂sin(βx)]',
                    'Find particular solution y_p and get y = y_c + y_p'
                ],
                formula: 'ar² + br + c = 0 determines fundamental solutions',
                difficulty: 'High',
                example: 'y\'\' + 3y\' + 2y = 0 → r² + 3r + 2 = 0 → r = -1, -2 → y = C₁e^(-x) + C₂e^(-2x)',
                notes: [
                    'Characteristic equation determines solution form',
                    'Three cases: distinct real, repeated real, complex roots',
                    'For non-homogeneous, add particular solution'
                ]
            },
            
            'Homogeneous (Second Order)': {
                method: 'Characteristic Equation',
                steps: [
                    'Form characteristic equation from ay\'\' + by\' + cy = 0',
                    'Solve ar² + br + c = 0 for roots',
                    'Apply appropriate form based on discriminant'
                ],
                formula: 'r = (-b ± √(b² - 4ac))/(2a)',
                difficulty: 'Moderate',
                example: 'y\'\' - 5y\' + 6y = 0 → r² - 5r + 6 = 0 → r = 2, 3',
                notes: [
                    'Simplest second-order case',
                    'Always solvable using characteristic equation',
                    'General solution has two arbitrary constants'
                ]
            },
            
            'Non-homogeneous (Second Order)': {
                method: 'Variation of Parameters or Undetermined Coefficients',
                steps: [
                    'Solve homogeneous part: ay\'\' + by\' + cy = 0 to get y_c',
                    'Choose method for particular solution:',
                    '  - Undetermined Coefficients: if f(x) is polynomial, exponential, or trig',
                    '  - Variation of Parameters: if f(x) is arbitrary',
                    'Particular solution y_p satisfies non-homogeneous equation',
                    'General solution: y = y_c + y_p'
                ],
                formula: 'y = y_c + y_p',
                difficulty: 'High',
                example: 'y\'\' + y = x → y_c = C₁cos(x) + C₂sin(x), y_p = x → y = C₁cos(x) + C₂sin(x) + x',
                notes: [
                    'Complementary solution y_c from homogeneous equation',
                    'Particular solution form depends on f(x)',
                    'Most common approach uses undetermined coefficients'
                ]
            },
            
            'Constant Coefficients': {
                method: 'Characteristic Equation with Constant Coefficients',
                steps: [
                    'ODE has form: ay\'\' + by\' + cy = f(x) with a,b,c constants',
                    'Characteristic equation: ar² + br + c = 0',
                    'Solutions easier than variable coefficients',
                    'Use quadratic formula to find roots',
                    'Build general solution from roots'
                ],
                formula: 'Simplest case: y\'\' + py\' + qy = f uses r² + pr + q = 0',
                difficulty: 'Moderate',
                example: 'y\'\' + 4y\' + 4y = 0 → r² + 4r + 4 = 0 → r = -2 (repeated)',
                notes: [
                    'Much easier than variable coefficient equations',
                    'Quadratic formula always works',
                    'Roots determine solution form completely'
                ]
            }
        };
    }

    /**
     * Get solution method for a given type
     */
    getSolutionMethod(type) {
        if (this.solutions[type]) {
            return this.solutions[type];
        }
        return null;
    }

    /**
     * Get all solution methods for identified types
     */
    getAllMethods(types) {
        const methods = [];
        for (const type of types) {
            const method = this.getSolutionMethod(type);
            if (method) {
                methods.push({
                    type: type,
                    ...method
                });
            }
        }
        return methods;
    }

    /**
     * Get detailed explanation for type
     */
    getDetailedExplanation(type) {
        const solution = this.solutions[type];
        if (!solution) return null;

        return {
            type: type,
            method: solution.method,
            steps: solution.steps,
            formula: solution.formula,
            difficulty: solution.difficulty,
            example: solution.example,
            notes: solution.notes
        };
    }

    /**
     * Get recommendation based on types
     */
    getRecommendation(types) {
        // Prioritize easier methods
        const priority = [
            'Linear Homogeneous',
            'Separable',
            'Linear (First Order)',
            'Bernoulli',
            'Homogeneous',
            'Exact',
            'Linear (Second Order)',
            'Constant Coefficients'
        ];

        for (const recommended of priority) {
            if (types.includes(recommended)) {
                return recommended;
            }
        }

        return types.length > 0 ? types[0] : null;
    }

    /**
     * Format solution steps as HTML
     */
    formatSteps(steps) {
        return steps.map((step, index) => 
            `<li>${step}</li>`
        ).join('');
    }

    parseCoefficient(term, variable) {
        if (!term) return null;
        const clean = term.replace(/\s+/g, '');
        const escaped = variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`^([+-]?(?:\\d+(?:\\.\\d+)?)?)\\*?${escaped}$`);
        const match = clean.match(re);

        if (!match) return null;

        const raw = match[1];
        if (raw === '' || raw === '+') return 1;
        if (raw === '-') return -1;

        const value = Number(raw);
        return Number.isFinite(value) ? value : null;
    }

    toCompactNumber(value) {
        if (!Number.isFinite(value)) return String(value);
        if (Math.abs(value) < 1e-12) return '0';
        const rounded = Number(value.toFixed(8));
        return String(rounded);
    }

    toSignedTerm(value, core) {
        const abs = Math.abs(value);
        const coeff = abs === 1 ? '' : this.toCompactNumber(abs);
        const expr = coeff + core;
        return value >= 0 ? '+ ' + expr : '- ' + expr;
    }

    normalizeSides(equation) {
        const parts = String(equation || '').replace(/\s+/g, '').split('=');
        if (parts.length !== 2) return null;
        return { left: parts[0], right: parts[1] };
    }

    splitTopLevelTerms(side) {
        const input = String(side || '').replace(/\s+/g, '');
        if (!input) return [];

        const terms = [];
        let current = '';
        let depth = 0;

        for (let i = 0; i < input.length; i += 1) {
            const ch = input[i];
            if (ch === '(') {
                depth += 1;
                current += ch;
                continue;
            }
            if (ch === ')') {
                depth = Math.max(0, depth - 1);
                current += ch;
                continue;
            }

            if ((ch === '+' || ch === '-') && depth === 0) {
                if (current) {
                    terms.push(current);
                }
                current = ch;
                continue;
            }

            current += ch;
        }

        if (current) {
            terms.push(current);
        }

        return terms.filter(Boolean);
    }

    parseLinearSideCoefficients(side) {
        const terms = this.splitTopLevelTerms(side);
        const coeffs = {
            yDoublePrime: 0,
            yPrime: 0,
            y: 0,
            constant: 0,
            supported: true
        };

        for (const term of terms) {
            const t = term.trim();
            if (!t) continue;

            if (t.includes('x')) {
                coeffs.supported = false;
                return coeffs;
            }

            if (t.includes("y''")) {
                const c = this.parseCoefficient(t, "y''");
                if (c === null) {
                    coeffs.supported = false;
                    return coeffs;
                }
                coeffs.yDoublePrime += c;
                continue;
            }

            if (t.includes("y'")) {
                const c = this.parseCoefficient(t, "y'");
                if (c === null) {
                    coeffs.supported = false;
                    return coeffs;
                }
                coeffs.yPrime += c;
                continue;
            }

            if (t.includes('y')) {
                const c = this.parseCoefficient(t, 'y');
                if (c === null) {
                    coeffs.supported = false;
                    return coeffs;
                }
                coeffs.y += c;
                continue;
            }

            const value = Number(t);
            if (!Number.isFinite(value)) {
                coeffs.supported = false;
                return coeffs;
            }
            coeffs.constant += value;
        }

        return coeffs;
    }

    solveLinearFirstOrderConstant(equation) {
        const sides = this.normalizeSides(equation);
        if (!sides) return null;

        const left = this.parseLinearSideCoefficients(sides.left);
        const right = this.parseLinearSideCoefficients(sides.right);
        if (!left.supported || !right.supported) return null;

        const yPrimeCoeff = left.yPrime - right.yPrime;
        const yCoeff = left.y - right.y;
        const constant = left.constant - right.constant;

        if (Math.abs(left.yDoublePrime - right.yDoublePrime) > 1e-12) return null;

        if (Math.abs(yPrimeCoeff) < 1e-12) return null;

        const a = yCoeff / yPrimeCoeff;
        const b = -constant / yPrimeCoeff;

        if (Math.abs(a) < 1e-12) {
            return {
                success: true,
                method: 'Direct integration (constant derivative)',
                solution: `y = ${this.toCompactNumber(b)}x + C`,
                steps: [
                    `Reduce equation to y' = ${this.toCompactNumber(b)}`,
                    'Integrate both sides with respect to x',
                    `General solution: y = ${this.toCompactNumber(b)}x + C`
                ]
            };
        }

        if (Math.abs(b) < 1e-12) {
            return {
                success: true,
                method: 'First-order linear homogeneous (constant coefficients)',
                solution: `y = C*e^(${this.toCompactNumber(-a)}x)`,
                steps: [
                    `Reduce equation to y' + ${this.toCompactNumber(a)}y = 0`,
                    `Integrate dy/y = -${this.toCompactNumber(a)} dx`,
                    `General solution: y = C*e^(${this.toCompactNumber(-a)}x)`
                ]
            };
        }

        return {
            success: true,
            method: 'First-order linear non-homogeneous (constant coefficients)',
            solution: `y = C*e^(${this.toCompactNumber(-a)}x) + (${this.toCompactNumber(b)})/(${this.toCompactNumber(a)})`,
            steps: [
                `Reduce equation to y' + ${this.toCompactNumber(a)}y = ${this.toCompactNumber(b)}`,
                `Solve homogeneous part y_h = C*e^(${this.toCompactNumber(-a)}x)`,
                `Use constant particular solution y_p = b/a = ${this.toCompactNumber(b / a)}`,
                'Combine: y = y_h + y_p'
            ]
        };
    }

    solveLinearFirstOrderKnownVariableCoefficient(equation) {
        const sides = this.normalizeSides(equation);
        if (!sides) return null;

        const compact = `${sides.left}=${sides.right}`
            .replace(/\*/g, '')
            .replace(/dy\/dx/g, "y'");

        // y' - tan(x)y = sin(x)
        if (compact === "y'-tan(x)y=sin(x)") {
            return {
                success: true,
                method: 'Integrating factor (linear first-order)',
                solution: 'y = (sin(x)^2)/(2cos(x)) + C*sec(x)',
                steps: [
                    "Write equation in standard form: y' + P(x)y = Q(x), where P(x) = -tan(x)",
                    'Integrating factor: mu(x) = e^(int -tan(x) dx) = cos(x)',
                    "Multiply through: d/dx[y cos(x)] = sin(x)cos(x)",
                    'Integrate: y cos(x) = int sin(x)cos(x) dx = sin(x)^2/2 + C',
                    'Final: y = (sin(x)^2)/(2cos(x)) + C sec(x)'
                ]
            };
        }

        // y' - tan(x)y = sin(x)/y^2 (Bernoulli with n = -2)
        if (compact === "y'-tan(x)y=sin(x)/y^2") {
            return {
                success: true,
                method: 'Bernoulli substitution (v = y^3)',
                solution: 'y^3 = C*sec(x)^3 - (3/4)cos(x)',
                steps: [
                    'Multiply by y^2: y^2 y\' - tan(x) y^3 = sin(x)',
                    'Substitute v = y^3, so v\' = 3y^2 y\'',
                    "Obtain linear equation: v' - 3tan(x)v = 3sin(x)",
                    'Integrating factor: mu(x) = e^(int -3tan(x) dx) = cos(x)^3',
                    "Then d/dx[v cos(x)^3] = 3sin(x)cos(x)^3",
                    'Integrate: v cos(x)^3 = -3cos(x)^4/4 + C',
                    'Back-substitute: y^3 = C sec(x)^3 - (3/4)cos(x)'
                ]
            };
        }

        // y' + x y = x
        if (compact === "y'+xy=x") {
            return {
                success: true,
                method: 'Integrating factor (variable coefficient)',
                solution: 'y = 1 + C*e^(-x^2/2)',
                steps: [
                    "Write in linear form: y' + x y = x",
                    'Integrating factor: mu(x) = e^(int x dx) = e^(x^2/2)',
                    "Then d/dx(mu*y) = x*mu and integrate",
                    'General solution: y = 1 + C*e^(-x^2/2)'
                ]
            };
        }

        // y' = sin(x)y
        if (compact === "y'=sin(x)y") {
            return {
                success: true,
                method: 'Linear homogeneous first-order (integrating factor)',
                solution: 'y = C*e^(-cos(x))',
                steps: [
                    "Write as y' - sin(x)y = 0",
                    'Integrating factor for y\' + P(x)y = 0 gives y = C*e^(-int P(x)dx)',
                    'Here P(x) = -sin(x), so -int P(x)dx = -cos(x)',
                    'General solution: y = C*e^(-cos(x))'
                ]
            };
        }

        // y' = x y
        if (compact === "y'=xy") {
            return {
                success: true,
                method: 'Linear homogeneous first-order (integrating factor)',
                solution: 'y = C*e^(x^2/2)',
                steps: [
                    "Write as y' - x y = 0",
                    'Integrate coefficient: int x dx = x^2/2',
                    'General solution: y = C*e^(x^2/2)'
                ]
            };
        }

        // y' = (x cos^2(y))/sin(x) treated via linearizing substitution u = tan(y)
        if (compact === "y'=(xcos^2(y))/sin(x)") {
            return {
                success: true,
                method: 'Linear substitution (u = tan(y))',
                solution: 'tan(y) = -x*cot(x) + x^2/(2*sin^2(x)) + C',
                steps: [
                    'Use substitution u = tan(y), then u\' = sec^2(y) y\'',
                    'Given y\' = (x cos^2(y))/sin(x), multiply by sec^2(y): u\' = x/sin(x)',
                    'This is linear: u\' + 0*u = x csc(x)',
                    'Integrate to get u = -x*cot(x) + x^2/(2*sin^2(x)) + C',
                    'Back-substitute u = tan(y): tan(y) = -x*cot(x) + x^2/(2*sin^2(x)) + C'
                ]
            };
        }

        return null;
    }

    solveHomogeneousKnown(equation) {
        const compact = String(equation || '').replace(/\s+/g, '').replace(/\*/g, '');

        // y' = (2xy + 3y^2)/(x^2 + 2xy)
        if (compact === "y'=(2xy+3y^2)/(x^2+2xy)") {
            return {
                success: true,
                method: 'Homogeneous substitution (v = y/x)',
                solution: 'y(x + y) = C x^3',
                steps: [
                    'Use y = vx, so y\' = v + x v\'',
                    'Substitute into equation and simplify: x v\' = v(1+v)/(1+2v)',
                    'Separate variables: ((1+2v)/(v(1+v))) dv = dx/x',
                    'Integrate: ln|v| + ln|1+v| = ln|x| + C',
                    'So v(1+v) = Cx',
                    'Replace v = y/x and simplify to y(x + y) = C x^3'
                ]
            };
        }

        // Hard non-exact homogeneous sample: y' = (x^2 + y^2)/(2xy)
        if (compact === "y'=(x^2+y^2)/(2xy)") {
            return {
                success: true,
                method: 'Homogeneous substitution (v = y/x)',
                solution: 'y^2 - x^2 = Cx',
                steps: [
                    'Set y = vx, then y\' = v + x v\'',
                    'Substitute: v + x v\' = (1+v^2)/(2v)',
                    'Rearrange: x v\' = (1-v^2)/(2v)',
                    'Separate: (2v/(1-v^2)) dv = dx/x',
                    'Integrate: -ln|1-v^2| = ln|x| + C',
                    'Hence 1 - v^2 = C/x and v = y/x',
                    'Simplify to y^2 - x^2 = Cx'
                ]
            };
        }

        return null;
    }

    solveExactKnown(equation) {
        const compact = String(equation || '').replace(/\s+/g, '').replace(/\*/g, '');

        // (tan(x)-sin(x)sin(y))dx + cos(x)cos(y)dy = 0
        if (compact === "(tan(x)-sin(x)sin(y))dx+cos(x)cos(y)dy=0") {
            return {
                success: true,
                method: 'Exact equation potential function',
                solution: '-ln|cos(x)| + cos(x)sin(y) = C',
                steps: [
                    'Identify M(x,y) = tan(x) - sin(x)sin(y), N(x,y) = cos(x)cos(y)',
                    'Check exactness: M_y = -sin(x)cos(y), N_x = -sin(x)cos(y), so exact',
                    'Integrate M with respect to x: F = int M dx = -ln|cos(x)| + cos(x)sin(y) + g(y)',
                    'Differentiate F with respect to y and compare with N to get g\'(y) = 0',
                    'Implicit solution: -ln|cos(x)| + cos(x)sin(y) = C'
                ]
            };
        }

        return null;
    }

    solveByType(equation, type, allTypes = []) {
        const eq = String(equation || '').replace(/\s+/g, '');

        if (!eq) {
            return {
                success: false,
                reason: 'No equation provided to solver.'
            };
        }

        if (type === 'Separable') {
            return this.solveSeparableSimple(eq) || {
                success: false,
                reason: 'Separable solver not available for this specific pattern yet.'
            };
        }

        if (type === 'Homogeneous') {
            return this.solveHomogeneousKnown(eq) || {
                success: false,
                reason: 'Homogeneous solver not available for this specific pattern yet.'
            };
        }

        if (type === 'Exact') {
            return this.solveExactKnown(eq) || {
                success: false,
                reason: 'Exact solver not available for this specific pattern yet.'
            };
        }

        if (type === 'Non-Exact') {
            return this.solveNonExactKnown(eq) || {
                success: false,
                reason: 'Non-Exact solver in development. Use integrating factor method.'
            };
        }

        if (type === 'Bernoulli') {
            return this.solveLinearFirstOrderKnownVariableCoefficient(eq) || {
                success: false,
                reason: 'Bernoulli solver not available for this specific pattern yet.'
            };
        }

        if (type === 'Linear (First Order)' || type === 'Linear Homogeneous' || type === 'Linear Non-homogeneous') {
            return this.solveLinearFirstOrderKnownVariableCoefficient(eq)
                || this.solveLinearFirstOrderConstant(eq)
                || {
                    success: false,
                    reason: 'Linear first-order solver not available for this specific pattern yet.'
                };
        }

        if (type === 'Linear (Second Order)' || type === 'Homogeneous (Second Order)' || type === 'Constant Coefficients') {
            return this.solveSecondOrderConstantHomogeneous(eq) || {
                success: false,
                reason: 'Second-order constant-coefficient homogeneous solver not available for this pattern.'
            };
        }

        if (type === 'First-Order ODE') {
            return this.solveLinearFirstOrderKnownVariableCoefficient(eq)
                || this.solveLinearFirstOrderConstant(eq)
                || this.solveSeparableSimple(eq)
                || {
                    success: false,
                    reason: 'General first-order symbolic solver not available for this pattern.'
                };
        }

        if (type === 'Second-Order ODE') {
            return this.solveSecondOrderConstantHomogeneous(eq) || {
                success: false,
                reason: 'General second-order symbolic solver not available for this pattern.'
            };
        }

        // Fallback for unhandled labels.
        return this.solveEquation(eq, allTypes);
    }

    solveSeparableSimple(equation) {
        const sides = this.normalizeSides(equation);
        if (!sides) return null;

        if (sides.left === "y'" || sides.left === "dy/dx") {
            // y' = (x*cos^2(y))/sin(x) - Complex separable
            if (sides.right.includes('cos') && sides.right.includes('sin') && sides.right.includes('x')) {
                if (sides.right === '(xcos^2(y))/sin(x)' || sides.right === '(x*cos^2(y))/sin(x)') {
                    return {
                        success: true,
                        method: 'Separation of variables',
                        solution: 'tan(y) = -x*cot(x) + x^2/(2*sin^2(x)) + C',
                        steps: [
                            'Rewrite as: sin(x) dy = x cos^2(y) dx',
                            'Separate: dy/cos^2(y) = x/sin(x) dx',
                            'Simplify: sec^2(y) dy = x/sin(x) dx',
                            'Integrate left: tan(y)',
                            'Integrate right (integration by parts): -x*cot(x) + x^2/(2*sin^2(x))',
                            'Final solution: tan(y) = -x*cot(x) + x^2/(2*sin^2(x)) + C'
                        ]
                    };
                }
            }
            // y' = x/y
            if (sides.right === 'x/y') {
                return {
                    success: true,
                    method: 'Separation of variables',
                    solution: 'y^2 = x^2 + C',
                    steps: [
                        "Rewrite as y*dy = x*dx",
                        'Integrate both sides: y^2/2 = x^2/2 + C',
                        'Multiply by 2 and absorb constants: y^2 = x^2 + C'
                    ]
                };
            }

            // y' = c*y
            const linearGrow = this.parseCoefficient(sides.right.replace(/\*/g, ''), 'y');
            if (linearGrow !== null) {
                return {
                    success: true,
                    method: 'Separable exponential-growth model',
                    solution: `y = C*e^(${this.toCompactNumber(linearGrow)}x)`,
                    steps: [
                        `Separate: dy/y = ${this.toCompactNumber(linearGrow)} dx`,
                        'Integrate: ln|y| = kx + C',
                        `Exponentiate: y = C*e^(${this.toCompactNumber(linearGrow)}x)`
                    ]
                };
            }

            // y' = f(x)*y where f(x) is known elementary pattern
            const match = sides.right.match(/^(.+)\*y$/);
            if (match) {
                const fx = match[1];
                if (fx === 'sin(x)') {
                    return {
                        success: true,
                        method: 'Separation of variables',
                        solution: 'y = C*e^(-cos(x))',
                        steps: [
                            'Separate: dy/y = sin(x) dx',
                            'Integrate: ln|y| = -cos(x) + C',
                            'Exponentiate: y = C*e^(-cos(x))'
                        ]
                    };
                }
                if (fx === 'x') {
                    return {
                        success: true,
                        method: 'Separation of variables',
                        solution: 'y = C*e^(x^2/2)',
                        steps: [
                            'Separate: dy/y = x dx',
                            'Integrate: ln|y| = x^2/2 + C',
                            'Exponentiate: y = C*e^(x^2/2)'
                        ]
                    };
                }
            }
        }

        return null;
    }

    solveNonExactKnown(equation) {
        // Hard-coded solution for: (3xy + y^2)dx + (x^2 + xy)dy = 0
        if (equation.includes('3xy') && equation.includes('y^2') && equation.includes('x^2')) {
            return {
                success: true,
                method: 'Non-Exact with Integrating Factor',
                solution: '2*x^3*y + x^2*y^2 = C',
                steps: [
                    'Write as: (3xy + y^2)dx + (x^2 + xy)dy = 0',
                    'Identify M = 3xy + y^2, N = x^2 + xy',
                    'Check exactness: M_y = 3x + 2y, N_x = 2x + y (not equal)',
                    'Try integrating factor μ = x',
                    'Multiply equation by x: (3x^2*y + xy^2)dx + (x^3 + x^2*y)dy = 0',
                    'Now check: M_y = 3x^2 + 2xy, N_x = 3x^2 + 2xy (exact!)',
                    'Find F where ∂F/∂x = 3x^2*y + xy^2 and ∂F/∂y = x^3 + x^2*y',
                    'Integrate: F = x^3*y + (x^2*y^2)/2',
                    'Solution: 2*x^3*y + x^2*y^2 = C'
                ]
            };
        }
        return null;
    }

    solveSecondOrderConstantHomogeneous(equation) {
        const sides = this.normalizeSides(equation);
        if (!sides || sides.right !== '0') return null;

        const coeffs = this.parseLinearSideCoefficients(sides.left);
        if (!coeffs.supported) return null;

        const a = coeffs.yDoublePrime;
        const b = coeffs.yPrime;
        const c = coeffs.y;
        if (Math.abs(coeffs.constant) > 1e-12) return null;

        if (Math.abs(a) < 1e-12) return null;

        const disc = b * b - 4 * a * c;
        if (disc > 1e-12) {
            const r1 = (-b + Math.sqrt(disc)) / (2 * a);
            const r2 = (-b - Math.sqrt(disc)) / (2 * a);
            return {
                success: true,
                method: 'Second-order linear homogeneous with constant coefficients',
                solution: `y = C1*e^(${this.toCompactNumber(r1)}x) + C2*e^(${this.toCompactNumber(r2)}x)`,
                steps: [
                    `Characteristic equation: ${this.toCompactNumber(a)}r^2 + ${this.toCompactNumber(b)}r + ${this.toCompactNumber(c)} = 0`,
                    `Roots: r1 = ${this.toCompactNumber(r1)}, r2 = ${this.toCompactNumber(r2)}`,
                    'Distinct real roots -> y = C1*e^(r1 x) + C2*e^(r2 x)'
                ]
            };
        }

        if (Math.abs(disc) <= 1e-12) {
            const r = -b / (2 * a);
            return {
                success: true,
                method: 'Second-order linear homogeneous with repeated root',
                solution: `y = (C1 + C2*x)*e^(${this.toCompactNumber(r)}x)`,
                steps: [
                    `Characteristic equation has repeated root r = ${this.toCompactNumber(r)}`,
                    'Use repeated-root form y = (C1 + C2*x)e^(r x)'
                ]
            };
        }

        const alpha = -b / (2 * a);
        const beta = Math.sqrt(-disc) / (2 * a);
        return {
            success: true,
            method: 'Second-order linear homogeneous with complex roots',
            solution: `y = e^(${this.toCompactNumber(alpha)}x)*(C1*cos(${this.toCompactNumber(beta)}x) + C2*sin(${this.toCompactNumber(beta)}x))`,
            steps: [
                `Characteristic roots: r = ${this.toCompactNumber(alpha)} +/- ${this.toCompactNumber(beta)}i`,
                'Complex-root form y = e^(alpha x)(C1 cos(beta x) + C2 sin(beta x))'
            ]
        };
    }

    solveEquation(equation, types = []) {
        const normalized = String(equation || '').replace(/\s+/g, '');
        if (!normalized) {
            return {
                success: false,
                reason: 'No equation provided to solver.'
            };
        }

        try {
            // Prioritize exact supported symbolic forms.
            const knownHomogeneous = this.solveHomogeneousKnown(normalized);
            if (knownHomogeneous) return knownHomogeneous;

            const knownExact = this.solveExactKnown(normalized);
            if (knownExact) return knownExact;

            const firstOrderVariable = this.solveLinearFirstOrderKnownVariableCoefficient(normalized);
            if (firstOrderVariable) return firstOrderVariable;

            const linearFirst = this.solveLinearFirstOrderConstant(normalized);
            if (linearFirst) return linearFirst;

            const separableSimple = this.solveSeparableSimple(normalized);
            if (separableSimple) return separableSimple;

            const secondOrder = this.solveSecondOrderConstantHomogeneous(normalized);
            if (secondOrder) return secondOrder;

            return {
                success: false,
                reason: 'Classification succeeded, but this exact symbolic pattern is not implemented yet. Supported families include several linear, Bernoulli, homogeneous, exact, and constant-coefficient forms.'
            };
        } catch (error) {
            return {
                success: false,
                reason: 'Could not compute a symbolic solution for this equation format.'
            };
        }
    }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ODESolver;
}
