// Comprehensive UI Fix for BB84 Simulator
// This script fixes the critical UI issues with backend selection and auto-generation options

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 UI Fix script loaded');
    
    // Fix 1: Backend Selection - Real Quantum Computer API Key Box
    function setupBackendSelection() {
        const backendRadios = document.querySelectorAll('input[name="backend"]');
        console.log('📡 Found backend radios:', backendRadios.length);
        
        backendRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const selectedBackend = this.value;
                console.log('🔄 Backend changed to:', selectedBackend);
                
                const qubitGenerationSection = document.getElementById('qubitGenerationSection');
                const quantumApiSection = document.getElementById('quantumApiSection');
                const manualSection = document.getElementById('manualInputSection');
                const autoGenOptions = document.getElementById('autoGenerationOptions');
                const numQubitsSection = document.getElementById('numQubitsSection');
                const photonRateSection = document.getElementById('photonRateSection');
                
                // Hide all sections first
                [qubitGenerationSection, quantumApiSection, manualSection, autoGenOptions, numQubitsSection, photonRateSection].forEach(section => {
                    if (section) {
                        section.classList.add('hidden');
                        section.style.display = 'none';
                    }
                });
                
                if (selectedBackend === 'real_quantum') {
                    // Show API Key section for Real Quantum Computer
                    if (quantumApiSection) {
                        quantumApiSection.classList.remove('hidden');
                        quantumApiSection.style.display = 'block';
                        console.log('✅ Real Quantum API section shown');
                    } else {
                        console.error('❌ quantumApiSection not found');
                    }
                } else {
                    // Show qubit generation section for Classical/Qiskit
                    if (qubitGenerationSection) {
                        qubitGenerationSection.classList.remove('hidden');
                        qubitGenerationSection.style.display = 'block';
                        console.log('✅ Qubit generation section shown');
                    }
                    
                    // Trigger scenario change to show appropriate sub-sections
                    const selectedScenario = document.querySelector('input[name="scenario"]:checked')?.value;
                    handleScenarioChange(selectedScenario);
                }
            });
        });
    }
    
    // Fix 2: Scenario Selection - Manual vs Auto-Generated
    function setupScenarioSelection() {
        const scenarioRadios = document.querySelectorAll('input[name="scenario"]');
        console.log('📋 Found scenario radios:', scenarioRadios.length);
        
        scenarioRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const selectedScenario = this.value;
                console.log('🔄 Scenario changed to:', selectedScenario);
                handleScenarioChange(selectedScenario);
            });
        });
    }
    
    function handleScenarioChange(selectedScenario) {
        const manualSection = document.getElementById('manualInputSection');
        const autoGenOptions = document.getElementById('autoGenerationOptions');
        const numQubitsSection = document.getElementById('numQubitsSection');
        const photonRateSection = document.getElementById('photonRateSection');
        
        // Hide all scenario-related sections first
        [manualSection, autoGenOptions, numQubitsSection, photonRateSection].forEach(section => {
            if (section) {
                section.classList.add('hidden');
                section.style.display = 'none';
            }
        });
        
        if (selectedScenario === 'manual') {
            // Show manual input section
            if (manualSection) {
                manualSection.classList.remove('hidden');
                manualSection.style.display = 'block';
                console.log('✅ Manual input section shown');
            }
        } else if (selectedScenario === 'auto') {
            // Show auto-generation options
            if (autoGenOptions) {
                autoGenOptions.classList.remove('hidden');
                autoGenOptions.style.display = 'block';
                console.log('✅ Auto-generation options shown');
            }
            
            // Trigger auto type change to show appropriate sub-section
            const selectedAutoType = document.querySelector('input[name="autoType"]:checked')?.value;
            handleAutoTypeChange(selectedAutoType);
        }
    }
    
    // Fix 3: Auto-Generation Type - Number of Qubits vs Photon Rate Based
    function setupAutoTypeSelection() {
        const autoTypeRadios = document.querySelectorAll('input[name="autoType"]');
        console.log('⚡ Found auto type radios:', autoTypeRadios.length);
        
        autoTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const selectedAutoType = this.value;
                console.log('🔄 Auto type changed to:', selectedAutoType);
                handleAutoTypeChange(selectedAutoType);
            });
        });
    }
    
    function handleAutoTypeChange(selectedAutoType) {
        const numQubitsSection = document.getElementById('numQubitsSection');
        const photonRateSection = document.getElementById('photonRateSection');
        
        // Hide both sections first
        [numQubitsSection, photonRateSection].forEach(section => {
            if (section) {
                section.classList.add('hidden');
                section.style.display = 'none';
            }
        });
        
        if (selectedAutoType === 'qubits') {
            // Show number of qubits section
            if (numQubitsSection) {
                numQubitsSection.classList.remove('hidden');
                numQubitsSection.style.display = 'block';
                console.log('✅ Number of qubits section shown');
            }
        } else if (selectedAutoType === 'photon') {
            // Show photon rate section
            if (photonRateSection) {
                photonRateSection.classList.remove('hidden');
                photonRateSection.style.display = 'block';
                console.log('✅ Photon rate section shown');
            }
        }
    }
    
    // Initialize all UI components
    console.log('🚀 Initializing UI components...');
    setupBackendSelection();
    setupScenarioSelection();
    setupAutoTypeSelection();
    
    // Trigger initial state based on current selections
    const initialBackend = document.querySelector('input[name="backend"]:checked')?.value;
    const initialScenario = document.querySelector('input[name="scenario"]:checked')?.value;
    const initialAutoType = document.querySelector('input[name="autoType"]:checked')?.value;
    
    console.log('🏁 Initial state:', { initialBackend, initialScenario, initialAutoType });
    
    // Set initial visibility based on current selections
    if (initialBackend) {
        document.querySelector(`input[name="backend"][value="${initialBackend}"]`).dispatchEvent(new Event('change'));
    }
    
    console.log('✅ UI Fix script initialization complete');
});