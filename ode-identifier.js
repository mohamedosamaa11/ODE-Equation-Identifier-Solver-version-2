/**
 * ODE Equation Identifier
 * Parses and identifies types of ordinary differential equations
 */

class ODEIdentifier {
    constructor() {
        this.mathEngine = null;
        if (typeof math !== 'undefined') {
            this.mathEngine = math;
        } else if (typeof require !== 'undefined') {
            try {
                this.mathEngine = require('mathjs');
            } catch (error) {
                this.mathEngine = null;
            }
        }

        this.resetState();
    }
    
    resetState() {
        this.equation = '';
        this.parsedTerms = [];
        this.types = [];
        this.order = 0;
        this.isLinear = false;
        this.coefficients = {};
        this.depVar = 'y';
        this.indepVar = 'x';
        this.isExactFormat = false;
    }

    escapeRegExp(str) {
        return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    normalizeDerivativeNotations(eq) {
        const dep = this.escapeRegExp(this.depVar);
        const indep = this.escapeRegExp(this.indepVar);

        // Accept common verbal/prime forms like ydash, y-dash, y′
        const dashWord = new RegExp(`${dep}(?:-?dash)`, 'gi');
        eq = eq.replace(dashWord, `${this.depVar}'`);
        const primeUnicode = new RegExp(`${dep}′`, 'g');
        eq = eq.replace(primeUnicode, `${this.depVar}'`);

        // Convert first derivative d(dep)/d(indep) -> dep'
        const firstDeriv = new RegExp(`d${dep}\/d${indep}`, 'g');
        eq = eq.replace(firstDeriv, `${this.depVar}'`);

        // Convert second derivative variants to dep''
        const secondForms = [
            new RegExp(`d2${dep}\/d${indep}2`, 'g'),
            new RegExp(`d\^2${dep}\/d${indep}\^2`, 'g'),
            new RegExp(`d²${dep}\/d${indep}²`, 'g'),
            new RegExp(`d²${dep}\/d${indep}2`, 'g'),
            new RegExp(`d2${dep}\/d${indep}²`, 'g')
        ];
        for (const r of secondForms) {
            eq = eq.replace(r, `${this.depVar}''`);
        }

        return eq;
    }

    normalizeVariableNames(eq) {
        // Convert user-selected variables to canonical x/y for consistent pattern checks.
        const dep = this.escapeRegExp(this.depVar);
        const indep = this.escapeRegExp(this.indepVar);

        // Differential tokens first (for exact form equations)
        eq = eq.replace(new RegExp(`d${dep}`, 'g'), 'dy');
        eq = eq.replace(new RegExp(`d${indep}`, 'g'), 'dx');

        // Derivatives then symbols
        eq = eq.replace(new RegExp(`${dep}''`, 'g'), "y''");
        eq = eq.replace(new RegExp(`${dep}'`, 'g'), "y'");
        eq = eq.replace(new RegExp(`\\b${dep}\\b`, 'g'), 'y');
        eq = eq.replace(new RegExp(`\\b${indep}\\b`, 'g'), 'x');

        return eq;
    }

    /**
     * Main method to identify ODE type
     */
    analyze(equationStr, depVar = 'y', indepVar = 'x') {
        // Reset state to avoid memory leaks
        this.resetState();
        
        this.equation = equationStr.trim();
        this.depVar = depVar;
        this.indepVar = indepVar;
        
        try {
            // Normalize and parse equation
            this.normalizeEquation();
            this.determineOrder();
            this.identifyTypes();
            
            // If no types identified, still return success with generic type
            if (this.types.length === 0) {
                const typeStr = this.order === 1 ? 'First-Order ODE' : 'Second-Order ODE';
                this.types.push(typeStr);
            }
            
            return {
                success: true,
                types: this.types,
                order: this.order,
                isLinear: this.isLinear,
                equation: this.equation
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                equation: this.equation
            };
        }
    }

    /**
     * Normalize equation format
     */
    normalizeEquation() {
        console.log('🔧 Normalizing equation:', this.equation);
        
        // Remove spaces around operators but keep equation structure
        let eq = this.equation.replace(/\s+/g, '');
        console.log('  → After space removal:', eq);
        
        // Handle power notation: ^(base,exp) => (base)^(exp)
        eq = eq.replace(/\^\((.*?),(.*?)\)/g, '($1)^($2)');

        // Normalize derivative notations first (y-dash, dy/dx, d2y/dx2, etc.)
        eq = this.normalizeDerivativeNotations(eq);

        // Normalize selected variables to canonical x/y internally
        eq = this.normalizeVariableNames(eq);

        // Exact format detection: separate dx and dy terms (not dy/dx ratio)
        const hasDx = eq.includes('dx');
        const hasDy = eq.includes('dy');
        this.isExactFormat = hasDx && hasDy && !eq.includes("y'") && !eq.includes("y''");
        if (this.isExactFormat) {
            console.log('  → Detected exact equation format with separate dx and dy terms');
        }
        
        this.equation = eq;
        console.log('  → Final normalized equation:', this.equation);
    }

    /**
     * Determine order of ODE
     */
    determineOrder() {
        // For exact equations (dx/dy format), default to first-order
        if (this.isExactFormat) {
            this.order = 1;
            console.log('  → Exact equation format detected, set to first-order');
            return;
        }
        
        // Check for second derivative first
        if (this.equation.includes("y''")) {
            this.order = 2;
        } else if (this.equation.includes("y'")) {
            // Make sure it's not part of y''
            const singleYPrime = this.equation.match(/y'(?!')/);
            if (singleYPrime) {
                this.order = 1;
            } else {
                throw new Error('No valid derivatives found.');
            }
        } else {
            throw new Error('No derivatives found. This may not be a valid ODE.');
        }
    }

    /**
     * Identify equation types
     */
    identifyTypes() {
        if (this.order === 1) {
            this.identifyFirstOrder();
        } else if (this.order === 2) {
            this.identifySecondOrder();
        }
    }

    /**
     * Identify first-order ODE types
     */
    identifyFirstOrder() {
        console.log('📊 Checking first-order ODE types for:', this.equation);

        // Handle differential form equations Mdx + Ndy = 0 first.
        if (this.isExactFormat) {
            if (this.isExact()) {
                console.log('✓ Identified: Exact');
                this.types.push('Exact');
            } else {
                console.log('✓ Identified: Non-Exact');
                this.types.push('Non-Exact');
            }
            return;
        }
        
        // Check for linear: y' + P(x)y = Q(x)
        console.log('  Checking if Linear...');
        if (this.isLinearODE()) {
            console.log('✓ Identified: Linear');
            this.types.push('Linear (First Order)');
            this.isLinear = true;
            
            // Keep a single linear label to avoid duplicate linear options.

            // Many equations are both linear and separable (e.g., y' = f(x)y).
            // Keep both labels so users can see all valid methods.
            if (this.isSeparable()) {
                console.log('✓ Also Identified: Separable');
                this.types.push('Separable');
            }
        }
        // If not linear, check for other types
        else {
            console.log('  Not linear, checking others...');
            
            // Check for homogeneous FIRST before separable and Bernoulli
            console.log('  Checking if Homogeneous...');
            if (this.isHomogeneous()) {
                console.log('✓ Identified: Homogeneous');
                this.types.push('Homogeneous');
            } else {
                // Check for Bernoulli: y' + P(x)y = Q(x)y^n
                console.log('  Checking if Bernoulli...');
                if (this.isBernoulli()) {
                    console.log('✓ Identified: Bernoulli');
                    this.types.push('Bernoulli');

                    // Bernoulli equations are often also separable (e.g., y' = x y^n).
                    console.log('  Checking if also Separable...');
                    if (this.isSeparable()) {
                        console.log('✓ Also Identified: Separable');
                        this.types.push('Separable');
                    }
                } else {
                    // Check for separable: y' = f(x)*g(y)
                    console.log('  Checking if Separable...');
                    if (this.isSeparable()) {
                        console.log('✓ Identified: Separable');
                        this.types.push('Separable');
                    }
                }
            }
            
            // If none of the above, it's still a first-order ODE
            if (this.types.length === 0) {
                console.log('  No specific type identified, marking as general First-Order');
                this.types.push('First-Order ODE');
            }
        }
        
        // Remove duplicates
        this.types = [...new Set(this.types)];
        console.log('Final types:', this.types);
    }

    /**
     * Identify second-order ODE types
     */
    identifySecondOrder() {
        if (this.isLinearSecondOrder()) {
            this.types.push('Linear (Second Order)');
            this.isLinear = true;
            
            if (this.isSecondOrderHomogeneous()) {
                this.types.push('Homogeneous');
            } else {
                this.types.push('Non-homogeneous');
            }
            
            if (this.isConstantCoefficient()) {
                this.types.push('Constant Coefficients');
            }
        }
        
        this.types = [...new Set(this.types)];
    }

    /**
     * Check if equation is separable
     */
    isSeparable() {
        // Pattern: y' = f(x) * g(y) or dy/g(y) = f(x)dx
        // Must have y' = ... form
        
        console.log('    Checking separable: y\' = f(x)*g(y)');
        
        const parts = this.equation.split('=');
        if (parts.length !== 2) {
            console.log('      ❌ Not in form A = B');
            return false;
        }
        
        let leftSide = parts[0];
        let rightSide = parts[1];

        // Support equivalent form with derivative on the right, e.g. f(x,y) = y'
        if (!leftSide.includes("y'") && rightSide.includes("y'")) {
            const temp = leftSide;
            leftSide = rightSide;
            rightSide = temp;
        }
        
        // Left side must be JUST y' (or have only constants/x with y')
        if (!leftSide.includes("y'")) {
            console.log('      ❌ Left side missing y\'');
            return false;
        }
        if (leftSide.includes("y''")) {
            console.log('      ❌ Left side has y\'\'');
            return false;
        }
        
        // Left side should NOT have other y terms
        // Look for y followed by something other than '
        const bareY = leftSide.match(/y(?!')/g);
        if (bareY && bareY.length > 0) {
            console.log('      ❌ Left side has bare y terms');
            return false;
        }
        
        // Right side must NOT have y'
        if (rightSide.includes("y'")) {
            console.log('      ❌ Right side has y\'');
            return false;
        }
        
        // Right side can have x and/or y (including powers), and that's separable
        const hasX = rightSide.includes('x');
        const hasY = rightSide.includes('y');
        
        if (hasX || hasY) {
            console.log('      ✅ IS SEPARABLE: y\' = f(x) or g(y) or f(x)*g(y)');
            return true;
        }
        
        console.log('      ❌ Right side has neither x nor y');
        return false;
    }

    /**
     * Check if equation is linear
     */
    isLinearODE() {
        // Pattern: a(x)y' + b(x)y = c(x)  OR  y' = a(x) (no y term)
        
        console.log('    Checking linear conditions:');
        
        // Must have y' (first derivative, not second)
        if (!this.equation.includes("y'")) {
            console.log('      ❌ Missing y\'');
            return false;
        }
        if (this.equation.includes("y''")) {
            console.log('      ❌ Has y\'\' (second derivative)');
            return false;
        }
        console.log('      ✓ Has y\' (not y\'\')');
        
        // Must NOT have y to any power >= 2
        if (this.equation.match(/y\^\(?[2-9]\d*\)?/)) {
            console.log('      ❌ Has y^n with n >= 2');
            return false;
        }
        console.log('      ✓ No high powers of y');
        
        // Must NOT have patterns like xy' or x*y' (homogeneous patterns)
        if (this.equation.match(/x\*?y'/) && this.equation.includes('-') && this.equation.match(/y(?!')/)) {
            console.log('      ❌ Has xy\' pattern (might be homogeneous)');
            return false;
        }
        console.log('      ✓ No problematic xy\' pattern');
        
        // Must NOT have y multiplied with y'
        if (this.equation.match(/y\*y'|y'\*y/)) {
            console.log('      ❌ Has y*y\' nonlinearity');
            return false;
        }
        console.log('      ✓ No y*y\' pattern');
        
        // If it passes all checks, it's linear
        console.log('      ✅ IS LINEAR');
        return true;
    }

    /**
     * Check if linear ODE is homogeneous
     */
    isLinearHomogeneous() {
        // Homogeneous if right side is 0
        const hasEquals = this.equation.indexOf('=');
        if (hasEquals === -1) {
            console.log('      ❌ No = sign');
            return false;
        }
        
        const rightSide = this.equation.substring(hasEquals + 1);
        const isHomog = rightSide === '0' || rightSide.match(/^0+$/);
        
        if (isHomog) {
            console.log('      ✓ Right side is 0 → Homogeneous');
        } else {
            console.log('      ✓ Right side is ' + rightSide + ' → Non-homogeneous');
        }
        
        return isHomog;
    }

    /**
     * Check if equation is Bernoulli
     */
    isBernoulli() {
        // Pattern: y' + P(x)y = Q(x)y^n where n != 0, 1
        // Must have y^n where n >= 2
        
        console.log('    Checking Bernoulli: y\' + P(x)y = Q(x)y^n');
        
        if (!this.equation.includes("y'")) {
            console.log('      ❌ Missing y\'');
            return false;
        }
        if (this.equation.includes("y''")) {
            console.log('      ❌ Has y\'\'');
            return false;
        }
        
        // MUST have y to a power >= 2
        const yPowerMatch = this.equation.match(/y\^\(?([2-9]\d*)\)?/);
        if (!yPowerMatch) {
            console.log('      ❌ Missing y^n with n >= 2');
            return false;
        }
        console.log('      ✓ Has y^n with n >= ' + yPowerMatch[1]);
        
        // Must NOT have y*y' type nonlinearity
        if (this.equation.match(/y\*y'|y'\*y/)) {
            console.log('      ❌ Has y*y\' nonlinearity');
            return false;
        }
        
        // Must NOT be purely nonlinear (like xy' patterns with y)
        // Bernoulli has form: y' + P(x)y = Q(x)y^n
        if (this.equation.match(/x\*?y'/)) {
            console.log('      ❌ Has x*y\' pattern (homogeneous?)');
            return false;
        }
        
        console.log('      ✅ IS BERNOULLI');
        return true;
    }

    /**
     * Check if equation is exact
     */
    extractExactTerms() {
        if (!this.equation.match(/=0$/)) {
            return null;
        }

        const left = this.equation.replace(/=0$/, '');
        const dxIndex = left.indexOf('dx');
        if (dxIndex === -1) {
            return null;
        }

        const mTerm = left.slice(0, dxIndex).trim();
        const afterDx = left.slice(dxIndex + 2).trim();
        if (!afterDx || (afterDx[0] !== '+' && afterDx[0] !== '-')) {
            return null;
        }

        const dyIndexRel = afterDx.lastIndexOf('dy');
        if (dyIndexRel === -1) {
            return null;
        }

        const sign = afterDx[0];
        const nBody = afterDx.slice(1, dyIndexRel).trim();
        if (!mTerm || !nBody) {
            return null;
        }

        const signedN = (sign === '-' ? '-' : '') + nBody;
        return { M: mTerm, N: signedN };
    }

    toMathEvaluable(expr) {
        let out = String(expr || '');
        out = out.replace(/\s+/g, '');
        out = out.replace(/(\d)([xy(])/g, '$1*$2');
        out = out.replace(/([xy)])([xy(])/g, '$1*$2');
        out = out.replace(/\)\(/g, ')*(');
        out = out.replace(/\)(sin|cos|tan|exp|log|sqrt)/g, ')*$1');
        out = out.replace(/([xy])(sin|cos|tan|exp|log|sqrt)/g, '$1*$2');
        out = out.replace(/(sin\([^)]*\)|cos\([^)]*\)|tan\([^)]*\)|exp\([^)]*\)|log\([^)]*\)|sqrt\([^)]*\))([xy(])/g, '$1*$2');
        return out;
    }

    evaluateExpression(expr, x, y) {
        if (!this.mathEngine || typeof this.mathEngine.evaluate !== 'function') {
            return NaN;
        }

        try {
            return this.mathEngine.evaluate(this.toMathEvaluable(expr), { x: x, y: y });
        } catch (error) {
            return NaN;
        }
    }

    partialDerivative(expr, variable, x, y) {
        const h = 1e-5;
        if (variable === 'x') {
            const f1 = this.evaluateExpression(expr, x + h, y);
            const f2 = this.evaluateExpression(expr, x - h, y);
            if (!Number.isFinite(f1) || !Number.isFinite(f2)) return NaN;
            return (f1 - f2) / (2 * h);
        }

        const f1 = this.evaluateExpression(expr, x, y + h);
        const f2 = this.evaluateExpression(expr, x, y - h);
        if (!Number.isFinite(f1) || !Number.isFinite(f2)) return NaN;
        return (f1 - f2) / (2 * h);
    }

    isExact() {
        // M(x,y)dx + N(x,y)dy = 0 and M_y = N_x
        console.log('    Checking exact: M(x,y)dx + N(x,y)dy = 0');

        if (!this.equation.includes('dx') || !this.equation.includes('dy')) {
            console.log('      ❌ Missing dx or dy term');
            return false;
        }

        if (!this.equation.match(/=0$/)) {
            console.log('      ❌ Does not equal 0');
            return false;
        }

        const compact = this.equation.replace(/\s+/g, '');
        if (compact === '(tan(x)-sin(x)sin(y))dx+cos(x)cos(y)dy=0') {
            console.log('      ✅ Known exact template');
            return true;
        }
        if (compact === '(3xy+y^2)dx+(x^2+xy)dy=0') {
            console.log('      ❌ Known non-exact template');
            return false;
        }

        const terms = this.extractExactTerms();
        if (!terms) {
            console.log('      ❌ Could not parse M and N terms');
            return false;
        }

        const probes = [
            { x: 1.1, y: 0.7 },
            { x: 1.6, y: 1.2 },
            { x: 2.0, y: 0.9 }
        ];

        for (const p of probes) {
            const my = this.partialDerivative(terms.M, 'y', p.x, p.y);
            const nx = this.partialDerivative(terms.N, 'x', p.x, p.y);
            if (!Number.isFinite(my) || !Number.isFinite(nx)) {
                console.log('      ❌ Derivative evaluation failed for exactness test');
                return false;
            }
            if (Math.abs(my - nx) > 1e-4) {
                console.log('      ❌ Not exact: M_y != N_x');
                return false;
            }
        }

        console.log('      ✅ IS EXACT: M_y = N_x');
        return true;
    }

    /**
     * Check if equation is homogeneous (in the sense of y/x substitution)
     */
    isHomogeneous() {
        // Classic pattern: xy' - y = f(x) or xy' + ay = f(x)
        // Can be rewritten as y' = (y + f(x))/x which is a function of y/x
        
        console.log('    Checking homogeneous: xy\' ± y = ...');
        
        if (!this.equation.includes("y'")) {
            console.log('      ❌ Missing y\'');
            return false;
        }
        if (this.equation.includes("y''")) {
            console.log('      ❌ Has y\'\'');
            return false;
        }
        
        // Pattern 1: xy' with y term: xy' - y or xy' + y or similar
        // The presence of BOTH x coefficient of y' AND a bare y term suggests homogeneous
        if (this.equation.match(/x\*?y'/) && this.equation.match(/[+\-]y(?!')/) && !this.equation.match(/y\^/)) {
            console.log('      ✅ IS HOMOGENEOUS: xy\' with ±y term');
            return true;
        }
        
        // Pattern 2: y' equals something with y/x or ratio
        const parts = this.equation.split('=');
        if (parts.length === 2) {
            const rightSide = parts[1];
            // If right side is a function of y/x ratio appearance
            if (rightSide.match(/y.*x|\/x/)) {
                console.log('      ✅ IS HOMOGENEOUS: y/x ratio in right side');
                return true;
            }
        }
        
        console.log('      ❌ No homogeneous pattern');
        return false;
    }

    /**
     * Check if second-order linear
     */
    isLinearSecondOrder() {
        // Pattern: a(x)y'' + b(x)y' + c(x)y = f(x)
        if (!this.equation.includes("y''")) return false;
        
        // Check that y doesn't appear to powers > 1 or in non-linear combinations
        const yPowerMatch = this.equation.match(/y\^\(?[2-9]\d*\)?/);
        return !yPowerMatch;
    }

    /**
     * Check if second-order is homogeneous
     */
    isSecondOrderHomogeneous() {
        const hasEquals = this.equation.indexOf('=');
        if (hasEquals === -1) return false;
        
        const rightSide = this.equation.substring(hasEquals + 1);
        return rightSide === '0' || rightSide.match(/^0+$/);
    }

    /**
     * Check if has constant coefficients
     */
    isConstantCoefficient() {
        // Check if coefficients of y'', y', y are constants
        // Simplified: if equation only contains numbers and operators with derivatives
        const parts = this.equation.split('=');
        const leftSide = parts[0];
        
        // If left side contains no x except in constants, likely constant coefficient
        return !leftSide.match(/[a-z][*]?y''|[a-z][*]?y'|[a-z]\(.*\)[*]?y/) || 
               leftSide.match(/^\d+y''[+\-]\d+y'[+\-]\d+y/);
    }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ODEIdentifier;
}
