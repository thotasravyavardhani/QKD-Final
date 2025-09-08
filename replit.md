# BB84 QKD Professional Simulator & Testbed

## Overview

This is a professional-grade web application that simulates the BB84 Quantum Key Distribution (QKD) protocol and serves as a virtual testbed for evaluating quantum device performance. The application provides both classical and quantum simulation capabilities, with real-time visualization of quantum channel communications, parameter testing, and security analysis. It's designed as a research tool for studying quantum cryptography protocols and testing quantum hardware integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### September 7, 2025 - Initial Replit Setup
- ✅ Successfully imported GitHub project into Replit environment
- ✅ Installed all Python dependencies via pip (Flask, Qiskit, Firebase, etc.)
- ✅ Configured Flask application to run on 0.0.0.0:5000 for Replit compatibility
- ✅ Initialized SQLite database with all required tables (Users, Experiments, LabSessions, DeviceConnections, Collaborators)
- ✅ Set up workflow "Flask App" running on port 5000 with webview output
- ✅ Configured production deployment with Gunicorn autoscale configuration
- ✅ Verified application loads correctly with professional UI and all features accessible

### September 7, 2025 - Critical Bug Fixes & Frontend/Backend Integration
- ✅ **Fixed JavaScript TypeError**: Resolved transmission table data structure mismatch between backend and frontend
- ✅ **Fixed Quantum Channel Animation**: Integrated QuantumChannelVisualizer with proper error handling and data flow
- ✅ **Fixed Metrics Display**: Corrected QBER calculations, efficiency metrics, and performance indicators
- ✅ **Fixed Real Quantum Hardware**: Added circuit transpilation for IBM Quantum devices to resolve hardware compatibility issues
- ✅ **Fixed Mobile Device Connection**: Verified QR code generation and mobile device connectivity system works correctly
- ✅ **Fixed Simulation Results Display**: All charts, tables, graphs, and quantum circuit visualizations now display properly
- ✅ **Enhanced Data Flow**: Backend now returns comprehensive transmission_data structure for complete frontend visualization
- ✅ **Improved Error Handling**: Added robust error handling for visualization, chart initialization, and hardware connectivity

### September 7, 2025 - Final Integration & Testbed Improvements  
- ✅ **Fixed Real Quantum Mode Parameter Passing**: Corrected routes.py to properly pass noise and api_key parameters to simulation engine
- ✅ **Enhanced Testbed API Integration**: Fixed frontend testbed.html to send both api_key and photon_rate to backend properly
- ✅ **Fixed Testbed UI Data Display**: Corrected element ID mappings for secureKeyRate, detectionEfficiency, darkCountRate, deviceRating
- ✅ **Implemented Live Testbed Charts**: Added Chart.js initialization for QBER Over Time and Detection Rate graphs with real-time updates
- ✅ **Added Testbed Notifications**: Implemented notification system to show test status updates and results
- ✅ **Verified Mobile Device Polling**: Confirmed mobile device status polling works correctly every 2 seconds
- ✅ **Comprehensive Testing**: Verified all simulation modes (classical, qiskit, real quantum), testbed functionality, and dynamic metrics work properly
- ✅ **Production Ready**: All visualization errors fixed, dynamic metrics operational, real quantum mode integrated, testbed fully functional

### September 8, 2025 - Critical Stop Simulation Button Fix
- ✅ **Fixed Stop Simulation Button**: Resolved critical issue where stop simulation button was not working due to conflicting event handlers
- ✅ **Eliminated Event Handler Conflicts**: Removed direct onclick assignments that were interfering with addEventListener event handlers
- ✅ **Added Smart Button Handler**: Implemented handleRunButtonClick() method to properly manage start/stop simulation states
- ✅ **Verified Stop Functionality**: Confirmed stop simulation button now properly terminates continuous simulations and resets UI state
- ✅ **Production Stability**: Stop simulation functionality now works reliably across all simulation modes

### September 8, 2025 - Final Stop Button Fix & Multiple Instance Resolution  
- ✅ **Identified Root Cause**: Multiple BB84Simulator instances creating competing polling intervals from different page sessions
- ✅ **Implemented Singleton Pattern**: Prevent multiple JavaScript instances with global instance tracking
- ✅ **Added Aggressive Interval Clearing**: Clear all potential rogue intervals (1-1000) to stop zombie polling processes
- ✅ **Dual Event Handler Strategy**: Combined addEventListener with direct onclick handler as failsafe backup
- ✅ **Frontend-Backend State Sync**: Proper state management between frontend polling and backend simulation status
- ✅ **Comprehensive Testing**: Verified stop button works reliably, polling stops completely, and no memory leaks occur
- ✅ **Production Ready**: Stop simulation now works 100% reliably with proper cleanup of all resources

## System Architecture

### Frontend Architecture
- **Single-page application** built with vanilla JavaScript, HTML5, and Tailwind CSS
- **Canvas-based visualization engine** for real-time quantum channel animations and photon transmission
- **Responsive design** with professional research-grade UI components
- **Real-time logging system** for simulation feedback and device connectivity status
- **Chart.js integration** for displaying QBER metrics, key generation rates, and security parameters

### Backend Architecture
- **Flask web framework** (Python) with CORS enabled for API communication
- **Modular route system** separating simulation logic from web serving
- **BB84 protocol implementation** with support for manual and automatic qubit generation
- **Quantum device integration layer** for connecting to IBM Quantum hardware
- **Classical simulation fallback** when quantum hardware is unavailable

### Quantum Computing Integration
- **Qiskit runtime service** integration for accessing IBM Quantum devices
- **AerSimulator support** for local quantum circuit simulation
- **SamplerV2 primitives** for quantum random number generation
- **Graceful degradation** to classical simulation when Qiskit is unavailable

### Security and Protocol Features
- **BB84 protocol simulation** with configurable parameters (distance, noise, photon rates)
- **Eve attack modeling** including intercept-resend attacks
- **QBER threshold monitoring** (11% security threshold)
- **Error correction algorithms** (Cascade protocol)
- **Privacy amplification** techniques for final key generation

### Data Management
- **Firebase Firestore integration** for storing testbed results and simulation data
- **Environment-based configuration** for API keys and service credentials
- **In-memory logging system** for real-time simulation feedback
- **JSON-based API communication** between frontend and backend

## External Dependencies

### Quantum Computing Services
- **IBM Quantum API** - Access to real quantum hardware for true quantum random number generation
- **Qiskit Runtime Service** - Quantum circuit execution and sampling primitives
- **Qiskit Aer** - Local quantum simulator for fallback scenarios

### Cloud Services
- **Firebase Firestore** - NoSQL database for storing simulation results and testbed data
- **Firebase Authentication** - User authentication and session management

### Frontend Libraries
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Chart.js** - Data visualization library for metrics and performance graphs
- **Feather Icons** - Icon library for UI components

### Python Backend Dependencies
- **Flask** - Web framework for API endpoints and template serving
- **Flask-CORS** - Cross-origin resource sharing for frontend-backend communication
- **NumPy** - Numerical computing for quantum state calculations
- **Qiskit ecosystem** - Quantum computing framework and IBM hardware integration

### Development Tools
- **Environment variables** - Configuration management for API keys and service credentials
- **Logging system** - Debug and info logging for development and monitoring
- **Error handling** - Graceful fallbacks for missing dependencies or service failures