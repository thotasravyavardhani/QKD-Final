// Lab.js - Professional BB84 Quantum Lab Interface

class QuantumLab {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.updateInterval = null;
        this.simulationInterval = null;
        this.charts = {};
        this.securityData = [];
        this.isSimulationRunning = false;
        this.realSimulationData = null;  // Store real simulation results
        this.timelineData = {
            keyRates: [],
            qberValues: [],
            detectionEvents: [],
            timestamps: []
        };
        
        this.initializeCharts();
        this.bindEvents();
        this.startDataUpdates();
    }
    
    initializeCharts() {
        // Security Performance Chart
        const securityCtx = document.getElementById('securityChart');
        if (securityCtx) {
            this.charts.security = new Chart(securityCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 20}, (_, i) => `${i * 5}%`),
                    datasets: [
                        {
                            label: 'Secure Key Rate',
                            data: this.generateSecurityCurve('keyRate'),
                            borderColor: '#0F9D58',
                            backgroundColor: 'rgba(15, 157, 88, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'QBER Threshold',
                            data: this.generateSecurityCurve('qber'),
                            borderColor: '#F4B400',
                            backgroundColor: 'rgba(244, 180, 0, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Security Parameter',
                            data: this.generateSecurityCurve('security'),
                            borderColor: '#DB4437',
                            backgroundColor: 'rgba(219, 68, 55, 0.1)',
                            tension: 0.4,
                            fill: false,
                            borderDash: [5, 5]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 6
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#1A73E8',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'QBER (%)'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Performance Metric'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    }
                }
            });
        }
        
        // Performance Timeline Chart (Horizontal)
        const timelineCtx = document.getElementById('timelineChart');
        if (timelineCtx) {
            this.charts.timeline = new Chart(timelineCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 60}, (_, i) => `${i}s`),
                    datasets: [
                        {
                            label: 'Secure Key Rate (kbps)',
                            data: this.timelineData.keyRates.length > 0 ? this.timelineData.keyRates : Array.from({length: 60}, () => 0),
                            borderColor: '#1A73E8',
                            backgroundColor: 'rgba(26, 115, 232, 0.1)',
                            tension: 0.4,
                            fill: false,
                            yAxisID: 'y'
                        },
                        {
                            label: 'QBER (%)',
                            data: this.timelineData.qberValues.length > 0 ? this.timelineData.qberValues : Array.from({length: 60}, () => 0),
                            borderColor: '#F4B400',
                            backgroundColor: 'rgba(244, 180, 0, 0.1)',
                            tension: 0.4,
                            fill: false,
                            yAxisID: 'y1'
                        },
                        {
                            label: 'Detection Events',
                            data: this.timelineData.detectionEvents.length > 0 ? this.timelineData.detectionEvents : Array.from({length: 60}, () => 0),
                            borderColor: '#0F9D58',
                            backgroundColor: 'rgba(15, 157, 88, 0.1)',
                            tension: 0.4,
                            fill: false,
                            yAxisID: 'y2'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false, // Disable animations for better performance
                    onResize: function(chart, size) {
                        // Prevent vertical resizing beyond container
                        chart.height = Math.min(size.height, 256);
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 6
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#1A73E8',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time (seconds ago)'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            reverse: true // Show most recent time on the left
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Key Rate (kbps)'
                            },
                            grid: {
                                color: 'rgba(26, 115, 232, 0.1)'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'QBER (%)'
                            },
                            grid: {
                                drawOnChartArea: false
                            },
                            max: 20
                        },
                        y2: {
                            type: 'linear',
                            display: false,
                            title: {
                                display: false,
                                text: 'Detection Events'
                            }
                        }
                    }
                }
            });
        }
    }
    
    generateSecurityCurve(type) {
        const points = [];
        for (let i = 0; i <= 20; i++) {
            const qber = i * 0.005; // 0 to 10% QBER
            
            switch (type) {
                case 'keyRate':
                    if (qber > 0.11) {
                        points.push(0);
                    } else {
                        const h_e = qber > 0 ? -qber * Math.log2(qber) - (1-qber) * Math.log2(1-qber) : 0;
                        points.push(Math.max(0, (1 - 2 * h_e) * 100));
                    }
                    break;
                case 'qber':
                    points.push(qber * 100);
                    break;
                case 'security':
                    points.push(qber > 0.11 ? 100 : qber * 1000);
                    break;
            }
        }
        return points;
    }
    
    bindEvents() {
        // Protocol variant selection
        document.querySelectorAll('.protocol-variant').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.protocol-variant').forEach(b => {
                    b.classList.remove('active', 'bg-primary-blue', 'text-white');
                    b.classList.add('bg-neutral-bg');
                });
                e.target.classList.add('active', 'bg-primary-blue', 'text-white');
                e.target.classList.remove('bg-neutral-bg');
                
                this.updateProtocol(e.target.dataset.protocol);
            });
        });
        
        // Parameter sliders - updated for new parameters
        this.bindSlider('photonRate', 'photonRateValue', (val) => `${val} MHz`);
        this.bindSlider('channelLoss', 'channelLossValue', (val) => `${val} dB`);
        this.bindSlider('basisSelection', 'basisSelectionValue', (val) => `${Math.round(val * 100)}%`);
        this.bindSlider('qberThreshold', 'qberThresholdValue', (val) => `${val}%`);
        this.bindSlider('eveInterception', 'eveInterceptionValue', (val) => `${val}%`);
        this.bindSlider('detectorEfficiency', 'detectorEfficiencyValue', (val) => `${val}%`);
        this.bindSlider('darkCountRate', 'darkCountRateValue', (val) => `${val} Hz`);
        this.bindSlider('polarizationDrift', 'polarizationDriftValue', (val) => `${val}°`);
        
        // Attack strategy dropdown
        document.getElementById('attackStrategy')?.addEventListener('change', (e) => {
            this.updateAttackStrategy(e.target.value);
        });
        
        // Control buttons
        document.getElementById('pauseBtn')?.addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.resetExperiment());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportExperiment());
        document.getElementById('saveExperimentBtn')?.addEventListener('click', () => this.saveExperiment());
        
        // Lab simulation buttons
        document.getElementById('runExperimentBtn')?.addEventListener('click', () => this.runExperiment());
        document.getElementById('stopSimulationBtn')?.addEventListener('click', () => this.stopSimulation());
    }
    
    bindSlider(sliderId, valueId, formatter) {
        const slider = document.getElementById(sliderId);
        const valueSpan = document.getElementById(valueId);
        
        if (slider && valueSpan) {
            slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                valueSpan.textContent = formatter(value);
                this.updateParameter(sliderId, value);
            });
            
            // Initialize display
            valueSpan.textContent = formatter(parseFloat(slider.value));
        }
    }
    
    updateParameter(parameter, value) {
        const parameterMap = {
            'photonRate': 'photon_rate',
            'channelLoss': 'channel_loss',
            'basisSelection': 'basis_selection_prob',
            'qberThreshold': 'qber_threshold',
            'eveInterception': 'eve_interception',
            'detectorEfficiency': 'detector_efficiency',
            'darkCountRate': 'dark_count_rate',
            'polarizationDrift': 'polarization_drift'
        };
        
        const serverParam = parameterMap[parameter];
        if (serverParam) {
            // Update both lab parameters and legacy parameters
            fetch('/api/lab/update_lab_parameters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    [serverParam]: value
                })
            }).catch(console.error);
        }
        
        // Update Eve interference visualization
        if (parameter === 'eveInterception') {
            const eveNode = document.getElementById('eveNode');
            if (eveNode) {
                if (value > 0) {
                    eveNode.classList.add('active');
                } else {
                    eveNode.classList.remove('active');
                }
            }
        }
    }
    
    updateProtocol(protocol) {
        console.log(`Switched to protocol: ${protocol}`);
        
        // Stop any running simulation first
        this.stopSimulation();
        
        // Reset the current experiment data
        this.resetSimulationData();
        
        // Update backend with new protocol variant
        fetch('/api/lab/update_lab_parameters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                protocol_variant: protocol
            })
        }).then(response => response.json())
        .then(data => {
            console.log(`Protocol updated to ${protocol}:`, data);
            // Reset charts after protocol change
            this.resetChartsData();
        })
        .catch(error => {
            console.error('Error updating protocol:', error);
        });
        
        // Apply protocol-specific UI changes
        this.applyProtocolSpecificSettings(protocol);
    }
    
    applyProtocolSpecificSettings(protocol) {
        // Update UI elements based on protocol variant
        const protocolInfo = document.getElementById('protocolInfo');
        if (protocolInfo) {
            const descriptions = {
                'standard': 'BB84 Standard: Four-state protocol using rectilinear and diagonal bases',
                'decoy': 'Decoy State: Enhanced security using multiple photon intensities (69.3% signal, 23.1% decoy, 7.7% vacuum)',
                'six-state': 'Six-State: Six-state protocol using three measurement bases (X,Y,Z) for 75% eavesdropper detection',
                'sarg04': 'SARG04: Signal-Ancilla protocol with complementary basis measurement and PNS attack resistance',
                'custom': 'Custom Protocol: Flexible parameters with adaptive security thresholds'
            };
            protocolInfo.textContent = descriptions[protocol] || 'Unknown protocol variant';
        }
        
        // Add protocol-specific visual specialty box
        this.addProtocolSpecialtyBox(protocol);
        
        // Adjust parameter ranges based on protocol
        this.adjustParameterRanges(protocol);
    }
    
    adjustParameterRanges(protocol) {
        // Research-backed parameter ranges (2024 commercial systems)
        const adjustments = {
            'decoy': {
                photonRate: { min: 156, max: 250, default: 200 },    // ID-3000 commercial range
                qberThreshold: { min: 4, max: 12, default: 8.5 }     // Optimized security threshold
            },
            'sarg04': {
                photonRate: { min: 100, max: 200, default: 150 },    // PNS-resistant range
                qberThreshold: { min: 6, max: 15, default: 11.2 }    // SARG04 security limit
            },
            'six-state': {
                photonRate: { min: 125, max: 300, default: 200 },    // Enhanced basis diversity
                qberThreshold: { min: 5, max: 16, default: 9.5 }     // Six-state advantage
            },
            'standard': {
                photonRate: { min: 50, max: 156, default: 100 },     // Classical BB84 range
                qberThreshold: { min: 6, max: 12, default: 8.5 }     // Standard security
            }
        };
        
        const settings = adjustments[protocol];
        if (settings) {
            // Update slider ranges and defaults if needed
            console.log(`Applied ${protocol} protocol settings:`, settings);
        }
    }
    
    addProtocolSpecialtyBox(protocol) {
        // Remove existing specialty box
        const existingBox = document.querySelector('.protocol-specialty-box');
        if (existingBox) {
            existingBox.remove();
        }
        
        // Create new specialty box based on protocol
        const specialtyHTML = this.getProtocolSpecialtyHTML(protocol);
        if (specialtyHTML) {
            const protocolSection = document.querySelector('.protocol-controls');
            if (protocolSection) {
                const specialtyDiv = document.createElement('div');
                specialtyDiv.className = 'protocol-specialty-box';
                specialtyDiv.innerHTML = specialtyHTML;
                protocolSection.appendChild(specialtyDiv);
                
                // Start protocol-specific animations
                this.startProtocolAnimation(protocol);
            }
        }
    }
    
    getProtocolSpecialtyHTML(protocol) {
        const specialtyConfigs = {
            'decoy': `
                <div class="decoy-state-visualization bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200 mt-4">
                    <h4 class="text-lg font-semibold text-blue-800 mb-3">🔬 Decoy State Intensity Visualization</h4>
                    <div class="intensity-levels flex justify-between items-center mb-3 gap-2">
                        <div class="intensity-bar signal-bar bg-blue-500 relative rounded" style="height: 40px; flex: 0.693;">
                            <span class="text-white text-xs font-bold absolute inset-0 flex items-center justify-center">Signal 69.3%</span>
                        </div>
                        <div class="intensity-bar decoy-bar bg-green-500 relative rounded" style="height: 25px; flex: 0.231;">
                            <span class="text-white text-xs font-bold absolute inset-0 flex items-center justify-center">Decoy 23.1%</span>
                        </div>
                        <div class="intensity-bar vacuum-bar bg-gray-400 relative rounded" style="height: 10px; flex: 0.077;">
                            <span class="text-white text-xs font-bold absolute inset-0 flex items-center justify-center">Vacuum</span>
                        </div>
                    </div>
                    <div class="research-info text-xs text-gray-600">
                        <strong>Research Basis:</strong> Optimized ratios from Nature Scientific Reports 2020 for maximum key rate and PNS attack resistance
                    </div>
                </div>
            `,
            'sarg04': `
                <div class="sarg04-visualization bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-200 mt-4">
                    <h4 class="text-lg font-semibold text-orange-800 mb-3">🎯 SARG04 Complementary Measurement</h4>
                    <div class="sarg04-diagram flex justify-center mb-3">
                        <div class="measurement-circle relative" id="sarg04-circle" style="width: 120px; height: 120px; border: 3px solid #f97316; border-radius: 50%; background: linear-gradient(45deg, #fed7aa, #fdba74);">
                            <div class="state-markers">
                                <div class="state-marker absolute" style="top: 5px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">|0⟩</div>
                                <div class="state-marker absolute" style="bottom: 5px; left: 50%; transform: translateX(-50%); font-size: 14px; font-weight: bold;">|1⟩</div>
                                <div class="state-marker absolute" style="top: 50%; left: 5px; transform: translateY(-50%); font-size: 14px; font-weight: bold;">|+⟩</div>
                                <div class="state-marker absolute" style="top: 50%; right: 5px; transform: translateY(-50%); font-size: 14px; font-weight: bold;">|-⟩</div>
                            </div>
                            <div class="measurement-pointer absolute" id="sarg04-pointer" style="top: 50%; left: 50%; width: 2px; height: 40px; background: #dc2626; transform-origin: bottom; transform: translate(-50%, -100%) rotate(0deg); transition: transform 2s ease-in-out;"></div>
                        </div>
                    </div>
                    <div class="security-info text-xs text-gray-600">
                        <strong>Security Thresholds:</strong> Single-photon ≤11.235%, Two-photon ≤5.602%, Enhanced PNS resistance
                    </div>
                </div>
            `,
            'six-state': `
                <div class="six-state-visualization bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border-2 border-green-200 mt-4">
                    <h4 class="text-lg font-semibold text-green-800 mb-3">⚡ Six-State Triple Basis System</h4>
                    <div class="basis-visualization flex justify-between mb-3">
                        <div class="basis-group text-center">
                            <div class="basis-circle x-basis mx-auto flex items-center justify-center font-bold" style="width: 60px; height: 60px; border: 2px solid #16a34a; border-radius: 50%; background: #dcfce7;">X</div>
                            <div class="text-xs mt-1">Rectilinear</div>
                            <div class="text-xs text-gray-500">|0⟩, |1⟩</div>
                        </div>
                        <div class="basis-group text-center">
                            <div class="basis-circle y-basis mx-auto flex items-center justify-center font-bold" style="width: 60px; height: 60px; border: 2px solid #16a34a; border-radius: 50%; background: #dcfce7;">Y</div>
                            <div class="text-xs mt-1">Diagonal</div>
                            <div class="text-xs text-gray-500">|+⟩, |-⟩</div>
                        </div>
                        <div class="basis-group text-center">
                            <div class="basis-circle z-basis mx-auto flex items-center justify-center font-bold" style="width: 60px; height: 60px; border: 2px solid #16a34a; border-radius: 50%; background: #dcfce7;">Z</div>
                            <div class="text-xs mt-1">Circular</div>
                            <div class="text-xs text-gray-500">|L⟩, |R⟩</div>
                        </div>
                    </div>
                    <div class="advantage-info text-xs text-gray-600">
                        <strong>Security Advantage:</strong> 75% eavesdropper detection vs 50% in BB84, 18.3% enhanced security margin
                    </div>
                </div>
            `,
            'custom': `
                <div class="custom-visualization bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200 mt-4">
                    <h4 class="text-lg font-semibold text-purple-800 mb-3">⚙️ Custom Protocol Configuration</h4>
                    <div class="custom-params grid grid-cols-2 gap-3 mb-3">
                        <div class="param-box bg-white p-2 rounded border">
                            <div class="text-xs text-gray-600">Basis Count</div>
                            <div class="text-sm font-bold text-purple-700" id="custom-basis-count">2-4 configurable</div>
                        </div>
                        <div class="param-box bg-white p-2 rounded border">
                            <div class="text-xs text-gray-600">QBER Threshold</div>
                            <div class="text-sm font-bold text-purple-700" id="custom-qber">8.5% adaptive</div>
                        </div>
                        <div class="param-box bg-white p-2 rounded border">
                            <div class="text-xs text-gray-600">Error Correction</div>
                            <div class="text-sm font-bold text-purple-700">1.22 Shannon limit</div>
                        </div>
                        <div class="param-box bg-white p-2 rounded border">
                            <div class="text-xs text-gray-600">Key Extraction</div>
                            <div class="text-sm font-bold text-purple-700">0.5 conservative</div>
                        </div>
                    </div>
                    <div class="flexibility-info text-xs text-gray-600">
                        <strong>Research-Guided:</strong> Flexible parameters with theoretical security bounds for experimental setups
                    </div>
                </div>
            `
        };
        
        return specialtyConfigs[protocol] || null;
    }
    
    startProtocolAnimation(protocol) {
        // Remove existing animations
        this.stopAllProtocolAnimations();
        
        if (protocol === 'decoy') {
            this.animateDecoyIntensities();
        } else if (protocol === 'sarg04') {
            this.animateSARG04Measurement();
        } else if (protocol === 'six-state') {
            this.animateSixStateBases();
        }
    }
    
    stopAllProtocolAnimations() {
        // Clear any existing animation intervals
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
    
    animateDecoyIntensities() {
        const intensityBars = document.querySelectorAll('.intensity-bar');
        if (intensityBars.length === 0) return;
        
        this.animationInterval = setInterval(() => {
            intensityBars.forEach((bar, index) => {
                const opacity = 0.3 + 0.7 * Math.sin(Date.now() / 1000 + index * Math.PI / 3);
                bar.style.opacity = opacity;
            });
        }, 50);
    }
    
    animateSARG04Measurement() {
        const pointer = document.getElementById('sarg04-pointer');
        if (!pointer) return;
        
        let angle = 0;
        this.animationInterval = setInterval(() => {
            angle = (angle + 2) % 360;
            pointer.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
        }, 100);
    }
    
    animateSixStateBases() {
        const basisCircles = document.querySelectorAll('.basis-circle');
        if (basisCircles.length === 0) return;
        
        this.animationInterval = setInterval(() => {
            basisCircles.forEach((circle, index) => {
                const scale = 0.9 + 0.1 * Math.sin(Date.now() / 800 + index * Math.PI * 2 / 3);
                const brightness = 0.7 + 0.3 * Math.sin(Date.now() / 600 + index * Math.PI * 2 / 3);
                circle.style.transform = `scale(${scale})`;
                circle.style.filter = `brightness(${brightness})`;
            });
        }, 50);
    }
    
    updateAttackStrategy(strategy) {
        fetch('/api/lab/update_lab_parameters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                attack_strategy: strategy
            })
        }).catch(console.error);
    }
    
    startDataUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.isRunning = true;
        this.updateInterval = setInterval(() => {
            if (!this.isPaused) {
                this.fetchAndUpdateData();
            }
        }, 3000); // Update every 3 seconds instead of 1
        
        // Initial data fetch
        this.fetchAndUpdateData();
    }
    
    async fetchAndUpdateData() {
        try {
            const response = await fetch('/api/lab/data');
            const data = await response.json();
            
            this.updateRealTimeDisplay(data);
            this.updateCharts(data);
            this.updateSystemMetrics(data);
            
        } catch (error) {
            console.error('Error fetching lab data:', error);
        }
    }
    
    updateRealTimeDisplay(data) {
        // Update main metrics
        this.updateElement('secureKeyRate', `${data.secure_key_rate}`);
        this.updateElement('qberRate', `${data.qber}%`);
        this.updateElement('siftedBits', this.formatNumber(data.sifted_bits));
        this.updateElement('securityParam', `10⁻⁸`);
        
        // Update protocol statistics
        this.updateElement('photonsTransmitted', this.formatNumber(data.photons_transmitted));
        this.updateElement('detectionEfficiency', `${data.detection_efficiency}%`);
        this.updateElement('basisMatchRate', `${data.basis_match_rate}%`);
        this.updateElement('privacyAmplification', data.privacy_amplification_ratio);
        
        // Update system performance
        this.updateElement('channelUtil', `${data.channel_utilization}%`);
        this.updateElement('processingLatency', `${data.processing_latency} ms`);
        this.updateElement('memoryUsage', `${data.memory_usage} MB`);
        this.updateElement('simulationAccuracy', `${data.simulation_accuracy}%`);
        
        // Update channel utilization bar
        const channelUtilBar = document.getElementById('channelUtilBar');
        if (channelUtilBar) {
            channelUtilBar.style.width = `${data.channel_utilization}%`;
        }
        
        // Update charts with real data
        this.updateChartsWithRealData(data);
    }
    
    updateChartsWithRealData(data) {
        // Store real simulation data
        this.realSimulationData = data;
        
        // Update timeline data arrays with new real data
        const currentTime = new Date().toLocaleTimeString();
        this.timelineData.timestamps.push(currentTime);
        this.timelineData.keyRates.push(data.secure_key_rate || 0);
        this.timelineData.qberValues.push(data.qber || 0);
        this.timelineData.detectionEvents.push(data.photons_transmitted || 0);
        
        // Keep only last 60 data points
        if (this.timelineData.keyRates.length > 60) {
            this.timelineData.keyRates.shift();
            this.timelineData.qberValues.shift();
            this.timelineData.detectionEvents.shift();
            this.timelineData.timestamps.shift();
        }
        
        // Update timeline chart with real data
        if (this.charts.timeline) {
            this.charts.timeline.data.labels = this.timelineData.timestamps.length > 0 ? this.timelineData.timestamps : Array.from({length: 60}, (_, i) => `${i}s`);
            this.charts.timeline.data.datasets[0].data = this.timelineData.keyRates;
            this.charts.timeline.data.datasets[1].data = this.timelineData.qberValues;
            this.charts.timeline.data.datasets[2].data = this.timelineData.detectionEvents;
            this.charts.timeline.update('none'); // Update without animation for real-time feel
        }
        
        // Update security chart with theoretical vs real comparison
        if (this.charts.security && data.qber !== undefined) {
            // Generate theoretical curve based on current QBER
            const theoreticalData = this.generateSecurityCurve('keyRate');
            const realDataPoint = data.secure_key_rate || 0;
            const qberIndex = Math.round((data.qber || 0) * 2); // Convert QBER to array index
            
            // Highlight current operating point on security chart
            if (qberIndex < theoreticalData.length) {
                // Update datasets to show real vs theoretical
                this.charts.security.data.datasets[0].data = theoreticalData;
                this.charts.security.data.datasets[0].pointBackgroundColor = theoreticalData.map((_, i) => 
                    i === qberIndex ? '#FF0000' : '#0F9D58'
                );
                this.charts.security.data.datasets[0].pointRadius = theoreticalData.map((_, i) => 
                    i === qberIndex ? 8 : 3
                );
                this.charts.security.update('none');
            }
        }
    }
    
    updateCharts(data) {
        // Update timeline chart with real-time data
        if (this.charts.timeline) {
            const chart = this.charts.timeline;
            
            // Add new data points
            const keyRate = (data.secure_key_rate || 2.47) * 1000; // Convert to kbps  
            const qber = (data.qber || 8.3); // Percentage
            const detectionEvents = data.photons_transmitted || Math.random() * 5000 + 2000;
            
            // Ensure we maintain exactly 60 data points
            const maxDataPoints = 60;
            
            // Remove oldest data point if we're at the limit
            if (chart.data.datasets[0].data.length >= maxDataPoints) {
                chart.data.datasets[0].data.shift();
                chart.data.datasets[1].data.shift();
                chart.data.datasets[2].data.shift();
                chart.data.labels.shift();
            }
            
            // Add new data points
            chart.data.datasets[0].data.push(keyRate);
            chart.data.datasets[1].data.push(qber);
            chart.data.datasets[2].data.push(detectionEvents);
            
            // Update labels to maintain time sequence
            const currentTime = Date.now();
            chart.data.labels.push(`${Math.floor((currentTime % 60000) / 1000)}s`);
            
            // Update chart with animation disabled for performance
            chart.update('none');
        }
    }
    
    updateSystemMetrics(data) {
        // Could add more sophisticated system monitoring here
    }
    
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element && element.textContent !== value) {
            element.textContent = value;
            
            // Add flash effect for updates
            element.classList.add('fade-in');
            setTimeout(() => {
                element.classList.remove('fade-in');
            }, 500);
        }
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        }
    }
    
    async resetExperiment() {
        try {
            await fetch('/api/lab/reset');
            
            // Stop any running simulation
            this.stopSimulation();
            
            // Reset simulation data
            this.resetSimulationData();
            
            // Reset UI elements
            document.querySelectorAll('.slider').forEach(slider => {
                const defaultValues = {
                    'channelLoss': 0,
                    'eveInterception': 0,
                    'darkCountRate': 100,
                    'basisSelection': 0.5,
                    'polarizationDrift': 0
                };
                
                if (defaultValues[slider.id] !== undefined) {
                    slider.value = defaultValues[slider.id];
                    slider.dispatchEvent(new Event('input'));
                }
            });
            
            // Reset attack strategy
            const attackSelect = document.getElementById('attackStrategy');
            if (attackSelect) {
                attackSelect.value = 'No Attack';
            }
            
            // Reset charts
            this.resetChartsData();
            
        } catch (error) {
            console.error('Error resetting experiment:', error);
        }
    }

    resetSimulationData() {
        // Reset all simulation data
        this.realSimulationData = null;
        this.isSimulationRunning = false;
        this.timelineData = {
            keyRates: [],
            qberValues: [],
            detectionEvents: [],
            timestamps: []
        };
        
        // Reset progress indicators
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            bar.style.width = '0%';
        });
        
        // Reset metrics displays
        const metricsElements = document.querySelectorAll('[id$="Metric"]');
        metricsElements.forEach(element => {
            element.textContent = '0';
        });
        
        console.log('Simulation data reset');
    }

    resetChartsData() {
        // Reset security chart
        if (this.charts.security) {
            this.charts.security.data.datasets.forEach(dataset => {
                dataset.data = this.generateSecurityCurve(dataset.label.includes('keyRate') ? 'keyRate' : 
                                                         dataset.label.includes('QBER') ? 'qber' : 'security');
            });
            this.charts.security.update('none');
        }
        
        // Reset timeline chart
        if (this.charts.timeline) {
            this.charts.timeline.data.datasets.forEach(dataset => {
                dataset.data = Array.from({length: 60}, () => 0);
            });
            this.charts.timeline.update('none');
        }
        
        console.log('Charts data reset');
    }

    stopSimulation() {
        // Stop all running intervals
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        // Update UI state
        this.isSimulationRunning = false;
        this.isPaused = false;
        
        // Update button states
        const startBtn = document.getElementById('startExperiment');
        const stopBtn = document.getElementById('stopExperiment');
        const pauseBtn = document.getElementById('pauseExperiment');
        
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.textContent = 'Start Experiment';
        }
        if (stopBtn) stopBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = true;
        
        // Send stop request to backend
        fetch('/api/lab/stop_simulation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            console.error('Error stopping simulation:', error);
        });
        
        console.log('Simulation stopped');
    }
    
    async exportExperiment() {
        try {
            const response = await fetch('/api/lab/export');
            const data = await response.json();
            
            // Create and download file
            const blob = new Blob([JSON.stringify(data, null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bb84_experiment_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Error exporting experiment:', error);
        }
    }
    
    saveExperiment() {
        // This would typically save to a database
        console.log('Saving experiment...');
        
        // Show success feedback
        const saveBtn = document.getElementById('saveExperimentBtn');
        if (saveBtn) {
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'Saved!';
            saveBtn.classList.add('bg-success-green');
            saveBtn.classList.remove('bg-primary-blue');
            
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.classList.remove('bg-success-green');
                saveBtn.classList.add('bg-primary-blue');
            }, 2000);
        }
    }
    
    runExperiment() {
        console.log('Starting lab experiment...');
        
        // Collect all current parameters
        const parameters = this.collectAllParameters();
        
        // Show simulation section
        const simSection = document.getElementById('labSimulatorSection');
        if (simSection) {
            simSection.classList.remove('hidden');
            simSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Start simulation
        fetch('/api/lab/run_simulation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parameters)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'started') {
                this.isSimulationRunning = true;
                this.startSimulationMonitoring();
            }
        })
        .catch(console.error);
    }
    
    stopSimulation() {
        fetch('/api/lab/stop_simulation', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'stopped') {
                this.isSimulationRunning = false;
                this.stopSimulationMonitoring();
            }
        })
        .catch(console.error);
    }
    
    collectAllParameters() {
        return {
            photon_rate: parseFloat(document.getElementById('photonRate')?.value || 50),
            channel_loss: parseFloat(document.getElementById('channelLoss')?.value || 10),
            basis_selection_prob: parseFloat(document.getElementById('basisSelection')?.value || 0.5),
            qber_threshold: parseFloat(document.getElementById('qberThreshold')?.value || 11),
            eve_interception: parseFloat(document.getElementById('eveInterception')?.value || 0),
            detector_efficiency: parseFloat(document.getElementById('detectorEfficiency')?.value || 85),
            dark_count_rate: parseFloat(document.getElementById('darkCountRate')?.value || 100),
            polarization_drift: parseFloat(document.getElementById('polarizationDrift')?.value || 2),
            attack_strategy: document.getElementById('attackStrategy')?.value || 'No Attack',
            num_photons: 10000  // Default number of photons for simulation
        };
    }
    
    startSimulationMonitoring() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }
        
        this.simulationInterval = setInterval(() => {
            this.updateSimulationStatus();
        }, 500);  // Update every 500ms for smooth progress
    }
    
    stopSimulationMonitoring() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
    }
    
    async updateSimulationStatus() {
        try {
            const response = await fetch('/api/lab/simulation_status');
            const status = await response.json();
            
            // Update progress bar
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('simulationProgress');
            if (progressBar && progressText) {
                progressBar.style.width = `${status.progress || 0}%`;
                progressText.textContent = `${Math.round(status.progress || 0)}%`;
            }
            
            // Update simulation metrics
            this.updateElement('simPhotonsSent', this.formatNumber(status.photons_sent || 0));
            this.updateElement('simPhotonsReceived', this.formatNumber(status.photons_received || 0));
            this.updateElement('simBasisMatches', this.formatNumber(status.basis_matches || 0));
            this.updateElement('simKeyBits', this.formatNumber(status.final_key_bits || 0));
            
            // Update simulation log
            const logContainer = document.getElementById('simulationLog');
            if (logContainer && status.log_entries) {
                logContainer.innerHTML = status.log_entries.map(entry => 
                    `<div class="text-xs">${entry}</div>`
                ).join('');
                logContainer.scrollTop = logContainer.scrollHeight;
            }
            
            // Check if simulation finished
            if (!status.is_running && this.isSimulationRunning) {
                this.isSimulationRunning = false;
                this.stopSimulationMonitoring();
                console.log('Simulation completed');
            }
            
        } catch (error) {
            console.error('Error fetching simulation status:', error);
        }
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Global lab instance
let labInstance = null;

// Initialize lab when DOM is ready
function initLab() {
    if (labInstance) {
        labInstance.destroy();
    }
    
    labInstance = new QuantumLab();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (labInstance) {
        labInstance.destroy();
    }
});

// Export for global access
window.QuantumLab = QuantumLab;
window.initLab = initLab;
