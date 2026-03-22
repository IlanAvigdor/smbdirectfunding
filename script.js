document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const amountInput = document.getElementById('funding-amount');
    const amountSlider = document.getElementById('funding-slider');
    const valRepayment = document.getElementById('val-repayment');
    const valTerm = document.getElementById('val-term');
    const valDaily = document.getElementById('val-daily');
    const btnAmount = document.getElementById('btn-amount');

    // Constants for estimation
    // For SMB funding, standard factoring might be 1.25x to 1.35x over 6 to 12 months
    const FACTOR_RATE = 1.28; // 1.28x payback
    const TERM_MONTHS = 6;
    const TRADING_DAYS_PER_MONTH = 21; // roughly 21 business days in a month
    const TOTAL_TRADING_DAYS = TERM_MONTHS * TRADING_DAYS_PER_MONTH;

    // Formatter for currency
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    // Parse numeric string removing symbols
    function parseAmount(value) {
        return parseInt(value.replace(/[^0-9]/g, '')) || 0;
    }

    // Perform Calculation and Update DOM
    function calculateTerms(amount) {
        // Enforce boundaries
        let safeAmount = Math.max(5000, Math.min(500000, amount));
        
        let repayment = safeAmount * FACTOR_RATE;
        let dailyPayment = repayment / TOTAL_TRADING_DAYS;

        // Update DOM
        valRepayment.textContent = currencyFormatter.format(repayment);
        valTerm.textContent = `${TERM_MONTHS} Months`;
        valDaily.textContent = currencyFormatter.format(dailyPayment);
        btnAmount.textContent = currencyFormatter.format(safeAmount);
        
        return safeAmount;
    }

    // Input Events
    amountInput.addEventListener('input', (e) => {
        let rawVal = e.target.value;
        let numVal = parseAmount(rawVal);
        
        // Format input while typing
        if (rawVal !== '') {
            e.target.value = new Intl.NumberFormat('en-US').format(numVal);
        }
        
        // Only trigger heavy updates if valid
        if (numVal >= 5000 && numVal <= 500000) {
            amountSlider.value = numVal;
            calculateTerms(numVal);
        }
    });

    amountInput.addEventListener('blur', (e) => {
        let numVal = parseAmount(e.target.value);
        if (numVal < 5000) numVal = 5000;
        if (numVal > 500000) numVal = 500000;
        e.target.value = new Intl.NumberFormat('en-US').format(numVal);
        amountSlider.value = numVal;
        calculateTerms(numVal);
    });

    amountSlider.addEventListener('input', (e) => {
        let numVal = parseInt(e.target.value);
        amountInput.value = new Intl.NumberFormat('en-US').format(numVal);
        calculateTerms(numVal);
    });

    // Button click animation
    const applyButton = document.getElementById('btn-apply-calculated');
    applyButton.addEventListener('click', () => {
        applyButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            applyButton.style.transform = 'scale(1)';
            alert('This would take the user to the application flow!');
        }, 150);
    });

    // Initialize with default
    calculateTerms(50000);
});
