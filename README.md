# ODE Equation Identifier & Solver

A comprehensive web-based tool for identifying types of ordinary differential equations (ODEs) and suggesting appropriate solution methods.

## Features

### Equation Identification
- **First-Order ODEs:**
  - Linear (homogeneous and non-homogeneous)
  - Separable equations
  - Bernoulli equations
  - Exact equations
  - Homogeneous equations

- **Second-Order ODEs:**
  - Linear second-order equations
  - Constant coefficient equations
  - Homogeneous and non-homogeneous forms

### Solution Methods
For each identified ODE type, the tool provides:
- **Method Name**: The specific technique to use
- **Difficulty Level**: Beginner, Moderate, or Advanced
- **Solution Formula**: Mathematical representation
- **Step-by-Step Guide**: Detailed solution process
- **Worked Examples**: Concrete equation examples
- **Important Notes**: Tips and considerations

### Computed Solutions
The app now attempts to compute a symbolic general solution for supported forms:
- First-order linear equations with constant coefficients
- Common separable equations (including forms like `y' = x/y` and `y' = sin(x)y`)
- Second-order homogeneous linear equations with constant coefficients

If an equation is recognized but not yet in a supported symbolic family, the app still classifies it and shows a clear fallback message.

## How to Use

### Basic Usage
1. **Enter an equation** in the input field using the format:
   - Use `y'` for dy/dx
   - Use `y''` for d²y/dx²
   - Example: `y' + 2y = 0`

2. **Set variables** (optional):
   - Dependent variable (default: y)
   - Independent variable (default: x)

3. **Click "Identify & Analyze"** to see results

### Input Format Examples

```
Linear homogeneous:     y' + 2y = 0
Linear non-homogeneous: y' + xy = x
Separable:              y' = x/y
Bernoulli:              y' + y = y^2
Homogeneous:            xy' - y = x^2
Exact:                  2x + y + (x + y)y' = 0
Second-order:           y'' + 3y' + 2y = 0
```

## ODE Types Explained

### Linear First-Order ODE
**Form:** `y' + P(x)y = Q(x)`

Solved using the integrating factor method: `μ(x) = e^(∫P(x)dx)`

**Special case:** Linear homogeneous when Q(x) = 0

### Separable ODE
**Form:** `dy/dx = f(x)g(y)`

Can be separated: `dy/g(y) = f(x)dx` and integrated separately.

### Bernoulli ODE
**Form:** `y' + P(x)y = Q(x)y^n` (where n ≠ 0, 1)

Solved by substitution `v = y^(1-n)` to convert to linear form.

### Exact ODE
**Form:** `M(x,y)dx + N(x,y)dy = 0` where `∂M/∂y = ∂N/∂x`

Solution exists as a potential function F(x,y) = C.

### Homogeneous ODE
**Form:** `M(x,y)dx + N(x,y)dy = 0` where M and N are homogeneous

Solved by substitution `v = y/x` to convert to separable form.

### Linear Second-Order ODE
**Form:** `a(x)y'' + b(x)y' + c(x)y = f(x)`

For constant coefficients, use characteristic equation method.

## Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with CSS variables and gradients
- **JavaScript**: Equation parsing and type identification
- **Math.js**: Optional for advanced mathematical operations

## Features in Detail

### Equation Parser
- Recognizes standard mathematical notation
- Handles different derivative notations (y', dy/dx, y'', d²y/dx²)
- Identifies equation terms and structure

### Smart Classification
- Analyzes equation structure to identify type
- May identify multiple applicable types
- Recommends preferred solution method based on difficulty

### Learning Tool
- Each equation type has detailed explanation
- Step-by-step solution procedures
- Worked examples showing each equation type
- Important notes and tips for solving

## Getting Started

1. Open `index.html` in a modern web browser
2. Try one of the example equations first
3. Enter your own differential equation
4. Review the identified type(s) and suggested solution methods
5. Follow the step-by-step guide for finding the solution

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## File Structure

```
project ode/
├── index.html           # Main HTML structure
├── style.css            # All styling and themes
├── ode-identifier.js    # ODE type identification logic
├── solver.js            # Solution method database
├── app.js               # Main application logic
└── README.md            # This file
```

## Tips for Best Results

1. **Proper Format**: Use correct syntax with y' and y'' for derivatives
2. **Standard Form**: Convert equations to standard form when possible
3. **Clear Equation**: Ensure equation is mathematically valid
4. **Variable Names**: Specify dependent and independent variables if not y and x

## Example Equations by Type

| Type | Example |
|------|---------|
| Linear Homogeneous | `y' + 2y = 0` |
| Linear Non-homogeneous | `y' + xy = x` |
| Separable | `y' = x/y` |
| Bernoulli | `y' + y = y^2` |
| Homogeneous | `xy' - y = x^2` |
| Exact | `2x + y + (x + y)y' = 0` |
| 2nd Order Linear | `y'' + 3y' + 2y = 0` |
| 2nd Order Constant Coeff | `y'' + 4y' + 4y = 0` |

## Educational Use

This tool is designed for:
- **Students** learning differential equations
- **Instructors** demonstrating ODE types
- **Engineers** identifying solution methods
- **Researchers** analyzing equation structures

## Future Enhancements

Potential additions:
- Numerical equation solver
- Step-by-step solution generation
- LaTeX equation rendering
- Solution verification
- More advanced ODE types
- Phase plane visualization for 2D systems

## Notes

- This is an educational tool for identifying ODE types
- For verified solutions, consult textbooks or symbolic math software
- Complex equations may require manual analysis
- Some equations may require creative transformation before identification

## License

Educational use permitted.

---

**Version**: 1.0  
**Last Updated**: April 2026
