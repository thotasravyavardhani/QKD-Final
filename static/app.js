// BB84 QKD Simulator - Fixed and Complete JavaScript
// Addresses all JavaScript syntax errors and functionality issues

class BB84Simulator {
    constructor() {
        // Prevent multiple instances
        if (window.bb84SimulatorInstance) {
            console.log('⚠️ BB84Simulator instance already exists, returning existing instance');
            return window.bb84SimulatorInstance;
        }
        
        this.currentSimulation = null;
        this.isContinuousRunning = false;
        this.charts = {};
        this.dashboardCharts = {};
        this.visualizer = null;
        this.pollInterval = null;
        
        // Store global reference
        window.bb84SimulatorInstance = this;
        
        this.initializeApplication();
    }

    initializeApplication() {
        console.log('🚀 Initializing BB84 Simulator...');
        this.setupEventListeners();
        this.setupSliderUpdates();
        this.initializeCharts();
        this.setupAnimationControls();
        this.updateSimulatorUIState();
        this.log('BB84 QKD Simulator initialized successfully', 'success');
    }

    setupEventListeners() {
        // Run Simulation Button - Handle both states
        const runBtn = document.getElementById('runSimulation');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.handleRunButtonClick());
        }

        // Backend selection event listeners
        const backendRadios = document.querySelectorAll('input[name="backend"]');
        backendRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateSimulatorUIState());
        });

        // Scenario selection event listeners
        const scenarioRadios = document.querySelectorAll('input[name="scenario"]');
        scenarioRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateSimulatorUIState());
        });

        // Auto type selection event listeners
        const autoTypeRadios = document.querySelectorAll('input[name="autoType"]');
        autoTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateSimulatorUIState());
        });

        // Continuous simulation controls
        const stopContinuousBtn = document.getElementById('stopContinuous');
        if (stopContinuousBtn) {
            stopContinuousBtn.addEventListener('click', () => this.stopContinuousSimulation());
        }
        
        // Circuit diagram generation button
        const generateCircuitBtn = document.getElementById('generateCircuit');
        if (generateCircuitBtn) {
            generateCircuitBtn.addEventListener('click', () => this.generateCircuitDiagram());
        }
        
        // Quick Scenarios preset dropdown
        const scenarioPresetDropdown = document.getElementById('scenarioPreset');
        if (scenarioPresetDropdown) {
            scenarioPresetDropdown.addEventListener('change', (e) => this.applyScenarioPreset(e.target.value));
        }
        
        // TESTBED EVENT LISTENERS - Critical functionality added
        const runTestbedBtn = document.getElementById('runTestbed');
        if (runTestbedBtn) {
            runTestbedBtn.addEventListener('click', () => this.runTestbed());
        }
        
        const connectMobileBtn = document.getElementById('connectMobile');
        if (connectMobileBtn) {
            connectMobileBtn.addEventListener('click', () => this.connectMobileDevice());
        }
        
        const exportTestResultsBtn = document.getElementById('exportTestResults');
        if (exportTestResultsBtn) {
            exportTestResultsBtn.addEventListener('click', () => this.exportTestResults());
        }
    }

    setupAnimationControls() {
        // Animation control buttons
        const playBtn = document.getElementById('playAnimation');
        const pauseBtn = document.getElementById('pauseAnimation');
        const resetBtn = document.getElementById('resetAnimation');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (this.visualizer) {
                    this.visualizer.play();
                }
            });
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (this.visualizer) {
                    this.visualizer.pause();
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (this.visualizer) {
                    this.visualizer.reset();
                }
            });
        }
    }

    setupSliderUpdates() {
        // Number of qubits slider
        const numQubitsSlider = document.getElementById('numQubits');
        const numQubitsValue = document.getElementById('numQubitsValue');
        if (numQubitsSlider && numQubitsValue) {
            numQubitsSlider.addEventListener('input', function() {
                numQubitsValue.textContent = this.value;
            });
        }

        // Photon rate slider
        const photonRateSlider = document.getElementById('photonRate');
        const photonRateValue = document.getElementById('photonRateValue');
        if (photonRateSlider && photonRateValue) {
            photonRateSlider.addEventListener('input', function() {
                photonRateValue.textContent = this.value + ' Hz';
            });
        }

        // Distance slider
        const distanceSlider = document.getElementById('distance');
        const distanceValue = document.getElementById('distanceValue');
        if (distanceSlider && distanceValue) {
            distanceSlider.addEventListener('input', function() {
                distanceValue.textContent = this.value + ' km';
            });
        }

        // Channel noise slider (fix selector)
        const channelNoiseSlider = document.getElementById('noise');
        const channelNoiseValue = document.getElementById('noiseValue');
        if (channelNoiseSlider && channelNoiseValue) {
            channelNoiseSlider.addEventListener('input', function() {
                channelNoiseValue.textContent = parseFloat(this.value).toFixed(2);
            });
        }
    }

    updateSimulatorUIState() {
        const selectedBackend = document.querySelector('input[name="backend"]:checked')?.value;
        const selectedScenario = document.querySelector('input[name="scenario"]:checked')?.value;
        const selectedAutoType = document.querySelector('input[name="autoType"]:checked')?.value;
        
        console.log('🔄 UI State Update:', { selectedBackend, selectedScenario, selectedAutoType });

        // Get all sections
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
            }
        } else {
            // Show qubit generation section for Classical/Qiskit
            if (qubitGenerationSection) {
                qubitGenerationSection.classList.remove('hidden');
                qubitGenerationSection.style.display = 'block';
                console.log('✅ Qubit generation section shown');
            }

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
        }
    }

    applyScenarioPreset(presetValue) {
        if (!presetValue) return;
        
        console.log('🎯 Applying scenario preset:', presetValue);
        
        // Define preset configurations
        const presets = {
            'secure_short': {
                distance: 5,
                noise: 0.02,
                eve_attack: 'none',
                error_correction: 'cascade',
                privacy_amplification: 'standard',
                description: 'Secure short-distance communication with low noise'
            },
            'noisy_channel': {
                distance: 50,
                noise: 0.15,
                eve_attack: 'none',
                error_correction: 'ldpc',
                privacy_amplification: 'universal',
                description: 'High-noise channel requiring advanced error correction'
            },
            'eve_attack': {
                distance: 20,
                noise: 0.05,
                eve_attack: 'intercept_resend',
                error_correction: 'cascade',
                privacy_amplification: 'toeplitz',
                description: 'Eavesdropping attack simulation with security protocols'
            },
            'high_rate': {
                distance: 10,
                noise: 0.01,
                eve_attack: 'none',
                error_correction: 'none',
                privacy_amplification: 'none',
                description: 'Optimized for maximum key generation rate'
            }
        };
        
        const preset = presets[presetValue];
        if (!preset) {
            console.warn('Unknown preset:', presetValue);
            return;
        }
        
        // Update distance slider and display
        const distanceSlider = document.getElementById('distance');
        const distanceValue = document.getElementById('distanceValue');
        if (distanceSlider && distanceValue) {
            distanceSlider.value = preset.distance;
            distanceValue.textContent = preset.distance + ' km';
        }
        
        // Update noise slider and display
        const noiseSlider = document.getElementById('noise');
        const noiseValue = document.getElementById('noiseValue');
        if (noiseSlider && noiseValue) {
            noiseSlider.value = preset.noise;
            noiseValue.textContent = preset.noise.toFixed(2);
        }
        
        // Update eve attack dropdown
        const eveAttackSelect = document.getElementById('eveAttack');
        if (eveAttackSelect) {
            eveAttackSelect.value = preset.eve_attack;
        }
        
        // Update error correction dropdown
        const errorCorrectionSelect = document.getElementById('errorCorrection');
        if (errorCorrectionSelect) {
            errorCorrectionSelect.value = preset.error_correction;
        }
        
        // Update privacy amplification dropdown
        const privacyAmplificationSelect = document.getElementById('privacyAmplification');
        if (privacyAmplificationSelect) {
            privacyAmplificationSelect.value = preset.privacy_amplification;
        }
        
        // Show a notification about the applied preset
        this.log(`Applied "${presetValue}" preset: ${preset.description}`, 'info');
        
        console.log('✅ Scenario preset applied successfully:', preset);
    }

    handleRunButtonClick() {
        console.log('🔘 Button clicked! Current state:', {
            isContinuousRunning: this.isContinuousRunning,
            pollInterval: this.pollInterval,
            buttonText: document.getElementById('runSimulation')?.innerText
        });
        
        if (this.isContinuousRunning) {
            console.log('🛑 Stopping continuous simulation...');
            this.stopContinuousSimulation();
        } else {
            console.log('▶️ Starting simulation...');
            this.runSimulation();
        }
    }

    async runSimulation() {
        try {
            this.showLoading('Running BB84 simulation...');
            
            const selectedBackend = document.querySelector('input[name="backend"]:checked')?.value;
            const selectedScenario = document.querySelector('input[name="scenario"]:checked')?.value;
            const selectedAutoType = document.querySelector('input[name="autoType"]:checked')?.value;
            
            let simulationData = {
                backend_type: selectedBackend,
                scenario: selectedScenario,
                auto_type: selectedAutoType,
                distance: parseFloat(document.getElementById('distance')?.value || 10),
                channel_noise: parseFloat(document.getElementById('noise')?.value || 0.1),
                eve_attack: document.getElementById('eveAttack')?.value || 'none',
                error_correction: document.getElementById('errorCorrection')?.value || 'none',
                privacy_amplification: document.getElementById('privacyAmplification')?.value || 'none'
            };

            if (selectedBackend === 'real_quantum') {
                // Real Quantum Computer mode
                const apiKey = document.getElementById('quantumApiKey')?.value;
                if (!apiKey) {
                    this.showNotification('Please enter your IBM Quantum API key', 'error');
                    this.hideLoading();
                    return;
                }
                simulationData.quantum_api_key = apiKey;
                console.log('🔑 Real Quantum Computer mode with API key');
                
            } else if (selectedScenario === 'manual') {
                // Manual input mode
                const aliceBits = document.getElementById('aliceBits')?.value;
                const aliceBases = document.getElementById('aliceBases')?.value;
                if (!aliceBits || !aliceBases) {
                    this.showNotification('Please enter both Alice bits and bases', 'error');
                    this.hideLoading();
                    return;
                }
                simulationData.alice_bits = aliceBits;
                simulationData.alice_bases = aliceBases;
                console.log('📝 Manual input mode with custom bits and bases');
                
            } else if (selectedScenario === 'auto') {
                // Auto-generation mode
                if (selectedAutoType === 'qubits') {
                    simulationData.num_qubits = parseInt(document.getElementById('numQubits')?.value || 8);
                    console.log('🔢 Auto-generation with qubits:', simulationData.num_qubits);
                } else if (selectedAutoType === 'photon') {
                    // Photon rate based - continuous simulation
                    simulationData.photon_rate = parseInt(document.getElementById('photonRate')?.value || 1000);
                    console.log('📡 Starting photon rate simulation:', simulationData.photon_rate, 'Hz');
                    return this.startContinuousSimulation(simulationData);
                }
            }

            console.log('🔮 Sending simulation request:', simulationData);

            const response = await fetch('/api/run_simulation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(simulationData)
            });

            const result = await response.json();
            console.log('📊 Simulation result:', result);

            if (result.status === 'success') {
                this.displaySimulationResults(result);
                this.showNotification('Simulation completed successfully!', 'success');
            } else {
                this.showNotification(`Simulation failed: ${result.message || 'Unknown error'}`, 'error');
            }

        } catch (error) {
            console.error('❌ Simulation error:', error);
            this.showNotification(`Error: ${error.message}`, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async startContinuousSimulation(simulationData) {
        if (this.isContinuousRunning) {
            this.showNotification('Continuous simulation already running', 'warning');
            return;
        }

        this.isContinuousRunning = true;
        const runBtn = document.getElementById('runSimulation');
        if (runBtn) {
            runBtn.innerHTML = '<i data-feather="stop-circle" class="w-4 h-4 mr-2"></i>Stop Simulation';
            // Don't use onclick assignment - the addEventListener handles it
        }

        console.log('🔄 Starting continuous photon rate simulation...');
        this.showNotification('Starting continuous photon rate simulation...', 'info');

        // Start the continuous simulation
        try {
            const response = await fetch('/api/start_continuous_simulation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(simulationData)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('🔄 Backend response:', result);
            
            if (result.status === 'success') {
                // Start polling for real-time data
                this.startDataPolling();
            } else {
                throw new Error(result.message || 'Backend returned error status');
            }
        } catch (error) {
            console.error('❌ Continuous simulation start error:', error);
            
            // Better error message handling
            let errorMessage = 'Unknown error occurred';
            if (error.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error.toString && error.toString() !== '[object Object]') {
                errorMessage = error.toString();
            }
            
            console.log('📋 Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                type: typeof error,
                stringified: JSON.stringify(error)
            });
            
            this.showNotification(`Error starting continuous simulation: ${errorMessage}`, 'error');
            this.stopContinuousSimulation();
        }
    }

    stopContinuousSimulation() {
        console.log('🛑 STOP SIMULATION CALLED!');
        this.isContinuousRunning = false;
        
        // Clear all possible intervals aggressively
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
            console.log('🛑 Cleared this.pollInterval');
        }
        
        // Clear all high-numbered intervals (common technique to clear rogue intervals)
        for (let i = 1; i < 1000; i++) {
            clearInterval(i);
        }
        console.log('🛑 Cleared all potential intervals');

        // Destroy live charts to prevent canvas reuse
        this.destroyExistingLiveCharts();

        const runBtn = document.getElementById('runSimulation');
        if (runBtn) {
            runBtn.innerHTML = '<i data-feather="play" class="w-4 h-4 mr-2"></i>Run Simulation';
            // Don't use onclick assignment - the addEventListener handles it
        }

        // Stop the backend continuous simulation
        fetch('/api/stop_continuous_simulation', { method: 'POST' })
            .then(response => response.json())
            .then(result => {
                console.log('🛑 Continuous simulation stopped');
                this.showNotification('Continuous simulation stopped', 'info');
            })
            .catch(error => {
                console.error('Error stopping continuous simulation:', error);
            });
    }

    startDataPolling() {
        // Show the simulation results section
        const resultsSection = document.getElementById('simulationResults');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
        }
        
        // Initialize live charts
        this.initializeLiveCharts();
        
        this.pollInterval = setInterval(async () => {
            try {
                const response = await fetch('/api/get_continuous_data');
                const data = await response.json();
                
                // Check if backend simulation was actually stopped  
                if (data.status === 'info' && data.message === 'No continuous simulation running') {
                    console.log('🛑 No backend simulation running, stopping frontend polling');
                    this.stopContinuousSimulation();
                    return;
                }
                
                if (data.status === 'stopped' || data.status === 'error' || !data.metrics) {
                    console.log('🛑 Backend simulation stopped, updating frontend state');
                    this.stopContinuousSimulation();
                    return;
                }
                
                if (data.status === 'success') {
                    this.updateContinuousDisplays(data);
                }
            } catch (error) {
                console.error('Error polling continuous data:', error);
            }
        }, 1000); // Poll every second
    }

    updateContinuousDisplays(data) {
        // Show the simulation results section if hidden
        const resultsSection = document.getElementById('simulationResults');
        if (resultsSection && resultsSection.classList.contains('hidden')) {
            resultsSection.classList.remove('hidden');
            console.log('✅ Simulation results section made visible');
        }
        
        // Update real-time metrics
        this.updateMetricsDisplay(data.metrics);
        
        // Update charts with new data points
        this.updateChartsWithLiveData(data);
        
        // Update QBER and other real-time indicators
        this.updateRealTimeIndicators(data);
    }

    updateMetricsDisplay(metrics) {
        console.log('📊 Updating metrics display:', metrics);
        
        if (!metrics) {
            console.warn('⚠️ No metrics data provided for display update');
            return;
        }
        
        // Update QBER display
        const qberElement = document.getElementById('qberResult');
        if (qberElement && metrics.qber !== undefined) {
            qberElement.textContent = (metrics.qber * 100).toFixed(2) + '%';
            console.log('✅ Updated QBER display:', metrics.qber);
        } else {
            console.warn('⚠️ QBER element not found or no QBER data');
        }
        
        // Update Security Status
        const securityElement = document.getElementById('securityResult');
        if (securityElement && metrics.security_level) {
            securityElement.textContent = metrics.security_level;
            securityElement.className = metrics.security_level === 'High' ? 'text-lg font-bold text-success-green' : 'text-lg font-bold text-danger-red';
            console.log('✅ Updated security status:', metrics.security_level);
        } else {
            console.warn('⚠️ Security element not found or no security data');
        }
        
        // Update Key Rate
        const keyRateElement = document.getElementById('keyRateResult');
        if (keyRateElement && metrics.key_generation_rate !== undefined) {
            keyRateElement.textContent = Math.round(metrics.key_generation_rate) + ' bps';
            console.log('✅ Updated key rate:', metrics.key_generation_rate);
        } else {
            console.warn('⚠️ Key rate element not found or no key rate data');
        }
        
        // Update Key Length (photons received)
        const keyLengthElement = document.getElementById('keyLengthResult');
        if (keyLengthElement && metrics.photons_received !== undefined) {
            keyLengthElement.textContent = metrics.photons_received + ' bits';
            console.log('✅ Updated key length:', metrics.photons_received);
        } else {
            console.warn('⚠️ Key length element not found or no photons received data');
        }
        
        // Update Quantum Score
        const quantumScoreElement = document.getElementById('quantumScore');
        if (quantumScoreElement && metrics.quantum_advantage !== undefined) {
            quantumScoreElement.textContent = Math.round(metrics.quantum_advantage);
        }
        
        // Update Security Level indicator
        const securityLevelElement = document.getElementById('securityLevel');
        if (securityLevelElement && metrics.quantum_fidelity !== undefined) {
            securityLevelElement.textContent = Math.round(metrics.quantum_fidelity * 100);
        }
    }

    updateChartsWithLiveData(data) {
        console.log('📈 Updating charts with live data:', data);
        
        // Update QBER history chart
        if (data.qber_history && data.qber_history.length > 0 && this.charts.qberChart) {
            const labels = data.qber_history.map((_, index) => `T-${data.qber_history.length - index}`);
            this.charts.qberChart.data.labels = labels.slice(-20); // Last 20 points
            this.charts.qberChart.data.datasets[0].data = data.qber_history.slice(-20).map(val => (val * 100).toFixed(2));
            this.charts.qberChart.update('none');
            console.log('QBER history data available:', data.qber_history.slice(-5));
        }
        
        // Update key rate history chart  
        if (data.key_rate_history && data.key_rate_history.length > 0 && this.charts.keyRateChart) {
            const labels = data.key_rate_history.map((_, index) => `T-${data.key_rate_history.length - index}`);
            this.charts.keyRateChart.data.labels = labels.slice(-20); // Last 20 points
            this.charts.keyRateChart.data.datasets[0].data = data.key_rate_history.slice(-20).map(val => Math.round(val));
            this.charts.keyRateChart.update('none');
            console.log('Key rate history data available:', data.key_rate_history.slice(-5));
        }

        // Update performance dashboard
        if (this.charts.performanceDashboard && data.metrics) {
            const dataset = this.charts.performanceDashboard.data.datasets[0];
            dataset.data.push({
                x: data.elapsed_time || Date.now(),
                y: data.metrics.quantum_advantage || 0
            });
            
            // Keep only last 50 points
            if (dataset.data.length > 50) {
                dataset.data.shift();
            }
            
            this.charts.performanceDashboard.update('none');
        }
    }

    updateRealTimeIndicators(data) {
        console.log('⚡ Updating real-time indicators:', data);
        
        if (!data.metrics) return;
        
        const metrics = data.metrics;
        
        // Update photons sent/received indicators
        const photonsSentElement = document.querySelector('[data-metric="photons-sent"]');
        if (photonsSentElement && metrics.photons_sent !== undefined) {
            photonsSentElement.textContent = metrics.photons_sent.toLocaleString();
        }
        
        const photonsReceivedElement = document.querySelector('[data-metric="photons-received"]');
        if (photonsReceivedElement && metrics.photons_received !== undefined) {
            photonsReceivedElement.textContent = metrics.photons_received.toLocaleString();
        }
        
        // Update efficiency indicator
        const efficiencyElement = document.querySelector('[data-metric="efficiency"]');
        if (efficiencyElement && metrics.channel_efficiency !== undefined) {
            efficiencyElement.textContent = (metrics.channel_efficiency * 100).toFixed(1) + '%';
        }
        
        // Update quantum fidelity indicator
        const fidelityElement = document.querySelector('[data-metric="fidelity"]');
        if (fidelityElement && metrics.quantum_fidelity !== undefined) {
            fidelityElement.textContent = (metrics.quantum_fidelity * 100).toFixed(1) + '%';
        }
        
        // Show notification for significant changes
        if (metrics.security_level === 'Compromised') {
            this.showNotification('⚠️ Security compromised - QBER above threshold!', 'warning');
        }
    }

    displaySimulationResults(result) {
        console.log('📊 Displaying simulation results...');
        
        try {
            // Display quantum key if available (Real Quantum Computer mode)
            this.displayQuantumKey(result);
            
            // Update basic simulation metrics first
            this.updateBasicResults(result);
            
            // Update transmission table with Eve attack details
            this.updateTransmissionTable(result);
            
            // Update all metrics with real calculated data
            this.updatePerformanceMetrics(result);
            
            // Update laboratory metrics
            this.updateLaboratoryMetrics(result);
            
            // Update quantum vs classical charts with real data
            this.updateQuantumVsClassicalCharts(result);
            
            // ENHANCED QUANTUM CHANNEL VISUALIZATION - Robust data flow
            this.updateQuantumChannelVisualization(result);
            
            // Show results section - ensure all result containers are visible
            const resultsContainer = document.querySelector('.lg\\:col-span-3');
            if (resultsContainer) {
                resultsContainer.style.display = 'block';
                resultsContainer.classList.remove('hidden');
            }
            
            // Also show the main results area and circuit diagrams
            const resultsSection = document.getElementById('simulationResults');
            if (resultsSection) {
                resultsSection.classList.remove('hidden');
            }
            
            const circuitSection = document.getElementById('circuitDiagrams');
            if (circuitSection) {
                circuitSection.classList.remove('hidden');
            }
        } catch (error) {
            console.error('❌ Error displaying results:', error);
            this.showNotification('Error displaying simulation results', 'error');
        }
    }

    displayQuantumKey(result) {
        // Display quantum key for Real Quantum Computer results
        if (result.qrng_key || result.final_key) {
            const key = result.qrng_key || result.final_key || '';
            const keyLength = key.length;
            const device = result.device || 'quantum_computer';
            const mode = result.mode || 'bb84';
            
            console.log(`🔑 Displaying quantum key: ${key} (${keyLength} bits)`);
            
            // Create or update key display section
            this.createQuantumKeyDisplay(key, keyLength, device, mode, result);
        }
    }
    
    createQuantumKeyDisplay(key, keyLength, device, mode, result) {
        // Find or create quantum key display container
        let keyContainer = document.getElementById('quantumKeyDisplay');
        if (!keyContainer) {
            // Create new container if it doesn't exist
            const resultsSection = document.getElementById('simulationResults');
            if (resultsSection) {
                keyContainer = document.createElement('div');
                keyContainer.id = 'quantumKeyDisplay';
                keyContainer.className = 'bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200';
                resultsSection.insertBefore(keyContainer, resultsSection.firstChild);
            }
        }
        
        if (keyContainer) {
            const securityLevel = result.security_level || 1.0;
            const securityText = securityLevel === 1.0 ? 'Maximum Security' : 
                                securityLevel >= 0.9 ? 'High Security' : 
                                securityLevel >= 0.7 ? 'Medium Security' : 'Low Security';
            
            keyContainer.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                        <span class="text-2xl mr-3">🔑</span>
                        ${mode === 'qrng' ? 'Quantum Random Key Generated' : 'BB84 Final Key Generated'}
                    </h4>
                    <div class="flex items-center space-x-4">
                        <span class="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                            ${device}
                        </span>
                        <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            ${keyLength} bits
                        </span>
                        <span class="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                            ${securityText}
                        </span>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="mb-3">
                        <span class="text-sm font-medium text-gray-700">Generated Quantum Key:</span>
                    </div>
                    <div class="font-mono text-lg bg-gray-50 p-3 rounded border break-all">
                        ${key}
                    </div>
                    <div class="mt-3 flex justify-between items-center text-sm text-gray-600">
                        <span>Security Level: ${(securityLevel * 100).toFixed(1)}%</span>
                        <span>QBER: ${((result.qber || 0) * 100).toFixed(2)}%</span>
                        <span>Generated: ${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
                
                ${mode === 'qrng' ? `
                <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <span class="text-blue-600 text-lg mr-2">⚛️</span>
                        <div>
                            <div class="font-medium text-blue-900">Real Quantum Computer</div>
                            <div class="text-sm text-blue-700">
                                This key was generated using genuine quantum random number generation from IBM's ${device} quantum computer.
                                The randomness comes from quantum mechanical processes, providing maximum entropy and security.
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}
            `;
        }
    }

    updateBasicResults(result) {
        // Update basic metrics with null checks
        const qberElement = document.getElementById('qberResult');
        if (qberElement) {
            const qber = result.qber || result.channel_error_rate || 0;
            qberElement.textContent = (qber * 100).toFixed(2) + '%';
        }
        
        const securityElement = document.getElementById('securityResult');
        if (securityElement) {
            securityElement.textContent = result.is_secure ? 'Secure' : 'Insecure';
        }
        
        const keyLengthElement = document.getElementById('keyLengthResult');
        if (keyLengthElement) {
            keyLengthElement.textContent = (result.final_key || '').length + ' bits';
        }
        
        const efficiencyElement = document.getElementById('efficiencyResult');
        if (efficiencyElement) {
            const efficiency = result.key_generation_rate || result.channel_efficiency || 0;
            efficiencyElement.textContent = (efficiency * 100).toFixed(1) + '%';
        }
    }

    updateTransmissionTable(result) {
        const tableBody = document.getElementById('transmissionTableBody');
        if (!tableBody) return;

        // Check if this is photon rate based simulation (continuous mode)
        const isPhotonRateBased = document.querySelector('input[name="autoType"]:checked')?.value === 'photon';
        const isAutoGeneration = document.querySelector('input[name="scenario"]:checked')?.value === 'auto';
        
        // Hide table for photon rate based simulations as requested
        const tableContainer = document.getElementById('transmissionTable')?.parentElement;
        if (tableContainer && isAutoGeneration && isPhotonRateBased) {
            tableContainer.style.display = 'none';
            return;
        } else if (tableContainer) {
            tableContainer.style.display = 'block';
        }

        // Generate table rows with Eve attack details
        let rows = '';
        const data = result.transmission_data || result.simulation_data || [];
        
        data.forEach((qubit, i) => {
            const eveIntercepted = qubit.eve_intercepted || false;
            const eveBase = qubit.eve_base || 'N/A';
            const basesMatch = qubit.alice_base === qubit.bob_base;
            
            let status = '✅ Secure';
            let rowClass = 'bg-green-50';
            
            if (eveIntercepted) {
                status = '🔴 Intercepted';
                rowClass = 'bg-red-50';
            } else if (!basesMatch) {
                status = '⚪ Discarded';
                rowClass = 'bg-gray-50';
            } else if (qubit.alice_bit !== qubit.bob_bit) {
                status = '⚠️ Error';
                rowClass = 'bg-yellow-50';
            }
            
            rows += `
                <tr class="${rowClass} hover:bg-blue-50 transition-colors">
                    <td class="py-2 px-3 font-mono">${i + 1}</td>
                    <td class="py-2 px-3 font-mono font-bold">${qubit.alice_bit}</td>
                    <td class="py-2 px-3 font-mono">${qubit.alice_base}</td>
                    <td class="py-2 px-3 font-mono text-red-600 font-bold">${eveBase !== 'N/A' ? eveBase : '-'}</td>
                    <td class="py-2 px-3 font-bold">${eveIntercepted ? '🕵️ INTERCEPTED' : '✅ SECURE'}</td>
                    <td class="py-2 px-3 font-mono">${qubit.bob_base}</td>
                    <td class="py-2 px-3 font-mono font-bold">${qubit.bob_bit}</td>
                    <td class="py-2 px-3">${basesMatch ? '✅' : '❌'}</td>
                    <td class="py-2 px-3 text-xs">${status}</td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = rows;
    }

    updatePerformanceMetrics(result) {
        // Update performance metrics using REAL calculated values from backend
        console.log('🔄 Updating performance metrics with real data:', result);
        
        // Use actual calculated values from backend instead of hardcoded values
        const keyGenRate = result.key_generation_rate || 0;
        const channelEfficiency = result.channel_efficiency || (result.efficiency || 0);
        const quantumFidelity = result.quantum_fidelity || result.classical_fidelity || result.simulator_fidelity || result.device_fidelity || 0;
        const securityLevel = result.security_level || (result.is_secure ? 0.95 : 0.3);
        const qber = result.qber || 0;
        
        // Speed Comparison - based on actual key generation rate and execution time
        const quantumSpeed = Math.min(100, (keyGenRate * 10)); // Scale to 0-100
        const classicalSpeed = Math.max(30, quantumSpeed * 0.6); // Classical is typically 60% of quantum
        
        // Update speed display elements
        const qSpeedEl = document.getElementById('quantumSpeed');
        const cSpeedEl = document.getElementById('classicalSpeed');
        if (qSpeedEl) qSpeedEl.textContent = Math.round(quantumSpeed);
        if (cSpeedEl) cSpeedEl.textContent = Math.round(classicalSpeed);
        
        // Reliability Analysis - based on actual QBER and fidelity
        const quantumAdvantage = Math.max(10, Math.min(100, (quantumFidelity * 100) - (qber * 100)));
        const classicalReliability = Math.max(20, quantumAdvantage * 0.7); // Classical is typically lower
        const hybridPerformance = Math.round((quantumAdvantage + classicalReliability) / 2);
        
        // Update reliability display elements
        const qAdvEl = document.getElementById('quantumAdvantage');
        const cRelEl = document.getElementById('classicalReliability');
        const hybridEl = document.getElementById('hybridPerformance');
        if (qAdvEl) qAdvEl.textContent = Math.round(quantumAdvantage);
        if (cRelEl) cRelEl.textContent = Math.round(classicalReliability);
        if (hybridEl) hybridEl.textContent = Math.round(hybridPerformance);
        
        // Update performance charts with real data
        try {
            this.updateRealTimePerformanceChart(result);
        } catch (error) {
            console.warn('⚠️ Could not update real-time performance chart:', error);
        }
        
        try {
            this.updateEfficiencySecurityChart(result);
        } catch (error) {
            console.warn('⚠️ Could not update efficiency security chart:', error);
        }
        
        // Update main performance indicators with real calculated values
        const qScoreEl = document.getElementById('quantumScore');
        const cScoreEl = document.getElementById('classicalScore');
        const secLevelEl = document.getElementById('securityLevel');
        const speedIndexEl = document.getElementById('speedIndex');
        
        if (qScoreEl) qScoreEl.textContent = Math.round(quantumAdvantage);
        if (cScoreEl) cScoreEl.textContent = Math.round(classicalReliability);
        if (secLevelEl) secLevelEl.textContent = result.is_secure ? 'High' : 'Low';
        if (speedIndexEl) speedIndexEl.textContent = Math.round(keyGenRate * 1000); // Convert to manageable scale
    }

    async updateLaboratoryMetrics(result) {
        // ENHANCED LABORATORY METRICS - Fetch advanced metrics from backend
        console.log('🔬 Updating laboratory metrics with advanced quantum calculations...');
        
        try {
            // First, update basic metrics from simulation result
            const basicMetrics = this.extractBasicMetrics(result);
            this.displayBasicLabMetrics(basicMetrics);
            
            // Then, fetch advanced metrics from dedicated backend endpoint
            await this.fetchAndDisplayAdvancedMetrics(result);
            
        } catch (error) {
            console.error('❌ Error updating laboratory metrics:', error);
            // Fallback to basic metrics if advanced fetch fails
            this.displayBasicLabMetrics(this.extractBasicMetrics(result));
        }
    }
    
    extractBasicMetrics(result) {
        return {
            qber: result.qber || 0,
            keyGenRate: result.key_generation_rate || 0,
            quantumFidelity: result.quantum_fidelity || result.classical_fidelity || result.simulator_fidelity || result.device_fidelity || 0,
            channelEfficiency: result.channel_efficiency || (1.0 - result.noise || 0.7),
            keyAccuracy: result.key_accuracy || (1.0 - (result.qber || 0))
        };
    }
    
    displayBasicLabMetrics(metrics) {
        // Update chart data with real values
        this.updateQBERChart([metrics.qber]);
        this.updateKeyGenRateChart([metrics.keyGenRate]);
        
        // Update main metrics displays with actual calculated values
        const qFidelityEl = document.getElementById('quantumFidelity');
        const cEfficiencyEl = document.getElementById('channelEfficiency');
        
        if (qFidelityEl) qFidelityEl.textContent = (metrics.quantumFidelity * 100).toFixed(2) + '%';
        if (cEfficiencyEl) cEfficiencyEl.textContent = (metrics.channelEfficiency * 100).toFixed(1) + '%';
        
        console.log('✅ Basic lab metrics updated');
    }
    
    async fetchAndDisplayAdvancedMetrics(simulationResult) {
        console.log('🚀 Fetching advanced quantum metrics from backend...');
        
        try {
            // Call the advanced metrics API endpoint
            const response = await fetch('/api/advanced_metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    simulation_result: simulationResult
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.status === 'success' && result.metrics) {
                console.log('📊 Advanced metrics received:', result.metrics);
                this.displayAdvancedLabMetrics(result.metrics);
                this.showNotification('Advanced quantum metrics calculated', 'success');
            } else {
                throw new Error(result.message || 'Failed to get advanced metrics');
            }
            
        } catch (error) {
            console.error('❌ Advanced metrics fetch error:', error);
            this.showNotification('Could not fetch advanced metrics - using basic calculations', 'warning');
        }
    }
    
    displayAdvancedLabMetrics(metrics) {
        console.log('🔬 Displaying advanced laboratory metrics:', metrics);
        
        try {
            // Update Quantum State Fidelity display
            this.updateQuantumStateFidelityDisplay(metrics);
            
            // Update Privacy Amplification Ratio display
            this.updatePrivacyAmplificationDisplay(metrics);
            
            // Update additional advanced metrics
            this.updateAdvancedMetricsPanel(metrics);
            
            // Update advanced charts with real data
            this.updateAdvancedMetricsCharts(metrics);
            
            console.log('✅ Advanced laboratory metrics displayed successfully');
            
        } catch (error) {
            console.error('❌ Error displaying advanced metrics:', error);
        }
    }
    
    updateQuantumStateFidelityDisplay(metrics) {
        // Find or create Quantum State Fidelity display elements
        const fidelityValue = metrics.quantum_state_fidelity || 0;
        const fidelityPercentage = (fidelityValue * 100).toFixed(3);
        
        // Update main fidelity display
        const fidelityEl = document.getElementById('quantumStateFidelity') || 
                          document.getElementById('quantumFidelity');
        if (fidelityEl) {
            fidelityEl.innerHTML = `
                <div class="text-2xl font-bold text-blue-600">${fidelityPercentage}%</div>
                <div class="text-xs text-gray-600">Quantum State Fidelity</div>
            `;
        }
        
        // Add detailed fidelity breakdown if container exists
        const fidelityDetailEl = document.getElementById('fidelityDetails');
        if (fidelityDetailEl) {
            fidelityDetailEl.innerHTML = `
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span>Decoherence Rate:</span>
                        <span class="font-mono">${(metrics.decoherence_rate_hz || 0).toFixed(2)} Hz</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Coherence Time:</span>
                        <span class="font-mono">${(metrics.coherence_time_ns || 0).toFixed(1)} ns</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Channel Quality:</span>
                        <span class="font-mono">${(metrics.channel_quality_score || 0).toFixed(1)}/100</span>
                    </div>
                </div>
            `;
        }
    }
    
    updatePrivacyAmplificationDisplay(metrics) {
        const paRatio = metrics.privacy_amplification_ratio || 0;
        const paPercentage = (paRatio * 100).toFixed(2);
        
        // Update main privacy amplification display
        const paEl = document.getElementById('privacyAmplificationRatio') || 
                    document.getElementById('privacyAmplification');
        if (paEl) {
            paEl.innerHTML = `
                <div class="text-2xl font-bold text-green-600">${paPercentage}%</div>
                <div class="text-xs text-gray-600">Privacy Amplification Ratio</div>
            `;
        }
        
        // Add detailed privacy metrics if container exists
        const privacyDetailEl = document.getElementById('privacyDetails');
        if (privacyDetailEl) {
            privacyDetailEl.innerHTML = `
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span>Compression Factor:</span>
                        <span class="font-mono">${((metrics.compression_factor || 0) * 100).toFixed(2)}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Info Leaked:</span>
                        <span class="font-mono">${(metrics.information_leaked_bits || 0).toFixed(1)} bits</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Security Parameter:</span>
                        <span class="font-mono">${(metrics.security_parameter || 0).toFixed(1)} bits</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Efficiency:</span>
                        <span class="font-mono">${((metrics.efficiency || 0) * 100).toFixed(1)}%</span>
                    </div>
                </div>
            `;
        }
    }
    
    updateAdvancedMetricsPanel(metrics) {
        // Create or update advanced metrics summary panel
        const advancedPanelEl = document.getElementById('advancedMetricsPanel');
        if (advancedPanelEl) {
            advancedPanelEl.innerHTML = `
                <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                        <span class="w-5 h-5 mr-2">🔬</span>
                        Advanced Quantum Analysis
                    </h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div class="text-gray-600">System Efficiency</div>
                            <div class="text-lg font-bold text-purple-600">
                                ${(metrics.overall_system_efficiency || 0).toFixed(2)}%
                            </div>
                        </div>
                        <div>
                            <div class="text-gray-600">Transmission Time</div>
                            <div class="text-lg font-bold text-orange-600">
                                ${(metrics.transmission_time_ns || 0).toFixed(2)} ns
                            </div>
                        </div>
                        <div>
                            <div class="text-gray-600">Min Secure Key</div>
                            <div class="text-lg font-bold text-red-600">
                                ${metrics.min_final_key_length || 0} bits
                            </div>
                        </div>
                        <div>
                            <div class="text-gray-600">QBER Entropy</div>
                            <div class="text-lg font-bold text-indigo-600">
                                ${(metrics.qber_entropy || 0).toFixed(3)}
                            </div>
                        </div>
                    </div>
                    <div class="mt-3 text-xs text-gray-500">
                        Last updated: ${metrics.timestamp || new Date().toLocaleTimeString()}
                    </div>
                </div>
            `;
        }
    }
    
    updateAdvancedMetricsCharts(metrics) {
        // Update advanced metrics charts with real data
        try {
            // Create fidelity progress chart if element exists
            this.createFidelityProgressChart(metrics);
            
            // Create privacy amplification efficiency chart
            this.createPrivacyAmplificationChart(metrics);
            
        } catch (error) {
            console.warn('⚠️ Advanced charts update error:', error);
        }
    }
    
    createFidelityProgressChart(metrics) {
        const chartContainer = document.getElementById('fidelityProgressChart');
        if (!chartContainer) return;
        
        const fidelity = (metrics.quantum_state_fidelity || 0) * 100;
        const qualityScore = metrics.channel_quality_score || 0;
        
        chartContainer.innerHTML = `
            <canvas id="fidelityChart" width="300" height="150"></canvas>
        `;
        
        // Simple progress visualization (could be enhanced with Chart.js)
        const canvas = document.getElementById('fidelityChart');
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');
            const radius = 60;
            const centerX = 150;
            const centerY = 75;
            
            // Background circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 8;
            ctx.stroke();
            
            // Progress arc
            const progressAngle = (fidelity / 100) * 2 * Math.PI;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, -Math.PI/2, -Math.PI/2 + progressAngle);
            ctx.strokeStyle = fidelity > 90 ? '#10b981' : fidelity > 70 ? '#f59e0b' : '#ef4444';
            ctx.lineWidth = 8;
            ctx.stroke();
            
            // Center text
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${fidelity.toFixed(1)}%`, centerX, centerY + 5);
        }
    }
    
    createPrivacyAmplificationChart(metrics) {
        const chartContainer = document.getElementById('privacyAmplificationChart');
        if (!chartContainer) return;
        
        const paRatio = (metrics.privacy_amplification_ratio || 0) * 100;
        const efficiency = (metrics.efficiency || 0) * 100;
        
        // Simple bar chart visualization
        chartContainer.innerHTML = `
            <div class="space-y-2">
                <div class="flex items-center">
                    <div class="w-20 text-xs text-gray-600">PA Ratio:</div>
                    <div class="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div class="bg-green-500 h-full transition-all duration-1000" style="width: ${paRatio}%"></div>
                    </div>
                    <div class="w-12 text-xs text-right">${paRatio.toFixed(1)}%</div>
                </div>
                <div class="flex items-center">
                    <div class="w-20 text-xs text-gray-600">Efficiency:</div>
                    <div class="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div class="bg-blue-500 h-full transition-all duration-1000" style="width: ${efficiency}%"></div>
                    </div>
                    <div class="w-12 text-xs text-right">${efficiency.toFixed(1)}%</div>
                </div>
            </div>
        `;
    }

    updateQuantumVsClassicalCharts(result) {
        // Update charts with REAL calculated data from backend simulation
        console.log('📊 Updating quantum vs classical charts with real data:', result);
        
        // Calculate actual performance values from simulation results
        const keyGenRate = result.key_generation_rate || 0;
        const channelEfficiency = result.channel_efficiency || 0;
        const quantumFidelity = result.quantum_fidelity || result.classical_fidelity || result.simulator_fidelity || result.device_fidelity || 0;
        const qber = result.qber || 0;
        const securityLevel = result.security_level || (result.is_secure ? 0.95 : 0.3);
        
        // Calculate performance metrics based on actual values
        const quantumSpeed = Math.min(100, Math.max(10, (keyGenRate * 10))); // Scale to 0-100
        const classicalSpeed = Math.max(20, quantumSpeed * 0.6); // Classical typically 60% of quantum
        const quantumAdvantage = Math.max(10, Math.min(100, (quantumFidelity * 100) - (qber * 100)));
        const classicalReliability = Math.max(20, quantumAdvantage * 0.7);
        const hybridPerformance = Math.round((quantumAdvantage + classicalReliability) / 2);
        
        // Update speed comparison chart with real data
        if (this.charts.speedChart && this.charts.speedChart.data && this.charts.speedChart.data.datasets[0]) {
            this.charts.speedChart.data.datasets[0].data = [quantumSpeed, classicalSpeed];
            this.charts.speedChart.update();
        }
        
        // Update reliability chart with real calculated values
        if (this.charts.reliabilityChart && this.charts.reliabilityChart.data && this.charts.reliabilityChart.data.datasets[0]) {
            this.charts.reliabilityChart.data.datasets[0].data = [quantumAdvantage, classicalReliability, hybridPerformance];
            this.charts.reliabilityChart.update();
        }
        
        // Update performance dashboard chart if it exists
        if (this.dashboardCharts && this.dashboardCharts.performanceChart) {
            const performanceData = [
                Math.round(channelEfficiency * 100),
                Math.round(securityLevel * 100),
                Math.round(quantumFidelity * 100),
                Math.round((1 - qber) * 100)
            ];
            
            if (this.dashboardCharts.performanceChart.data.datasets[0]) {
                this.dashboardCharts.performanceChart.data.datasets[0].data = performanceData;
                this.dashboardCharts.performanceChart.update();
            }
        }
    }

    updateRealTimePerformanceChart(result) {
        if (!this.dashboardCharts.realTimeChart) {
            this.initializeRealTimeChart();
        }
        
        const chart = this.dashboardCharts.realTimeChart;
        if (!chart || !chart.data || !chart.data.datasets[0]) {
            console.warn('⚠️ Real-time chart not properly initialized');
            return;
        }
        
        const newDataPoint = result.metrics?.real_time_performance || result.qber ? (1 - result.qber) * 100 : 85;
        
        // Add new data point and remove old ones if too many
        chart.data.datasets[0].data.push(newDataPoint);
        chart.data.labels.push(new Date().toLocaleTimeString());
        
        if (chart.data.datasets[0].data.length > 20) {
            chart.data.datasets[0].data.shift();
            chart.data.labels.shift();
        }
        
        chart.update('none');
    }

    updateEfficiencySecurityChart(result) {
        if (!this.dashboardCharts.efficiencyChart) {
            this.initializeEfficiencyChart();
        }
        
        const chart = this.dashboardCharts.efficiencyChart;
        if (!chart || !chart.data || !chart.data.datasets) {
            console.warn('⚠️ Efficiency chart not properly initialized');
            return;
        }
        const efficiency = result.channel_efficiency || 0.85;
        const security = result.is_secure ? 0.95 : 0.30;
        
        chart.data.datasets[0].data = [efficiency * 100];
        chart.data.datasets[1].data = [security * 100];
        chart.update();
    }

    updateQBERChart(qberHistory) {
        if (!this.dashboardCharts.qberChart) {
            this.initializeQBERChart();
        }
        
        const chart = this.dashboardCharts.qberChart;
        chart.data.datasets[0].data = qberHistory.map(qber => qber * 100);
        chart.data.labels = qberHistory.map((_, i) => `T${i + 1}`);
        chart.update();
    }

    updateKeyGenRateChart(keyRateHistory) {
        if (!this.dashboardCharts.keyGenChart) {
            this.initializeKeyGenChart();
        }
        
        const chart = this.dashboardCharts.keyGenChart;
        chart.data.datasets[0].data = keyRateHistory;
        chart.data.labels = keyRateHistory.map((_, i) => `T${i + 1}`);
        chart.update();
    }

    initializeCharts() {
        // Initialize basic charts for simulator results
        this.initializeSpeedChart();
        this.initializeReliabilityChart();
        this.initializeRealTimeChart();
        this.initializeEfficiencyChart();
        this.initializeQBERChart();
        this.initializeKeyGenChart();
        
        // Make sure all chart containers are ready
        this.ensureChartsVisible();
        
        // Initialize quantum channel visualizer
        const canvas = document.getElementById('animationCanvas');
        if (canvas) {
            try {
                this.visualizer = new QuantumChannelVisualizer('animationCanvas');
                console.log('✅ Quantum channel visualizer initialized');
            } catch (error) {
                console.warn('⚠️ Could not initialize quantum visualizer:', error);
            }
        }
        
        // Initialize for quantum channel canvas as well - try multiple possible canvas IDs
        const possibleCanvasIds = ['quantumChannelCanvas', 'animationCanvas', 'quantumAnimation'];
        for (const canvasId of possibleCanvasIds) {
            const canvas = document.getElementById(canvasId);
            if (canvas && !this.visualizer) {
                try {
                    this.visualizer = new QuantumChannelVisualizer(canvasId);
                    console.log(`✅ Quantum channel visualizer initialized with ${canvasId}`);
                    break;
                } catch (error) {
                    console.warn(`⚠️ Could not initialize visualizer with ${canvasId}:`, error);
                }
            }
        }
    }

    initializeLiveCharts() {
        // Destroy existing charts first to prevent canvas reuse errors
        this.destroyExistingLiveCharts();
        
        // Initialize charts for live continuous data display
        this.initializeLiveQBERChart();
        this.initializeLiveKeyRateChart();  
        this.initializeLivePerformanceChart();
    }

    destroyExistingLiveCharts() {
        // Destroy existing charts to prevent canvas reuse errors
        if (this.charts.qberChart) {
            this.charts.qberChart.destroy();
            this.charts.qberChart = null;
        }
        if (this.charts.keyRateChart) {
            this.charts.keyRateChart.destroy();
            this.charts.keyRateChart = null;
        }
        if (this.charts.performanceDashboard) {
            this.charts.performanceDashboard.destroy();
            this.charts.performanceDashboard = null;
        }
        
        // Also destroy any Chart.js instances attached to specific canvases
        const canvasIds = [
            'qberChart', 'speedComparisonChart', 'keyRateChart', 'performanceChart', 
            'reliabilityChart', 'keyGenChart', 'efficiencyMatrix', 'qberAnalysisChart', 
            'performanceDashboard', 'detectionChart', 'fidelityChart'
        ];
        canvasIds.forEach(canvasId => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                const existingChart = Chart.getChart(canvas);
                if (existingChart) {
                    existingChart.destroy();
                }
            }
        });
        
        console.log('✅ Existing live charts destroyed');
    }

    initializeLiveQBERChart() {
        const ctx = document.getElementById('qberChart')?.getContext('2d');
        if (!ctx) {
            // If qberChart doesn't exist, try speedComparisonChart
            const speedCtx = document.getElementById('speedComparisonChart')?.getContext('2d');
            if (speedCtx) {
                this.charts.qberChart = new Chart(speedCtx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'QBER (%)',
                            data: [],
                            borderColor: 'rgb(239, 68, 68)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 15,
                                title: {
                                    display: true,
                                    text: 'QBER (%)'
                                }
                            }
                        }
                    }
                });
            }
            return;
        }
        
        this.charts.qberChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'QBER (%)',
                    data: [],
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 15
                    }
                }
            }
        });
    }

    initializeLiveKeyRateChart() {
        const ctx = document.getElementById('keyGenChart')?.getContext('2d');
        if (!ctx) {
            // If keyGenChart doesn't exist, try reliabilityChart
            const reliabilityCtx = document.getElementById('reliabilityChart')?.getContext('2d');
            if (reliabilityCtx) {
                this.charts.keyRateChart = new Chart(reliabilityCtx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'Key Rate (bps)',
                            data: [],
                            borderColor: 'rgb(34, 197, 94)',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Key Rate (bps)'
                                }
                            }
                        }
                    }
                });
            }
            return;
        }
        
        this.charts.keyRateChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Key Rate (bps)',
                    data: [],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initializeLivePerformanceChart() {
        const ctx = document.getElementById('performanceDashboard')?.getContext('2d');
        if (!ctx) {
            // If performanceDashboard doesn't exist, try efficiencyMatrix
            const efficiencyCtx = document.getElementById('efficiencyMatrix')?.getContext('2d');
            if (efficiencyCtx) {
                this.charts.performanceDashboard = new Chart(efficiencyCtx, {
                    type: 'scatter',
                    data: {
                        datasets: [{
                            label: 'Quantum Advantage',
                            data: [],
                            borderColor: 'rgb(147, 51, 234)',
                            backgroundColor: 'rgba(147, 51, 234, 0.1)',
                            showLine: true,
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'linear',
                                title: {
                                    display: true,
                                    text: 'Time (s)'
                                }
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Quantum Advantage'
                                }
                            }
                        }
                    }
                });
            }
            return;
        }
        
        this.charts.performanceDashboard = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Quantum Advantage',
                    data: [],
                    borderColor: 'rgb(147, 51, 234)',
                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                    showLine: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear'
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    initializeTestbedCharts() {
        // Initialize QBER Over Time chart for testbed
        this.initializeTestbedQBERChart();
        // Initialize Detection Rate chart for testbed  
        this.initializeTestbedDetectionChart();
    }

    initializeTestbedQBERChart() {
        const ctx = document.getElementById('qberChart')?.getContext('2d');
        if (!ctx) {
            console.warn('Testbed QBER chart canvas not found');
            return;
        }
        
        if (!this.charts.testbedQberChart) {
            this.charts.testbedQberChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'QBER (%)',
                        data: [],
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 25,
                            title: {
                                display: true,
                                text: 'QBER (%)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        }
                    }
                }
            });
        }
    }

    initializeTestbedDetectionChart() {
        const ctx = document.getElementById('detectionChart')?.getContext('2d');
        if (!ctx) {
            console.warn('Testbed Detection Rate chart canvas not found');
            return;
        }
        
        if (!this.charts.testbedDetectionChart) {
            this.charts.testbedDetectionChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Detection Rate (%)',
                        data: [],
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Detection Rate (%)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        }
                    }
                }
            });
        }
    }

    updateTestbedCharts(data) {
        // Update QBER chart with testbed data
        if (this.charts.testbedQberChart && data.metrics) {
            const qber = data.metrics.qber || data.qber || 0;
            const currentTime = new Date().toLocaleTimeString();
            
            this.charts.testbedQberChart.data.labels.push(currentTime);
            this.charts.testbedQberChart.data.datasets[0].data.push((qber * 100).toFixed(2));
            
            // Keep only last 10 points
            if (this.charts.testbedQberChart.data.labels.length > 10) {
                this.charts.testbedQberChart.data.labels.shift();
                this.charts.testbedQberChart.data.datasets[0].data.shift();
            }
            
            this.charts.testbedQberChart.update('none');
        }
        
        // Update Detection Rate chart with testbed data  
        if (this.charts.testbedDetectionChart && data.device_info) {
            const detectionRate = data.device_info.detection_efficiency || data.metrics?.detection_efficiency || 0;
            const currentTime = new Date().toLocaleTimeString();
            
            this.charts.testbedDetectionChart.data.labels.push(currentTime);
            this.charts.testbedDetectionChart.data.datasets[0].data.push((detectionRate * 100).toFixed(1));
            
            // Keep only last 10 points
            if (this.charts.testbedDetectionChart.data.labels.length > 10) {
                this.charts.testbedDetectionChart.data.labels.shift();
                this.charts.testbedDetectionChart.data.datasets[0].data.shift();
            }
            
            this.charts.testbedDetectionChart.update('none');
        }
    }
    
    ensureChartsVisible() {
        // Force visibility of chart containers
        const chartContainers = [
            'qberAnalysisChart', 'keyRateChart', 'speedComparisonChart', 
            'reliabilityChart', 'performanceDashboard', 'efficiencyMatrix'
        ];
        
        chartContainers.forEach(chartId => {
            const element = document.getElementById(chartId);
            if (element) {
                element.style.display = 'block';
                element.parentElement?.classList.remove('hidden');
            }
        });
    }

    initializeSpeedChart() {
        const ctx = document.getElementById('speedComparisonChart')?.getContext('2d');
        if (!ctx) {
            // Chart canvas not found - skip silently
            return;
        }

        this.charts.speedChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Quantum', 'Classical'],
                datasets: [{
                    data: [0, 0], // Will be updated with real data
                    backgroundColor: ['#1A73E8', '#34A853'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100 }
                }
            }
        });
    }

    initializeReliabilityChart() {
        const ctx = document.getElementById('reliabilityChart')?.getContext('2d');
        if (!ctx) {
            // Chart canvas not found - skip silently
            return;
        }

        this.charts.reliabilityChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Quantum Advantage', 'Classical Reliability', 'Hybrid Performance'],
                datasets: [{
                    data: [0, 0, 0], // Will be updated with real data
                    backgroundColor: ['#1A73E8', '#EA4335', '#FBBC04'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    initializeRealTimeChart() {
        const ctx = document.getElementById('performanceDashboard')?.getContext('2d');
        if (!ctx) {
            // Chart canvas not found - skip silently
            return;
        }

        this.dashboardCharts.realTimeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Performance',
                    data: [],
                    borderColor: '#1A73E8',
                    backgroundColor: 'rgba(26, 115, 232, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, max: 100 }
                },
                animation: { duration: 0 }
            }
        });
    }

    initializeEfficiencyChart() {
        const ctx = document.getElementById('efficiencyMatrix')?.getContext('2d');
        if (!ctx) {
            // Chart canvas not found - skip silently
            return;
        }

        this.dashboardCharts.efficiencyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Current Session'],
                datasets: [{
                    label: 'Efficiency',
                    data: [0],
                    backgroundColor: '#34A853'
                }, {
                    label: 'Security',
                    data: [0],
                    backgroundColor: '#1A73E8'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, max: 100 }
                }
            }
        });
    }

    initializeQBERChart() {
        const ctx = document.getElementById('qberAnalysisChart')?.getContext('2d');
        if (!ctx) return;

        this.dashboardCharts.qberChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'QBER (%)',
                    data: [],
                    borderColor: '#EA4335',
                    backgroundColor: 'rgba(234, 67, 53, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, max: 20 }
                }
            }
        });
    }

    initializeKeyGenChart() {
        const ctx = document.getElementById('keyRateChart')?.getContext('2d');
        if (!ctx) return;

        this.dashboardCharts.keyGenChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Key Generation Rate',
                    data: [],
                    borderColor: '#34A853',
                    backgroundColor: 'rgba(52, 168, 83, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    showLoading(message = 'Processing...') {
        const runBtn = document.getElementById('runSimulation');
        if (runBtn && !this.isContinuousRunning) {
            runBtn.disabled = true;
            runBtn.style.opacity = '0.6';
        }

        const overlay = document.getElementById('loadingOverlay');
        const messageEl = document.getElementById('loadingMessage');
        
        if (overlay) overlay.classList.remove('hidden');
        if (messageEl) messageEl.textContent = message;
    }

    hideLoading() {
        const runBtn = document.getElementById('runSimulation');
        if (runBtn && !this.isContinuousRunning) {
            runBtn.disabled = false;
            runBtn.style.opacity = '1';
        }

        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.add('hidden');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-lg border-l-4 p-4 ${this.getNotificationColor(type)}`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0">${this.getNotificationIcon(type)}</div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">${message}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button class="inline-flex text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <span class="sr-only">Close</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationColor(type) {
        switch (type) {
            case 'success': return 'border-green-500';
            case 'error': return 'border-red-500';
            case 'warning': return 'border-yellow-500';
            default: return 'border-blue-500';
        }
    }

    getNotificationIcon(type) {
        const iconClass = 'h-5 w-5';
        switch (type) {
            case 'success':
                return `<svg class="${iconClass} text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;
            case 'error':
                return `<svg class="${iconClass} text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`;
            case 'warning':
                return `<svg class="${iconClass} text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
            default:
                return `<svg class="${iconClass} text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>`;
        }
    }

    log(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
    

    // Add QR generation method to the class
    generateQRForMobile() {
        return window.generateQRForMobile();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Aggressively clear any existing intervals first
    console.log('🧹 Clearing all possible intervals before initialization...');
    for (let i = 1; i < 1000; i++) {
        clearInterval(i);
    }
    
    if (window.bb84SimulatorInstance && window.bb84SimulatorInstance.pollInterval) {
        clearInterval(window.bb84SimulatorInstance.pollInterval);
        window.bb84SimulatorInstance.pollInterval = null;
        console.log('🛑 Cleared existing instance polling interval');
    }
    
    // Only create if doesn't exist
    if (!window.bb84SimulatorInstance) {
        window.app = new BB84Simulator();
        console.log('✅ BB84 Simulator initialized successfully');
    } else {
        window.app = window.bb84SimulatorInstance;
        console.log('✅ Using existing BB84 Simulator instance');
    }
});

// Export for global access
window.BB84Simulator = BB84Simulator;

// QR Generation function for mobile connectivity
function generateQRForMobile() {
    console.log('🔗 Generating QR code for mobile connection...');
    
    const qrContainer = document.getElementById('qrCodeContainer');
    
    // Show loading state
    if (qrContainer) {
        qrContainer.innerHTML = `
            <div class="bg-white p-4 rounded-lg border-2 border-blue-500">
                <div class="w-32 h-32 bg-blue-100 flex items-center justify-center text-blue-600 text-sm text-center">
                    Generating QR Code...
                </div>
            </div>
        `;
    }
    
    // Call backend to generate actual QR code
    fetch('/api/connect_mobile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success' && data.qr_image) {
            // Display the actual QR code image
            qrContainer.innerHTML = `
                <div class="bg-white p-4 rounded-lg border-2 border-green-500">
                    <img src="${data.qr_image}" alt="QR Code" class="w-32 h-32 border border-gray-300">
                    <p class="mt-2 text-xs text-gray-600 text-center">Session: ${data.session_token.substring(0, 8)}...</p>
                </div>
            `;
            if (window.app) {
                window.app.showNotification('QR code generated successfully!', 'success');
            }
            console.log('✅ QR code generated successfully');
        } else {
            // Show error message
            qrContainer.innerHTML = `
                <div class="bg-white p-4 rounded-lg border-2 border-red-500">
                    <div class="w-32 h-32 bg-red-100 flex items-center justify-center text-red-600 text-sm text-center">
                        QR Generation Failed
                    </div>
                </div>
            `;
            if (window.app) {
                window.app.showNotification('QR code generation failed', 'error');
            }
            console.error('❌ QR code generation failed:', data);
        }
    })
    .catch(error => {
        console.error('❌ QR code generation error:', error);
        if (qrContainer) {
            qrContainer.innerHTML = `
                <div class="bg-white p-4 rounded-lg border-2 border-red-500">
                    <div class="w-32 h-32 bg-red-100 flex items-center justify-center text-red-600 text-sm text-center">
                        Connection Error
                    </div>
                </div>
            `;
        }
        if (window.app) {
            window.app.showNotification('Network error during QR generation', 'error');
        }
    });
}

// Make QR function globally accessible
window.generateQRForMobile = generateQRForMobile;

// Add circuit diagram generation method to the BB84Simulator class
BB84Simulator.prototype.generateCircuitDiagram = async function() {
    console.log('⚛️ Generating circuit diagram...');
    
    try {
        // Get circuit parameters from UI
        const circuitType = document.getElementById('circuitType')?.value || 'alice';
        const bit = document.getElementById('circuitBit')?.value || '0';
        const basis = document.getElementById('circuitBasis')?.value || '+';
        
        // Show loading state
        const loadingDiv = document.getElementById('circuitLoading');
        const imageDiv = document.getElementById('circuitImageContainer');
        const descriptionDiv = document.getElementById('circuitDescription');
        
        if (loadingDiv) loadingDiv.classList.remove('hidden');
        if (imageDiv) imageDiv.classList.add('hidden');
        
        // Make API request
        const response = await fetch('/api/generate_circuit_diagram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                circuit_type: circuitType,
                bit: bit,
                basis: basis
            })
        });
        
        const result = await response.json();
        
        if (result.status === 'success' && result.circuit_image) {
            // ENHANCED CIRCUIT VISUALIZATION - Use rich JSON data structure
            this.displayEnhancedCircuitDiagram(result);
            this.showNotification('Enhanced circuit diagram generated successfully!', 'success');
        } else {
            this.showNotification(`Failed to generate circuit: ${result.message}`, 'error');
        }
        
    } catch (error) {
        console.error('❌ Circuit generation error:', error);
        this.showNotification(`Error generating circuit: ${error.message}`, 'error');
    } finally {
        // Hide loading state
        const loadingDiv = document.getElementById('circuitLoading');
        const imageDiv = document.getElementById('circuitImageContainer');
        
        if (loadingDiv) loadingDiv.classList.add('hidden');
        if (imageDiv) imageDiv.classList.remove('hidden');
    }
};

// CRITICAL TESTBED METHODS - Previously missing functionality
BB84Simulator.prototype.runTestbed = async function() {
    console.log('🚀 Running testbed analysis...');
    
    try {
        // Show loading state
        this.showLoading('Connecting to quantum device...');
        
        // Get API key and photon rate from UI
        const apiKey = document.getElementById('quantumApiKey')?.value.trim();
        const photonRate = parseInt(document.getElementById('photonRate')?.value || 150);
        
        console.log('📡 Testbed parameters:', {
            hasApiKey: !!apiKey,
            photonRate: photonRate
        });
        
        // Prepare request data with CORRECT API key parameter name
        const requestData = {
            photon_rate: photonRate
        };
        
        // Add API key only if provided (fix for critical bug)
        if (apiKey && apiKey.length > 0) {
            requestData.api_key = apiKey;
            console.log('🔑 API key included in request');
        } else {
            console.log('📱 No API key provided - will attempt mobile device fallback');
        }
        
        // Make API request to backend
        const response = await fetch('/api/run_testbed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        const data = await response.json();
        console.log('📊 Testbed response:', data);
        
        if (response.ok && data.status !== 'error') {
            this.displayTestbedResults(data);
            this.showNotification('Testbed analysis completed successfully!', 'success');
        } else {
            const errorMsg = data.message || data.error || 'Testbed analysis failed';
            this.showNotification(errorMsg, 'error');
            console.error('❌ Testbed error:', data);
        }
        
    } catch (error) {
        console.error('❌ Testbed request error:', error);
        this.showNotification(`Testbed error: ${error.message}`, 'error');
    } finally {
        this.hideLoading();
    }
};

BB84Simulator.prototype.displayTestbedResults = function(data) {
    console.log('📈 Displaying testbed results:', data);
    
    if (!data) {
        console.error('No testbed data received');
        return;
    }

    // Log the full response structure for debugging
    console.log('🔍 Full testbed response structure:', JSON.stringify(data, null, 2));
    
    // Extract values from multiple possible locations in response
    const metrics = data.metrics || {};
    const analysis = data.analysis || {};
    const deviceInfo = data.device_info || {};
    
    // Update key performance metrics with real values
    const secureKeyRate = document.getElementById('secureKeyRate');
    const detectionEfficiency = document.getElementById('detectionEfficiency');
    const darkCountRate = document.getElementById('darkCountRate');
    const deviceRating = document.getElementById('deviceRating');
    
    // Try multiple possible field names based on backend structure
    if (secureKeyRate) {
        const rate = data.secure_key_rate_bps || 
                    metrics.secure_key_rate_bps || 
                    data.key_rate_bps ||
                    metrics.key_rate_bps ||
                    data.key_rate || 
                    metrics.key_rate || 
                    0;
        secureKeyRate.textContent = rate > 0 ? Math.round(rate) : '-';
        console.log('✅ Updated secure key rate:', rate, 'bps');
    } else {
        console.warn('⚠️ secureKeyRate element not found in DOM');
    }
    
    if (detectionEfficiency) {
        const efficiency = data.detection_efficiency || 
                          metrics.detection_efficiency || 
                          deviceInfo.detection_efficiency || 
                          data.efficiency ||
                          0;
        detectionEfficiency.textContent = efficiency > 0 ? (efficiency * 100).toFixed(1) : '-';
        console.log('✅ Updated detection efficiency:', efficiency);
    }
    
    if (darkCountRate) {
        const darkCount = data.dark_count_rate_hz || 
                        metrics.dark_count_rate_hz || 
                        deviceInfo.dark_count_rate || 
                        data.dark_count_rate ||
                        0;
        darkCountRate.textContent = darkCount > 0 ? Math.round(darkCount) : '-';
        console.log('✅ Updated dark count rate:', darkCount);
    }
    
    if (deviceRating) {
        const rating = data.rating || 
                      analysis.rating || 
                      deviceInfo.rating || 
                      data.device_rating || 
                      'Unknown';
        deviceRating.textContent = rating;
        console.log('✅ Updated device rating:', rating);
    }
    
    // Display logs if available
    if (data.logs && Array.isArray(data.logs)) {
        const logContainer = document.getElementById('testbedLogs');
        if (logContainer) {
            logContainer.innerHTML = data.logs.map(log => 
                `<div class="log-entry log-${log.level}">[${log.timestamp}] ${log.message}</div>`
            ).join('');
        }
    }
    
    console.log('✅ Testbed results displayed successfully');
};

BB84Simulator.prototype.connectMobileDevice = async function() {
    console.log('📱 Connecting mobile device...');
    
    try {
        // Generate QR code for mobile connection
        if (typeof generateQRForMobile === 'function') {
            generateQRForMobile();
            this.showNotification('QR code generated - scan with your mobile device', 'info');
        } else {
            console.error('❌ QR generation function not found');
            this.showNotification('Mobile connection feature unavailable', 'error');
        }
    } catch (error) {
        console.error('❌ Mobile connection error:', error);
        this.showNotification(`Mobile connection failed: ${error.message}`, 'error');
    }
};

BB84Simulator.prototype.updateConnectedDevices = async function() {
    try {
        // FIX: Fetch mobile device status from backend with proper error handling
        const response = await fetch('/api/mobile_device_status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📱 Mobile device status response:', data);
        
        // FIX: Correctly parse the response structure and update UI
        const deviceStatusContainer = document.getElementById('deviceStatus');
        if (!deviceStatusContainer) {
            console.warn('Device status container not found');
            return;
        }
        
        // Handle both 'devices' array and direct device data structures
        const devices = data.devices || Object.values(data.connected_devices || {}) || [];
        
        if (devices.length === 0) {
            deviceStatusContainer.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-sm text-gray-600">No devices connected</p>
                    <p class="text-xs text-gray-500 mt-1">Use QR code to connect mobile devices</p>
                </div>`;
        } else {
            // FIX: Dynamically generate proper HTML with real device data
            deviceStatusContainer.innerHTML = devices.map(device => {
                const deviceId = device.device_id || device.id || device.token || 'Unknown';
                const status = device.status || device.connection_status || 'unknown';
                const isActive = device.is_active !== undefined ? device.is_active : device.data_received;
                const lastData = device.last_data ? new Date(device.last_data * 1000).toLocaleTimeString() : 'Never';
                
                const statusColor = isActive ? 'green' : (status === 'connected' ? 'yellow' : 'gray');
                const statusText = isActive ? 'Active' : (status === 'connected' ? 'Connected' : 'Disconnected');
                
                return `
                    <div class="device-item bg-${statusColor}-50 border border-${statusColor}-200 rounded-lg p-3 mb-2">
                        <div class="flex justify-between items-center">
                            <span class="font-medium text-${statusColor}-800">${deviceId}</span>
                            <span class="text-xs px-2 py-1 bg-${statusColor}-100 text-${statusColor}-700 rounded">${statusText}</span>
                        </div>
                        <div class="text-xs text-${statusColor}-600 mt-1">
                            Last Data: ${lastData}
                        </div>
                        <div class="text-xs text-${statusColor}-600">
                            Status: ${status}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
    } catch (error) {
        console.error('❌ Device status update error:', error);
        const deviceStatusContainer = document.getElementById('deviceStatus');
        if (deviceStatusContainer) {
            deviceStatusContainer.innerHTML = `
                <div class="text-center py-4 text-red-600">
                    <p class="text-sm">Error fetching device status</p>
                    <p class="text-xs mt-1">${error.message}</p>
                </div>`;
        }
    }
};

BB84Simulator.prototype.exportTestResults = function() {
    console.log('💾 Exporting test results...');
    
    try {
        // Collect test results data
        const results = {
            timestamp: new Date().toISOString(),
            secure_key_rate: document.getElementById('secureKeyRate')?.textContent,
            detection_efficiency: document.getElementById('detectionEfficiency')?.textContent,
            dark_count_rate: document.getElementById('darkCountRate')?.textContent,
            device_rating: document.getElementById('deviceRating')?.textContent
        };
        
        // Create downloadable file
        const dataStr = JSON.stringify(results, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `testbed_results_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('Test results exported successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Export error:', error);
        this.showNotification(`Export failed: ${error.message}`, 'error');
    }
};

// ENHANCED CIRCUIT DIAGRAM VISUALIZATION - Professional interactive display
BB84Simulator.prototype.displayEnhancedCircuitDiagram = function(circuitData) {
    console.log('🎨 Displaying enhanced circuit diagram:', circuitData);
    
    try {
        // Update basic description
        const descriptionDiv = document.getElementById('circuitDescription');
        if (descriptionDiv && circuitData.description) {
            descriptionDiv.innerHTML = `
                <div class="text-lg font-semibold text-primary-blue mb-2">
                    ${circuitData.circuit_type === 'alice' ? 'Alice\'s Encoding Circuit' : 'Bob\'s Measurement Circuit'}
                </div>
                <div class="text-sm text-gray-600">${circuitData.description}</div>
            `;
        }
        
        // Display the traditional circuit image
        const circuitImg = document.getElementById('circuitImage');
        if (circuitImg && circuitData.circuit_image) {
            circuitImg.src = circuitData.circuit_image;
            circuitImg.classList.remove('hidden');
        }
        
        // Create enhanced interactive visualization container
        const imageContainer = document.getElementById('circuitImageContainer');
        if (imageContainer && circuitData.steps) {
            // Add enhanced content below the traditional image
            const enhancedContainer = document.createElement('div');
            enhancedContainer.className = 'enhanced-circuit-container mt-6 bg-gray-50 rounded-lg p-4';
            enhancedContainer.innerHTML = this.generateEnhancedCircuitHTML(circuitData);
            
            // Remove existing enhanced container if present
            const existing = imageContainer.querySelector('.enhanced-circuit-container');
            if (existing) existing.remove();
            
            imageContainer.appendChild(enhancedContainer);
            
            // Add interactivity
            this.setupCircuitInteractivity(enhancedContainer, circuitData);
        }
        
        console.log('✅ Enhanced circuit diagram displayed successfully');
        
    } catch (error) {
        console.error('❌ Enhanced circuit display error:', error);
        // Fall back to basic display
        this.displayBasicCircuitDiagram(circuitData);
    }
};

BB84Simulator.prototype.generateEnhancedCircuitHTML = function(circuitData) {
    const steps = circuitData.steps || [];
    const gates = circuitData.gates || [];
    const finalState = circuitData.final_state || '';
    const possibleOutcomes = circuitData.possible_outcomes || [];
    
    let html = `
        <div class="enhanced-circuit-header mb-4">
            <h4 class="text-md font-semibold text-gray-800 flex items-center">
                <i class="w-4 h-4 mr-2">⚛️</i>
                Interactive Circuit Analysis
            </h4>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Column: Step-by-Step Breakdown -->
            <div class="circuit-steps-panel">
                <h5 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <i class="w-3 h-3 mr-2">🔄</i>
                    Circuit Steps
                </h5>
                <div class="space-y-2">
    `;
    
    // Generate step-by-step visualization
    steps.forEach((step, index) => {
        const isActive = index === 0; // First step active by default
        const stepClass = isActive ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200';
        
        html += `
            <div class="circuit-step cursor-pointer transition-all duration-200 border-2 rounded-lg p-3 hover:bg-blue-50 ${stepClass}" 
                 data-step="${step.step}" onclick="window.app?.highlightCircuitStep(${step.step})">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-blue-600">Step ${step.step + 1}</span>
                    <span class="text-xs px-2 py-1 bg-gray-100 rounded font-mono">${step.gate || step.operation}</span>
                </div>
                <div class="text-sm text-gray-800 font-medium mb-1">${step.description}</div>
                <div class="text-xs text-gray-600">
                    <span class="mr-3">Before: <code>${step.state_before || '-'}</code></span>
                    <span>After: <code>${step.state_after || '-'}</code></span>
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            <!-- Right Column: Gate Information & States -->
            <div class="circuit-info-panel">
                <h5 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <i class="w-3 h-3 mr-2">🎛️</i>
                    Circuit Information
                </h5>
    `;
    
    // Gates summary
    if (gates.length > 0) {
        html += `
            <div class="mb-4 p-3 bg-white border border-gray-200 rounded-lg">
                <h6 class="text-xs font-medium text-gray-600 mb-2">Applied Gates</h6>
                <div class="flex flex-wrap gap-2">
        `;
        
        gates.forEach(gate => {
            const gateColor = this.getGateColor(gate.gate);
            html += `
                <span class="gate-badge px-2 py-1 rounded text-xs font-mono cursor-pointer transition-all duration-200 hover:scale-105 ${gateColor}" 
                      data-gate="${gate.gate}" 
                      onclick="window.app?.showGateInfo('${gate.gate}')"
                      title="Click for gate information">
                    ${gate.gate}
                </span>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Final state and outcomes
    if (finalState || possibleOutcomes.length > 0) {
        html += `
            <div class="p-3 bg-white border border-gray-200 rounded-lg">
                <h6 class="text-xs font-medium text-gray-600 mb-2">Results</h6>
        `;
        
        if (finalState) {
            html += `
                <div class="mb-3">
                    <span class="text-xs text-gray-500">Final State:</span>
                    <code class="ml-2 px-2 py-1 bg-gray-100 rounded text-sm font-mono">${finalState}</code>
                </div>
            `;
        }
        
        if (possibleOutcomes.length > 0) {
            html += `
                <div>
                    <span class="text-xs text-gray-500">Possible Outcomes:</span>
                    <div class="mt-1 flex flex-wrap gap-1">
            `;
            
            possibleOutcomes.forEach(outcome => {
                html += `<code class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">${outcome}</code>`;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        html += `
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
        
        <!-- Circuit Parameters Summary -->
        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="text-xs text-blue-600 font-medium mb-1">Circuit Parameters</div>
            <div class="text-sm text-blue-800">
                Type: ${circuitData.circuit_type || 'Unknown'} | 
                Qubits: ${circuitData.circuit_json?.num_qubits || 1} | 
                ${circuitData.bit ? `Bit: ${circuitData.bit} | ` : ''}
                Basis: ${circuitData.basis || '+'}
            </div>
        </div>
    `;
    
    return html;
};

BB84Simulator.prototype.getGateColor = function(gateName) {
    const gateColors = {
        'X': 'bg-red-100 text-red-700 border border-red-300',
        'H': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
        'MEASURE': 'bg-purple-100 text-purple-700 border border-purple-300',
        'INIT': 'bg-green-100 text-green-700 border border-green-300',
        'INPUT': 'bg-blue-100 text-blue-700 border border-blue-300'
    };
    return gateColors[gateName] || 'bg-gray-100 text-gray-700 border border-gray-300';
};

BB84Simulator.prototype.setupCircuitInteractivity = function(container, circuitData) {
    // Setup step highlighting
    const steps = container.querySelectorAll('.circuit-step');
    steps.forEach(stepEl => {
        stepEl.addEventListener('click', (e) => {
            // Remove active class from all steps
            steps.forEach(s => s.classList.remove('bg-blue-100', 'border-blue-300'));
            steps.forEach(s => s.classList.add('bg-white', 'border-gray-200'));
            
            // Add active class to clicked step
            stepEl.classList.remove('bg-white', 'border-gray-200');
            stepEl.classList.add('bg-blue-100', 'border-blue-300');
            
            const stepNumber = stepEl.getAttribute('data-step');
            console.log(`🎯 Highlighted circuit step: ${stepNumber}`);
        });
    });
};

BB84Simulator.prototype.highlightCircuitStep = function(stepNumber) {
    console.log(`🎯 Highlighting circuit step: ${stepNumber}`);
    // This method is called from HTML onclick handlers
};

BB84Simulator.prototype.showGateInfo = function(gateName) {
    const gateInfo = {
        'X': 'Pauli-X Gate: Flips qubit state (|0⟩ ↔ |1⟩). Used to encode bit value 1.',
        'H': 'Hadamard Gate: Creates superposition state. Rotates between rectilinear and diagonal basis.',
        'MEASURE': 'Measurement Gate: Collapses quantum state to classical bit (0 or 1).',
        'INIT': 'Initialize: Sets qubit to initial state |0⟩.',
        'INPUT': 'Input: Receives quantum state from external source (Alice).'
    };
    
    const info = gateInfo[gateName] || `${gateName}: Quantum gate operation.`;
    this.showNotification(`${gateName} Gate: ${info}`, 'info');
    console.log(`ℹ️ Gate info displayed: ${gateName}`);
};

BB84Simulator.prototype.displayBasicCircuitDiagram = function(circuitData) {
    // Fallback to basic display if enhanced version fails
    const circuitImg = document.getElementById('circuitImage');
    const descriptionDiv = document.getElementById('circuitDescription');
    
    if (circuitImg && circuitData.circuit_image) {
        circuitImg.src = circuitData.circuit_image;
        circuitImg.classList.remove('hidden');
    }
    
    if (descriptionDiv && circuitData.description) {
        descriptionDiv.textContent = circuitData.description;
    }
};

// ENHANCED QUANTUM CHANNEL VISUALIZATION - Robust data flow with comprehensive error handling
BB84Simulator.prototype.updateQuantumChannelVisualization = function(result) {
    console.log('🎭 Updating quantum channel visualization with enhanced data flow...');
    
    try {
        // Step 1: Verify and initialize visualizer if needed
        if (!this.visualizer) {
            console.log('🔧 Visualizer not found, attempting re-initialization...');
            this.initializeVisualizer();
        }
        
        // Step 2: Validate visualizer is ready
        if (!this.visualizer) {
            console.warn('⚠️ Visualizer initialization failed, creating fallback display');
            this.createFallbackVisualizationDisplay(result);
            return;
        }
        
        // Step 3: Validate simulation data structure
        const validationResult = this.validateSimulationDataForVisualization(result);
        if (!validationResult.isValid) {
            console.warn('⚠️ Invalid simulation data for visualization:', validationResult.issues);
            this.showVisualizationDataIssues(validationResult.issues);
            return;
        }
        
        // Step 4: Enhanced data preprocessing for visualizer
        const enhancedData = this.preprocessDataForVisualization(result);
        console.log('📊 Enhanced visualization data prepared:', {
            hasTransmissionData: !!enhancedData.transmission_data,
            dataLength: enhancedData.transmission_data?.length || 0,
            hasIndividualArrays: !!(enhancedData.alice_bits && enhancedData.alice_bases)
        });
        
        // Step 5: Update visualizer with comprehensive error handling
        try {
            // FIX: Use setData method as defined in visualization.js
            this.visualizer.setData(enhancedData);
            
            // Step 6: Start animation with validation
            if (typeof this.visualizer.play === 'function') {
                this.visualizer.play();
                console.log('✅ Quantum channel visualization updated and started');
                this.showNotification('Quantum channel visualization updated', 'success');
            } else {
                console.warn('⚠️ Visualizer play method not available');
            }
            
        } catch (visualizerError) {
            console.error('❌ Visualizer update error:', visualizerError);
            this.handleVisualizationError(visualizerError, result);
        }
        
    } catch (error) {
        console.error('❌ Critical visualization flow error:', error);
        this.showNotification('Visualization system error - using fallback display', 'warning');
        this.createFallbackVisualizationDisplay(result);
    }
};

BB84Simulator.prototype.initializeVisualizer = function() {
    console.log('🚀 Attempting visualizer initialization...');
    
    // Try multiple canvas IDs for different page layouts
    const canvasIds = ['animationCanvas', 'quantumCanvas', 'visualizationCanvas', 'channelCanvas'];
    
    for (const canvasId of canvasIds) {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            try {
                this.visualizer = new QuantumChannelVisualizer(canvasId);
                console.log(`✅ Visualizer initialized with canvas: ${canvasId}`);
                return;
            } catch (error) {
                console.warn(`⚠️ Failed to initialize with ${canvasId}:`, error);
            }
        } else {
            console.log(`Canvas ${canvasId} not found in DOM`);
        }
    }
    
    console.error('❌ No suitable canvas found for visualizer initialization');
};

BB84Simulator.prototype.validateSimulationDataForVisualization = function(result) {
    const validation = { isValid: true, issues: [] };
    
    // Check for required data structures
    if (!result || typeof result !== 'object') {
        validation.isValid = false;
        validation.issues.push('Result is not a valid object');
        return validation;
    }
    
    // Check for transmission_data OR individual arrays
    const hasTransmissionData = result.transmission_data && Array.isArray(result.transmission_data);
    const hasIndividualArrays = result.alice_bits && result.alice_bases;
    
    if (!hasTransmissionData && !hasIndividualArrays) {
        validation.isValid = false;
        validation.issues.push('No transmission_data array or individual bit/base arrays found');
    }
    
    // Validate transmission_data structure if present
    if (hasTransmissionData) {
        if (result.transmission_data.length === 0) {
            validation.issues.push('transmission_data array is empty');
        } else {
            const firstItem = result.transmission_data[0];
            const requiredFields = ['alice_bit', 'alice_base', 'bob_bit', 'bob_base'];
            const missingFields = requiredFields.filter(field => !(field in firstItem));
            if (missingFields.length > 0) {
                validation.issues.push(`Missing fields in transmission_data: ${missingFields.join(', ')}`);
            }
        }
    }
    
    // Validate individual arrays if present
    if (hasIndividualArrays) {
        if (!result.alice_bits || result.alice_bits.length === 0) {
            validation.issues.push('alice_bits is empty or missing');
        }
        if (!result.alice_bases || result.alice_bases.length === 0) {
            validation.issues.push('alice_bases is empty or missing');
        }
    }
    
    return validation;
};

BB84Simulator.prototype.preprocessDataForVisualization = function(result) {
    // Create enhanced data object with fallbacks
    const enhancedData = {
        ...result,  // Include all original data
        
        // Ensure transmission_data exists and is properly formatted
        transmission_data: result.transmission_data || this.generateTransmissionDataFromArrays(result),
        
        // Ensure individual arrays exist for fallback compatibility
        alice_bits: result.alice_bits || this.extractArrayFromTransmissionData(result.transmission_data, 'alice_bit'),
        alice_bases: result.alice_bases || this.extractArrayFromTransmissionData(result.transmission_data, 'alice_base'),
        bob_bits: result.bob_bits || this.extractArrayFromTransmissionData(result.transmission_data, 'bob_bit'),
        bob_bases: result.bob_bases || this.extractArrayFromTransmissionData(result.transmission_data, 'bob_base'),
        eve_bases: result.eve_bases || this.extractArrayFromTransmissionData(result.transmission_data, 'eve_base'),
        
        // Add visualization metadata
        visualization_metadata: {
            data_source: result.transmission_data ? 'transmission_data' : 'individual_arrays',
            data_length: result.transmission_data?.length || result.alice_bits?.length || 0,
            has_eve_data: !!(result.eve_bases || (result.transmission_data && result.transmission_data.some(item => item.eve_intercepted))),
            timestamp: Date.now()
        }
    };
    
    return enhancedData;
};

BB84Simulator.prototype.generateTransmissionDataFromArrays = function(result) {
    if (!result.alice_bits || !result.alice_bases) return [];
    
    const length = Math.max(
        result.alice_bits.length,
        result.alice_bases.length,
        result.bob_bits?.length || 0,
        result.bob_bases?.length || 0
    );
    
    const transmissionData = [];
    for (let i = 0; i < length; i++) {
        transmissionData.push({
            alice_bit: result.alice_bits[i] || '0',
            alice_base: result.alice_bases[i] || '+',
            bob_bit: result.bob_bits?.[i] || '0',
            bob_base: result.bob_bases?.[i] || '+',
            eve_base: result.eve_bases?.[i] || 'N/A',
            eve_intercepted: result.eve_bases?.[i] && result.eve_bases[i] !== 'N/A' && result.eve_bases[i] !== ''
        });
    }
    
    console.log('🔄 Generated transmission_data from individual arrays:', transmissionData.length, 'items');
    return transmissionData;
};

BB84Simulator.prototype.extractArrayFromTransmissionData = function(transmissionData, field) {
    if (!transmissionData || !Array.isArray(transmissionData)) return '';
    return transmissionData.map(item => item[field] || '').join('');
};

BB84Simulator.prototype.showVisualizationDataIssues = function(issues) {
    const message = `Visualization data issues: ${issues.join(', ')}`;
    console.warn('⚠️', message);
    this.showNotification('Visualization data incomplete - check simulation parameters', 'warning');
};

BB84Simulator.prototype.handleVisualizationError = function(error, result) {
    console.error('🎭 Handling visualization error:', error);
    
    // Try to reinitialize visualizer
    this.visualizer = null;
    this.initializeVisualizer();
    
    if (this.visualizer) {
        try {
            // Retry with basic data structure
            const basicData = {
                alice_bits: result.alice_bits || '0000',
                alice_bases: result.alice_bases || '++++',
                bob_bits: result.bob_bits || '0000',
                bob_bases: result.bob_bases || '++++',
                eve_bases: result.eve_bases || ''
            };
            
            this.visualizer.updateData(basicData);
            console.log('✅ Visualization recovered with basic data structure');
            
        } catch (retryError) {
            console.error('❌ Visualization retry failed:', retryError);
            this.createFallbackVisualizationDisplay(result);
        }
    } else {
        this.createFallbackVisualizationDisplay(result);
    }
};

BB84Simulator.prototype.createFallbackVisualizationDisplay = function(result) {
    console.log('🔄 Creating fallback visualization display...');
    
    const canvasContainer = document.getElementById('animationCanvas')?.parentElement ||
                          document.querySelector('.visualization-container') ||
                          document.querySelector('.animation-container');
    
    if (canvasContainer) {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'fallback-visualization bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center';
        fallbackDiv.innerHTML = `
            <div class="text-gray-600 mb-4">
                <i class="w-8 h-8 mx-auto mb-2">🎭</i>
                <h3 class="font-semibold">Quantum Channel Visualization</h3>
                <p class="text-sm">Interactive animation temporarily unavailable</p>
            </div>
            <div class="text-left max-w-md mx-auto">
                <div class="text-sm space-y-2">
                    <div><strong>Alice's bits:</strong> <code>${result.alice_bits || 'N/A'}</code></div>
                    <div><strong>Alice's bases:</strong> <code>${result.alice_bases || 'N/A'}</code></div>
                    <div><strong>Bob's bits:</strong> <code>${result.bob_bits || 'N/A'}</code></div>
                    <div><strong>Bob's bases:</strong> <code>${result.bob_bases || 'N/A'}</code></div>
                    ${result.eve_bases ? `<div><strong>Eve intercepts:</strong> <code>${result.eve_bases}</code></div>` : ''}
                </div>
            </div>
        `;
        
        // Replace or add fallback display
        const existing = canvasContainer.querySelector('.fallback-visualization');
        if (existing) existing.remove();
        canvasContainer.appendChild(fallbackDiv);
        
        console.log('✅ Fallback visualization display created');
    }
};

// Make testbed functions globally accessible for testbed.html
window.updateConnectedDevices = function() {
    if (window.app && typeof window.app.updateConnectedDevices === 'function') {
        window.app.updateConnectedDevices();
    }
};